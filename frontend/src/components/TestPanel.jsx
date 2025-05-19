import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { 
  testWalletConnection,
  testMessageFetching,
  formatMessagesForTest,
  testPostMessage,
  isMobileDevice
} from '../utils/testHelpers';

/**
 * A temporary testing panel for blockchain connection verification 
 * This component should only be used during development
 */
const TestPanel = () => {
  const {
    account,
    connectWallet,
    fetchMessages,
    postMessage,
    messages,
    networkName
  } = useWeb3();
  
  const [isOpen, setIsOpen] = useState(false);
  const [testResults, setTestResults] = useState({
    walletConnection: null,
    messageFetching: null,
    messagePosting: null,
    responsiveCheck: { success: true, message: `Device type: ${isMobileDevice() ? 'Mobile' : 'Desktop'}` }
  });
  
  const toggle = () => setIsOpen(!isOpen);
  
  const runAllTests = async () => {
    // Reset results
    setTestResults({
      walletConnection: null,
      messageFetching: null,
      messagePosting: null,
      responsiveCheck: { success: true, message: `Device type: ${isMobileDevice() ? 'Mobile' : 'Desktop'}` }
    });
    
    // Run tests sequentially
    const walletSuccess = await testWalletConnection(connectWallet, setTestResults);
    if (walletSuccess) {
      await testMessageFetching(fetchMessages, setTestResults);
      
      // Only try posting if wallet is connected and we've fetched messages
      if (account) {
        await testPostMessage(postMessage, setTestResults);
      }
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={toggle}
          className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-mono py-1 px-2 rounded shadow-lg flex items-center"
        >
          <span className="mr-1">🧪</span> Test UI
        </button>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-5 right-5 w-80 bg-gray-800 text-white p-4 rounded-lg shadow-2xl z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-mono font-bold">UI Test Panel</h3>
        <button onClick={toggle} className="text-xs text-white hover:text-gray-300">
          ✕
        </button>
      </div>
      
      <div className="bg-gray-700 p-2 rounded mb-3 text-xs font-mono">
        <p>Network: {networkName || 'Not connected'}</p>
        <p>Account: {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Not connected'}</p>
        <p>Messages: {messages ? messages.length : 0}</p>
      </div>
      
      <div className="space-y-2 text-xs mb-3">
        {Object.entries(testResults).map(([key, result]) => (
          result && (
            <div 
              key={key} 
              className={`p-2 rounded ${result.success ? 'bg-green-900/50' : 'bg-red-900/50'}`}
            >
              <p className="font-bold">{key}:</p>
              <p className="whitespace-normal break-words">{result.message}</p>
            </div>
          )
        ))}
      </div>
      
      {messages && messages.length > 0 && (
        <div className="mb-3 bg-gray-700 p-2 rounded text-xs font-mono max-h-40 overflow-y-auto">
          <p className="font-bold mb-1">Recent Messages:</p>
          <pre className="whitespace-pre-wrap">{formatMessagesForTest(messages)}</pre>
        </div>
      )}
      
      <button
        onClick={runAllTests}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-2 rounded text-xs"
      >
        Run All Tests
      </button>
    </div>
  );
};

export default TestPanel;
