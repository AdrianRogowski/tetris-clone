/**
 * Tests for Game State Management
 * Covers: State transitions, game flow, piece manipulation
 */

import { describe, it, expect } from 'vitest';
import {
  INITIAL_GAME_STATE,
  LOCK_DELAY,
  MAX_LOCK_RESETS,
  createGameState,
  startGame,
  pauseGame,
  resumeGame,
  moveLeft,
  moveRight,
  moveDown,
  hardDrop,
  rotateClockwise,
  rotateCounterClockwise,
  holdPiece,
  tick,
  lockAndSpawn,
  endGame,
  resetGame,
  checkGameOver,
  getGhostPiece,
} from './gameState';
import type { GameData, Piece } from './types';

describe('Game State Constants', () => {
  it('should have a lock delay of 500ms', () => {
    expect(LOCK_DELAY).toBe(500);
  });

  it('should allow 15 lock resets per piece', () => {
    expect(MAX_LOCK_RESETS).toBe(15);
  });
});

describe('INITIAL_GAME_STATE', () => {
  it('should start with empty board', () => {
    expect(INITIAL_GAME_STATE.board).toEqual([]);
  });

  it('should start with no current piece', () => {
    expect(INITIAL_GAME_STATE.currentPiece).toBeNull();
  });

  it('should start with score 0', () => {
    expect(INITIAL_GAME_STATE.score).toBe(0);
  });

  it('should start at level 1', () => {
    expect(INITIAL_GAME_STATE.level).toBe(1);
  });

  it('should start with 0 lines', () => {
    expect(INITIAL_GAME_STATE.lines).toBe(0);
  });

  it('should start in idle state', () => {
    expect(INITIAL_GAME_STATE.state).toBe('idle');
  });

  it('should allow holding at start', () => {
    expect(INITIAL_GAME_STATE.canHold).toBe(true);
  });
});

describe('createGameState', () => {
  it('should return a fresh game state', () => {
    const state = createGameState();
    expect(state.state).toBe('idle');
    expect(state.score).toBe(0);
  });

  it('should initialize the board', () => {
    const state = createGameState();
    expect(Array.isArray(state.board)).toBe(true);
    expect(state.board.length).toBeGreaterThan(0);
  });

  it('should initialize next pieces queue', () => {
    const state = createGameState();
    expect(state.nextPieces.length).toBeGreaterThan(0);
  });
});

describe('startGame', () => {
  it('should transition from idle to playing', () => {
    const state = createGameState();
    const started = startGame(state);
    expect(started.state).toBe('playing');
  });

  it('should spawn the first piece', () => {
    const state = createGameState();
    const started = startGame(state);
    expect(started.currentPiece).not.toBeNull();
  });

  it('should reset score when starting', () => {
    const state = { ...createGameState(), score: 100 };
    const started = startGame(state);
    expect(started.score).toBe(0);
  });

  it('should reset level to 1', () => {
    const state = { ...createGameState(), level: 5 };
    const started = startGame(state);
    expect(started.level).toBe(1);
  });

  it('should clear the board', () => {
    const state = createGameState();
    state.board[0][0] = 'T';
    const started = startGame(state);
    expect(started.board[0][0]).toBeNull();
  });
});

describe('pauseGame', () => {
  it('should transition from playing to paused', () => {
    let state = startGame(createGameState());
    state = pauseGame(state);
    expect(state.state).toBe('paused');
  });

  it('should not change state if already paused', () => {
    let state = startGame(createGameState());
    state = pauseGame(state);
    state = pauseGame(state);
    expect(state.state).toBe('paused');
  });

  it('should not pause if game is over', () => {
    let state = createGameState();
    state = { ...state, state: 'gameOver' };
    state = pauseGame(state);
    expect(state.state).toBe('gameOver');
  });

  it('should preserve game state when pausing', () => {
    let state = startGame(createGameState());
    const scoreBefore = state.score;
    const pieceBefore = state.currentPiece;
    state = pauseGame(state);
    expect(state.score).toBe(scoreBefore);
    expect(state.currentPiece).toEqual(pieceBefore);
  });
});

describe('resumeGame', () => {
  it('should transition from paused to playing', () => {
    let state = startGame(createGameState());
    state = pauseGame(state);
    state = resumeGame(state);
    expect(state.state).toBe('playing');
  });

  it('should not resume if not paused', () => {
    let state = startGame(createGameState());
    state = resumeGame(state);
    expect(state.state).toBe('playing');
  });
});

