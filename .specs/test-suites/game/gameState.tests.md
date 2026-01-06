# Test Suite: Game State

**Source File**: `src/game/gameState.ts`
**Test File**: `src/game/gameState.test.ts`
**Prefix**: UT (Unit Tests)

## Coverage Summary

| Category | Tests | Status |
|----------|-------|--------|
| Constants | 2 | ✅ Passing |
| INITIAL_GAME_STATE | 7 | ✅ Passing |
| createGameState | 3 | 📝 Pending |
| startGame | 5 | 📝 Pending |
| pauseGame | 4 | 📝 Pending |
| resumeGame | 2 | 📝 Pending |
| moveLeft | 4 | 📝 Pending |
| moveRight | 2 | 📝 Pending |
| moveDown | 3 | 📝 Pending |
| hardDrop | 3 | 📝 Pending |
| rotateClockwise | 4 | 📝 Pending |
| rotateCounterClockwise | 2 | 📝 Pending |
| holdPiece | 6 | 📝 Pending |
| tick | 3 | 📝 Pending |
| lockAndSpawn | 5 | 📝 Pending |
| endGame | 2 | 📝 Pending |
| resetGame | 3 | 📝 Pending |
| checkGameOver | 2 | 📝 Pending |
| getGhostPiece | 4 | 📝 Pending |
| **Total** | **66** | **~14% passing** |

---

## Test Details

### Constants

| ID | Test | Scenario |
|----|------|----------|
| UT-GS-001 | Lock delay | 500ms lock delay |
| UT-GS-002 | Max lock resets | 15 resets allowed per piece |

### INITIAL_GAME_STATE

| ID | Test | Scenario |
|----|------|----------|
| UT-GS-003 | Empty board | Board starts empty |
| UT-GS-004 | No current piece | No piece at start |
| UT-GS-005 | Score zero | Score starts at 0 |
| UT-GS-006 | Level one | Level starts at 1 |
| UT-GS-007 | Zero lines | Lines start at 0 |
| UT-GS-008 | Idle state | State is 'idle' |
| UT-GS-009 | Can hold | Hold is available |

### createGameState

| ID | Test | Scenario |
|----|------|----------|
| UT-GS-010 | Fresh state | Returns idle state with score 0 |
| UT-GS-011 | Board initialized | Board is created |
| UT-GS-012 | Queue initialized | Next pieces queue populated |

### startGame

| ID | Test | Scenario |
|----|------|----------|
| UT-GS-013 | Idle to playing | State transitions to 'playing' |
| UT-GS-014 | Spawn first piece | First piece spawns |
| UT-GS-015 | Reset score | Score resets to 0 |
| UT-GS-016 | Reset level | Level resets to 1 |
| UT-GS-017 | Clear board | Board is cleared |

### pauseGame

| ID | Test | Scenario |
|----|------|----------|
| UT-GS-018 | Playing to paused | State becomes 'paused' |
| UT-GS-019 | Already paused | No change if already paused |
| UT-GS-020 | Game over immune | Cannot pause game over |
| UT-GS-021 | Preserve state | Game state preserved |

### resumeGame

| ID | Test | Scenario |
|----|------|----------|
| UT-GS-022 | Paused to playing | State becomes 'playing' |
| UT-GS-023 | Not paused | No change if not paused |

### Movement - moveLeft

| ID | Test | Scenario |
|----|------|----------|
| UT-GS-024 | Move left | Piece moves one cell left |
| UT-GS-025 | Wall blocked | No move at left wall |
| UT-GS-026 | Piece blocked | No move if blocked by piece |
| UT-GS-027 | Paused no move | No move when paused |

### Movement - moveRight

| ID | Test | Scenario |
|----|------|----------|
| UT-GS-028 | Move right | Piece moves one cell right |
| UT-GS-029 | Wall blocked | No move at right wall |

### Movement - moveDown (Soft Drop)

| ID | Test | Scenario |
|----|------|----------|
| UT-GS-030 | Move down | Piece moves one cell down |
| UT-GS-031 | Award points | 1 point per cell |
| UT-GS-032 | Floor blocked | No move at bottom |

