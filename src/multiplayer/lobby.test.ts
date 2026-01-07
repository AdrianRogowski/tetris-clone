/**
 * Lobby State Tests
 * Tests for multiplayer lobby management
 */

import { describe, it, expect } from 'vitest';
import {
  generateRoomCode,
  isValidRoomCode,
  createLobby,
  addPlayer,
  removePlayer,
  getNextAvailableColor,
  toggleReady,
  canStartGame,
  isLobbyFull,
  transferHost,
  startCountdown,
  updateCountdown,
  cancelCountdown,
  ROOM_CODE_LENGTH,
  MAX_PLAYERS,
  MIN_PLAYERS,
} from './lobby';

describe('Lobby Management', () => {
  // UT-LBY-001
  describe('generateRoomCode', () => {
    it('should generate code of correct length', () => {
      const code = generateRoomCode();
      expect(code.length).toBe(ROOM_CODE_LENGTH);
    });

    it('should only contain alphanumeric characters', () => {
      const code = generateRoomCode();
      expect(code).toMatch(/^[A-Z0-9]+$/);
    });

    it('should generate unique codes', () => {
      const codes = new Set<string>();
      for (let i = 0; i < 100; i++) {
        codes.add(generateRoomCode());
      }
      // Should have many unique codes
      expect(codes.size).toBeGreaterThan(90);
    });
  });

  // UT-LBY-002
  describe('isValidRoomCode', () => {
    it('should accept valid 6-character alphanumeric codes', () => {
      expect(isValidRoomCode('ABC123')).toBe(true);
      expect(isValidRoomCode('XYZ789')).toBe(true);
    });

    it('should reject codes that are too short', () => {
      expect(isValidRoomCode('ABC12')).toBe(false);
      expect(isValidRoomCode('A')).toBe(false);
    });

    it('should reject codes that are too long', () => {
      expect(isValidRoomCode('ABC1234')).toBe(false);
    });

    it('should reject codes with invalid characters', () => {
      expect(isValidRoomCode('ABC-12')).toBe(false);
      expect(isValidRoomCode('ABC 12')).toBe(false);
      expect(isValidRoomCode('abc123')).toBe(false); // Lowercase
    });

    it('should reject empty string', () => {
      expect(isValidRoomCode('')).toBe(false);
    });
  });

  // UT-LBY-003
  describe('createLobby', () => {
    it('should create lobby with host as first player', () => {
      const lobby = createLobby('host1', 'HostPlayer');
      
      expect(lobby.players.length).toBe(1);
      expect(lobby.players[0].id).toBe('host1');
      expect(lobby.players[0].name).toBe('HostPlayer');
    });

    it('should set host ID correctly', () => {
      const lobby = createLobby('host1', 'HostPlayer');
      expect(lobby.hostId).toBe('host1');
    });

    it('should mark host as host', () => {
      const lobby = createLobby('host1', 'HostPlayer');
      expect(lobby.players[0].isHost).toBe(true);
    });

    it('should generate room code', () => {
      const lobby = createLobby('host1', 'HostPlayer');
      expect(lobby.roomCode.length).toBe(ROOM_CODE_LENGTH);
    });

    it('should set max players to 4', () => {
      const lobby = createLobby('host1', 'HostPlayer');
      expect(lobby.maxPlayers).toBe(MAX_PLAYERS);
    });

    it('should not be starting initially', () => {
      const lobby = createLobby('host1', 'HostPlayer');
      expect(lobby.isStarting).toBe(false);
      expect(lobby.countdown).toBeNull();
    });

    it('should assign first color to host', () => {
      const lobby = createLobby('host1', 'HostPlayer');
      expect(lobby.players[0].color).toBe('cyan');
    });
  });

  // UT-LBY-004
  describe('addPlayer', () => {
    it('should add player to lobby', () => {
      const lobby = createLobby('host1', 'Host');
      const result = addPlayer(lobby, 'player2', 'Guest');
      
      if ('error' in result) throw new Error('Unexpected error');
      expect(result.players.length).toBe(2);
    });

    it('should assign next available color', () => {
      const lobby = createLobby('host1', 'Host');
      const result = addPlayer(lobby, 'player2', 'Guest');
      
      if ('error' in result) throw new Error('Unexpected error');
      expect(result.players[1].color).toBe('green');
    });

    it('should not mark new player as host', () => {
      const lobby = createLobby('host1', 'Host');
      const result = addPlayer(lobby, 'player2', 'Guest');
      
      if ('error' in result) throw new Error('Unexpected error');
      expect(result.players[1].isHost).toBe(false);
    });

    it('should return error when lobby is full', () => {
      let lobby = createLobby('host1', 'Host');
      lobby = addPlayer(lobby, 'p2', 'P2') as typeof lobby;
      lobby = addPlayer(lobby, 'p3', 'P3') as typeof lobby;
      lobby = addPlayer(lobby, 'p4', 'P4') as typeof lobby;
      
      const result = addPlayer(lobby, 'p5', 'P5');
      expect('error' in result).toBe(true);
    });

    it('should return error when player ID already exists', () => {
      const lobby = createLobby('host1', 'Host');
      const result = addPlayer(lobby, 'host1', 'Duplicate');
      
      expect('error' in result).toBe(true);
    });
  });

  // UT-LBY-005
  describe('removePlayer', () => {
    it('should remove player from lobby', () => {
      let lobby = createLobby('host1', 'Host');
      lobby = addPlayer(lobby, 'player2', 'Guest') as typeof lobby;
      lobby = removePlayer(lobby, 'player2');
      
      expect(lobby.players.length).toBe(1);
    });

    it('should transfer host when host leaves', () => {
      let lobby = createLobby('host1', 'Host');
      lobby = addPlayer(lobby, 'player2', 'Guest') as typeof lobby;
      lobby = removePlayer(lobby, 'host1');
      
      expect(lobby.hostId).toBe('player2');
      expect(lobby.players[0].isHost).toBe(true);
    });

    it('should handle removing non-existent player gracefully', () => {
      const lobby = createLobby('host1', 'Host');
      const result = removePlayer(lobby, 'nonexistent');
      
      expect(result.players.length).toBe(1);
    });
  });

  // UT-LBY-006
  describe('getNextAvailableColor', () => {
    it('should return first color for empty lobby', () => {
      const lobby = createLobby('host1', 'Host');
      // Host already has cyan, so next should be green
      expect(getNextAvailableColor(lobby)).toBe('green');
    });

    it('should skip taken colors', () => {
      let lobby = createLobby('host1', 'Host'); // cyan
      lobby = addPlayer(lobby, 'p2', 'P2') as typeof lobby; // green
      
      expect(getNextAvailableColor(lobby)).toBe('orange');
    });
  });

  // UT-LBY-007
  describe('toggleReady', () => {
    it('should toggle ready state to true', () => {
      let lobby = createLobby('host1', 'Host');
      lobby.players[0].isReady = false;
      
      lobby = toggleReady(lobby, 'host1');
      expect(lobby.players[0].isReady).toBe(true);
    });

    it('should toggle ready state to false', () => {
      let lobby = createLobby('host1', 'Host');
      lobby.players[0].isReady = true;
      
      lobby = toggleReady(lobby, 'host1');
      expect(lobby.players[0].isReady).toBe(false);
    });
  });

  // UT-LBY-008
  describe('canStartGame', () => {
    it('should return false with only 1 player', () => {
      const lobby = createLobby('host1', 'Host');
      expect(canStartGame(lobby)).toBe(false);
    });

    it('should return true with 2+ ready players', () => {
      let lobby = createLobby('host1', 'Host');
      lobby.players[0].isReady = true;
      lobby = addPlayer(lobby, 'p2', 'P2') as typeof lobby;
      lobby.players[1].isReady = true;
      
      expect(canStartGame(lobby)).toBe(true);
    });

    it('should return false if not all players ready', () => {
      let lobby = createLobby('host1', 'Host');
      lobby.players[0].isReady = true;
      lobby = addPlayer(lobby, 'p2', 'P2') as typeof lobby;
      lobby.players[1].isReady = false;
      
      expect(canStartGame(lobby)).toBe(false);
    });
  });

  // UT-LBY-009
  describe('isLobbyFull', () => {
    it('should return false when under max players', () => {
      const lobby = createLobby('host1', 'Host');
      expect(isLobbyFull(lobby)).toBe(false);
    });

    it('should return true when at max players', () => {
      let lobby = createLobby('host1', 'Host');
      lobby = addPlayer(lobby, 'p2', 'P2') as typeof lobby;
      lobby = addPlayer(lobby, 'p3', 'P3') as typeof lobby;
      lobby = addPlayer(lobby, 'p4', 'P4') as typeof lobby;
      
      expect(isLobbyFull(lobby)).toBe(true);
    });
  });

  // UT-LBY-010
  describe('transferHost', () => {
    it('should change host ID', () => {
      let lobby = createLobby('host1', 'Host');
      lobby = addPlayer(lobby, 'p2', 'P2') as typeof lobby;
      lobby = transferHost(lobby, 'p2');
      
      expect(lobby.hostId).toBe('p2');
    });

    it('should update isHost flags on players', () => {
      let lobby = createLobby('host1', 'Host');
      lobby = addPlayer(lobby, 'p2', 'P2') as typeof lobby;
      lobby = transferHost(lobby, 'p2');
      
      const oldHost = lobby.players.find(p => p.id === 'host1');
      const newHost = lobby.players.find(p => p.id === 'p2');
      
      expect(oldHost?.isHost).toBe(false);
      expect(newHost?.isHost).toBe(true);
    });
  });

  // UT-LBY-011
  describe('Countdown management', () => {
    it('should start countdown', () => {
      let lobby = createLobby('host1', 'Host');
      lobby = addPlayer(lobby, 'p2', 'P2') as typeof lobby;
      lobby.players.forEach(p => p.isReady = true);
      
      lobby = startCountdown(lobby);
      expect(lobby.isStarting).toBe(true);
      expect(lobby.countdown).toBe(3);
    });

    it('should update countdown', () => {
      let lobby = createLobby('host1', 'Host');
      lobby = startCountdown(lobby);
      lobby = updateCountdown(lobby, 2);
      
      expect(lobby.countdown).toBe(2);
    });

    it('should cancel countdown', () => {
      let lobby = createLobby('host1', 'Host');
      lobby = startCountdown(lobby);
      lobby = cancelCountdown(lobby);
      
      expect(lobby.isStarting).toBe(false);
      expect(lobby.countdown).toBeNull();
    });
  });
});
