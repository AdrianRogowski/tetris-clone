import { useEffect, useRef, useCallback } from 'react';
import type { GameData } from '../game/types';
import { tick, lockAndSpawn, incrementLockResets, MAX_LOCK_RESETS } from '../game/gameState';
import { getFallSpeed } from '../game/scoring';
import { canPlacePiece } from '../game/board';

interface UseGameLoopOptions {
  gameState: GameData;
  setGameState: (state: GameData | ((prev: GameData) => GameData)) => void;
}

export function useGameLoop({ gameState, setGameState }: UseGameLoopOptions) {
  const lastTickRef = useRef<number>(0);
  const lockTimerRef = useRef<number | null>(null);
  const lastPiecePositionRef = useRef<string | null>(null);

  // Check if piece is on ground
  const isPieceOnGround = useCallback(() => {
    if (!gameState.currentPiece) return false;
    return !canPlacePiece(
      gameState.board,
      gameState.currentPiece.type,
      { x: gameState.currentPiece.position.x, y: gameState.currentPiece.position.y + 1 },
      gameState.currentPiece.rotation
    );
  }, [gameState.board, gameState.currentPiece]);

  // Get piece position key for tracking changes
  const getPieceKey = useCallback(() => {
    if (!gameState.currentPiece) return null;
    const p = gameState.currentPiece;
    return `${p.position.x},${p.position.y},${p.rotation}`;
  }, [gameState.currentPiece]);

  // Game loop
  useEffect(() => {
    if (gameState.state !== 'playing') {
      return;
    }

    const fallSpeed = getFallSpeed(gameState.level);
    
    const loop = (timestamp: number) => {
      if (gameState.state !== 'playing') return;

      const delta = timestamp - lastTickRef.current;
      
      if (delta >= fallSpeed) {
        lastTickRef.current = timestamp;
        
        setGameState(prev => {
          if (prev.state !== 'playing') return prev;
          return tick(prev);
        });
      }

      requestAnimationFrame(loop);
    };

    const frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [gameState.state, gameState.level, setGameState]);

  // Lock timer when piece lands
  useEffect(() => {
    if (gameState.state !== 'playing' || !gameState.currentPiece) {
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
        lockTimerRef.current = null;
      }
      lastPiecePositionRef.current = null;
      return;
    }

    const onGround = isPieceOnGround();
    const currentPieceKey = getPieceKey();
    
    // Check if piece moved/rotated while on ground
    if (onGround && lockTimerRef.current && lastPiecePositionRef.current !== currentPieceKey) {
      // Piece moved - reset lock timer if we haven't exceeded max resets
      if (gameState.lockResets < MAX_LOCK_RESETS) {
        clearTimeout(lockTimerRef.current);
        lockTimerRef.current = null;
        
        // Increment lock reset counter
        setGameState(prev => {
          const { state: newState } = incrementLockResets(prev);
          return newState;
        });
      }
    }
    
    lastPiecePositionRef.current = currentPieceKey;
    
    if (onGround && !lockTimerRef.current) {
      lockTimerRef.current = window.setTimeout(() => {
        setGameState(prev => {
          if (prev.state !== 'playing') return prev;
          return lockAndSpawn(prev);
        });
        lockTimerRef.current = null;
      }, 500);
    } else if (!onGround && lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }

    return () => {
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
        lockTimerRef.current = null;
      }
    };
  }, [gameState.state, gameState.currentPiece, gameState.lockResets, isPieceOnGround, getPieceKey, setGameState]);
}
