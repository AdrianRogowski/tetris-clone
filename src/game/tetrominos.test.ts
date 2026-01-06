/**
 * Tests for Tetromino shapes and rotation
 * Covers: Shape definitions, rotation logic, wall kicks, spawn positions
 */

import { describe, it, expect } from 'vitest';
import {
  TETROMINO_SHAPES,
  SPAWN_POSITIONS,
  WALL_KICKS_JLSTZ,
  WALL_KICKS_I,
  rotateShapeClockwise,
  rotateShapeCounterClockwise,
  getRotatedShape,
  getPieceCells,
  getWallKicks,
  createPiece,
} from './tetrominos';
import type { TetrominoType, RotationState, Position } from './types';

describe('Tetromino Shapes', () => {
  describe('TETROMINO_SHAPES', () => {
    it('should define all 7 tetromino types', () => {
      const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      types.forEach((type) => {
        expect(TETROMINO_SHAPES[type]).toBeDefined();
      });
    });

    it('should have I-piece as 4x4 grid with 4 cells in a row', () => {
      const shape = TETROMINO_SHAPES.I;
      expect(shape.length).toBe(4);
      expect(shape[0].length).toBe(4);
      
      // Count filled cells
      const filledCells = shape.flat().filter(Boolean).length;
      expect(filledCells).toBe(4);
      
      // Second row should have all 4 cells
      expect(shape[1]).toEqual([true, true, true, true]);
    });

    it('should have O-piece as 2x2 grid with all cells filled', () => {
      const shape = TETROMINO_SHAPES.O;
      expect(shape.length).toBe(2);
      expect(shape[0].length).toBe(2);
      expect(shape).toEqual([
        [true, true],
        [true, true],
      ]);
    });

    it('should have T-piece with 4 cells in T formation', () => {
      const shape = TETROMINO_SHAPES.T;
      const filledCells = shape.flat().filter(Boolean).length;
      expect(filledCells).toBe(4);
      
      // Top center and middle row should form T
      expect(shape[0][1]).toBe(true);
      expect(shape[1]).toEqual([true, true, true]);
    });

    it('should have S-piece with correct zigzag pattern', () => {
      const shape = TETROMINO_SHAPES.S;
      expect(shape[0]).toEqual([false, true, true]);
      expect(shape[1]).toEqual([true, true, false]);
    });

    it('should have Z-piece with correct zigzag pattern (opposite of S)', () => {
      const shape = TETROMINO_SHAPES.Z;
      expect(shape[0]).toEqual([true, true, false]);
      expect(shape[1]).toEqual([false, true, true]);
    });

    it('should have J-piece with corner cell and row', () => {
      const shape = TETROMINO_SHAPES.J;
      expect(shape[0]).toEqual([true, false, false]);
      expect(shape[1]).toEqual([true, true, true]);
    });

    it('should have L-piece with corner cell and row (mirror of J)', () => {
      const shape = TETROMINO_SHAPES.L;
      expect(shape[0]).toEqual([false, false, true]);
      expect(shape[1]).toEqual([true, true, true]);
    });

    it('should have each tetromino with exactly 4 filled cells', () => {
      const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      types.forEach((type) => {
        const filledCells = TETROMINO_SHAPES[type].flat().filter(Boolean).length;
        expect(filledCells).toBe(4);
      });
    });
  });

  describe('SPAWN_POSITIONS', () => {
    it('should define spawn positions for all 7 pieces', () => {
      const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      types.forEach((type) => {
        expect(SPAWN_POSITIONS[type]).toBeDefined();
        expect(SPAWN_POSITIONS[type].x).toBeTypeOf('number');
        expect(SPAWN_POSITIONS[type].y).toBeTypeOf('number');
      });
    });

    it('should spawn pieces centered horizontally (roughly middle of 10-wide board)', () => {
      // Most pieces spawn around x=3-4 to be centered
      const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      types.forEach((type) => {
        expect(SPAWN_POSITIONS[type].x).toBeGreaterThanOrEqual(3);
        expect(SPAWN_POSITIONS[type].x).toBeLessThanOrEqual(4);
      });
    });

    it('should spawn pieces at or above the top of the visible board', () => {
      const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      types.forEach((type) => {
        expect(SPAWN_POSITIONS[type].y).toBeLessThanOrEqual(0);
      });
    });
  });
});

