/**
 * PartyKit server for multiplayer Tetris
 * Handles room state, player connections, and game synchronization
 */

import type * as Party from 'partykit/server';

// ============================================================================
// Types (mirrored from client)
// ============================================================================

type PlayerId = string;
type TargetMode = 'random' | 'badges' | 'attacker' | 'lowest';
type PlayerColor = 'cyan' | 'green' | 'orange' | 'purple';

interface NetworkPlayer {
  id: PlayerId;
  name: string;
  color: PlayerColor;
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
}

interface PlayerGameState {
  score: number;
  lines: number;
  level: number;
  isEliminated: boolean;
  placement: number | null;
  knockouts: number;
}

interface RoomState {
  phase: 'lobby' | 'countdown' | 'playing' | 'gameOver';
  players: Map<PlayerId, NetworkPlayer>;
  gameStates: Map<PlayerId, PlayerGameState>;
  hostId: PlayerId | null;
  countdown: number | null;
  seed: number | null;
  garbageQueue: Array<{ fromId: PlayerId; toId: PlayerId; lines: number }>;
  startTime: number | null;
}

// ============================================================================
// Message Types
// ============================================================================

interface ClientMessage {
  type: string;
  [key: string]: unknown;
}

interface ServerMessage {
  type: string;
  [key: string]: unknown;
}

// ============================================================================
// Constants
// ============================================================================

const PLAYER_COLORS: PlayerColor[] = ['cyan', 'green', 'orange', 'purple'];
const MAX_PLAYERS = 4;
const COUNTDOWN_SECONDS = 3;
const DISCONNECT_TIMEOUT_MS = 10000;

// ============================================================================
// PartyKit Server
// ============================================================================

export default class TetrisParty implements Party.Server {
  readonly room: Party.Room;
  state: RoomState;
  disconnectTimers: Map<PlayerId, ReturnType<typeof setTimeout>>;
  countdownTimer: ReturnType<typeof setInterval> | null;

  constructor(room: Party.Room) {
    this.room = room;
    this.state = this.createInitialState();
    this.disconnectTimers = new Map();
    this.countdownTimer = null;
  }

  createInitialState(): RoomState {
    return {
      phase: 'lobby',
      players: new Map(),
      gameStates: new Map(),
      hostId: null,
      countdown: null,
      seed: null,
      garbageQueue: [],
      startTime: null,
    };
  }

  // Get next available color
  getNextColor(): PlayerColor {
    const usedColors = new Set([...this.state.players.values()].map(p => p.color));
    return PLAYER_COLORS.find(c => !usedColors.has(c)) ?? PLAYER_COLORS[0];
  }

  // Get array of players for broadcasting
  getPlayersArray(): NetworkPlayer[] {
    return [...this.state.players.values()];
  }

  // Broadcast to all connections
  broadcast(message: ServerMessage) {
    this.room.broadcast(JSON.stringify(message));
  }

  // Send to specific connection
  sendTo(connection: Party.Connection, message: ServerMessage) {
    connection.send(JSON.stringify(message));
  }

  // Handle new connection
  onConnect(connection: Party.Connection, ctx: Party.ConnectionContext) {
    // Send current room state to new connection
    this.sendTo(connection, {
      type: 'roomState',
      roomCode: this.room.id,
      hostId: this.state.hostId,
      players: this.getPlayersArray(),
      isStarting: this.state.phase === 'countdown',
      countdown: this.state.countdown,
    });
  }

  // Handle disconnection
  onClose(connection: Party.Connection) {
    const playerId = connection.id;
    const player = this.state.players.get(playerId);
    
    if (!player) return;

    if (this.state.phase === 'lobby') {
      // In lobby, remove immediately
      this.removePlayer(playerId);
    } else {
      // In game, start disconnect timer
      player.isConnected = false;
      this.broadcast({ type: 'playerDisconnected', playerId });
      
      this.disconnectTimers.set(playerId, setTimeout(() => {
        this.eliminatePlayer(playerId, null);
      }, DISCONNECT_TIMEOUT_MS));
    }
  }

  // Handle incoming messages
  onMessage(message: string, sender: Party.Connection) {
    let parsed: ClientMessage;
    try {
      parsed = JSON.parse(message);
    } catch {
      return;
    }

    const playerId = sender.id;

    switch (parsed.type) {
      case 'join':
        this.handleJoin(playerId, parsed.playerName as string);
        break;
      case 'ready':
        this.handleReady(playerId, parsed.isReady as boolean);
        break;
      case 'start':
        this.handleStart(playerId);
        break;
      case 'garbage':
        this.handleGarbage(playerId, parsed.lines as number, parsed.targetMode as TargetMode);
        break;
      case 'boardUpdate':
        this.handleBoardUpdate(playerId, parsed);
        break;
      case 'eliminated':
        this.handleEliminated(playerId);
        break;
      case 'setTarget':
        // Client-side only, no server action needed
        break;
      case 'leave':
        this.handleLeave(playerId);
        break;
      case 'playAgain':
        this.handlePlayAgain(playerId);
        break;
    }
  }

