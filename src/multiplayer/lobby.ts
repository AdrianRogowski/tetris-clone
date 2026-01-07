/**
 * Lobby state management
 */

import type { LobbyState, MultiplayerPlayer, PlayerId, PlayerColor } from './types';
import { PLAYER_COLORS } from './types';

/** Room code length */
export const ROOM_CODE_LENGTH = 6;

/** Maximum players in a lobby */
export const MAX_PLAYERS = 4;

/** Minimum players to start */
export const MIN_PLAYERS = 2;

/** Characters used for room codes (uppercase alphanumeric) */
const ROOM_CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Generate a random room code
 */
export function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * ROOM_CODE_CHARS.length);
    code += ROOM_CODE_CHARS[randomIndex];
  }
  return code;
}

/**
 * Validate room code format
 */
export function isValidRoomCode(code: string): boolean {
  if (!code || code.length !== ROOM_CODE_LENGTH) return false;
  // Must be uppercase alphanumeric only
  return /^[A-Z0-9]+$/.test(code);
}

/**
 * Assign the next available color to a player
 */
export function getNextAvailableColor(lobby: LobbyState): PlayerColor {
  const usedColors = new Set(lobby.players.map(p => p.color));
  
  for (const color of PLAYER_COLORS) {
    if (!usedColors.has(color)) {
      return color;
    }
  }
  
  // Fallback (should never happen with max 4 players)
  return PLAYER_COLORS[0];
}

/**
 * Create a new lobby
 */
export function createLobby(hostId: PlayerId, hostName: string): LobbyState {
  const lobby: LobbyState = {
    roomCode: generateRoomCode(),
    hostId,
    players: [],
    maxPlayers: 4,
    isStarting: false,
    countdown: null,
  };
  
  // Add host as first player with first color
  const hostPlayer: MultiplayerPlayer = {
    id: hostId,
    name: hostName,
    color: PLAYER_COLORS[0], // cyan
    isHost: true,
    isReady: false,
    isConnected: true,
  };
  
  lobby.players.push(hostPlayer);
  
  return lobby;
}

/**
 * Add player to lobby
 */
export function addPlayer(
  lobby: LobbyState,
  playerId: PlayerId,
  playerName: string
): LobbyState | { error: string } {
  // Check if lobby is full
  if (lobby.players.length >= lobby.maxPlayers) {
    return { error: 'Lobby is full' };
  }
  
  // Check if player ID already exists
  if (lobby.players.some(p => p.id === playerId)) {
    return { error: 'Player already in lobby' };
  }
  
  const newPlayer: MultiplayerPlayer = {
    id: playerId,
    name: playerName,
    color: getNextAvailableColor(lobby),
    isHost: false,
    isReady: false,
    isConnected: true,
  };
  
  return {
    ...lobby,
    players: [...lobby.players, newPlayer],
  };
}

/**
 * Remove player from lobby
 */
export function removePlayer(lobby: LobbyState, playerId: PlayerId): LobbyState {
  const playerIndex = lobby.players.findIndex(p => p.id === playerId);
  
  // Player not found, return unchanged
  if (playerIndex === -1) {
    return lobby;
  }
  
  const wasHost = lobby.players[playerIndex].isHost;
  const newPlayers = lobby.players.filter(p => p.id !== playerId);
  
  let newLobby: LobbyState = {
    ...lobby,
    players: newPlayers,
  };
  
  // If host left and there are remaining players, transfer host
  if (wasHost && newPlayers.length > 0) {
    newLobby = transferHost(newLobby, newPlayers[0].id);
  }
  
  return newLobby;
}

/**
 * Toggle player ready status
 */
export function toggleReady(lobby: LobbyState, playerId: PlayerId): LobbyState {
  return {
    ...lobby,
    players: lobby.players.map(p =>
      p.id === playerId ? { ...p, isReady: !p.isReady } : p
    ),
  };
}

/**
 * Check if lobby can start (2+ players, all ready)
 */
export function canStartGame(lobby: LobbyState): boolean {
  if (lobby.players.length < MIN_PLAYERS) return false;
  return lobby.players.every(p => p.isReady);
}

/**
 * Check if lobby is full
 */
export function isLobbyFull(lobby: LobbyState): boolean {
  return lobby.players.length >= lobby.maxPlayers;
}

/**
 * Transfer host to another player
 */
export function transferHost(lobby: LobbyState, newHostId: PlayerId): LobbyState {
  return {
    ...lobby,
    hostId: newHostId,
    players: lobby.players.map(p => ({
      ...p,
      isHost: p.id === newHostId,
    })),
  };
}

/**
 * Start countdown to begin game
 */
export function startCountdown(lobby: LobbyState): LobbyState {
  return {
    ...lobby,
    isStarting: true,
    countdown: 3,
  };
}

/**
 * Update countdown timer
 */
export function updateCountdown(lobby: LobbyState, seconds: number): LobbyState {
  return {
    ...lobby,
    countdown: seconds,
  };
}

/**
 * Cancel countdown
 */
export function cancelCountdown(lobby: LobbyState): LobbyState {
  return {
    ...lobby,
    isStarting: false,
    countdown: null,
  };
}
