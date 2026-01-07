/**
 * Message Serialization Tests
 * Tests for client-server message handling
 */

import { describe, it, expect } from 'vitest';
import {
  serializeClientMessage,
  deserializeServerMessage,
  isValidClientMessage,
  isValidServerMessage,
  getClientMessageTypes,
  getServerMessageTypes,
  type ClientMessage,
  type ServerMessage,
  type JoinMessage,
  type RoomStateMessage,
  type GarbageAttackMessage,
} from './messages';

describe('Message Serialization', () => {
  // UT-MSG-001: Serialize client messages to JSON
  describe('serializeClientMessage', () => {
    it('should serialize join message', () => {
      const message: JoinMessage = { type: 'join', playerName: 'TestPlayer' };
      const json = serializeClientMessage(message);
      expect(JSON.parse(json)).toEqual(message);
    });

    it('should serialize ready message', () => {
      const message: ClientMessage = { type: 'ready', isReady: true };
      const json = serializeClientMessage(message);
      expect(JSON.parse(json)).toEqual(message);
    });

    it('should serialize start message', () => {
      const message: ClientMessage = { type: 'start' };
      const json = serializeClientMessage(message);
      expect(JSON.parse(json)).toEqual(message);
    });

    it('should serialize garbage message', () => {
      const message: ClientMessage = { type: 'garbage', lines: 4, targetMode: 'random' };
      const json = serializeClientMessage(message);
      expect(JSON.parse(json)).toEqual(message);
    });

    it('should serialize boardUpdate message', () => {
      const message: ClientMessage = {
        type: 'boardUpdate',
        board: [[null, 'I'], ['T', null]],
        score: 1000,
        lines: 10,
        level: 2,
      };
      const json = serializeClientMessage(message);
      expect(JSON.parse(json)).toEqual(message);
    });

    it('should serialize eliminated message', () => {
      const message: ClientMessage = { type: 'eliminated' };
      const json = serializeClientMessage(message);
      expect(JSON.parse(json)).toEqual(message);
    });

    it('should serialize setTarget message', () => {
      const message: ClientMessage = { type: 'setTarget', mode: 'badges' };
      const json = serializeClientMessage(message);
      expect(JSON.parse(json)).toEqual(message);
    });

    it('should serialize leave message', () => {
      const message: ClientMessage = { type: 'leave' };
      const json = serializeClientMessage(message);
      expect(JSON.parse(json)).toEqual(message);
    });
  });

  // UT-MSG-002: Deserialize server messages from JSON
  describe('deserializeServerMessage', () => {
    it('should deserialize roomState message', () => {
      const message: RoomStateMessage = {
        type: 'roomState',
        roomCode: 'ABC123',
        hostId: 'player1',
        players: [
          { id: 'player1', name: 'Host', color: 'cyan', isHost: true, isReady: true, isConnected: true }
        ],
        isStarting: false,
        countdown: null,
      };
      const result = deserializeServerMessage(JSON.stringify(message));
      expect(result).toEqual(message);
    });

    it('should deserialize playerJoined message', () => {
      const message: ServerMessage = {
        type: 'playerJoined',
        player: { id: 'p2', name: 'Guest', color: 'green', isHost: false, isReady: false, isConnected: true },
      };
      const result = deserializeServerMessage(JSON.stringify(message));
      expect(result).toEqual(message);
    });

    it('should deserialize playerLeft message', () => {
      const message: ServerMessage = { type: 'playerLeft', playerId: 'p2' };
      const result = deserializeServerMessage(JSON.stringify(message));
      expect(result).toEqual(message);
    });

    it('should deserialize countdown message', () => {
      const message: ServerMessage = { type: 'countdown', seconds: 3 };
      const result = deserializeServerMessage(JSON.stringify(message));
      expect(result).toEqual(message);
    });

    it('should deserialize gameStart message', () => {
      const message: ServerMessage = { type: 'gameStart', seed: 12345, playerOrder: ['p1', 'p2'] };
      const result = deserializeServerMessage(JSON.stringify(message));
      expect(result).toEqual(message);
    });

    it('should deserialize garbageAttack message', () => {
      const message: GarbageAttackMessage = {
        type: 'garbageAttack',
        fromId: 'p1',
        toId: 'p2',
        lines: 4,
      };
      const result = deserializeServerMessage(JSON.stringify(message));
      expect(result).toEqual(message);
    });

    it('should deserialize playerEliminated message', () => {
      const message: ServerMessage = {
        type: 'playerEliminated',
        playerId: 'p2',
        placement: 3,
        eliminatedBy: 'p1',
      };
      const result = deserializeServerMessage(JSON.stringify(message));
      expect(result).toEqual(message);
    });

    it('should deserialize gameOver message', () => {
      const message: ServerMessage = {
        type: 'gameOver',
        winnerId: 'p1',
        standings: [
          { playerId: 'p1', placement: 1, score: 10000, lines: 50 },
          { playerId: 'p2', placement: 2, score: 5000, lines: 25 },
        ],
      };
      const result = deserializeServerMessage(JSON.stringify(message));
      expect(result).toEqual(message);
    });

    it('should deserialize hostChanged message', () => {
      const message: ServerMessage = { type: 'hostChanged', newHostId: 'p2' };
      const result = deserializeServerMessage(JSON.stringify(message));
      expect(result).toEqual(message);
    });

    it('should deserialize error message', () => {
      const message: ServerMessage = { type: 'error', code: 'ROOM_FULL', message: 'Room is full' };
      const result = deserializeServerMessage(JSON.stringify(message));
      expect(result).toEqual(message);
    });
  });

  // UT-MSG-003: Validate required fields present
  describe('isValidClientMessage', () => {
    it('should validate join message with required fields', () => {
      expect(isValidClientMessage({ type: 'join', playerName: 'Test' })).toBe(true);
    });

    it('should reject join message missing playerName', () => {
      expect(isValidClientMessage({ type: 'join' })).toBe(false);
    });

    it('should validate ready message', () => {
      expect(isValidClientMessage({ type: 'ready', isReady: true })).toBe(true);
      expect(isValidClientMessage({ type: 'ready', isReady: false })).toBe(true);
    });

    it('should reject ready message missing isReady', () => {
      expect(isValidClientMessage({ type: 'ready' })).toBe(false);
    });

    it('should validate garbage message with all fields', () => {
      expect(isValidClientMessage({ type: 'garbage', lines: 4, targetMode: 'random' })).toBe(true);
    });

    it('should reject garbage message missing lines', () => {
      expect(isValidClientMessage({ type: 'garbage', targetMode: 'random' })).toBe(false);
    });

    it('should validate simple messages (start, eliminated, leave)', () => {
      expect(isValidClientMessage({ type: 'start' })).toBe(true);
      expect(isValidClientMessage({ type: 'eliminated' })).toBe(true);
      expect(isValidClientMessage({ type: 'leave' })).toBe(true);
    });

    it('should reject message without type', () => {
      expect(isValidClientMessage({ playerName: 'Test' })).toBe(false);
    });

    it('should reject null and undefined', () => {
      expect(isValidClientMessage(null)).toBe(false);
      expect(isValidClientMessage(undefined)).toBe(false);
    });
  });

  describe('isValidServerMessage', () => {
    it('should validate roomState message', () => {
      expect(isValidServerMessage({
        type: 'roomState',
        roomCode: 'ABC123',
        hostId: 'p1',
        players: [],
        isStarting: false,
        countdown: null,
      })).toBe(true);
    });

    it('should reject roomState missing roomCode', () => {
      expect(isValidServerMessage({
        type: 'roomState',
        hostId: 'p1',
        players: [],
        isStarting: false,
        countdown: null,
      })).toBe(false);
    });

    it('should validate garbageAttack message', () => {
      expect(isValidServerMessage({
        type: 'garbageAttack',
        fromId: 'p1',
        toId: 'p2',
        lines: 4,
      })).toBe(true);
    });

    it('should validate gameStart message', () => {
      expect(isValidServerMessage({
        type: 'gameStart',
        seed: 12345,
        playerOrder: ['p1', 'p2'],
      })).toBe(true);
    });

    it('should reject message without type', () => {
      expect(isValidServerMessage({ roomCode: 'ABC123' })).toBe(false);
    });
  });

  // UT-MSG-004: Handle unknown message types gracefully
  describe('unknown message types', () => {
    it('should return null for unknown server message type', () => {
      const result = deserializeServerMessage(JSON.stringify({ type: 'unknownType' }));
      expect(result).toBeNull();
    });

    it('should return null for invalid JSON', () => {
      const result = deserializeServerMessage('not valid json');
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = deserializeServerMessage('');
      expect(result).toBeNull();
    });

    it('should reject unknown client message type in validation', () => {
      expect(isValidClientMessage({ type: 'unknownType' })).toBe(false);
    });

    it('should reject unknown server message type in validation', () => {
      expect(isValidServerMessage({ type: 'unknownType' })).toBe(false);
    });
  });

  describe('getMessageTypes', () => {
    it('should return all client message types', () => {
      const types = getClientMessageTypes();
      expect(types).toContain('join');
      expect(types).toContain('ready');
      expect(types).toContain('start');
      expect(types).toContain('garbage');
      expect(types).toContain('boardUpdate');
      expect(types).toContain('eliminated');
      expect(types).toContain('setTarget');
      expect(types).toContain('leave');
      expect(types.length).toBe(8);
    });

    it('should return all server message types', () => {
      const types = getServerMessageTypes();
      expect(types).toContain('roomState');
      expect(types).toContain('playerJoined');
      expect(types).toContain('garbageAttack');
      expect(types).toContain('gameOver');
      expect(types.length).toBe(14);
    });
  });
});
