/**
 * Multiplayer module exports
 */

// Types
export * from './types';

// Garbage mechanics
export {
  calculateGarbage,
  createGarbageAttack,
  applyGarbage,
  generateGarbageLine,
  cancelGarbage,
  calculateNetGarbage,
} from './garbage';

// Target selection
export {
  selectTarget,
  getValidTargets,
  selectRandomTarget,
  selectBadgesTarget,
  selectLowestTarget,
  selectAttackerTarget,
} from './targeting';

// Multiplayer game state
export {
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

// Local multiplayer
export {
  PLAYER1_CONTROLS,
  PLAYER2_CONTROLS,
  parseKeyPress,
  isPlayer1Key,
  isPlayer2Key,
  createLocalConfig,
  shouldPauseGame,
  getActionForPlayer,
} from './localMultiplayer';

// Lobby
export {
  ROOM_CODE_LENGTH,
  MAX_PLAYERS,
  MIN_PLAYERS,
  generateRoomCode,
  isValidRoomCode,
  createLobby,
  addPlayer,
  removePlayer,
  getNextAvailableColor,
  toggleReady,
  canStartGame,
  isLobbyFull,
  transferHost,
  startCountdown,
  updateCountdown,
  cancelCountdown,
} from './lobby';
