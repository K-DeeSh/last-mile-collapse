import React from 'react';
import { EndgameResult, GameOverReason } from '../types';

const REASON_MESSAGES: Record<GameOverReason, string> = {
  backlog: 'The backlog reached critical mass. Orders are now a geological feature.',
  sla: 'SLA compliance hit rock bottom. Legal is on the phone.',
  trust: 'Customer trust evaporated. They\'re posting reviews now.',
  energy: 'The team ran out of steam. Everyone is on sick leave.',
  cost: 'Operational costs spiralled out of control. Finance called the board.',
  victory: 'You survived the quarter. Barely. Impressively. Against all odds.',
};

interface StatRowProps {
  label: string;
  value: string | number;
}
const StatRow: React.FC<StatRowProps> = ({ label, value }) => (
  <div className="stat-row">
    <span className="stat-label">{label}</span>
    <span className="stat-value">{value}</span>
  </div>
);

interface Props {
  result: EndgameResult;
  onRestart: () => void;
}

export const EndScreen: React.FC<Props> = ({ result, onRestart }) => {
  const { won, reason, finalMetrics, score, archetype, stats, turnsPlayed } = result;

  return (
    <div className="end-screen">
      <div className="end-card">
        <div className={`end-verdict ${won ? 'verdict-won' : 'verdict-lost'}`}>
          {won ? '✅ SURVIVED' : '💀 COLLAPSED'}
        </div>

        <p className="end-reason">{REASON_MESSAGES[reason]}</p>

        <div className="archetype-block">
          <div className="archetype-icon">{archetype.icon}</div>
          <div className="archetype-name">{archetype.name}</div>
          <div className="archetype-desc">{archetype.description}</div>
        </div>

        <div className="score-display">
          <span className="score-label">Final Score</span>
          <span className="score-value">{score}</span>
        </div>

        <div className="end-stats">
          <h3 className="section-title">Statistics</h3>
          <StatRow label="Turns played" value={`${turnsPlayed} / 40`} />
          <StatRow label="Orders delivered" value={stats.totalOrdersDelivered} />
          <StatRow label="Peak backlog" value={stats.maxBacklogReached} />
          <StatRow label="Final SLA" value={`${finalMetrics.sla}%`} />
          <StatRow label="Final Trust" value={`${finalMetrics.trust}%`} />
          <StatRow label="Final Energy" value={`${finalMetrics.energy}%`} />
          <StatRow label="Crisis turns" value={stats.timesBacklogCritical} />
          <StatRow label="Times manual mode" value={stats.timesManualMode} />
          <StatRow label="Times did nothing" value={stats.timesIgnored} />
        </div>

        {Object.keys(stats.decisionCounts).length > 0 && (
          <div className="top-decisions">
            <h3 className="section-title">Most Used Actions</h3>
            {Object.entries(stats.decisionCounts)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 4)
              .map(([id, count]) => (
                <StatRow key={id} label={formatDecisionId(id)} value={`×${count}`} />
              ))}
          </div>
        )}

        <button className="restart-btn" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
};

function formatDecisionId(id: string): string {
  return id
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
