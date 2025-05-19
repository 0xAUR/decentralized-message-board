import React, { createContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import MessageBoardABI from '../utils/MessageBoardABI.json';

// Contract address from environment variables
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
const NETWORK = import.meta.env.VITE_NETWORK || 'localhost';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [ensName, setEnsName] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [networkName, setNetworkName] = useState(NETWORK);

  // Initialize provider
  useEffect(() => {
    const initProvider = async () => {
      try {
        let web3Provider;
        
        if (NETWORK === 'localhost') {
          // Connect to local hardhat node
          web3Provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
          setProvider(web3Provider);
          
          const network = await web3Provider.getNetwork();
          setChainId(network.chainId);
          setNetworkName('Localhost (Hardhat)');
        } else if (window.ethereum) {
          // Connect using MetaMask
          web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(web3Provider);
          
          const network = await web3Provider.getNetwork();
          setChainId(network.chainId);
          
          // Set network name based on chain ID
          const networkNames = {
            1: 'Ethereum Mainnet',
            11155111: 'Sepolia Testnet',
            80001: 'Mumbai Testnet',
          };
          setNetworkName(networkNames[network.chainId] || `Chain ID: ${network.chainId}`);

          // Handle chain changes
          window.ethereum.on('chainChanged', (newChainId) => {
            window.location.reload();
          });
        } else {
          setConnectionError('Please install MetaMask to use this application');
        }
      } catch (error) {
        console.error('Error initializing provider:', error);
        setConnectionError('Error connecting to Ethereum network');
      }
    };

    initProvider();

    // Cleanup listeners on unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  // Initialize contract when provider is available
  useEffect(() => {
    if (provider && CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
      try {
        const messageBoardContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          MessageBoardABI.abi || MessageBoardABI, // Handle both formats: {abi: [...]} or direct array
          provider
        );
        setContract(messageBoardContract);
      } catch (error) {
        console.error('Error initializing contract:', error);
        setConnectionError('Error connecting to smart contract');
      }
    }
  }, [provider]);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!provider) return;
    
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      let account;
      let signer;
      
      if (NETWORK === 'localhost') {
        const accounts = await provider.listAccounts();
        account = accounts[0];
        setAccount(account);
        
        // Get signer from the provider for the first account
        signer = provider.getSigner(0);
        setSigner(signer);
      } else if (window.ethereum) {
        // For testnets/mainnet, request account access via MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        account = accounts[0];
        setAccount(account);
        
        // Get signer from MetaMask
        signer = provider.getSigner();
        setSigner(signer);
        
        // Try to get ENS name if on mainnet or if provider supports ENS
        try {
          const ensName = await provider.lookupAddress(account);
          if (ensName) {
            setEnsName(ensName);
          }
        } catch (error) {
          console.warn('ENS lookup failed, probably not on mainnet', error);
        }
      }
      
      // Re-create contract with signer for write operations
      if (contract && signer) {
        const contractWithSigner = contract.connect(signer);
        setContract(contractWithSigner);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setConnectionError(error.message || 'Error connecting wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [provider, contract]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setEnsName(null);
    setSigner(null);
  }, []);

  // Fetch messages from the contract
  const fetchMessages = useCallback(async () => {
    if (!contract) return;

    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const allMessages = await contract.getAllMessages();
      
      // Transform contract data for UI
      const formattedMessages = allMessages.map((msg, index) => ({
        id: index,
        sender: msg.sender,
        text: msg.text,
        timestamp: new Date(msg.timestamp.toNumber() * 1000),
        likes: msg.likes.toNumber()
      }));
      
      // Sort by timestamp descending (newest first)
      formattedMessages.sort((a, b) => b.timestamp - a.timestamp);
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [contract, isLoading]);

  // Post a new message
  const postMessage = useCallback(async (text) => {
    if (!contract || !signer) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Handle potential rate limit error before sending transaction
      if (account) {
        try {
          const lastPostTime = await contract.lastPostTime(account);
          const cooldown = await contract.POST_COOLDOWN();
          const currentTime = Math.floor(Date.now() / 1000);
          
          if (lastPostTime > 0 && currentTime < lastPostTime.toNumber() + cooldown.toNumber()) {
            const waitTimeMinutes = Math.ceil((lastPostTime.toNumber() + cooldown.toNumber() - currentTime) / 60);
            throw new Error(`Please wait about ${waitTimeMinutes} minutes before posting again`);
          }
        } catch (error) {
          // If this check itself fails, continue with the transaction
          if (error.message.includes('wait')) {
            throw error;
          }
          console.warn('Could not check rate limit:', error);
        }
      }
      
      const tx = await contract.postMessage(text);
      await tx.wait();
      
      // Re-fetch messages to get updates
      await fetchMessages();
      return tx.hash;
    } catch (error) {
      console.error('Error posting message:', error);
      // Format error message for user
      if (error.reason) {
        throw new Error(error.reason);
      } else if (error.message.includes('user rejected transaction')) {
        throw new Error('Transaction was rejected');
      } else {
        throw error;
      }
    }
  }, [contract, signer, fetchMessages, account]);

  // Like a message
  const likeMessage = useCallback(async (messageId) => {
    if (!contract || !signer) {
      throw new Error('Wallet not connected');
    }
    
    try {
      const tx = await contract.likeMessage(messageId);
      await tx.wait();
      
      // Re-fetch messages to get updates
      await fetchMessages();
      return tx.hash;
    } catch (error) {
      throw error;
    }
  }, [contract, signer, fetchMessages]);

  // Check if user has liked a message
  const hasLikedMessage = useCallback(async (messageId) => {
    if (!contract || !account) return false;
    
    try {
      return await contract.hasUserLikedMessage(account, messageId);
    } catch (error) {
      console.error('Error checking like status:', error);
      return false;
    }
  }, [contract, account]);

  // Listen for contract events
  useEffect(() => {
    if (!contract) return;
    
    // Create a debounced fetch function to avoid multiple fetches
    // when events come in close together
    let fetchTimeout = null;
    const debouncedFetch = () => {
      if (fetchTimeout) clearTimeout(fetchTimeout);
      fetchTimeout = setTimeout(() => {
        fetchMessages();
        fetchTimeout = null;
      }, 1000);
    };
    
    // Listen for new messages
    const messagePostedFilter = contract.filters.MessagePosted();
    const messageLikedFilter = contract.filters.MessageLiked();
    
    const handleMessagePosted = (...args) => {
      debouncedFetch();
    };
    
    const handleMessageLiked = (...args) => {
      debouncedFetch();
    };
    
    contract.on(messagePostedFilter, handleMessagePosted);
    contract.on(messageLikedFilter, handleMessageLiked);
    
    // Initial fetch
    fetchMessages();
    
    return () => {
      // Clean up event listeners and clear any pending fetches
      if (fetchTimeout) clearTimeout(fetchTimeout);
      contract.off(messagePostedFilter, handleMessagePosted);
      contract.off(messageLikedFilter, handleMessageLiked);
    };
  }, [contract, fetchMessages]);

  // Auto-connect if previously connected or using localhost
  useEffect(() => {
    const autoConnect = async () => {
      if (NETWORK === 'localhost' && provider) {
        // For localhost, automatically connect with the first Hardhat account
        connectWallet();
      } else if (window.ethereum && window.ethereum.isConnected && provider) {
        try {
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            connectWallet();
          }
        } catch (error) {
          console.warn('Auto-connect failed:', error);
        }
      }
    };
    
    autoConnect();
  }, [provider, connectWallet]);

  const contextValue = {
    account,
    ensName,
    provider,
    signer,
    contract,
    chainId,
    networkName,
    isConnecting,
    connectionError,
    messages,
    isLoading,
    connectWallet,
    disconnectWallet,
    fetchMessages,
    postMessage,
    likeMessage,
    hasLikedMessage,
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook to use the Web3 context
export const useWeb3 = () => {
  const context = React.useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
