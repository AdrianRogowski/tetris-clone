# Button Component

**Status**: 📝 Stub (pending implementation)
**Created**: 2026-01-06

## Purpose

Reusable button component for menu navigation and in-game actions. Supports primary and secondary variants with arcade-style aesthetics.

## Planned Props

| Prop | Type | Description |
|------|------|-------------|
| `variant` | `'primary' \| 'secondary'` | Button style |
| `size` | `'sm' \| 'md' \| 'lg'` | Button size |
| `disabled` | `boolean` | Disabled state |
| `onClick` | `() => void` | Click handler |
| `children` | `ReactNode` | Button content |

## Variants

### Primary
- Background: `color-accent-primary`
- Text: `color-void`
- Border: Glow effect
- Hover: Brighten + scale slightly

### Secondary
- Background: `color-chrome`
- Text: `color-text-primary`
- Border: `border-panel`
- Hover: Border glow

## States

- **Default**: Base styling
- **Hover**: Glow effect, slight scale
- **Active**: Press down effect
- **Focus**: Visible focus ring
- **Disabled**: Dimmed, no interactions

## Design Token References

- `color-accent-primary` - Primary button bg
- `color-chrome` - Secondary button bg
- `font-display` - Button text font
- `radius-md` - Border radius
- `duration-fast` - Transition speed

## Implementation Notes

_To be filled in after implementation_
