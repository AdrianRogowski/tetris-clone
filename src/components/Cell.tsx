import type { TetrominoType } from '../game/types';

interface CellProps {
  type: TetrominoType | null;
  isGhost?: boolean;
  isClearing?: boolean;
}

export function Cell({ type, isGhost = false, isClearing = false }: CellProps) {
  const baseClass = 'w-[var(--cell-size)] h-[var(--cell-size)] rounded-[var(--cell-radius)] transition-all duration-75';
  
  if (isClearing) {
    return <div className={`${baseClass} line-clearing`} />;
  }
  
  if (isGhost && type) {
    return <div className={`${baseClass} cell-ghost`} />;
  }
  
  if (!type) {
    return (
      <div 
        className={`${baseClass}`}
        style={{ background: 'var(--color-grid-bg)', border: '1px solid var(--color-grid-line)' }}
      />
    );
  }
  
  return <div className={`${baseClass} cell-${type.toLowerCase()}`} />;
}
