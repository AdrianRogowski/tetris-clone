# Tetris Core Gameplay

**Source File**: `src/game/` (planned)
**Design System**: `.specs/design-system/tokens.md`
**Created**: 2026-01-06

## Feature: Tetris Game

A classic Tetris clone featuring falling tetrominos, line clearing, scoring, and progressive difficulty. The game follows modern Tetris guidelines with 7-bag randomization, ghost piece, hold functionality, and wall kicks.

---

## Scenarios

### Scenario: Start new game
```gherkin
Given I am on the start screen
When I press the Start button or press Enter
Then the game board should be empty
And a random tetromino should appear at the top
And the score should be 0
And the level should be 1
And the lines cleared should be 0
And the next piece preview should show the upcoming piece
```

### Scenario: Move piece left
```gherkin
Given a tetromino is falling
And there is empty space to the left
When I press the Left Arrow key
Then the piece should move one cell to the left
```

### Scenario: Move piece right
```gherkin
Given a tetromino is falling
And there is empty space to the right
When I press the Right Arrow key
Then the piece should move one cell to the right
```

### Scenario: Prevent wall collision on move
```gherkin
Given a tetromino is falling
And the piece is against the left wall
When I press the Left Arrow key
Then the piece should not move
And no error should occur
```

### Scenario: Soft drop
```gherkin
Given a tetromino is falling
When I press and hold the Down Arrow key
Then the piece should fall faster (1 cell per frame)
And I should earn 1 point per cell dropped
```

### Scenario: Hard drop
```gherkin
Given a tetromino is falling
And the ghost piece shows where it will land
When I press the Space bar
Then the piece should instantly drop to the ghost position
And the piece should lock immediately
And I should earn 2 points per cell dropped
```

### Scenario: Rotate piece clockwise
```gherkin
Given a tetromino is falling
And rotation is possible (no collision)
When I press the Up Arrow key or X key
Then the piece should rotate 90 degrees clockwise
```

### Scenario: Rotate piece counter-clockwise
```gherkin
Given a tetromino is falling
And rotation is possible (no collision)
When I press the Z key or Ctrl key
Then the piece should rotate 90 degrees counter-clockwise
```

### Scenario: Wall kick on rotation
```gherkin
Given a tetromino is falling near a wall
And normal rotation would cause collision
When I attempt to rotate
Then the game should try wall kick positions
And if a valid position is found, the piece should rotate and shift
And if no valid position exists, the rotation should fail silently
```

### Scenario: Piece locks after landing
```gherkin
Given a tetromino has landed on the stack or floor
When the lock delay timer (500ms) expires
Then the piece should lock in place
And a new tetromino should spawn at the top
```

### Scenario: Reset lock delay with movement
```gherkin
Given a tetromino has landed and lock delay is counting
When I move or rotate the piece
Then the lock delay timer should reset
But this should only work up to 15 times per piece
```

### Scenario: Clear single line
```gherkin
Given a piece locks and completes one horizontal line
When the line is detected as full
Then the line should be cleared with animation
And all lines above should fall down
And I should earn 100 × level points
And the lines counter should increase by 1
```

### Scenario: Clear multiple lines (Double)
```gherkin
Given a piece locks and completes two horizontal lines
When the lines are detected as full
Then both lines should be cleared simultaneously
And I should earn 300 × level points
And the lines counter should increase by 2
```

### Scenario: Clear multiple lines (Triple)
```gherkin
Given a piece locks and completes three horizontal lines
When the lines are detected as full
Then all three lines should be cleared simultaneously
And I should earn 500 × level points
And the lines counter should increase by 3
```

### Scenario: Clear Tetris (four lines)
```gherkin
Given a piece locks and completes four horizontal lines
When the lines are detected as full
Then all four lines should be cleared with special animation
And I should earn 800 × level points
And the lines counter should increase by 4
And a "TETRIS!" celebration should appear
```

### Scenario: Level progression
```gherkin
Given I have cleared lines
When the total lines cleared reaches level × 10
Then the level should increase by 1
And the fall speed should increase
And there should be a level-up notification
```

