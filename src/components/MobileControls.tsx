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
      
      {/* Top row: Hold and Pause */}
      <div className="controls-top">
        <button
          className={buttonClass('hold')}
          onTouchStart={(e) => { e.preventDefault(); handleButtonStart('hold', onHold); }}
          onTouchEnd={handleButtonEnd}
        >
          <span className="btn-label">HOLD</span>
        </button>
        <button
          className={buttonClass('pause')}
          onTouchStart={(e) => { e.preventDefault(); handleButtonStart('pause', onPause); }}
          onTouchEnd={handleButtonEnd}
        >
          <span className="btn-label">❚❚</span>
        </button>
      </div>
      
      {/* Bottom controls */}
      <div className="controls-bottom">
        {/* D-pad for movement */}
        <div className="dpad">
          <button
            className={buttonClass('left')}
            onTouchStart={(e) => { e.preventDefault(); handleButtonStart('left', onLeft, true); }}
            onTouchEnd={handleButtonEnd}
            onTouchCancel={handleButtonEnd}
          >
            <span className="btn-icon">◀</span>
          </button>
          <button
            className={buttonClass('down')}
            onTouchStart={(e) => { e.preventDefault(); handleButtonStart('down', onDown, true); }}
            onTouchEnd={handleButtonEnd}
            onTouchCancel={handleButtonEnd}
          >
            <span className="btn-icon">▼</span>
          </button>
          <button
            className={buttonClass('right')}
            onTouchStart={(e) => { e.preventDefault(); handleButtonStart('right', onRight, true); }}
            onTouchEnd={handleButtonEnd}
            onTouchCancel={handleButtonEnd}
          >
            <span className="btn-icon">▶</span>
          </button>
        </div>
        
        {/* Action buttons */}
        <div className="action-buttons">
          <button
            className={`${buttonClass('rotate')} rotate-btn`}
            onTouchStart={(e) => { e.preventDefault(); handleButtonStart('rotate', onRotate); }}
            onTouchEnd={handleButtonEnd}
          >
            <span className="btn-icon">↻</span>
          </button>
          <button
            className={`${buttonClass('drop')} drop-btn`}
            onTouchStart={(e) => { e.preventDefault(); handleButtonStart('drop', onHardDrop); }}
            onTouchEnd={handleButtonEnd}
          >
            <span className="btn-icon">⬇</span>
          </button>
        </div>
      </div>
    </div>
  );
}
