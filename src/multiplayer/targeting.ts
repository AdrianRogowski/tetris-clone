/**
 * Target selection logic for garbage attacks
 */

import type { TargetMode, PlayerId, PlayerGameState } from './types';

/**
 * Get all valid targets (living players excluding attacker)
 */
export function getValidTargets(
  attackerId: PlayerId,
  players: PlayerGameState[]
): PlayerGameState[] {
  return players.filter(
    p => p.playerId !== attackerId && p.state !== 'eliminated'
  );
}

/**
 * Select random target from valid targets
 */
export function selectRandomTarget(validTargets: PlayerGameState[]): PlayerId | null {
  if (validTargets.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * validTargets.length);
  return validTargets[randomIndex].playerId;
}

/**
 * Select target with most knockouts (badges)
 */
export function selectBadgesTarget(validTargets: PlayerGameState[]): PlayerId | null {
  if (validTargets.length === 0) return null;
  
  // Find player with highest knockouts
  let maxKOs = -1;
  let target: PlayerId | null = null;
  
  for (const player of validTargets) {
    if (player.knockouts > maxKOs) {
      maxKOs = player.knockouts;
      target = player.playerId;
    }
  }
  
  return target;
}

/**
 * Select target with lowest score
 */
export function selectLowestTarget(validTargets: PlayerGameState[]): PlayerId | null {
  if (validTargets.length === 0) return null;
  
  let minScore = Infinity;
  let target: PlayerId | null = null;
  
  for (const player of validTargets) {
    if (player.score < minScore) {
      minScore = player.score;
      target = player.playerId;
    }
  }
  
  return target;
}

/**
 * Select the player who last attacked you
 */
export function selectAttackerTarget(
  validTargets: PlayerGameState[],
  lastAttacker: PlayerId | null
): PlayerId | null {
  if (!lastAttacker) return null;
  
  const found = validTargets.find(p => p.playerId === lastAttacker);
  return found ? found.playerId : null;
}

/**
 * Select target player based on targeting mode
 * Returns the player ID to send garbage to
 */
export function selectTarget(
  mode: TargetMode,
  attackerId: PlayerId,
  players: PlayerGameState[],
  lastAttacker: PlayerId | null
): PlayerId | null {
  const validTargets = getValidTargets(attackerId, players);
  
  if (validTargets.length === 0) return null;
  
  switch (mode) {
    case 'random':
      return selectRandomTarget(validTargets);
    
    case 'badges':
      return selectBadgesTarget(validTargets);
    
    case 'lowest':
      return selectLowestTarget(validTargets);
    
    case 'attacker': {
      const attackerTarget = selectAttackerTarget(validTargets, lastAttacker);
      // Fall back to random if attacker not valid
      return attackerTarget ?? selectRandomTarget(validTargets);
    }
    
    default:
      return selectRandomTarget(validTargets);
  }
}
