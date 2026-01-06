/**
 * Scoring system and level progression
 */

import type { ScoreEvent } from './types';

/** Points awarded for line clears (multiplied by level) */
export const LINE_CLEAR_POINTS: Record<1 | 2 | 3 | 4, number> = {
  1: 100,  // Single
  2: 300,  // Double
  3: 500,  // Triple
  4: 800,  // Tetris
};

/** Points per cell for drops */
export const SOFT_DROP_POINTS_PER_CELL = 1;
export const HARD_DROP_POINTS_PER_CELL = 2;

/** Lines required to advance to next level (level * this value) */
export const LINES_PER_LEVEL = 10;

/** Fall speed in milliseconds per row drop, by level */
export const LEVEL_SPEEDS: Record<number, number> = {
  1: 1000,
  2: 900,
  3: 800,
  4: 700,
  5: 600,
  6: 500,
  7: 450,
  8: 400,
  9: 350,
  10: 300,
  11: 250,
  12: 200,
  13: 150,
  14: 100,
  15: 80,
  16: 60,
  17: 50,
  18: 40,
  19: 30,
  20: 20,
};

/**
 * Calculate points for a score event
 */
export function calculatePoints(event: ScoreEvent, level: number): number {
  switch (event.type) {
    case 'softDrop':
      return event.cells * SOFT_DROP_POINTS_PER_CELL;
    
    case 'hardDrop':
      return event.cells * HARD_DROP_POINTS_PER_CELL;
    
    case 'lineClear':
      return LINE_CLEAR_POINTS[event.lines] * level;
    
    default:
      return 0;
  }
}

/**
 * Calculate the level based on total lines cleared
 * Starts at level 1
 */
export function calculateLevel(linesCleared: number): number {
  return Math.floor(linesCleared / LINES_PER_LEVEL) + 1;
}

/**
 * Get the fall speed for a given level
 * Returns milliseconds per row drop
 */
export function getFallSpeed(level: number): number {
  if (level <= 0) return LEVEL_SPEEDS[1];
  if (level >= 20) return LEVEL_SPEEDS[20];
  return LEVEL_SPEEDS[level] ?? LEVEL_SPEEDS[20];
}

/**
 * Check if a level up occurred
 */
export function didLevelUp(previousLines: number, newLines: number): boolean {
  if (newLines <= previousLines) return false;
  
  const previousLevel = calculateLevel(previousLines);
  const newLevel = calculateLevel(newLines);
  
  return newLevel > previousLevel;
}

/**
 * Get lines needed to reach next level
 */
export function getLinesUntilNextLevel(currentLines: number, currentLevel: number): number {
  const linesForNextLevel = currentLevel * LINES_PER_LEVEL;
  return linesForNextLevel - currentLines;
}
