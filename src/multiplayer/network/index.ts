/**
 * Network module exports
 */

// Message types and serialization
export * from './messages';

// Client
export {
  createClient,
  createMockClient,
  getPartyHost,
  buildRoomUrl,
  type ConnectionState,
  type ClientEvents,
  type MultiplayerClientOptions,
  type MultiplayerClient,
} from './client';

// Room state
export {
  createInitialRoomState,
  applyServerMessage,
  isHost,
  allPlayersReady,
  getMyPlayer,
  canStartGame,
  type RoomPhase,
  type OpponentState,
  type RoomState,
} from './roomState';

// Hooks
export * from './hooks';
