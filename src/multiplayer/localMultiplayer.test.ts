/**
 * Local Multiplayer Tests
 * Tests for same-device multiplayer controls and logic
 */

import { describe, it, expect } from 'vitest';
import {
  parseKeyPress,
  isPlayer1Key,
  isPlayer2Key,
  createLocalConfig,
  shouldPauseGame,
  getActionForPlayer,
  PLAYER1_CONTROLS,
  PLAYER2_CONTROLS,
} from './localMultiplayer';

describe('Local Multiplayer', () => {
  // UT-LMP-001
  describe('Player 1 Controls (Arrow Keys)', () => {
    it('should recognize ArrowLeft as player 1 left', () => {
      expect(isPlayer1Key('ArrowLeft')).toBe(true);
      const result = parseKeyPress('ArrowLeft');
      expect(result).toEqual({ playerId: 'p1', action: 'left' });
    });

    it('should recognize ArrowRight as player 1 right', () => {
      expect(isPlayer1Key('ArrowRight')).toBe(true);
      const result = parseKeyPress('ArrowRight');
      expect(result).toEqual({ playerId: 'p1', action: 'right' });
    });

    it('should recognize ArrowDown as player 1 down', () => {
      expect(isPlayer1Key('ArrowDown')).toBe(true);
      const result = parseKeyPress('ArrowDown');
      expect(result).toEqual({ playerId: 'p1', action: 'down' });
    });

    it('should recognize ArrowUp as player 1 rotate', () => {
      expect(isPlayer1Key('ArrowUp')).toBe(true);
      const result = parseKeyPress('ArrowUp');
      expect(result).toEqual({ playerId: 'p1', action: 'rotate' });
    });

    it('should recognize Space as player 1 hard drop', () => {
      expect(isPlayer1Key(' ')).toBe(true);
      const result = parseKeyPress(' ');
      expect(result).toEqual({ playerId: 'p1', action: 'hardDrop' });
    });

    it('should recognize ShiftLeft as player 1 hold', () => {
      expect(isPlayer1Key('ShiftLeft')).toBe(true);
      const result = parseKeyPress('ShiftLeft');
      expect(result).toEqual({ playerId: 'p1', action: 'hold' });
    });
  });

  // UT-LMP-002
  describe('Player 2 Controls (WASD)', () => {
    it('should recognize KeyA as player 2 left', () => {
      expect(isPlayer2Key('KeyA')).toBe(true);
      const result = parseKeyPress('KeyA');
      expect(result).toEqual({ playerId: 'p2', action: 'left' });
    });

    it('should recognize KeyD as player 2 right', () => {
      expect(isPlayer2Key('KeyD')).toBe(true);
      const result = parseKeyPress('KeyD');
      expect(result).toEqual({ playerId: 'p2', action: 'right' });
    });

    it('should recognize KeyS as player 2 down', () => {
      expect(isPlayer2Key('KeyS')).toBe(true);
      const result = parseKeyPress('KeyS');
      expect(result).toEqual({ playerId: 'p2', action: 'down' });
    });

    it('should recognize KeyW as player 2 rotate', () => {
      expect(isPlayer2Key('KeyW')).toBe(true);
      const result = parseKeyPress('KeyW');
      expect(result).toEqual({ playerId: 'p2', action: 'rotate' });
    });

    it('should recognize KeyX as player 2 hard drop', () => {
      expect(isPlayer2Key('KeyX')).toBe(true);
      const result = parseKeyPress('KeyX');
      expect(result).toEqual({ playerId: 'p2', action: 'hardDrop' });
    });

    it('should recognize KeyE as player 2 hold', () => {
      expect(isPlayer2Key('KeyE')).toBe(true);
      const result = parseKeyPress('KeyE');
      expect(result).toEqual({ playerId: 'p2', action: 'hold' });
    });
  });

  // UT-LMP-003
  describe('parseKeyPress', () => {
    it('should return null for unknown keys', () => {
      expect(parseKeyPress('KeyZ')).toBeNull();
      expect(parseKeyPress('Enter')).toBeNull();
      expect(parseKeyPress('Escape')).toBeNull();
    });

    it('should correctly identify all player 1 keys', () => {
      const p1Keys = Object.values(PLAYER1_CONTROLS);
      p1Keys.forEach(key => {
        if (key !== 'KeyP') { // Pause is shared
          const result = parseKeyPress(key);
          expect(result?.playerId).toBe('p1');
        }
      });
    });

    it('should correctly identify all player 2 keys', () => {
      const p2Keys = Object.values(PLAYER2_CONTROLS);
      p2Keys.forEach(key => {
        if (key !== 'Tab') { // Pause is shared
          const result = parseKeyPress(key);
          expect(result?.playerId).toBe('p2');
        }
      });
    });
  });

  // UT-LMP-004
  describe('shouldPauseGame', () => {
    it('should return true for player 1 pause key', () => {
      expect(shouldPauseGame('KeyP')).toBe(true);
    });

    it('should return true for player 2 pause key', () => {
      expect(shouldPauseGame('Tab')).toBe(true);
    });

    it('should return false for non-pause keys', () => {
      expect(shouldPauseGame('ArrowLeft')).toBe(false);
      expect(shouldPauseGame('KeyA')).toBe(false);
      expect(shouldPauseGame('Enter')).toBe(false);
    });
  });

  // UT-LMP-005
  describe('getActionForPlayer', () => {
    it('should return correct action for player 1', () => {
      expect(getActionForPlayer('p1', 'ArrowLeft')).toBe('left');
      expect(getActionForPlayer('p1', 'ArrowRight')).toBe('right');
      expect(getActionForPlayer('p1', 'ArrowUp')).toBe('rotate');
    });

    it('should return correct action for player 2', () => {
      expect(getActionForPlayer('p2', 'KeyA')).toBe('left');
      expect(getActionForPlayer('p2', 'KeyD')).toBe('right');
      expect(getActionForPlayer('p2', 'KeyW')).toBe('rotate');
    });

    it('should return null for other player keys', () => {
      expect(getActionForPlayer('p1', 'KeyA')).toBeNull();
      expect(getActionForPlayer('p2', 'ArrowLeft')).toBeNull();
    });

    it('should return null for unknown keys', () => {
      expect(getActionForPlayer('p1', 'KeyZ')).toBeNull();
      expect(getActionForPlayer('p2', 'Enter')).toBeNull();
    });
  });

  // UT-LMP-006
  describe('createLocalConfig', () => {
    it('should create config for 2 players', () => {
      const config = createLocalConfig();
      expect(config.playerCount).toBe(2);
    });

    it('should set correct control schemes', () => {
      const config = createLocalConfig();
      expect(config.player1Controls).toBe('arrows');
      expect(config.player2Controls).toBe('wasd');
    });
  });

  // UT-LMP-007
  describe('Key independence', () => {
    it('should not have overlapping keys between players', () => {
      const p1Keys = new Set(Object.values(PLAYER1_CONTROLS));
      const p2Keys = new Set(Object.values(PLAYER2_CONTROLS));
      
      // Remove pause keys which might be different
      p1Keys.delete('KeyP');
      p2Keys.delete('Tab');
      
      // Check no overlap
      p1Keys.forEach(key => {
        expect(p2Keys.has(key)).toBe(false);
      });
    });
  });
});
