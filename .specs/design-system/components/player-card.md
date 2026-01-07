# PlayerCard Component

**Status**: 📝 Stub (pending implementation)
**Source**: `src/components/PlayerCard.tsx` (planned)
**Created**: 2026-01-06

## Purpose

Displays a player's information in the lobby or during gameplay. Shows player name, status (ready/not ready), host badge, and assigned color.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `player` | `Player` | Yes | Player data |
| `isHost` | `boolean` | No | Show host badge |
| `isYou` | `boolean` | No | Highlight as current user |
| `isReady` | `boolean` | No | Show ready checkmark |
| `isEmpty` | `boolean` | No | Show as empty slot |

## Visual Variants

- Default: Player name and color
- Host: Shows "HOST" badge
- Ready: Shows checkmark
- Empty: "Waiting for player..." in dim text
- Eliminated: Greyed out with "OUT" badge

## Player Colors

Players are assigned colors in order:
1. Player 1: `color-accent-primary` (cyan)
2. Player 2: `color-accent-success` (green)
3. Player 3: `color-piece-l` (orange)
4. Player 4: `color-piece-t` (purple)
