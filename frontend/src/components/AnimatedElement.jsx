import React, { useState, useEffect } from 'react';

/**
 * A component that provides animation effects to its children
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components to animate
 * @param {string} props.type - Animation type: 'fade', 'slide-up', 'slide-down', 'scale'
 * @param {number} props.delay - Delay before animation starts (in ms)
 * @param {number} props.duration - Animation duration (in ms)
 * @param {boolean} props.triggerOnce - If true, animation only triggers once when component mounts
 */
const AnimatedElement = ({ 
  children, 
  type = 'fade',
  delay = 0,
  duration = 300,
  triggerOnce = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  
  useEffect(() => {
    let timeout;
    
    if (!triggerOnce || !hasTriggered) {
      timeout = setTimeout(() => {
        setIsVisible(true);
        setHasTriggered(true);
      }, delay);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [delay, triggerOnce, hasTriggered]);
  
  // Determine animation styles based on type
  const getStyles = () => {
    const baseStyle = {
      transition: `all ${duration}ms ease-out`,
    };
    
    const initialStyles = {
      fade: { opacity: 0 },
      'slide-up': { opacity: 0, transform: 'translateY(20px)' },
      'slide-down': { opacity: 0, transform: 'translateY(-20px)' },
      'scale': { opacity: 0, transform: 'scale(0.95)' },
    };
    
    const visibleStyles = {
      fade: { opacity: 1 },
      'slide-up': { opacity: 1, transform: 'translateY(0)' },
      'slide-down': { opacity: 1, transform: 'translateY(0)' },
      'scale': { opacity: 1, transform: 'scale(1)' },
    };
    
    return {
      ...baseStyle,
      ...(isVisible ? visibleStyles[type] : initialStyles[type])
    };
  };
  
  return (
    <div style={getStyles()}>
      {children}
    </div>
  );
};

export default AnimatedElement;