### Scenario: Hold piece
```gherkin
Given a tetromino is falling
And I have not used hold this turn
When I press Shift or C key
Then the current piece should be stored in hold
And the held piece (or next piece if hold was empty) should become active
And the hold box should display the held piece
And I should not be able to hold again until next piece
```

### Scenario: Use held piece
```gherkin
Given a tetromino is falling
And there is a piece in hold
And I have not used hold this turn
When I press Shift or C key
Then the current and held pieces should swap
And the new active piece should spawn at the top
```

### Scenario: Ghost piece display
```gherkin
Given a tetromino is falling
Then a ghost piece should be displayed
And the ghost should show where the piece will land
And the ghost should update in real-time as I move
And the ghost should be semi-transparent
```

### Scenario: Next piece preview
```gherkin
Given the game is running
Then the next piece preview should show upcoming pieces
And at minimum the next piece should be visible
And optionally show next 3-5 pieces (configurable)
```

### Scenario: 7-bag randomization
```gherkin
Given a new game starts
Then pieces should be drawn from a "bag" of all 7 tetrominos
And each bag should contain exactly one of each piece
And the bag should shuffle when emptied
And this ensures no piece drought longer than 12 pieces
```

### Scenario: Pause game
```gherkin
Given the game is running
When I press P or Escape key
Then the game should pause
And a pause overlay should appear
And the timer/game state should freeze
And the board should be visible but dimmed
```

### Scenario: Resume game
```gherkin
Given the game is paused
When I press P, Escape, or click Resume
Then the game should resume
And the pause overlay should disappear
And pieces should continue falling
```

### Scenario: Game over - block out
```gherkin
Given a new piece is spawning
And the spawn position is blocked by existing pieces
When the piece cannot spawn
Then the game should end
And "GAME OVER" should be displayed
And the final score should be shown
And option to restart should be available
```

### Scenario: Game over - lock out
```gherkin
Given a piece locks
And any part of the locked piece is above the visible playfield
When lock is confirmed
Then the game should end
And "GAME OVER" should be displayed
```

### Scenario: Restart after game over
```gherkin
Given the game has ended
When I press R or click Restart
Then a new game should begin
And the board should be cleared
And score, level, lines should reset
```

### Scenario: View high scores (Phase 2)
```gherkin
Given I am on the start screen or game over screen
When I view high scores
Then I should see the top 10 scores
And scores should be stored locally
And each entry should show score, level, and date
```

---

## Mobile Experience

Mobile devices use touch controls since there is no keyboard. The game detects touch capability or narrow viewport (<768px) and adapts the UI accordingly.

### Scenario: Detect mobile device
```gherkin
Given the user opens the game
When the device has touch capability
Or the viewport width is less than 768px
Then the game should display touch controls
And the layout should adapt for mobile viewing
```

### Scenario: Mobile start screen
```gherkin
Given I am on the start screen on mobile
Then I should see "Tap anywhere to start"
And I should see "Touch controls enabled"
And tapping anywhere on the screen should start the game
```

### Scenario: Mobile game layout
```gherkin
Given the game is running on mobile
Then the game board should use smaller cells (15-18px)
And the score/level/lines should appear in a compact row above the board
And the Hold box should appear in the top-left corner
And the Next piece preview should appear in the top-right corner
And touch controls should appear at the bottom of the screen
```

### Scenario: D-pad movement controls
```gherkin
Given the game is running on mobile
When I tap the Left button (◀)
Then the piece should move one cell left
When I tap the Right button (▶)
Then the piece should move one cell right
When I tap and hold a direction button
Then the piece should auto-repeat movement after 170ms delay
And continue moving every 50ms while held
```

### Scenario: Soft drop on mobile
```gherkin
Given the game is running on mobile
When I tap the Down button (▼)
Then the piece should move one cell down
And I should earn 1 point per cell
When I hold the Down button
Then the piece should continuously soft drop
```

