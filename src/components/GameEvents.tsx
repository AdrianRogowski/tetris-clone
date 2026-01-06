import { useEffect, useState } from 'react';
import type { GameEvent } from '../game/types';

interface GameEventsProps {
  event: GameEvent;
  onEventComplete: () => void;
}

export function GameEvents({ event, onEventComplete }: GameEventsProps) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (event) {
      setVisible(true);
      setAnimating(true);
      
      // Auto-hide after animation
      const hideTimer = setTimeout(() => {
        setAnimating(false);
      }, event.type === 'lineClear' && event.isTetris ? 1500 : 1000);
      
      const removeTimer = setTimeout(() => {
        setVisible(false);
        onEventComplete();
      }, event.type === 'lineClear' && event.isTetris ? 1800 : 1200);
      
      return () => {
        clearTimeout(hideTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [event, onEventComplete]);

  if (!visible || !event) return null;

  if (event.type === 'lineClear' && event.isTetris) {
    return (
      <div className="game-event tetris-celebration" data-animating={animating}>
        <div className="tetris-text">TETRIS!</div>
        <div className="tetris-bonus">+{800 * 1} pts</div>
      </div>
    );
  }

  if (event.type === 'levelUp') {
    return (
      <div className="game-event level-up" data-animating={animating}>
        <div className="level-up-text">LEVEL UP!</div>
        <div className="level-up-number">{event.newLevel}</div>
      </div>
    );
  }

  // Regular line clears (1-3 lines) - subtle notification
  if (event.type === 'lineClear' && event.lines > 1) {
    const clearNames = { 2: 'DOUBLE', 3: 'TRIPLE' };
    return (
      <div className="game-event line-clear" data-animating={animating}>
        <div className="clear-text">{clearNames[event.lines as 2 | 3]}!</div>
      </div>
    );
  }

  return null;
}
