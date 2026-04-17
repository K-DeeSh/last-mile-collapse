import { Archetype } from '../types';

export const ARCHETYPES: Archetype[] = [
  {
    id: 'firefighter',
    name: 'Last Mile Firefighter',
    icon: '🔥',
    description: 'Crisis after crisis, you kept things moving through sheer force of will. The fires never stopped, but neither did you.',
    condition: (stats) =>
      stats.timesManualMode >= 3 && stats.timesEnergyCritical >= 3,
    priority: 10,
  },
  {
    id: 'sla_illusionist',
    name: 'SLA Illusionist',
    icon: '🎩',
    description: 'Technically compliant. Legally defensible. Morally questionable. The numbers looked great.',
    condition: (stats) =>
      stats.timesSlaLow >= 4 && (stats.decisionCounts['flex_sla'] ?? 0) >= 2,
    priority: 10,
  },
  {
    id: 'cost_assassin',
    name: 'Cost Assassin',
    icon: '💸',
    description: 'Budget sheets fear you. So does the rest of the team. Everything non-essential was eliminated — including some essentials.',
    condition: (stats) =>
      stats.timesHighCost <= 2 &&
      (stats.decisionCounts['cut_cost'] ?? 0) +
        (stats.decisionCounts['ignore_sla'] ?? 0) >= 4,
    priority: 9,
  },
  {
    id: 'courier_whisperer',
    name: 'Courier Whisperer',
    icon: '📦',
    description: 'You kept the couriers happy, the routes sane, and the backlog manageable. Rare. Precious.',
    condition: (stats, metrics) =>
      metrics.capacity >= 60 && metrics.energy >= 50 && metrics.backlog <= 40,
    priority: 8,
  },
  {
    id: 'spreadsheet_logistician',
    name: 'Spreadsheet Logistician',
    icon: '📊',
    description: 'Every decision was data-driven. Some data was wrong, but your confidence was not.',
    condition: (stats) =>
      (stats.decisionCounts['data_driven'] ?? 0) +
        (stats.decisionCounts['analytics'] ?? 0) >= 4,
    priority: 7,
  },
  {
    id: 'manual_mode_prophet',
    name: 'Manual Mode Prophet',
    icon: '🔧',
    description: 'The algorithm failed you. The dashboards lied. In the end, only human hands could be trusted.',
    condition: (stats) =>
      (stats.decisionCounts['manual_mode'] ?? 0) >= 4,
    priority: 9,
  },
  {
    id: 'chaos_dispatcher',
    name: 'Chaos Dispatcher',
    icon: '🌀',
    description: 'No strategy, maximum energy. Something about your chaotic approach produced surprisingly survivable outcomes.',
    condition: (stats) => {
      const vals = Object.values(stats.decisionCounts);
      const maxUsed = Math.max(...vals, 0);
      return maxUsed <= 3 && vals.length >= 8;
    },
    priority: 6,
  },
  {
    id: 'trust_destroyer',
    name: 'Trust Destroyer',
    icon: '💔',
    description: 'You optimised everything except the relationship with your customers. They noticed.',
    condition: (stats, metrics) => metrics.trust <= 25,
    priority: 8,
  },
  {
    id: 'quarter_survivor',
    name: 'Quarter Survivor',
    icon: '🏆',
    description: 'Against all odds, through sheer stubbornness and institutional inertia, you made it to the end.',
    condition: (_stats, _metrics) => true,
    priority: 1,
  },
  {
    id: 'burnout_architect',
    name: 'Burnout Architect',
    icon: '😮‍💨',
    description: 'The KPIs looked great. The team did not.',
    condition: (stats) =>
      stats.timesEnergyCritical >= 5 &&
      (stats.decisionCounts['overtime'] ?? 0) +
        (stats.decisionCounts['warehouse_push'] ?? 0) >= 4,
    priority: 9,
  },
  {
    id: 'delegation_master',
    name: 'Master Delegator',
    icon: '🤝',
    description: 'Why solve a problem when you can pass it to another team? They\'ve stopped returning your messages.',
    condition: (stats) => (stats.decisionCounts['delegate'] ?? 0) >= 4,
    priority: 8,
  },
  {
    id: 'hopeless_optimist',
    name: 'Hopeless Optimist',
    icon: '🌈',
    description: 'You did nothing and hoped a lot. Statistically, this should not have worked.',
    condition: (stats) => (stats.decisionCounts['do_nothing'] ?? 0) >= 5,
    priority: 9,
  },
  {
    id: 'vip_champion',
    name: 'VIP Champion',
    icon: '👑',
    description: 'Premium clients loved you. Everyone else filed complaints.',
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
