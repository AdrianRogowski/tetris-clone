# Overlay Component

**Status**: 📝 Stub (pending implementation)
**Created**: 2026-01-06

## Purpose

Modal overlay for pause screen, game over, and other full-screen states. Dims the game board behind it and presents focused content.

## Planned Props

| Prop | Type | Description |
|------|------|-------------|
| `isVisible` | `boolean` | Show/hide overlay |
| `variant` | `'pause' \| 'gameOver' \| 'modal'` | Overlay type |
| `onClose` | `() => void` | Close handler (if dismissible) |
| `children` | `ReactNode` | Overlay content |

## Variants

### Pause
- Background dims to 30% opacity
- Centered panel with resume options
- Game state visible but frozen

### Game Over
- Background with grayscale filter
- Centered panel with final stats
- Glitch text effect on "GAME OVER"

### Modal
- Dark backdrop
- Centered content panel
- Click outside to dismiss (optional)

## Animation

- Fade in: `duration-normal`
- Content scale in: `ease-bounce`
- Fade out: `duration-fast`

## Design Token References

- `color-void` with opacity - Backdrop
- `color-chrome` - Panel background
- `shadow-panel` - Panel shadow
- `z-overlay` - Stacking order

## Implementation Notes

_To be filled in after implementation_
