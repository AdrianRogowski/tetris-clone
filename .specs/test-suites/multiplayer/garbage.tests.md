# Garbage Calculation Tests

**Test File**: `src/multiplayer/garbage.test.ts`
**Source File**: `src/multiplayer/garbage.ts`
**Feature Spec**: `.specs/features/game/multiplayer.feature.md`
**Created**: 2026-01-06

## Summary

Tests for garbage line calculation and management in multiplayer Tetris.

## Test Coverage

### UT-GRB-001: calculateGarbage
| ID | Test Case | Status |
|----|-----------|--------|
| UT-GRB-001-01 | Single line clear sends 0 garbage | 🔴 Failing |
| UT-GRB-001-02 | Double line clear sends 1 garbage | 🔴 Failing |
| UT-GRB-001-03 | Triple line clear sends 2 garbage | 🔴 Failing |
| UT-GRB-001-04 | Tetris sends 4 garbage | 🔴 Failing |
| UT-GRB-001-05 | Back-to-back adds +1 garbage | 🔴 Failing |
| UT-GRB-001-06 | No back-to-back bonus on single | 🔴 Failing |

### UT-GRB-002: createGarbageAttack
| ID | Test Case | Status |
|----|-----------|--------|
| UT-GRB-002-01 | Create attack with correct properties | 🔴 Failing |
| UT-GRB-002-02 | Timestamp set to current time | 🔴 Failing |

### UT-GRB-003: generateGarbageLine
| ID | Test Case | Status |
|----|-----------|--------|
| UT-GRB-003-01 | Line has correct width | 🔴 Failing |
| UT-GRB-003-02 | Exactly one gap (null cell) | 🔴 Failing |
| UT-GRB-003-03 | Other cells filled with garbage | 🔴 Failing |
| UT-GRB-003-04 | Gap placed randomly | 🔴 Failing |

### UT-GRB-004: applyGarbage
| ID | Test Case | Status |
|----|-----------|--------|
| UT-GRB-004-01 | Add garbage lines at bottom | 🔴 Failing |
| UT-GRB-004-02 | Push existing pieces up | 🔴 Failing |
| UT-GRB-004-03 | Not exceed board height | 🔴 Failing |
| UT-GRB-004-04 | Handle zero garbage lines | 🔴 Failing |

### UT-GRB-005: cancelGarbage
| ID | Test Case | Status |
|----|-----------|--------|
| UT-GRB-005-01 | Reduce pending by lines cleared | 🔴 Failing |
| UT-GRB-005-02 | Not go below zero | 🔴 Failing |
| UT-GRB-005-03 | Same value when no lines cleared | 🔴 Failing |
| UT-GRB-005-04 | Zero when exactly cancelled | 🔴 Failing |

### UT-GRB-006: calculateNetGarbage
| ID | Test Case | Status |
|----|-----------|--------|
| UT-GRB-006-01 | Send full garbage when no pending | 🔴 Failing |
| UT-GRB-006-02 | Cancel pending before sending | 🔴 Failing |
| UT-GRB-006-03 | Leave remaining when not enough | 🔴 Failing |
| UT-GRB-006-04 | Handle exact cancellation | 🔴 Failing |

## Total: 22 tests (0 passing, 22 failing)
