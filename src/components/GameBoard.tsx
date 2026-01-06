import type { Board, Piece, Position, TetrominoType } from '../game/types';
import { getPieceCells } from '../game/tetrominos';
import { BOARD_WIDTH, BOARD_HEIGHT, BOARD_BUFFER } from '../game/board';
import { Cell } from './Cell';

interface GameBoardProps {
  board: Board;
  currentPiece: Piece | null;
  ghostPosition: Position | null;
  clearingLines?: number[];
}

export function GameBoard({ board, currentPiece, ghostPosition, clearingLines = [] }: GameBoardProps) {
  // Get current piece cells
  const pieceCells = currentPiece 
    ? getPieceCells(currentPiece.type, currentPiece.position, currentPiece.rotation)
    : [];
  
  // Get ghost piece cells
  const ghostCells = currentPiece && ghostPosition
    ? getPieceCells(currentPiece.type, ghostPosition, currentPiece.rotation)
    : [];

  // Check if a position has the current piece
  const isPieceCell = (x: number, y: number): TetrominoType | null => {
    for (const cell of pieceCells) {
      if (cell.x === x && cell.y === y) {
        return currentPiece!.type;
      }
    }
    return null;
  };

  // Check if a position has the ghost piece
  const isGhostCell = (x: number, y: number): boolean => {
    for (const cell of ghostCells) {
      if (cell.x === x && cell.y === y) {
        return true;
      }
    }
    return false;
  };

  // Render only visible rows (skip buffer)
  const visibleRows = [];
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    const row = [];
    const boardY = y + BOARD_BUFFER;
    const isLineClearing = clearingLines.includes(boardY);
    
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const pieceType = isPieceCell(x, y);
      const boardCell = board[boardY]?.[x] || null;
      const isGhost = isGhostCell(x, y) && !pieceType && !boardCell;
      
      row.push(
        <Cell 
          key={`${x}-${y}`}
          type={pieceType || boardCell}
          isGhost={isGhost}
          isClearing={isLineClearing}
        />
      );
    }
    visibleRows.push(
      <div key={y} className="flex gap-[var(--cell-gap)]">
        {row}
      </div>
    );
  }

  return (
    <div 
      className="panel p-2 inline-block"
      style={{ 
        background: 'var(--color-grid-bg)',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 60px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="flex flex-col gap-[var(--cell-gap)]">
        {visibleRows}
      </div>
    </div>
  );
}
