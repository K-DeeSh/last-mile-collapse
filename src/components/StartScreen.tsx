import React, { useState, useEffect } from 'react';
import { fetchLeaderboard, type LeaderboardEntry } from '../api';

interface Props {
  onStart: (difficulty: 'normal' | 'peak') => void;
  highScore: number | null;
  login: string;
}

export const StartScreen: React.FC<Props> = ({ onStart, highScore, login }) => {
  const [difficulty, setDifficulty] = useState<'normal' | 'peak'>('normal');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetchLeaderboard(10).then(setLeaderboard);
  }, []);

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

        {login && (
          <p style={{ color: '#7c3aed', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Привет, <strong>{login}</strong>!
          </p>
        )}

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

        {leaderboard.length > 0 && (
          <div style={{ margin: '1rem 0', textAlign: 'left' }}>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              🌐 Глобальный топ
            </div>
            {leaderboard.slice(0, 5).map((entry, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                fontSize: '0.85rem',
                padding: '2px 0',
                color: entry.login === login ? '#7c3aed' : '#d1d5db',
                fontWeight: entry.login === login ? 700 : 400,
              }}>
                <span style={{ color: '#6b7280', width: '1.2rem', textAlign: 'right' }}>{i + 1}.</span>
                <span style={{ color: '#7c3aed', fontWeight: 700, minWidth: '3.5rem' }}>{entry.score}</span>
                <span>{entry.login}{entry.archetype ? ` — ${entry.archetype}` : ''}</span>
              </div>
            ))}
          </div>
        )}

        {leaderboard.length === 0 && highScore !== null && (
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
