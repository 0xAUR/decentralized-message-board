import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 to-purple-900 dark:from-indigo-950 dark:to-purple-950 text-white py-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <h3 className="text-xl font-semibold">DecentBoard</h3>
            </div>
            <p className="text-sm text-indigo-200 max-w-md">
              A decentralized message board running on the Ethereum blockchain.
              All messages are stored on-chain and are permanent. Built with modern Web3 technologies.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-4">
            <div>
              <h4 className="font-medium mb-2 text-indigo-300">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://ethereum.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-white hover:text-indigo-200 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Ethereum
                  </a>
                </li>
                <li>
                  <a 
                    href="https://docs.ethers.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-white hover:text-indigo-200 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Ethers.js
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-indigo-300">Explorers</h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://sepolia.etherscan.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-white hover:text-indigo-200 transition-colors flex items-center group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 transform group-hover:translate-x-0.5 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Sepolia
                  </a>
                </li>
                <li>
                  <a 
                    href="https://mumbai.polygonscan.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-white hover:text-indigo-200 transition-colors flex items-center group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 transform group-hover:translate-x-0.5 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Mumbai
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-indigo-300">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-white hover:text-indigo-200 transition-colors flex items-center group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 transform group-hover:translate-x-0.5 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    GitHub
                  </a>
                </li>
                <li>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-white hover:text-indigo-200 transition-colors flex items-center group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 transform group-hover:translate-x-0.5 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-indigo-800 text-center text-xs text-indigo-300">
          &copy; {new Date().getFullYear()} DecentBoard. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
