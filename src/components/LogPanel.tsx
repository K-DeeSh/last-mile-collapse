import React from 'react';
import { LogEntry } from '../types';

interface Props {
  log: LogEntry[];
  currentTurn: number;
}

const TYPE_ICONS: Record<LogEntry['type'], string> = {
  event: '⚡',
  decision: '🎯',
  delayed: '⏳',
  system: '📋',
  warning: '⚠️',
};

export const LogPanel: React.FC<Props> = ({ log, currentTurn }) => {
  const recent = log.slice(0, 8);

  return (
    <div className="log-panel">
      <h3 className="section-title">Последние события</h3>
      <div className="log-entries">
        {recent.map((entry, i) => (
          <div key={i} className={`log-entry log-${entry.type}`}>
            <span className="log-icon">{TYPE_ICONS[entry.type]}</span>
            <span className="log-turn">Х{entry.turn}</span>
            <span className="log-text">{entry.text}</span>
          </div>
        ))}
        {recent.length === 0 && (
          <div className="log-empty">Пока ничего не произошло.</div>
        )}
      </div>
    </div>
  );
};