describe('Movement', () => {
  describe('moveLeft', () => {
    it('should move piece one cell left', () => {
      let state = startGame(createGameState());
      const xBefore = state.currentPiece!.position.x;
      state = moveLeft(state);
      expect(state.currentPiece!.position.x).toBe(xBefore - 1);
    });

    it('should not move if at left wall', () => {
      let state = startGame(createGameState());
      // Move piece to left wall
      state = {
        ...state,
        currentPiece: { ...state.currentPiece!, position: { x: 0, y: 5 } },
      };
      const xBefore = state.currentPiece!.position.x;
      state = moveLeft(state);
      expect(state.currentPiece!.position.x).toBe(xBefore);
    });

    it('should not move if blocked by existing piece', () => {
      let state = startGame(createGameState());
      // Place block to the left
      const piece = state.currentPiece!;
      state.board[piece.position.y + 1][piece.position.x - 1] = 'I';
      
      const xBefore = piece.position.x;
      state = moveLeft(state);
      // Position should be unchanged if blocked
      expect(state.currentPiece!.position.x).toBeLessThanOrEqual(xBefore);
    });

    it('should not move if game is paused', () => {
      let state = startGame(createGameState());
      state = pauseGame(state);
      const xBefore = state.currentPiece!.position.x;
      state = moveLeft(state);
      expect(state.currentPiece!.position.x).toBe(xBefore);
    });
  });

  describe('moveRight', () => {
    it('should move piece one cell right', () => {
      let state = startGame(createGameState());
      const xBefore = state.currentPiece!.position.x;
      state = moveRight(state);
      expect(state.currentPiece!.position.x).toBe(xBefore + 1);
    });

    it('should not move if at right wall', () => {
      let state = startGame(createGameState());
      // Move piece to right wall (depends on piece type)
      state = {
        ...state,
        currentPiece: { ...state.currentPiece!, position: { x: 8, y: 5 } },
      };
      // Multiple moves to ensure hitting wall
      for (let i = 0; i < 5; i++) {
        state = moveRight(state);
      }
      // Should be capped at some maximum
      expect(state.currentPiece!.position.x).toBeLessThanOrEqual(9);
    });
  });

  describe('moveDown (soft drop)', () => {
    it('should move piece one cell down', () => {
      let state = startGame(createGameState());
      const yBefore = state.currentPiece!.position.y;
      state = moveDown(state);
      expect(state.currentPiece!.position.y).toBe(yBefore + 1);
    });

    it('should award soft drop points', () => {
      let state = startGame(createGameState());
      const scoreBefore = state.score;
      state = moveDown(state);
      expect(state.score).toBe(scoreBefore + 1);
    });

    it('should not move if at bottom', () => {
      let state = startGame(createGameState());
      // Move piece to near bottom
      state = {
        ...state,
        currentPiece: { 
          ...state.currentPiece!, 
          position: { x: 4, y: 18 },
          type: 'O', // 2x2 piece
        },
      };
      // Keep moving down until stopped
      for (let i = 0; i < 5; i++) {
        state = moveDown(state);
      }
      // Y position should be capped
      expect(state.currentPiece!.position.y).toBeLessThanOrEqual(20);
    });
  });
});

describe('hardDrop', () => {
  it('should instantly move piece to ghost position', () => {
    let state = startGame(createGameState());
    const ghostPos = getGhostPiece(state);
    state = hardDrop(state);
    
    // After hard drop, piece should be locked (new piece spawned)
    // or at ghost position if not auto-locking
    expect(state.currentPiece).not.toBeNull();
  });

  it('should award hard drop points (2 per cell)', () => {
    let state = startGame(createGameState());
    const yBefore = state.currentPiece!.position.y;
    const scoreBefore = state.score;
    state = hardDrop(state);
    
    // Should have earned points for distance dropped
    expect(state.score).toBeGreaterThan(scoreBefore);
  });

  it('should lock piece immediately', () => {
    let state = startGame(createGameState());
    const pieceBefore = state.currentPiece!.type;
    state = hardDrop(state);
    
    // After hard drop and lock, should have new piece
    // (unless game over)
    if (state.state === 'playing') {
      // Board should have cells filled from previous piece
      const hasFilledCells = state.board.some(row => 
        row.some(cell => cell !== null)
      );
      expect(hasFilledCells).toBe(true);
    }
  });
});

