# Multiplayer Tetris

**Source File**: `src/multiplayer/` (planned)
**Design System**: `.specs/design-system/tokens.md`
**Created**: 2026-01-06

## Feature: Multiplayer Mode

Competitive multiplayer Tetris supporting 2-4 players on the same device or over the network. Players compete in real-time, with line clears sending "garbage" lines to opponents. Last player standing wins.

---

## Scenarios

### Connection & Lobby

### Scenario: Create multiplayer lobby
```gherkin
Given I am on the start screen
When I select "Multiplayer"
Then I should see options for "Create Game" and "Join Game"
When I select "Create Game"
Then a new lobby should be created
And I should see a room code (6 characters)
And I should be Player 1 (host)
And I should see a "Start Game" button (disabled until 2+ players)
```

### Scenario: Join multiplayer lobby
```gherkin
Given another player has created a lobby with code "ABC123"
When I select "Join Game"
And I enter the room code "ABC123"
Then I should join the lobby
And I should see myself in the player list
And the host should see me join
And I should see "Waiting for host to start..."
```

### Scenario: Lobby player limit
```gherkin
Given a lobby has 4 players
When a 5th player tries to join
Then they should see "Lobby is full"
And they should not be able to join
```

### Scenario: Player leaves lobby
```gherkin
Given I am in a lobby with other players
When I click "Leave" or close the browser
Then I should be removed from the lobby
And other players should see me leave
And if I was host, the next player becomes host
```

### Scenario: Host starts game
```gherkin
Given I am the host
And there are 2-4 players in the lobby
When I click "Start Game"
Then all players should see a 3-second countdown
And then all games should start simultaneously
```

---

### Gameplay

### Scenario: Multiplayer game layout
```gherkin
Given a multiplayer game has started with 3 players
Then I should see my board (large, center or left)
And I should see opponent boards (smaller, stacked on right)
And each board should show the player's name
And each board should show their current score
And each board should update in real-time
```

### Scenario: Send garbage lines on line clear
```gherkin
Given I am playing multiplayer
When I clear 2 lines (Double)
Then 1 garbage line should be sent to opponents
When I clear 3 lines (Triple)
Then 2 garbage lines should be sent to opponents
When I clear 4 lines (Tetris)
Then 4 garbage lines should be sent to opponents
```

### Scenario: Receive garbage lines
```gherkin
Given an opponent sends me 2 garbage lines
Then a warning indicator should appear (flashing at bottom)
And after my current piece locks
Then 2 garbage lines should appear at the bottom of my board
And the garbage lines should have one random gap per line
And existing pieces should be pushed up
```

### Scenario: Counter garbage with line clear
```gherkin
Given I have 3 pending garbage lines
When I clear 2 lines before my piece locks
Then the garbage should be reduced by 2 (to 1 pending)
And only 1 garbage line should appear on my board
```

### Scenario: Target selection (3+ players)
```gherkin
Given there are 3+ players in the game
When I clear lines
Then garbage should be sent to a target opponent
And the target is determined by targeting mode:
  - "Random": Random living opponent
  - "Badges": Player with most KOs
  - "Attacker": Player who last attacked me
  - "Lowest": Player with lowest score
And I can change targeting mode during gameplay
```

### Scenario: Player elimination
```gherkin
Given a player's board fills to the top
When they cannot spawn a new piece
Then they are eliminated
And their board shows "OUT" with their final placement
And remaining players continue
And eliminated player can spectate
```

### Scenario: Win condition
```gherkin
Given multiple players are competing
When only one player remains (others eliminated)
Then that player wins
And "WINNER!" should display on their screen
And all players should see final standings
And option to "Play Again" or "Return to Lobby"
```

---

### Spectating

### Scenario: Spectate after elimination
```gherkin
Given I have been eliminated
Then I should see all remaining players' boards
And I should see live gameplay
And I should NOT be able to interact with any game
And I should see a "Leave" button
```

---

### Network & Sync

