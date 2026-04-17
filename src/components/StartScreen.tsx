import React, { useState } from 'react';

interface Props {
  onStart: (difficulty: 'normal' | 'peak') => void;
  highScore: number | null;
}

export const StartScreen: React.FC<Props> = ({ onStart, highScore }) => {
  const [difficulty, setDifficulty] = useState<'normal' | 'peak'>('normal');

  return (
    <div className="start-screen">
      <div className="start-card">
        <div className="start-logo">📦</div>
        <h1 className="start-title">Last Mile<br />Collapse</h1>
        <p className="start-subtitle">
          You are the last mile. Orders flood in. Couriers are limited.
          SLA is burning. Business wants it cheaper and faster.<br />
          <em>Survive the quarter.</em>
        </p>

        <div className="difficulty-select">
          <button
            className={`diff-btn ${difficulty === 'normal' ? 'diff-active' : ''}`}
            onClick={() => setDifficulty('normal')}
          >
            <span className="diff-label">Normal</span>
            <span className="diff-desc">A regular bad quarter</span>
          </button>
          <button
            className={`diff-btn ${difficulty === 'peak' ? 'diff-active' : ''}`}
            onClick={() => setDifficulty('peak')}
          >
            <span className="diff-label">Peak Season 🔥</span>
            <span className="diff-desc">Everything on fire from turn 1</span>
          </button>
        </div>

        <div className="start-tips">
          <p>🎯 <strong>40 turns</strong> to survive the quarter</p>
          <p>⚠️ Every decision has <strong>trade-offs</strong></p>
          <p>⏳ Some effects kick in <strong>later</strong></p>
        </div>

        {highScore !== null && (
          <div className="high-score-badge">
            🏆 Best score: <strong>{highScore}</strong>
          </div>
        )}

        <button className="start-btn" onClick={() => onStart(difficulty)}>
          Start Quarter →
        </button>
      </div>
    </div>
  );
};
