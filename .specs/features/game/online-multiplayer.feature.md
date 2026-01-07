# Online Multiplayer (Phase 2)

**Source Files**: 
- `src/multiplayer/network/` (new)
- `party/` (PartyKit server)
**Design System**: `.specs/design-system/tokens.md`
**Created**: 2026-01-06
**Depends On**: `multiplayer.feature.md` (garbage, targeting, lobby state)

---

## Overview

Real-time online multiplayer using PartyKit for WebSocket communication. Players can create/join rooms using 6-character codes and compete in 2-4 player matches across different devices.

### Why PartyKit?

- Serverless (no separate server infrastructure)
- Built specifically for real-time multiplayer
- Native room/party concept matches our lobby system
- Works seamlessly with Vite
- Handles reconnection automatically
- Free tier sufficient for this use case

---

## Feature: Online Multiplayer Networking

### Scenario: Create online game room
```gherkin
Given I am on the multiplayer menu
When I click "Create Game"
Then a WebSocket connection should be established
And a new PartyKit room should be created
And I should see my 6-character room code
And I should be in the lobby as host
```

### Scenario: Join online game room
```gherkin
Given another player has created room "ABC123"
When I enter code "ABC123" and click "Join"
Then a WebSocket connection should be established to room "ABC123"
And I should appear in the lobby player list
And the host should see me join in real-time
```

### Scenario: Real-time lobby sync
```gherkin
Given I am in a lobby with other players
When any player toggles ready status
Then all players should see the update within 100ms
When the host clicks "Start Game"
Then all players should see the countdown simultaneously
```

### Scenario: Game state synchronization
```gherkin
Given a multiplayer game is in progress
Then each player's game runs locally (client-authoritative for moves)
And line clears are broadcast to all players
And garbage attacks are sent through the server
And board states sync every 500ms for spectator views
```

### Scenario: Send garbage attack
```gherkin
Given Player 1 clears 4 lines (Tetris)
Then Player 1's client sends "garbage" event to server
And server determines target based on targeting mode
And target player receives garbage attack event
And garbage indicator appears on target's screen
And garbage is applied after target's next piece locks
```

### Scenario: Player disconnects mid-game
```gherkin
Given a game is in progress
When a player's connection drops
Then other players see "DISCONNECTED" on that player's board
And a 10-second reconnection timer starts
If player reconnects within 10 seconds
  Then they resume playing with current state
Else
  Then they are eliminated
  And remaining players continue
```

### Scenario: Host migration
```gherkin
Given Player 1 is the host
When Player 1 disconnects from the lobby
Then the server promotes Player 2 to host
And all players receive the host change event
And Player 2 can now start the game
```

### Scenario: Room cleanup
```gherkin
Given a room exists
When all players leave or disconnect
Then the room is cleaned up after 60 seconds
And the room code becomes available for reuse
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           ARCHITECTURE                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────┐         ┌─────────────┐         ┌─────────────┐      │
│   │  Client 1   │◄───────►│  PartyKit   │◄───────►│  Client 2   │      │
│   │  (Browser)  │   WS    │   Server    │   WS    │  (Browser)  │      │
│   └─────────────┘         └─────────────┘         └─────────────┘      │
│         │                       │                       │              │
│         │                       │                       │              │
│         ▼                       ▼                       ▼              │
│   ┌─────────────┐         ┌─────────────┐         ┌─────────────┐      │
│   │ Local Game  │         │ Room State  │         │ Local Game  │      │
│   │   State     │         │ • Players   │         │   State     │      │
│   │ (moves are  │         │ • Garbage Q │         │ (moves are  │      │
│   │  local)     │         │ • Scores    │         │  local)     │      │
│   └─────────────┘         └─────────────┘         └─────────────┘      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Message Types

```typescript
// Client → Server
type ClientMessage =
  | { type: 'join'; playerName: string }
  | { type: 'ready'; isReady: boolean }
  | { type: 'start' }  // host only
  | { type: 'garbage'; lines: number; targetMode: TargetMode }
  | { type: 'boardUpdate'; board: Board; score: number; lines: number }
  | { type: 'eliminated' }
  | { type: 'setTarget'; mode: TargetMode }
  | { type: 'leave' }

// Server → Client
type ServerMessage =
  | { type: 'roomState'; state: LobbyState }
  | { type: 'playerJoined'; player: MultiplayerPlayer }
  | { type: 'playerLeft'; playerId: string }
  | { type: 'playerReady'; playerId: string; isReady: boolean }
  | { type: 'countdown'; seconds: number }
  | { type: 'gameStart'; seed: number }  // shared RNG seed
  | { type: 'garbageAttack'; fromId: string; toId: string; lines: number }
  | { type: 'playerUpdate'; playerId: string; board: Board; score: number }
  | { type: 'playerEliminated'; playerId: string; placement: number }
  | { type: 'gameOver'; winnerId: string; standings: Standing[] }
  | { type: 'hostChanged'; newHostId: string }
  | { type: 'error'; message: string }
