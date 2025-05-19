import React, { useState, useEffect } from 'react';
import MessageItem from './MessageItem';
import { useWeb3 } from '../context/Web3Context';

const MessageList = () => {
  const { messages, isLoading, fetchMessages } = useWeb3();
  const [displayLoading, setDisplayLoading] = useState(false);
  
  // Use a delayed loading state to prevent flickering
  useEffect(() => {
    let loadingTimeout;
    
    if (isLoading) {
      // Only show loading if it's taking more than 500ms
      loadingTimeout = setTimeout(() => {
        setDisplayLoading(true);
      }, 500);
    } else {
      setDisplayLoading(false);
    }
    
    return () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
    };
  }, [isLoading]);
  
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm rounded-xl p-6 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Recent Messages</h2>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 py-1.5 px-3 rounded-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Refresh
        </button>
      </div>
      
      {displayLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400 mb-2"></div>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Loading messages from blockchain...</p>
        </div>
      ) : messages.length > 0 ? (
        <div className="space-y-6">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-400 dark:text-slate-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-slate-600 dark:text-slate-300 font-medium">No messages yet</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Be the first to post on the blockchain!</p>
        </div>
      )}
    </div>
  );
};

export default MessageList;
