# Tetromino Component

**Status**: 📝 Stub (pending implementation)
**Created**: 2026-01-06

## Purpose

Renders a tetromino shape (I, O, T, S, Z, J, L) either as the active falling piece, in the preview/hold boxes, or as locked cells on the board.

## Planned Props

| Prop | Type | Description |
|------|------|-------------|
| `type` | `'I' \| 'O' \| 'T' \| 'S' \| 'Z' \| 'J' \| 'L'` | Tetromino shape |
| `rotation` | `0 \| 1 \| 2 \| 3` | Rotation state (0°, 90°, 180°, 270°) |
| `position` | `{ x: number, y: number }` | Position on grid |
| `isGhost` | `boolean` | Render as ghost (semi-transparent) |
| `scale` | `number` | Scale factor for preview boxes |

## Shape Definitions

```
I: [[1,1,1,1]]
O: [[1,1],[1,1]]
T: [[0,1,0],[1,1,1]]
S: [[0,1,1],[1,1,0]]
Z: [[1,1,0],[0,1,1]]
J: [[1,0,0],[1,1,1]]
L: [[0,0,1],[1,1,1]]
```

## Design Token References

- `color-piece-i` through `color-piece-l` - Piece colors
- `glow-i` through `glow-l` - Glow effects
- `color-ghost` - Ghost piece fill
- `cell-size` - Cell dimensions

## Implementation Notes

_To be filled in after implementation_
