# HoldBox Component

**Status**: 📝 Stub (pending implementation)
**Created**: 2026-01-06

## Purpose

Displays the currently held tetromino. Shows empty state when no piece is held, and dims the piece when hold has been used this turn.

## Planned Props

| Prop | Type | Description |
|------|------|-------------|
| `piece` | `TetrominoType \| null` | Held piece (null = empty) |
| `isLocked` | `boolean` | True if hold used this turn |

## Visual States

- **Empty**: Shows "HOLD" label with empty box
- **Holding**: Shows the held tetromino
- **Locked**: Piece is dimmed/grayed out

## Layout

```
┌─ HOLD ─────┐
│            │
│   ██       │
│   ██       │  ← Held piece
│            │
└────────────┘
```

## Design Token References

- `color-chrome` - Panel background
- `border-panel` - Panel border
- `color-text-dim` - Locked state opacity
- `spacing-4` - Internal padding

## Implementation Notes

_To be filled in after implementation_
