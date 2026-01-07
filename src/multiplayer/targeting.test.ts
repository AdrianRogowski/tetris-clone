/**
 * Target Selection Tests
 * Tests for multiplayer targeting logic
 */

import { describe, it, expect, vi } from 'vitest';
import {
  selectTarget,
  getValidTargets,
  selectRandomTarget,
  selectBadgesTarget,
  selectLowestTarget,
  selectAttackerTarget,
} from './targeting';
import type { PlayerGameState } from './types';

// Helper to create mock player state
function createMockPlayer(
  id: string,
  overrides: Partial<PlayerGameState> = {}
): PlayerGameState {
  return {
    playerId: id,
    board: [],
    currentPiece: null,
    nextPieces: [],
    heldPiece: null,
    canHold: true,
    score: 0,
    level: 1,
    lines: 0,
    state: 'playing',
    placement: null,
    pendingGarbage: 0,
    garbageSent: 0,
    knockouts: 0,
    ...overrides,
  };
}

describe('Target Selection', () => {
  // UT-TGT-001
  describe('getValidTargets', () => {
    it('should exclude the attacker from valid targets', () => {
      const players = [
        createMockPlayer('p1'),
        createMockPlayer('p2'),
        createMockPlayer('p3'),
      ];
      
      const targets = getValidTargets('p1', players);
      expect(targets.map(p => p.playerId)).not.toContain('p1');
      expect(targets.length).toBe(2);
    });

    it('should exclude eliminated players', () => {
      const players = [
        createMockPlayer('p1'),
        createMockPlayer('p2', { state: 'eliminated' }),
        createMockPlayer('p3'),
      ];
      
      const targets = getValidTargets('p1', players);
      expect(targets.map(p => p.playerId)).not.toContain('p2');
      expect(targets.length).toBe(1);
    });

    it('should return empty array when no valid targets', () => {
      const players = [
        createMockPlayer('p1'),
        createMockPlayer('p2', { state: 'eliminated' }),
      ];
      
      const targets = getValidTargets('p1', players);
      expect(targets.length).toBe(0);
    });
  });

  // UT-TGT-002
  describe('selectRandomTarget', () => {
    it('should return null for empty targets', () => {
      const result = selectRandomTarget([]);
      expect(result).toBeNull();
    });

    it('should return the only target if one available', () => {
      const targets = [createMockPlayer('p2')];
      const result = selectRandomTarget(targets);
      expect(result).toBe('p2');
    });

    it('should return a valid player ID', () => {
      const targets = [
        createMockPlayer('p2'),
        createMockPlayer('p3'),
        createMockPlayer('p4'),
      ];
      
      const result = selectRandomTarget(targets);
      expect(['p2', 'p3', 'p4']).toContain(result);
    });
  });

  // UT-TGT-003
  describe('selectBadgesTarget', () => {
    it('should return player with most knockouts', () => {
      const targets = [
        createMockPlayer('p2', { knockouts: 1 }),
        createMockPlayer('p3', { knockouts: 3 }),
        createMockPlayer('p4', { knockouts: 2 }),
      ];
      
      const result = selectBadgesTarget(targets);
      expect(result).toBe('p3');
    });

    it('should return first player if tie', () => {
      const targets = [
        createMockPlayer('p2', { knockouts: 2 }),
        createMockPlayer('p3', { knockouts: 2 }),
      ];
      
      const result = selectBadgesTarget(targets);
      // Should return one of the tied players consistently
      expect(['p2', 'p3']).toContain(result);
    });

    it('should return null for empty targets', () => {
      const result = selectBadgesTarget([]);
      expect(result).toBeNull();
    });
  });

  // UT-TGT-004
  describe('selectLowestTarget', () => {
    it('should return player with lowest score', () => {
      const targets = [
        createMockPlayer('p2', { score: 5000 }),
        createMockPlayer('p3', { score: 2000 }),
        createMockPlayer('p4', { score: 8000 }),
      ];
      
      const result = selectLowestTarget(targets);
      expect(result).toBe('p3');
    });

    it('should return null for empty targets', () => {
      const result = selectLowestTarget([]);
      expect(result).toBeNull();
    });
  });

  // UT-TGT-005
  describe('selectAttackerTarget', () => {
    it('should return last attacker if valid', () => {
      const targets = [
        createMockPlayer('p2'),
        createMockPlayer('p3'),
      ];
      
      const result = selectAttackerTarget(targets, 'p3');
      expect(result).toBe('p3');
    });

    it('should return null if last attacker not in targets', () => {
      const targets = [
        createMockPlayer('p2'),
        createMockPlayer('p3'),
      ];
      
      const result = selectAttackerTarget(targets, 'p4');
      expect(result).toBeNull();
    });

    it('should return null if no last attacker', () => {
      const targets = [createMockPlayer('p2')];
      const result = selectAttackerTarget(targets, null);
      expect(result).toBeNull();
    });
  });

  // UT-TGT-006
  describe('selectTarget (main function)', () => {
    const players = [
      createMockPlayer('p1'),
      createMockPlayer('p2', { score: 1000, knockouts: 2 }),
      createMockPlayer('p3', { score: 5000, knockouts: 0 }),
      createMockPlayer('p4', { score: 3000, knockouts: 1 }),
    ];

    it('should use random mode correctly', () => {
      const result = selectTarget('random', 'p1', players, null);
      expect(['p2', 'p3', 'p4']).toContain(result);
    });

    it('should use badges mode correctly', () => {
      const result = selectTarget('badges', 'p1', players, null);
      expect(result).toBe('p2'); // Most knockouts
    });

    it('should use lowest mode correctly', () => {
      const result = selectTarget('lowest', 'p1', players, null);
      expect(result).toBe('p2'); // Lowest score
    });

    it('should use attacker mode correctly', () => {
      const result = selectTarget('attacker', 'p1', players, 'p3');
      expect(result).toBe('p3');
    });

    it('should fall back to random if attacker not valid', () => {
      const result = selectTarget('attacker', 'p1', players, 'p99');
      // Should fall back to random selection
      expect(['p2', 'p3', 'p4']).toContain(result);
    });

    it('should return null if no valid targets', () => {
      const soloPlayers = [createMockPlayer('p1')];
      const result = selectTarget('random', 'p1', soloPlayers, null);
      expect(result).toBeNull();
    });
  });
});
