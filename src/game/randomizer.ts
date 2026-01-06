/**
 * 7-bag randomizer for fair tetromino distribution
 * Ensures each piece appears exactly once per bag of 7
 */

import type { TetrominoType } from './types';

/** All tetromino types */
export const ALL_TETROMINOS: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}

/**
 * Generate a new shuffled bag of all 7 tetrominos
 */
export function generateBag(): TetrominoType[] {
  return shuffle([...ALL_TETROMINOS]);
}

/**
 * Create a randomizer state with initial bags
 * Returns an object with the queue of upcoming pieces
 */
export function createRandomizer(): { queue: TetrominoType[] } {
  // Start with two bags for look-ahead
  const queue = [...generateBag(), ...generateBag()];
  return { queue };
}

/**
 * Get the next piece from the queue and refill if needed
 * @returns [nextPiece, updatedQueue]
 */
export function getNextPiece(queue: TetrominoType[]): [TetrominoType, TetrominoType[]] {
  const newQueue = [...queue];
  const nextPiece = newQueue.shift()!;
  
  // Refill with a new bag when running low (less than 7 pieces)
  if (newQueue.length < 7) {
    newQueue.push(...generateBag());
  }
  
  return [nextPiece, newQueue];
}

/**
 * Peek at upcoming pieces without removing them
 * @param count Number of pieces to peek
 */
export function peekPieces(queue: TetrominoType[], count: number): TetrominoType[] {
  return queue.slice(0, count);
}
