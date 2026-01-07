# Feature Test Component Mapping

This file links feature specifications to their tests and source components.

## Legend

| Status | Meaning |
|--------|---------|
| ✅ | Fully covered (spec + tests + docs) |
| 🟡 | Partially covered (missing spec or docs) |
| 🔴 | Not covered (no tests) |
| 📝 | Stub only (pending implementation) |

---

## Features

| Feature Spec | Test Suite | Source File(s) | Status |
|--------------|------------|----------------|--------|
| `.specs/features/game/tetris-core.feature.md` | Multiple (see below) | `src/game/`, `src/components/` | ✅ |
| `.specs/features/game/multiplayer.feature.md` | Multiple (see below) | `src/multiplayer/` | 🔴 Tests written, not implemented |

### Core Game Test Suites

| Test Suite Doc | Test File | Tests | Status |
|----------------|-----------|-------|--------|
| `.specs/test-suites/game/tetrominos.tests.md` | `src/game/tetrominos.test.ts` | 36 | ✅ 100% |
| `.specs/test-suites/game/board.tests.md` | `src/game/board.test.ts` | 47 | ✅ 100% |
| `.specs/test-suites/game/scoring.tests.md` | `src/game/scoring.test.ts` | 43 | ✅ 100% |
| `.specs/test-suites/game/randomizer.tests.md` | `src/game/randomizer.test.ts` | 29 | ✅ 100% |
| `.specs/test-suites/game/gameState.tests.md` | `src/game/gameState.test.ts` | 66 | ✅ 100% |

### Multiplayer Test Suites (NEW - Failing)

| Test Suite Doc | Test File | Tests | Status |
|----------------|-----------|-------|--------|
| `.specs/test-suites/multiplayer/garbage.tests.md` | `src/multiplayer/garbage.test.ts` | 22 | 🔴 0% |
| `.specs/test-suites/multiplayer/targeting.tests.md` | `src/multiplayer/targeting.test.ts` | 20 | 🔴 0% |
| `.specs/test-suites/multiplayer/multiplayerState.tests.md` | `src/multiplayer/multiplayerState.test.ts` | 27 | 🔴 0% |
| `.specs/test-suites/multiplayer/localMultiplayer.tests.md` | `src/multiplayer/localMultiplayer.test.ts` | 25 | 🔴 0% |
| `.specs/test-suites/multiplayer/lobby.tests.md` | `src/multiplayer/lobby.test.ts` | 38 | 🔴 0% |

---

## Design System Components

| Component | Doc File | Source File | Status |
|-----------|----------|-------------|--------|
| Game | - | `src/components/Game.tsx` | ✅ |
| GameBoard | `.specs/design-system/components/game-board.md` | `src/components/GameBoard.tsx` | ✅ |
| Cell | `.specs/design-system/components/cell.md` | `src/components/Cell.tsx` | ✅ |
| PreviewBox | `.specs/design-system/components/preview-box.md` | `src/components/PreviewBox.tsx` | ✅ |
| HoldBox | `.specs/design-system/components/hold-box.md` | `src/components/HoldBox.tsx` | ✅ |
| ScorePanel | `.specs/design-system/components/score-panel.md` | `src/components/ScorePanel.tsx` | ✅ |
| Overlay | `.specs/design-system/components/overlay.md` | `src/components/Overlay.tsx` | ✅ |
| MobileControls | `.specs/design-system/components/mobile-controls.md` | `src/components/MobileControls.tsx` | ✅ |

### Multiplayer Components (NEW - Stubs)

| Component | Doc File | Source File | Status |
|-----------|----------|-------------|--------|
| Lobby | `.specs/design-system/components/lobby.md` | `src/components/Lobby.tsx` | 📝 Stub |
| PlayerCard | `.specs/design-system/components/player-card.md` | `src/components/PlayerCard.tsx` | 📝 Stub |
| OpponentBoard | `.specs/design-system/components/opponent-board.md` | `src/components/OpponentBoard.tsx` | 📝 Stub |
| GarbageIndicator | `.specs/design-system/components/garbage-indicator.md` | `src/components/GarbageIndicator.tsx` | 📝 Stub |
| TargetSelector | `.specs/design-system/components/target-selector.md` | `src/components/TargetSelector.tsx` | 📝 Stub |
| RoomCodeInput | `.specs/design-system/components/room-code-input.md` | `src/components/RoomCodeInput.tsx` | 📝 Stub |
| ResultsScreen | `.specs/design-system/components/results-screen.md` | `src/components/ResultsScreen.tsx` | 📝 Stub |

