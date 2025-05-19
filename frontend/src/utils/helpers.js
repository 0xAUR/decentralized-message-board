/**
 * Format an Ethereum address to a shortened display format
 * @param {string} address - The full Ethereum address
 * @param {number} chars - Number of characters to show at start and end
 * @returns {string} Shortened address with ellipsis in the middle
 */
export const formatAddress = (address, chars = 4) => {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
};

/**
 * Format a date to a readable format
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  // For messages less than 24 hours old, show relative time
  const now = new Date();
  const diffMs = now - date;
  const diffHrs = diffMs / (1000 * 60 * 60);
  
  if (diffHrs < 24) {
    // Show relative time for recent messages
    if (diffHrs < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins <= 1 ? 'just now' : `${diffMins} mins ago`;
    } else {
      const hours = Math.floor(diffHrs);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
  } else {
    // Show formatted date for older messages
    return date.toLocaleString();
  }
};

/**
 * Truncate text with ellipsis if it exceeds the max length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
