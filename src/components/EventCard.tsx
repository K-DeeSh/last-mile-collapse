import React from 'react';
import { GameEvent } from '../types';

interface Props {
  event: GameEvent;
  onContinue: () => void;    // for auto events
  onChoice?: (index: number) => void;  // for choice events
}

export const EventCard: React.FC<Props> = ({ event, onContinue, onChoice }) => {
  const hasChoices = event.choices && event.choices.length > 0;

  return (
    <div className="event-overlay">
      <div className="event-card">
        <div className="event-badge">⚡ Event</div>
        <h2 className="event-title">{event.title}</h2>
        <p className="event-description">{event.description}</p>

        {hasChoices && event.choices ? (
          <div className="event-choices">
            {event.choices.map((choice, i) => (
              <button
                key={i}
                className="event-choice-btn"
                onClick={() => onChoice?.(i)}
              >
                <span className="choice-label">{choice.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="event-auto">
            {event.delta && (
              <div className="event-delta-preview">
                {renderAutoEffects(event.delta)}
              </div>
            )}
            <button className="event-continue-btn" onClick={onContinue}>
              Understood →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

function renderAutoEffects(delta: Record<string, number | undefined>) {
  const LABELS: Record<string, string> = {
    backlog: '📦 Backlog', capacity: '🚴 Capacity', sla: '⏱ SLA',
    cost: '💸 Cost', trust: '🤝 Trust', energy: '⚡ Energy',
  };
  return Object.entries(delta)
    .filter(([, v]) => v !== undefined && v !== 0)
    .map(([key, val]) => {
      const positive = (val ?? 0) > 0;
      const isBad = (key === 'backlog' || key === 'cost') ? positive : !positive;
      return (
        <span key={key} className={`effect-chip ${isBad ? 'effect-bad' : 'effect-good'}`}>
          {LABELS[key] ?? key} {positive ? `+${val}` : val}
        </span>
      );
    });
}
