/**
 * Game board logic: collision detection, line clearing, piece placement
 */

import type { Board, Piece, Position, TetrominoType, RotationState } from './types';
import { getPieceCells, SPAWN_POSITIONS } from './tetrominos';

/** Standard Tetris board dimensions */
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const BOARD_BUFFER = 2; // Hidden rows above visible area

/** Total board rows including buffer */
const TOTAL_ROWS = BOARD_HEIGHT + BOARD_BUFFER;

/**
 * Create an empty game board
 * Rows 0-1 are buffer (above visible), rows 2-21 are visible
 * @returns A 2D array of null values (empty cells)
 */
export function createEmptyBoard(): Board {
  const board: Board = [];
  for (let y = 0; y < TOTAL_ROWS; y++) {
    const row: (TetrominoType | null)[] = [];
    for (let x = 0; x < BOARD_WIDTH; x++) {
      row.push(null);
    }
    board.push(row);
  }
  return board;
}

/**
 * Convert game y coordinate to board array index
 * Game y: -2 to 19 (where -2 to -1 is buffer, 0 to 19 is visible)
 * Board index: 0 to 21
 */
function toBoardY(gameY: number): number {
  return gameY + BOARD_BUFFER;
}

/**
 * Check if a position is within the board bounds
 */
export function isWithinBounds(x: number, y: number): boolean {
  return x >= 0 && x < BOARD_WIDTH && y >= -BOARD_BUFFER && y < BOARD_HEIGHT;
}

/**
 * Check if a cell is empty (not occupied by a locked piece)
 */
export function isCellEmpty(board: Board, x: number, y: number): boolean {
  // Out of bounds is not empty (collision)
  if (x < 0 || x >= BOARD_WIDTH) return false;
  if (y >= BOARD_HEIGHT) return false;
  if (y < -BOARD_BUFFER) return false;
  
  const boardY = toBoardY(y);
  if (boardY < 0 || boardY >= board.length) return false;
  
  return board[boardY][x] === null;
}

/**
 * Check if a piece can be placed at the given position
 * Returns true if all cells of the piece are within bounds and don't collide
 */
export function canPlacePiece(
  board: Board,
  type: TetrominoType,
  position: Position,
  rotation: number
): boolean {
  const cells = getPieceCells(type, position, rotation as RotationState);
  
  for (const cell of cells) {
    // Check left/right bounds
    if (cell.x < 0 || cell.x >= BOARD_WIDTH) return false;
    
    // Check bottom bound
    if (cell.y >= BOARD_HEIGHT) return false;
    
    // Check collision with existing pieces
    const boardY = toBoardY(cell.y);
    if (boardY >= 0 && boardY < board.length) {
      if (board[boardY][cell.x] !== null) return false;
    }
  }
  
  return true;
}

/**
 * Lock a piece onto the board (make it permanent)
 * Returns a new board with the piece cells filled in
 */
export function lockPiece(board: Board, piece: Piece): Board {
  // Create a deep copy of the board
  const newBoard: Board = board.map(row => [...row]);
  
  const cells = getPieceCells(piece.type, piece.position, piece.rotation);
  
  for (const cell of cells) {
    const boardY = toBoardY(cell.y);
    if (boardY >= 0 && boardY < newBoard.length && cell.x >= 0 && cell.x < BOARD_WIDTH) {
      newBoard[boardY][cell.x] = piece.type;
    }
  }
  
  return newBoard;
}

/**
 * Find all completed (full) lines on the board
 * @returns Array of row indices that are complete
 */
export function findCompletedLines(board: Board): number[] {
  const completedLines: number[] = [];
  
  for (let y = 0; y < board.length; y++) {
    const isComplete = board[y].every(cell => cell !== null);
    if (isComplete) {
      completedLines.push(y);
    }
  }
  
  return completedLines.sort((a, b) => a - b);
}

/**
 * Clear completed lines and drop rows above
 * @returns New board with lines cleared
 */
export function clearLines(board: Board, lineIndices: number[]): Board {
  if (lineIndices.length === 0) return board;
  
  // Create new board without the cleared lines
  const newBoard: Board = [];
  
  for (let y = 0; y < board.length; y++) {
    if (!lineIndices.includes(y)) {
      newBoard.push([...board[y]]);
    }
  }
  
  // Add empty rows at the top to maintain board height
  while (newBoard.length < TOTAL_ROWS) {
    const emptyRow: (TetrominoType | null)[] = [];
    for (let x = 0; x < BOARD_WIDTH; x++) {
      emptyRow.push(null);
    }
    newBoard.unshift(emptyRow);
  }
  
  return newBoard;
}

/**
 * Calculate where a piece would land if hard dropped
 * @returns The position where the piece would lock
 */
export function getGhostPosition(
  board: Board,
  type: TetrominoType,
  position: Position,
  rotation: number
): Position {
  let ghostY = position.y;
  
  // Move down until we can't anymore
  while (canPlacePiece(board, type, { x: position.x, y: ghostY + 1 }, rotation)) {
    ghostY++;
  }
  
  return { x: position.x, y: ghostY };
}

/**
 * Check if the game is over (piece spawns in collision)
 */
export function isBlockOut(board: Board, type: TetrominoType): boolean {
  const spawnPos = SPAWN_POSITIONS[type];
  return !canPlacePiece(board, type, spawnPos, 0);
}

/**
 * Check if any part of a locked piece is above the visible playfield
 */
export function isLockOut(piece: Piece): boolean {
  const cells = getPieceCells(piece.type, piece.position, piece.rotation);
  
  // If any cell is at y < 0 (above visible playfield), it's lock out
  return cells.some(cell => cell.y < 0);
}
