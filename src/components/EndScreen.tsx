import React from 'react';
import { EndgameResult, GameOverReason } from '../types';

const REASON_MESSAGES: Record<GameOverReason, string> = {
  backlog: 'Бэклог достиг критической массы. Заказы теперь — геологическая формация.',
  sla: 'SLA упал в ноль. Юристы уже набирают номер.',
  trust: 'Доверие клиентов испарилось. Они пишут отзывы прямо сейчас.',
  energy: 'Команда закончилась. Все на больничном.',
  cost: 'Операционные расходы вышли из-под контроля. Финансы позвонили совету директоров.',
  victory: 'Ты пережил квартал. Едва. Впечатляет. Вопреки всему.',
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
          {won ? '✅ ВЫЖИЛ' : '💀 КОЛЛАПС'}
        </div>

        <p className="end-reason">{REASON_MESSAGES[reason]}</p>

        <div className="archetype-block">
          <div className="archetype-icon">{archetype.icon}</div>
          <div className="archetype-name">{archetype.name}</div>
          <div className="archetype-desc">{archetype.description}</div>
        </div>

        <div className="score-display">
          <span className="score-label">Итоговый счёт</span>
          <span className="score-value">{score}</span>
        </div>

        <div className="end-stats">
          <h3 className="section-title">Статистика</h3>
          <StatRow label="Ходов сыграно" value={`${turnsPlayed} / 40`} />
          <StatRow label="Заказов доставлено" value={stats.totalOrdersDelivered} />
          <StatRow label="Пик бэклога" value={stats.maxBacklogReached} />
          <StatRow label="Финальный SLA" value={`${finalMetrics.sla}%`} />
          <StatRow label="Финальное доверие" value={`${finalMetrics.trust}%`} />
          <StatRow label="Финальная энергия" value={`${finalMetrics.energy}%`} />
          <StatRow label="Кризисных ходов" value={stats.timesBacklogCritical} />
          <StatRow label="Ручной режим" value={stats.timesManualMode} />
          <StatRow label="Ничего не делал" value={stats.timesIgnored} />
        </div>

        {Object.keys(stats.decisionCounts).length > 0 && (
          <div className="top-decisions">
            <h3 className="section-title">Самые частые решения</h3>
            {Object.entries(stats.decisionCounts)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 4)
              .map(([id, count]) => (
                <StatRow key={id} label={DECISION_LABELS[id] ?? formatDecisionId(id)} value={`×${count}`} />
              ))}
          </div>
        )}

        <button className="restart-btn" onClick={onRestart}>
          Играть снова
        </button>
      </div>
    </div>
  );
};

const DECISION_LABELS: Record<string, string> = {
  hire_temp: 'Нанять временных курьеров',
  reroute: 'Перестроить маршруты',
  aggressive_opt: 'Жёсткая оптимизация',
  vip_priority: 'Приоритет VIP-заказам',
  ignore_sla: 'Отключить SLA-контроль',
  warehouse_push: 'Надавить на склад',
  cut_cost: 'Срезать расходы',
  manual_mode: 'Ручной режим',
  delegate: 'Делегировать партнёрам',
  do_nothing: 'Ничего не делать',
  hire_manager: 'Нанять консультанта',
  morale_boost: 'Поднять моральный дух',
  data_driven: 'Запустить аналитику',
  flex_sla: 'Пересмотреть SLA',
  overtime: 'Объявить переработки',
};

function formatDecisionId(id: string): string {
  return id
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
