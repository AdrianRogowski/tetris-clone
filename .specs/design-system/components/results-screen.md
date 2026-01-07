# ResultsScreen Component

**Status**: 📝 Stub (pending implementation)
**Source**: `src/components/ResultsScreen.tsx` (planned)
**Created**: 2026-01-06

## Purpose

Displays the final standings after a multiplayer game ends. Shows all players ranked by placement with their final scores.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `players` | `PlayerResult[]` | Yes | Players with final scores/placements |
| `winnerId` | `string` | Yes | ID of winning player |
| `onPlayAgain` | `() => void` | Yes | Rematch with same players |
| `onBackToLobby` | `() => void` | Yes | Return to lobby |
| `onLeave` | `() => void` | Yes | Exit to main menu |

## PlayerResult Type

```typescript
interface PlayerResult {
  id: string;
  name: string;
  placement: 1 | 2 | 3 | 4;
  score: number;
  linesCleared: number;
  garbageSent: number;
  isYou: boolean;
}
```

## Visual Design

- "GAME OVER" header
- "WINNER!" callout for 1st place
- Ranked list:
  - 1st: Gold styling, crown icon
  - 2nd: Silver styling
  - 3rd: Bronze styling
  - 4th: Normal styling
- Your row highlighted
- Stats for each player (score, lines, garbage sent)

## Animation

- Staggered reveal of placements (4th → 1st)
- Confetti for winner (optional)
- Glow effect on winner row