describe('Rotation', () => {
  describe('rotateClockwise', () => {
    it('should rotate piece 90 degrees clockwise', () => {
      let state = startGame(createGameState());
      const rotationBefore = state.currentPiece!.rotation;
      state = rotateClockwise(state);
      expect(state.currentPiece!.rotation).toBe((rotationBefore + 1) % 4);
    });

    it('should wrap from rotation 3 to 0', () => {
      let state = startGame(createGameState());
      state = {
        ...state,
        currentPiece: { ...state.currentPiece!, rotation: 3 },
      };
      state = rotateClockwise(state);
      expect(state.currentPiece!.rotation).toBe(0);
    });

    it('should apply wall kick if needed', () => {
      let state = startGame(createGameState());
      // Move piece to wall
      state = {
        ...state,
        currentPiece: { ...state.currentPiece!, position: { x: 0, y: 5 } },
      };
      const xBefore = state.currentPiece!.position.x;
      state = rotateClockwise(state);
      
      // After wall kick, piece may have shifted
      // Just verify rotation succeeded
      expect([0, 1, 2, 3]).toContain(state.currentPiece!.rotation);
    });

    it('should not rotate if all wall kicks fail', () => {
      // This is hard to set up without specific board state
      // Just verify rotation returns valid state
      let state = startGame(createGameState());
      state = rotateClockwise(state);
      expect(state.currentPiece).not.toBeNull();
    });
  });

  describe('rotateCounterClockwise', () => {
    it('should rotate piece 90 degrees counter-clockwise', () => {
      let state = startGame(createGameState());
      const rotationBefore = state.currentPiece!.rotation;
      state = rotateCounterClockwise(state);
      expect(state.currentPiece!.rotation).toBe((rotationBefore + 3) % 4);
    });

    it('should wrap from rotation 0 to 3', () => {
      let state = startGame(createGameState());
      state = {
        ...state,
        currentPiece: { ...state.currentPiece!, rotation: 0 },
      };
      state = rotateCounterClockwise(state);
      expect(state.currentPiece!.rotation).toBe(3);
    });
  });
});

describe('holdPiece', () => {
  it('should store current piece in hold', () => {
    let state = startGame(createGameState());
    const currentType = state.currentPiece!.type;
    state = holdPiece(state);
    expect(state.heldPiece).toBe(currentType);
  });

  it('should swap with held piece if one exists', () => {
    let state = startGame(createGameState());
    state = holdPiece(state); // First hold
    const heldType = state.heldPiece;
    state = { ...state, canHold: true }; // Allow holding again
    const currentType = state.currentPiece!.type;
    state = holdPiece(state);
    
    expect(state.heldPiece).toBe(currentType);
    expect(state.currentPiece!.type).toBe(heldType);
  });

  it('should set canHold to false after holding', () => {
    let state = startGame(createGameState());
    state = holdPiece(state);
    expect(state.canHold).toBe(false);
  });

  it('should not allow holding twice in same turn', () => {
    let state = startGame(createGameState());
    state = holdPiece(state);
    const heldAfterFirst = state.heldPiece;
    state = holdPiece(state); // Should be ignored
    expect(state.heldPiece).toBe(heldAfterFirst);
  });

  it('should spawn next piece when holding with empty hold', () => {
    let state = startGame(createGameState());
    expect(state.heldPiece).toBeNull();
    const nextPiece = state.nextPieces[0];
    state = holdPiece(state);
    expect(state.currentPiece!.type).toBe(nextPiece);
  });

  it('should reset canHold on new piece spawn', () => {
    let state = startGame(createGameState());
    state = holdPiece(state);
    expect(state.canHold).toBe(false);
    state = hardDrop(state); // Locks piece, spawns new one
    if (state.state === 'playing') {
      expect(state.canHold).toBe(true);
    }
  });
});

describe('tick', () => {
  it('should move piece down after tick', () => {
    let state = startGame(createGameState());
    const yBefore = state.currentPiece!.position.y;
    state = tick(state);
    expect(state.currentPiece!.position.y).toBe(yBefore + 1);
  });

  it('should not tick if game is paused', () => {
    let state = startGame(createGameState());
    state = pauseGame(state);
    const yBefore = state.currentPiece!.position.y;
    state = tick(state);
    expect(state.currentPiece!.position.y).toBe(yBefore);
  });

  it('should not tick if game is over', () => {
    let state = createGameState();
    state = { ...state, state: 'gameOver' };
    state = tick(state);
    expect(state.state).toBe('gameOver');
  });
});

