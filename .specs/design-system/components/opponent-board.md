# OpponentBoard Component

**Status**: 📝 Stub (pending implementation)
**Source**: `src/components/OpponentBoard.tsx` (planned)
**Created**: 2026-01-06

## Purpose

Displays a miniaturized version of an opponent's game board during multiplayer. Shows their current board state, score, and elimination status.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `board` | `Board` | Yes | Opponent's board state |
| `playerName` | `string` | Yes | Player's name |
| `score` | `number` | Yes | Current score |
| `isEliminated` | `boolean` | No | Show as eliminated |
| `placement` | `number` | No | Final placement (1-4) |
| `isTarget` | `boolean` | No | Highlight if targeted |

## Visual Design

- Mini board: ~10x20 cells but much smaller (60-80px wide)
- Cells show only filled/empty, colors optional
- Player name above board
- Score below board
- "OUT" overlay when eliminated
- Glow border when targeted

## Sizing

- Desktop: ~80px wide
- 2 players: Can be larger (~120px)
- 4 players: Stacked vertically, smaller
