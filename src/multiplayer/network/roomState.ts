/**
 * Room state management from server messages
 */

import type { ServerMessage, NetworkPlayer, Standing } from './messages';
import type { Board } from '../../game/types';
import type { PlayerId } from '../types';

export type RoomPhase = 'lobby' | 'countdown' | 'playing' | 'gameOver';

export interface OpponentState {
  playerId: PlayerId;
  name: string;
  color: string;
  board: Board | null;
  score: number;
  lines: number;
  level: number;
  isEliminated: boolean;
  placement: number | null;
  isConnected: boolean;
}

export interface RoomState {
  phase: RoomPhase;
  roomCode: string;
  hostId: PlayerId;
  myPlayerId: PlayerId | null;
  players: NetworkPlayer[];
  opponents: Map<PlayerId, OpponentState>;
  countdown: number | null;
  isStarting: boolean;
  
  // Game state
  seed: number | null;
  pendingGarbage: number;
  lastAttacker: PlayerId | null;
  
  // Results
  winnerId: PlayerId | null;
  standings: Standing[];
  
  // Errors
  lastError: { code: string; message: string } | null;
}

/**
 * Create initial room state
 */
export function createInitialRoomState(): RoomState {
  return {
    phase: 'lobby',
    roomCode: '',
    hostId: '',
    myPlayerId: null,
    players: [],
    opponents: new Map(),
    countdown: null,
    isStarting: false,
    seed: null,
    pendingGarbage: 0,
    lastAttacker: null,
    winnerId: null,
    standings: [],
    lastError: null,
  };
}

/**
 * Apply a server message to the room state
 * Returns a new state object (immutable)
 */
export function applyServerMessage(state: RoomState, message: ServerMessage): RoomState {
  switch (message.type) {
    case 'roomState':
      console.log('[roomState] Applying roomState message:', {
        roomCode: message.roomCode,
        playerCount: message.players?.length,
        players: message.players?.map(p => ({ id: p.id.slice(0, 8), name: p.name })),
      });
      return {
        ...state,
        roomCode: message.roomCode,
        hostId: message.hostId,
        players: message.players,
        isStarting: message.isStarting,
        countdown: message.countdown,
      };
    
    case 'playerJoined': {
      // Don't duplicate existing player
      if (state.players.some(p => p.id === message.player.id)) {
        return state;
      }
      return {
        ...state,
        players: [...state.players, message.player],
      };
    }
    
    case 'playerLeft':
      return {
        ...state,
        players: state.players.filter(p => p.id !== message.playerId),
      };
    
    case 'playerReady':
      return {
        ...state,
        players: state.players.map(p =>
          p.id === message.playerId ? { ...p, isReady: message.isReady } : p
        ),
      };
    
    case 'countdown':
      return {
        ...state,
        phase: 'countdown',
        isStarting: true,
        countdown: message.seconds,
      };
    
    case 'gameStart':
      return {
        ...state,
        phase: 'playing',
        isStarting: false,
        countdown: null,
        seed: message.seed,
      };
    
    case 'hostChanged':
      return {
        ...state,
        hostId: message.newHostId,
        players: state.players.map(p => ({
          ...p,
          isHost: p.id === message.newHostId,
        })),
      };
    
    case 'garbageAttack': {
      // Only add to pending garbage if we are the target
      if (message.toId !== state.myPlayerId) {
        return state;
      }
      return {
        ...state,
        pendingGarbage: state.pendingGarbage + message.lines,
        lastAttacker: message.fromId,
      };
    }
    
    case 'playerUpdate': {
      // Don't add ourselves to the opponents map
      if (message.playerId === state.myPlayerId) {
        return state;
      }
      
      // Get player info from players list
      const playerInfo = state.players.find(p => p.id === message.playerId);
      
      const newOpponents = new Map(state.opponents);
      const existing = newOpponents.get(message.playerId);
      newOpponents.set(message.playerId, {
        playerId: message.playerId,
        name: playerInfo?.name ?? existing?.name ?? 'Player',
        color: playerInfo?.color ?? existing?.color ?? 'cyan',
        board: message.board,
        score: message.score,
        lines: message.lines,
        level: message.level,
        isEliminated: existing?.isEliminated ?? false,
        placement: existing?.placement ?? null,
        isConnected: playerInfo?.isConnected ?? existing?.isConnected ?? true,
      });
      return {
        ...state,
        opponents: newOpponents,
      };
    }
    
    case 'playerEliminated': {
      const newOpponents = new Map(state.opponents);
      const existing = newOpponents.get(message.playerId);
      if (existing) {
        newOpponents.set(message.playerId, {
          ...existing,
          isEliminated: true,
          placement: message.placement,
        });
      }
      return {
        ...state,
        opponents: newOpponents,
      };
    }
    
    case 'gameOver':
      return {
        ...state,
        phase: 'gameOver',
        winnerId: message.winnerId,
        standings: message.standings,
      };
    
    case 'error':
      return {
        ...state,
        lastError: { code: message.code, message: message.message },
      };
    
    case 'playerDisconnected': {
      const newOpponents = new Map(state.opponents);
      const existing = newOpponents.get(message.playerId);
      if (existing) {
        newOpponents.set(message.playerId, { ...existing, isConnected: false });
      }
      return {
        ...state,
        opponents: newOpponents,
        players: state.players.map(p =>
          p.id === message.playerId ? { ...p, isConnected: false } : p
        ),
      };
    }
    
    case 'playerReconnected': {
      const newOpponents = new Map(state.opponents);
      const existing = newOpponents.get(message.playerId);
      if (existing) {
        newOpponents.set(message.playerId, { ...existing, isConnected: true });
      }
      return {
        ...state,
        opponents: newOpponents,
        players: state.players.map(p =>
          p.id === message.playerId ? { ...p, isConnected: true } : p
        ),
      };
    }
    
    case 'roomReset':
      // Reset to lobby state with fresh player list
      return {
        ...state,
        phase: 'lobby',
        roomCode: message.roomCode,
        hostId: message.hostId,
        players: message.players,
        opponents: new Map(),
        countdown: null,
        isStarting: false,
        seed: null,
        pendingGarbage: 0,
        lastAttacker: null,
        winnerId: null,
        standings: [],
        lastError: null,
      };
    
    default:
      return state;
  }
}

/**
 * Check if the current player is the host
 */
export function isHost(state: RoomState): boolean {
  return state.myPlayerId !== null && state.myPlayerId === state.hostId;
}

/**
 * Check if all players are ready
 */
export function allPlayersReady(state: RoomState): boolean {
  return state.players.length > 0 && state.players.every(p => p.isReady);
}

/**
 * Get the current player's info
 */
export function getMyPlayer(state: RoomState): NetworkPlayer | null {
  if (!state.myPlayerId) return null;
  return state.players.find(p => p.id === state.myPlayerId) ?? null;
}

/**
 * Check if the game can be started (host + all ready + 2+ players)
 */
export function canStartGame(state: RoomState): boolean {
  return isHost(state) && allPlayersReady(state) && state.players.length >= 2;
}