### hardDrop

| ID | Test | Scenario |
|----|------|----------|
| UT-GS-033 | Instant drop | Piece moves to ghost position |
| UT-GS-034 | Award points | 2 points per cell |
| UT-GS-035 | Lock piece | Piece locks immediately |

### Rotation - rotateClockwise

| ID | Test | Scenario |
|----|------|----------|
| UT-GS-036 | Rotate CW | Rotation increases by 1 |
| UT-GS-037 | Wrap rotation | 3 → 0 |
| UT-GS-038 | Wall kick | Kicks applied when needed |
| UT-GS-039 | Failed rotation | No rotation if all kicks fail |

### Rotation - rotateCounterClockwise

| ID | Test | Scenario |
|----|------|----------|
| UT-GS-040 | Rotate CCW | Rotation decreases by 1 |
| UT-GS-041 | Wrap rotation | 0 → 3 |

### holdPiece

| ID | Test | Scenario |
|----|------|----------|
| UT-GS-042 | Store piece | Current piece stored in hold |
| UT-GS-043 | Swap pieces | Swap with held piece |
| UT-GS-044 | canHold false | Cannot hold twice per turn |
| UT-GS-045 | Blocked hold | Ignored if canHold is false |
| UT-GS-046 | Spawn next | Next piece spawns when hold empty |
| UT-GS-047 | Reset on spawn | canHold resets on new piece |

### tick

| ID | Test | Scenario |
|----|------|----------|
| UT-GS-048 | Move down | Piece drops one row |
| UT-GS-049 | Paused skip | No tick when paused |
| UT-GS-050 | Game over skip | No tick when game over |

### lockAndSpawn

| ID | Test | Scenario |
|----|------|----------|
| UT-GS-051 | Lock to board | Piece cells added to board |
| UT-GS-052 | Spawn from queue | Next piece from queue |
| UT-GS-053 | Clear lines | Lines detected and cleared |
| UT-GS-054 | Update score | Score updated on clear |
| UT-GS-055 | Reset canHold | canHold enabled |

### endGame

| ID | Test | Scenario |
|----|------|----------|
| UT-GS-056 | Game over state | State becomes 'gameOver' |
| UT-GS-057 | Preserve score | Final score preserved |

### resetGame

| ID | Test | Scenario |
|----|------|----------|
| UT-GS-058 | Idle state | Returns to 'idle' |
| UT-GS-059 | Clear score | Score reset to 0 |
| UT-GS-060 | Clear board | Board cleared |

### checkGameOver

| ID | Test | Scenario |
|----|------|----------|
| UT-GS-061 | New game false | Returns false for new game |
| UT-GS-062 | Blocked spawn | Returns true when spawn blocked |

### getGhostPiece

| ID | Test | Scenario |
|----|------|----------|
| UT-GS-063 | Below current | Position is below current piece |
| UT-GS-064 | Same x | Same x as current piece |
| UT-GS-065 | Null if no piece | Returns null if no current piece |
| UT-GS-066 | Updates on move | Updates when piece moves |

---

## State Machine

```
    ┌────────────────────────────────────────┐
    │                                        │
    ▼                                        │
┌───────┐  startGame  ┌─────────┐           │
│ idle  │────────────▶│ playing │◀──────┐   │
└───────┘             └─────────┘       │   │
    ▲                   │     │         │   │
    │                   │     │ pause   │   │
    │                   │     ▼         │   │
    │                   │  ┌────────┐   │   │
    │                   │  │ paused │───┘   │
    │                   │  └────────┘ resume│
    │                   │                   │
    │                   │ game over         │
    │                   ▼                   │
    │              ┌──────────┐             │
    └──────────────│ gameOver │─────────────┘
        reset      └──────────┘
```

---

## Related Specs

- Feature: `.specs/features/game/tetris-core.feature.md` (All gameplay scenarios)
- Component: `.specs/design-system/components/overlay.md` (Pause/Game Over UI)
