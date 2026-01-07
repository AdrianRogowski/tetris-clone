# Multiplayer Game State Tests

**Test File**: `src/multiplayer/multiplayerState.test.ts`
**Source File**: `src/multiplayer/multiplayerState.ts`
**Feature Spec**: `.specs/features/game/multiplayer.feature.md`
**Created**: 2026-01-06

## Summary

Tests for multiplayer game state management including player states, eliminations, and win conditions.

## Test Coverage

### UT-MPS-001: createMultiplayerGame
| ID | Test Case | Status |
|----|-----------|--------|
| UT-MPS-001-01 | Create game with correct room code | 🔴 Failing |
| UT-MPS-001-02 | Initialize all players | 🔴 Failing |
| UT-MPS-001-03 | Set default target mode to random | 🔴 Failing |
| UT-MPS-001-04 | Initialize empty garbage queue | 🔴 Failing |
| UT-MPS-001-05 | Set game as not over | 🔴 Failing |

### UT-MPS-002: createPlayerGameState
| ID | Test Case | Status |
|----|-----------|--------|
| UT-MPS-002-01 | Create player state with empty board | 🔴 Failing |
| UT-MPS-002-02 | Initialize score and level | 🔴 Failing |
| UT-MPS-002-03 | Set state to playing | 🔴 Failing |
| UT-MPS-002-04 | Initialize garbage counters to 0 | 🔴 Failing |

### UT-MPS-003: checkElimination
| ID | Test Case | Status |
|----|-----------|--------|
| UT-MPS-003-01 | Return false for empty board | 🔴 Failing |
| UT-MPS-003-02 | Return true when top row blocked | 🔴 Failing |
| UT-MPS-003-03 | Return false when pieces only at bottom | 🔴 Failing |

### UT-MPS-004: eliminatePlayer
| ID | Test Case | Status |
|----|-----------|--------|
| UT-MPS-004-01 | Set player state to eliminated | 🔴 Failing |
| UT-MPS-004-02 | Assign correct placement | 🔴 Failing |

### UT-MPS-005: getCurrentPlacement
| ID | Test Case | Status |
|----|-----------|--------|
| UT-MPS-005-01 | Return player count for first elimination | 🔴 Failing |
| UT-MPS-005-02 | Decrement for each elimination | 🔴 Failing |

### UT-MPS-006: checkWinCondition
| ID | Test Case | Status |
|----|-----------|--------|
| UT-MPS-006-01 | Return null when multiple alive | 🔴 Failing |
| UT-MPS-006-02 | Return winner ID when one remains | 🔴 Failing |
| UT-MPS-006-03 | Return winner for finished game | 🔴 Failing |

### UT-MPS-007: getLivingPlayers
| ID | Test Case | Status |
|----|-----------|--------|
| UT-MPS-007-01 | Return all players initially | 🔴 Failing |
| UT-MPS-007-02 | Exclude eliminated players | 🔴 Failing |

### UT-MPS-008: queueGarbageAttack
| ID | Test Case | Status |
|----|-----------|--------|
| UT-MPS-008-01 | Add attack to queue | 🔴 Failing |
| UT-MPS-008-02 | Increment target pending garbage | 🔴 Failing |

### UT-MPS-009: updatePlayerState
| ID | Test Case | Status |
|----|-----------|--------|
| UT-MPS-009-01 | Update specific player state | 🔴 Failing |
| UT-MPS-009-02 | Not modify other players | 🔴 Failing |

### UT-MPS-010: setTargetMode
| ID | Test Case | Status |
|----|-----------|--------|
| UT-MPS-010-01 | Change target mode | 🔴 Failing |

## Total: 27 tests (0 passing, 27 failing)
