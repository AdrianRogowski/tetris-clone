# Specs Directory

This directory contains the spec-driven development documentation for this project.

## Directory Structure

```
.specs/
├── features/              # Gherkin feature specifications
│   └── {domain}/          # Grouped by domain/feature area
│       └── {feature}.feature.md
│
├── test-suites/           # Test documentation
│   └── {mirrors test structure}
│       └── {Component}.tests.md
│
├── design-system/         # Design tokens and component patterns
│   ├── tokens.md          # Color, spacing, typography tokens
│   ├── components/        # Component pattern documentation
│   │   └── {component}.md
│   └── layouts/           # Page/section layout patterns
│       └── {layout}.md
│
├── mapping.md             # Links features ↔ tests ↔ components
├── codebase-summary.md    # Generated overview (after /spec-init)
├── needs-review.md        # Files needing manual attention
└── README.md              # This file
```

---

## File Conventions

### Feature Specs (`.feature.md`)

Location: `.specs/features/{domain}/{feature}.feature.md`

```markdown
# Feature Name

**Source File**: `path/to/implementation.tsx`
**Design System**: `.specs/design-system/tokens.md`

## Feature: [Name]

### Scenario: [Name]
Given [precondition]
When [action]
Then [expected result]

## UI Mockup

[ASCII art representation]

## Component References

[Links to design system components]
```

### Test Suite Docs (`.tests.md`)

Location: `.specs/test-suites/{path}/{Component}.tests.md`

```markdown
# Component Tests

**Test File**: `tests/{path}/{Component}.test.tsx`
**Component**: `{path}/{Component}.tsx`
**Feature Spec**: `.specs/features/{domain}/{feature}.feature.md`

## Test Coverage

| Test ID | Test Name | Scenario |
|---------|-----------|----------|
| CMP-001 | renders correctly | Display component |
| CMP-002 | handles click | User interaction |
```

### Component Docs (design system)

Location: `.specs/design-system/components/{component}.md`

```markdown
# Component Name

**Status**: 📝 Stub | ✅ Documented
**Source File**: `components/{name}.tsx`

## Purpose
[What this component does]

## Props / API
[Prop table]

## Variants
[Visual variations]

## Design Tokens Used
[Which tokens this component uses]
```

---

## Test ID Conventions

Use 2-3 letter prefixes for test IDs:

| Prefix | Component/Module |
|--------|------------------|
| UT | utils |
| API | api handlers |
| SVC | services |
| CMP | components |
| PG | pages |
| HK | hooks |

Example: `CMP-001`, `API-015`, `UT-003`

---

## Workflow

### New Features

```
1. /spec-first {feature}      → Creates feature spec with mockup
2. Review and approve
3. Tests written (failing)    → Test doc created
4. Implement until tests pass
5. /design-component {name}   → Fill in component stubs
```

### Existing Codebase

```
1. /spec-init                 → Scans and documents everything
2. Review needs-review.md     → Fix any issues
3. /spec-first for new features going forward
```

### Bug Fixes

```
1. /fix-bug                   → Creates regression test
2. Update spec if behavior gap found
3. Document new test
```

---

## Status Indicators

### Feature Specs
- No indicator = active/current

### Test Suites
- ✅ All tests passing
- ⚠️ Some tests failing
- 🔴 No tests yet

### Component Docs
- 📝 Stub (pending implementation)
- ✅ Documented
- ⚠️ Needs update (code changed)

---

## Mapping File

The `mapping.md` file links everything together:

```markdown
| Feature | Test Suite | Component | Status |
|---------|------------|-----------|--------|
| user-login.feature.md | LoginPage.tests.md | login-page.tsx | ✅ |
```

Keep this updated when adding new features or tests.

---

## Commands Reference

| Command | Purpose |
|---------|---------|
| `/spec-first` | Create feature spec + mockup |
| `/spec-init` | Bootstrap existing codebase |
| `/design-tokens` | Manage design tokens |
| `/design-component` | Document component patterns |
| `/check-coverage` | Find gaps in coverage |
| `/verify-test-counts` | Reconcile test counts |

---

## Best Practices

1. **Spec before code** - Always create the feature spec first
2. **Keep specs updated** - Update specs when behavior changes
3. **ASCII mockups** - Include mockups for UI features
4. **Reference tokens** - Use design token names in mockups
5. **Link everything** - Keep mapping.md current
6. **Document components** - Fill in stubs after implementation
