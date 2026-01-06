# Test Suite: Scoring

**Source File**: `src/game/scoring.ts`
**Test File**: `src/game/scoring.test.ts`
**Prefix**: UT (Unit Tests)

## Coverage Summary

| Category | Tests | Status |
|----------|-------|--------|
| Line Clear Points | 5 | ✅ Passing |
| Drop Points | 3 | ✅ Passing |
| Lines Per Level | 1 | ✅ Passing |
| Level Speeds | 4 | ✅ Passing |
| calculatePoints | 11 | 📝 Pending |
| calculateLevel | 6 | 📝 Pending |
| getFallSpeed | 4 | 📝 Pending |
| didLevelUp | 5 | 📝 Pending |
| getLinesUntilNextLevel | 4 | 📝 Pending |
| **Total** | **43** | **~30% passing** |

---

## Test Details

### LINE_CLEAR_POINTS (Constants)

| ID | Test | Scenario |
|----|------|----------|
| UT-SCR-001 | Single line | 100 points for 1 line |
| UT-SCR-002 | Double | 300 points for 2 lines |
| UT-SCR-003 | Triple | 500 points for 3 lines |
| UT-SCR-004 | Tetris | 800 points for 4 lines |
| UT-SCR-005 | Tetris bonus | Tetris worth more than 4 singles |

### Drop Points (Constants)

| ID | Test | Scenario |
|----|------|----------|
| UT-SCR-006 | Soft drop | 1 point per cell |
| UT-SCR-007 | Hard drop | 2 points per cell |
| UT-SCR-008 | Hard > soft | Hard drop more valuable |

### Level System (Constants)

| ID | Test | Scenario |
|----|------|----------|
| UT-SCR-009 | Lines per level | 10 lines to advance |
| UT-SCR-010 | Level 1 speed | 1000ms at level 1 |
| UT-SCR-011 | Speed progression | Higher levels are faster |
| UT-SCR-012 | Level 20 speed | Reasonable minimum at max level |
| UT-SCR-013 | All speeds defined | Levels 1-20 have defined speeds |

### calculatePoints

| ID | Test | Scenario |
|----|------|----------|
| UT-SCR-014 | Soft drop calc | Correct points for soft drop |
| UT-SCR-015 | Soft drop no level mult | Soft drop not multiplied by level |
| UT-SCR-016 | Soft drop zero | 0 cells = 0 points |
| UT-SCR-017 | Hard drop calc | Correct points for hard drop |
| UT-SCR-018 | Hard drop no level mult | Hard drop not multiplied by level |
| UT-SCR-019 | Single line calc | 100 × level for 1 line |
| UT-SCR-020 | Double calc | 300 × level for 2 lines |
| UT-SCR-021 | Triple calc | 500 × level for 3 lines |
| UT-SCR-022 | Tetris calc | 800 × level for 4 lines |
| UT-SCR-023 | Level multiplier | Line clears multiplied by level |
| UT-SCR-024 | Tetris level 5 | 4000 points at level 5 |

### calculateLevel

| ID | Test | Scenario |
|----|------|----------|
| UT-SCR-025 | Start level 1 | 0 lines = level 1 |
| UT-SCR-026 | Stay level 1 | 1-9 lines = level 1 |
| UT-SCR-027 | Level 2 at 10 | 10 lines = level 2 |
| UT-SCR-028 | Level 3 at 20 | 20 lines = level 3 |
| UT-SCR-029 | High line count | Correct level for 50, 100, 150 lines |
| UT-SCR-030 | Level cap | Handles very high line counts |

### getFallSpeed

| ID | Test | Scenario |
|----|------|----------|
| UT-SCR-031 | Level 1 speed | Returns 1000ms |
| UT-SCR-032 | Higher levels | Returns faster speeds |
| UT-SCR-033 | Beyond 20 cap | Caps at level 20 speed |
| UT-SCR-034 | Invalid levels | Returns level 1 speed for ≤0 |

### didLevelUp

| ID | Test | Scenario |
|----|------|----------|
| UT-SCR-035 | Same level | Returns false (5→6 lines) |
| UT-SCR-036 | Cross boundary | Returns true (9→10 lines) |
| UT-SCR-037 | Multiple levels | Returns true for big jumps |
| UT-SCR-038 | Lines decrease | Returns false (edge case) |
| UT-SCR-039 | No change | Returns false (10→10) |

### getLinesUntilNextLevel

| ID | Test | Scenario |
|----|------|----------|
| UT-SCR-040 | Start of game | 10 lines until level 2 |
| UT-SCR-041 | Mid-level | Remaining lines calculated |
| UT-SCR-042 | At threshold | 10 lines after leveling up |
| UT-SCR-043 | Max level | Handles level 20+ |

---

## Related Specs

- Feature: `.specs/features/game/tetris-core.feature.md` (Scoring, level progression)
