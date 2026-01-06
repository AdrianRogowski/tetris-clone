# Cell Component

**Status**: 📝 Stub (pending implementation)
**Created**: 2026-01-06

## Purpose

A single cell in the Tetris grid. Can be empty (showing grid background) or filled (showing a tetromino color with optional glow effect).

## Planned Props

| Prop | Type | Description |
|------|------|-------------|
| `color` | `string \| null` | Cell color (null = empty) |
| `isGhost` | `boolean` | Render as ghost piece cell |
| `isClearing` | `boolean` | Part of line being cleared |

## Visual States

- **Empty**: `color-grid-bg` with subtle border
- **Filled**: Solid color with inner highlight and glow
- **Ghost**: Semi-transparent outline only
- **Clearing**: White flash animation

## Design Token References

- `color-grid-bg` - Empty cell background
- `color-grid-line` - Cell border
- `cell-size` - Width and height
- `cell-radius` - Corner rounding
- `duration-fast` - State transition speed

## Implementation Notes

_To be filled in after implementation_
