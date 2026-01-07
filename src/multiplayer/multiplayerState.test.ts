/**
 * Multiplayer Game State Tests
 * Tests for multiplayer game state management
 */

import { describe, it, expect } from 'vitest';
import {
  createMultiplayerGame,
  createPlayerGameState,
  checkElimination,
  eliminatePlayer,
  getCurrentPlacement,
  checkWinCondition,
  processGarbageQueue,
  queueGarbageAttack,
  updatePlayerState,
  getLivingPlayers,
  setTargetMode,
} from './multiplayerState';
import type { MultiplayerPlayer, MultiplayerGameState, PlayerGameState, GarbageAttack } from './types';
import { createEmptyBoard, BOARD_HEIGHT, BOARD_BUFFER } from '../game/board';

// Helper to create mock multiplayer player
function createMockMultiplayerPlayer(
  id: string,
  overrides: Partial<MultiplayerPlayer> = {}
): MultiplayerPlayer {
  return {
    id,
    name: `Player ${id}`,
    color: 'cyan',
    isHost: false,
    isReady: true,
    isConnected: true,
    ...overrides,
  };
}

// Helper to create mock game state
function createMockGameState(
  playerCount: number = 2,
  overrides: Partial<MultiplayerGameState> = {}
): MultiplayerGameState {
  const players: MultiplayerPlayer[] = [];
  for (let i = 1; i <= playerCount; i++) {
    players.push(createMockMultiplayerPlayer(`p${i}`));
  }
  return createMultiplayerGame('ABC123', players);
}

