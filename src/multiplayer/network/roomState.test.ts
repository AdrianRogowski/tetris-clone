/**
 * Room State Tests
 * Tests for room state updates from server messages
 */

import { describe, it, expect } from 'vitest';
import {
  createInitialRoomState,
  applyServerMessage,
  isHost,
  allPlayersReady,
  getMyPlayer,
  canStartGame,
  type RoomState,
} from './roomState';
import type { ServerMessage, NetworkPlayer } from './messages';

// Helper to create a basic room state
function createTestRoomState(overrides: Partial<RoomState> = {}): RoomState {
  return {
    ...createInitialRoomState(),
    roomCode: 'ABC123',
    myPlayerId: 'p1',
    ...overrides,
  };
}

// Helper to create a player
function createPlayer(id: string, overrides: Partial<NetworkPlayer> = {}): NetworkPlayer {
  return {
    id,
    name: `Player ${id}`,
    color: 'cyan',
    isHost: false,
    isReady: false,
    isConnected: true,
    ...overrides,
  };
}

describe('Room State', () => {
  // Initial state
  describe('createInitialRoomState', () => {
    it('should create state in lobby phase', () => {
      const state = createInitialRoomState();
      expect(state.phase).toBe('lobby');
    });

    it('should have empty players list', () => {
      const state = createInitialRoomState();
      expect(state.players).toEqual([]);
    });

    it('should have no pending garbage', () => {
      const state = createInitialRoomState();
      expect(state.pendingGarbage).toBe(0);
    });

    it('should have null myPlayerId', () => {
      const state = createInitialRoomState();
      expect(state.myPlayerId).toBeNull();
    });
  });

  // UT-ROOM-001: Update state on playerJoined
  describe('playerJoined message', () => {
    it('should add player to players list', () => {
      const state = createTestRoomState({ players: [] });
      const message: ServerMessage = {
        type: 'playerJoined',
        player: createPlayer('p2'),
      };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.players.length).toBe(1);
      expect(newState.players[0].id).toBe('p2');
    });

    it('should not duplicate existing player', () => {
      const existingPlayer = createPlayer('p1');
      const state = createTestRoomState({ players: [existingPlayer] });
      const message: ServerMessage = {
        type: 'playerJoined',
        player: createPlayer('p1', { name: 'Updated Name' }),
      };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.players.length).toBe(1);
    });
  });

  // UT-ROOM-002: Update state on playerLeft
  describe('playerLeft message', () => {
    it('should remove player from players list', () => {
      const state = createTestRoomState({
        players: [createPlayer('p1'), createPlayer('p2')],
      });
      const message: ServerMessage = { type: 'playerLeft', playerId: 'p2' };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.players.length).toBe(1);
      expect(newState.players.find(p => p.id === 'p2')).toBeUndefined();
    });

    it('should handle player not found gracefully', () => {
      const state = createTestRoomState({ players: [createPlayer('p1')] });
      const message: ServerMessage = { type: 'playerLeft', playerId: 'nonexistent' };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.players.length).toBe(1);
    });
  });

  // UT-ROOM-003: Update state on playerReady
  describe('playerReady message', () => {
    it('should update player ready status to true', () => {
      const state = createTestRoomState({
        players: [createPlayer('p1', { isReady: false })],
      });
      const message: ServerMessage = { type: 'playerReady', playerId: 'p1', isReady: true };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.players[0].isReady).toBe(true);
    });

    it('should update player ready status to false', () => {
      const state = createTestRoomState({
        players: [createPlayer('p1', { isReady: true })],
      });
      const message: ServerMessage = { type: 'playerReady', playerId: 'p1', isReady: false };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.players[0].isReady).toBe(false);
    });
  });

  // UT-ROOM-004: Handle countdown messages
  describe('countdown message', () => {
    it('should update countdown value', () => {
      const state = createTestRoomState({ countdown: null, isStarting: false });
      const message: ServerMessage = { type: 'countdown', seconds: 3 };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.countdown).toBe(3);
      expect(newState.isStarting).toBe(true);
      expect(newState.phase).toBe('countdown');
    });

    it('should update countdown as it decrements', () => {
      const state = createTestRoomState({ countdown: 3, isStarting: true, phase: 'countdown' });
      const message: ServerMessage = { type: 'countdown', seconds: 2 };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.countdown).toBe(2);
    });
  });

  // UT-ROOM-005: Transition to game on gameStart
  describe('gameStart message', () => {
    it('should transition to playing phase', () => {
      const state = createTestRoomState({ phase: 'countdown' });
      const message: ServerMessage = { type: 'gameStart', seed: 12345, playerOrder: ['p1', 'p2'] };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.phase).toBe('playing');
    });

    it('should store the seed', () => {
      const state = createTestRoomState({ phase: 'countdown' });
      const message: ServerMessage = { type: 'gameStart', seed: 12345, playerOrder: ['p1', 'p2'] };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.seed).toBe(12345);
    });

    it('should clear countdown', () => {
      const state = createTestRoomState({ phase: 'countdown', countdown: 1, isStarting: true });
      const message: ServerMessage = { type: 'gameStart', seed: 12345, playerOrder: ['p1', 'p2'] };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.countdown).toBeNull();
      expect(newState.isStarting).toBe(false);
    });
  });

  // UT-ROOM-006: Handle hostChanged
  describe('hostChanged message', () => {
    it('should update hostId', () => {
      const state = createTestRoomState({
        hostId: 'p1',
        players: [
          createPlayer('p1', { isHost: true }),
          createPlayer('p2', { isHost: false }),
        ],
      });
      const message: ServerMessage = { type: 'hostChanged', newHostId: 'p2' };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.hostId).toBe('p2');
    });

    it('should update isHost flags on players', () => {
      const state = createTestRoomState({
        hostId: 'p1',
        players: [
          createPlayer('p1', { isHost: true }),
          createPlayer('p2', { isHost: false }),
        ],
      });
      const message: ServerMessage = { type: 'hostChanged', newHostId: 'p2' };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.players.find(p => p.id === 'p1')?.isHost).toBe(false);
      expect(newState.players.find(p => p.id === 'p2')?.isHost).toBe(true);
    });
  });

  // UT-ROOM-007: Handle garbageAttack (add to pending)
  describe('garbageAttack message', () => {
    it('should add to pending garbage when I am target', () => {
      const state = createTestRoomState({ myPlayerId: 'p1', pendingGarbage: 0 });
      const message: ServerMessage = { type: 'garbageAttack', fromId: 'p2', toId: 'p1', lines: 4 };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.pendingGarbage).toBe(4);
    });

    it('should accumulate pending garbage', () => {
      const state = createTestRoomState({ myPlayerId: 'p1', pendingGarbage: 2 });
      const message: ServerMessage = { type: 'garbageAttack', fromId: 'p2', toId: 'p1', lines: 3 };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.pendingGarbage).toBe(5);
    });

    it('should not add garbage when I am not the target', () => {
      const state = createTestRoomState({ myPlayerId: 'p1', pendingGarbage: 0 });
      const message: ServerMessage = { type: 'garbageAttack', fromId: 'p1', toId: 'p2', lines: 4 };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.pendingGarbage).toBe(0);
    });

    it('should track last attacker', () => {
      const state = createTestRoomState({ myPlayerId: 'p1', lastAttacker: null });
      const message: ServerMessage = { type: 'garbageAttack', fromId: 'p2', toId: 'p1', lines: 4 };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.lastAttacker).toBe('p2');
    });
  });

  // UT-ROOM-008: Handle playerEliminated
  describe('playerEliminated message', () => {
    it('should mark opponent as eliminated', () => {
      const state = createTestRoomState({
        myPlayerId: 'p1',
        opponents: new Map([
          ['p2', { playerId: 'p2', name: 'Player 2', color: 'green', board: null, score: 0, lines: 0, level: 1, isEliminated: false, placement: null, isConnected: true }],
        ]),
      });
      const message: ServerMessage = { type: 'playerEliminated', playerId: 'p2', placement: 2, eliminatedBy: 'p1' };
      
      const newState = applyServerMessage(state, message);
      
      const opponent = newState.opponents.get('p2');
      expect(opponent?.isEliminated).toBe(true);
      expect(opponent?.placement).toBe(2);
    });
  });

  // UT-ROOM-009: Handle gameOver
  describe('gameOver message', () => {
    it('should transition to gameOver phase', () => {
      const state = createTestRoomState({ phase: 'playing' });
      const message: ServerMessage = {
        type: 'gameOver',
        winnerId: 'p1',
        standings: [
          { playerId: 'p1', placement: 1, score: 10000, lines: 50 },
        ],
      };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.phase).toBe('gameOver');
    });

    it('should store winner and standings', () => {
      const state = createTestRoomState({ phase: 'playing' });
      const standings = [
        { playerId: 'p1', placement: 1, score: 10000, lines: 50 },
        { playerId: 'p2', placement: 2, score: 5000, lines: 25 },
      ];
      const message: ServerMessage = { type: 'gameOver', winnerId: 'p1', standings };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.winnerId).toBe('p1');
      expect(newState.standings).toEqual(standings);
    });
  });

  // roomState message
  describe('roomState message', () => {
    it('should replace entire room state', () => {
      const state = createInitialRoomState();
      const message: ServerMessage = {
        type: 'roomState',
        roomCode: 'XYZ789',
        hostId: 'host1',
        players: [createPlayer('host1', { isHost: true })],
        isStarting: false,
        countdown: null,
      };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.roomCode).toBe('XYZ789');
      expect(newState.hostId).toBe('host1');
      expect(newState.players.length).toBe(1);
    });
  });

  // Error handling
  describe('error message', () => {
    it('should store last error', () => {
      const state = createTestRoomState({ lastError: null });
      const message: ServerMessage = { type: 'error', code: 'ROOM_FULL', message: 'Room is full' };
      
      const newState = applyServerMessage(state, message);
      
      expect(newState.lastError).toEqual({ code: 'ROOM_FULL', message: 'Room is full' });
    });
  });

  // Helper functions
  describe('isHost', () => {
    it('should return true when myPlayerId matches hostId', () => {
      const state = createTestRoomState({ myPlayerId: 'p1', hostId: 'p1' });
      expect(isHost(state)).toBe(true);
    });

    it('should return false when myPlayerId does not match', () => {
      const state = createTestRoomState({ myPlayerId: 'p2', hostId: 'p1' });
      expect(isHost(state)).toBe(false);
    });
  });

  describe('allPlayersReady', () => {
    it('should return true when all players are ready', () => {
      const state = createTestRoomState({
        players: [
          createPlayer('p1', { isReady: true }),
          createPlayer('p2', { isReady: true }),
        ],
      });
      expect(allPlayersReady(state)).toBe(true);
    });

    it('should return false when some players not ready', () => {
      const state = createTestRoomState({
        players: [
          createPlayer('p1', { isReady: true }),
          createPlayer('p2', { isReady: false }),
        ],
      });
      expect(allPlayersReady(state)).toBe(false);
    });
  });

  describe('getMyPlayer', () => {
    it('should return current player info', () => {
      const myPlayer = createPlayer('p1', { name: 'Me' });
      const state = createTestRoomState({
        myPlayerId: 'p1',
        players: [myPlayer, createPlayer('p2')],
      });
      
      expect(getMyPlayer(state)).toEqual(myPlayer);
    });

    it('should return null if not in players list', () => {
      const state = createTestRoomState({
        myPlayerId: 'p1',
        players: [createPlayer('p2')],
      });
      
      expect(getMyPlayer(state)).toBeNull();
    });
  });

  describe('canStartGame', () => {
    it('should return true when host, all ready, 2+ players', () => {
      const state = createTestRoomState({
        myPlayerId: 'p1',
        hostId: 'p1',
        players: [
          createPlayer('p1', { isHost: true, isReady: true }),
          createPlayer('p2', { isReady: true }),
        ],
      });
      
      expect(canStartGame(state)).toBe(true);
    });

    it('should return false when not host', () => {
      const state = createTestRoomState({
        myPlayerId: 'p2',
        hostId: 'p1',
        players: [
          createPlayer('p1', { isHost: true, isReady: true }),
          createPlayer('p2', { isReady: true }),
        ],
      });
      
      expect(canStartGame(state)).toBe(false);
    });

    it('should return false when only 1 player', () => {
      const state = createTestRoomState({
        myPlayerId: 'p1',
        hostId: 'p1',
        players: [createPlayer('p1', { isHost: true, isReady: true })],
      });
      
      expect(canStartGame(state)).toBe(false);
    });

    it('should return false when not all ready', () => {
      const state = createTestRoomState({
        myPlayerId: 'p1',
        hostId: 'p1',
        players: [
          createPlayer('p1', { isHost: true, isReady: true }),
          createPlayer('p2', { isReady: false }),
        ],
      });
      
      expect(canStartGame(state)).toBe(false);
    });
  });
});
