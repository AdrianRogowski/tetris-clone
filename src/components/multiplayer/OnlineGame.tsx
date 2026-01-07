/**
 * Online Multiplayer Game Component
 * Main component that orchestrates the multiplayer game experience
 */

import { useState, useCallback, useEffect } from 'react';
import { MultiplayerMenu } from './MultiplayerMenu';
import { Lobby } from './Lobby';
import { OpponentBoard } from './OpponentBoard';
import { GarbageIndicator } from './GarbageIndicator';
import { useMultiplayerSocket } from '../../multiplayer/network/hooks/usePartySocket';
import { isHost as checkIsHost, canStartGame } from '../../multiplayer/network/roomState';
import { GameBoard } from '../GameBoard';
import { PreviewBox } from '../PreviewBox';
import { HoldBox } from '../HoldBox';
import { ScorePanel } from '../ScorePanel';
import { MobileControls } from '../MobileControls';
import { GameOverScreen } from '../Overlay';
import type { GameData } from '../../game/types';
import { 
  createGameState, 
  startGame,
  moveLeft,
  moveRight,
  moveDown,
  hardDrop,
  rotateClockwise,
  holdPiece,
} from '../../game/gameState';
import { getGhostPiece } from '../../game/gameState';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useKeyboardControls } from '../../hooks/useKeyboardControls';
import { useTouchDevice } from '../../hooks/useMobile';
import { calculateGarbage, applyGarbage } from '../../multiplayer/garbage';

// Responsive breakpoints
type ViewportSize = 'mobile' | 'tablet' | 'desktop';

function useViewportSize(): ViewportSize {
  const [size, setSize] = useState<ViewportSize>('desktop');

  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setSize('mobile');
      } else if (width < 1024) {
        setSize('tablet');
      } else {
        setSize('desktop');
      }
    };

    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return size;
}

type GamePhase = 'menu' | 'connecting' | 'lobby' | 'playing' | 'gameOver';

interface OnlineGameProps {
  onBack: () => void;
}

// PartyKit host - uses env variable in production, deployed URL as fallback
const PARTY_HOST = import.meta.env.VITE_PARTY_HOST || 'tetris-multiplayer.adrianrogowski.partykit.dev';

/**
 * Connected Game - Only renders when we have a valid room code
 */
