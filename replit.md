# Tetris

A classic Tetris arcade game built with React, TypeScript, and Vite.

## Overview

This is a browser-based Tetris game featuring:
- Classic Tetris gameplay mechanics
- Hold piece functionality
- Next piece preview
- Score tracking
- Keyboard controls

## Project Structure

- `src/` - Source code
  - `components/` - React UI components (Cell, Game, GameBoard, HoldBox, Overlay, PreviewBox, ScorePanel)
  - `game/` - Core game logic (board, gameState, randomizer, scoring, tetrominos)
  - `hooks/` - React hooks (useGameLoop, useKeyboardControls)
  - `test/` - Test setup
- `public/` - Static assets

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Vitest (testing)

## Development

Run the development server:
```bash
npm run dev
```

Run tests:
```bash
npm test
```

Build for production:
```bash
npm run build
```

## Controls

- Arrow Left/Right: Move piece
- Arrow Up: Rotate
- Arrow Down: Soft drop
- Space: Hard drop
- Shift: Hold piece
- P: Pause