  // ============================================================================
  // Message Handlers
  // ============================================================================

  handleJoin(playerId: PlayerId, playerName: string) {
    if (this.state.phase !== 'lobby') {
      this.sendToId(playerId, { type: 'error', code: 'GAME_IN_PROGRESS', message: 'Game already in progress' });
      return;
    }

    if (this.state.players.size >= MAX_PLAYERS) {
      this.sendToId(playerId, { type: 'error', code: 'ROOM_FULL', message: 'Room is full' });
      return;
    }

    const isHost = this.state.players.size === 0;
    const player: NetworkPlayer = {
      id: playerId,
      name: playerName || `Player ${this.state.players.size + 1}`,
      color: this.getNextColor(),
      isHost,
      isReady: false,
      isConnected: true,
    };

    this.state.players.set(playerId, player);
    if (isHost) {
      this.state.hostId = playerId;
    }

    // Broadcast to all players
    this.broadcast({ type: 'playerJoined', player });
    
    // Send full state to the joining player
    this.sendToId(playerId, {
      type: 'roomState',
      roomCode: this.room.id,
      hostId: this.state.hostId,
      players: this.getPlayersArray(),
      isStarting: false,
      countdown: null,
    });
  }

  handleReady(playerId: PlayerId, isReady: boolean) {
    const player = this.state.players.get(playerId);
    if (!player) return;

    player.isReady = isReady;
    this.broadcast({ type: 'playerReady', playerId, isReady });
  }

  handleStart(playerId: PlayerId) {
    // Only host can start
    if (playerId !== this.state.hostId) return;
    
    // Need at least 2 players
    if (this.state.players.size < 2) return;
    
    // All players must be ready
    const allReady = [...this.state.players.values()].every(p => p.isReady);
    if (!allReady) return;

    this.startCountdown();
  }

  startCountdown() {
    this.state.phase = 'countdown';
    this.state.countdown = COUNTDOWN_SECONDS;
    
    this.broadcast({ type: 'countdown', seconds: COUNTDOWN_SECONDS });

    this.countdownTimer = setInterval(() => {
      if (this.state.countdown === null) return;
      
      this.state.countdown--;
      
      if (this.state.countdown <= 0) {
        this.clearCountdownTimer();
        this.startGame();
      } else {
        this.broadcast({ type: 'countdown', seconds: this.state.countdown });
      }
    }, 1000);
  }

  clearCountdownTimer() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  startGame() {
    this.state.phase = 'playing';
    this.state.countdown = null;
    this.state.seed = Math.floor(Math.random() * 1000000);
    this.state.startTime = Date.now();

    // Initialize game states
    for (const [playerId] of this.state.players) {
      this.state.gameStates.set(playerId, {
        score: 0,
        lines: 0,
        level: 1,
        isEliminated: false,
        placement: null,
        knockouts: 0,
      });
    }

    const playerOrder = [...this.state.players.keys()];
    this.broadcast({
      type: 'gameStart',
      seed: this.state.seed,
      playerOrder,
    });
  }

  handleGarbage(fromId: PlayerId, lines: number, targetMode: TargetMode) {
    if (this.state.phase !== 'playing') return;
    
    const toId = this.selectTarget(fromId, targetMode);
    if (!toId) return;

    this.broadcast({
      type: 'garbageAttack',
      fromId,
      toId,
      lines,
    });
  }

  selectTarget(fromId: PlayerId, mode: TargetMode): PlayerId | null {
    const livingPlayers = [...this.state.gameStates.entries()]
      .filter(([id, state]) => id !== fromId && !state.isEliminated)
      .map(([id]) => id);

    if (livingPlayers.length === 0) return null;

    switch (mode) {
      case 'random':
        return livingPlayers[Math.floor(Math.random() * livingPlayers.length)];
      
      case 'badges': {
        let maxKOs = -1;
        let target = livingPlayers[0];
        for (const id of livingPlayers) {
          const kos = this.state.gameStates.get(id)?.knockouts ?? 0;
          if (kos > maxKOs) {
            maxKOs = kos;
            target = id;
          }
        }
        return target;
      }
      
      case 'lowest': {
        let minScore = Infinity;
        let target = livingPlayers[0];
        for (const id of livingPlayers) {
          const score = this.state.gameStates.get(id)?.score ?? 0;
          if (score < minScore) {
            minScore = score;
            target = id;
          }
        }
        return target;
      }
      
      case 'attacker':
        // Would need to track last attacker per player
        // Fall back to random for now
        return livingPlayers[Math.floor(Math.random() * livingPlayers.length)];
      
      default:
        return livingPlayers[0];
    }
  }

