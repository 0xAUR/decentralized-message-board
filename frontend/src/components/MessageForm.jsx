import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

const MessageForm = () => {
  const { account, postMessage } = useWeb3();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }
    
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setTxHash(null);
    
    try {
      const hash = await postMessage(message.trim());
      setTxHash(hash);
      setMessage('');
      
      // Add a small delay before allowing another submission
      // to prevent accidental double submissions
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    } catch (err) {
      console.error('Error posting message:', err);
      
      // Format user-friendly error messages
      if (err.message.includes('Please wait before posting again')) {
        setError('You can only post once per hour. Please wait before posting again.');
      } else {
        setError(err.message || 'Error posting message');
      }
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="card border-t-4 border-t-indigo-500 dark:bg-slate-800 dark:border-slate-700 transition-colors duration-300">
      <div className="flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Post a Message</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's on your mind? Share a message on the blockchain..."
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 focus:bg-white dark:focus:bg-slate-700 focus:border-indigo-300 dark:focus:border-indigo-500 transition-all duration-200 min-h-[120px] placeholder:text-slate-400 dark:placeholder:text-slate-500"
              disabled={isSubmitting || !account}
              maxLength={500}
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-400 dark:text-slate-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm py-1 px-2 rounded-md">
              {message.length}/500
            </div>
          </div>
        </div>
        
        {!account && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg text-sm flex items-center border border-amber-100 dark:border-amber-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Please connect your wallet to post a message</span>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded-lg text-sm flex items-center border border-rose-100 dark:border-rose-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {txHash && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm flex items-center border border-emerald-100 dark:border-emerald-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>
              Message posted successfully!{' '}
              <a 
                href={`https://sepolia.etherscan.io/tx/${txHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline"
              >
                View on Etherscan
              </a>
            </span>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting || !account}
          className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg shadow-sm hover:shadow-md hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/10 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Publishing to Blockchain...
            </div>
          ) : 'Post Message'}
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
