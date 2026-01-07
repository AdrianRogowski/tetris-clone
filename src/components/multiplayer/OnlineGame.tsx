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
import { GameOverScreen } from '../Overlay';
import type { GameData } from '../../game/types';
import { 
  createGameState, 
  startGame,
} from '../../game/gameState';
import { getGhostPiece } from '../../game/gameState';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useKeyboardControls } from '../../hooks/useKeyboardControls';
import { calculateGarbage, applyGarbage } from '../../multiplayer/garbage';

type GamePhase = 'menu' | 'connecting' | 'lobby' | 'playing' | 'gameOver';

interface OnlineGameProps {
  onBack: () => void;
}

// Default PartyKit host - change this after deploying
const PARTY_HOST = 'localhost:1999';

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

  // Playing phase - multiplayer game view
  return (
    <div 
      className="game-container min-h-screen flex items-center justify-center p-4"
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
          <div className="relative">
            <GarbageIndicator pendingLines={roomState.pendingGarbage} />
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
