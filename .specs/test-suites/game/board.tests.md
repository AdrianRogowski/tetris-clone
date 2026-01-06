# Test Suite: Board

**Source File**: `src/game/board.ts`
**Test File**: `src/game/board.test.ts`
**Prefix**: UT (Unit Tests)

## Coverage Summary

| Category | Tests | Status |
|----------|-------|--------|
| Board Constants | 2 | ✅ Passing |
| createEmptyBoard | 3 | 📝 Pending |
| isWithinBounds | 6 | 📝 Pending |
| isCellEmpty | 4 | 📝 Pending |
| canPlacePiece | 7 | 📝 Pending |
| lockPiece | 4 | 📝 Pending |
| findCompletedLines | 6 | 📝 Pending |
| clearLines | 5 | 📝 Pending |
| getGhostPosition | 4 | 📝 Pending |
| isBlockOut | 3 | 📝 Pending |
| isLockOut | 3 | 📝 Pending |
| **Total** | **47** | **~4% passing** |

---

## Test Details

### Board Constants

| ID | Test | Scenario |
|----|------|----------|
| UT-BRD-001 | Standard dimensions | Board is 10 wide × 20 tall |
| UT-BRD-002 | Buffer rows | Hidden buffer rows exist above visible area |

### createEmptyBoard

| ID | Test | Scenario |
|----|------|----------|
| UT-BRD-003 | Correct dimensions | Board includes buffer rows (22 total) |
| UT-BRD-004 | All cells null | Every cell is initialized as empty (null) |
| UT-BRD-005 | New instance | Each call creates a new board instance |

### isWithinBounds

| ID | Test | Scenario |
|----|------|----------|
| UT-BRD-006 | Valid positions | Returns true for (0,0), (5,10), corners |
| UT-BRD-007 | Negative x | Returns false for x < 0 |
| UT-BRD-008 | Overflow x | Returns false for x >= BOARD_WIDTH |
| UT-BRD-009 | Negative y allowed | Returns true for negative y (buffer zone) |
| UT-BRD-010 | Overflow y | Returns false for y >= BOARD_HEIGHT |
| UT-BRD-011 | Buffer limit | Returns false for y < -BOARD_BUFFER |

### isCellEmpty

| ID | Test | Scenario |
|----|------|----------|
| UT-BRD-012 | Empty cell | Returns true for null cells |
| UT-BRD-013 | Occupied cell | Returns false for filled cells |
| UT-BRD-014 | Out of bounds | Returns false for invalid positions |
| UT-BRD-015 | Buffer zone | Handles buffer zone cells correctly |

### canPlacePiece

| ID | Test | Scenario |
|----|------|----------|
| UT-BRD-016 | Empty board | Returns true when piece fits |
| UT-BRD-017 | Left wall collision | Returns false at left boundary |
| UT-BRD-018 | Right wall collision | Returns false at right boundary |
| UT-BRD-019 | Floor collision | Returns false at bottom |
| UT-BRD-020 | Block collision | Returns false when overlapping existing blocks |
| UT-BRD-021 | Rotation states | Handles different rotation states |
| UT-BRD-022 | Buffer zone | Allows placement in buffer zone |

### lockPiece

| ID | Test | Scenario |
|----|------|----------|
| UT-BRD-023 | Add cells | Piece cells added to board with correct color |
| UT-BRD-024 | Immutable | Original board is not modified |
| UT-BRD-025 | Preserve existing | Existing blocks are preserved |
| UT-BRD-026 | Buffer zone | Handles pieces in buffer zone |

### findCompletedLines

| ID | Test | Scenario |
|----|------|----------|
| UT-BRD-027 | Empty board | Returns empty array for empty board |
| UT-BRD-028 | Single line | Detects one completed line |
| UT-BRD-029 | Multiple lines | Detects 2+ completed lines |
| UT-BRD-030 | Tetris | Detects 4 completed lines |
| UT-BRD-031 | Incomplete lines | Does not detect partial lines |
| UT-BRD-032 | Ordered indices | Returns indices in order |

### clearLines

| ID | Test | Scenario |
|----|------|----------|
| UT-BRD-033 | Remove lines | Completed lines are removed |
| UT-BRD-034 | Drop rows | Rows above drop down |
| UT-BRD-035 | Non-consecutive | Handles non-consecutive line clears |
| UT-BRD-036 | Add empty rows | New empty rows added at top |
| UT-BRD-037 | Immutable | Original board not modified |

### getGhostPosition

| ID | Test | Scenario |
|----|------|----------|
| UT-BRD-038 | Floor position | Returns floor y for empty board |
| UT-BRD-039 | Block collision | Stops above existing blocks |
| UT-BRD-040 | I-piece | Handles horizontal I-piece |
| UT-BRD-041 | Already at bottom | Returns same position if at bottom |

### Game Over Detection

| ID | Test | Scenario |
|----|------|----------|
| UT-BRD-042 | isBlockOut empty | Returns false for empty board |
| UT-BRD-043 | isBlockOut blocked | Returns true when spawn blocked |
| UT-BRD-044 | isBlockOut partial | Handles partially blocked spawn |
| UT-BRD-045 | isLockOut visible | Returns false for visible lock |
| UT-BRD-046 | isLockOut above | Returns true for lock above playfield |
| UT-BRD-047 | isLockOut partial | Returns true if any cell above |

---

## Related Specs

- Feature: `.specs/features/game/tetris-core.feature.md` (Line clearing, game over)
- Component: `.specs/design-system/components/game-board.md`
