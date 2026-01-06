/**
 * Tests for Scoring and Level Progression
 * Covers: Point calculation, level progression, speed settings
 */

import { describe, it, expect } from 'vitest';
import {
  LINE_CLEAR_POINTS,
  SOFT_DROP_POINTS_PER_CELL,
  HARD_DROP_POINTS_PER_CELL,
  LINES_PER_LEVEL,
  LEVEL_SPEEDS,
  calculatePoints,
  calculateLevel,
  getFallSpeed,
  didLevelUp,
  getLinesUntilNextLevel,
} from './scoring';
import type { ScoreEvent } from './types';

describe('Scoring Constants', () => {
  describe('LINE_CLEAR_POINTS', () => {
    it('should award 100 points for single line', () => {
      expect(LINE_CLEAR_POINTS[1]).toBe(100);
    });

    it('should award 300 points for double', () => {
      expect(LINE_CLEAR_POINTS[2]).toBe(300);
    });

    it('should award 500 points for triple', () => {
      expect(LINE_CLEAR_POINTS[3]).toBe(500);
    });

    it('should award 800 points for Tetris', () => {
      expect(LINE_CLEAR_POINTS[4]).toBe(800);
    });

    it('should make Tetris more valuable than 4 singles', () => {
      expect(LINE_CLEAR_POINTS[4]).toBeGreaterThan(LINE_CLEAR_POINTS[1] * 4);
    });
  });

  describe('Drop Points', () => {
    it('should award 1 point per cell for soft drop', () => {
      expect(SOFT_DROP_POINTS_PER_CELL).toBe(1);
    });

    it('should award 2 points per cell for hard drop', () => {
      expect(HARD_DROP_POINTS_PER_CELL).toBe(2);
    });

    it('should make hard drop more valuable than soft drop', () => {
      expect(HARD_DROP_POINTS_PER_CELL).toBeGreaterThan(SOFT_DROP_POINTS_PER_CELL);
    });
  });

  describe('LINES_PER_LEVEL', () => {
    it('should require 10 lines per level', () => {
      expect(LINES_PER_LEVEL).toBe(10);
    });
  });

  describe('LEVEL_SPEEDS', () => {
    it('should start at 1000ms for level 1', () => {
      expect(LEVEL_SPEEDS[1]).toBe(1000);
    });

    it('should get faster at higher levels', () => {
      expect(LEVEL_SPEEDS[5]).toBeLessThan(LEVEL_SPEEDS[1]);
      expect(LEVEL_SPEEDS[10]).toBeLessThan(LEVEL_SPEEDS[5]);
      expect(LEVEL_SPEEDS[15]).toBeLessThan(LEVEL_SPEEDS[10]);
    });

    it('should have reasonable minimum speed at level 20', () => {
      expect(LEVEL_SPEEDS[20]).toBeGreaterThan(0);
      expect(LEVEL_SPEEDS[20]).toBeLessThanOrEqual(50);
    });

    it('should define speeds for levels 1-20', () => {
      for (let level = 1; level <= 20; level++) {
        expect(LEVEL_SPEEDS[level]).toBeDefined();
        expect(LEVEL_SPEEDS[level]).toBeGreaterThan(0);
      }
    });
  });
});

describe('calculatePoints', () => {
  describe('Soft Drop', () => {
    it('should calculate points for soft drop', () => {
      const event: ScoreEvent = { type: 'softDrop', cells: 5 };
      expect(calculatePoints(event, 1)).toBe(5);
    });

    it('should not multiply soft drop by level', () => {
      const event: ScoreEvent = { type: 'softDrop', cells: 5 };
      expect(calculatePoints(event, 1)).toBe(calculatePoints(event, 10));
    });

    it('should return 0 for 0 cells', () => {
      const event: ScoreEvent = { type: 'softDrop', cells: 0 };
      expect(calculatePoints(event, 1)).toBe(0);
    });
  });

  describe('Hard Drop', () => {
    it('should calculate points for hard drop', () => {
      const event: ScoreEvent = { type: 'hardDrop', cells: 10 };
      expect(calculatePoints(event, 1)).toBe(20);
    });

    it('should not multiply hard drop by level', () => {
      const event: ScoreEvent = { type: 'hardDrop', cells: 10 };
      expect(calculatePoints(event, 1)).toBe(calculatePoints(event, 5));
    });
  });

  describe('Line Clears', () => {
    it('should calculate single line clear points', () => {
      const event: ScoreEvent = { type: 'lineClear', lines: 1 };
      expect(calculatePoints(event, 1)).toBe(100);
    });

    it('should calculate double line clear points', () => {
      const event: ScoreEvent = { type: 'lineClear', lines: 2 };
      expect(calculatePoints(event, 1)).toBe(300);
    });

    it('should calculate triple line clear points', () => {
      const event: ScoreEvent = { type: 'lineClear', lines: 3 };
      expect(calculatePoints(event, 1)).toBe(500);
    });

    it('should calculate Tetris points', () => {
      const event: ScoreEvent = { type: 'lineClear', lines: 4 };
      expect(calculatePoints(event, 1)).toBe(800);
    });

    it('should multiply line clear points by level', () => {
      const event: ScoreEvent = { type: 'lineClear', lines: 1 };
      expect(calculatePoints(event, 5)).toBe(500);
      expect(calculatePoints(event, 10)).toBe(1000);
    });

    it('should multiply Tetris points by level', () => {
      const event: ScoreEvent = { type: 'lineClear', lines: 4 };
      expect(calculatePoints(event, 5)).toBe(4000);
    });
  });
});

