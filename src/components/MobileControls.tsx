import { useCallback, useRef, useState } from 'react';

interface MobileControlsProps {
  onLeft: () => void;
  onRight: () => void;
  onDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onHold: () => void;
  onPause: () => void;
}

interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
}

export function MobileControls({
  onLeft,
  onRight,
  onDown,
  onRotate,
  onHardDrop,
  onHold,
  onPause,
}: MobileControlsProps) {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const repeatIntervalRef = useRef<number | null>(null);
  const touchStateRef = useRef<TouchState | null>(null);

  // Button press with repeat for movement
  const handleButtonStart = useCallback((action: string, callback: () => void, shouldRepeat = false) => {
    setActiveButton(action);
    callback();
    
    if (shouldRepeat) {
      // Clear any existing interval
      if (repeatIntervalRef.current) {
        clearInterval(repeatIntervalRef.current);
      }
      // Start repeat after initial delay
      repeatIntervalRef.current = window.setTimeout(() => {
        repeatIntervalRef.current = window.setInterval(callback, 50);
      }, 170);
    }
  }, []);

  const handleButtonEnd = useCallback(() => {
    setActiveButton(null);
    if (repeatIntervalRef.current) {
      clearInterval(repeatIntervalRef.current);
      clearTimeout(repeatIntervalRef.current);
      repeatIntervalRef.current = null;
    }
  }, []);

  // Swipe detection on game area
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStateRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
    };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStateRef.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStateRef.current.startX;
    const deltaY = touch.clientY - touchStateRef.current.startY;
    const deltaTime = Date.now() - touchStateRef.current.startTime;
    
    const minSwipeDistance = 30;
    const maxSwipeTime = 300;
    
    // Quick tap = rotate
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 200) {
      onRotate();
      touchStateRef.current = null;
      return;
    }
    
    // Swipe detection
    if (deltaTime < maxSwipeTime) {
      if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > minSwipeDistance) {
        // Swipe down = hard drop
        onHardDrop();
      }
    }
    
    touchStateRef.current = null;
  }, [onRotate, onHardDrop]);

  const buttonClass = (name: string) => `
    touch-control-btn
    ${activeButton === name ? 'active' : ''}
  `;

  return (
    <div className="mobile-controls">
      {/* Swipe area overlay - for tap to rotate and swipe to hard drop */}
      <div 
        className="swipe-area"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />
      
      {/* Bottom controls */}
      <div className="controls-bottom">
        {/* D-pad for movement */}
        <div className="dpad" data-testid="dpad">
          <button
            className={buttonClass('left')}
            onTouchStart={(e) => { e.preventDefault(); handleButtonStart('left', onLeft, true); }}
            onTouchEnd={handleButtonEnd}
            onTouchCancel={handleButtonEnd}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="btn-svg">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <button
            className={buttonClass('down')}
            onTouchStart={(e) => { e.preventDefault(); handleButtonStart('down', onDown, true); }}
            onTouchEnd={handleButtonEnd}
            onTouchCancel={handleButtonEnd}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="btn-svg">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
            </svg>
          </button>
          <button
            className={buttonClass('right')}
            onTouchStart={(e) => { e.preventDefault(); handleButtonStart('right', onRight, true); }}
            onTouchEnd={handleButtonEnd}
            onTouchCancel={handleButtonEnd}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="btn-svg">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </button>
        </div>

        {/* Center: Hold button */}
        <button
          className={`${buttonClass('hold')} hold-btn`}
          data-testid="hold-btn"
          onTouchStart={(e) => { e.preventDefault(); handleButtonStart('hold', onHold); }}
          onTouchEnd={handleButtonEnd}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="btn-svg">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 14H9c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1h6c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1z"/>
          </svg>
        </button>
        
        {/* Action buttons */}
        <div className="action-buttons" data-testid="action-buttons">
          <button
            className={`${buttonClass('rotate')} rotate-btn`}
            onTouchStart={(e) => { e.preventDefault(); handleButtonStart('rotate', onRotate); }}
            onTouchEnd={handleButtonEnd}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="btn-svg">
              <path d="M12.5 8c-2.65 0-5.05 1.04-6.83 2.73L3.5 8.5v7h7l-2.77-2.77c1.31-1.3 3.13-2.1 5.14-2.1 3.72 0 6.84 2.77 7.3 6.37l1.96-.27C21.57 11.75 17.45 8 12.5 8z"/>
            </svg>
          </button>
          <button
            className={`${buttonClass('drop')} drop-btn`}
            onTouchStart={(e) => { e.preventDefault(); handleButtonStart('drop', onHardDrop); }}
            onTouchEnd={handleButtonEnd}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="btn-svg">
              <path d="M11 5v11.17l-4.88-4.88c-.39-.39-1.03-.39-1.42 0-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0l6.59-6.59c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L13 16.17V5c0-.55-.45-1-1-1s-1 .45-1 1z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Pause button - top right, below the Next preview */}
      <button
        className={`${buttonClass('pause')} pause-btn`}
        data-testid="pause-btn"
        onTouchStart={(e) => { e.preventDefault(); handleButtonStart('pause', onPause); }}
        onTouchEnd={handleButtonEnd}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="btn-svg">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
      </button>
    </div>
  );
}
