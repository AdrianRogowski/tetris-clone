/**
 * Garbage Indicator Component
 * Shows pending garbage lines that will be added to the player's board
 */

interface GarbageIndicatorProps {
  pendingLines: number;
}

export function GarbageIndicator({ pendingLines }: GarbageIndicatorProps) {
  if (pendingLines <= 0) return null;

  // Visual representation: each segment = 1 line, max display 10
  const segments = Math.min(pendingLines, 10);
  const cellHeight = 28; // Match main board cell size

  return (
    <div 
      className="absolute left-0 bottom-0 w-3 flex flex-col-reverse gap-px"
      style={{ 
        height: 20 * cellHeight, // Full board height
        transform: 'translateX(-100%)',
        marginLeft: '-4px',
      }}
    >
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={i < 4 ? 'animate-pulse' : ''}
          style={{
            height: cellHeight - 1,
            background: 'var(--color-accent-secondary)',
            boxShadow: '0 0 8px var(--color-accent-secondary)',
            opacity: 1 - (i * 0.08),
          }}
        />
      ))}
      
      {/* Warning text */}
      <div 
        className="absolute -top-6 left-0 font-display text-xs whitespace-nowrap"
        style={{ color: 'var(--color-accent-secondary)' }}
      >
        ⚠️ {pendingLines}
      </div>
    </div>
  );
}
