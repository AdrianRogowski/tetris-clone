/**
 * Multiplayer Menu Component
 * Entry point for online multiplayer - Create or Join game
 */

import { useState } from 'react';

interface MultiplayerMenuProps {
  onCreateGame: () => void;
  onJoinGame: (roomCode: string) => void;
  onBack: () => void;
}

export function MultiplayerMenu({ onCreateGame, onJoinGame, onBack }: MultiplayerMenuProps) {
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleJoinSubmit = () => {
    const code = roomCode.toUpperCase().trim();
    if (code.length !== 6) {
      setError('Room code must be 6 characters');
      return;
    }
    if (!/^[A-Z0-9]+$/.test(code)) {
      setError('Room code must be letters and numbers only');
      return;
    }
    setError(null);
    onJoinGame(code);
  };

  const handleInputChange = (value: string) => {
    setRoomCode(value.toUpperCase().slice(0, 6));
    setError(null);
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: 'var(--color-void)' }}
    >
      <div className="text-center animate-scale-in">
        {/* Title */}
        <h1 
          className="font-display text-3xl md:text-4xl mb-12 text-glow"
          style={{ color: 'var(--color-accent-primary)' }}
        >
          MULTIPLAYER
        </h1>

        {/* Main buttons or Join input */}
        {!showJoinInput ? (
          <div className="flex flex-col gap-4 items-center">
            <button
              onClick={onCreateGame}
              className="btn btn-primary w-64"
              style={{ fontSize: '14px', padding: '16px 24px' }}
            >
              CREATE GAME
            </button>

            <button
              onClick={() => setShowJoinInput(true)}
              className="btn btn-secondary w-64"
              style={{ fontSize: '14px', padding: '16px 24px' }}
            >
              JOIN GAME
            </button>

            <button
              onClick={onBack}
              className="btn btn-secondary mt-8"
              style={{ fontSize: '10px', opacity: 0.7 }}
            >
              ← BACK TO MENU
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center">
            <p 
              className="font-display text-sm mb-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Enter Room Code
            </p>

            {/* Room code visual display */}
            <div className="flex gap-2 justify-center mb-4">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-12 h-14 flex items-center justify-center font-display text-2xl"
                  style={{
                    background: 'var(--color-chrome)',
                    border: '2px solid',
                    borderColor: roomCode[i] ? 'var(--color-accent-primary)' : 'var(--color-text-dim)',
                    borderRadius: '4px',
                    color: 'var(--color-accent-gold)',
                  }}
                >
                  {roomCode[i] || '_'}
                </div>
              ))}
            </div>

            {/* Visible input for typing/pasting */}
            <input
              type="text"
              value={roomCode}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinSubmit()}
              onPaste={(e) => {
                e.preventDefault();
                const pasted = e.clipboardData.getData('text');
                handleInputChange(pasted);
              }}
              placeholder="Paste or type code..."
              className="font-display text-sm text-center w-64 px-4 py-2 rounded"
              style={{
                background: 'var(--color-chrome)',
                border: '1px solid var(--color-text-dim)',
                color: 'var(--color-text-primary)',
                outline: 'none',
              }}
              autoFocus
              maxLength={6}
            />

            {/* Error message */}
            {error && (
              <p 
                className="font-display text-xs"
                style={{ color: 'var(--color-accent-secondary)' }}
              >
                {error}
              </p>
            )}

            {/* Buttons */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  setShowJoinInput(false);
                  setRoomCode('');
                  setError(null);
                }}
                className="btn btn-secondary"
              >
                BACK
              </button>

              <button
                onClick={handleJoinSubmit}
                className="btn btn-primary"
                disabled={roomCode.length !== 6}
                style={{
                  opacity: roomCode.length !== 6 ? 0.5 : 1,
                }}
              >
                JOIN
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CRT effects */}
      <div className="scanlines" />
      <div className="vignette" />
    </div>
  );
}
