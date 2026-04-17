import React from 'react';
import { Decision } from '../types';

interface Props {
  decisions: Decision[];
  onSelect: (decision: Decision) => void;
  disabled?: boolean;
}

export const DecisionPanel: React.FC<Props> = ({ decisions, onSelect, disabled }) => {
  return (
    <div className="decision-panel">
      <h3 className="section-title">Choose your action</h3>
      <div className="decision-grid">
        {decisions.map((d) => (
          <button
            key={d.id}
            className={`decision-btn ${d.id === 'do_nothing' ? 'decision-btn-muted' : ''}`}
            onClick={() => onSelect(d)}
            disabled={disabled}
          >
            <span className="decision-btn-label">{d.label}</span>
            <span className="decision-btn-desc">{d.description}</span>
            <div className="decision-effects">
              {renderDeltaChips(d.immediate)}
              {d.delayed && (
                <span className="effect-chip effect-delayed" title={d.delayed.description}>
                  ⏳ {d.delayed.turns}t
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

function renderDeltaChips(delta: Record<string, number | undefined>) {
  const LABELS: Record<string, string> = {
    backlog: '📦', capacity: '🚴', sla: '⏱', cost: '💸', trust: '🤝', energy: '⚡',
  };
  return Object.entries(delta)
    .filter(([, v]) => v !== undefined && v !== 0)
    .map(([key, val]) => {
      const positive = (val ?? 0) > 0;
      // For backlog and cost, positive = bad; for others, positive = good
      const isBad = (key === 'backlog' || key === 'cost') ? positive : !positive;
      return (
        <span
          key={key}
          className={`effect-chip ${isBad ? 'effect-bad' : 'effect-good'}`}
        >
          {LABELS[key] ?? key} {positive ? `+${val}` : val}
        </span>
      );
    });
}
