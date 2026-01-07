/**
 * Opponent Board Component
 * Shows a miniature view of an opponent's board
 */

import type { Board } from '../../game/types';

interface OpponentBoardProps {
  playerId: string;
  name: string;
  color: string;
  board: Board | null;
  score: number;
  isEliminated: boolean;
  placement: number | null;
  isDisconnected?: boolean;
}

const PLAYER_COLORS: Record<string, string> = {
  cyan: 'var(--piece-i)',
  green: 'var(--piece-s)',
  orange: 'var(--piece-l)',
  purple: 'var(--piece-t)',
};

export function OpponentBoard({
  name,
  color,
  board,
  score,
  isEliminated,
  placement,
  isDisconnected,
}: OpponentBoardProps) {
  const cellSize = 8; // Mini cells
  const boardWidth = 10;
  const boardHeight = 20;
  const borderColor = PLAYER_COLORS[color] || 'var(--piece-i)';

  return (
    <div 
      className="panel p-2"
      style={{
        borderColor: isEliminated ? 'var(--color-text-dim)' : borderColor,
        opacity: isEliminated ? 0.5 : 1,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-1">
        <span 
          className="font-display text-xs truncate"
          style={{ color: borderColor, maxWidth: '80px' }}
        >
          {name}
        </span>
        <span 
          className="text-xs"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {score.toLocaleString()}
        </span>
      </div>

      {/* Mini Board */}
      <div
        className="relative"
        style={{
          width: boardWidth * cellSize,
          height: boardHeight * cellSize,
          background: 'var(--color-grid-bg)',
          border: '1px solid var(--color-grid-line)',
        }}
      >
        {/* Board cells */}
        {board && board.slice(2).map((row, y) => (
          row.map((cell, x) => cell && (
            <div
              key={`${x}-${y}`}
              style={{
                position: 'absolute',
                left: x * cellSize,
                top: y * cellSize,
                width: cellSize - 1,
                height: cellSize - 1,
                background: `var(--piece-${cell.toLowerCase()})`,
              }}
            />
          ))
        ))}

        {/* Overlay for eliminated/disconnected */}
        {(isEliminated || isDisconnected) && (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(0, 0, 0, 0.7)' }}
          >
            <span 
              className="font-display text-xs text-center"
              style={{ color: 'var(--color-accent-secondary)' }}
            >
              {isDisconnected ? 'DISCONNECTED' : (
                <>
                  OUT<br/>
                  <span style={{ color: 'var(--color-text-dim)' }}>
                    {placement ? `${placement}${getOrdinalSuffix(placement)}` : ''}
                  </span>
                </>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
