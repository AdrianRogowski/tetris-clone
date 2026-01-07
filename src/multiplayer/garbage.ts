/**
 * Garbage line calculation and management
 */

import type { GarbageResult, GarbageAttack, PlayerId } from './types';
import type { Board, Cell } from '../game/types';

/** Garbage lines sent based on lines cleared */
const GARBAGE_TABLE: Record<number, number> = {
  1: 0, // Single
  2: 1, // Double
  3: 2, // Triple
  4: 4, // Tetris
};

/**
 * Calculate garbage lines to send based on lines cleared
 */
export function calculateGarbage(
  linesCleared: number,
  wasBackToBack: boolean = false
): GarbageResult {
  const baseGarbage = GARBAGE_TABLE[linesCleared] ?? 0;
  
  // Back-to-back bonus only applies if clearing 4 lines (or later, T-spins)
  // and only if base garbage > 0
  const backToBackBonus = wasBackToBack && baseGarbage > 0 ? 1 : 0;
  
  return {
    linesSent: baseGarbage + backToBackBonus,
    isBackToBack: wasBackToBack,
  };
}

/**
 * Create a garbage attack from one player to another
 */
export function createGarbageAttack(
  fromPlayerId: PlayerId,
  toPlayerId: PlayerId,
  lines: number
): GarbageAttack {
  return {
    fromPlayerId,
    toPlayerId,
    lines,
    timestamp: Date.now(),
  };
}

/**
 * Generate a garbage line (full row with one random gap)
 */
export function generateGarbageLine(width: number = 10): Cell[] {
  const line: Cell[] = [];
  const gapPosition = Math.floor(Math.random() * width);
  
  for (let x = 0; x < width; x++) {
    line.push(x === gapPosition ? null : 'G' as Cell);
  }
  
  return line;
}

/**
 * Apply pending garbage to a player's board
 * Returns the new board with garbage lines added at the bottom
 */
export function applyGarbage(board: Board, garbageLines: number): Board {
  if (garbageLines <= 0) return board;
  
  // Generate garbage lines
  const newGarbageLines: Cell[][] = [];
  for (let i = 0; i < garbageLines; i++) {
    newGarbageLines.push(generateGarbageLine(board[0]?.length ?? 10));
  }
  
  // Create new board: remove top rows, add garbage at bottom
  const newBoard: Board = [];
  
  // Copy rows from the original board, starting from garbageLines
  // This effectively "pushes up" existing pieces
  for (let y = garbageLines; y < board.length; y++) {
    newBoard.push([...board[y]]);
  }
  
  // Add garbage lines at the bottom
  for (const garbageLine of newGarbageLines) {
    newBoard.push(garbageLine);
  }
  
  return newBoard;
}

/**
 * Cancel pending garbage with line clears
 * Returns remaining garbage after cancellation
 */
export function cancelGarbage(pendingGarbage: number, linesCleared: number): number {
  return Math.max(0, pendingGarbage - linesCleared);
}

/**
 * Calculate net garbage (what gets sent after cancellation)
 */
export function calculateNetGarbage(
  garbageToSend: number,
  pendingGarbage: number
): { sent: number; remaining: number } {
  if (garbageToSend >= pendingGarbage) {
    return {
      sent: garbageToSend - pendingGarbage,
      remaining: 0,
    };
  } else {
    return {
      sent: 0,
      remaining: pendingGarbage - garbageToSend,
    };
  }
}
