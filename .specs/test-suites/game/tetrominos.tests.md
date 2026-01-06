# Test Suite: Tetrominos

**Source File**: `src/game/tetrominos.ts`
**Test File**: `src/game/tetrominos.test.ts`
**Prefix**: UT (Unit Tests)

## Coverage Summary

| Category | Tests | Status |
|----------|-------|--------|
| Shape Definitions | 8 | 📝 Pending |
| Spawn Positions | 3 | 📝 Pending |
| Rotation - Clockwise | 4 | 📝 Pending |
| Rotation - Counter-Clockwise | 2 | 📝 Pending |
| getRotatedShape | 3 | 📝 Pending |
| getPieceCells | 4 | 📝 Pending |
| Wall Kicks - JLSTZ | 2 | 📝 Pending |
| Wall Kicks - I | 2 | 📝 Pending |
| getWallKicks | 4 | 📝 Pending |
| createPiece | 3 | 📝 Pending |
| **Total** | **35** | **0% passing** |

---

## Test Details

### TETROMINO_SHAPES

| ID | Test | Scenario |
|----|------|----------|
| UT-TET-001 | All 7 types defined | Shape definitions exist for I, O, T, S, Z, J, L |
| UT-TET-002 | I-piece 4x4 grid | I-piece is 4x4 with horizontal line in row 2 |
| UT-TET-003 | O-piece 2x2 grid | O-piece is 2x2 with all cells filled |
| UT-TET-004 | T-piece formation | T-piece has correct T shape |
| UT-TET-005 | S-piece zigzag | S-piece has correct zigzag pattern |
| UT-TET-006 | Z-piece zigzag | Z-piece has opposite zigzag to S |
| UT-TET-007 | J-piece corner | J-piece has corner and row |
| UT-TET-008 | L-piece corner | L-piece mirrors J-piece |
| UT-TET-009 | 4 cells each | Each tetromino has exactly 4 filled cells |

### SPAWN_POSITIONS

| ID | Test | Scenario |
|----|------|----------|
| UT-TET-010 | All positions defined | Spawn positions exist for all 7 pieces |
| UT-TET-011 | Centered spawn | Pieces spawn around x=3-4 (centered on 10-wide board) |
| UT-TET-012 | Top spawn | Pieces spawn at y ≤ 0 (at or above visible area) |

### Rotation

| ID | Test | Scenario |
|----|------|----------|
| UT-TET-013 | CW 3x3 rotation | 3x3 shape rotates 90° clockwise correctly |
| UT-TET-014 | CW I-piece | I-piece becomes vertical after CW rotation |
| UT-TET-015 | CW O-piece symmetry | O-piece unchanged by rotation |
| UT-TET-016 | CW 4x returns original | 4 clockwise rotations return to original |
| UT-TET-017 | CCW 3x3 rotation | 3x3 shape rotates 90° counter-clockwise |
| UT-TET-018 | CCW inverse of CW | CCW undoes CW rotation |
| UT-TET-019 | getRotatedShape state 0 | Returns original shape for rotation 0 |
| UT-TET-020 | getRotatedShape states | Each rotation state produces different shape |
| UT-TET-021 | getRotatedShape valid | Handles all rotation states 0-3 |

### getPieceCells

| ID | Test | Scenario |
|----|------|----------|
| UT-TET-022 | Returns 4 cells | All pieces return exactly 4 cell positions |
| UT-TET-023 | Position offset | Cells are offset by piece position |
| UT-TET-024 | Rotation affects cells | Different rotations produce different cells |
| UT-TET-025 | I-piece horizontal span | I-piece spans 4 columns horizontally |

### Wall Kicks

| ID | Test | Scenario |
|----|------|----------|
| UT-TET-026 | JLSTZ all transitions | Wall kicks defined for all 8 rotation transitions |
| UT-TET-027 | First kick is (0,0) | First test is always no-offset |
| UT-TET-028 | I kicks defined | I-piece has all rotation transitions |
| UT-TET-029 | I kicks differ | I-piece kicks are different from JLSTZ |
| UT-TET-030 | getWallKicks JLSTZ | Returns correct kicks for T/S/Z/J/L pieces |
| UT-TET-031 | getWallKicks I | Returns correct kicks for I-piece |
| UT-TET-032 | getWallKicks O | O-piece only has (0,0) kick |
| UT-TET-033 | getWallKicks CCW | Returns correct kicks for counter-clockwise |

### createPiece

| ID | Test | Scenario |
|----|------|----------|
| UT-TET-034 | Correct type | Created piece has requested type |
| UT-TET-035 | Spawn position | Created piece at correct spawn position |
| UT-TET-036 | Rotation 0 | Created piece has rotation state 0 |

---

## Related Specs

- Feature: `.specs/features/game/tetris-core.feature.md` (Rotation scenarios)
- Component: `.specs/design-system/components/tetromino.md`
