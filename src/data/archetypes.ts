import { Archetype } from '../types';

export const ARCHETYPES: Archetype[] = [
  {
    id: 'firefighter',
    name: 'Пожарный последней мили',
    icon: '🔥',
    description: 'Кризис за кризисом, ты держал всё в движении исключительно силой воли. Пожары не прекращались, но и ты — тоже.',
    condition: (stats) =>
      stats.timesManualMode >= 3 && stats.timesEnergyCritical >= 3,
    priority: 10,
  },
  {
    id: 'sla_illusionist',
    name: 'SLA-иллюзионист',
    icon: '🎩',
    description: 'Формально соответствует. Юридически защитимо. Морально сомнительно. Цифры выглядели отлично.',
    condition: (stats) =>
      stats.timesSlaLow >= 4 && (stats.decisionCounts['flex_sla'] ?? 0) >= 2,
    priority: 10,
  },
  {
    id: 'cost_assassin',
    name: 'Убийца бюджетов',
    icon: '💸',
    description: 'Таблицы расходов тебя боятся. Команда — тоже. Всё несущественное ликвидировано — включая кое-что существенное.',
    condition: (stats) =>
      stats.timesHighCost <= 2 &&
      (stats.decisionCounts['cut_cost'] ?? 0) +
        (stats.decisionCounts['ignore_sla'] ?? 0) >= 4,
    priority: 9,
  },
  {
    id: 'courier_whisperer',
    name: 'Укротитель курьеров',
    icon: '📦',
    description: 'Курьеры довольны, маршруты вменяемы, бэклог управляем. Редкость. Ценность.',
    condition: (stats, metrics) =>
      metrics.capacity >= 60 && metrics.energy >= 50 && metrics.backlog <= 40,
    priority: 8,
  },
  {
    id: 'spreadsheet_logistician',
    name: 'Табличный логистик',
    icon: '📊',
    description: 'Каждое решение основано на данных. Часть данных была неверной, но уверенность — нет.',
    condition: (stats) =>
      (stats.decisionCounts['data_driven'] ?? 0) +
        (stats.decisionCounts['analytics'] ?? 0) >= 4,
    priority: 7,
  },
  {
    id: 'manual_mode_prophet',
    name: 'Пророк ручного режима',
    icon: '🔧',
    description: 'Алгоритм подвёл. Дашборды лгали. В конце концов, только руки человека можно доверять.',
    condition: (stats) =>
      (stats.decisionCounts['manual_mode'] ?? 0) >= 4,
    priority: 9,
  },
  {
    id: 'chaos_dispatcher',
    name: 'Хаотичный диспетчер',
    icon: '🌀',
    description: 'Никакой стратегии, максимум энергии. Что-то в твоём хаотичном подходе дало удивительно живучий результат.',
    condition: (stats) => {
      const vals = Object.values(stats.decisionCounts);
      const maxUsed = Math.max(...vals, 0);
      return maxUsed <= 3 && vals.length >= 8;
    },
    priority: 6,
  },
  {
    id: 'trust_destroyer',
    name: 'Разрушитель доверия',
    icon: '💔',
    description: 'Ты оптимизировал всё, кроме отношений с клиентами. Они это заметили.',
    condition: (stats, metrics) => metrics.trust <= 25,
    priority: 8,
  },
  {
    id: 'quarter_survivor',
    name: 'Выживший в квартале',
    icon: '🏆',
    description: 'Вопреки всему, через упрямство и институциональную инерцию, ты добрался до конца.',
    condition: (_stats, _metrics) => true,
    priority: 1,
  },
  {
    id: 'burnout_architect',
    name: 'Архитектор выгорания',
    icon: '😮‍💨',
    description: 'KPI выглядели отлично. Команда — нет.',
    condition: (stats) =>
      stats.timesEnergyCritical >= 5 &&
      (stats.decisionCounts['overtime'] ?? 0) +
        (stats.decisionCounts['warehouse_push'] ?? 0) >= 4,
    priority: 9,
  },
  {
    id: 'delegation_master',
    name: 'Мастер делегирования',
    icon: '🤝',
    description: 'Зачем решать проблему, если можно передать её другой команде? Они перестали отвечать на сообщения.',
    condition: (stats) => (stats.decisionCounts['delegate'] ?? 0) >= 4,
    priority: 8,
  },
  {
    id: 'hopeless_optimist',
    name: 'Безнадёжный оптимист',
    icon: '🌈',
    description: 'Ты ничего не делал и очень надеялся. Статистически это не должно было сработать.',
    condition: (stats) => (stats.decisionCounts['do_nothing'] ?? 0) >= 5,
    priority: 9,
  },
  {
    id: 'vip_champion',
    name: 'Чемпион VIP-клиентов',
    icon: '👑',
    description: 'Премиум-клиенты тебя обожают. Все остальные подали жалобы.',
    condition: (stats) => (stats.decisionCounts['vip_priority'] ?? 0) >= 4,
    priority: 8,
  },
];

export function determineArchetype(
  stats: import('../types').PlayerStats,
  metrics: import('../types').Metrics
): Archetype {
  const sorted = [...ARCHETYPES].sort((a, b) => b.priority - a.priority);
  for (const archetype of sorted) {
    if (archetype.condition(stats, metrics)) return archetype;
  }
  return ARCHETYPES.find(a => a.id === 'quarter_survivor')!;
}
