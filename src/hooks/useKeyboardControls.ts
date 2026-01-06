import { useEffect, useCallback, useRef } from 'react';
import type { GameData } from '../game/types';
import {
  moveLeft,
  moveRight,
  moveDown,
  hardDrop,
  rotateClockwise,
  rotateCounterClockwise,
  holdPiece,
  pauseGame,
  resumeGame,
  startGame,
  resetGame,
} from '../game/gameState';

interface UseKeyboardControlsOptions {
  gameState: GameData;
  setGameState: (state: GameData | ((prev: GameData) => GameData)) => void;
}

// DAS (Delayed Auto Shift) settings
const DAS_DELAY = 170; // Initial delay before auto-repeat
const DAS_REPEAT = 50; // Repeat interval

export function useKeyboardControls({ gameState, setGameState }: UseKeyboardControlsOptions) {
  const dasTimerRef = useRef<number | null>(null);
  const dasRepeatRef = useRef<number | null>(null);
  const heldKeyRef = useRef<string | null>(null);

  const clearDAS = useCallback(() => {
    if (dasTimerRef.current) {
      clearTimeout(dasTimerRef.current);
      dasTimerRef.current = null;
    }
    if (dasRepeatRef.current) {
      clearInterval(dasRepeatRef.current);
      dasRepeatRef.current = null;
    }
    heldKeyRef.current = null;
  }, []);

  const handleAction = useCallback((action: string) => {
    setGameState(prev => {
      switch (action) {
        case 'left':
          return prev.state === 'playing' ? moveLeft(prev) : prev;
        case 'right':
          return prev.state === 'playing' ? moveRight(prev) : prev;
        case 'down':
          return prev.state === 'playing' ? moveDown(prev) : prev;
        case 'hardDrop':
          return prev.state === 'playing' ? hardDrop(prev) : prev;
        case 'rotateCW':
          return prev.state === 'playing' ? rotateClockwise(prev) : prev;
        case 'rotateCCW':
          return prev.state === 'playing' ? rotateCounterClockwise(prev) : prev;
        case 'hold':
          return prev.state === 'playing' ? holdPiece(prev) : prev;
        case 'pause':
          if (prev.state === 'playing') return pauseGame(prev);
          if (prev.state === 'paused') return resumeGame(prev);
          return prev;
        case 'start':
          if (prev.state === 'idle') return startGame(prev);
          return prev;
        case 'restart':
          return startGame(resetGame(prev));
        default:
          return prev;
      }
    });
  }, [setGameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for game keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Space', 'KeyZ', 'KeyX', 'KeyC', 'ShiftLeft', 'ShiftRight', 'KeyP', 'Escape', 'Enter', 'KeyR'].includes(e.code)) {
        e.preventDefault();
      }

      // Handle start/restart
      if (e.code === 'Enter') {
        if (gameState.state === 'idle') {
          handleAction('start');
        }
        return;
      }

      if (e.code === 'KeyR' && gameState.state === 'gameOver') {
        handleAction('restart');
        return;
      }

      // Handle pause
      if (e.code === 'KeyP' || e.code === 'Escape') {
        handleAction('pause');
        return;
      }

      // Only handle game controls when playing
      if (gameState.state !== 'playing') return;

      // Prevent repeat handling for instant actions
      if (e.repeat) {
        if (['Space', 'ArrowUp', 'KeyX', 'KeyZ', 'ControlLeft', 'ControlRight', 'KeyC', 'ShiftLeft', 'ShiftRight'].includes(e.code)) {
          return;
        }
      }

      switch (e.code) {
        case 'ArrowLeft':
          if (!e.repeat) {
            handleAction('left');
            if (heldKeyRef.current !== 'left') {
              clearDAS();
              heldKeyRef.current = 'left';
              dasTimerRef.current = window.setTimeout(() => {
                dasRepeatRef.current = window.setInterval(() => handleAction('left'), DAS_REPEAT);
              }, DAS_DELAY);
            }
          }
          break;
        case 'ArrowRight':
          if (!e.repeat) {
            handleAction('right');
            if (heldKeyRef.current !== 'right') {
              clearDAS();
              heldKeyRef.current = 'right';
              dasTimerRef.current = window.setTimeout(() => {
                dasRepeatRef.current = window.setInterval(() => handleAction('right'), DAS_REPEAT);
              }, DAS_DELAY);
            }
          }
          break;
        case 'ArrowDown':
          handleAction('down');
          break;
        case 'Space':
          handleAction('hardDrop');
          break;
        case 'ArrowUp':
        case 'KeyX':
          handleAction('rotateCW');
          break;
        case 'KeyZ':
        case 'ControlLeft':
        case 'ControlRight':
          handleAction('rotateCCW');
          break;
        case 'KeyC':
        case 'ShiftLeft':
        case 'ShiftRight':
          handleAction('hold');
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' && heldKeyRef.current === 'left') {
        clearDAS();
      }
      if (e.code === 'ArrowRight' && heldKeyRef.current === 'right') {
        clearDAS();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearDAS();
    };
  }, [gameState.state, handleAction, clearDAS]);
}
