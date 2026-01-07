/**
 * Multiplayer type definitions
 */

import type { Board, TetrominoType, Piece, GameState } from '../game/types';

/** Player identifier */
export type PlayerId = string;

/** Target selection modes for garbage attacks */
export type TargetMode = 'random' | 'badges' | 'attacker' | 'lowest';

/** Player colors assigned in order */
export const PLAYER_COLORS = ['cyan', 'green', 'orange', 'purple'] as const;
export type PlayerColor = typeof PLAYER_COLORS[number];

/** Player in a multiplayer game */
export interface MultiplayerPlayer {
  id: PlayerId;
  name: string;
  color: PlayerColor;
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
}

/** Individual player's game state in multiplayer */
export interface PlayerGameState {
  playerId: PlayerId;
  board: Board;
  currentPiece: Piece | null;
  nextPieces: TetrominoType[];
  heldPiece: TetrominoType | null;
  canHold: boolean;
  score: number;
  level: number;
  lines: number;
  state: GameState | 'eliminated' | 'spectating';
  placement: number | null; // 1-4 when eliminated
  pendingGarbage: number;
  garbageSent: number;
  knockouts: number; // Number of players this player eliminated
}

/** Garbage attack event */
export interface GarbageAttack {
  fromPlayerId: PlayerId;
  toPlayerId: PlayerId;
  lines: number;
  timestamp: number;
}

/** Multiplayer lobby state */
export interface LobbyState {
  roomCode: string;
  hostId: PlayerId;
  players: MultiplayerPlayer[];
  maxPlayers: 4;
  isStarting: boolean;
  countdown: number | null;
}

/** Complete multiplayer game state */
export interface MultiplayerGameState {
  roomCode: string;
  players: PlayerGameState[];
  targetMode: TargetMode;
  garbageQueue: GarbageAttack[];
  isGameOver: boolean;
  winnerId: PlayerId | null;
  startTime: number | null;
}

/** Local multiplayer config (same device) */
export interface LocalMultiplayerConfig {
  playerCount: 2;
  player1Controls: 'arrows';
  player2Controls: 'wasd';
}

/** Result for garbage calculation */
export interface GarbageResult {
  linesSent: number;
  isBackToBack: boolean;
}
