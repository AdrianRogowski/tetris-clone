# Lobby Management Tests

**Test File**: `src/multiplayer/lobby.test.ts`
**Source File**: `src/multiplayer/lobby.ts`
**Feature Spec**: `.specs/features/game/multiplayer.feature.md`
**Created**: 2026-01-06

## Summary

Tests for multiplayer lobby management including room codes, player management, and game start logic.

## Test Coverage

### UT-LBY-001: generateRoomCode
| ID | Test Case | Status |
|----|-----------|--------|
| UT-LBY-001-01 | Generate code of correct length | 🔴 Failing |
| UT-LBY-001-02 | Only alphanumeric characters | 🔴 Failing |
| UT-LBY-001-03 | Generate unique codes | 🔴 Failing |

### UT-LBY-002: isValidRoomCode
| ID | Test Case | Status |
|----|-----------|--------|
| UT-LBY-002-01 | Accept valid 6-char alphanumeric | 🔴 Failing |
| UT-LBY-002-02 | Reject too short | 🔴 Failing |
| UT-LBY-002-03 | Reject too long | 🔴 Failing |
| UT-LBY-002-04 | Reject invalid characters | 🔴 Failing |
| UT-LBY-002-05 | Reject empty string | 🔴 Failing |

### UT-LBY-003: createLobby
| ID | Test Case | Status |
|----|-----------|--------|
| UT-LBY-003-01 | Host as first player | 🔴 Failing |
| UT-LBY-003-02 | Set host ID correctly | 🔴 Failing |
| UT-LBY-003-03 | Mark host as host | 🔴 Failing |
| UT-LBY-003-04 | Generate room code | 🔴 Failing |
| UT-LBY-003-05 | Set max players to 4 | 🔴 Failing |
| UT-LBY-003-06 | Not starting initially | 🔴 Failing |
| UT-LBY-003-07 | Assign first color to host | 🔴 Failing |

### UT-LBY-004: addPlayer
| ID | Test Case | Status |
|----|-----------|--------|
| UT-LBY-004-01 | Add player to lobby | 🔴 Failing |
| UT-LBY-004-02 | Assign next available color | 🔴 Failing |
| UT-LBY-004-03 | Not mark new player as host | 🔴 Failing |
| UT-LBY-004-04 | Error when lobby full | 🔴 Failing |
| UT-LBY-004-05 | Error when player ID exists | 🔴 Failing |

### UT-LBY-005: removePlayer
| ID | Test Case | Status |
|----|-----------|--------|
| UT-LBY-005-01 | Remove player from lobby | 🔴 Failing |
| UT-LBY-005-02 | Transfer host when host leaves | 🔴 Failing |
| UT-LBY-005-03 | Handle non-existent player | 🔴 Failing |

### UT-LBY-006: getNextAvailableColor
| ID | Test Case | Status |
|----|-----------|--------|
| UT-LBY-006-01 | Return first color for empty | 🔴 Failing |
| UT-LBY-006-02 | Skip taken colors | 🔴 Failing |

### UT-LBY-007: toggleReady
| ID | Test Case | Status |
|----|-----------|--------|
| UT-LBY-007-01 | Toggle to true | 🔴 Failing |
| UT-LBY-007-02 | Toggle to false | 🔴 Failing |

### UT-LBY-008: canStartGame
| ID | Test Case | Status |
|----|-----------|--------|
| UT-LBY-008-01 | False with only 1 player | 🔴 Failing |
| UT-LBY-008-02 | True with 2+ ready players | 🔴 Failing |
| UT-LBY-008-03 | False if not all ready | 🔴 Failing |

### UT-LBY-009: isLobbyFull
| ID | Test Case | Status |
|----|-----------|--------|
| UT-LBY-009-01 | False under max | 🔴 Failing |
| UT-LBY-009-02 | True at max | 🔴 Failing |

### UT-LBY-010: transferHost
| ID | Test Case | Status |
|----|-----------|--------|
| UT-LBY-010-01 | Change host ID | 🔴 Failing |
| UT-LBY-010-02 | Update isHost flags | 🔴 Failing |

### UT-LBY-011: Countdown Management
| ID | Test Case | Status |
|----|-----------|--------|
| UT-LBY-011-01 | Start countdown | 🔴 Failing |
| UT-LBY-011-02 | Update countdown | 🔴 Failing |
| UT-LBY-011-03 | Cancel countdown | 🔴 Failing |

## Total: 38 tests (0 passing, 38 failing)
