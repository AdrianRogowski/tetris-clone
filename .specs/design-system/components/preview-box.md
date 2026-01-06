# PreviewBox Component

**Status**: 📝 Stub (pending implementation)
**Created**: 2026-01-06

## Purpose

Displays the upcoming tetromino(s) so the player can plan ahead. Shows at minimum the next piece, optionally up to 5 pieces.

## Planned Props

| Prop | Type | Description |
|------|------|-------------|
| `pieces` | `TetrominoType[]` | Array of upcoming pieces |
| `count` | `number` | How many to display (1-5) |

## Layout

```
┌─ NEXT ─────┐
│            │
│   ████     │  ← Next piece (largest)
│            │
│   ██       │  ← 2nd piece (smaller)
│   ███      │
│            │
│   ██       │  ← 3rd piece (smaller)
│   ██       │
└────────────┘
```

## Design Token References

- `color-chrome` - Panel background
- `border-panel` - Panel border
- `preview-cells` - Preview box size
- `preview-scale` - Piece scale factor
- `spacing-4` - Internal padding

## Implementation Notes

_To be filled in after implementation_