### Scenario: Handle player disconnect
```gherkin
Given a game is in progress
When a player disconnects unexpectedly
Then their board should show "DISCONNECTED"
And they should be treated as eliminated after 10 seconds
And if host disconnects, another player becomes host
```

### Scenario: Handle network latency
```gherkin
Given players have varying network latency
Then game state should sync every 100ms
And garbage attacks should be queued with timestamps
And piece movements should be client-authoritative
And line clears should be server-verified
```

---

### Local Multiplayer (Same Device)

### Scenario: Local 2-player mode
```gherkin
Given I select "Local Multiplayer"
When I choose "2 Players"
Then I should see two boards side by side
And Player 1 uses: Arrow keys + Shift (hold) + P (pause)
And Player 2 uses: WASD + E (rotate) + Q (hold) + Tab (pause)
And both players share the same screen
```

### Scenario: Local multiplayer pause
```gherkin
Given a local multiplayer game is in progress
When any player presses their pause key
Then the entire game should pause
And a pause overlay should appear
And showing which player paused
```

---

## UI Mockup

### Multiplayer Menu

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  (bg: void)                                                                 │
│                                                                             │
│                           M U L T I P L A Y E R                             │
│                     (text: 3xl, color: accent-primary, glow)                │
│                                                                             │
│            ┌─────────────────────────────────────────────────┐              │
│            │                                                 │              │
│            │     ┌───────────────────────────────────┐       │              │
│            │     │       [ CREATE GAME ]             │       │              │
│            │     │       (primary button)            │       │              │
│            │     └───────────────────────────────────┘       │              │
│            │                                                 │              │
│            │     ┌───────────────────────────────────┐       │              │
│            │     │       [  JOIN GAME  ]             │       │              │
│            │     │       (secondary button)          │       │              │
│            │     └───────────────────────────────────┘       │              │
│            │                                                 │              │
│            │     ┌───────────────────────────────────┐       │              │
│            │     │       [ LOCAL (2P) ]              │       │              │
│            │     │       (secondary button)          │       │              │
│            │     └───────────────────────────────────┘       │              │
│            │                                                 │              │
│            └─────────────────────────────────────────────────┘              │
│                                                                             │
│                          [ ← BACK TO MENU ]                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Create Game Lobby

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                              GAME LOBBY                                     │
│                                                                             │
│                      Room Code: [ A B C 1 2 3 ]                             │
│                      (large, copyable, accent-gold)                         │
│                                                                             │
│  ┌─ PLAYERS (2/4) ──────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │   ┌─────────┐                                                        │   │
│  │   │  ★ P1   │  Player1Name          HOST       ✓ Ready               │   │
│  │   │  (you)  │  (color: accent-primary)                               │   │
│  │   └─────────┘                                                        │   │
│  │                                                                      │   │
│  │   ┌─────────┐                                                        │   │
│  │   │   P2    │  GuestPlayer42                   ✓ Ready               │   │
│  │   │         │  (color: accent-success)                               │   │
│  │   └─────────┘                                                        │   │
│  │                                                                      │   │
│  │   ┌─────────┐                                                        │   │
│  │   │   P3    │  Waiting for player...                                 │   │
│  │   │  empty  │  (color: text-dim)                                     │   │
│  │   └─────────┘                                                        │   │
│  │                                                                      │   │
│  │   ┌─────────┐                                                        │   │
│  │   │   P4    │  Waiting for player...                                 │   │
│  │   │  empty  │  (color: text-dim)                                     │   │
│  │   └─────────┘                                                        │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│        [ LEAVE ]                              [ START GAME ]                │
│        (secondary)                            (primary, disabled if <2)     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Join Game Screen

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                              JOIN GAME                                      │
│                                                                             │
│                       Enter Room Code:                                      │
│                                                                             │
│                 ┌─────────────────────────────────┐                         │
│                 │  [_] [_] [_] [_] [_] [_]        │                         │
│                 │  (6 character input boxes)      │                         │
│                 └─────────────────────────────────┘                         │
│                                                                             │
│                         [ JOIN ]                                            │
│                         (primary, disabled until 6 chars)                   │
│                                                                             │
│                 ┌─────────────────────────────────┐                         │
│                 │  ⚠️ Room not found              │ ← error state           │
│                 │  (color: error)                 │                         │
│                 └─────────────────────────────────┘                         │
│                                                                             │
│                          [ ← BACK ]                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Multiplayer Game Screen (4 Players)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌─ YOU ────────────────────────────────┐    ┌─ OPPONENTS ──────────────┐   │
│  │                                      │    │                          │   │
│  │  ┌──────┐  ┌────────────────────┐    │    │  ┌─ Player2 ──────────┐  │   │
│  │  │ HOLD │  │                    │    │    │  │ Score: 12,400      │  │   │
│  │  │      │  │  YOUR BOARD        │    │    │  │ ┌──────────────┐   │  │   │
│  │  │  ██  │  │  (full size)       │    │    │  │ │ ··········   │   │  │   │
│  │  │  ██  │  │                    │    │    │  │ │ ··········   │   │  │   │
│  │  └──────┘  │     ████           │    │    │  │ │ ····██····   │   │  │   │
│  │            │     ████           │    │    │  │ │ ████████··   │   │  │   │
│  │  Score     │                    │    │    │  │ └──────────────┘   │  │   │
│  │  8,200     │                    │    │    │  └────────────────────┘  │   │
│  │            │                    │    │    │                          │   │
│  │  Level 4   │                    │    │    │  ┌─ Player3 ──────────┐  │   │
│  │            │                    │    │    │  │ Score: 9,800       │  │   │
│  │  Lines 38  │                    │    │    │  │ ┌──────────────┐   │  │   │
│  │            │  ▓▓▓▓▓▓▓▓▓▓        │    │    │  │ │ ··········   │   │  │   │
│  │            │  ████████·█        │    │    │  │ │ ····████··   │   │  │   │
│  │  ┌──────┐  │  ██████████        │    │    │  │ │ ██████████   │   │  │   │
│  │  │ NEXT │  ├────────────────────┤    │    │  │ └──────────────┘   │  │   │
│  │  │ ████ │  │ ⚠️ 3 INCOMING!    │    │    │  └────────────────────┘  │   │
│  │  │      │  │ (garbage warning)  │    │    │                          │   │
│  │  │  ██  │  └────────────────────┘    │    │  ┌─ Player4 ──────────┐  │   │
│  │  │ ███  │                            │    │  │    ╳ OUT (4th)     │  │   │
│  │  └──────┘                            │    │  │ Final: 3,200       │  │   │
│  │                                      │    │  │ ┌──────────────┐   │  │   │
│  └──────────────────────────────────────┘    │  │ │ (greyed out) │   │  │   │
│                                              │  │ └──────────────┘   │  │   │
│  TARGET: [Random ▼]  [Badges] [Attacker]     │  └────────────────────┘  │   │
│                                              │                          │   │
│                                              └──────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Local 2-Player Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌─ PLAYER 1 (Arrows) ────────────────┐  ┌─ PLAYER 2 (WASD) ─────────────┐  │
│  │                                    │  │                               │  │
│  │  Score: 4,200    Level: 3         │  │  Score: 3,800    Level: 2     │  │
│  │                                    │  │                               │  │
│  │  ┌────┐ ┌─────────────────┐ ┌────┐│  │┌────┐ ┌─────────────────┐ ┌────┐│
│  │  │HOLD│ │                 │ │NEXT││  ││HOLD│ │                 │ │NEXT││
│  │  │    │ │                 │ │    ││  ││    │ │                 │ │    ││
│  │  │ ██ │ │   BOARD 1       │ │████││  ││████│ │   BOARD 2       │ │ ██ ││
│  │  │ ██ │ │                 │ │    ││  ││    │ │                 │ │████││
│  │  │    │ │    ████         │ │ ██ ││  ││ ██ │ │      ██         │ │    ││
│  │  └────┘ │    ████         │ │███ ││  ││███ │ │     ████        │ └────┘│
│  │         │                 │ │    ││  ││    │ │                 │       │
│  │         │                 │ └────┘│  │└────┘ │                 │       │
│  │         │                 │       │  │       │                 │       │
│  │         │ ████████████    │       │  │       │    ██████████   │       │
│  │         │ ██████████████  │       │  │       │  ██████████████ │       │
│  │         └─────────────────┘       │  │       └─────────────────┘       │
│  │                                    │  │                               │  │
│  │  Controls: ←→↓ Move, ↑ Rotate     │  │  Controls: A/D Move, W Rotate │  │
│  │            Space Drop, Shift Hold │  │            S Drop, E Hold      │  │
│  │                                    │  │                               │  │
│  └────────────────────────────────────┘  └───────────────────────────────┘  │
│                                                                             │
│                    [ P - PAUSE ]         [ ESC - QUIT ]                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Game Over / Results

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                          G A M E   O V E R                                  │
│                                                                             │
│                    ┌─────────────────────────────────┐                      │
│                    │         🏆 WINNER! 🏆           │                      │
│                    │                                 │                      │
│                    │   1st   Player1Name   24,800   │ ← gold               │
│                    │   2nd   Player2Name   18,200   │ ← silver             │
│                    │   3rd   Player3Name   12,400   │ ← bronze             │
│                    │   4th   Player4Name    6,100   │                      │
│                    │                                 │                      │
│                    └─────────────────────────────────┘                      │
│                                                                             │
│                    [ PLAY AGAIN ]    [ BACK TO LOBBY ]                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Mobile Multiplayer (Full Support)

