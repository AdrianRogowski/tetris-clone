import type { TetrominoType } from '../game/types';
import { TETROMINO_SHAPES } from '../game/tetrominos';
import { Cell } from './Cell';

interface PreviewBoxProps {
  pieces: TetrominoType[];
  count?: number;
  compact?: boolean; // Horizontal layout for mobile
}

function MiniPiece({ type, scale = 1 }: { type: TetrominoType; scale?: number }) {
  const shape = TETROMINO_SHAPES[type];
  
  // Find the actual bounds of the piece (trim empty rows/cols)
  let minRow = shape.length, maxRow = 0;
  let minCol = shape[0].length, maxCol = 0;
  
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        minRow = Math.min(minRow, row);
        maxRow = Math.max(maxRow, row);
        minCol = Math.min(minCol, col);
        maxCol = Math.max(maxCol, col);
      }
    }
  }
  
  const trimmedShape = [];
  for (let row = minRow; row <= maxRow; row++) {
    const rowCells = [];
    for (let col = minCol; col <= maxCol; col++) {
      rowCells.push(shape[row][col]);
    }
    trimmedShape.push(rowCells);
  }
  
  const cellSize = Math.floor(20 * scale);
  
  return (
    <div className="flex flex-col gap-[1px]">
      {trimmedShape.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-[1px]">
          {row.map((filled, colIdx) => (
            <div
              key={colIdx}
              className={filled ? `cell-${type.toLowerCase()}` : ''}
              style={{
                width: cellSize,
                height: cellSize,
                borderRadius: 2,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PreviewBox({ pieces, count = 3, compact = false }: PreviewBoxProps) {
  const displayPieces = pieces.slice(0, count);
  
  // Compact horizontal layout for mobile
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span 
          className="font-display text-[8px]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          NEXT
        </span>
        {displayPieces.map((piece, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-center"
            style={{ 
              opacity: idx === 0 ? 1 : 0.5,
            }}
          >
            <MiniPiece type={piece} scale={0.5} />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="panel">
      <div className="panel-title">Next</div>
      <div className="flex flex-col gap-4 items-center min-w-[80px]">
        {displayPieces.map((piece, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-center"
            style={{ 
              opacity: idx === 0 ? 1 : 0.5 - idx * 0.1,
              transform: `scale(${idx === 0 ? 1 : 0.8 - idx * 0.1})`,
            }}
          >
            <MiniPiece type={piece} scale={idx === 0 ? 1 : 0.8} />
          </div>
        ))}
      </div>
    </div>
  );
}
