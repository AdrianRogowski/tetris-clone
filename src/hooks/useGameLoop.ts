import { useEffect, useRef, useCallback } from 'react';
import type { GameData } from '../game/types';
import { tick, lockAndSpawn } from '../game/gameState';
import { getFallSpeed } from '../game/scoring';
import { canPlacePiece } from '../game/board';

interface UseGameLoopOptions {
  gameState: GameData;
  setGameState: (state: GameData | ((prev: GameData) => GameData)) => void;
}

export function useGameLoop({ gameState, setGameState }: UseGameLoopOptions) {
  const lastTickRef = useRef<number>(0);
  const lockTimerRef = useRef<number | null>(null);
  const isLandedRef = useRef(false);

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
        
        // Check if on ground before tick
        const wasOnGround = isPieceOnGround();
        
        setGameState(prev => {
          if (prev.state !== 'playing') return prev;
          return tick(prev);
        });

        // If we're now on ground and weren't before, start lock timer
        if (!wasOnGround && isPieceOnGround()) {
          isLandedRef.current = true;
        }
      }

      requestAnimationFrame(loop);
    };

    const frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [gameState.state, gameState.level, setGameState, isPieceOnGround]);

  // Lock timer when piece lands
  useEffect(() => {
    if (gameState.state !== 'playing' || !gameState.currentPiece) {
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
        lockTimerRef.current = null;
      }
      return;
    }

    const onGround = isPieceOnGround();
    
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
  }, [gameState.state, gameState.currentPiece, isPieceOnGround, setGameState]);
}
