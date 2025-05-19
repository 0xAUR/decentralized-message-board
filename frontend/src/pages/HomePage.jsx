import React from 'react';
import MessageForm from '../components/MessageForm';
import MessageList from '../components/MessageList';
import { useWeb3 } from '../context/Web3Context';

const HomePage = () => {
  const { connectionError } = useWeb3();
  
  return (
    <div>
      {connectionError && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 transition-colors duration-300">
          <p className="font-medium">Connection Error</p>
          <p className="text-sm">{connectionError}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <MessageForm />
          
          <div className="mt-6 card dark:bg-slate-800 dark:border-slate-700 transition-colors duration-300">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">About This App</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              This is a decentralized message board running on the Ethereum blockchain.
              All messages are stored on-chain and are permanent.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              To post a message, you'll need:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-3">
              <li>MetaMask wallet</li>
              <li>Some testnet ETH for gas fees</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300">
              You can like other people's messages, but you can only post once per hour
              to prevent spam.
            </p>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <MessageList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
