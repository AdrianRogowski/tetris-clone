/**
 * React hook for PartyKit WebSocket connection
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import usePartySocket from 'partysocket/react';
import type { ServerMessage, ClientMessage } from '../messages';
import { deserializeServerMessage, serializeClientMessage } from '../messages';
import type { RoomState } from '../roomState';
import { createInitialRoomState, applyServerMessage } from '../roomState';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface UsePartySocketOptions {
  host: string;
  roomCode: string;
  playerName: string;
  onGameStart?: (seed: number) => void;
  onGarbageReceived?: (lines: number, fromId: string) => void;
  onError?: (error: { code: string; message: string }) => void;
}

export interface UsePartySocketResult {
  status: ConnectionStatus;
  roomState: RoomState;
  myPlayerId: string | null;
  
  // Actions
  setReady: (isReady: boolean) => void;
  startGame: () => void;
  sendGarbage: (lines: number, targetMode: 'random' | 'badges' | 'attacker' | 'lowest') => void;
  sendBoardUpdate: (board: unknown, score: number, lines: number, level: number) => void;
  sendEliminated: () => void;
  leave: () => void;
  playAgain: () => void;
}

/**
 * Hook for managing PartyKit connection and room state
 */
export function useMultiplayerSocket(options: UsePartySocketOptions): UsePartySocketResult {
  const { host, roomCode, playerName, onGameStart, onGarbageReceived, onError } = options;
  
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [roomState, setRoomState] = useState<RoomState>(() => ({
    ...createInitialRoomState(),
    roomCode,
  }));
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const hasJoined = useRef(false);

  // PartySocket connection
  const socket = usePartySocket({
    host,
    room: roomCode,
    onOpen() {
      console.log(`[PartyKit] Connected to room: ${roomCode} on host: ${host}`);
      console.log(`[PartyKit] Socket ID: ${socket.id}`);
      setStatus('connected');
      // Send join message
      if (!hasJoined.current) {
        hasJoined.current = true;
        console.log(`[PartyKit] Sending join message for: ${playerName}`);
        socket.send(serializeClientMessage({ type: 'join', playerName }));
      }
    },
    onClose() {
      console.log(`[PartyKit] Disconnected from room: ${roomCode}`);
      setStatus('disconnected');
    },
    onError(error) {
      console.error(`[PartyKit] Error:`, error);
      setStatus('error');
    },
    onMessage(event) {
      console.log(`[PartyKit] Message received:`, event.data);
      const message = deserializeServerMessage(event.data);
      if (!message) {
        console.warn(`[PartyKit] Failed to deserialize message`);
        return;
      }
      console.log(`[PartyKit] Parsed message type: ${message.type}`);

      // Update room state
      setRoomState(prev => {
        const newState = applyServerMessage(prev, message);
        return newState;
      });

      // Handle specific messages
      switch (message.type) {
        case 'roomState':
          console.log(`[PartyKit] Room state received:`, {
            roomCode: message.roomCode,
            hostId: message.hostId,
            playerCount: message.players?.length,
            players: message.players?.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name })),
          });
          // Find our player ID (last joined player is us)
          if (!myPlayerId && message.players.length > 0) {
            // The server sends us the full state after we join
            // Our ID matches the socket's ID
            console.log(`[PartyKit] Setting myPlayerId to socket.id: ${socket.id}`);
            setMyPlayerId(socket.id);
            setRoomState(prev => ({ ...prev, myPlayerId: socket.id }));
          }
          break;
          
        case 'gameStart':
          onGameStart?.(message.seed);
          break;
          
        case 'garbageAttack':
          if (message.toId === myPlayerId) {
            onGarbageReceived?.(message.lines, message.fromId);
          }
          break;
          
        case 'error':
          onError?.({ code: message.code, message: message.message });
          break;
      }
    },
  });

  // Actions
  const send = useCallback((message: ClientMessage) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(serializeClientMessage(message));
    }
  }, [socket]);

  const setReady = useCallback((isReady: boolean) => {
    send({ type: 'ready', isReady });
  }, [send]);

  const startGame = useCallback(() => {
    send({ type: 'start' });
  }, [send]);

  const sendGarbage = useCallback((lines: number, targetMode: 'random' | 'badges' | 'attacker' | 'lowest') => {
    send({ type: 'garbage', lines, targetMode });
  }, [send]);

  const sendBoardUpdate = useCallback((board: unknown, score: number, lines: number, level: number) => {
    send({ type: 'boardUpdate', board: board as ClientMessage['board'], score, lines, level } as ClientMessage);
  }, [send]);

  const sendEliminated = useCallback(() => {
    send({ type: 'eliminated' });
  }, [send]);

  const leave = useCallback(() => {
    send({ type: 'leave' });
    socket.close();
  }, [send, socket]);

  const playAgain = useCallback(() => {
    send({ type: 'playAgain' });
  }, [send]);

  return {
    status,
    roomState,
    myPlayerId,
    setReady,
    startGame,
    sendGarbage,
    sendBoardUpdate,
    sendEliminated,
    leave,
    playAgain,
  };
}

export default useMultiplayerSocket;
