# ScorePanel Component

**Status**: 📝 Stub (pending implementation)
**Created**: 2026-01-06

## Purpose

Displays game statistics: current score, level, and lines cleared. Updates in real-time during gameplay.

## Planned Props

| Prop | Type | Description |
|------|------|-------------|
| `score` | `number` | Current score |
| `level` | `number` | Current level |
| `lines` | `number` | Total lines cleared |

## Layout

```
┌─ SCORE ────┐
│            │
│   12,450   │  ← Score (large, glowing)
│            │
└────────────┘

┌─ LEVEL ────┐
│            │
│     5      │  ← Level number
│            │
└────────────┘

┌─ LINES ────┐
│            │
│     42     │  ← Lines cleared
│            │
└────────────┘
```

## Animations

- Score increment: Numbers roll up
- Level up: Flash/pulse effect
- New score digit: Scale in

## Design Token References

- `color-chrome` - Panel background
- `color-accent-primary` - Score glow
- `font-display` - Number font
- `text-2xl` - Score size
- `text-xl` - Level/Lines size

## Implementation Notes

_To be filled in after implementation_
