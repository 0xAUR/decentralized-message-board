/**
 * Utility functions for testing blockchain connections and interactions
 */

/**
 * Helper function to test wallet connection
 * @param {function} connectWallet - The wallet connection function from Web3Context
 * @param {function} setTestResults - Function to set test results
 * @returns {Promise<boolean>} - True if connection was successful
 */
export const testWalletConnection = async (connectWallet, setTestResults) => {
  try {
    await connectWallet();
    setTestResults(prev => ({
      ...prev,
      walletConnection: { success: true, message: 'Wallet connection successful!' }
    }));
    return true;
  } catch (error) {
    console.error('Wallet connection test failed:', error);
    setTestResults(prev => ({
      ...prev,
      walletConnection: { success: false, message: `Error: ${error.message}` }
    }));
    return false;
  }
};

/**
 * Helper function to test message fetching
 * @param {function} fetchMessages - The message fetching function from Web3Context
 * @param {function} setTestResults - Function to set test results
 * @returns {Promise<boolean>} - True if fetching was successful
 */
export const testMessageFetching = async (fetchMessages, setTestResults) => {
  try {
    await fetchMessages();
    setTestResults(prev => ({
      ...prev,
      messageFetching: { success: true, message: 'Messages fetched successfully!' }
    }));
    return true;
  } catch (error) {
    console.error('Message fetching test failed:', error);
    setTestResults(prev => ({
      ...prev,
      messageFetching: { success: false, message: `Error: ${error.message}` }
    }));
    return false;
  }
};

/**
 * Helper function to format messages for testing 
 * @param {Array} messages - Array of blockchain message objects
 * @returns {string} - Formatted string of messages
 */
export const formatMessagesForTest = (messages) => {
  if (!messages || messages.length === 0) {
    return 'No messages available';
  }
  
  return messages.map((msg, index) => (
    `[${index + 1}] From: ${msg.sender.substring(0, 8)}... | Text: ${msg.text.substring(0, 25)}${msg.text.length > 25 ? '...' : ''} | Likes: ${msg.likes}`
  )).join('\n');
};

/**
 * Helper function to add test data (for development only)
 * @param {function} postMessage - The post message function from Web3Context
 * @param {function} setTestResults - Function to set test results 
 * @returns {Promise<boolean>} - True if successful
 */
export const testPostMessage = async (postMessage, setTestResults) => {
  try {
    const testMessage = `Test message from testing utility: ${new Date().toISOString()}`;
    await postMessage(testMessage);
    setTestResults(prev => ({
      ...prev,
      messagePosting: { success: true, message: 'Test message posted successfully!' }
    }));
    return true;
  } catch (error) {
    console.error('Test message posting failed:', error);
    setTestResults(prev => ({
      ...prev,
      messagePosting: { success: false, message: `Error: ${error.message}` }
    }));
    return false;
  }
};

/**
 * Helper to detect mobile devices for responsive testing
 * @returns {boolean} - True if the device is mobile
 */
export const isMobileDevice = () => {
  return (window.innerWidth <= 768);
};

/**
 * Format an Ethereum address for display
 * @param {string} address - Ethereum address
 * @param {number} startChars - Number of starting characters to show
 * @param {number} endChars - Number of ending characters to show
 * @returns {string} - Formatted address
 */
export const formatAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return '';
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
};
