# Target Selection Tests

**Test File**: `src/multiplayer/targeting.test.ts`
**Source File**: `src/multiplayer/targeting.ts`
**Feature Spec**: `.specs/features/game/multiplayer.feature.md`
**Created**: 2026-01-06

## Summary

Tests for multiplayer targeting logic - determining which opponent receives garbage attacks.

## Test Coverage

### UT-TGT-001: getValidTargets
| ID | Test Case | Status |
|----|-----------|--------|
| UT-TGT-001-01 | Exclude attacker from valid targets | 🔴 Failing |
| UT-TGT-001-02 | Exclude eliminated players | 🔴 Failing |
| UT-TGT-001-03 | Return empty array when no valid targets | 🔴 Failing |

### UT-TGT-002: selectRandomTarget
| ID | Test Case | Status |
|----|-----------|--------|
| UT-TGT-002-01 | Return null for empty targets | 🔴 Failing |
| UT-TGT-002-02 | Return only target if one available | 🔴 Failing |
| UT-TGT-002-03 | Return valid player ID | 🔴 Failing |

### UT-TGT-003: selectBadgesTarget
| ID | Test Case | Status |
|----|-----------|--------|
| UT-TGT-003-01 | Return player with most knockouts | 🔴 Failing |
| UT-TGT-003-02 | Handle tie (return first) | 🔴 Failing |
| UT-TGT-003-03 | Return null for empty targets | 🔴 Failing |

### UT-TGT-004: selectLowestTarget
| ID | Test Case | Status |
|----|-----------|--------|
| UT-TGT-004-01 | Return player with lowest score | 🔴 Failing |
| UT-TGT-004-02 | Return null for empty targets | 🔴 Failing |

### UT-TGT-005: selectAttackerTarget
| ID | Test Case | Status |
|----|-----------|--------|
| UT-TGT-005-01 | Return last attacker if valid | 🔴 Failing |
| UT-TGT-005-02 | Return null if attacker not in targets | 🔴 Failing |
| UT-TGT-005-03 | Return null if no last attacker | 🔴 Failing |

### UT-TGT-006: selectTarget (main function)
| ID | Test Case | Status |
|----|-----------|--------|
| UT-TGT-006-01 | Use random mode correctly | 🔴 Failing |
| UT-TGT-006-02 | Use badges mode correctly | 🔴 Failing |
| UT-TGT-006-03 | Use lowest mode correctly | 🔴 Failing |
| UT-TGT-006-04 | Use attacker mode correctly | 🔴 Failing |
| UT-TGT-006-05 | Fall back to random if attacker invalid | 🔴 Failing |
| UT-TGT-006-06 | Return null if no valid targets | 🔴 Failing |

## Total: 20 tests (0 passing, 20 failing)
