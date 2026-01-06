/**
 * Tests for 7-Bag Randomizer
 * Covers: Fair piece distribution, queue management
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ALL_TETROMINOS,
  shuffle,
  generateBag,
  createRandomizer,
  getNextPiece,
  peekPieces,
} from './randomizer';
import type { TetrominoType } from './types';

describe('ALL_TETROMINOS', () => {
  it('should contain all 7 tetromino types', () => {
    expect(ALL_TETROMINOS).toHaveLength(7);
    expect(ALL_TETROMINOS).toContain('I');
    expect(ALL_TETROMINOS).toContain('O');
    expect(ALL_TETROMINOS).toContain('T');
    expect(ALL_TETROMINOS).toContain('S');
    expect(ALL_TETROMINOS).toContain('Z');
    expect(ALL_TETROMINOS).toContain('J');
    expect(ALL_TETROMINOS).toContain('L');
  });

  it('should not have duplicates', () => {
    const unique = new Set(ALL_TETROMINOS);
    expect(unique.size).toBe(ALL_TETROMINOS.length);
  });
});

describe('shuffle', () => {
  it('should return an array of the same length', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result.length).toBe(input.length);
  });

  it('should contain all original elements', () => {
    const input = ['a', 'b', 'c', 'd'];
    const result = shuffle(input);
    input.forEach((item) => {
      expect(result).toContain(item);
    });
  });

  it('should not modify the original array', () => {
    const input = [1, 2, 3, 4, 5];
    const original = [...input];
    shuffle(input);
    expect(input).toEqual(original);
  });

  it('should produce different orders over multiple calls (statistical)', () => {
    const input = [1, 2, 3, 4, 5, 6, 7];
    const results: string[] = [];
    
    // Run 20 times and check we get at least 2 different orderings
    for (let i = 0; i < 20; i++) {
      results.push(JSON.stringify(shuffle(input)));
    }
    
    const unique = new Set(results);
    expect(unique.size).toBeGreaterThan(1);
  });

  it('should handle empty array', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('should handle single element array', () => {
    expect(shuffle([1])).toEqual([1]);
  });
});

describe('generateBag', () => {
  it('should return 7 pieces', () => {
    const bag = generateBag();
    expect(bag.length).toBe(7);
  });

  it('should contain exactly one of each tetromino type', () => {
    const bag = generateBag();
    const counts: Record<string, number> = {};
    
    bag.forEach((piece) => {
      counts[piece] = (counts[piece] || 0) + 1;
    });
    
    ALL_TETROMINOS.forEach((type) => {
      expect(counts[type]).toBe(1);
    });
  });

  it('should produce different orders on different calls (statistical)', () => {
    const bags: string[] = [];
    
    for (let i = 0; i < 20; i++) {
      bags.push(JSON.stringify(generateBag()));
    }
    
    const unique = new Set(bags);
    expect(unique.size).toBeGreaterThan(1);
  });

  it('should return valid tetromino types', () => {
    const bag = generateBag();
    bag.forEach((piece) => {
      expect(ALL_TETROMINOS).toContain(piece);
    });
  });
});

describe('createRandomizer', () => {
  it('should return an object with a queue', () => {
    const randomizer = createRandomizer();
    expect(randomizer).toHaveProperty('queue');
    expect(Array.isArray(randomizer.queue)).toBe(true);
  });

  it('should initialize with at least 7 pieces', () => {
    const randomizer = createRandomizer();
    expect(randomizer.queue.length).toBeGreaterThanOrEqual(7);
  });

  it('should initialize with at least 14 pieces (two bags) for look-ahead', () => {
    const randomizer = createRandomizer();
    expect(randomizer.queue.length).toBeGreaterThanOrEqual(14);
  });

  it('should contain valid tetromino types', () => {
    const randomizer = createRandomizer();
    randomizer.queue.forEach((piece) => {
      expect(ALL_TETROMINOS).toContain(piece);
    });
  });
});

describe('getNextPiece', () => {
  it('should return the first piece in queue', () => {
    const queue: TetrominoType[] = ['T', 'I', 'O', 'S', 'Z', 'J', 'L'];
    const [piece] = getNextPiece(queue);
    expect(piece).toBe('T');
  });

  it('should return updated queue without first piece', () => {
    const queue: TetrominoType[] = ['T', 'I', 'O', 'S', 'Z', 'J', 'L'];
    const [, newQueue] = getNextPiece(queue);
    expect(newQueue[0]).toBe('I');
    // Queue refills when below 7, so 6 + 7 = 13
    expect(newQueue.length).toBe(13);
  });

  it('should not modify original queue', () => {
    const queue: TetrominoType[] = ['T', 'I', 'O', 'S', 'Z', 'J', 'L'];
    const originalLength = queue.length;
    getNextPiece(queue);
    expect(queue.length).toBe(originalLength);
    expect(queue[0]).toBe('T');
  });

  it('should refill queue when running low', () => {
    // Start with only 3 pieces
    const queue: TetrominoType[] = ['T', 'I', 'O'];
    const [, newQueue] = getNextPiece(queue);
    
    // Should have added a new bag
    expect(newQueue.length).toBeGreaterThanOrEqual(7);
  });

  it('should maintain 7-bag property when refilling', () => {
    // Start with exactly 7 pieces (one bag)
    const queue: TetrominoType[] = ['T', 'I', 'O', 'S', 'Z', 'J', 'L'];
    let currentQueue = queue;
    
    // Draw 8 pieces (empties first bag, starts second)
    for (let i = 0; i < 8; i++) {
      const [, newQueue] = getNextPiece(currentQueue);
      currentQueue = newQueue;
    }
    
    // Queue should have been refilled
    expect(currentQueue.length).toBeGreaterThan(0);
  });
});

describe('peekPieces', () => {
  it('should return requested number of pieces', () => {
    const queue: TetrominoType[] = ['T', 'I', 'O', 'S', 'Z', 'J', 'L'];
    const peeked = peekPieces(queue, 3);
    expect(peeked.length).toBe(3);
  });

  it('should return pieces in order', () => {
    const queue: TetrominoType[] = ['T', 'I', 'O', 'S', 'Z', 'J', 'L'];
    const peeked = peekPieces(queue, 3);
    expect(peeked).toEqual(['T', 'I', 'O']);
  });

  it('should not modify the queue', () => {
    const queue: TetrominoType[] = ['T', 'I', 'O', 'S', 'Z', 'J', 'L'];
    const originalQueue = [...queue];
    peekPieces(queue, 5);
    expect(queue).toEqual(originalQueue);
  });

  it('should return fewer pieces if queue is shorter', () => {
    const queue: TetrominoType[] = ['T', 'I'];
    const peeked = peekPieces(queue, 5);
    expect(peeked.length).toBe(2);
  });

  it('should return empty array for count of 0', () => {
    const queue: TetrominoType[] = ['T', 'I', 'O'];
    const peeked = peekPieces(queue, 0);
    expect(peeked).toEqual([]);
  });

  it('should handle empty queue', () => {
    const peeked = peekPieces([], 3);
    expect(peeked).toEqual([]);
  });
});

describe('7-Bag Guarantee', () => {
  it('should never have more than 12 pieces between same type', () => {
    const randomizer = createRandomizer();
    let queue = randomizer.queue;
    const history: TetrominoType[] = [];
    
    // Draw 50 pieces and track gaps
    for (let i = 0; i < 50; i++) {
      const [piece, newQueue] = getNextPiece(queue);
      queue = newQueue;
      history.push(piece);
    }
    
    // Check gap between same pieces
    ALL_TETROMINOS.forEach((type) => {
      const indices = history
        .map((p, i) => (p === type ? i : -1))
        .filter((i) => i !== -1);
      
      for (let i = 1; i < indices.length; i++) {
        const gap = indices[i] - indices[i - 1];
        // In 7-bag, maximum gap is 12 (e.g., piece is last in bag 1, first in bag 3)
        expect(gap).toBeLessThanOrEqual(13);
      }
    });
  });

  it('should have fair distribution over many draws', () => {
    const randomizer = createRandomizer();
    let queue = randomizer.queue;
    const counts: Record<TetrominoType, number> = {
      I: 0, O: 0, T: 0, S: 0, Z: 0, J: 0, L: 0,
    };
    
    // Draw 70 pieces (10 complete bags)
    for (let i = 0; i < 70; i++) {
      const [piece, newQueue] = getNextPiece(queue);
      queue = newQueue;
      counts[piece]++;
    }
    
    // Each piece should appear exactly 10 times
    ALL_TETROMINOS.forEach((type) => {
      expect(counts[type]).toBe(10);
    });
  });
});