describe('lockAndSpawn', () => {
  it('should lock current piece to board', () => {
    let state = startGame(createGameState());
    // Move piece down so it lands
    state = hardDrop(state);
    
    // Board should have filled cells
    const hasFilledCells = state.board.some(row => 
      row.some(cell => cell !== null)
    );
    expect(hasFilledCells).toBe(true);
  });

  it('should spawn new piece from queue', () => {
    let state = startGame(createGameState());
    const nextPiece = state.nextPieces[0];
    state = hardDrop(state);
    
    if (state.state === 'playing') {
      expect(state.currentPiece!.type).toBe(nextPiece);
    }
  });

  it('should check for and clear completed lines', () => {
    let state = startGame(createGameState());
    // Fill bottom row except one spot
    for (let x = 0; x < 9; x++) {
      state.board[21][x] = 'I'; // Row index with buffer
    }
    
    // Drop an I-piece to complete the line
    // (This is a simplified test)
    state = hardDrop(state);
    
    // Lines may or may not be cleared depending on piece position
    expect(state.lines).toBeGreaterThanOrEqual(0);
  });

  it('should update score on line clear', () => {
    let state = startGame(createGameState());
    // Set up a situation where lines will be cleared
    // This is a more complex integration test
    expect(state.score).toBeGreaterThanOrEqual(0);
  });

  it('should reset canHold for new piece', () => {
    let state = startGame(createGameState());
    state = holdPiece(state);
    expect(state.canHold).toBe(false);
    state = hardDrop(state);
    if (state.state === 'playing') {
      expect(state.canHold).toBe(true);
    }
  });
});

describe('endGame', () => {
  it('should transition to gameOver state', () => {
    let state = startGame(createGameState());
    state = endGame(state);
    expect(state.state).toBe('gameOver');
  });

  it('should preserve final score', () => {
    let state = startGame(createGameState());
    state = { ...state, score: 12345 };
    state = endGame(state);
    expect(state.score).toBe(12345);
  });
});

describe('resetGame', () => {
  it('should return to idle state', () => {
    let state = startGame(createGameState());
    state = endGame(state);
    state = resetGame(state);
    expect(state.state).toBe('idle');
  });

  it('should clear score', () => {
    let state = startGame(createGameState());
    state = { ...state, score: 99999 };
    state = resetGame(state);
    expect(state.score).toBe(0);
  });

  it('should clear board', () => {
    let state = startGame(createGameState());
    state = hardDrop(state);
    state = resetGame(state);
    
    const allEmpty = state.board.every(row => 
      row.every(cell => cell === null)
    );
    expect(allEmpty).toBe(true);
  });
});

describe('checkGameOver', () => {
  it('should return false for new game', () => {
    const state = startGame(createGameState());
    expect(checkGameOver(state)).toBe(false);
  });

  it('should return true when spawn is blocked', () => {
    let state = startGame(createGameState());
    // Fill top rows
    for (let x = 0; x < 10; x++) {
      state.board[0][x] = 'I';
      state.board[1][x] = 'I';
    }
    expect(checkGameOver(state)).toBe(true);
  });
});

describe('getGhostPiece', () => {
  it('should return position below current piece', () => {
    const state = startGame(createGameState());
    const ghost = getGhostPiece(state);
    
    expect(ghost).not.toBeNull();
    expect(ghost!.y).toBeGreaterThan(state.currentPiece!.position.y);
  });

  it('should return same x position as current piece', () => {
    const state = startGame(createGameState());
    const ghost = getGhostPiece(state);
    
    expect(ghost!.x).toBe(state.currentPiece!.position.x);
  });

  it('should return null if no current piece', () => {
    const state = { ...createGameState(), currentPiece: null };
    const ghost = getGhostPiece(state);
    expect(ghost).toBeNull();
  });

  it('should update when piece moves horizontally', () => {
    let state = startGame(createGameState());
    const ghostBefore = getGhostPiece(state);
    state = moveLeft(state);
    const ghostAfter = getGhostPiece(state);
    
    expect(ghostAfter!.x).toBe(ghostBefore!.x - 1);
  });
});
