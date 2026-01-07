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
  mini?: boolean; // Extra small for mobile horizontal scroll
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
  mini = false,
}: OpponentBoardProps) {
  const cellSize = mini ? 5 : 8; // Even smaller for mobile mini view
  const boardWidth = 10;
  const boardHeight = mini ? 12 : 20; // Shorter for mini view
  const borderColor = PLAYER_COLORS[color] || 'var(--piece-i)';

  return (
    <div 
      className={`panel p-2 ${mini ? 'opponent-board-mini shrink-0' : ''}`}
      data-mini={mini}
      style={{
        borderColor: isEliminated ? 'var(--color-text-dim)' : borderColor,
        opacity: isEliminated ? 0.5 : 1,
        minWidth: mini ? 'auto' : undefined,
      }}
    >
      {/* Header */}
      <div className={`flex items-center mb-1 ${mini ? 'gap-1 justify-center' : 'justify-between'}`}>
        <span 
          className={`font-display truncate ${mini ? 'text-[8px]' : 'text-xs'}`}
          style={{ color: borderColor, maxWidth: mini ? '50px' : '80px' }}
        >
          {name}
        </span>
        <span 
          className={mini ? 'text-[8px]' : 'text-xs'}
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
        {/* Board cells - skip more rows for mini view */}
        {board && board.slice(mini ? 10 : 2).map((row, y) => (
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
