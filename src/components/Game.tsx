import { useState, useCallback } from 'react';
import type { GameData } from '../game/types';
import { createGameState, startGame, resetGame, pauseGame, resumeGame } from '../game/gameState';
import { getGhostPiece } from '../game/gameState';
import { useGameLoop } from '../hooks/useGameLoop';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { GameBoard } from './GameBoard';
import { PreviewBox } from './PreviewBox';
import { HoldBox } from './HoldBox';
import { ScorePanel } from './ScorePanel';
import { StartScreen, PauseScreen, GameOverScreen } from './Overlay';

export function Game() {
  const [gameState, setGameState] = useState<GameData>(() => createGameState());

  // Game loop
  useGameLoop({ gameState, setGameState });

  // Keyboard controls
  useKeyboardControls({ gameState, setGameState });

  // Event handlers
  const handleStart = useCallback(() => {
    setGameState(prev => startGame(prev));
  }, []);

  const handlePause = useCallback(() => {
    setGameState(prev => pauseGame(prev));
  }, []);

  const handleResume = useCallback(() => {
    setGameState(prev => resumeGame(prev));
  }, []);

  const handleRestart = useCallback(() => {
    setGameState(prev => startGame(resetGame(prev)));
  }, []);

  const handleQuit = useCallback(() => {
    setGameState(createGameState());
  }, []);

  // Get ghost position
  const ghostPosition = getGhostPiece(gameState);

  // Render start screen
  if (gameState.state === 'idle') {
    return (
      <>
        <StartScreen onStart={handleStart} />
        <div className="scanlines" />
        <div className="vignette" />
      </>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--color-void)' }}
    >
      <div className="flex gap-6 items-start">
        {/* Left panel: Hold and Score */}
        <div className="flex flex-col gap-4">
          <HoldBox piece={gameState.heldPiece} isLocked={!gameState.canHold} />
          <ScorePanel 
            score={gameState.score} 
            level={gameState.level} 
            lines={gameState.lines} 
          />
        </div>

        {/* Center: Game board */}
        <GameBoard 
          board={gameState.board}
          currentPiece={gameState.currentPiece}
          ghostPosition={ghostPosition}
        />

        {/* Right panel: Next pieces */}
        <PreviewBox pieces={gameState.nextPieces} count={4} />
      </div>

      {/* Controls hint */}
      <div 
        className="fixed bottom-4 text-center text-xs"
        style={{ color: 'var(--color-text-dim)' }}
      >
        <p>← → Move | ↑ Rotate | ↓ Soft Drop | Space Hard Drop | Shift Hold | P Pause</p>
      </div>

      {/* Overlays */}
      {gameState.state === 'paused' && (
        <PauseScreen 
          onResume={handleResume}
          onRestart={handleRestart}
          onQuit={handleQuit}
        />
      )}

      {gameState.state === 'gameOver' && (
        <GameOverScreen
          score={gameState.score}
          level={gameState.level}
          lines={gameState.lines}
          onRestart={handleRestart}
          onQuit={handleQuit}
        />
      )}

      {/* CRT effects */}
      <div className="scanlines" />
      <div className="vignette" />
    </div>
  );
}
