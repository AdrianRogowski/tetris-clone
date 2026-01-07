# Lobby Component

**Status**: 📝 Stub (pending implementation)
**Source**: `src/components/Lobby.tsx` (planned)
**Created**: 2026-01-06

## Purpose

Displays the multiplayer game lobby where players gather before a match. Shows room code, player list, ready states, and start game button (for host).

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `roomCode` | `string` | Yes | 6-character room code |
| `players` | `Player[]` | Yes | List of players in lobby |
| `isHost` | `boolean` | Yes | Whether current user is host |
| `onStart` | `() => void` | Yes | Called when host starts game |
| `onLeave` | `() => void` | Yes | Called when player leaves |

## States

- Empty (1 player, waiting for others)
- Ready (2+ players, can start)
- Full (4 players)
- Starting (countdown after host clicks start)

## Related

- `PlayerCard` - Individual player display
- `RoomCodeInput` - For joining games
