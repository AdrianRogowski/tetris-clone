/**
 * Message types for client-server communication
 */

import type { Board, TetrominoType } from '../../game/types';
import type { TargetMode, PlayerColor, PlayerId } from '../types';

// ============================================================================
// Client → Server Messages
// ============================================================================

export interface JoinMessage {
  type: 'join';
  playerName: string;
}

export interface ReadyMessage {
  type: 'ready';
  isReady: boolean;
}

export interface StartMessage {
  type: 'start';
}

export interface GarbageMessage {
  type: 'garbage';
  lines: number;
  targetMode: TargetMode;
}

export interface BoardUpdateMessage {
  type: 'boardUpdate';
  board: Board;
  score: number;
  lines: number;
  level: number;
}

export interface EliminatedMessage {
  type: 'eliminated';
}

export interface SetTargetMessage {
  type: 'setTarget';
  mode: TargetMode;
}

export interface LeaveMessage {
  type: 'leave';
}

export interface PlayAgainMessage {
  type: 'playAgain';
}

export type ClientMessage =
  | JoinMessage
  | ReadyMessage
  | StartMessage
  | GarbageMessage
  | BoardUpdateMessage
  | EliminatedMessage
  | SetTargetMessage
  | LeaveMessage
  | PlayAgainMessage;

// ============================================================================
// Server → Client Messages
// ============================================================================

export interface NetworkPlayer {
  id: PlayerId;
  name: string;
  color: PlayerColor;
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
}

export interface RoomStateMessage {
  type: 'roomState';
  roomCode: string;
  hostId: PlayerId;
  players: NetworkPlayer[];
  isStarting: boolean;
  countdown: number | null;
}

export interface PlayerJoinedMessage {
  type: 'playerJoined';
  player: NetworkPlayer;
}

export interface PlayerLeftMessage {
  type: 'playerLeft';
  playerId: PlayerId;
}

export interface PlayerReadyMessage {
  type: 'playerReady';
  playerId: PlayerId;
  isReady: boolean;
}

export interface CountdownMessage {
  type: 'countdown';
  seconds: number;
}

export interface GameStartMessage {
  type: 'gameStart';
  seed: number;
  playerOrder: PlayerId[];
}

export interface GarbageAttackMessage {
  type: 'garbageAttack';
  fromId: PlayerId;
  toId: PlayerId;
  lines: number;
}

export interface PlayerUpdateMessage {
  type: 'playerUpdate';
  playerId: PlayerId;
  board: Board;
  score: number;
  lines: number;
  level: number;
}

export interface PlayerEliminatedMessage {
  type: 'playerEliminated';
  playerId: PlayerId;
  placement: number;
  eliminatedBy: PlayerId | null;
}

export interface Standing {
  playerId: PlayerId;
  placement: number;
  score: number;
  lines: number;
}

export interface GameOverMessage {
  type: 'gameOver';
  winnerId: PlayerId;
  standings: Standing[];
}

export interface HostChangedMessage {
  type: 'hostChanged';
  newHostId: PlayerId;
}

export interface ErrorMessage {
  type: 'error';
  code: string;
  message: string;
}

export interface PlayerDisconnectedMessage {
  type: 'playerDisconnected';
  playerId: PlayerId;
}

export interface PlayerReconnectedMessage {
  type: 'playerReconnected';
  playerId: PlayerId;
}

export interface RoomResetMessage {
  type: 'roomReset';
  roomCode: string;
  hostId: PlayerId;
  players: NetworkPlayer[];
}

export type ServerMessage =
  | RoomStateMessage
  | PlayerJoinedMessage
  | PlayerLeftMessage
  | PlayerReadyMessage
  | CountdownMessage
  | GameStartMessage
  | GarbageAttackMessage
  | PlayerUpdateMessage
  | PlayerEliminatedMessage
  | GameOverMessage
  | HostChangedMessage
  | ErrorMessage
  | PlayerDisconnectedMessage
  | PlayerReconnectedMessage
  | RoomResetMessage;

// ============================================================================
// Message Type Lists
// ============================================================================

const CLIENT_MESSAGE_TYPES = ['join', 'ready', 'start', 'garbage', 'boardUpdate', 'eliminated', 'setTarget', 'leave', 'playAgain'] as const;

