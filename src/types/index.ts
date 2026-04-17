export interface Metrics {
  backlog: number;      // 0–100: accumulated undelivered orders. Game over at 100
  capacity: number;     // 0–100: courier throughput
  sla: number;          // 0–100: SLA compliance. Game over below 10
  cost: number;         // 0–100: operational cost burn. Game over at 100
  trust: number;        // 0–100: customer trust. Game over below 10
  energy: number;       // 0–100: team energy. Game over below 10
}

export type MetricKey = keyof Metrics;

export interface MetricDelta {
  backlog?: number;
  capacity?: number;
  sla?: number;
  cost?: number;
  trust?: number;
  energy?: number;
  [key: string]: number | undefined;
}

export interface DelayedEffect {
  turnsRemaining: number;
  delta: MetricDelta;
  description: string;
  sourceDecisionId?: string;
}

export interface EventChoice {
  label: string;
  delta: MetricDelta;
  consequence: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  delta?: MetricDelta;           // auto-applied if no choices
  choices?: EventChoice[];       // player picks one
  weight?: number;               // relative spawn probability (default 1)
  minTurn?: number;              // earliest turn this can appear
}

export interface Decision {
  id: string;
  label: string;
  description: string;
  shortLabel: string;
  immediate: MetricDelta;
  delayed?: {
    turns: number;               // how many turns until effect
    delta: MetricDelta;
    description: string;
  };
  cooldown?: number;             // turns before can use again
}

export interface LogEntry {
  turn: number;
  text: string;
  type: 'event' | 'decision' | 'delayed' | 'system' | 'warning';
}

export type GamePhase = 'start' | 'playing' | 'event' | 'result';

export type GameOverReason =
  | 'backlog'
  | 'sla'
  | 'trust'
  | 'energy'
  | 'cost'
  | 'victory';

export interface PlayerStats {
  decisionCounts: Record<string, number>;
  timesBacklogCritical: number;    // backlog > 70
  timesSlaLow: number;             // sla < 30
  timesEnergyCritical: number;     // energy < 25
  timesHighCost: number;           // cost > 75
  totalOrdersDelivered: number;
  maxBacklogReached: number;
  timesManualMode: number;
  timesIgnored: number;            // "do nothing" decisions
  turnsOnCooldown: number;         // turns spent unable to use preferred option
}

export interface GameState {
  phase: GamePhase;
  turn: number;
  totalTurns: number;
  metrics: Metrics;
  pendingEvent: GameEvent | null;
  delayedEffects: DelayedEffect[];
  log: LogEntry[];
  gameOverReason: GameOverReason | null;
  decisionCooldowns: Record<string, number>;  // decisonId -> turns remaining
  recentDecisions: string[];                   // last 4 decision ids (for variety)
  stats: PlayerStats;
  difficulty: 'normal' | 'peak';
  ordersThisTurn: number;
  deliveriesThisTurn: number;
}

export interface Archetype {
  id: string;
  name: string;
  icon: string;
  description: string;
  condition: (stats: PlayerStats, metrics: Metrics) => boolean;
  priority: number;
}

export interface EndgameResult {
  won: boolean;
  reason: GameOverReason;
  finalMetrics: Metrics;
  score: number;
  archetype: Archetype;
  stats: PlayerStats;
  turnsPlayed: number;
}