Mobile users can fully participate in multiplayer with an optimized vertical layout.

#### Mobile Lobby
```
┌─ MOBILE LOBBY ─────────────────┐
│                                │
│         GAME LOBBY             │  ← color-accent-primary
│                                │
│  ┌──────────────────────────┐  │
│  │   Room Code (tap copy)   │  │
│  │      [ A 3 X 7 K 2 ]     │  │  ← color-accent-gold
│  └──────────────────────────┘  │
│                                │
│         ● CONNECTED            │  ← color-accent-success
│                                │
│  ┌──────────────────────────┐  │
│  │ PLAYERS (2/4)            │  │
│  │                          │  │
│  │ ★ Player1 (you)    HOST  │  │  ← Your row highlighted
│  │   ✓ READY                │  │
│  │                          │  │
│  │ ○ Player2                │  │
│  │   NOT READY              │  │
│  │                          │  │
│  │ ┄┄ Waiting... ┄┄         │  │
│  │ ┄┄ Waiting... ┄┄         │  │
│  └──────────────────────────┘  │
│                                │
│  ┌────────┐    ┌────────────┐  │
│  │ LEAVE  │    │   READY    │  │
│  └────────┘    └────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │       START GAME         │  │  ← Host only, when all ready
│  └──────────────────────────┘  │
│                                │
└────────────────────────────────┘
```

