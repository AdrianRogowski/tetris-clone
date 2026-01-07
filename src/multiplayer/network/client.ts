/**
 * WebSocket client wrapper for PartyKit connection
 */

import type { ClientMessage, ServerMessage } from './messages';
import { serializeClientMessage, deserializeServerMessage } from './messages';

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

export interface ClientEvents {
  onStateChange: (state: ConnectionState) => void;
  onMessage: (message: ServerMessage) => void;
  onError: (error: Error) => void;
}

export interface MultiplayerClientOptions {
  host: string;
  roomCode: string;
  events: Partial<ClientEvents>;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

export interface MultiplayerClient {
  /** Current connection state */
  readonly state: ConnectionState;
  
  /** Room code this client is connected to */
  readonly roomCode: string;
  
  /** Connect to the room */
  connect(): void;
  
  /** Disconnect from the room */
  disconnect(): void;
  
  /** Send a message to the server */
  send(message: ClientMessage): void;
  
  /** Get pending messages in queue (when disconnected) */
  getQueuedMessages(): ClientMessage[];
  
  /** Clear the message queue */
  clearQueue(): void;
}

/**
 * Generate PartyKit host URL based on environment
 */
export function getPartyHost(): string {
  // In production, this would return the deployed PartyKit URL
  // In development, it returns localhost
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return 'tetris-party.username.partykit.dev';
  }
  return 'localhost:1999';
}

/**
 * Build the full WebSocket URL for a room
 */
export function buildRoomUrl(host: string, roomCode: string): string {
  const protocol = host.startsWith('localhost') ? 'ws' : 'wss';
  return `${protocol}://${host}/party/${roomCode}`;
}

/**
 * Create a new multiplayer client
 */
export function createClient(options: MultiplayerClientOptions): MultiplayerClient {
  const { host, roomCode, events, reconnectAttempts = 3, reconnectDelay = 1000 } = options;
  
  let state: ConnectionState = 'disconnected';
  let ws: WebSocket | null = null;
  let messageQueue: ClientMessage[] = [];
  let intentionalDisconnect = false;
  let reconnectCount = 0;
  
  const setState = (newState: ConnectionState) => {
    state = newState;
    events.onStateChange?.(state);
  };
  
  const flushQueue = () => {
    if (ws && state === 'connected') {
      for (const msg of messageQueue) {
        ws.send(serializeClientMessage(msg));
      }
      messageQueue = [];
    }
  };
  
  const connect = () => {
    intentionalDisconnect = false;
    setState('connecting');
    
    const url = buildRoomUrl(host, roomCode);
    ws = new WebSocket(url);
    
    ws.onopen = () => {
      setState('connected');
      reconnectCount = 0;
      flushQueue();
    };
    
    ws.onclose = () => {
      if (intentionalDisconnect) {
        setState('disconnected');
      } else if (reconnectCount < reconnectAttempts) {
        setState('reconnecting');
        reconnectCount++;
        setTimeout(connect, reconnectDelay);
      } else {
        setState('disconnected');
      }
    };
    
    ws.onerror = (event) => {
      events.onError?.(new Error('WebSocket error'));
    };
    
    ws.onmessage = (event) => {
      const message = deserializeServerMessage(event.data);
      if (message) {
        events.onMessage?.(message);
      }
    };
  };
  
  const disconnect = () => {
    intentionalDisconnect = true;
    ws?.close();
    ws = null;
    setState('disconnected');
  };
  
  const send = (message: ClientMessage) => {
    if (state === 'connected' && ws) {
      ws.send(serializeClientMessage(message));
    } else {
      messageQueue.push(message);
    }
  };
  
  return {
    get state() { return state; },
    get roomCode() { return roomCode; },
    connect,
    disconnect,
    send,
    getQueuedMessages: () => [...messageQueue],
    clearQueue: () => { messageQueue = []; },
  };
}

/**
 * Create a mock client for testing (no actual WebSocket)
 */
export function createMockClient(options: MultiplayerClientOptions): MultiplayerClient & {
  /** Simulate receiving a message from server */
  simulateMessage(message: ServerMessage): void;
  /** Simulate connection success */
  simulateConnect(): void;
  /** Simulate disconnection */
  simulateDisconnect(): void;
  /** Simulate connection error */
  simulateError(error: Error): void;
} {
  const { roomCode, events } = options;
  
  let state: ConnectionState = 'disconnected';
  let messageQueue: ClientMessage[] = [];
  let wasConnected = false;
  let intentionalDisconnect = false;
  
  const setState = (newState: ConnectionState) => {
    state = newState;
    events.onStateChange?.(state);
  };
  
  const flushQueue = () => {
    if (state === 'connected') {
      messageQueue = [];
    }
  };
  
  return {
    get state() { return state; },
    get roomCode() { return roomCode; },
    
    connect() {
      intentionalDisconnect = false;
      setState('connecting');
    },
    
    disconnect() {
      intentionalDisconnect = true;
      wasConnected = false;
      setState('disconnected');
    },
    
    send(message: ClientMessage) {
      if (state === 'connected') {
        // In mock, we just don't queue (simulates sending)
      } else {
        messageQueue.push(message);
      }
    },
    
    getQueuedMessages() {
      return [...messageQueue];
    },
    
    clearQueue() {
      messageQueue = [];
    },
    
    // Mock-specific methods
    simulateConnect() {
      wasConnected = true;
      setState('connected');
      flushQueue();
    },
    
    simulateDisconnect() {
      if (wasConnected && !intentionalDisconnect) {
        setState('reconnecting');
      } else {
        setState('disconnected');
      }
    },
    
    simulateError(error: Error) {
      events.onError?.(error);
      setState('disconnected');
    },
    
    simulateMessage(message: ServerMessage) {
      events.onMessage?.(message);
    },
  };
}
