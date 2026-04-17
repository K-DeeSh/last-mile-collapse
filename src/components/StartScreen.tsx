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
          Ты — последняя миля. Заказы прибывают потоком. Курьеров не хватает.
          SLA горит. Бизнес хочет дешевле и быстрее.<br />
          <em>Переживи квартал.</em>
        </p>

        <div className="difficulty-select">
          <button
            className={`diff-btn ${difficulty === 'normal' ? 'diff-active' : ''}`}
            onClick={() => setDifficulty('normal')}
          >
            <span className="diff-label">Обычный</span>
            <span className="diff-desc">Просто плохой квартал</span>
          </button>
          <button
            className={`diff-btn ${difficulty === 'peak' ? 'diff-active' : ''}`}
            onClick={() => setDifficulty('peak')}
          >
            <span className="diff-label">Пиковый сезон 🔥</span>
            <span className="diff-desc">Всё горит с первого хода</span>
          </button>
        </div>

        <div className="start-tips">
          <p>🎯 <strong>40 ходов</strong>, чтобы пережить квартал</p>
          <p>⚠️ У каждого решения есть <strong>последствия</strong></p>
          <p>⏳ Некоторые эффекты срабатывают <strong>через несколько ходов</strong></p>
        </div>

        {highScore !== null && (
          <div className="high-score-badge">
            🏆 Лучший результат: <strong>{highScore}</strong>
          </div>
        )}

        <button className="start-btn" onClick={() => onStart(difficulty)}>
          Начать квартал →
        </button>
      </div>
    </div>
  );
};
