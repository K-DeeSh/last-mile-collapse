import { GameEvent } from '../types';

export const EVENTS: GameEvent[] = [
  // ─── Auto-apply events ────────────────────────────────────────────
  {
    id: 'courier_optimization',
    title: 'Couriers Found a Shortcut',
    description: 'Couriers discovered an optimisation: skip orders that are "too far." Capacity technically unchanged.',
    delta: { backlog: +12, trust: -8 },
    weight: 2,
  },
  {
    id: 'algo_amsterdam',
    title: 'Algorithm Geography Update',
    description: 'The routing algorithm now believes Amsterdam and Almere are "emotionally adjacent." Three routes pass through the ocean.',
    delta: { sla: -10, backlog: +8, capacity: -5 },
    weight: 1,
  },
  {
    id: 'warehouse_manual',
    title: 'Warehouse in Manual Mode',
    description: 'The warehouse confirmed everything is fine and running in manual mode. It\'s faster, allegedly.',
    delta: { backlog: -8, energy: -10 },
    weight: 2,
  },
  {
    id: 'partner_integration',
    title: 'Integration Status: Alive (Probably)',
    description: 'Partner API returned HTTP 200 but the payload was a JPEG of a cat. Engineering is investigating.',
    delta: { capacity: -10, sla: -6 },
    weight: 1,
  },
  {
    id: 'sla_compliant',
    title: 'SLA Technically Compliant',
    description: 'SLA was formally met. Legal reviewed and confirmed delivery at 23:59 counts. Clients disagree.',
    delta: { trust: -10, sla: +5 },
    weight: 2,
  },
  {
    id: 'process_speed_hack',
    title: 'Speed Through Skipping Checks',
    description: 'The team proved any process can be accelerated by removing all validation. Speed is up. Correctness is a vibe.',
    delta: { capacity: +12, sla: -12, backlog: -5 },
    weight: 1,
  },
  {
    id: 'demand_spike',
    title: 'Unexpected Demand Spike',
    description: 'A lifestyle blogger posted about next-day delivery. 40% more orders just appeared.',
    delta: { backlog: +20, capacity: -5 },
    weight: 2,
    minTurn: 3,
  },
  {
    id: 'courier_strike',
    title: 'Informal Work Stoppage',
    description: 'Couriers are "assessing their options" and "reviewing their employment situation." Capacity at 60% until resolved.',
    delta: { capacity: -18, energy: +5, trust: -5 },
    weight: 1,
    minTurn: 5,
  },
  {
    id: 'it_incident',
    title: 'IT Incident: Severity 2',
    description: 'The dispatch system rebooted into a different timezone. All ETAs are now in UTC+11.',
    delta: { sla: -15, backlog: +10, energy: -8 },
    weight: 1,
    minTurn: 4,
  },
  {
    id: 'weather_bad',
    title: 'Weather Event',
    description: 'It rained. Not exceptional rain. Just rain. Capacity dropped 20% because apparently no one planned for precipitation.',
    delta: { capacity: -12, backlog: +8, sla: -5 },
    weight: 2,
  },
  {
    id: 'viral_complaint',
    title: 'Complaint Goes Viral',
    description: 'A customer tweeted a photo of their delivery: a box, significantly crushed, addressed to someone else. 40k likes.',
    delta: { trust: -20, sla: -8 },
    weight: 1,
    minTurn: 6,
  },
  {
    id: 'seasonal_rush',
    title: 'Seasonal Rush Begins',
    description: 'Somehow no one noted this in the calendar. Backlog growing faster for the next 3 turns.',
    delta: { backlog: +15, cost: +8 },
    weight: 1,
    minTurn: 8,
  },
  {
    id: 'good_quarter',
    title: 'Unexpectedly Good Quarter',
    description: 'Revenue is up. Leadership celebrates by adding 25% to volume targets. Effective immediately.',
    delta: { backlog: +18, cost: +5, trust: +5 },
    weight: 1,
    minTurn: 5,
  },
  {
    id: 'team_hero',
    title: 'A Hero Emerges',
    description: 'One courier manually handled 60 deliveries in a single day. Everyone clapped. He is now on medical leave.',
    delta: { backlog: -12, energy: -15, capacity: -5 },
    weight: 1,
  },
  {
    id: 'mystery_backlog',
    title: 'Phantom Orders',
    description: 'Reconciliation found 30 orders that were "in transit" since last quarter. They were not in transit.',
    delta: { backlog: +14, trust: -8 },
    weight: 1,
    minTurn: 4,
  },
  {
    id: 'energy_drink_sponsor',
    title: 'Energy Drinks Delivered to Office',
    description: 'Marketing sent 200 cans of branded energy drink. Team energy spiked. Sleep will not.',
    delta: { energy: +18, cost: +4 },
    weight: 2,
  },
  {
    id: 'cto_visit',
    title: 'CTO Shadowing for a Day',
    description: 'The CTO observed operations and left three pages of notes titled "Quick Wins." Everyone is tired already.',
    delta: { energy: -10, sla: +8, capacity: +5 },
    weight: 1,
    minTurn: 3,
  },
  {
    id: 'algorithm_update',
    title: 'Routing Algorithm v2.1 Deployed',
    description: 'The new algorithm is faster and 12% more efficient in simulation. In production it routes via Belgium.',
    delta: { capacity: +10, sla: -10, backlog: +5 },
    weight: 1,
    minTurn: 5,
  },
  {
    id: 'positive_review',
    title: 'Surprise Positive Review',
    description: 'A customer received a package with a handwritten note and a sticker. They left a 5-star review. Nobody knows who wrote the note.',
    delta: { trust: +15 },
    weight: 2,
  },
  {
    id: 'competitor_collapse',
    title: 'Competitor Outage',
    description: 'A competitor\'s system collapsed. Their customers are now yours. Volume +30%.',
    delta: { backlog: +20, trust: +8, cost: +5 },
    weight: 1,
    minTurn: 6,
  },
  {
    id: 'excel_dashboard',
    title: 'Leadership Requests a Dashboard',
    description: 'A new real-time Excel dashboard is now mandatory for each shift. It auto-emails leadership every 15 minutes.',
    delta: { energy: -12, cost: +6, sla: +4 },
    weight: 1,
    minTurn: 3,
  },
  {
    id: 'fuel_price',
    title: 'Fuel Prices Spike',
    description: 'Fuel costs just increased 18%. Couriers did the maths. Some routes are no longer economically rational.',
    delta: { cost: +15, capacity: -8 },
    weight: 2,
  },
  {
    id: 'new_client',
    title: 'Enterprise Client Onboarded',
    description: 'Sales signed a major enterprise client. Procurement: 2000 orders/day. Operations: heard about it on Slack.',
    delta: { backlog: +22, cost: +8, trust: +5 },
    weight: 1,
    minTurn: 7,
  },
  {
    id: 'regulatory_audit',
    title: 'Regulatory Audit Announced',
    description: 'Regulators are checking SLA compliance records for the past 90 days. Accounting is "reviewing the methodology."',
    delta: { sla: +10, energy: -15, cost: +10 },
    weight: 1,
    minTurn: 8,
  },
  {
    id: 'holiday',
    title: 'Public Holiday (Unplanned)',
    description: 'Turns out today is a public holiday in three of your courier regions. The calendar said otherwise.',
    delta: { capacity: -15, backlog: +10 },
    weight: 2,
  },

  // ─── Choice events ────────────────────────────────────────────────
  {
    id: 'courier_union',
    title: 'Courier Union Forming',
    description: 'Couriers are organising. They want better pay or shorter hours. How do you respond?',
    choices: [
      {
        label: 'Meet their demands',
        delta: { cost: +15, energy: +15, capacity: +8 },
        consequence: 'Goodwill purchased. Capacity and energy recover.',
      },
      {
        label: 'Stall and deflect',
        delta: { energy: -10, trust: -8 },
        consequence: 'The Slack channel gets louder. Nothing resolved.',
      },
      {
        label: 'Hire replacement couriers',
        delta: { capacity: -10, cost: +10, sla: -8 },
        consequence: 'Replacements hired. Onboarding takes time. Quality dips.',
      },
    ],
    weight: 1,
    minTurn: 5,
  },
  {
    id: 'client_escalation',
    title: 'Key Client Escalation',
    description: 'Your biggest client just called. Their last 10 orders were late. They want answers.',
    choices: [
      {
        label: 'Apologise + SLA credit',
        delta: { trust: +12, cost: +12 },
        consequence: 'Client appeased. The credit hits the budget.',
      },
      {
        label: 'Blame the courier partner',
        delta: { trust: -8, sla: -5 },
        consequence: 'Client unconvinced. They cc\'d their lawyer.',
      },
      {
        label: 'Offer dedicated courier',
        delta: { trust: +15, capacity: -8, cost: +10 },
        consequence: 'Client delighted. One less courier for everyone else.',
      },
    ],
    weight: 1,
    minTurn: 4,
  },
  {
    id: 'leadership_review',
    title: 'Quarterly Business Review',
    description: 'Leadership wants to review the numbers. You can present optimistically or honestly.',
    choices: [
      {
        label: 'Present honest numbers',
        delta: { trust: +8, energy: -8, sla: +5 },
        consequence: 'Respected. Given more resources. Also more oversight.',
      },
      {
        label: 'Present optimistic spin',
        delta: { cost: +10, energy: +5, trust: -5 },
        consequence: 'Targets raised. Leadership is very excited.',
      },
      {
        label: 'Reschedule the review',
        delta: { energy: +8 },
        consequence: 'Bought one turn. They\'ll ask again next turn.',
      },
    ],
    weight: 1,
    minTurn: 6,
  },
  {
    id: 'tech_offer',
    title: 'New Tech Platform Pitch',
    description: 'A startup is pitching a "next-gen dispatch OS." It costs money and takes time to integrate.',
    choices: [
      {
        label: 'Pilot it now',
        delta: { cost: +12, capacity: +5, energy: -8 },
        consequence: 'Pilot launched. 60% of features work on day one.',
      },
      {
        label: 'Schedule for next quarter',
        delta: { energy: +5 },
        consequence: 'Nothing changes. The startup follows up weekly.',
      },
      {
        label: 'Decline politely',
        delta: { cost: -5, energy: +3 },
        consequence: 'Budget saved. The startup posts about it on LinkedIn.',
      },
    ],
    weight: 1,
    minTurn: 3,
  },
  {
    id: 'budget_freeze',
    title: 'Finance Announces Budget Freeze',
    description: 'No new hires, no discretionary spend. Finance sent a very firm email.',
    choices: [
      {
        label: 'Comply fully',
        delta: { cost: -15, capacity: -10, energy: -5 },
        consequence: 'Budget saved. Capacity suffers.',
      },
      {
        label: 'Route around it creatively',
        delta: { cost: +5, capacity: +5 },
        consequence: 'Problem solved. Finance will find out eventually.',
      },
      {
        label: 'Escalate to CEO',
        delta: { energy: -10, cost: -5, sla: +5 },
        consequence: 'Exception granted. You\'ve used your political capital.',
      },
    ],
    weight: 1,
    minTurn: 5,
  },
  {
    id: 'press_inquiry',
    title: 'Journalist Inquiry',
    description: 'A journalist is writing about last-mile logistics. They have your delivery delay data.',
    choices: [
      {
        label: 'Cooperate and be transparent',
        delta: { trust: +10, sla: -5 },
        consequence: 'Article is balanced. One quote out of context.',
      },
      {
        label: 'No comment',
        delta: { trust: -8 },
        consequence: 'Article published anyway. "Company declined to comment."',
      },
      {
        label: 'Offer an exclusive tour',
        delta: { trust: +8, energy: -8, cost: +5 },
        consequence: 'Positive puff piece published. Operations disrupted for two days.',
      },
    ],
    weight: 1,
    minTurn: 6,
  },
];

export function getRandomEvent(
  turn: number,
  usedEventIds: Set<string>
): GameEvent | null {
  const eligible = EVENTS.filter(
    e => (!e.minTurn || e.minTurn <= turn) && !usedEventIds.has(e.id)
  );
  if (eligible.length === 0) return null;

  const totalWeight = eligible.reduce((sum, e) => sum + (e.weight ?? 1), 0);
  let rand = Math.random() * totalWeight;
  for (const event of eligible) {
    rand -= event.weight ?? 1;
    if (rand <= 0) return event;
  }
  return eligible[eligible.length - 1];
}
