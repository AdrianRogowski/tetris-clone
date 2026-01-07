/**
 * Multiplayer Client Tests
 * Tests for WebSocket client wrapper
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createClient,
  createMockClient,
  getPartyHost,
  buildRoomUrl,
  type MultiplayerClient,
  type ConnectionState,
} from './client';
import type { ClientMessage, ServerMessage, RoomStateMessage } from './messages';

describe('Multiplayer Client', () => {
  // UT-NET-001: Connect to room by code
  describe('createMockClient', () => {
    it('should start in disconnected state', () => {
      const client = createMockClient({
        host: 'localhost:1999',
        roomCode: 'ABC123',
        events: {},
      });
      
      expect(client.state).toBe('disconnected');
    });

    it('should store room code', () => {
      const client = createMockClient({
        host: 'localhost:1999',
        roomCode: 'XYZ789',
        events: {},
      });
      
      expect(client.roomCode).toBe('XYZ789');
    });

    it('should transition to connecting when connect() called', () => {
      const onStateChange = vi.fn();
      const client = createMockClient({
        host: 'localhost:1999',
        roomCode: 'ABC123',
        events: { onStateChange },
      });
      
      client.connect();
      
      expect(client.state).toBe('connecting');
      expect(onStateChange).toHaveBeenCalledWith('connecting');
    });

    it('should transition to connected on simulateConnect', () => {
      const onStateChange = vi.fn();
      const client = createMockClient({
        host: 'localhost:1999',
        roomCode: 'ABC123',
        events: { onStateChange },
      });
      
      client.connect();
      client.simulateConnect();
      
      expect(client.state).toBe('connected');
      expect(onStateChange).toHaveBeenCalledWith('connected');
    });
  });

  // UT-NET-002: Handle connection error
  describe('connection errors', () => {
    it('should call onError when simulateError called', () => {
      const onError = vi.fn();
      const client = createMockClient({
        host: 'localhost:1999',
        roomCode: 'ABC123',
        events: { onError },
      });
      
      client.connect();
      const error = new Error('Connection failed');
      client.simulateError(error);
      
      expect(onError).toHaveBeenCalledWith(error);
    });

    it('should return to disconnected state on error', () => {
      const client = createMockClient({
        host: 'localhost:1999',
        roomCode: 'ABC123',
        events: {},
      });
      
      client.connect();
      client.simulateError(new Error('Connection failed'));
      
      expect(client.state).toBe('disconnected');
    });
  });

  // UT-NET-003: Reconnect on disconnect
  describe('reconnection', () => {
    it('should transition to reconnecting on disconnect while connected', () => {
      const onStateChange = vi.fn();
      const client = createMockClient({
        host: 'localhost:1999',
        roomCode: 'ABC123',
        events: { onStateChange },
      });
      
      client.connect();
      client.simulateConnect();
      onStateChange.mockClear();
      
      client.simulateDisconnect();
      
      expect(client.state).toBe('reconnecting');
      expect(onStateChange).toHaveBeenCalledWith('reconnecting');
    });
  });

  // UT-NET-004: Queue messages when disconnected
  describe('message queueing', () => {
    it('should queue messages when disconnected', () => {
      const client = createMockClient({
        host: 'localhost:1999',
        roomCode: 'ABC123',
        events: {},
      });
      
      const message: ClientMessage = { type: 'ready', isReady: true };
      client.send(message);
      
      expect(client.getQueuedMessages()).toContainEqual(message);
    });

    it('should queue multiple messages', () => {
      const client = createMockClient({
        host: 'localhost:1999',
        roomCode: 'ABC123',
        events: {},
      });
      
      client.send({ type: 'ready', isReady: true });
      client.send({ type: 'setTarget', mode: 'random' });
      
      expect(client.getQueuedMessages().length).toBe(2);
    });

    it('should not queue when connected (sends immediately)', () => {
      const client = createMockClient({
        host: 'localhost:1999',
        roomCode: 'ABC123',
        events: {},
      });
      
      client.connect();
      client.simulateConnect();
      
      client.send({ type: 'ready', isReady: true });
      
      // Queue should be empty since message was "sent"
      expect(client.getQueuedMessages().length).toBe(0);
    });
  });

  // UT-NET-005: Flush queue on reconnect
  describe('queue flushing', () => {
    it('should flush queue when reconnected', () => {
      const client = createMockClient({
        host: 'localhost:1999',
        roomCode: 'ABC123',
        events: {},
      });
      
      // Queue some messages while disconnected
      client.send({ type: 'ready', isReady: true });
      client.send({ type: 'setTarget', mode: 'random' });
      expect(client.getQueuedMessages().length).toBe(2);
      
      // Connect
      client.connect();
      client.simulateConnect();
      
      // Queue should be flushed
      expect(client.getQueuedMessages().length).toBe(0);
    });

    it('should clear queue manually with clearQueue', () => {
      const client = createMockClient({
        host: 'localhost:1999',
        roomCode: 'ABC123',
        events: {},
      });
      
      client.send({ type: 'ready', isReady: true });
      expect(client.getQueuedMessages().length).toBe(1);
      
      client.clearQueue();
      
      expect(client.getQueuedMessages().length).toBe(0);
    });
  });

  // UT-NET-006: Emit events for state changes
  describe('event emission', () => {
    it('should emit onMessage when receiving server message', () => {
      const onMessage = vi.fn();
      const client = createMockClient({
        host: 'localhost:1999',
        roomCode: 'ABC123',
        events: { onMessage },
      });
      
      client.connect();
      client.simulateConnect();
      
      const serverMessage: RoomStateMessage = {
        type: 'roomState',
        roomCode: 'ABC123',
        hostId: 'p1',
        players: [],
        isStarting: false,
        countdown: null,
      };
      
      client.simulateMessage(serverMessage);
      
      expect(onMessage).toHaveBeenCalledWith(serverMessage);
    });

    it('should emit all state transitions', () => {
      const onStateChange = vi.fn();
      const client = createMockClient({
        host: 'localhost:1999',
        roomCode: 'ABC123',
        events: { onStateChange },
      });
      
      client.connect();
      expect(onStateChange).toHaveBeenCalledWith('connecting');
      
      client.simulateConnect();
      expect(onStateChange).toHaveBeenCalledWith('connected');
      
      client.simulateDisconnect();
      expect(onStateChange).toHaveBeenCalledWith('reconnecting');
    });
  });

  // UT-NET-007: Clean disconnect on leave
  describe('disconnect', () => {
    it('should transition to disconnected on disconnect()', () => {
      const onStateChange = vi.fn();
      const client = createMockClient({
        host: 'localhost:1999',
        roomCode: 'ABC123',
        events: { onStateChange },
      });
      
      client.connect();
      client.simulateConnect();
      onStateChange.mockClear();
      
      client.disconnect();
      
      expect(client.state).toBe('disconnected');
      expect(onStateChange).toHaveBeenCalledWith('disconnected');
    });

    it('should not attempt reconnection after explicit disconnect', () => {
      const onStateChange = vi.fn();
      const client = createMockClient({
        host: 'localhost:1999',
        roomCode: 'ABC123',
        events: { onStateChange },
      });
      
      client.connect();
      client.simulateConnect();
      client.disconnect();
      
      // State should be disconnected, not reconnecting
      expect(client.state).toBe('disconnected');
    });
  });

  // URL building tests
  describe('buildRoomUrl', () => {
    it('should use ws:// for localhost', () => {
      const url = buildRoomUrl('localhost:1999', 'ABC123');
      expect(url).toBe('ws://localhost:1999/party/ABC123');
    });

    it('should use wss:// for production hosts', () => {
      const url = buildRoomUrl('tetris.partykit.dev', 'XYZ789');
      expect(url).toBe('wss://tetris.partykit.dev/party/XYZ789');
    });
  });

  describe('getPartyHost', () => {
    it('should return localhost for development', () => {
      // In test environment (node), should return localhost
      const host = getPartyHost();
      expect(host).toContain('localhost');
    });
  });
});
