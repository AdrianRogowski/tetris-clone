/**
 * Game state management
 * Handles the complete game state and state transitions
 */

import type { GameData, GameState, Piece, TetrominoType, Position, RotationState } from './types';
import { createEmptyBoard, canPlacePiece, lockPiece, findCompletedLines, clearLines, getGhostPosition as getBoardGhostPosition, isBlockOut, isLockOut, BOARD_HEIGHT, BOARD_BUFFER } from './board';
import { createRandomizer, getNextPiece } from './randomizer';
import { createPiece, getWallKicks } from './tetrominos';
import { calculatePoints, calculateLevel, didLevelUp } from './scoring';

/** Initial game state */
export const INITIAL_GAME_STATE: GameData = {
  board: [],
  currentPiece: null,
  nextPieces: [],
  heldPiece: null,
  canHold: true,
  score: 0,
  level: 1,
  lines: 0,
  state: 'idle',
};

/** Lock delay in milliseconds */
export const LOCK_DELAY = 500;

/** Maximum lock resets per piece */
export const MAX_LOCK_RESETS = 15;

/**
 * Create a new game state
 */
export function createGameState(): GameData {
  const { queue } = createRandomizer();
  return {
    ...INITIAL_GAME_STATE,
    board: createEmptyBoard(),
    nextPieces: queue,
  };
}

/**
 * Start a new game
 */
export function startGame(state: GameData): GameData {
  const board = createEmptyBoard();
  const { queue } = createRandomizer();
  const [firstPieceType, remainingQueue] = getNextPiece(queue);
  const firstPiece = createPiece(firstPieceType);
  
  return {
    board,
    currentPiece: firstPiece,
    nextPieces: remainingQueue,
    heldPiece: null,
    canHold: true,
    score: 0,
    level: 1,
    lines: 0,
    state: 'playing',
  };
}

/**
 * Pause the game
 */
export function pauseGame(state: GameData): GameData {
  if (state.state !== 'playing') return state;
  return { ...state, state: 'paused' };
}

/**
 * Resume the game
 */
export function resumeGame(state: GameData): GameData {
  if (state.state !== 'paused') return state;
  return { ...state, state: 'playing' };
}

/**
 * Helper to move piece if possible
 */
function tryMovePiece(state: GameData, dx: number, dy: number): GameData {
  if (state.state !== 'playing' || !state.currentPiece) return state;
  
  const newPosition: Position = {
    x: state.currentPiece.position.x + dx,
    y: state.currentPiece.position.y + dy,
  };
  
  if (canPlacePiece(state.board, state.currentPiece.type, newPosition, state.currentPiece.rotation)) {
    return {
      ...state,
      currentPiece: {
        ...state.currentPiece,
        position: newPosition,
      },
    };
  }
  
  return state;
}

/**
 * Move the current piece left
 */
export function moveLeft(state: GameData): GameData {
  return tryMovePiece(state, -1, 0);
}

/**
 * Move the current piece right
 */
export function moveRight(state: GameData): GameData {
  return tryMovePiece(state, 1, 0);
}

/**
 * Move the current piece down (soft drop)
 */
export function moveDown(state: GameData): GameData {
  if (state.state !== 'playing' || !state.currentPiece) return state;
  
  const moved = tryMovePiece(state, 0, 1);
  
  // Award soft drop points if we actually moved
  if (moved.currentPiece && moved.currentPiece.position.y > state.currentPiece.position.y) {
    return {
      ...moved,
      score: moved.score + calculatePoints({ type: 'softDrop', cells: 1 }, moved.level),
    };
  }
  
  return moved;
}

/**
 * Hard drop the current piece
 */
export function hardDrop(state: GameData): GameData {
  if (state.state !== 'playing' || !state.currentPiece) return state;
  
  const ghostPos = getBoardGhostPosition(
    state.board,
    state.currentPiece.type,
    state.currentPiece.position,
    state.currentPiece.rotation
  );
  
  const cellsDropped = ghostPos.y - state.currentPiece.position.y;
  const dropPoints = calculatePoints({ type: 'hardDrop', cells: cellsDropped }, state.level);
  
  const stateWithDroppedPiece: GameData = {
    ...state,
    score: state.score + dropPoints,
    currentPiece: {
      ...state.currentPiece,
      position: ghostPos,
    },
  };
  
  // Immediately lock the piece
  return lockAndSpawn(stateWithDroppedPiece);
}

/**
 * Helper to rotate piece with wall kicks
 */