```

---

## File Structure

```
party/
  └── tetris.ts              # PartyKit server (room logic)

src/multiplayer/
  ├── network/
  │   ├── client.ts          # WebSocket client wrapper
  │   ├── client.test.ts     # Client tests (mocked WS)
  │   ├── messages.ts        # Message type definitions
  │   ├── messages.test.ts   # Message serialization tests
  │   ├── hooks/
  │   │   ├── usePartySocket.ts      # React hook for connection
  │   │   └── useMultiplayerGame.ts  # Game state sync hook
  │   └── index.ts
  ├── (existing files...)
  └── index.ts               # Updated exports
```

---

## Implementation Plan

### Step 1: Setup PartyKit
- Install `partykit` and `partysocket`
- Create `party/tetris.ts` server
- Configure `partykit.json`
- Add dev/deploy scripts to `package.json`

### Step 2: Message Layer
- Define message types in `messages.ts`
- Create serialization/validation helpers
- Write unit tests for message handling

### Step 3: Client Wrapper
- Create `client.ts` with connection management
- Handle connect/disconnect/reconnect
- Message queue for offline resilience
- Write tests with mocked WebSocket

### Step 4: React Hooks
- `usePartySocket` - connection lifecycle
- `useMultiplayerGame` - game state synchronization
- `useLobby` - lobby state management

### Step 5: Server Logic
- Room state management
- Player join/leave handling
- Garbage attack routing
- Host migration
- Game start synchronization (shared RNG seed)

### Step 6: UI Integration
- Connect lobby components to network
- Add connection status indicator
- Handle loading/error states
- Implement opponent board updates

---

## Test Strategy

### Unit Tests (Mocked WebSocket)
- [ ] Message serialization/deserialization
- [ ] Client connection state machine
- [ ] Reconnection logic
- [ ] Message queue (offline handling)
- [ ] Room state updates from server messages

### Integration Tests
- [ ] Join room flow (mock server responses)
- [ ] Ready → countdown → start flow
- [ ] Garbage attack routing
- [ ] Player elimination broadcast
- [ ] Host migration

### E2E Tests (Optional - requires running PartyKit)
- [ ] Two browsers connect to same room
- [ ] Full game to completion
- [ ] Disconnect/reconnect during game

---

## Suggested Unit Test Cases

### Messages (UT-MSG)
- [ ] MSG-001: Serialize client messages to JSON
- [ ] MSG-002: Deserialize server messages from JSON
- [ ] MSG-003: Validate required fields present
- [ ] MSG-004: Handle unknown message types gracefully

### Client (UT-NET)
- [ ] NET-001: Connect to room by code
- [ ] NET-002: Handle connection error
- [ ] NET-003: Reconnect on disconnect
- [ ] NET-004: Queue messages when disconnected
- [ ] NET-005: Flush queue on reconnect
- [ ] NET-006: Emit events for state changes
- [ ] NET-007: Clean disconnect on leave

### Room State (UT-ROOM)
- [ ] ROOM-001: Update state on playerJoined
- [ ] ROOM-002: Update state on playerLeft
- [ ] ROOM-003: Update state on playerReady
- [ ] ROOM-004: Handle countdown messages
- [ ] ROOM-005: Transition to game on gameStart
- [ ] ROOM-006: Handle hostChanged
- [ ] ROOM-007: Handle garbageAttack (add to pending)
- [ ] ROOM-008: Handle playerEliminated
- [ ] ROOM-009: Handle gameOver

---

## Component References

| Component | Status | Purpose |
|-----------|--------|---------|
| MultiplayerMenu | 📝 Stub | Create/Join game buttons |
| Lobby | 📝 Stub | Room code, player list, start button |
| ConnectionStatus | 📝 Stub | Online/offline indicator |
| OpponentBoard | 📝 Stub | Mini board showing opponent state |
| GarbageIndicator | 📝 Stub | Pending garbage warning |

---

## Design Tokens Used

- `color-accent-primary` - Connected state
- `color-accent-secondary` - Disconnected/warning
- `color-error` - Connection error
- `color-text-dim` - Loading states

---

## Open Questions

- [x] Which networking solution? → **PartyKit**
- [ ] Should we persist game history/stats?
- [ ] Add chat functionality?
- [ ] Ranked matchmaking in future?

---

**Does this spec look right? Ready to write tests?**
