import type { TetrominoType } from '../game/types';
import { TETROMINO_SHAPES } from '../game/tetrominos';

interface HoldBoxProps {
  piece: TetrominoType | null;
  isLocked?: boolean;
}

function MiniPiece({ type }: { type: TetrominoType }) {
  const shape = TETROMINO_SHAPES[type];
  
  // Find the actual bounds of the piece
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
  
  return (
    <div className="flex flex-col gap-[1px]">
      {trimmedShape.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-[1px]">
          {row.map((filled, colIdx) => (
            <div
              key={colIdx}
              className={filled ? `cell-${type.toLowerCase()}` : ''}
              style={{
                width: 20,
                height: 20,
                borderRadius: 2,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function HoldBox({ piece, isLocked = false }: HoldBoxProps) {
  return (
    <div className="panel">
      <div className="panel-title">Hold</div>
      <div 
        className="flex items-center justify-center min-w-[80px] min-h-[60px]"
        style={{ opacity: isLocked ? 0.3 : 1 }}
      >
        {piece ? <MiniPiece type={piece} /> : null}
      </div>
    </div>
  );
}
