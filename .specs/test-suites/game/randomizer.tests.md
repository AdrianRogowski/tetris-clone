# Test Suite: Randomizer

**Source File**: `src/game/randomizer.ts`
**Test File**: `src/game/randomizer.test.ts`
**Prefix**: UT (Unit Tests)

## Coverage Summary

| Category | Tests | Status |
|----------|-------|--------|
| ALL_TETROMINOS | 2 | ✅ Passing |
| shuffle | 6 | 📝 Pending |
| generateBag | 4 | 📝 Pending |
| createRandomizer | 4 | 📝 Pending |
| getNextPiece | 5 | 📝 Pending |
| peekPieces | 6 | 📝 Pending |
| 7-Bag Guarantee | 2 | 📝 Pending |
| **Total** | **29** | **~7% passing** |

---

## Test Details

### ALL_TETROMINOS (Constant)

| ID | Test | Scenario |
|----|------|----------|
| UT-RND-001 | All 7 types | Contains I, O, T, S, Z, J, L |
| UT-RND-002 | No duplicates | Each type appears exactly once |

### shuffle

| ID | Test | Scenario |
|----|------|----------|
| UT-RND-003 | Same length | Output has same length as input |
| UT-RND-004 | All elements | Contains all original elements |
| UT-RND-005 | Immutable | Does not modify original array |
| UT-RND-006 | Different orders | Produces different orderings |
| UT-RND-007 | Empty array | Handles empty array |
| UT-RND-008 | Single element | Handles single-element array |

### generateBag

| ID | Test | Scenario |
|----|------|----------|
| UT-RND-009 | 7 pieces | Returns exactly 7 pieces |
| UT-RND-010 | One of each | Contains one of each tetromino type |
| UT-RND-011 | Randomized | Different orders on different calls |
| UT-RND-012 | Valid types | All pieces are valid tetromino types |

### createRandomizer

| ID | Test | Scenario |
|----|------|----------|
| UT-RND-013 | Returns queue | Returns object with queue property |
| UT-RND-014 | Min 7 pieces | Queue has at least 7 pieces |
| UT-RND-015 | Min 14 pieces | Queue has at least 14 pieces (2 bags) |
| UT-RND-016 | Valid types | All queue pieces are valid types |

### getNextPiece

| ID | Test | Scenario |
|----|------|----------|
| UT-RND-017 | First piece | Returns first piece in queue |
| UT-RND-018 | Updated queue | Returns queue without first piece |
| UT-RND-019 | Immutable | Does not modify original queue |
| UT-RND-020 | Refill | Refills queue when running low |
| UT-RND-021 | 7-bag maintained | Maintains 7-bag property on refill |

### peekPieces

| ID | Test | Scenario |
|----|------|----------|
| UT-RND-022 | Requested count | Returns requested number of pieces |
| UT-RND-023 | Order preserved | Pieces in correct order |
| UT-RND-024 | Immutable | Does not modify queue |
| UT-RND-025 | Short queue | Returns fewer if queue shorter |
| UT-RND-026 | Zero count | Returns empty for count 0 |
| UT-RND-027 | Empty queue | Handles empty queue |

### 7-Bag Guarantee

| ID | Test | Scenario |
|----|------|----------|
| UT-RND-028 | Max gap 12 | No more than 12 pieces between same type |
| UT-RND-029 | Fair distribution | Each piece appears equally over 70 draws |

---

## 7-Bag Algorithm

The 7-bag randomizer ensures fair piece distribution:

```
Bag 1: [T, I, O, S, Z, J, L] (shuffled)
Bag 2: [L, T, Z, I, S, O, J] (shuffled)
...

Queue: [T, I, O, S, Z, J, L, L, T, Z, I, S, O, J, ...]
        ↑ next piece
```

**Guarantees:**
- Each piece appears exactly once per bag
- Maximum drought: 12 pieces (piece last in bag N, first in bag N+2)
- Even distribution over time

---

## Related Specs

- Feature: `.specs/features/game/tetris-core.feature.md` (7-bag randomization scenario)
