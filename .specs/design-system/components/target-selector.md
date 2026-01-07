# TargetSelector Component

**Status**: 📝 Stub (pending implementation)
**Source**: `src/components/TargetSelector.tsx` (planned)
**Created**: 2026-01-06

## Purpose

Allows player to choose targeting mode for garbage attacks in 3+ player games. Determines which opponent receives garbage when you clear lines.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentTarget` | `TargetMode` | Yes | Currently selected mode |
| `onTargetChange` | `(mode: TargetMode) => void` | Yes | Called when mode changes |
| `disabled` | `boolean` | No | Disable during certain states |

## Target Modes

| Mode | Description |
|------|-------------|
| `random` | Random living opponent |
| `badges` | Player with most KOs (eliminations) |
| `attacker` | Last player who attacked you |
| `lowest` | Player with lowest score |

## Visual Design

- Horizontal button group
- Active mode highlighted
- Icons for each mode:
  - Random: 🎲
  - Badges: 🏆
  - Attacker: ⚔️
  - Lowest: 📉

## Placement

- Below player's board
- Only shown in 3+ player games
- Hidden in 2-player (always targets opponent)
