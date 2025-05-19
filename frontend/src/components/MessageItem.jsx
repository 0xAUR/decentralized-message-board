import React, { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { formatAddress, formatDate } from '../utils/helpers';
import { useWeb3 } from '../context/Web3Context';

const MessageItem = ({ message }) => {
  const { id, sender, text, timestamp, likes } = message;
  const { account, hasLikedMessage, likeMessage } = useWeb3();
  
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [error, setError] = useState(null);
  
  // Check if the current user has liked this message
  useEffect(() => {
    if (!account) return;
    
    const checkLikeStatus = async () => {
      try {
        const liked = await hasLikedMessage(id);
        setIsLiked(liked);
      } catch (err) {
        console.error('Error checking like status:', err);
      }
    };
    
    checkLikeStatus();
  }, [id, account, hasLikedMessage]);
  
  // Handle like button click
  const handleLike = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (isLiked) {
      setError('You have already liked this message');
      return;
    }
    
    if (sender.toLowerCase() === account.toLowerCase()) {
      setError('You cannot like your own message');
      return;
    }
    
    setIsLiking(true);
    setError(null);
    
    try {
      await likeMessage(id);
      setIsLiked(true);
    } catch (err) {
      console.error('Error liking message:', err);
      setError(err.message || 'Error liking message');
    } finally {
      setIsLiking(false);
    }
  };

  // Parse links in message text
  const renderMessageText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 hover:underline break-words"
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };
  
  return (
    <div className="card hover:shadow-indigo-100/20 dark:hover:shadow-indigo-900/20 border-l-4 border-l-indigo-100 dark:border-l-indigo-700 hover:border-l-indigo-500 dark:hover:border-l-indigo-500 transition-all duration-200 dark:bg-slate-800 dark:border-slate-700">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
            {sender.substring(2, 4).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-indigo-600 dark:text-indigo-400">
              {formatAddress(sender)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {formatDate(timestamp)}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="inline-flex items-center space-x-1 text-xs bg-indigo-50 dark:bg-indigo-900/30 py-1 px-2 rounded-full text-indigo-600 dark:text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{formatDate(timestamp, 'time')}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
        {renderMessageText(text)}
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handleLike}
          disabled={isLiking || !account || isLiked}
          className={`flex items-center text-sm px-3 py-1.5 rounded-full transition-all duration-200 ${
            isLiked
              ? 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800'
              : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 border border-slate-100 dark:border-slate-600 hover:border-pink-200 dark:hover:border-pink-800'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLiking ? (
            <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isLiked ? (
            <HeartIconSolid className="h-4 w-4 mr-1 text-pink-600 dark:text-pink-400" />
          ) : (
            <HeartIcon className="h-4 w-4 mr-1" />
          )}
          {likes} {likes === 1 ? 'Like' : 'Likes'}
        </button>
        
        {error && (
          <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/30 py-1 px-2 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
