/**
 * Garbage Line Tests
 * Tests for multiplayer garbage calculation and management
 */

import { describe, it, expect } from 'vitest';
import {
  calculateGarbage,
  createGarbageAttack,
  applyGarbage,
  generateGarbageLine,
  cancelGarbage,
  calculateNetGarbage,
} from './garbage';
import { createEmptyBoard } from '../game/board';

describe('Garbage Calculation', () => {
  // UT-GRB-001
  describe('calculateGarbage', () => {
    it('should send 0 garbage for single line clear', () => {
      const result = calculateGarbage(1);
      expect(result.linesSent).toBe(0);
    });

    it('should send 1 garbage for double line clear', () => {
      const result = calculateGarbage(2);
      expect(result.linesSent).toBe(1);
    });

    it('should send 2 garbage for triple line clear', () => {
      const result = calculateGarbage(3);
      expect(result.linesSent).toBe(2);
    });

    it('should send 4 garbage for Tetris (4 lines)', () => {
      const result = calculateGarbage(4);
      expect(result.linesSent).toBe(4);
    });

    it('should add +1 garbage for back-to-back bonus', () => {
      const result = calculateGarbage(4, true);
      expect(result.linesSent).toBe(5);
      expect(result.isBackToBack).toBe(true);
    });

    it('should not add back-to-back bonus to single clear', () => {
      const result = calculateGarbage(1, true);
      expect(result.linesSent).toBe(0); // Still 0, single doesn't send garbage
    });
  });

  // UT-GRB-002
  describe('createGarbageAttack', () => {
    it('should create attack with correct properties', () => {
      const attack = createGarbageAttack('player1', 'player2', 3);
      expect(attack.fromPlayerId).toBe('player1');
      expect(attack.toPlayerId).toBe('player2');
      expect(attack.lines).toBe(3);
      expect(attack.timestamp).toBeGreaterThan(0);
    });

    it('should set timestamp to current time', () => {
      const before = Date.now();
      const attack = createGarbageAttack('p1', 'p2', 1);
      const after = Date.now();
      expect(attack.timestamp).toBeGreaterThanOrEqual(before);
      expect(attack.timestamp).toBeLessThanOrEqual(after);
    });
  });

  // UT-GRB-003
  describe('generateGarbageLine', () => {
    it('should generate line with correct width', () => {
      const line = generateGarbageLine(10);
      expect(line.length).toBe(10);
    });

    it('should have exactly one gap (null cell)', () => {
      const line = generateGarbageLine(10);
      const gaps = line.filter(cell => cell === null);
      expect(gaps.length).toBe(1);
    });

    it('should fill other cells with garbage indicator', () => {
      const line = generateGarbageLine(10);
      const filled = line.filter(cell => cell !== null);
      expect(filled.length).toBe(9);
      // All filled cells should be 'G' for garbage
      filled.forEach(cell => {
        expect(cell).toBe('G');
      });
    });

    it('should place gap randomly', () => {
      // Generate many lines and check gap positions vary
      const gapPositions = new Set<number>();
      for (let i = 0; i < 100; i++) {
        const line = generateGarbageLine(10);
        const gapIndex = line.findIndex(cell => cell === null);
        gapPositions.add(gapIndex);
      }
      // Should have more than 1 unique position (randomness)
      expect(gapPositions.size).toBeGreaterThan(1);
    });
  });

  // UT-GRB-004
  describe('applyGarbage', () => {
    it('should add garbage lines at bottom of board', () => {
      const board = createEmptyBoard();
      const newBoard = applyGarbage(board, 2);
      
      // Bottom 2 rows should be garbage
      const bottomRow = newBoard[newBoard.length - 1];
      const secondBottomRow = newBoard[newBoard.length - 2];
      
      const bottomFilled = bottomRow.filter(c => c !== null).length;
      const secondFilled = secondBottomRow.filter(c => c !== null).length;
      
      expect(bottomFilled).toBe(9); // 9 filled, 1 gap
      expect(secondFilled).toBe(9);
    });

    it('should push existing pieces up', () => {
      const board = createEmptyBoard();
      // Place a piece at the bottom
      board[board.length - 1][5] = 'I';
      
      const newBoard = applyGarbage(board, 1);
      
      // Original piece should be pushed up by 1
      expect(newBoard[newBoard.length - 2][5]).toBe('I');
    });

    it('should not exceed board height', () => {
      const board = createEmptyBoard();
      const newBoard = applyGarbage(board, 5);
      expect(newBoard.length).toBe(board.length);
    });

    it('should handle zero garbage lines', () => {
      const board = createEmptyBoard();
      const newBoard = applyGarbage(board, 0);
      expect(newBoard).toEqual(board);
    });
  });

  // UT-GRB-005
  describe('cancelGarbage', () => {
    it('should reduce pending garbage by lines cleared', () => {
      expect(cancelGarbage(5, 2)).toBe(3);
    });

    it('should not go below zero', () => {
      expect(cancelGarbage(2, 5)).toBe(0);
    });

    it('should return same value when no lines cleared', () => {
      expect(cancelGarbage(3, 0)).toBe(3);
    });

    it('should return zero when exactly cancelled', () => {
      expect(cancelGarbage(3, 3)).toBe(0);
    });
  });

  // UT-GRB-006
  describe('calculateNetGarbage', () => {
    it('should send full garbage when no pending', () => {
      const result = calculateNetGarbage(4, 0);
      expect(result.sent).toBe(4);
      expect(result.remaining).toBe(0);
    });

    it('should cancel pending before sending', () => {
      const result = calculateNetGarbage(4, 2);
      expect(result.sent).toBe(2); // 4 - 2 = 2 sent
      expect(result.remaining).toBe(0);
    });

    it('should leave remaining when not enough to cancel', () => {
      const result = calculateNetGarbage(2, 5);
      expect(result.sent).toBe(0);
      expect(result.remaining).toBe(3); // 5 - 2 = 3 remaining
    });

    it('should handle exact cancellation', () => {
      const result = calculateNetGarbage(3, 3);
      expect(result.sent).toBe(0);
      expect(result.remaining).toBe(0);
    });
  });
});
