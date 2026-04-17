import React from 'react';

interface Props {
  turn: number;
  totalTurns: number;
  ordersIn: number;
  deliveriesOut: number;
  difficulty: 'normal' | 'peak';
}

export const TurnHeader: React.FC<Props> = ({
  turn,
  totalTurns,
  ordersIn,
  deliveriesOut,
  difficulty,
}) => {
  const progress = ((turn - 1) / totalTurns) * 100;
  const turnsLeft = totalTurns - turn + 1;

  return (
    <div className="turn-header">
      <div className="turn-header-top">
        <div className="turn-info">
          <span className="turn-label">Turn</span>
          <span className="turn-number">{turn}</span>
          <span className="turn-of">/ {totalTurns}</span>
          {difficulty === 'peak' && <span className="difficulty-badge">🔥 Peak</span>}
        </div>
        <div className="turn-stats">
          <span className="turn-stat">
            <span className="turn-stat-icon">📥</span>
            {ordersIn} in
          </span>
          <span className="turn-stat">
            <span className="turn-stat-icon">📤</span>
            {deliveriesOut} out
          </span>
          <span className="turn-stat turns-left">
            {turnsLeft} turns left
          </span>
        </div>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};