### Scenario: Rotate on mobile
```gherkin
Given the game is running on mobile
When I tap the Rotate button (↻)
Then the piece should rotate 90 degrees clockwise
When I tap anywhere on the game board area
Then the piece should rotate 90 degrees clockwise
```

### Scenario: Hard drop on mobile
```gherkin
Given the game is running on mobile
When I tap the Hard Drop button (⬇)
Then the piece should instantly drop to the ghost position
And lock immediately
And I should earn 2 points per cell dropped
When I swipe down on the game board area
Then the piece should hard drop
```

### Scenario: Hold piece on mobile
```gherkin
Given the game is running on mobile
And I have not used hold this turn
When I tap the Hold button
Then the current piece should be stored in hold
And the held piece (or next piece) should become active
And the Hold button should appear dimmed until next piece
```

### Scenario: Pause on mobile
```gherkin
Given the game is running on mobile
When I tap the Pause button (❚❚)
Then the game should pause
And the pause overlay should appear with Resume/Restart/Quit options
```

### Scenario: Mobile pause overlay
```gherkin
Given the game is paused on mobile
Then the overlay buttons should be large enough for touch (44px+ touch targets)
When I tap Resume
Then the game should resume
When I tap Restart
Then a new game should begin
When I tap Quit
Then I should return to the start screen
```

### Scenario: Mobile game over
```gherkin
Given the game has ended on mobile
Then the Game Over overlay should appear
And the Play Again button should be prominent
And buttons should be touch-friendly sized
```

---

## UI Mockup

### Start Screen

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  (bg: void, full-screen)                                                    │
│                                                                             │
│                      ████████╗███████╗████████╗██████╗ ██╗███████╗          │
│                      ╚══██╔══╝██╔════╝╚══██╔══╝██╔══██╗██║██╔════╝          │
│                         ██║   █████╗     ██║   ██████╔╝██║███████╗          │
│                         ██║   ██╔══╝     ██║   ██╔══██╗██║╚════██║          │
│                         ██║   ███████╗   ██║   ██║  ██║██║███████║          │
│                         ╚═╝   ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚══════╝          │
│                                                                             │
│                     (font: display, text: 5xl, color: accent-primary)       │
│                     (glow: accent-primary, animation: pulse)                │
│                                                                             │
│                                                                             │
│                    ┌─────────────────────────────────────┐                  │
│                    │         [  START GAME  ]            │                  │
│                    │         (primary button)            │                  │
│                    └─────────────────────────────────────┘                  │
│                                                                             │
│                    ┌─────────────────────────────────────┐                  │
│                    │         [  HIGH SCORES  ]           │                  │
│                    │         (secondary button)          │                  │
│                    └─────────────────────────────────────┘                  │
│                                                                             │
│                    ┌─────────────────────────────────────┐                  │
│                    │         [  CONTROLS  ]              │                  │
│                    │         (secondary button)          │                  │
│                    └─────────────────────────────────────┘                  │
│                                                                             │
│                                                                             │
│                           PRESS ENTER TO START                              │
│                       (text: sm, color: text-secondary)                     │
│                       (animation: blink)                                    │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│  (scanline overlay, vignette effect)                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Main Game Screen

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  (bg: void)                                                                 │
│                                                                             │
│   ┌─ HOLD ─────┐     ┌─ GAME BOARD ─────────────────────┐    ┌─ NEXT ────┐  │
│   │            │     │ (bg: grid-bg, border: panel)     │    │           │  │
│   │   ┌──┐     │     │                                  │    │  ┌────┐   │  │
│   │   │██│     │     │  · · · · · · · · · ·            │    │  │████│   │  │
│   │   │██│     │     │  · · · · · · · · · ·            │    │  └────┘   │  │
│   │   └──┘     │     │  · · · · · · · · · ·            │    │           │  │
│   │   (J)      │     │  · · · · · · · · · ·            │    │  ┌──┐     │  │
│   │            │     │  · · · · · · · · · ·            │    │  │██│     │  │
│   └────────────┘     │  · · · · · · · · · ·            │    │  │████│   │  │
│                      │  · · · · · · · · · ·            │    │  └────┘   │  │
│   ┌─ SCORE ────┐     │  · · · · ████ · · · ·  ← active │    │  (L)      │  │
│   │            │     │  · · · · ████ · · · ·    piece  │    │           │  │
│   │   12,450   │     │  · · · · · · · · · ·            │    │  ┌──┐     │  │
│   │            │     │  · · · · · · · · · ·            │    │  │██│     │  │
│   │ (text: 2xl │     │  · · · · · · · · · ·            │    │  ├██┴─┐   │  │
│   │  glow)     │     │  · · · · · · · · · ·            │    │  └────┘   │  │
│   └────────────┘     │  · · · · · · · · · ·            │    │  (T)      │  │
│                      │  · · · · ░░░░ · · · ·  ← ghost  │    │           │  │
│   ┌─ LEVEL ────┐     │  · · · · ░░░░ · · · ·    piece  │    │  ┌────┐   │  │
│   │            │     │  ██ ██ ██ ░░░░ ██ ██            │    │  │████│   │  │
│   │     5      │     │  ██████████████████████         │    │  │████│   │  │
│   │            │     │ (stacked pieces)                │    │  └────┘   │  │
│   └────────────┘     │                                  │    │  (O)      │  │
│                      └──────────────────────────────────┘    │           │  │
│   ┌─ LINES ────┐                                             └───────────┘  │
│   │            │                                                            │
│   │     42     │      ← ← ←  Move    Rotate  → X / ↑                        │
│   │            │      ↓ Soft Drop    Hard Drop → Space                      │
│   └────────────┘      Hold → Shift   Pause → P                              │
│                       (text: xs, color: text-dim)                           │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│  (scanline overlay)                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Piece Lock & Line Clear Animation

