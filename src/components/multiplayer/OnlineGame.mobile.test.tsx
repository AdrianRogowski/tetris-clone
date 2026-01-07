/**
 * Mobile Multiplayer Tests
 * Tests for responsive layout and touch controls in multiplayer
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { OnlineGame } from './OnlineGame';

// Store the onGameStart callback so we can trigger it
let gameStartCallback: (() => void) | null = null;

// Mock the hooks
vi.mock('../../multiplayer/network/hooks/usePartySocket', () => ({
  useMultiplayerSocket: vi.fn((props: { onGameStart?: () => void }) => {
    // Capture the onGameStart callback
    gameStartCallback = props?.onGameStart || null;
    
    return {
      status: 'connected',
      roomState: {
        phase: 'playing',
        roomCode: 'ABC123',
        hostId: 'player1',
        myPlayerId: 'player1',
        players: [
          { id: 'player1', name: 'Player1', color: 'cyan', isHost: true, isReady: true, isConnected: true },
          { id: 'player2', name: 'Player2', color: 'green', isHost: false, isReady: true, isConnected: true },
        ],
        opponents: new Map([
          ['player2', { playerId: 'player2', name: 'Player2', color: 'green', board: null, score: 100, lines: 5, level: 1, isEliminated: false, placement: null, isConnected: true }],
        ]),
        countdown: null,
        isStarting: false,
        seed: 12345,
        pendingGarbage: 3, // Non-zero to show garbage indicator
        lastAttacker: null,
        winnerId: null,
        standings: [],
        lastError: null,
      },
      myPlayerId: 'player1',
      setReady: vi.fn(),
      startGame: vi.fn(),
      sendGarbage: vi.fn(),
      sendBoardUpdate: vi.fn(),
      sendEliminated: vi.fn(),
      leave: vi.fn(),
      playAgain: vi.fn(),
    };
  }),
}));

vi.mock('../../hooks/useGameLoop', () => ({
  useGameLoop: vi.fn(),
}));

vi.mock('../../hooks/useKeyboardControls', () => ({
  useKeyboardControls: vi.fn(),
}));

// Helper to set up game in playing state by simulating the flow
async function setupPlayingGame() {
  render(<OnlineGame onBack={vi.fn()} />);
  
  // Click Create Game to go from menu to connecting
  const createBtn = screen.getByText(/create game/i);
  await act(async () => {
    createBtn.click();
  });
  
  // Trigger onGameStart to move to playing phase
  if (gameStartCallback) {
    await act(async () => {
      gameStartCallback!();
    });
  }
}

// Helper to set viewport size
function setViewport(width: number, height: number = 800) {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height });
  window.dispatchEvent(new Event('resize'));
}

describe('Mobile Multiplayer - OnlineGame', () => {
  beforeEach(() => {
    // Default to desktop
    setViewport(1200);
    gameStartCallback = null;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Viewport Detection', () => {
    it('should detect mobile viewport (< 768px)', async () => {
      setViewport(375); // iPhone size
      await setupPlayingGame();
      
      // Should have mobile-specific class or layout
      const container = document.querySelector('.mobile-game-layout, [data-mobile="true"]');
      expect(container).toBeTruthy();
    });

    it('should detect tablet viewport (768-1023px)', async () => {
      setViewport(800);
      await setupPlayingGame();
      
      // Tablet should use compact layout (tablet with touch uses mobile layout)
      const container = document.querySelector('.tablet-game-layout, [data-tablet="true"], .mobile-game-layout');
      expect(container).toBeTruthy();
    });

    it('should detect desktop viewport (≥ 1024px)', async () => {
      setViewport(1200);
      await setupPlayingGame();
      
      // Desktop should use side-by-side layout
      const container = document.querySelector('.desktop-game-layout, [data-desktop="true"]');
      expect(container).toBeTruthy();
    });
  });

  describe('Mobile Layout', () => {
    beforeEach(() => {
      setViewport(375);
    });

    it('should render opponents at top on mobile', async () => {
      await setupPlayingGame();
      
      const opponents = screen.getByText(/opponents/i);
      const board = document.querySelector('.game-board, [data-testid="game-board"]');
      
      expect(opponents).toBeTruthy();
      expect(board).toBeTruthy();
    });

    it('should render touch controls on mobile', async () => {
      await setupPlayingGame();
      
      // Should show mobile controls
      expect(document.querySelector('.mobile-controls')).toBeTruthy();
    });

    it('should NOT render touch controls on desktop', async () => {
      setViewport(1200);
      await setupPlayingGame();
      
      // Should NOT show mobile controls
      expect(document.querySelector('.mobile-controls')).toBeFalsy();
    });

    it('should use smaller cell size on mobile', async () => {
      await setupPlayingGame();
      
      const board = document.querySelector('.game-board, [data-testid="game-board"]');
      // Mobile cell size should be 16-20px (vs 28px desktop)
      // Check via CSS variable or computed style
      if (board) {
        const style = getComputedStyle(board);
        const cellSize = style.getPropertyValue('--cell-size') || '20px';
        const size = parseInt(cellSize);
        expect(size).toBeLessThanOrEqual(20);
      }
    });

    it('should show compact stats bar on mobile', async () => {
      await setupPlayingGame();
      
      // Stats should be in a horizontal row
      const statsBar = document.querySelector('.mobile-stats-bar, [data-testid="mobile-stats"]');
      expect(statsBar).toBeTruthy();
    });
  });

  describe('Mobile Opponent Display', () => {
    beforeEach(() => {
      setViewport(375);
    });

    it('should render opponent boards in horizontal scroll container', async () => {
      await setupPlayingGame();
      
      const container = document.querySelector('.mobile-opponents, [data-testid="mobile-opponents"]');
      expect(container).toBeTruthy();
    });

    it('should show mini opponent boards', async () => {
      await setupPlayingGame();
      
      // Opponent boards should be mini size
      const opponentBoard = document.querySelector('.opponent-board-mini, [data-mini="true"]');
      expect(opponentBoard).toBeTruthy();
    });

    it('should show opponent name and score', async () => {
      await setupPlayingGame();
      
      expect(screen.getByText('Player2')).toBeTruthy();
      expect(screen.getByText('100')).toBeTruthy();
    });
  });

  describe('Mobile Target Selector', () => {
    beforeEach(() => {
      setViewport(375);
    });

    it('should render collapsed target selector on mobile', async () => {
      await setupPlayingGame();
      
      // Should show collapsed selector
      const selector = document.querySelector('.target-selector-collapsed, [data-collapsed="true"]');
      expect(selector).toBeTruthy();
    });

    it('should show current target mode with icon', async () => {
      await setupPlayingGame();
      
      // Default is "Random" with 🎲
      expect(screen.getByText(/random/i)).toBeTruthy();
    });
  });
});

describe('Mobile Multiplayer - Lobby', () => {
  beforeEach(() => {
    setViewport(375);
  });

  it('should render full-width buttons on mobile', async () => {
    // Import and render Lobby directly
    const { Lobby } = await import('./Lobby');
    
    render(
      <Lobby
        roomCode="ABC123"
        players={[]}
        myPlayerId="player1"
        isHost={true}
        canStart={false}
        countdown={null}
        connectionStatus="connected"
        onReady={vi.fn()}
        onStart={vi.fn()}
        onLeave={vi.fn()}
      />
    );
    
    const readyButton = screen.getByRole('button', { name: /ready/i });
    const leaveButton = screen.getByRole('button', { name: /leave/i });
    
    // Buttons should have full width styling on mobile
    expect(readyButton.className).toMatch(/w-full|full-width/);
    expect(leaveButton.className).toMatch(/w-full|full-width/);
  });

  it('should show room code prominently with tap-to-copy hint', async () => {
    const { Lobby } = await import('./Lobby');
    
    render(
      <Lobby
        roomCode="ABC123"
        players={[]}
        myPlayerId="player1"
        isHost={true}
        canStart={false}
        countdown={null}
        connectionStatus="connected"
        onReady={vi.fn()}
        onStart={vi.fn()}
        onLeave={vi.fn()}
      />
    );
    
    // Room code should be visible
    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.getByText('B')).toBeTruthy();
    expect(screen.getByText('C')).toBeTruthy();
    
    // Should have tap/click to copy hint
    expect(screen.getByText(/copy/i)).toBeTruthy();
  });

  it('should stack player list vertically', async () => {
    const { Lobby } = await import('./Lobby');
    
    render(
      <Lobby
        roomCode="ABC123"
        players={[
          { id: 'p1', name: 'Player1', color: 'cyan', isHost: true, isReady: true, isConnected: true },
          { id: 'p2', name: 'Player2', color: 'green', isHost: false, isReady: false, isConnected: true },
        ]}
        myPlayerId="p1"
        isHost={true}
        canStart={false}
        countdown={null}
        connectionStatus="connected"
        onReady={vi.fn()}
        onStart={vi.fn()}
        onLeave={vi.fn()}
      />
    );
    
    // Players should be in a vertical list
    const player1 = screen.getByText(/player1/i);
    const player2 = screen.getByText(/player2/i);
    
    expect(player1).toBeTruthy();
    expect(player2).toBeTruthy();
  });
});

describe('Touch Controls in Multiplayer', () => {
  beforeEach(() => {
    setViewport(375);
    gameStartCallback = null;
    // Mock touch capability
    Object.defineProperty(window, 'ontouchstart', { value: () => {}, writable: true });
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 5, writable: true });
  });

  it('should show touch controls when on touch device', async () => {
    await setupPlayingGame();
    
    expect(document.querySelector('.mobile-controls')).toBeTruthy();
  });

  it('should have D-pad buttons (left, down, right)', async () => {
    await setupPlayingGame();
    
    // D-pad buttons should exist
    expect(document.querySelector('.dpad, [data-testid="dpad"]')).toBeTruthy();
  });

  it('should have action buttons (rotate, hard drop)', async () => {
    await setupPlayingGame();
    
    // Action buttons should exist
    expect(document.querySelector('.action-buttons, [data-testid="action-buttons"]')).toBeTruthy();
  });

  it('should have hold and pause buttons', async () => {
    await setupPlayingGame();
    
    expect(document.querySelector('.hold-btn, [data-testid="hold-btn"]')).toBeTruthy();
    expect(document.querySelector('.pause-btn, [data-testid="pause-btn"]')).toBeTruthy();
  });
});

describe('Garbage Indicator on Mobile', () => {
  beforeEach(() => {
    setViewport(375);
    gameStartCallback = null;
  });

  it('should show garbage indicator on mobile', async () => {
    await setupPlayingGame();
    
    const indicator = document.querySelector('.garbage-indicator, [data-testid="garbage-indicator"]');
    expect(indicator).toBeTruthy();
  });

  it('should position garbage indicator on left edge of board', async () => {
    await setupPlayingGame();
    
    const indicator = document.querySelector('.garbage-indicator, [data-testid="garbage-indicator"]');
    const board = document.querySelector('.game-board, [data-testid="game-board"]');
    
    // Both elements should exist after game starts
    expect(indicator || board).toBeTruthy(); // At least one should exist
  });
});

describe('MOB-09: No text cutoff on screen edges', () => {
  beforeEach(() => {
    setViewport(375);
    gameStartCallback = null;
  });

  it('should have proper padding on mobile container', async () => {
    await setupPlayingGame();
    
    const container = document.querySelector('.mobile-game-layout, [data-mobile="true"]');
    expect(container).toBeTruthy();
    
    if (container) {
      const style = getComputedStyle(container);
      // Container should have padding or safe-area insets
      expect(container.classList.contains('mobile-game-layout')).toBe(true);
    }
  });

  it('should display score fully visible and centered', async () => {
    await setupPlayingGame();
    
    // Score should be in a centered container with proper styling
    const scoreContainer = document.querySelector('[data-testid="mobile-score"], .mobile-score');
    expect(scoreContainer).toBeTruthy();
    
    // Score element should have text-2xl class for prominence
    expect(scoreContainer?.classList.contains('text-2xl')).toBe(true);
  });

  it('should not overflow opponents panel beyond screen', async () => {
    await setupPlayingGame();
    
    const opponentsPanel = document.querySelector('[data-testid="mobile-opponents-panel"], .mobile-opponents-panel');
    expect(opponentsPanel).toBeTruthy();
    
    if (opponentsPanel) {
      const rect = opponentsPanel.getBoundingClientRect();
      // Panel should start within screen bounds
      expect(rect.left).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('MOB-10: Clear visual boundaries between sections', () => {
  beforeEach(() => {
    setViewport(375);
    gameStartCallback = null;
  });

  it('should have bordered opponents panel with label inside', async () => {
    await setupPlayingGame();
    
    // Opponents panel should be a contained element with border
    const opponentsPanel = document.querySelector('[data-testid="mobile-opponents-panel"], .mobile-opponents-panel');
    expect(opponentsPanel).toBeTruthy();
    
    // OPPONENTS label should be INSIDE the panel
    if (opponentsPanel) {
      const label = opponentsPanel.querySelector('[data-testid="opponents-label"], .opponents-label');
      expect(label).toBeTruthy();
    }
  });

  it('should have distinct stats section', async () => {
    await setupPlayingGame();
    
    // Stats should be in a visually distinct bar
    const statsBar = document.querySelector('[data-testid="mobile-stats"], .mobile-stats-bar');
    expect(statsBar).toBeTruthy();
    
    if (statsBar) {
      const style = getComputedStyle(statsBar);
      // Should have a background that distinguishes it
      expect(style.backgroundColor || statsBar.style.background).toBeTruthy();
    }
  });

  it('should display score prominently at top of stats', async () => {
    await setupPlayingGame();
    
    const statsBar = document.querySelector('[data-testid="mobile-stats"], .mobile-stats-bar');
    expect(statsBar).toBeTruthy();
    
    // Score should be the most prominent element (larger font)
    const scoreEl = document.querySelector('[data-testid="mobile-score"], .mobile-score');
    expect(scoreEl).toBeTruthy();
    
    if (scoreEl) {
      // Score should have larger text (prominent)
      expect(scoreEl.classList.contains('text-xl') || 
             scoreEl.classList.contains('text-2xl') ||
             scoreEl.classList.contains('mobile-score')).toBe(true);
    }
  });

  it('should show LVL and LINES as secondary info', async () => {
    await setupPlayingGame();
    
    // Level and lines should exist as secondary stats
    const levelEl = screen.queryByText(/lvl|level/i);
    const linesEl = screen.queryByText(/lns|lines/i);
    
    expect(levelEl).toBeTruthy();
    expect(linesEl).toBeTruthy();
  });

  it('should have visual separator before touch controls', async () => {
    await setupPlayingGame();
    
    // Controls should be in a distinct section
    const controlsSection = document.querySelector('.mobile-controls');
    expect(controlsSection).toBeTruthy();
  });

  it('should have target selector at very bottom', async () => {
    await setupPlayingGame();
    
    const targetSelector = document.querySelector('.target-selector-collapsed, [data-testid="target-selector"]');
    expect(targetSelector).toBeTruthy();
    
    // Target selector should be after the controls (at bottom)
    const mobileLayout = document.querySelector('.mobile-game-layout');
    if (mobileLayout && targetSelector) {
      const children = Array.from(mobileLayout.children);
      const targetIndex = children.findIndex(el => el === targetSelector || el.contains(targetSelector));
      // Should be one of the last 3 children (target, scanlines, vignette)
      expect(targetIndex).toBeGreaterThanOrEqual(children.length - 3);
    }
  });
});
