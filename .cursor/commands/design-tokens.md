# Design Tokens Management

Create or update the design tokens for your project.

## When to Use

- Setting up a new project's design system
- Updating tokens after design changes
- Importing tokens from Figma/design tools
- Converting existing CSS variables to documented tokens

## Behavior

### Create New Tokens

If `.specs/design-system/tokens.md` doesn't exist:
1. Create from template with sensible defaults
2. Create `.cursor/rules/design-tokens.mdc` cursor rule
3. Inform user of created files

### Update Existing Tokens

If tokens already exist:
1. Read current tokens.md
2. Apply requested changes
3. Update cursor rule if token names changed
4. List what was changed

## Usage

### Initialize Default Tokens
```
/design-tokens init
```
Creates default tokens.md from template.

### Update Specific Tokens
```
/design-tokens update primary color to #FF6B6B
```
Updates specific token values.

### Import from Tailwind Config
```
/design-tokens import from tailwind.config.js
```
Extracts theme values and creates tokens.md.

### Import from CSS Variables
```
/design-tokens import from styles/variables.css
```
Converts CSS custom properties to documented tokens.

### Add Custom Token Category
```
/design-tokens add category "gradients" with tokens: gradient-hero, gradient-card
```
Adds new token category.

## Output Format

```markdown
## Design Tokens Updated

### Changes Made
| Token | Old Value | New Value |
|-------|-----------|-----------|
| `color-primary` | `#3B82F6` | `#FF6B6B` |

### Files Updated
- `.specs/design-system/tokens.md`
- `.cursor/rules/design-tokens.mdc`

### Token Summary
- Colors: 16 tokens
- Typography: 12 tokens
- Spacing: 10 tokens
- Total: 38 tokens
```

## Token Naming Conventions

Follow these patterns for consistency:

```
color-{name}           - Colors
color-{name}-{variant} - Color variants (light, dark, hover)
text-{size}            - Font sizes
font-{weight}          - Font weights
spacing-{scale}        - Spacing values
radius-{size}          - Border radii
shadow-{size}          - Box shadows
z-{layer}              - Z-index values
duration-{speed}       - Animation durations
easing-{type}          - Animation easings
```

## Integration with Other Commands

- `/spec-first` references tokens in ASCII mockups
- `/design-component` documents which tokens components use
- `/spec-init` detects existing tokens in codebase

## Example Workflow

```
1. /design-tokens init                    # Create default tokens
2. /design-tokens update colors to match brand
3. /spec-first login page                 # Spec references tokens
4. Implement using tokens
5. /design-component button               # Document token usage
```