function ConnectedGame({ 
  roomCode, 
  playerName, 
  onBack,
  onGameOver,
}: { 
  roomCode: string; 
  playerName: string; 
  onBack: () => void;
  onGameOver: () => void;
}) {
  const [phase, setPhase] = useState<'lobby' | 'playing' | 'gameOver'>('lobby');
  const [gameState, setGameState] = useState<GameData>(() => createGameState());
  const [targetMode, setTargetMode] = useState<'random' | 'badges' | 'attacker' | 'lowest'>('random');
  const [targetExpanded, setTargetExpanded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Responsive hooks
  const viewportSize = useViewportSize();
  const isTouchDevice = useTouchDevice();
  const isMobile = viewportSize === 'mobile';
  const isTablet = viewportSize === 'tablet';

  // Multiplayer connection
  const {
    status,
    roomState,
    myPlayerId,
    setReady,
    startGame: startMultiplayerGame,
    sendGarbage,
    sendBoardUpdate,
    sendEliminated,
    leave,
    playAgain,
  } = useMultiplayerSocket({
    host: PARTY_HOST,
    roomCode,
    playerName,
    onGameStart: () => {
      setGameState(prev => startGame(prev));
      setPhase('playing');
    },
    onGarbageReceived: (lines) => {
      setGameState(prev => ({
        ...prev,
        board: applyGarbage(prev.board, lines),
      }));
    },
    onError: (error) => {
      console.error('Multiplayer error:', error);
    },
  });

  // Game loop
  useGameLoop({ gameState, setGameState });

  // Keyboard controls
  useKeyboardControls({ gameState, setGameState });

  // Handle line clears -> send garbage
  useEffect(() => {
    if (phase !== 'playing') return;
    
    const event = gameState.lastEvent;
    if (event?.type === 'lineClear') {
      const result = calculateGarbage(event.lines);
      if (result.linesSent > 0) {
        sendGarbage(result.linesSent, targetMode);
      }
    }
  }, [gameState.lastEvent, phase, sendGarbage, targetMode]);

  // Sync board state periodically
  useEffect(() => {
    if (phase !== 'playing') return;
    
    const interval = setInterval(() => {
      sendBoardUpdate(
        gameState.board,
        gameState.score,
        gameState.lines,
        gameState.level
      );
    }, 500);

    return () => clearInterval(interval);
  }, [phase, gameState, sendBoardUpdate]);

  // Handle game over
  useEffect(() => {
    if (gameState.state === 'gameOver' && phase === 'playing') {
      sendEliminated();
    }
  }, [gameState.state, phase, sendEliminated]);

  // Handle room phase changes
  useEffect(() => {
    if (roomState.phase === 'gameOver') {
      setPhase('gameOver');
    }
    // When server resets to lobby (from roomReset message), sync local phase
    if (roomState.phase === 'lobby' && phase !== 'lobby') {
      setGameState(createGameState());
      setPhase('lobby');
    }
  }, [roomState.phase, phase]);

  const handleLeave = useCallback(() => {
    leave();
    onBack();
  }, [leave, onBack]);

  // Mobile control handlers
  const handleMobileLeft = useCallback(() => {
    if (gameState.state === 'playing') {
      setGameState(prev => moveLeft(prev));
    }
  }, [gameState.state]);

  const handleMobileRight = useCallback(() => {
    if (gameState.state === 'playing') {
      setGameState(prev => moveRight(prev));
    }
  }, [gameState.state]);

  const handleMobileDown = useCallback(() => {
    if (gameState.state === 'playing') {
      setGameState(prev => moveDown(prev));
    }
  }, [gameState.state]);

  const handleMobileRotate = useCallback(() => {
    if (gameState.state === 'playing') {
      setGameState(prev => rotateClockwise(prev));
    }
  }, [gameState.state]);

  const handleMobileHardDrop = useCallback(() => {
    if (gameState.state === 'playing') {
      setGameState(prev => hardDrop(prev));
    }
  }, [gameState.state]);

  const handleMobileHold = useCallback(() => {
    if (gameState.state === 'playing') {
      setGameState(prev => holdPiece(prev));
    }
  }, [gameState.state]);

  const handleMobilePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Ghost piece for rendering
  const ghostPosition = getGhostPiece(gameState);

  // Get opponent states from room
  const opponents = Array.from(roomState.opponents.values())
    .filter(o => o.playerId !== myPlayerId);

  // Lobby phase
  if (phase === 'lobby') {
    return (
      <Lobby
        roomCode={roomCode}
        players={roomState.players}
        myPlayerId={myPlayerId}
        isHost={checkIsHost(roomState)}
        canStart={canStartGame(roomState)}
        countdown={roomState.countdown}
        connectionStatus={status}
        onReady={setReady}
        onStart={startMultiplayerGame}
        onLeave={handleLeave}
      />
    );
  }

  // Game over phase
  if (phase === 'gameOver') {
    const myStanding = roomState.standings.find(s => s.playerId === myPlayerId);
    return (
      <GameOverScreen
        score={myStanding?.score ?? gameState.score}
        level={gameState.level}
        lines={myStanding?.lines ?? gameState.lines}
        onRestart={() => {
          // Tell server we want to play again
          playAgain();
          // Reset local game state
          setGameState(createGameState());
          setPhase('lobby');
        }}
        onQuit={handleLeave}
      />
    );
  }

  // Target mode icons
  const targetIcons: Record<string, string> = {
    random: '🎲',
    badges: '🏆',
    attacker: '⚔️',
    lowest: '📉',
  };

  // Mobile Layout
  if (isMobile || (isTablet && isTouchDevice)) {
    return (
      <div 
        className="mobile-game-layout min-h-screen flex flex-col"
        data-mobile="true"
        data-testid="mobile-game"
        style={{ background: 'var(--color-void)' }}
      >
        {/* Mobile Opponents - horizontal scroll */}
        <div 
          className="mobile-opponents flex gap-2 p-2 overflow-x-auto"
          data-testid="mobile-opponents"
          style={{ 
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <p 
            className="font-display text-xs shrink-0 self-center px-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            OPPONENTS
          </p>
          {opponents.map((opponent) => (
            <OpponentBoard
              key={opponent.playerId}
              playerId={opponent.playerId}
              name={opponent.name}
              color={opponent.color}
              board={opponent.board}
              score={opponent.score}
              isEliminated={opponent.isEliminated}
              placement={opponent.placement}
              isDisconnected={!opponent.isConnected}
              mini
            />
          ))}
          {opponents.length === 0 && (
            <p 
              className="text-xs self-center px-4"
              style={{ color: 'var(--color-text-dim)' }}
            >
              Waiting...
            </p>
          )}
        </div>

        {/* Mobile Stats Bar */}
        <div 
          className="mobile-stats-bar flex justify-between items-center px-3 py-2"
          data-testid="mobile-stats"
          style={{ background: 'var(--color-chrome)' }}
        >
          <div className="flex gap-4">
            <div className="text-center">
              <span className="font-display text-lg" style={{ color: 'var(--color-accent-primary)' }}>
                {gameState.score.toLocaleString()}
              </span>
            </div>
            <div className="text-center">
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>LVL </span>
              <span className="font-display text-sm" style={{ color: 'var(--color-accent-gold)' }}>
                {gameState.level}
              </span>
            </div>
            <div className="text-center">
              <span className="font-display text-sm" style={{ color: 'var(--color-text-primary)' }}>
                {gameState.lines}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}> LNS</span>
            </div>
          </div>
          <PreviewBox pieces={gameState.nextPieces} count={3} compact />
        </div>

        {/* Main Board Area */}
        <div className="flex-1 flex items-center justify-center p-2">
          <div className="relative" data-testid="game-board">
            <GarbageIndicator pendingLines={roomState.pendingGarbage} data-testid="garbage-indicator" />
            <GameBoard 
              board={gameState.board}
              currentPiece={gameState.currentPiece}
              ghostPosition={ghostPosition}
              cellSize={18}
            />
          </div>
        </div>

        {/* Mobile Touch Controls */}
        <MobileControls
          onLeft={handleMobileLeft}
          onRight={handleMobileRight}
          onDown={handleMobileDown}
          onRotate={handleMobileRotate}
          onHardDrop={handleMobileHardDrop}
          onHold={handleMobileHold}
          onPause={handleMobilePause}
        />

        {/* Collapsed Target Selector */}
        <div 
          className="target-selector-collapsed p-2"
          data-collapsed={!targetExpanded}
          style={{ background: 'var(--color-chrome)' }}
        >
          <button
            onClick={() => setTargetExpanded(!targetExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 rounded"
            style={{ 
              background: 'var(--color-grid-bg)',
              color: 'var(--color-text-primary)',
            }}
          >
            <span className="font-display text-xs">
              {targetIcons[targetMode]} {targetMode.charAt(0).toUpperCase() + targetMode.slice(1)}
            </span>
            <span>{targetExpanded ? '▲' : '▼'}</span>
          </button>
          
          {targetExpanded && (
            <div className="mt-2 flex flex-col gap-1">
              {(['random', 'badges', 'attacker', 'lowest'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setTargetMode(mode);
                    setTargetExpanded(false);
                  }}
                  className="font-display text-xs py-2 px-3 rounded text-left"
                  style={{
                    background: targetMode === mode ? 'rgba(0, 245, 255, 0.2)' : 'transparent',
                    color: targetMode === mode ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                  }}
                >
                  {targetIcons[mode]} {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CRT effects */}
        <div className="scanlines" />
        <div className="vignette" />
      </div>
    );
  }

  // Desktop/Tablet Layout
  return (
    <div 
      className={`game-container min-h-screen flex items-center justify-center p-4 ${isTablet ? 'tablet-game-layout' : 'desktop-game-layout'}`}
      data-desktop={!isTablet}
      data-tablet={isTablet}
      style={{ background: 'var(--color-void)' }}
    >
      <div className="flex gap-6 items-start">
        {/* Left panel: Your game */}
        <div className="flex gap-4 items-start">
          {/* Hold and Score */}
          <div className="flex flex-col gap-4">
            <HoldBox piece={gameState.heldPiece} isLocked={!gameState.canHold} />
            <ScorePanel 
              score={gameState.score} 
              level={gameState.level} 
              lines={gameState.lines} 
            />
            
            {/* Target mode selector */}
            <div className="panel">
              <p className="panel-title">Target</p>
              <div className="flex flex-col gap-1">
                {(['random', 'badges', 'attacker', 'lowest'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTargetMode(mode)}
                    className="font-display text-xs py-1 px-2 rounded text-left transition-all"
                    style={{
                      background: targetMode === mode 
                        ? 'rgba(0, 245, 255, 0.2)' 
                        : 'transparent',
                      border: `1px solid ${targetMode === mode 
                        ? 'var(--color-accent-primary)' 
                        : 'var(--color-text-dim)'}`,
                      color: targetMode === mode 
                        ? 'var(--color-accent-primary)' 
                        : 'var(--color-text-secondary)',
                    }}
                  >
                    {mode === 'random' && '🎲 Random'}
                    {mode === 'badges' && '🏆 Badges'}
                    {mode === 'attacker' && '⚔️ Attacker'}
                    {mode === 'lowest' && '📉 Lowest'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main board with garbage indicator */}
          <div className="relative" data-testid="game-board">
            <GarbageIndicator pendingLines={roomState.pendingGarbage} data-testid="garbage-indicator" />
            <GameBoard 
              board={gameState.board}
              currentPiece={gameState.currentPiece}
              ghostPosition={ghostPosition}
            />
          </div>

          {/* Next pieces */}
          <PreviewBox pieces={gameState.nextPieces} count={4} />
        </div>

        {/* Right panel: Opponents */}
        <div className="flex flex-col gap-3">
          <p 
            className="font-display text-xs text-center"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            OPPONENTS
          </p>
          {opponents.map((opponent) => (
            <OpponentBoard
              key={opponent.playerId}
              playerId={opponent.playerId}
              name={opponent.name}
              color={opponent.color}
              board={opponent.board}
              score={opponent.score}
              isEliminated={opponent.isEliminated}
              placement={opponent.placement}
              isDisconnected={!opponent.isConnected}
            />
          ))}
          {opponents.length === 0 && (
            <p 
              className="text-xs text-center"
              style={{ color: 'var(--color-text-dim)' }}
            >
              Waiting for<br/>opponents...
            </p>
          )}
        </div>
      </div>

      {/* CRT effects */}
      <div className="scanlines" />
      <div className="vignette" />
    </div>
  );
}

/**
 * Main Online Game Component
 */
export function OnlineGame({ onBack }: OnlineGameProps) {
  const [phase, setPhase] = useState<GamePhase>('menu');
  const [roomCode, setRoomCode] = useState<string>('');
  const [playerName] = useState(() => `Player${Math.floor(Math.random() * 1000)}`);

  // Menu handlers
  const handleCreateGame = useCallback(() => {
    // Generate room code client-side
    const code = Array.from({ length: 6 }, () => 
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
    ).join('');
    setRoomCode(code);
    setPhase('connecting');
  }, []);

  const handleJoinGame = useCallback((code: string) => {
    setRoomCode(code);
    setPhase('connecting');
  }, []);

  const handleBack = useCallback(() => {
    setPhase('menu');
    setRoomCode('');
  }, []);

  // Render menu if no room code
  if (phase === 'menu') {
    return (
      <MultiplayerMenu
        onCreateGame={handleCreateGame}
        onJoinGame={handleJoinGame}
        onBack={onBack}
      />
    );
  }

  // Once we have a room code, render the connected game
  // This ensures usePartySocket only runs with a valid room
  return (
    <ConnectedGame
      roomCode={roomCode}
      playerName={playerName}
      onBack={handleBack}
      onGameOver={() => setPhase('gameOver')}
    />
  );
}
