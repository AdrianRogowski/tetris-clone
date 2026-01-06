# GameBoard Component

**Status**: 📝 Stub (pending implementation)
**Created**: 2026-01-06

## Purpose

The main game board component that renders the 10x20 Tetris playing field. Displays the grid, placed pieces, the active falling piece, and the ghost piece preview.

## Planned Props

| Prop | Type | Description |
|------|------|-------------|
| `board` | `(string \| null)[][]` | 2D array of cell colors |
| `currentPiece` | `Piece` | The active falling tetromino |
| `ghostPosition` | `Position` | Where the ghost piece renders |
| `onLineClear` | `(lines: number[]) => void` | Callback when lines clear |

## Visual States

- **Empty**: All cells show grid background
- **Playing**: Mix of empty cells and placed pieces
- **Line clearing**: Flashing animation on completed lines
- **Game over**: Frozen, optionally grayscale

## Design Token References

- `color-grid-bg` - Board background
- `color-grid-line` - Grid lines
- `cell-size` - Individual cell dimensions
- `board-width` / `board-height` - Grid dimensions

## Implementation Notes

_To be filled in after implementation_
