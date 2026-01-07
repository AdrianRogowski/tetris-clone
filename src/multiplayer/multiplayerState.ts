/**
 * Multiplayer game state management
 */

import type {
  MultiplayerGameState,
  PlayerGameState,
  PlayerId,
  TargetMode,
  GarbageAttack,
  MultiplayerPlayer,
} from './types';
import { createEmptyBoard, BOARD_BUFFER } from '../game/board';

/**
 * Initialize a player's game state for multiplayer
 */
export function createPlayerGameState(player: MultiplayerPlayer): PlayerGameState {
  return {
    playerId: player.id,
    board: createEmptyBoard(),
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
  };
}

/**
 * Create initial multiplayer game state
 */
export function createMultiplayerGame(
  roomCode: string,
  players: MultiplayerPlayer[]
): MultiplayerGameState {
  return {
    roomCode,
    players: players.map(p => createPlayerGameState(p)),
    targetMode: 'random',
    garbageQueue: [],
    isGameOver: false,
    winnerId: null,
    startTime: null,
  };
}

/**
 * Check if player is eliminated (board overflow)
 * A player is eliminated if there are any pieces in the spawn area (buffer zone)
 */
export function checkElimination(playerState: PlayerGameState): boolean {
  const board = playerState.board;
  
  // Check if any cells in the buffer zone (top rows) are filled
  // Buffer zone is rows 0 to BOARD_BUFFER-1 in the board array
  // But the first visible row (at BOARD_BUFFER) is where new pieces spawn
  // If there's a piece at the spawn row that blocks, game is over
  for (let x = 0; x < (board[BOARD_BUFFER]?.length ?? 10); x++) {
    if (board[BOARD_BUFFER][x] !== null) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get living players (not eliminated)
 */
export function getLivingPlayers(gameState: MultiplayerGameState): PlayerGameState[] {
  return gameState.players.filter(p => p.state !== 'eliminated');
}

/**
 * Get current placement number (based on eliminations)
 * Returns the placement that would be assigned to the next eliminated player
 */
export function getCurrentPlacement(gameState: MultiplayerGameState): number {
  const livingPlayers = getLivingPlayers(gameState);
  return livingPlayers.length;
}

/**
 * Eliminate a player and assign placement
 */
export function eliminatePlayer(
  gameState: MultiplayerGameState,
  playerId: PlayerId
): MultiplayerGameState {
  const placement = getCurrentPlacement(gameState);
  
  return {
    ...gameState,
    players: gameState.players.map(p =>
      p.playerId === playerId
        ? { ...p, state: 'eliminated' as const, placement }
        : p
    ),
  };
}

/**
 * Check for win condition (one player remaining)
 * Returns the winner's player ID if there is one, null otherwise
 */
export function checkWinCondition(gameState: MultiplayerGameState): PlayerId | null {
  // If game is already over, return existing winner
  if (gameState.isGameOver && gameState.winnerId) {
    return gameState.winnerId;
  }
  
  const livingPlayers = getLivingPlayers(gameState);
  
  // If only one player remains, they win
  if (livingPlayers.length === 1) {
    return livingPlayers[0].playerId;
  }
  
  return null;
}

/**
 * Add garbage attack to queue
 */
export function queueGarbageAttack(
  gameState: MultiplayerGameState,
  attack: GarbageAttack
): MultiplayerGameState {
  // Add attack to queue
  const newQueue = [...gameState.garbageQueue, attack];
  
  // Update target's pending garbage
  const updatedPlayers = gameState.players.map(p =>
    p.playerId === attack.toPlayerId
      ? { ...p, pendingGarbage: p.pendingGarbage + attack.lines }
      : p
  );
  
  return {
    ...gameState,
    garbageQueue: newQueue,
    players: updatedPlayers,
  };
}

/**
 * Process garbage attacks in queue
 * This would apply pending garbage to players - implementation depends on game loop
 */
export function processGarbageQueue(
  gameState: MultiplayerGameState
): MultiplayerGameState {
  // For now, just return the state - garbage application happens when pieces lock
  return gameState;
}

/**
 * Update a specific player's state
 */
export function updatePlayerState(
  gameState: MultiplayerGameState,
  playerId: PlayerId,
  updates: Partial<PlayerGameState>
): MultiplayerGameState {
  return {
    ...gameState,
    players: gameState.players.map(p =>
      p.playerId === playerId
        ? { ...p, ...updates }
        : p
    ),
  };
}

/**
 * Change target mode
 */
export function setTargetMode(
  gameState: MultiplayerGameState,
  mode: TargetMode
): MultiplayerGameState {
  return {
    ...gameState,
    targetMode: mode,
  };
}