```
┌─ LINE CLEAR SEQUENCE ───────────────────────────────────────────────────────┐
│                                                                             │
│  Frame 1: Flash           Frame 2: Collapse        Frame 3: Drop           │
│  ┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐   │
│  │  · · · · · · · · · │   │  · · · · · · · · · │   │  · · · · · · · · · │   │
│  │  ██████ · ████████ │   │  ██████ · ████████ │   │  · · · · · · · · · │   │
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│   │                    │   │  ██████ · ████████ │   │
│  │  (white flash)     │   │  (line removed)    │   │  (dropped down)    │   │
│  └────────────────────┘   └────────────────────┘   └────────────────────┘   │
│                                                                             │
│  Animation: duration-slow (400ms), ease-out                                 │
│  Sound: sfx-clear-single (1 line) or sfx-clear-tetris (4 lines)            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tetris Celebration (4-line clear)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                           ╔════════════════════╗                            │
│                           ║                    ║                            │
│                           ║     T E T R I S !  ║                            │
│                           ║                    ║                            │
│                           ╚════════════════════╝                            │
│                                                                             │
│             (text: 3xl, color: accent-gold, glow: gold)                     │
│             (animation: scale-in + shake, duration: 800ms)                  │
│                                                                             │
│                              + 3,200 pts                                    │
│                       (text: xl, color: accent-success)                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Pause Overlay

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌─ GAME BOARD (dimmed, opacity: 0.3) ──────────────────────────────────┐   │
│  │                                                                      │   │
│  │                    ┌───────────────────────────┐                     │   │
│  │                    │                           │                     │   │
│  │                    │      ▓▓  PAUSED  ▓▓       │                     │   │
│  │                    │                           │                     │   │
│  │                    │   [  RESUME GAME  ]       │                     │   │
│  │                    │                           │                     │   │
│  │                    │   [  RESTART      ]       │                     │   │
│  │                    │                           │                     │   │
│  │                    │   [  QUIT TO MENU ]       │                     │   │
│  │                    │                           │                     │   │
│  │                    └───────────────────────────┘                     │   │
│  │                    (bg: chrome, border: panel)                       │   │
│  │                    (shadow: panel)                                   │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Game Over Screen

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌─ GAME BOARD (frozen, grayscale filter) ──────────────────────────────┐   │
│  │                                                                      │   │
│  │                    ┌───────────────────────────┐                     │   │
│  │                    │                           │                     │   │
│  │                    │       GAME  OVER          │                     │   │
│  │                    │   (text: 4xl, color: error │                     │   │
│  │                    │    animation: glitch)     │                     │   │
│  │                    │                           │                     │   │
│  │                    │   ─────────────────────   │                     │   │
│  │                    │                           │                     │   │
│  │                    │   FINAL SCORE             │                     │   │
│  │                    │      156,800              │                     │   │
│  │                    │   (text: 3xl, glow: gold) │                     │   │
│  │                    │                           │                     │   │
│  │                    │   LEVEL  12               │                     │   │
│  │                    │   LINES  115              │                     │   │
│  │                    │                           │                     │   │
│  │                    │   ★ NEW HIGH SCORE! ★     │                     │   │
│  │                    │   (if applicable)         │                     │   │
│  │                    │                           │                     │   │
│  │                    │   [  PLAY AGAIN  ]        │                     │   │
│  │                    │   [  HIGH SCORES ]        │                     │   │
│  │                    │   [  MAIN MENU   ]        │                     │   │
│  │                    │                           │                     │   │
│  │                    └───────────────────────────┘                     │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### High Scores Screen

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                         ★ HIGH SCORES ★                                     │
│                    (text: 3xl, color: accent-gold)                          │
│                                                                             │
│    ┌─────────────────────────────────────────────────────────────────┐      │
│    │                                                                 │      │
│    │   RANK    SCORE        LEVEL    DATE                           │      │
│    │   ────    ─────        ─────    ────                           │      │
│    │                                                                 │      │
│    │   1st     156,800      12       2026-01-05                     │      │
│    │   2nd     124,500       9       2026-01-04                     │      │
│    │   3rd      98,200       8       2026-01-03                     │      │
│    │   4th      76,100       7       2026-01-02                     │      │
│    │   5th      54,800       5       2026-01-01                     │      │
│    │   6th      43,200       4       2025-12-31                     │      │
│    │   7th      32,100       3       2025-12-30                     │      │
│    │   8th      21,500       2       2025-12-29                     │      │
│    │   9th      15,200       2       2025-12-28                     │      │
│    │  10th       8,400       1       2025-12-27                     │      │
│    │                                                                 │      │
│    │   (alternating row bg: chrome / grid-bg)                       │      │
│    │                                                                 │      │
│    └─────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│                          [  BACK TO MENU  ]                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Controls Help Modal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                            CONTROLS                                         │
│                    (text: 2xl, color: accent-primary)                       │
│                                                                             │
│    ┌─────────────────────────────────────────────────────────────────┐      │
│    │                                                                 │      │
│    │   MOVEMENT                                                      │      │
│    │   ─────────                                                     │      │
│    │   [←] [→]        Move left / right                             │      │
│    │   [↓]            Soft drop (hold for speed)                    │      │
│    │   [Space]        Hard drop (instant)                           │      │
│    │                                                                 │      │
│    │   ROTATION                                                      │      │
│    │   ────────                                                      │      │
│    │   [↑] or [X]     Rotate clockwise                              │      │
│    │   [Z] or [Ctrl]  Rotate counter-clockwise                      │      │
│    │                                                                 │      │
│    │   OTHER                                                         │      │
│    │   ─────                                                         │      │
│    │   [Shift] or [C] Hold piece                                    │      │
│    │   [P] or [Esc]   Pause game                                    │      │
│    │   [R]            Restart (when game over)                      │      │
│    │                                                                 │      │
│    └─────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│                             [  GOT IT  ]                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Mobile Touch Controls (Responsive)

```
┌─ MOBILE LAYOUT (< 768px) ───────────────────────────────────────────────────┐
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │  ┌─ HOLD ──┐                                       ┌─ NEXT ──┐     │    │
│  │  │  (dim   │   (fixed top-left)    (fixed top-right)│  ████  │[❚❚] │    │
│  │  │  if     │                                       │  (next │     │    │
│  │  │  used)  │                                       │  piece)│     │    │
│  │  └─────────┘                                       └────────┘     │    │
│  │                                                                     │    │
│  │  ┌── STATS ROW ───────────────────────────────────────────────┐    │    │
│  │  │  SCORE      │     LVL     │    LINES                       │    │    │
│  │  │   12,450    │      5      │      42                        │    │    │
│  │  └────────────────────────────────────────────────────────────┘    │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────┐       │    │
│  │  │                                                         │       │    │
│  │  │              GAME BOARD (15-18px cells)                 │       │    │
│  │  │              - Tap anywhere to rotate                   │       │    │
│  │  │              - Swipe down to hard drop                  │       │    │
│  │  │                                                         │       │    │
│  │  └─────────────────────────────────────────────────────────┘       │    │
│  │                                                                     │    │
│  │  ┌─ BOTTOM CONTROLS ──────────────────────────────────────────┐    │    │
│  │  │                                                            │    │    │
│  │  │  ┌── D-PAD ──────┐              ┌── ACTION BUTTONS ──┐    │    │    │
│  │  │  │               │              │                    │    │    │    │
│  │  │  │  [◀] [▼] [▶]  │              │   (↻)      (⬇)     │    │    │    │
│  │  │  │               │              │  rotate   hard     │    │    │    │
│  │  │  │  (56x56px     │              │  (purple) drop     │    │    │    │
│  │  │  │   buttons)    │              │           (red)    │    │    │    │
│  │  │  └───────────────┘              │  (72x72px circles) │    │    │    │
│  │  │                                 └────────────────────┘    │    │    │
│  │  └────────────────────────────────────────────────────────────┘    │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  Touch Interactions:                                                        │
│  - Tap board area: Rotate clockwise                                         │
│  - Swipe down on board: Hard drop                                           │
│  - D-pad buttons support tap AND hold (with DAS repeat)                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Tetromino Reference