### Hooks

| Hook | Source File | Status |
|------|-------------|--------|
| useGameLoop | `src/hooks/useGameLoop.ts` | ✅ |
| useKeyboardControls | `src/hooks/useKeyboardControls.ts` | ✅ |
| useMobile / useTouchDevice | `src/hooks/useMobile.ts` | ✅ |

---

## Game Logic Modules

| Module | Source File | Test File | Status |
|--------|-------------|-----------|--------|
| Types | `src/game/types.ts` | - | ✅ (no tests needed) |
| Tetrominos | `src/game/tetrominos.ts` | `src/game/tetrominos.test.ts` | ✅ |
| Board | `src/game/board.ts` | `src/game/board.test.ts` | ✅ |
| Scoring | `src/game/scoring.ts` | `src/game/scoring.test.ts` | ✅ |
| Randomizer | `src/game/randomizer.ts` | `src/game/randomizer.test.ts` | ✅ |
| Game State | `src/game/gameState.ts` | `src/game/gameState.test.ts` | ✅ |

## Multiplayer Logic Modules (NEW - Not Implemented)

| Module | Source File | Test File | Status |
|--------|-------------|-----------|--------|
| Types | `src/multiplayer/types.ts` | - | ✅ (no tests needed) |
| Garbage | `src/multiplayer/garbage.ts` | `src/multiplayer/garbage.test.ts` | 🔴 |
| Targeting | `src/multiplayer/targeting.ts` | `src/multiplayer/targeting.test.ts` | 🔴 |
| Multiplayer State | `src/multiplayer/multiplayerState.ts` | `src/multiplayer/multiplayerState.test.ts` | 🔴 |
| Local Multiplayer | `src/multiplayer/localMultiplayer.ts` | `src/multiplayer/localMultiplayer.test.ts` | 🔴 |
| Lobby | `src/multiplayer/lobby.ts` | `src/multiplayer/lobby.test.ts` | 🔴 |

---

## Test Coverage Summary

| Category | Total | Passing | Percentage |
|----------|-------|---------|------------|
| **Core Game** | | | |
| Tetrominos | 36 | 36 | 100% |
| Board | 47 | 47 | 100% |
| Scoring | 43 | 43 | 100% |
| Randomizer | 29 | 29 | 100% |
| Game State | 66 | 66 | 100% |
| **Core Subtotal** | **221** | **221** | **100%** |
| **Multiplayer (NEW)** | | | |
| Garbage | 22 | 0 | 0% |
| Targeting | 20 | 0 | 0% |
| Multiplayer State | 27 | 0 | 0% |
| Local Multiplayer | 25 | 0 | 0% |
| Lobby | 38 | 0 | 0% |
| **Multiplayer Subtotal** | **132** | **0** | **0%** |
| **Grand Total** | **353** | **221** | **63%** |

---

## Scenario to Test Mapping

### Core Gameplay

| Gherkin Scenario | Test File | Test IDs |
|------------------|-----------|----------|
| Start new game | gameState.test.ts | UT-GS-013 to UT-GS-017 |
| Move piece left/right | gameState.test.ts | UT-GS-024 to UT-GS-029 |
| Soft drop | gameState.test.ts | UT-GS-030 to UT-GS-032 |
| Hard drop | gameState.test.ts | UT-GS-033 to UT-GS-035 |
| Rotate piece | gameState.test.ts | UT-GS-036 to UT-GS-041 |
| Wall kick | tetrominos.test.ts | UT-TET-026 to UT-TET-033 |
| Piece locks | gameState.test.ts | UT-GS-051 to UT-GS-055 |
| Clear lines | board.test.ts | UT-BRD-027 to UT-BRD-037 |
| Scoring | scoring.test.ts | UT-SCR-014 to UT-SCR-024 |
| Level progression | scoring.test.ts | UT-SCR-025 to UT-SCR-043 |
| Hold piece | gameState.test.ts | UT-GS-042 to UT-GS-047 |
| Ghost piece | board.test.ts, gameState.test.ts | UT-BRD-038 to UT-BRD-041, UT-GS-063 to UT-GS-066 |
| 7-bag randomization | randomizer.test.ts | UT-RND-001 to UT-RND-029 |
| Pause/Resume | gameState.test.ts | UT-GS-018 to UT-GS-023 |
| Game over | gameState.test.ts, board.test.ts | UT-GS-056 to UT-GS-062, UT-BRD-042 to UT-BRD-047 |
| **Mobile controls** | - | UI tests pending |

