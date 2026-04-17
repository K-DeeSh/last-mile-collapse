import React from 'react';
import { Metrics, MetricKey } from '../types';

interface MetricConfig {
  key: MetricKey;
  label: string;
  icon: string;
  invertDanger?: boolean;
  dangerThreshold: number;
  warningThreshold: number;
}

const METRIC_CONFIGS: MetricConfig[] = [
  { key: 'backlog', label: 'Бэклог', icon: '📦', dangerThreshold: 80, warningThreshold: 60 },
  { key: 'capacity', label: 'Мощность', icon: '🚴', invertDanger: true, dangerThreshold: 25, warningThreshold: 40 },
  { key: 'sla', label: 'SLA', icon: '⏱', invertDanger: true, dangerThreshold: 20, warningThreshold: 40 },
  { key: 'cost', label: 'Расходы', icon: '💸', dangerThreshold: 80, warningThreshold: 60 },
  { key: 'trust', label: 'Доверие', icon: '🤝', invertDanger: true, dangerThreshold: 20, warningThreshold: 35 },
  { key: 'energy', label: 'Энергия', icon: '⚡', invertDanger: true, dangerThreshold: 20, warningThreshold: 35 },
];

function getStatus(value: number, cfg: MetricConfig): 'danger' | 'warning' | 'ok' {
  if (cfg.invertDanger) {
    if (value <= cfg.dangerThreshold) return 'danger';
    if (value <= cfg.warningThreshold) return 'warning';
    return 'ok';
  } else {
    if (value >= cfg.dangerThreshold) return 'danger';
    if (value >= cfg.warningThreshold) return 'warning';
    return 'ok';
  }
}

interface Props {
  metrics: Metrics;
  prevMetrics?: Metrics;
}

export const MetricsPanel: React.FC<Props> = ({ metrics, prevMetrics }) => {
  return (
    <div className="metrics-panel">
      {METRIC_CONFIGS.map((cfg) => {
        const value = metrics[cfg.key];
        const prev = prevMetrics?.[cfg.key];
        const delta = prev !== undefined ? value - prev : 0;
        const status = getStatus(value, cfg);

        return (
          <div key={cfg.key} className={`metric-card metric-${status}`}>
            <div className="metric-icon">{cfg.icon}</div>
            <div className="metric-body">
              <div className="metric-label">{cfg.label}</div>
              <div className="metric-value-row">
                <span className="metric-value">{value}</span>
                {delta !== 0 && (
                  <span className={`metric-delta ${delta > 0 ? 'delta-up' : 'delta-down'}`}>
                    {delta > 0 ? `+${delta}` : delta}
                  </span>
                )}
              </div>
              <div className="metric-bar-track">
                <div
                  className={`metric-bar-fill metric-bar-${status}`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
