/**
 * Tetromino shape definitions and rotation logic
 * Follows the Super Rotation System (SRS) standard
 */

import type { TetrominoType, RotationState, Position } from './types';

/** Shape definition as a 2D array of booleans (true = filled cell) */
export type Shape = boolean[][];

/**
 * Tetromino shapes in their spawn (rotation 0) state
 * Shapes are defined in a bounding box, with true indicating a filled cell
 */
export const TETROMINO_SHAPES: Record<TetrominoType, Shape> = {
  I: [
    [false, false, false, false],
    [true, true, true, true],
    [false, false, false, false],
    [false, false, false, false],
  ],
  O: [
    [true, true],
    [true, true],
  ],
  T: [
    [false, true, false],
    [true, true, true],
    [false, false, false],
  ],
  S: [
    [false, true, true],
    [true, true, false],
    [false, false, false],
  ],
  Z: [
    [true, true, false],
    [false, true, true],
    [false, false, false],
  ],
  J: [
    [true, false, false],
    [true, true, true],
    [false, false, false],
  ],
  L: [
    [false, false, true],
    [true, true, true],
    [false, false, false],
  ],
};

/**
 * Spawn positions for each tetromino type
 * Pieces spawn centered at the top of the playfield
 */
export const SPAWN_POSITIONS: Record<TetrominoType, Position> = {
  I: { x: 3, y: -1 },
  O: { x: 4, y: 0 },
  T: { x: 3, y: 0 },
  S: { x: 3, y: 0 },
  Z: { x: 3, y: 0 },
  J: { x: 3, y: 0 },
  L: { x: 3, y: 0 },
};

/**
 * SRS wall kick data for J, L, S, T, Z pieces
 * Format: [rotation_from][rotation_to] = array of offset tests
 */
export const WALL_KICKS_JLSTZ: Record<string, Position[]> = {
  '0>1': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
  '1>0': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
  '1>2': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
  '2>1': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
  '2>3': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  '3>2': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
  '3>0': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
  '0>3': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
};

/**
 * SRS wall kick data for I piece (different from others)
 */
export const WALL_KICKS_I: Record<string, Position[]> = {
  '0>1': [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 1 }, { x: 1, y: -2 }],
  '1>0': [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: -1 }, { x: -1, y: 2 }],
  '1>2': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: -2 }, { x: 2, y: 1 }],
  '2>1': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 2 }, { x: -2, y: -1 }],
  '2>3': [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: -1 }, { x: -1, y: 2 }],
  '3>2': [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 1 }, { x: 1, y: -2 }],
  '3>0': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 2 }, { x: -2, y: -1 }],
  '0>3': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: -2 }, { x: 2, y: 1 }],
};

/**
 * Rotate a shape 90 degrees clockwise
 */
export function rotateShapeClockwise(shape: Shape): Shape {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: Shape = [];
  
  for (let col = 0; col < cols; col++) {
    const newRow: boolean[] = [];
    for (let row = rows - 1; row >= 0; row--) {
      newRow.push(shape[row][col]);
    }
    rotated.push(newRow);
  }
  
  return rotated;
}

/**
 * Rotate a shape 90 degrees counter-clockwise
 */
export function rotateShapeCounterClockwise(shape: Shape): Shape {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: Shape = [];
  
  for (let col = cols - 1; col >= 0; col--) {
    const newRow: boolean[] = [];
    for (let row = 0; row < rows; row++) {
      newRow.push(shape[row][col]);
    }
    rotated.push(newRow);
  }
  
  return rotated;
}

/**
 * Get the shape of a tetromino at a specific rotation state
 */
export function getRotatedShape(type: TetrominoType, rotation: RotationState): Shape {
  let shape = TETROMINO_SHAPES[type];
  
  // Apply rotations
  for (let i = 0; i < rotation; i++) {
    shape = rotateShapeClockwise(shape);
  }
  
  return shape;
}

/**
 * Get the cells occupied by a piece at its current position and rotation
 * Returns an array of absolute board positions
 */
export function getPieceCells(type: TetrominoType, position: Position, rotation: RotationState): Position[] {
  const shape = getRotatedShape(type, rotation);
  const cells: Position[] = [];
  
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        cells.push({
          x: position.x + col,
          y: position.y + row,
        });
      }
    }
  }
  
  return cells;
}

/**
 * Get wall kick offsets to try when rotating
 */
export function getWallKicks(
  type: TetrominoType,
  fromRotation: RotationState,
  toRotation: RotationState
): Position[] {
  // O piece doesn't need wall kicks (symmetric)
  if (type === 'O') {
    return [{ x: 0, y: 0 }];
  }
  
  const key = `${fromRotation}>${toRotation}`;
  
  if (type === 'I') {
    return WALL_KICKS_I[key] || [{ x: 0, y: 0 }];
  }
  
  return WALL_KICKS_JLSTZ[key] || [{ x: 0, y: 0 }];
}

/**
 * Create a new piece at its spawn position
 */
export function createPiece(type: TetrominoType): { type: TetrominoType; position: Position; rotation: RotationState } {
  return {
    type,
    position: { ...SPAWN_POSITIONS[type] },
    rotation: 0,
  };
}
