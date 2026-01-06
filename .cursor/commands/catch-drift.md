# Catch Drift Between Spec and Code

Detect when specifications and implementation have diverged, then reconcile them.

```
SPEC ──────────── CODE
  │                 │
  │    drift?       │
  │    ◄────────►   │
  │                 │
  └────► SYNC ◄─────┘
```

## When to Use

- After quick iterations that skipped spec updates
- Before a release to ensure docs match reality
- After bug fixes that changed behavior
- When tests are failing unexpectedly
- During code review when behavior seems different from spec
- Periodic maintenance to keep docs accurate

## Behavior

### 1. Identify Scope
- Specific feature: Check one spec against its implementation
- Component: Check all specs related to a component
- Full audit: Check all specs against codebase

### 2. Compare Spec vs Code

For each Gherkin scenario in the spec:
- Find the corresponding code path
- Verify the behavior matches
- Check if test exists and passes

Report:
- **Matched**: Spec, code, and tests all agree ✅
- **Spec Drift**: Code does something different than spec says ⚠️
- **Code Drift**: Code does extra things not in spec ⚠️
- **Missing Test**: Behavior exists but no test covers it ❓
- **Broken Test**: Test fails (code or spec is wrong) 🚩

### 3. Report Findings

Present a clear drift report with specific discrepancies.

### 4. Reconcile

For each drift, ask:
- "Update spec to match code?" (document the change)
- "Update code to match spec?" (fix the regression)
- "This is intentional, update both?" (new documented behavior)

### 5. Update All Artifacts

After reconciliation:
- Update feature spec if needed
- Update or add tests
- Update test suite documentation
- Update mapping.md
- Add change log entries

## Output Format

```markdown
## Drift Report: [Feature/Component]

**Spec**: `.specs/features/{path}`
**Code**: `{source files}`
**Checked**: [date]

### Summary

| Status | Count |
|--------|-------|
| ✅ Matched | 8 |
| ⚠️ Spec Drift | 2 |
| ⚠️ Code Drift | 1 |
| ❓ Missing Test | 1 |
| 🚩 Broken Test | 0 |

---

### ⚠️ Spec Drift (Code differs from spec)

#### 1. Date Formatting
**Spec says** (line 45):
> Given a deal created today
> Then the date shows "Today"

**Code does** (`deal-card.tsx:78`):
> Shows "Today at 3:45 PM" (includes time)

**Impact**: Minor - additional info shown
**Suggestion**: Update spec to include time

---

#### 2. Empty State
**Spec says** (line 62):
> Given no deals exist
> Then show "No deals yet" message

**Code does** (`deal-pipeline.tsx:120`):
> Shows "Create your first deal" with a button

**Impact**: UX change - more actionable
**Suggestion**: Update spec (code is better)

---

### ⚠️ Code Drift (Code does things not in spec)

#### 1. Auto-refresh
**Code does** (`deal-pipeline.tsx:45`):
> Auto-refreshes deal list every 30 seconds

**Spec**: No mention of auto-refresh

**Impact**: New feature not documented
**Suggestion**: Add scenario to spec

---

### ❓ Missing Tests

| Behavior | Location | Suggested Test |
|----------|----------|----------------|
| Keyboard navigation | deal-card.tsx:90 | DC-016: Arrow key navigation |

---

### Reconciliation Options

1. **Update specs to match code** (recommended for drift items 1, 2, 3)
2. **Revert code to match spec** (if drift was unintentional)
3. **Review with team** (if unsure about intent)

**Which would you like to do?**
```

## After Reconciliation

```markdown
## Drift Reconciled ✅

### Changes Made

| Item | Action | Files Updated |
|------|--------|---------------|
| Date formatting | Spec updated | deal-card.feature.md |
| Empty state | Spec updated | deal-pipeline.feature.md |
| Auto-refresh | Spec + test added | deal-pipeline.feature.md, tests |

### Updated Files
- `.specs/features/deals/deal-card.feature.md`
- `.specs/features/deals/deal-pipeline.feature.md`
- `.specs/test-suites/components/DealCard.tests.md`
- `tests/frontend/components/DealPipeline.test.tsx`

### Verification
- All tests passing ✅
- Specs match implementation ✅
- Documentation updated ✅
```

## Example Usage

### Check Specific Feature
```
/catch-drift for deal card
```
Compares deal card spec against implementation.

### Check After Bug Fix
```
/catch-drift for the component I just fixed
```
Ensures the fix is documented.

### Full Audit
```
/catch-drift for entire project
```
Comprehensive check of all specs. May take a while.

### Check Before Release
```
/catch-drift for deals features
```
Verify all deal-related specs are accurate before shipping.

## Drift Prevention Tips

To minimize drift:
1. Always update spec when making "quick fixes"
2. Run `/catch-drift` before PRs
3. Include spec updates in code review checklist
4. Set up periodic drift audits (weekly/sprint)

## Integration with Other Commands

- After `/catch-drift`, use `/update-test-docs` to sync test documentation
- If drift reveals missing coverage, use `/check-coverage` for full audit
- If code needs to change, use `/fix-bug` or `/refactor` workflow

