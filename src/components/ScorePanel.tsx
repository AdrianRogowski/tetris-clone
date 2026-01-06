interface ScorePanelProps {
  score: number;
  level: number;
  lines: number;
}

function formatScore(score: number): string {
  return score.toLocaleString();
}

export function ScorePanel({ score, level, lines }: ScorePanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="panel">
        <div className="panel-title">Score</div>
        <div 
          className="font-display text-xl text-glow"
          style={{ color: 'var(--color-accent-primary)' }}
        >
          {formatScore(score)}
        </div>
      </div>
      
      <div className="panel">
        <div className="panel-title">Level</div>
        <div 
          className="font-display text-2xl"
          style={{ color: 'var(--color-accent-gold)' }}
        >
          {level}
        </div>
      </div>
      
      <div className="panel">
        <div className="panel-title">Lines</div>
        <div 
          className="font-display text-lg"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {lines}
        </div>
      </div>
    </div>
  );
}