function tryRotate(state: GameData, direction: 1 | -1): GameData {
  if (state.state !== 'playing' || !state.currentPiece) return state;
  
  const piece = state.currentPiece;
  const fromRotation = piece.rotation;
  const toRotation = ((fromRotation + direction + 4) % 4) as RotationState;
  
  const kicks = getWallKicks(piece.type, fromRotation, toRotation);
  
  for (const kick of kicks) {
    const newPosition: Position = {
      x: piece.position.x + kick.x,
      y: piece.position.y + kick.y,
    };
    
    if (canPlacePiece(state.board, piece.type, newPosition, toRotation)) {
      return {
        ...state,
        currentPiece: {
          ...piece,
          position: newPosition,
          rotation: toRotation,
        },
      };
    }
  }
  
  // All kicks failed, no rotation
  return state;
}

/**
 * Rotate the current piece clockwise
 */
export function rotateClockwise(state: GameData): GameData {
  return tryRotate(state, 1);
}

/**
 * Rotate the current piece counter-clockwise
 */
export function rotateCounterClockwise(state: GameData): GameData {
  return tryRotate(state, -1);
}

/**
 * Hold the current piece
 */
export function holdPiece(state: GameData): GameData {
  if (state.state !== 'playing' || !state.currentPiece || !state.canHold) return state;
  
  const currentType = state.currentPiece.type;
  
  if (state.heldPiece === null) {
    // No held piece - take from queue
    const [nextType, newQueue] = getNextPiece(state.nextPieces);
    const newPiece = createPiece(nextType);
    
    return {
      ...state,
      currentPiece: newPiece,
      heldPiece: currentType,
      nextPieces: newQueue,
      canHold: false,
    };
  } else {
    // Swap with held piece
    const newPiece = createPiece(state.heldPiece);
    
    return {
      ...state,
      currentPiece: newPiece,
      heldPiece: currentType,
      canHold: false,
    };
  }
}

/**
 * Tick the game forward (called on timer)
 * Handles automatic piece dropping
 */
export function tick(state: GameData): GameData {
  if (state.state !== 'playing' || !state.currentPiece) return state;
  
  // Try to move down
  const moved = tryMovePiece(state, 0, 1);
  
  // If we couldn't move, we might need to lock (handled by lock timer in UI)
  return moved;
}

/**
 * Lock the current piece and spawn a new one
 */
export function lockAndSpawn(state: GameData): GameData {
  if (!state.currentPiece) return state;
  
  // Lock the piece
  let newBoard = lockPiece(state.board, state.currentPiece);
  
  // Check for lock out
  if (isLockOut(state.currentPiece)) {
    return endGame(state);
  }
  
  // Find and clear completed lines
  const completedLines = findCompletedLines(newBoard);
  let newScore = state.score;
  let newLines = state.lines;
  
  if (completedLines.length > 0) {
    newBoard = clearLines(newBoard, completedLines);
    newScore += calculatePoints(
      { type: 'lineClear', lines: completedLines.length as 1 | 2 | 3 | 4 },
      state.level
    );
    newLines += completedLines.length;
  }
  
  // Calculate new level
  const newLevel = calculateLevel(newLines);
  
  // Get next piece
  const [nextType, newQueue] = getNextPiece(state.nextPieces);
  
  // Check for block out before spawning
  if (isBlockOut(newBoard, nextType)) {
    return {
      ...state,
      board: newBoard,
      score: newScore,
      lines: newLines,
      level: newLevel,
      currentPiece: null,
      nextPieces: newQueue,
      state: 'gameOver',
    };
  }
  
  const newPiece = createPiece(nextType);
  
  return {
    ...state,
    board: newBoard,
    currentPiece: newPiece,
    nextPieces: newQueue,
    score: newScore,
    lines: newLines,
    level: newLevel,
    canHold: true,
  };
}

/**
 * End the game
 */
export function endGame(state: GameData): GameData {
  return { ...state, state: 'gameOver' };
}

/**
 * Reset the game to initial state
 */
export function resetGame(state: GameData): GameData {
  return createGameState();
}

/**
 * Check if the game is over
 */
export function checkGameOver(state: GameData): boolean {
  if (!state.currentPiece) return false;
  
  // Check if spawn position is blocked
  const cells = state.board.slice(0, BOARD_BUFFER + 2);
  for (const row of cells) {
    if (row.some(cell => cell !== null)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get the ghost piece position
 */
export function getGhostPiece(state: GameData): Position | null {
  if (!state.currentPiece) return null;
  
  return getBoardGhostPosition(
    state.board,
    state.currentPiece.type,
    state.currentPiece.position,
    state.currentPiece.rotation
  );
}
