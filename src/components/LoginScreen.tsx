import React, { useState } from 'react';

const LOGIN_KEY = 'player_login';

export function getSavedLogin(): string {
  return localStorage.getItem(LOGIN_KEY) ?? '';
}

function saveLogin(login: string) {
  localStorage.setItem(LOGIN_KEY, login);
}

interface Props {
  onLogin: (login: string) => void;
}

export const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError('Введи логин');
      return;
    }
    saveLogin(trimmed);
    onLogin(trimmed);
  }

  return (
    <div className="start-screen">
      <div className="start-card">
        <div className="start-logo">📦</div>
        <h1 className="start-title">Last Mile<br />Collapse</h1>
        <p className="start-subtitle">
          Ты — последняя миля. <em>Как тебя зовут?</em>
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={value}
            onChange={e => { setValue(e.target.value); setError(''); }}
            placeholder="Логин..."
            maxLength={32}
            autoFocus
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: '#0d1117',
              border: error ? '2px solid #ef4444' : '2px solid #21262d',
              borderRadius: 8,
              color: '#e6edf3',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: error ? '0.25rem' : '0.75rem',
            }}
          />
          {error && (
            <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{error}</p>
          )}
          <button type="submit" className="start-btn" style={{ width: '100%' }}>
            Войти →
          </button>
        </form>
      </div>
    </div>
  );
};