describe('Multiplayer Game State', () => {
  // UT-MPS-001
  describe('createMultiplayerGame', () => {
    it('should create game with correct room code', () => {
      const players = [
        createMockMultiplayerPlayer('p1'),
        createMockMultiplayerPlayer('p2'),
      ];
      
      const game = createMultiplayerGame('XYZ789', players);
      expect(game.roomCode).toBe('XYZ789');
    });

    it('should initialize all players', () => {
      const players = [
        createMockMultiplayerPlayer('p1'),
        createMockMultiplayerPlayer('p2'),
        createMockMultiplayerPlayer('p3'),
      ];
      
      const game = createMultiplayerGame('ABC123', players);
      expect(game.players.length).toBe(3);
    });

    it('should set default target mode to random', () => {
      const players = [
        createMockMultiplayerPlayer('p1'),
        createMockMultiplayerPlayer('p2'),
      ];
      
      const game = createMultiplayerGame('ABC123', players);
      expect(game.targetMode).toBe('random');
    });

    it('should initialize empty garbage queue', () => {
      const players = [
        createMockMultiplayerPlayer('p1'),
        createMockMultiplayerPlayer('p2'),
      ];
      
      const game = createMultiplayerGame('ABC123', players);
      expect(game.garbageQueue).toEqual([]);
    });

    it('should set game as not over', () => {
      const players = [
        createMockMultiplayerPlayer('p1'),
        createMockMultiplayerPlayer('p2'),
      ];
      
      const game = createMultiplayerGame('ABC123', players);
      expect(game.isGameOver).toBe(false);
      expect(game.winnerId).toBeNull();
    });
  });

  // UT-MPS-002
  describe('createPlayerGameState', () => {
    it('should create player state with empty board', () => {
      const player = createMockMultiplayerPlayer('p1');
      const state = createPlayerGameState(player);
      
      expect(state.playerId).toBe('p1');
      expect(state.board).toBeDefined();
      expect(state.board.length).toBe(BOARD_HEIGHT + BOARD_BUFFER);
    });

    it('should initialize score and level to 0 and 1', () => {
      const player = createMockMultiplayerPlayer('p1');
      const state = createPlayerGameState(player);
      
      expect(state.score).toBe(0);
      expect(state.level).toBe(1);
      expect(state.lines).toBe(0);
    });

    it('should set state to playing', () => {
      const player = createMockMultiplayerPlayer('p1');
      const state = createPlayerGameState(player);
      
      expect(state.state).toBe('playing');
    });

    it('should initialize garbage counters to 0', () => {
      const player = createMockMultiplayerPlayer('p1');
      const state = createPlayerGameState(player);
      
      expect(state.pendingGarbage).toBe(0);
      expect(state.garbageSent).toBe(0);
      expect(state.knockouts).toBe(0);
    });
  });

  // UT-MPS-003
  describe('checkElimination', () => {
    it('should return false for empty board', () => {
      const player = createMockMultiplayerPlayer('p1');
      const state = createPlayerGameState(player);
      
      expect(checkElimination(state)).toBe(false);
    });

    it('should return true when top visible row is blocked', () => {
      const player = createMockMultiplayerPlayer('p1');
      const state = createPlayerGameState(player);
      
      // Fill the spawn area (top of visible board + buffer)
      state.board[BOARD_BUFFER][5] = 'I';
      
      expect(checkElimination(state)).toBe(true);
    });

    it('should return false when board has pieces but not at top', () => {
      const player = createMockMultiplayerPlayer('p1');
      const state = createPlayerGameState(player);
      
      // Fill bottom of board only
      state.board[state.board.length - 1][5] = 'I';
      
      expect(checkElimination(state)).toBe(false);
    });
  });

  // UT-MPS-004
  describe('eliminatePlayer', () => {
    it('should set player state to eliminated', () => {
      const players = [
        createMockMultiplayerPlayer('p1'),
        createMockMultiplayerPlayer('p2'),
        createMockMultiplayerPlayer('p3'),
      ];
      const game = createMultiplayerGame('ABC123', players);
      
      const updated = eliminatePlayer(game, 'p3');
      const p3 = updated.players.find(p => p.playerId === 'p3');
      
      expect(p3?.state).toBe('eliminated');
    });

    it('should assign correct placement', () => {
      const players = [
        createMockMultiplayerPlayer('p1'),
        createMockMultiplayerPlayer('p2'),
        createMockMultiplayerPlayer('p3'),
      ];
      const game = createMultiplayerGame('ABC123', players);
      
      // First elimination = 3rd place
      const after1 = eliminatePlayer(game, 'p3');
      const p3 = after1.players.find(p => p.playerId === 'p3');
      expect(p3?.placement).toBe(3);
      
      // Second elimination = 2nd place
      const after2 = eliminatePlayer(after1, 'p2');
      const p2 = after2.players.find(p => p.playerId === 'p2');
      expect(p2?.placement).toBe(2);
    });
  });

  // UT-MPS-005
  describe('getCurrentPlacement', () => {
    it('should return player count for first elimination', () => {
      const players = [
        createMockMultiplayerPlayer('p1'),
        createMockMultiplayerPlayer('p2'),
        createMockMultiplayerPlayer('p3'),
        createMockMultiplayerPlayer('p4'),
      ];
      const game = createMultiplayerGame('ABC123', players);
      
      expect(getCurrentPlacement(game)).toBe(4);
    });

    it('should decrement for each elimination', () => {
      const players = [
        createMockMultiplayerPlayer('p1'),
        createMockMultiplayerPlayer('p2'),
        createMockMultiplayerPlayer('p3'),
      ];
      let game = createMultiplayerGame('ABC123', players);
      
      expect(getCurrentPlacement(game)).toBe(3);
      
      game = eliminatePlayer(game, 'p3');
      expect(getCurrentPlacement(game)).toBe(2);
    });
  });

  // UT-MPS-006
  describe('checkWinCondition', () => {
    it('should return null when multiple players alive', () => {
      const players = [
        createMockMultiplayerPlayer('p1'),
        createMockMultiplayerPlayer('p2'),
        createMockMultiplayerPlayer('p3'),
      ];
      const game = createMultiplayerGame('ABC123', players);
      
      expect(checkWinCondition(game)).toBeNull();
    });

    it('should return winner ID when one player remains', () => {
      const players = [
        createMockMultiplayerPlayer('p1'),
        createMockMultiplayerPlayer('p2'),
      ];
      let game = createMultiplayerGame('ABC123', players);
      game = eliminatePlayer(game, 'p2');
      
      expect(checkWinCondition(game)).toBe('p1');
    });

    it('should return null for already finished game', () => {
      const players = [
        createMockMultiplayerPlayer('p1'),
        createMockMultiplayerPlayer('p2'),
      ];
      let game = createMultiplayerGame('ABC123', players);
      game = eliminatePlayer(game, 'p2');
      game.isGameOver = true;
      game.winnerId = 'p1';
      
      // Already has winner, should return same
      expect(checkWinCondition(game)).toBe('p1');
    });
  });

  // UT-MPS-007
  describe('getLivingPlayers', () => {
    it('should return all players initially', () => {
      const players = [
        createMockMultiplayerPlayer('p1'),
        createMockMultiplayerPlayer('p2'),
        createMockMultiplayerPlayer('p3'),
      ];
      const game = createMultiplayerGame('ABC123', players);
      
      const living = getLivingPlayers(game);
      expect(living.length).toBe(3);
    });

    it('should exclude eliminated players', () => {
      const players = [
        createMockMultiplayerPlayer('p1'),
        createMockMultiplayerPlayer('p2'),
        createMockMultiplayerPlayer('p3'),
      ];
      let game = createMultiplayerGame('ABC123', players);
      game = eliminatePlayer(game, 'p2');
      
      const living = getLivingPlayers(game);
      expect(living.length).toBe(2);
      expect(living.map(p => p.playerId)).not.toContain('p2');
    });
  });

  // UT-MPS-008
  describe('queueGarbageAttack', () => {
    it('should add attack to queue', () => {
      const players = [
        createMockMultiplayerPlayer('p1'),
        createMockMultiplayerPlayer('p2'),
      ];
      const game = createMultiplayerGame('ABC123', players);
      
      const attack: GarbageAttack = {
        fromPlayerId: 'p1',
        toPlayerId: 'p2',
        lines: 3,
        timestamp: Date.now(),
      };
      
      const updated = queueGarbageAttack(game, attack);
      expect(updated.garbageQueue.length).toBe(1);
      expect(updated.garbageQueue[0]).toEqual(attack);
    });

    it('should increment target pending garbage', () => {
      const players = [
        createMockMultiplayerPlayer('p1'),
        createMockMultiplayerPlayer('p2'),
      ];
      const game = createMultiplayerGame('ABC123', players);
      
      const attack: GarbageAttack = {
        fromPlayerId: 'p1',
        toPlayerId: 'p2',
        lines: 4,
        timestamp: Date.now(),
      };
      
      const updated = queueGarbageAttack(game, attack);
      const p2 = updated.players.find(p => p.playerId === 'p2');
      expect(p2?.pendingGarbage).toBe(4);
    });
  });

  // UT-MPS-009
  describe('updatePlayerState', () => {
    it('should update specific player state', () => {
      const players = [
        createMockMultiplayerPlayer('p1'),
        createMockMultiplayerPlayer('p2'),
      ];
      const game = createMultiplayerGame('ABC123', players);
      
      const updated = updatePlayerState(game, 'p1', { score: 5000 });
      const p1 = updated.players.find(p => p.playerId === 'p1');
      
      expect(p1?.score).toBe(5000);
    });

    it('should not modify other players', () => {
      const players = [
        createMockMultiplayerPlayer('p1'),
        createMockMultiplayerPlayer('p2'),
      ];
      const game = createMultiplayerGame('ABC123', players);
      
      const updated = updatePlayerState(game, 'p1', { score: 5000 });
      const p2 = updated.players.find(p => p.playerId === 'p2');
      
      expect(p2?.score).toBe(0);
    });
  });

  // UT-MPS-010
  describe('setTargetMode', () => {
    it('should change target mode', () => {
      const players = [
        createMockMultiplayerPlayer('p1'),
        createMockMultiplayerPlayer('p2'),
      ];
      const game = createMultiplayerGame('ABC123', players);
      
      expect(game.targetMode).toBe('random');
      
      const updated = setTargetMode(game, 'badges');
      expect(updated.targetMode).toBe('badges');
    });
  });
});
