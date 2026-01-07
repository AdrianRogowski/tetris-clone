# GarbageIndicator Component

**Status**: 📝 Stub (pending implementation)
**Source**: `src/components/GarbageIndicator.tsx` (planned)
**Created**: 2026-01-06

## Purpose

Displays pending garbage lines that will be added to the player's board. Shows as a warning bar/meter that fills up as garbage accumulates.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `count` | `number` | Yes | Number of pending garbage lines |
| `maxDisplay` | `number` | No | Max lines to show (default: 20) |

## Visual Design

- Vertical bar on left side of board
- Red/warning color
- Segments for each pending line
- Flashing animation when > 0
- Number label showing count

## Behavior

- Appears when garbage is incoming
- Shrinks as player clears lines (canceling garbage)
- Empties when garbage is applied to board
- Flashes more urgently when count is high (>10)

## Animation

- Pulse animation when garbage incoming
- Shrink animation when garbage canceled
- Flash animation when about to apply