#### Mobile Game Layout
```
┌─ MOBILE MULTIPLAYER GAME ──────┐
│                                │
│  ┌─ OPPONENTS ───────────────┐ │  ← Horizontal scroll if >2
│  │ ┌────────┐  ┌────────┐    │ │
│  │ │ P2  42 │  │ P3  18 │    │ │  ← Mini boards (6x12 cells)
│  │ │┌──────┐│  │┌──────┐│    │ │
│  │ ││ mini ││  ││ mini ││    │ │
│  │ ││board ││  ││board ││    │ │
│  │ │└──────┘│  │└──────┘│    │ │
│  │ └────────┘  └────────┘    │ │
│  └───────────────────────────┘ │
│                                │
│  ┌─ STATS ─┐  ┌─ NEXT ──────┐  │
│  │ 12,400  │  │  ▓▓  T      │  │
│  │ LVL 3   │  │  ▓▓  O      │  │
│  │ 24 LNS  │  │  ▓   L      │  │
│  └─────────┘  └─────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │ ┃                        │  │  ← Garbage indicator (left edge)
│  │ ┃  ┌─────────────────┐   │  │
│  │ ┃  │                 │   │  │
│  │ ┃  │   YOUR BOARD    │   │  │  ← 10x20, cell-size: 16-20px
│  │ ┃  │   (playable)    │   │  │
│  │ ┃  │                 │   │  │
│  │ ┃  │    ▓▓▓          │   │  │
│  │ ┃  │     ▓           │   │  │
│  │    └─────────────────┘   │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │   ◄    ▼    ►      ↻  ⬇  │  │  ← Touch controls
│  │  LEFT DOWN RIGHT  ROT DRP │  │
│  │                          │  │
│  │       [ HOLD ]  [ ⏸ ]    │  │
│  └──────────────────────────┘  │
│                                │
└────────────────────────────────┘
```

