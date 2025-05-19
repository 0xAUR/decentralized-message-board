import React, { useState, useEffect } from 'react';

/**
 * A component that tracks screen size and provides responsive design utilities
 */
const ResponsiveHelper = () => {
  // Screen size breakpoints
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  };

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const [currentBreakpoint, setCurrentBreakpoint] = useState(getBreakpoint(window.innerWidth));

  // Update window size when it changes
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      setCurrentBreakpoint(getBreakpoint(window.innerWidth));
    };
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get the current breakpoint based on window width
  function getBreakpoint(width) {
    if (width < breakpoints.sm) return 'xs';
    if (width < breakpoints.md) return 'sm';
    if (width < breakpoints.lg) return 'md';
    if (width < breakpoints.xl) return 'lg';
    if (width < breakpoints['2xl']) return 'xl';
    return '2xl';
  }

  const [isVisible, setIsVisible] = useState(false);
  const toggle = () => setIsVisible(!isVisible);

  if (!isVisible) {
    return (
      <div className="fixed bottom-5 left-5 z-50">
        <button
          onClick={toggle}
          className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-mono py-1 px-2 rounded shadow-lg flex items-center"
        >
          <span className="mr-1">📱</span> Screen
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 left-5 bg-gray-800 text-white p-4 rounded-lg shadow-2xl z-50 text-xs font-mono">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">Responsive Helper</h3>
        <button onClick={toggle} className="text-white hover:text-gray-300">✕</button>
      </div>
      
      <div className="space-y-2">
        <p>Width: {windowSize.width}px</p>
        <p>Height: {windowSize.height}px</p>
        <p>
          Breakpoint: 
          <span className={`ml-2 font-bold
            ${currentBreakpoint === 'xs' ? 'text-red-400' : ''}
            ${currentBreakpoint === 'sm' ? 'text-orange-400' : ''}
            ${currentBreakpoint === 'md' ? 'text-yellow-400' : ''}
            ${currentBreakpoint === 'lg' ? 'text-green-400' : ''}
            ${currentBreakpoint === 'xl' ? 'text-blue-400' : ''}
            ${currentBreakpoint === '2xl' ? 'text-purple-400' : ''}
          `}>
            {currentBreakpoint}
          </span>
        </p>
      </div>
      
      <div className="mt-3 grid grid-cols-6 gap-1">
        {Object.entries(breakpoints).map(([name, size], index) => (
          <div 
            key={name}
            className={`text-center p-1 rounded ${
              size <= windowSize.width ? 'bg-green-700' : 'bg-red-700'
            }`}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponsiveHelper;
