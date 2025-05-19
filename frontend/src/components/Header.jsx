import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { formatAddress } from '../utils/helpers';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { 
    account, 
    ensName, 
    isConnecting, 
    connectWallet, 
    disconnectWallet,
    chainId,
    networkName
  } = useWeb3();

  // Network names based on chain ID
  const getNetworkName = (chainId) => {
    if (networkName) return networkName;
    
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 11155111:
        return 'Sepolia Testnet';
      case 80001:
        return 'Mumbai Testnet';
      case 31337:
        return 'Localhost (Hardhat)';
      default:
        return 'Unknown Network';
    }
  };

  return (
    <header className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-lg dark:from-indigo-900 dark:to-purple-900 transition-all duration-300">
      <div className="container mx-auto px-4 py-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold tracking-tight flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <span>DecentBoard</span>
            </Link>
            {(chainId || networkName) && (
              <span className="text-xs bg-white/20 py-1 px-3 rounded-full backdrop-blur-sm">
                {getNetworkName(chainId)}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            {!account ? (
              <button 
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-white text-indigo-700 hover:bg-indigo-50 font-medium py-2 px-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md flex items-center"
              >
                {isConnecting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    Connect Wallet
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="bg-white/10 backdrop-blur-sm py-2 px-4 rounded-lg text-sm border border-white/20">
                  {ensName || formatAddress(account)}
                </div>
                <button 
                  onClick={disconnectWallet}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm py-2 px-3 rounded-lg text-sm transition-all duration-200"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