describe('calculateLevel', () => {
  it('should start at level 1 with 0 lines', () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it('should stay at level 1 until 10 lines', () => {
    expect(calculateLevel(1)).toBe(1);
    expect(calculateLevel(5)).toBe(1);
    expect(calculateLevel(9)).toBe(1);
  });

  it('should advance to level 2 at 10 lines', () => {
    expect(calculateLevel(10)).toBe(2);
  });

  it('should advance to level 3 at 20 lines', () => {
    expect(calculateLevel(20)).toBe(3);
  });

  it('should calculate correct level for high line counts', () => {
    expect(calculateLevel(50)).toBe(6);
    expect(calculateLevel(100)).toBe(11);
    expect(calculateLevel(150)).toBe(16);
  });

  it('should handle level cap if implemented', () => {
    // Level 20 is typically max in classic Tetris
    const highLevel = calculateLevel(200);
    expect(highLevel).toBeGreaterThanOrEqual(20);
  });
});

describe('getFallSpeed', () => {
  it('should return level 1 speed for level 1', () => {
    expect(getFallSpeed(1)).toBe(1000);
  });

  it('should return faster speed for higher levels', () => {
    expect(getFallSpeed(10)).toBe(300);
    expect(getFallSpeed(15)).toBe(80);
  });

  it('should cap speed at level 20 for higher levels', () => {
    expect(getFallSpeed(25)).toBe(getFallSpeed(20));
    expect(getFallSpeed(100)).toBe(getFallSpeed(20));
  });

  it('should return level 1 speed for level 0 or negative', () => {
    expect(getFallSpeed(0)).toBe(LEVEL_SPEEDS[1]);
    expect(getFallSpeed(-1)).toBe(LEVEL_SPEEDS[1]);
  });
});

describe('didLevelUp', () => {
  it('should return false when staying at same level', () => {
    expect(didLevelUp(5, 6)).toBe(false);
    expect(didLevelUp(8, 9)).toBe(false);
  });

  it('should return true when crossing level boundary', () => {
    expect(didLevelUp(9, 10)).toBe(true);
    expect(didLevelUp(19, 20)).toBe(true);
  });

  it('should return true when clearing multiple levels at once', () => {
    expect(didLevelUp(8, 14)).toBe(true); // level 1 to 2
  });

  it('should return false when lines decrease (edge case)', () => {
    expect(didLevelUp(15, 10)).toBe(false);
  });

  it('should return false when no change', () => {
    expect(didLevelUp(10, 10)).toBe(false);
  });
});

describe('getLinesUntilNextLevel', () => {
  it('should return 10 at start of game', () => {
    expect(getLinesUntilNextLevel(0, 1)).toBe(10);
  });

  it('should return remaining lines in current level', () => {
    expect(getLinesUntilNextLevel(5, 1)).toBe(5);
    expect(getLinesUntilNextLevel(12, 2)).toBe(8);
  });

  it('should return 10 when exactly at level threshold', () => {
    expect(getLinesUntilNextLevel(10, 2)).toBe(10);
    expect(getLinesUntilNextLevel(20, 3)).toBe(10);
  });

  it('should handle level 20+ correctly', () => {
    // At max level, could return 0 or continue counting
    const result = getLinesUntilNextLevel(200, 21);
    expect(typeof result).toBe('number');
  });
});