#### Mobile Target Selector (Collapsed)
```
┌─ TARGET MODE (tap to expand) ──┐
│  🎲 Random  ▼                  │
└────────────────────────────────┘

┌─ TARGET MODE (expanded) ───────┐
│  🎲 Random      ← selected     │
│  🏆 Badges                     │
│  ⚔️ Attacker                   │
│  📉 Lowest                     │
└────────────────────────────────┘
```

#### Mobile Results Screen
```
┌─ MOBILE RESULTS ───────────────┐
│                                │
│           GAME OVER            │
│                                │
│         🏆 2nd PLACE           │  ← Your placement
│                                │
│  ┌──────────────────────────┐  │
│  │  STANDINGS               │  │
│  │                          │  │
│  │  1. Player3    15,200    │  │  ← Winner highlighted gold
│  │  2. You        12,400    │  │  ← Your row highlighted
│  │  3. Player2     8,100    │  │
│  │  4. Player4     3,200    │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │       PLAY AGAIN         │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │        LEAVE             │  │
│  └──────────────────────────┘  │
│                                │
└────────────────────────────────┘
```

#### Responsive Breakpoints

| Breakpoint | Width | Layout | Cell Size |
|------------|-------|--------|-----------|
| Desktop | ≥1024px | Side-by-side (board + opponents right) | 28px |
| Tablet | 768-1023px | Side-by-side (compact) | 24px |
| Mobile | <768px | Stacked vertical | 16-20px |

#### Mobile-Specific Behavior

1. **Opponent Boards**
   - Displayed in horizontal scrollable row at top
   - Mini size: ~6 cells wide × 12 cells tall
   - Shows player name + score overlay
   - Tap to expand (future enhancement)

2. **Stats Panel**
   - Compact horizontal layout
   - Score, Level, Lines in single row
   - No hold box on mobile (use HOLD button)

3. **Touch Controls**
   - Same controls as solo mobile game
   - D-pad: Left, Down, Right
   - Action buttons: Rotate, Hard Drop
   - Utility: Hold, Pause
   - Swipe down on board = hard drop
   - Tap board = rotate

4. **Target Selector**
   - Collapsed by default (saves space)
   - Tap to expand dropdown
   - Shows current mode with icon

5. **Garbage Indicator**
   - Thin bar on left edge of board
   - Same behavior as desktop

---

## Garbage Line Mechanics

| Lines Cleared | Garbage Sent | Notes |
|---------------|--------------|-------|
| 1 (Single)    | 0            | No attack |
| 2 (Double)    | 1            | |
| 3 (Triple)    | 2            | |
| 4 (Tetris)    | 4            | Most powerful |
| T-Spin Single | 2            | Phase 2 |
| T-Spin Double | 4            | Phase 2 |
| T-Spin Triple | 6            | Phase 2 |
| Back-to-back  | +1           | Consecutive Tetris/T-Spin |
| Perfect Clear | 10           | Phase 2 |

### Garbage Queue

- Garbage accumulates in a queue visible to the player
- Garbage is added to board after current piece locks
- Clearing lines reduces pending garbage 1:1
- Excess clears send garbage to opponents

---

## Component References

