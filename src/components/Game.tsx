import { useState, useCallback } from 'react';
import type { GameData } from '../game/types';
import { 
  createGameState, 
  startGame, 
  resetGame, 
  pauseGame, 
  resumeGame,
  moveLeft,
  moveRight,
  moveDown,
  hardDrop,
  rotateClockwise,
  holdPiece,
  clearEvent,
} from '../game/gameState';
import { getGhostPiece } from '../game/gameState';
import { useGameLoop } from '../hooks/useGameLoop';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { useTouchDevice } from '../hooks/useMobile';
import { GameBoard } from './GameBoard';
import { PreviewBox } from './PreviewBox';
import { HoldBox } from './HoldBox';
import { ScorePanel } from './ScorePanel';
import { StartScreen, PauseScreen, GameOverScreen } from './Overlay';
import { MobileControls } from './MobileControls';
import { GameEvents } from './GameEvents';

export function Game() {
  const [gameState, setGameState] = useState<GameData>(() => createGameState());
  const isTouchDevice = useTouchDevice();

  // Game loop
  useGameLoop({ gameState, setGameState });

  // Keyboard controls (still active on touch devices for external keyboards)
  useKeyboardControls({ gameState, setGameState });

  // Event handlers
  const handleStart = useCallback(() => {
    setGameState(prev => startGame(prev));
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

  // Mobile control handlers
  const handleMobileLeft = useCallback(() => {
    setGameState(prev => prev.state === 'playing' ? moveLeft(prev) : prev);
  }, []);

  const handleMobileRight = useCallback(() => {
    setGameState(prev => prev.state === 'playing' ? moveRight(prev) : prev);
  }, []);

  const handleMobileDown = useCallback(() => {
    setGameState(prev => prev.state === 'playing' ? moveDown(prev) : prev);
  }, []);

  const handleMobileRotate = useCallback(() => {
    setGameState(prev => prev.state === 'playing' ? rotateClockwise(prev) : prev);
  }, []);

  const handleMobileHardDrop = useCallback(() => {
    setGameState(prev => prev.state === 'playing' ? hardDrop(prev) : prev);
  }, []);

  const handleMobileHold = useCallback(() => {
    setGameState(prev => prev.state === 'playing' ? holdPiece(prev) : prev);
  }, []);

  const handleMobilePause = useCallback(() => {
    setGameState(prev => {
      if (prev.state === 'playing') return pauseGame(prev);
      if (prev.state === 'paused') return resumeGame(prev);
      return prev;
    });
  }, []);

  const handleEventComplete = useCallback(() => {
    setGameState(prev => clearEvent(prev));
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
      className="game-container min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--color-void)' }}
    >
      <div className="game-layout flex gap-4 md:gap-6 items-start">
        {/* Left panel: Hold and Score - hidden on small mobile, shown as row on tablet */}
        <div className="side-panel hidden sm:flex flex-col gap-4">
          <HoldBox piece={gameState.heldPiece} isLocked={!gameState.canHold} />
          <ScorePanel 
            score={gameState.score} 
            level={gameState.level} 
            lines={gameState.lines} 
          />
        </div>

        {/* Center section */}
        <div className="flex flex-col items-center gap-3">
          {/* Mobile stats row - visible only on small screens */}
          <div className="flex sm:hidden gap-3 w-full justify-center">
            <div className="panel flex-1 text-center" style={{ padding: '8px' }}>
              <div className="panel-title">Score</div>
              <div className="font-display text-sm score-value" style={{ color: 'var(--color-accent-primary)' }}>
                {gameState.score.toLocaleString()}
              </div>
            </div>
            <div className="panel text-center" style={{ padding: '8px', minWidth: '60px' }}>
              <div className="panel-title">Lvl</div>
              <div className="font-display text-base level-value" style={{ color: 'var(--color-accent-gold)' }}>
                {gameState.level}
              </div>
            </div>
            <div className="panel text-center" style={{ padding: '8px', minWidth: '50px' }}>
              <div className="panel-title">Lines</div>
              <div className="font-display text-sm lines-value" style={{ color: 'var(--color-text-primary)' }}>
                {gameState.lines}
              </div>
            </div>
          </div>

          {/* Game board */}
          <GameBoard 
            board={gameState.board}
            currentPiece={gameState.currentPiece}
            ghostPosition={ghostPosition}
          />
        </div>

        {/* Right panel: Next pieces */}
        <div className="hidden sm:block">
          <PreviewBox pieces={gameState.nextPieces} count={4} />
        </div>
        
        {/* Mobile: Compact next piece preview */}
        <div className="sm:hidden fixed top-3 right-3 z-40">
          <PreviewBox pieces={gameState.nextPieces} count={1} />
        </div>
        
        {/* Mobile: Compact hold box */}
        <div className="sm:hidden fixed top-3 left-3 z-40">
          <HoldBox piece={gameState.heldPiece} isLocked={!gameState.canHold} />
        </div>
      </div>

      {/* Desktop controls hint */}
      <div 
        className="desktop-controls-hint fixed bottom-4 text-center text-xs"
        style={{ color: 'var(--color-text-dim)' }}
      >
        <p>← → Move | ↑ Rotate | ↓ Soft Drop | Space Hard Drop | Shift Hold | P Pause</p>
      </div>

      {/* Mobile controls */}
      {isTouchDevice && gameState.state === 'playing' && (
        <MobileControls
          onLeft={handleMobileLeft}
          onRight={handleMobileRight}
          onDown={handleMobileDown}
          onRotate={handleMobileRotate}
          onHardDrop={handleMobileHardDrop}
          onHold={handleMobileHold}
          onPause={handleMobilePause}
        />
      )}

      {/* Game Events (Tetris celebration, Level up, etc.) */}
      <GameEvents 
        event={gameState.lastEvent} 
        onEventComplete={handleEventComplete} 
      />

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
