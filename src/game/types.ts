/**
 * Core type definitions for the Tetris game
 */

/** The 7 standard tetromino types */
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

/** Rotation state (0=spawn, 1=90°CW, 2=180°, 3=270°CW) */
export type RotationState = 0 | 1 | 2 | 3;

/** Position on the game board */
export interface Position {
  x: number;
  y: number;
}

/** A tetromino piece with its current state */
export interface Piece {
  type: TetrominoType;
  position: Position;
  rotation: RotationState;
}

/** A single cell on the board (null = empty, string = piece color) */
export type Cell = TetrominoType | null;

/** The game board as a 2D array (row-major, y=0 is top) */
export type Board = Cell[][];

/** Game state enumeration */
export type GameState = 'idle' | 'playing' | 'paused' | 'gameOver';

/** Score event types for calculating points */
export type ScoreEvent =
  | { type: 'softDrop'; cells: number }
  | { type: 'hardDrop'; cells: number }
  | { type: 'lineClear'; lines: 1 | 2 | 3 | 4 };

/** High score entry */
export interface HighScore {
  score: number;
  level: number;
  lines: number;
  date: string;
}

/** Complete game data */
export interface GameData {
  board: Board;
  currentPiece: Piece | null;
  nextPieces: TetrominoType[];
  heldPiece: TetrominoType | null;
  canHold: boolean;
  score: number;
  level: number;
  lines: number;
  state: GameState;
}