```
┌─ THE 7 TETROMINOS ──────────────────────────────────────────────────────────┐
│                                                                             │
│   I-piece (cyan)        O-piece (yellow)      T-piece (purple)             │
│   ┌──┬──┬──┬──┐         ┌──┬──┐               ┌──┬──┬──┐                   │
│   │██│██│██│██│         │██│██│                  │██│                      │
│   └──┴──┴──┴──┘         ├──┼──┤               ├──┼──┼──┤                   │
│                         │██│██│               │██│██│██│                   │
│                         └──┴──┘               └──┴──┴──┘                   │
│                                                                             │
│   S-piece (green)       Z-piece (red)         J-piece (blue)               │
│      ┌──┬──┐            ┌──┬──┐               ┌──┐                         │
│      │██│██│            │██│██│               │██│                         │
│   ┌──┼──┼──┘         ┌──┼──┼──┤            ┌──┼──┼──┤                      │
│   │██│██│            │  │██│██│            │██│██│██│                      │
│   └──┴──┘            └──┴──┴──┘            └──┴──┴──┘                      │
│                                                                             │
│   L-piece (orange)                                                          │
│         ┌──┐                                                                │
│         │██│                                                                │
│   ┌──┬──┼──┤                                                                │
│   │██│██│██│                                                                │
│   └──┴──┴──┘                                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component References

| Component | Status | Source File | Spec File |
|-----------|--------|-------------|-----------|
| Game | ✅ Implemented | `src/components/Game.tsx` | - |
| GameBoard | ✅ Implemented | `src/components/GameBoard.tsx` | `.specs/design-system/components/game-board.md` |
| Cell | ✅ Implemented | `src/components/Cell.tsx` | `.specs/design-system/components/cell.md` |
| PreviewBox | ✅ Implemented | `src/components/PreviewBox.tsx` | `.specs/design-system/components/preview-box.md` |
| HoldBox | ✅ Implemented | `src/components/HoldBox.tsx` | `.specs/design-system/components/hold-box.md` |
| ScorePanel | ✅ Implemented | `src/components/ScorePanel.tsx` | `.specs/design-system/components/score-panel.md` |
| Overlay | ✅ Implemented | `src/components/Overlay.tsx` | `.specs/design-system/components/overlay.md` |
| MobileControls | ✅ Implemented | `src/components/MobileControls.tsx` | `.specs/design-system/components/mobile-controls.md` |

### Hooks

| Hook | Status | Source File |
|------|--------|-------------|
| useGameLoop | ✅ Implemented | `src/hooks/useGameLoop.ts` |
| useKeyboardControls | ✅ Implemented | `src/hooks/useKeyboardControls.ts` |
| useMobile / useTouchDevice | ✅ Implemented | `src/hooks/useMobile.ts` |

---

## Design Tokens Used

- **Colors**: `color-void`, `color-grid-bg`, `color-piece-*`, `color-accent-*`, `color-ghost`
- **Typography**: `font-display`, `text-2xl`, `text-3xl`, `text-5xl`
- **Spacing**: `spacing-2`, `spacing-4`, `spacing-6`
- **Effects**: `glow-*`, `shadow-panel`, `scanline-opacity`
- **Animation**: `duration-fast`, `duration-slow`, `ease-drop`, `ease-bounce`
- **Game**: `cell-size`, `board-width`, `board-height`

---

## Scoring System

| Action | Points |
|--------|--------|
| Soft drop | 1 per cell |
| Hard drop | 2 per cell |
| Single (1 line) | 100 × level |
| Double (2 lines) | 300 × level |
| Triple (3 lines) | 500 × level |
| Tetris (4 lines) | 800 × level |
| T-Spin (bonus) | Future enhancement |
| Back-to-back Tetris | Future enhancement |

---

## Technical Notes

### State Management
- Game state: `idle` | `playing` | `paused` | `gameOver`
- Current piece position, rotation, type
- Board state: 2D array of cell colors (null for empty)
- Next pieces queue (minimum 1, ideally 3-5)
- Hold piece and hold-used-this-turn flag
- Score, level, lines cleared
- Lock delay timer and move counter

### Key Intervals
- Fall interval: Based on level (1000ms at level 1, decreasing)
- Lock delay: 500ms
- Max lock resets: 15 per piece
- DAS (Delayed Auto Shift): 170ms initial, 50ms repeat

### Collision Detection
- Check if proposed position overlaps with existing cells or walls
- For rotation: Use SRS (Super Rotation System) wall kicks

---

## Open Questions

- [ ] Should we include T-Spin detection and bonus scoring?
- [ ] Include back-to-back bonus for consecutive Tetrises?
- [ ] Support for keyboard remapping?
- [ ] Add sound effects and music? (can be phase 2)
- [ ] Multiplayer support? (definitely phase 2+)
- [ ] Marathon mode vs Sprint mode vs other game modes?

---

## Suggested Test Cases

### Unit Tests (Game Logic)
- [ ] Piece spawns at correct position
- [ ] Movement respects boundaries
- [ ] Rotation applies correct transformation
- [ ] Wall kick finds valid position or fails
- [ ] Line detection identifies full rows
- [ ] Line clear updates board correctly
- [ ] Score calculation for all clear types
- [ ] Level progression triggers at correct lines
- [ ] 7-bag generates correct sequences
- [ ] Hold mechanics work correctly
- [ ] Game over detection (block out)
- [ ] Game over detection (lock out)

### Integration Tests (UI)
- [ ] Start screen renders with all buttons
- [ ] Game starts on Enter or button click
- [ ] Keyboard controls respond correctly
- [ ] Ghost piece updates with movement
- [ ] Next preview shows correct piece
- [ ] Score/Level/Lines update in real-time
- [ ] Line clear animation plays
- [ ] Pause overlay shows/hides
- [ ] Game over screen displays final stats
- [ ] High scores persist across sessions

### Visual Tests
- [ ] All 7 tetromino colors render correctly
- [ ] CRT effects apply (scanlines, vignette)
- [ ] Responsive layout works on mobile
- [ ] Touch controls function on touch devices

---

**Does this look right? Ready to write tests?**