const SERVER_MESSAGE_TYPES = [
  'roomState', 'playerJoined', 'playerLeft', 'playerReady',
  'countdown', 'gameStart', 'garbageAttack', 'playerUpdate',
  'playerEliminated', 'gameOver', 'hostChanged', 'error',
  'playerDisconnected', 'playerReconnected', 'roomReset'
] as const;

/**
 * Get all valid client message types
 */
export function getClientMessageTypes(): string[] {
  return [...CLIENT_MESSAGE_TYPES];
}

/**
 * Get all valid server message types
 */
export function getServerMessageTypes(): string[] {
  return [...SERVER_MESSAGE_TYPES];
}

// ============================================================================
// Serialization / Validation
// ============================================================================

/**
 * Serialize a client message to JSON string
 */
export function serializeClientMessage(message: ClientMessage): string {
  return JSON.stringify(message);
}

/**
 * Deserialize a server message from JSON string
 */
export function deserializeServerMessage(json: string): ServerMessage | null {
  if (!json) return null;
  
  try {
    const parsed = JSON.parse(json);
    if (!isValidServerMessage(parsed)) {
      return null;
    }
    return parsed as ServerMessage;
  } catch {
    return null;
  }
}

/**
 * Validate that a client message has required fields
 */
export function isValidClientMessage(message: unknown): message is ClientMessage {
  if (!message || typeof message !== 'object') return false;
  
  const msg = message as Record<string, unknown>;
  
  if (!('type' in msg) || typeof msg.type !== 'string') return false;
  if (!CLIENT_MESSAGE_TYPES.includes(msg.type as typeof CLIENT_MESSAGE_TYPES[number])) return false;
  
  // Validate specific message types
  switch (msg.type) {
    case 'join':
      return typeof msg.playerName === 'string';
    case 'ready':
      return typeof msg.isReady === 'boolean';
    case 'garbage':
      return typeof msg.lines === 'number' && typeof msg.targetMode === 'string';
    case 'boardUpdate':
      return Array.isArray(msg.board) && typeof msg.score === 'number' && typeof msg.lines === 'number';
    case 'setTarget':
      return typeof msg.mode === 'string';
    case 'start':
    case 'eliminated':
    case 'leave':
    case 'playAgain':
      return true;
    default:
      return false;
  }
}

/**
 * Validate that a server message has required fields
 */
export function isValidServerMessage(message: unknown): message is ServerMessage {
  if (!message || typeof message !== 'object') return false;
  
  const msg = message as Record<string, unknown>;
  
  if (!('type' in msg) || typeof msg.type !== 'string') return false;
  if (!SERVER_MESSAGE_TYPES.includes(msg.type as typeof SERVER_MESSAGE_TYPES[number])) return false;
  
  // Validate specific message types
  switch (msg.type) {
    case 'roomState':
      return typeof msg.roomCode === 'string' && typeof msg.hostId === 'string' && Array.isArray(msg.players);
    case 'playerJoined':
      return typeof msg.player === 'object' && msg.player !== null;
    case 'playerLeft':
    case 'playerDisconnected':
    case 'playerReconnected':
      return typeof msg.playerId === 'string';
    case 'playerReady':
      return typeof msg.playerId === 'string' && typeof msg.isReady === 'boolean';
    case 'countdown':
      return typeof msg.seconds === 'number';
    case 'gameStart':
      return typeof msg.seed === 'number' && Array.isArray(msg.playerOrder);
    case 'garbageAttack':
      return typeof msg.fromId === 'string' && typeof msg.toId === 'string' && typeof msg.lines === 'number';
    case 'playerUpdate':
      return typeof msg.playerId === 'string' && Array.isArray(msg.board);
    case 'playerEliminated':
      return typeof msg.playerId === 'string' && typeof msg.placement === 'number';
    case 'gameOver':
      return typeof msg.winnerId === 'string' && Array.isArray(msg.standings);
    case 'hostChanged':
      return typeof msg.newHostId === 'string';
    case 'error':
      return typeof msg.code === 'string' && typeof msg.message === 'string';
    case 'roomReset':
      return typeof msg.roomCode === 'string' && typeof msg.hostId === 'string' && Array.isArray(msg.players);
    default:
      return false;
  }
}
