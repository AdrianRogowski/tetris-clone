/**
 * Local multiplayer (same device) logic
 */

import type { LocalMultiplayerConfig } from './types';

/** Key bindings for local player 1 (arrow keys) */
export const PLAYER1_CONTROLS = {
  left: 'ArrowLeft',
  right: 'ArrowRight',
  down: 'ArrowDown',
  rotate: 'ArrowUp',
  hardDrop: ' ', // Space
  hold: 'ShiftLeft',
  pause: 'KeyP',
} as const;

/** Key bindings for local player 2 (WASD) */
export const PLAYER2_CONTROLS = {
  left: 'KeyA',
  right: 'KeyD',
  down: 'KeyS',
  rotate: 'KeyW',
  hardDrop: 'KeyX',
  hold: 'KeyE',
  pause: 'Tab',
} as const;

export type ControlAction = 'left' | 'right' | 'down' | 'rotate' | 'hardDrop' | 'hold' | 'pause';

/** Map from key code to action for player 1 */
const P1_KEY_TO_ACTION: Record<string, ControlAction> = {
  [PLAYER1_CONTROLS.left]: 'left',
  [PLAYER1_CONTROLS.right]: 'right',
  [PLAYER1_CONTROLS.down]: 'down',
  [PLAYER1_CONTROLS.rotate]: 'rotate',
  [PLAYER1_CONTROLS.hardDrop]: 'hardDrop',
  [PLAYER1_CONTROLS.hold]: 'hold',
  [PLAYER1_CONTROLS.pause]: 'pause',
};

/** Map from key code to action for player 2 */
const P2_KEY_TO_ACTION: Record<string, ControlAction> = {
  [PLAYER2_CONTROLS.left]: 'left',
  [PLAYER2_CONTROLS.right]: 'right',
  [PLAYER2_CONTROLS.down]: 'down',
  [PLAYER2_CONTROLS.rotate]: 'rotate',
  [PLAYER2_CONTROLS.hardDrop]: 'hardDrop',
  [PLAYER2_CONTROLS.hold]: 'hold',
  [PLAYER2_CONTROLS.pause]: 'pause',
};

/** Set of all player 1 keys */
const P1_KEYS = new Set(Object.values(PLAYER1_CONTROLS));

/** Set of all player 2 keys */
const P2_KEYS = new Set(Object.values(PLAYER2_CONTROLS));

/**
 * Check if a key belongs to player 1
 */
export function isPlayer1Key(keyCode: string): boolean {
  return P1_KEYS.has(keyCode);
}

/**
 * Check if a key belongs to player 2
 */
export function isPlayer2Key(keyCode: string): boolean {
  return P2_KEYS.has(keyCode);
}

/**
 * Check if the game should pause (any player pressed pause)
 */
export function shouldPauseGame(keyCode: string): boolean {
  return keyCode === PLAYER1_CONTROLS.pause || keyCode === PLAYER2_CONTROLS.pause;
}

/**
 * Get action from key code for a specific player
 */
export function getActionForPlayer(playerId: 'p1' | 'p2', keyCode: string): ControlAction | null {
  if (playerId === 'p1') {
    return P1_KEY_TO_ACTION[keyCode] ?? null;
  } else {
    return P2_KEY_TO_ACTION[keyCode] ?? null;
  }
}

/**
 * Determine which player pressed a key
 * Returns player ID and action, or null if not a game key
 */
export function parseKeyPress(keyCode: string): { playerId: 'p1' | 'p2'; action: ControlAction } | null {
  // Check player 1 keys (excluding pause which is handled separately)
  if (keyCode !== PLAYER1_CONTROLS.pause && isPlayer1Key(keyCode)) {
    const action = P1_KEY_TO_ACTION[keyCode];
    if (action) {
      return { playerId: 'p1', action };
    }
  }
  
  // Check player 2 keys (excluding pause which is handled separately)
  if (keyCode !== PLAYER2_CONTROLS.pause && isPlayer2Key(keyCode)) {
    const action = P2_KEY_TO_ACTION[keyCode];
    if (action) {
      return { playerId: 'p2', action };
    }
  }
  
  return null;
}

/**
 * Create local 2-player game config
 */
export function createLocalConfig(): LocalMultiplayerConfig {
  return {
    playerCount: 2,
    player1Controls: 'arrows',
    player2Controls: 'wasd',
  };
}
