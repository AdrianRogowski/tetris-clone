# Local Multiplayer Tests

**Test File**: `src/multiplayer/localMultiplayer.test.ts`
**Source File**: `src/multiplayer/localMultiplayer.ts`
**Feature Spec**: `.specs/features/game/multiplayer.feature.md`
**Created**: 2026-01-06

## Summary

Tests for same-device multiplayer controls and logic (2-player split screen).

## Test Coverage

### UT-LMP-001: Player 1 Controls (Arrow Keys)
| ID | Test Case | Status |
|----|-----------|--------|
| UT-LMP-001-01 | ArrowLeft → player 1 left | 🔴 Failing |
| UT-LMP-001-02 | ArrowRight → player 1 right | 🔴 Failing |
| UT-LMP-001-03 | ArrowDown → player 1 down | 🔴 Failing |
| UT-LMP-001-04 | ArrowUp → player 1 rotate | 🔴 Failing |
| UT-LMP-001-05 | Space → player 1 hard drop | 🔴 Failing |
| UT-LMP-001-06 | ShiftLeft → player 1 hold | 🔴 Failing |

### UT-LMP-002: Player 2 Controls (WASD)
| ID | Test Case | Status |
|----|-----------|--------|
| UT-LMP-002-01 | KeyA → player 2 left | 🔴 Failing |
| UT-LMP-002-02 | KeyD → player 2 right | 🔴 Failing |
| UT-LMP-002-03 | KeyS → player 2 down | 🔴 Failing |
| UT-LMP-002-04 | KeyW → player 2 rotate | 🔴 Failing |
| UT-LMP-002-05 | KeyX → player 2 hard drop | 🔴 Failing |
| UT-LMP-002-06 | KeyE → player 2 hold | 🔴 Failing |

### UT-LMP-003: parseKeyPress
| ID | Test Case | Status |
|----|-----------|--------|
| UT-LMP-003-01 | Return null for unknown keys | 🔴 Failing |
| UT-LMP-003-02 | Correctly identify all P1 keys | 🔴 Failing |
| UT-LMP-003-03 | Correctly identify all P2 keys | 🔴 Failing |

### UT-LMP-004: shouldPauseGame
| ID | Test Case | Status |
|----|-----------|--------|
| UT-LMP-004-01 | True for P1 pause key | 🔴 Failing |
| UT-LMP-004-02 | True for P2 pause key | 🔴 Failing |
| UT-LMP-004-03 | False for non-pause keys | 🔴 Failing |

### UT-LMP-005: getActionForPlayer
| ID | Test Case | Status |
|----|-----------|--------|
| UT-LMP-005-01 | Correct action for P1 | 🔴 Failing |
| UT-LMP-005-02 | Correct action for P2 | 🔴 Failing |
| UT-LMP-005-03 | Null for other player keys | 🔴 Failing |
| UT-LMP-005-04 | Null for unknown keys | 🔴 Failing |

### UT-LMP-006: createLocalConfig
| ID | Test Case | Status |
|----|-----------|--------|
| UT-LMP-006-01 | Config for 2 players | 🔴 Failing |
| UT-LMP-006-02 | Correct control schemes | 🔴 Failing |

### UT-LMP-007: Key Independence
| ID | Test Case | Status |
|----|-----------|--------|
| UT-LMP-007-01 | No overlapping keys between players | 🔴 Failing |

## Total: 25 tests (0 passing, 25 failing)