### Multiplayer (NEW - Not Implemented)

| Gherkin Scenario | Test File | Test IDs |
|------------------|-----------|----------|
| Create lobby | lobby.test.ts | UT-LBY-003 |
| Join lobby | lobby.test.ts | UT-LBY-004 |
| Player limit | lobby.test.ts | UT-LBY-009 |
| Player leaves | lobby.test.ts | UT-LBY-005 |
| Start game | lobby.test.ts | UT-LBY-008, UT-LBY-011 |
| Send garbage | garbage.test.ts | UT-GRB-001 to UT-GRB-002 |
| Receive garbage | garbage.test.ts | UT-GRB-004 |
| Counter garbage | garbage.test.ts | UT-GRB-005 to UT-GRB-006 |
| Target selection | targeting.test.ts | UT-TGT-001 to UT-TGT-006 |
| Player elimination | multiplayerState.test.ts | UT-MPS-003 to UT-MPS-005 |
| Win condition | multiplayerState.test.ts | UT-MPS-006 |
| Local 2P controls | localMultiplayer.test.ts | UT-LMP-001 to UT-LMP-007 |

---

## Recent Changes

| Date | Change | Files Affected |
|------|--------|----------------|
| 2026-01-06 | Created Tetris core feature spec | `tetris-core.feature.md` |
| 2026-01-06 | Customized design tokens for arcade theme | `tokens.md` |
| 2026-01-06 | Created 8 component stubs | `components/*.md` |
| 2026-01-06 | Created game logic modules | `src/game/*.ts` |
| 2026-01-06 | Implemented all game logic (221 tests passing) | `src/game/*.ts` |
| 2026-01-06 | Built React UI components | `src/components/*.tsx` |
| 2026-01-06 | Added mobile touch controls | `src/components/MobileControls.tsx` |
| 2026-01-06 | Added mobile experience spec | `tetris-core.feature.md` |
| 2026-01-06 | Created MobileControls component doc | `mobile-controls.md` |
| 2026-01-06 | **Created multiplayer feature spec** | `multiplayer.feature.md` |
| 2026-01-06 | **Created 7 multiplayer component stubs** | `components/*.md` |
| 2026-01-06 | **Created multiplayer test suites (132 tests)** | `src/multiplayer/*.test.ts` |
| 2026-01-06 | **Created multiplayer logic module stubs** | `src/multiplayer/*.ts` |

---

## Pending Work

### Phase 1 (Core) - ✅ Complete
- [x] Game logic implementation
- [x] UI components
- [x] Keyboard controls
- [x] Mobile touch controls

### Phase 2 (Enhancements) - Pending
- [ ] High scores (localStorage persistence)
- [ ] Tetris celebration animation (4-line clear)
- [ ] Level-up notification
- [ ] Lock delay reset counter (max 15)
- [ ] Sound effects

### Phase 3 (Multiplayer) - 🔴 Tests Written, Not Implemented
- [ ] **Local 2-player mode (Phase 3a)**
  - [ ] Garbage calculation
  - [ ] Split keyboard controls
  - [ ] Split screen layout
- [ ] **Online multiplayer (Phase 3b)**
  - [ ] Lobby system
  - [ ] Room codes
  - [ ] WebSocket server
  - [ ] Player sync
- [ ] **Multiplayer polish (Phase 3c)**
  - [ ] Target selection modes
  - [ ] Spectator mode
  - [ ] Results screen

### UI Tests Needed
- [ ] Mobile controls integration tests
- [ ] Touch gesture tests
- [ ] Responsive layout tests
- [ ] Multiplayer component tests

---

## How to Update

### When adding a new feature:
1. Create feature spec in features/{domain}/
2. Create test suite doc in test-suites/
3. Add entry to Features table above
4. Update coverage summary

### When documenting a component:
1. Fill in stub or create doc in design-system/components/
2. Add entry to Design System Components table
3. Update status from 📝 to ✅

### When tests change:
1. Update the relevant test suite doc
2. Update status if coverage changed
3. Add entry to Recent Changes

### Running Tests

```bash
npm test              # Run tests in watch mode
npm test -- --run     # Run tests once
npm run test:coverage # Run with coverage report
```
