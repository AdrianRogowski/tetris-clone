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

### Test Suite Breakdown

| Test Suite Doc | Test File | Tests | Status |
|----------------|-----------|-------|--------|
| `.specs/test-suites/game/tetrominos.tests.md` | `src/game/tetrominos.test.ts` | 36 | ✅ 100% |
| `.specs/test-suites/game/board.tests.md` | `src/game/board.test.ts` | 47 | ✅ 100% |
| `.specs/test-suites/game/scoring.tests.md` | `src/game/scoring.test.ts` | 43 | ✅ 100% |
| `.specs/test-suites/game/randomizer.tests.md` | `src/game/randomizer.test.ts` | 29 | ✅ 100% |
| `.specs/test-suites/game/gameState.tests.md` | `src/game/gameState.test.ts` | 66 | ✅ 100% |

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

---

## Test Coverage Summary

| Category | Total | Passing | Percentage |
|----------|-------|---------|------------|
| Tetrominos | 36 | 36 | 100% |
| Board | 47 | 47 | 100% |
| Scoring | 43 | 43 | 100% |
| Randomizer | 29 | 29 | 100% |
| Game State | 66 | 66 | 100% |
| **Total** | **221** | **221** | **100%** |

---

## Scenario to Test Mapping

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

### UI Tests Needed
- [ ] Mobile controls integration tests
- [ ] Touch gesture tests
- [ ] Responsive layout tests

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
