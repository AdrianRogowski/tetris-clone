import { useState, useEffect } from 'react';

export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check for touch capability and screen width
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isNarrowScreen = window.innerWidth <= 768;
      setIsMobile(hasTouchScreen && isNarrowScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export function useTouchDevice(): boolean {
  const [showTouchControls, setShowTouchControls] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      // Show touch controls if:
      // 1. Device has touch capability, OR
      // 2. Screen is narrow (mobile-sized) - fallback for testing
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isNarrowScreen = window.innerWidth <= 768;
      setShowTouchControls(hasTouchScreen || isNarrowScreen);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);
    
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  return showTouchControls;
}