| Component | Status | File |
|-----------|--------|------|
| GameBoard | ✅ Exists | `src/components/GameBoard.tsx` |
| Lobby | 📝 Stub | `.specs/design-system/components/lobby.md` |
| PlayerCard | 📝 Stub | `.specs/design-system/components/player-card.md` |
| OpponentBoard | 📝 Stub | `.specs/design-system/components/opponent-board.md` |
| GarbageIndicator | 📝 Stub | `.specs/design-system/components/garbage-indicator.md` |
| TargetSelector | 📝 Stub | `.specs/design-system/components/target-selector.md` |
| RoomCodeInput | 📝 Stub | `.specs/design-system/components/room-code-input.md` |
| ResultsScreen | 📝 Stub | `.specs/design-system/components/results-screen.md` |

---

## Design Tokens Used

- `color-accent-primary` - Player 1 / your color
- `color-accent-secondary` - Attack/garbage warning
- `color-accent-success` - Player 2
- `color-accent-gold` - Winner / 1st place
- `color-piece-*` - Other player colors (use piece colors)
- `color-error` - Eliminated / disconnect states
- `color-text-dim` - Empty slots / spectator mode

---

## Technical Considerations

### Networking Options

1. **WebSocket Server** (Recommended)
   - Real-time bidirectional communication
   - Low latency for game state sync
   - Requires backend server (Node.js, Deno, etc.)

2. **WebRTC (P2P)**
   - No server needed for game traffic
   - Lower latency
   - More complex connection setup
   - Still needs signaling server for initial connection

3. **Firebase Realtime Database**
   - Quick to implement
   - Managed infrastructure
   - Higher latency (~100-200ms)
   - Suitable for casual play

### State Sync Strategy

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Client 1   │────▶│   Server    │◀────│  Client 2   │
│             │◀────│             │────▶│             │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
     - Room management    │
     - Game start sync    │
     - Garbage dispatch   │
     - Win/lose detection │
```

- Clients send: piece movements, line clears, game over
- Server sends: garbage attacks, player states, eliminations
- Local prediction for responsiveness
- Server authoritative for attacks and win conditions

---

## Open Questions

- [x] Should we require a backend server or use P2P? → **PartyKit (serverless WebSocket)**
- [ ] What's the maximum acceptable latency for competitive play?
- [ ] Should eliminated players be able to chat?
- [ ] Include ranked matchmaking in Phase 1 or Phase 2?
- [x] Support mobile players in multiplayer? → **Yes, full mobile support with touch controls**
- [ ] Add power-ups or keep classic Tetris rules only?

---

## Suggested Test Cases

### Unit Tests
- [ ] Garbage calculation for each line clear type
- [ ] Garbage queue management (add, cancel, apply)
- [ ] Target selection logic for each mode
- [ ] Win condition detection
- [ ] Player elimination detection

### Integration Tests
- [ ] Create lobby → join lobby → start game flow
- [ ] Line clear → garbage sent → garbage received flow
- [ ] Player disconnect handling
- [ ] Host migration when host leaves

### E2E Tests
- [ ] Full 2-player game to completion
- [ ] 4-player game with eliminations
- [ ] Reconnection after disconnect
- [ ] Local 2-player controls work simultaneously

---

## Phase Breakdown

### Phase 1: Local Multiplayer (Same Device) - ⏭️ Skipped
- 2-player split screen
- Shared keyboard controls
- Garbage mechanics
- No networking required

### Phase 2: Online Multiplayer - ✅ Implemented
- WebSocket server setup (PartyKit)
- Lobby system (create/join)
- Room codes
- 2-4 player support
- Network sync
- Garbage mechanics
- Targeting modes

### Phase 2.5: Mobile Multiplayer - 📋 Spec Ready
- Responsive layout (stacked vertical on mobile)
- Touch controls integration
- Compact opponent boards (horizontal scroll)
- Collapsed target selector
- Mobile-optimized stats panel

### Phase 3: Polish & Features
- Spectator mode
- Back-to-back bonuses
- T-Spin detection
- Player profiles/stats
- Ranked matchmaking

---

**Does this look right? Ready to write tests?**
