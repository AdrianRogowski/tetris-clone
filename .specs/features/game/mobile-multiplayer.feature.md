# Mobile Multiplayer

**Source Files**: 
- `src/components/multiplayer/OnlineGame.tsx`
- `src/components/multiplayer/Lobby.tsx`
- `src/components/MobileControls.tsx`

**Design System**: `.specs/design-system/tokens.md`

---

## Feature: Mobile Multiplayer Support

As a mobile player,
I want to play online multiplayer Tetris on my phone or tablet,
So that I can compete with friends regardless of device.

---

## Scenarios

### Scenario: Mobile lobby displays correctly
```gherkin
Given I am on a mobile device (width < 768px)
When I create or join a multiplayer game
Then the lobby should display in a single-column layout
And the room code should be large and tappable to copy
And the player list should be vertically stacked
And the READY and LEAVE buttons should be full-width
And the START GAME button should appear below (host only)
```

### Scenario: Mobile game layout adapts to screen size
```gherkin
Given I am playing multiplayer on a mobile device
When the game starts
Then opponent boards should appear at the top in a horizontal row
And my game board should appear below, sized to fit screen
And stats (score, level, lines) should be in a compact horizontal bar
And touch controls should appear at the bottom
And the target selector should be collapsed by default
```

### Scenario: Touch controls work in multiplayer
```gherkin
Given I am playing multiplayer on a mobile device
When I use the touch controls
Then the D-pad should move pieces left/right/down
And the rotate button should rotate the piece
And the hard drop button should instantly drop the piece
And the hold button should hold the current piece
And the pause button should pause my game
And swiping down on the board should hard drop
And tapping the board should rotate
```

### Scenario: Opponent boards display on mobile
```gherkin
Given I am playing multiplayer with 2+ opponents on mobile
When viewing the opponent section
Then each opponent should show a mini board (scaled down)
And each opponent should show their name and score
And eliminated opponents should show an X overlay
And the section should horizontally scroll if more than 2 opponents
```

### Scenario: Target selector on mobile
```gherkin
Given I am playing multiplayer on mobile
When I view the target selector
Then it should show the current mode with an icon (collapsed)
When I tap the target selector
Then it should expand to show all options
And I should be able to select a different mode
And it should collapse after selection
```

### Scenario: Garbage indicator visible on mobile
```gherkin
Given I am playing multiplayer on mobile
And I have pending garbage lines
Then a thin indicator bar should appear on the left edge of my board
And it should show the number of pending lines
And it should pulse/animate when garbage is incoming
```

### Scenario: Mobile results screen
```gherkin
Given a multiplayer game has ended on mobile
When the results screen appears
Then my placement should be prominently displayed
And the standings should be in a scrollable list
And PLAY AGAIN and LEAVE buttons should be full-width and stacked
```

### Scenario: Orientation handling
```gherkin
Given I am playing multiplayer on mobile
When I rotate my device to landscape
Then the layout should adapt to use the wider space
And opponent boards may move to the side
And the game board should scale appropriately
```

---

## UI Mockups

### Mobile Game Layout (Portrait)
```
┌────────────────────────────────┐
│  OPPONENTS                     │
│  ┌──────┐ ┌──────┐ ┌──────┐   │  ← Horizontal scroll
│  │P2 120│ │P3  45│ │P4 OUT│   │
│  │▓▓▓▓▓▓│ │▓▓▓▓▓▓│ │  ╳   │   │
│  │▓▓  ▓▓│ │▓    ▓│ │      │   │
│  └──────┘ └──────┘ └──────┘   │
├────────────────────────────────┤
│ 12,400 │ LVL 3 │ 24 LNS │NEXT│  ← Compact stats bar
├────────────────────────────────┤
│┃┌────────────────────────────┐│
│┃│                            ││
│┃│                            ││
│┃│      YOUR BOARD            ││  ← Main playable board
│┃│                            ││
│┃│         ▓▓▓                ││
│┃│          ▓                 ││
│┃│     ▓▓▓▓▓▓▓▓               ││
│┃└────────────────────────────┘│
│ ↑ Garbage indicator           │
├────────────────────────────────┤
│  ┌───┐ ┌───┐ ┌───┐   ┌───┐   │
│  │ ◄ │ │ ▼ │ │ ► │   │ ↻ │   │  ← Touch controls
│  └───┘ └───┘ └───┘   └───┘   │
│                               │
│  ┌─────────┐  ┌───┐  ┌───┐   │
│  │  HOLD   │  │ ⬇ │  │ ⏸ │   │
│  └─────────┘  └───┘  └───┘   │
├────────────────────────────────┤
│  🎲 Random ▼                  │  ← Collapsed target selector
└────────────────────────────────┘
```

### Mobile Lobby
```
┌────────────────────────────────┐
│                                │
│         GAME LOBBY             │
│                                │
│  ┌──────────────────────────┐  │
│  │  ROOM CODE (tap to copy) │  │
│  │                          │  │
│  │      A 3 X 7 K 2         │  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
│         ● CONNECTED            │
│                                │
│  ┌──────────────────────────┐  │
│  │ ★ Player1 (you)    HOST  │  │
│  │   ✓ READY                │  │
│  ├──────────────────────────┤  │
│  │ ○ Player2                │  │
│  │   NOT READY              │  │
│  ├──────────────────────────┤  │
│  │ ┄┄ Waiting for player ┄┄ │  │
│  ├──────────────────────────┤  │
│  │ ┄┄ Waiting for player ┄┄ │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │          READY           │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │          LEAVE           │  │
│  └──────────────────────────┘  │
│                                │
└────────────────────────────────┘
```

---

## Responsive Breakpoints

| Breakpoint | Trigger | Layout Changes |
|------------|---------|----------------|
| Desktop | `≥1024px` | Side-by-side: board left, opponents right |
| Tablet | `768-1023px` | Side-by-side but compact, smaller cells |
| Mobile | `<768px` | Stacked: opponents top, board middle, controls bottom |

---

## Component Changes Required

### OnlineGame.tsx
- Add `useMobile()` or `useTouchDevice()` hook
- Conditionally render mobile vs desktop layout
- Import and render `MobileControls` component
- Add responsive CSS classes

### Lobby.tsx
- Add mobile-specific styling (full-width buttons, stacked layout)
- Room code tap-to-copy already works

### New: MobileOpponentBar.tsx
- Horizontal scrollable container
- Mini opponent boards (scaled down)
- Shows name + score overlay

### MobileControls.tsx
- Already exists for solo play
- May need minor adjustments for multiplayer context

---

## Design Tokens Used

| Token | Usage |
|-------|-------|
| `cell-size-mobile` | 16-20px (vs 28px desktop) |
| `spacing-2` | Tighter padding on mobile |
| `font-display` | Headers, scores |
| `color-accent-primary` | Active states, highlights |
| `color-chrome` | Panel backgrounds |

---

## Test Cases

| ID | Test | Priority |
|----|------|----------|
| MOB-01 | Lobby renders correctly on mobile viewport | High |
| MOB-02 | Game layout stacks vertically on mobile | High |
| MOB-03 | Touch controls respond to input | High |
| MOB-04 | Opponent boards scroll horizontally | Medium |
| MOB-05 | Target selector expands/collapses on tap | Medium |
| MOB-06 | Garbage indicator visible on mobile | Medium |
| MOB-07 | Results screen is scrollable if needed | Low |
| MOB-08 | Landscape orientation adapts layout | Low |