describe('Rotation', () => {
  describe('rotateShapeClockwise', () => {
    it('should rotate a 3x3 shape 90 degrees clockwise', () => {
      const original = [
        [true, false, false],
        [true, true, true],
        [false, false, false],
      ];
      const rotated = rotateShapeClockwise(original);
      expect(rotated).toEqual([
        [false, true, true],
        [false, true, false],
        [false, true, false],
      ]);
    });

    it('should rotate a 4x4 I-piece correctly', () => {
      const horizontal = TETROMINO_SHAPES.I;
      const vertical = rotateShapeClockwise(horizontal);
      
      // After rotation, the I-piece should be vertical
      expect(vertical[0][2]).toBe(true);
      expect(vertical[1][2]).toBe(true);
      expect(vertical[2][2]).toBe(true);
      expect(vertical[3][2]).toBe(true);
    });

    it('should return same shape for O-piece (square symmetry)', () => {
      const original = TETROMINO_SHAPES.O;
      const rotated = rotateShapeClockwise(original);
      expect(rotated).toEqual(original);
    });

    it('should return to original after 4 clockwise rotations', () => {
      const types: TetrominoType[] = ['I', 'T', 'S', 'Z', 'J', 'L'];
      types.forEach((type) => {
        let shape = TETROMINO_SHAPES[type];
        for (let i = 0; i < 4; i++) {
          shape = rotateShapeClockwise(shape);
        }
        expect(shape).toEqual(TETROMINO_SHAPES[type]);
      });
    });
  });

  describe('rotateShapeCounterClockwise', () => {
    it('should rotate a 3x3 shape 90 degrees counter-clockwise', () => {
      const original = [
        [true, false, false],
        [true, true, true],
        [false, false, false],
      ];
      const rotated = rotateShapeCounterClockwise(original);
      expect(rotated).toEqual([
        [false, true, false],
        [false, true, false],
        [true, true, false],
      ]);
    });

    it('should be inverse of clockwise rotation', () => {
      const types: TetrominoType[] = ['I', 'T', 'S', 'Z', 'J', 'L'];
      types.forEach((type) => {
        const original = TETROMINO_SHAPES[type];
        const cw = rotateShapeClockwise(original);
        const back = rotateShapeCounterClockwise(cw);
        expect(back).toEqual(original);
      });
    });
  });

  describe('getRotatedShape', () => {
    it('should return original shape for rotation state 0', () => {
      const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      types.forEach((type) => {
        expect(getRotatedShape(type, 0)).toEqual(TETROMINO_SHAPES[type]);
      });
    });

    it('should return correctly rotated shape for each state', () => {
      // T-piece rotation states
      const t0 = getRotatedShape('T', 0);
      const t1 = getRotatedShape('T', 1);
      const t2 = getRotatedShape('T', 2);
      const t3 = getRotatedShape('T', 3);

      // Each should be different (except potentially some symmetric cases)
      expect(t0).not.toEqual(t1);
      expect(t1).not.toEqual(t2);
      expect(t2).not.toEqual(t3);
    });

    it('should handle all valid rotation states (0, 1, 2, 3)', () => {
      const states: RotationState[] = [0, 1, 2, 3];
      states.forEach((state) => {
        expect(() => getRotatedShape('T', state)).not.toThrow();
      });
    });
  });
});

