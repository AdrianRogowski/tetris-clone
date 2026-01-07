/**
 * Lobby Component
 * Shows room code, player list, and start button
 */

import { useState } from 'react';
import type { NetworkPlayer } from '../../multiplayer/network/messages';
import type { ConnectionStatus } from '../../multiplayer/network/hooks/usePartySocket';

interface LobbyProps {
  roomCode: string;
  players: NetworkPlayer[];
  myPlayerId: string | null;
  isHost: boolean;
  canStart: boolean;
  countdown: number | null;
  connectionStatus: ConnectionStatus;
  onReady: (isReady: boolean) => void;
  onStart: () => void;
  onLeave: () => void;
}

const PLAYER_COLORS: Record<string, string> = {
  cyan: 'var(--piece-i)',
  green: 'var(--piece-s)',
  orange: 'var(--piece-l)',
  purple: 'var(--piece-t)',
};

export function Lobby({
  roomCode,
  players,
  myPlayerId,
  isHost,
  canStart,
  countdown,
  connectionStatus,
  onReady,
  onStart,
  onLeave,
}: LobbyProps) {
  const [copied, setCopied] = useState(false);
  const myPlayer = players.find(p => p.id === myPlayerId);
  const isReady = myPlayer?.isReady ?? false;

  // Copy room code to clipboard
  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: 'var(--color-void)' }}
    >
      <div className="w-full max-w-lg animate-scale-in">
        {/* Title */}
        <h1 
          className="font-display text-2xl md:text-3xl mb-8 text-center text-glow"
          style={{ color: 'var(--color-accent-primary)' }}
        >
          GAME LOBBY
        </h1>

        {/* Room Code */}
        <div 
          className="panel mb-6 text-center cursor-pointer transition-all"
          onClick={copyRoomCode}
          title="Click to copy"
          style={{
            borderColor: copied ? 'var(--color-accent-success)' : undefined,
          }}
        >
          <p className="panel-title">
            {copied ? '✓ Copied!' : 'Room Code (click to copy)'}
          </p>
          <div className="flex gap-2 justify-center">
            {roomCode.split('').map((char, i) => (
              <span
                key={i}
                className="font-display text-3xl"
                style={{ 
                  color: copied ? 'var(--color-accent-success)' : 'var(--color-accent-gold)',
                  transition: 'color 0.2s',
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: connectionStatus === 'connected' 
                ? 'var(--color-accent-success)' 
                : connectionStatus === 'connecting' 
                  ? 'var(--color-accent-gold)'
                  : 'var(--color-accent-secondary)',
            }}
          />
          <span 
            className="text-xs uppercase"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {connectionStatus}
          </span>
        </div>

        {/* Players List */}
        <div className="panel mb-6">
          <p className="panel-title">Players ({players.length}/4)</p>
          <div className="space-y-3">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center gap-3 p-2 rounded"
                style={{
                  background: player.id === myPlayerId 
                    ? 'rgba(0, 245, 255, 0.1)' 
                    : 'transparent',
                  border: player.id === myPlayerId 
                    ? '1px solid rgba(0, 245, 255, 0.3)' 
                    : '1px solid transparent',
                }}
              >
                {/* Player color indicator */}
                <div
                  className="w-8 h-8 rounded flex items-center justify-center font-display text-xs"
                  style={{
                    background: PLAYER_COLORS[player.color] || 'var(--piece-i)',
                    color: 'var(--color-void)',
                  }}
                >
                  {player.isHost ? '★' : 'P' + (players.indexOf(player) + 1)}
                </div>

                {/* Player name */}
                <span 
                  className="flex-1 font-display text-sm"
                  style={{ color: PLAYER_COLORS[player.color] || 'var(--color-text-primary)' }}
                >
                  {player.name}
                  {player.id === myPlayerId && ' (you)'}
                </span>

                {/* Host badge */}
                {player.isHost && (
                  <span 
                    className="text-xs px-2 py-1 rounded"
                    style={{ 
                      background: 'rgba(255, 215, 0, 0.2)', 
                      color: 'var(--color-accent-gold)',
                    }}
                  >
                    HOST
                  </span>
                )}

                {/* Ready indicator */}
                <span 
                  className="font-display text-xs"
                  style={{ 
                    color: player.isReady 
                      ? 'var(--color-accent-success)' 
                      : 'var(--color-text-dim)',
                  }}
                >
                  {player.isReady ? '✓ READY' : 'NOT READY'}
                </span>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: 4 - players.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center gap-3 p-2 opacity-30"
              >
                <div
                  className="w-8 h-8 rounded border-2 border-dashed"
                  style={{ borderColor: 'var(--color-text-dim)' }}
                />
                <span 
                  className="text-sm"
                  style={{ color: 'var(--color-text-dim)' }}
                >
                  Waiting for player...
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Countdown */}
        {countdown !== null && (
          <div 
            className="text-center mb-6 font-display text-5xl text-glow animate-pulse"
            style={{ color: 'var(--color-accent-gold)' }}
          >
            {countdown}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onLeave}
            className="btn btn-secondary"
          >
            LEAVE
          </button>

          {!isHost ? (
            <button
              onClick={() => onReady(!isReady)}
              className={`btn ${isReady ? 'btn-secondary' : 'btn-primary'}`}
            >
              {isReady ? 'NOT READY' : 'READY'}
            </button>
          ) : (
            <>
              <button
                onClick={() => onReady(!isReady)}
                className={`btn ${isReady ? 'btn-secondary' : 'btn-primary'}`}
              >
                {isReady ? 'NOT READY' : 'READY'}
              </button>
              <button
                onClick={onStart}
                className="btn btn-primary"
                disabled={!canStart}
                style={{ opacity: canStart ? 1 : 0.5 }}
              >
                START GAME
              </button>
            </>
          )}
        </div>

        {/* Waiting message */}
        {!isHost && (
          <p 
            className="text-center mt-6 text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Waiting for host to start...
          </p>
        )}
      </div>

      {/* CRT effects */}
      <div className="scanlines" />
      <div className="vignette" />
    </div>
  );
}