  handleBoardUpdate(playerId: PlayerId, data: ClientMessage) {
    const gameState = this.state.gameStates.get(playerId);
    if (!gameState) return;

    gameState.score = (data.score as number) ?? gameState.score;
    gameState.lines = (data.lines as number) ?? gameState.lines;
    gameState.level = (data.level as number) ?? gameState.level;

    // Broadcast to other players (for opponent boards)
    this.broadcast({
      type: 'playerUpdate',
      playerId,
      board: data.board,
      score: gameState.score,
      lines: gameState.lines,
      level: gameState.level,
    });
  }

  handleEliminated(playerId: PlayerId) {
    this.eliminatePlayer(playerId, null);
  }

  eliminatePlayer(playerId: PlayerId, eliminatedBy: PlayerId | null) {
    const gameState = this.state.gameStates.get(playerId);
    if (!gameState || gameState.isEliminated) return;

    // Calculate placement
    const livingCount = [...this.state.gameStates.values()].filter(s => !s.isEliminated).length;
    gameState.isEliminated = true;
    gameState.placement = livingCount;

    // Credit knockout
    if (eliminatedBy) {
      const eliminator = this.state.gameStates.get(eliminatedBy);
      if (eliminator) {
        eliminator.knockouts++;
      }
    }

    this.broadcast({
      type: 'playerEliminated',
      playerId,
      placement: gameState.placement,
      eliminatedBy,
    });

    // Check for winner
    const remaining = [...this.state.gameStates.entries()]
      .filter(([_, state]) => !state.isEliminated);

    if (remaining.length === 1) {
      this.endGame(remaining[0][0]);
    }
  }

  endGame(winnerId: PlayerId) {
    this.state.phase = 'gameOver';

    // Set winner's placement
    const winnerState = this.state.gameStates.get(winnerId);
    if (winnerState) {
      winnerState.placement = 1;
    }

    // Build standings
    const standings = [...this.state.gameStates.entries()]
      .map(([playerId, state]) => ({
        playerId,
        placement: state.placement ?? 1,
        score: state.score,
        lines: state.lines,
      }))
      .sort((a, b) => a.placement - b.placement);

    this.broadcast({
      type: 'gameOver',
      winnerId,
      standings,
    });
  }

  handleLeave(playerId: PlayerId) {
    this.removePlayer(playerId);
  }

  handlePlayAgain(playerId: PlayerId) {
    // Only allow play again if game is over
    if (this.state.phase !== 'gameOver') return;

    // Reset room state to lobby
    this.state.phase = 'lobby';
    this.state.countdown = null;
    this.state.seed = null;
    this.state.startTime = null;
    this.state.garbageQueue = [];
    this.state.gameStates.clear();

    // Reset all players' ready states
    for (const player of this.state.players.values()) {
      player.isReady = false;
    }

    // Broadcast the reset room state to all players
    this.broadcast({
      type: 'roomReset',
      roomCode: this.room.id,
      hostId: this.state.hostId,
      players: this.getPlayersArray(),
    });
  }

  removePlayer(playerId: PlayerId) {
    const player = this.state.players.get(playerId);
    if (!player) return;

    const wasHost = player.isHost;
    this.state.players.delete(playerId);
    this.state.gameStates.delete(playerId);

    // Cancel any disconnect timer
    const timer = this.disconnectTimers.get(playerId);
    if (timer) {
      clearTimeout(timer);
      this.disconnectTimers.delete(playerId);
    }

    this.broadcast({ type: 'playerLeft', playerId });

    // Transfer host if needed
    if (wasHost && this.state.players.size > 0) {
      const newHost = [...this.state.players.values()][0];
      newHost.isHost = true;
      this.state.hostId = newHost.id;
      this.broadcast({ type: 'hostChanged', newHostId: newHost.id });
    }
  }

  // Helper to send to a specific player by ID
  sendToId(playerId: PlayerId, message: ServerMessage) {
    for (const connection of this.room.getConnections()) {
      if (connection.id === playerId) {
        this.sendTo(connection, message);
        break;
      }
    }
  }
}
