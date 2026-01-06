import type { ReactNode } from 'react';

interface OverlayProps {
  children: ReactNode;
  variant?: 'pause' | 'gameOver' | 'modal';
}

export function Overlay({ children, variant = 'modal' }: OverlayProps) {
  const bgOpacity = variant === 'gameOver' ? 0.85 : 0.7;
  
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 animate-slide-in"
      style={{ 
        background: `rgba(10, 10, 15, ${bgOpacity})`,
        backdropFilter: variant === 'gameOver' ? 'grayscale(50%)' : 'blur(2px)',
      }}
    >
      <div 
        className="panel animate-scale-in p-8 text-center"
        style={{ 
          minWidth: 300,
          boxShadow: '0 0 60px rgba(0, 0, 0, 0.8)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-12" style={{ background: 'var(--color-void)' }}>
      <div className="text-center">
        <h1 
          className="font-display text-4xl mb-4 text-glow animate-pulse"
          style={{ color: 'var(--color-accent-primary)' }}
        >
          TETRIS
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          A Classic Arcade Game
        </p>
      </div>
      
      <div className="flex flex-col gap-4">
        <button className="btn btn-primary" onClick={onStart}>
          Start Game
        </button>
      </div>
      
      <div className="text-center text-xs" style={{ color: 'var(--color-text-dim)' }}>
        <p className="animate-blink">Press ENTER to start</p>
      </div>
      
      <div 
        className="absolute bottom-8 text-xs text-center"
        style={{ color: 'var(--color-text-dim)' }}
      >
        <p>← → Move | ↑ Rotate | ↓ Soft Drop | Space Hard Drop</p>
        <p className="mt-1">Shift Hold | P Pause</p>
      </div>
    </div>
  );
}

interface PauseScreenProps {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

export function PauseScreen({ onResume, onRestart, onQuit }: PauseScreenProps) {
  return (
    <Overlay variant="pause">
      <h2 
        className="font-display text-2xl mb-8"
        style={{ color: 'var(--color-text-primary)' }}
      >
        PAUSED
      </h2>
      
      <div className="flex flex-col gap-3">
        <button className="btn btn-primary" onClick={onResume}>
          Resume
        </button>
        <button className="btn btn-secondary" onClick={onRestart}>
          Restart
        </button>
        <button className="btn btn-secondary" onClick={onQuit}>
          Quit
        </button>
      </div>
    </Overlay>
  );
}

interface GameOverScreenProps {
  score: number;
  level: number;
  lines: number;
  onRestart: () => void;
  onQuit: () => void;
}

export function GameOverScreen({ score, level, lines, onRestart, onQuit }: GameOverScreenProps) {
  return (
    <Overlay variant="gameOver">
      <h2 
        className="font-display text-3xl mb-2"
        style={{ color: 'var(--color-accent-secondary)' }}
      >
        GAME OVER
      </h2>
      
      <div className="my-8">
        <div className="panel-title">Final Score</div>
        <div 
          className="font-display text-2xl text-glow mb-4"
          style={{ color: 'var(--color-accent-gold)' }}
        >
          {score.toLocaleString()}
        </div>
        
        <div className="flex justify-center gap-8 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          <div>
            <span className="panel-title">Level</span>
            <div className="font-display text-lg">{level}</div>
          </div>
          <div>
            <span className="panel-title">Lines</span>
            <div className="font-display text-lg">{lines}</div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <button className="btn btn-primary" onClick={onRestart}>
          Play Again
        </button>
        <button className="btn btn-secondary" onClick={onQuit}>
          Main Menu
        </button>
      </div>
    </Overlay>
  );
}