describe('getPieceCells', () => {
  it('should return 4 cells for any piece', () => {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    types.forEach((type) => {
      const cells = getPieceCells(type, { x: 0, y: 0 }, 0);
      expect(cells.length).toBe(4);
    });
  });

  it('should offset cells by piece position', () => {
    const cells = getPieceCells('O', { x: 5, y: 10 }, 0);
    // O-piece is 2x2 starting at offset
    cells.forEach((cell) => {
      expect(cell.x).toBeGreaterThanOrEqual(5);
      expect(cell.y).toBeGreaterThanOrEqual(10);
    });
  });

  it('should return different cells for different rotations', () => {
    const cells0 = getPieceCells('T', { x: 0, y: 0 }, 0);
    const cells1 = getPieceCells('T', { x: 0, y: 0 }, 1);
    
    // Sort for comparison
    const sorted0 = JSON.stringify(cells0.sort((a, b) => a.x - b.x || a.y - b.y));
    const sorted1 = JSON.stringify(cells1.sort((a, b) => a.x - b.x || a.y - b.y));
    
    expect(sorted0).not.toEqual(sorted1);
  });

  it('should handle I-piece spanning 4 columns horizontally', () => {
    const cells = getPieceCells('I', { x: 0, y: 0 }, 0);
    const xValues = cells.map((c) => c.x);
    expect(Math.max(...xValues) - Math.min(...xValues)).toBe(3);
  });
});

describe('Wall Kicks', () => {
  describe('WALL_KICKS_JLSTZ', () => {
    it('should define kicks for all rotation transitions', () => {
      const transitions = ['0>1', '1>0', '1>2', '2>1', '2>3', '3>2', '3>0', '0>3'];
      transitions.forEach((t) => {
        expect(WALL_KICKS_JLSTZ[t]).toBeDefined();
        expect(WALL_KICKS_JLSTZ[t].length).toBe(5);
      });
    });

    it('should have first kick as (0,0) - try original position first', () => {
      const transitions = ['0>1', '1>0', '1>2', '2>1', '2>3', '3>2', '3>0', '0>3'];
      transitions.forEach((t) => {
        expect(WALL_KICKS_JLSTZ[t][0]).toEqual({ x: 0, y: 0 });
      });
    });
  });

  describe('WALL_KICKS_I', () => {
    it('should define kicks for all rotation transitions', () => {
      const transitions = ['0>1', '1>0', '1>2', '2>1', '2>3', '3>2', '3>0', '0>3'];
      transitions.forEach((t) => {
        expect(WALL_KICKS_I[t]).toBeDefined();
        expect(WALL_KICKS_I[t].length).toBe(5);
      });
    });

    it('should have different kicks than JLSTZ pieces', () => {
      // I-piece needs larger kicks due to its size
      expect(WALL_KICKS_I['0>1']).not.toEqual(WALL_KICKS_JLSTZ['0>1']);
    });
  });

  describe('getWallKicks', () => {
    it('should return correct kicks for JLSTZ pieces', () => {
      const kicks = getWallKicks('T', 0, 1);
      expect(kicks).toEqual(WALL_KICKS_JLSTZ['0>1']);
    });

    it('should return correct kicks for I-piece', () => {
      const kicks = getWallKicks('I', 0, 1);
      expect(kicks).toEqual(WALL_KICKS_I['0>1']);
    });

    it('should return empty kicks for O-piece (no kicks needed)', () => {
      const kicks = getWallKicks('O', 0, 1);
      expect(kicks).toEqual([{ x: 0, y: 0 }]);
    });

    it('should handle counter-clockwise rotation (3>0 instead of 0>1)', () => {
      const kicks = getWallKicks('T', 0, 3);
      expect(kicks).toEqual(WALL_KICKS_JLSTZ['0>3']);
    });
  });
});

describe('createPiece', () => {
  it('should create a piece with correct type', () => {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    types.forEach((type) => {
      const piece = createPiece(type);
      expect(piece.type).toBe(type);
    });
  });

  it('should create piece at spawn position', () => {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    types.forEach((type) => {
      const piece = createPiece(type);
      expect(piece.position).toEqual(SPAWN_POSITIONS[type]);
    });
  });

  it('should create piece with rotation state 0', () => {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    types.forEach((type) => {
      const piece = createPiece(type);
      expect(piece.rotation).toBe(0);
    });
  });
});
