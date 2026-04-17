import {
  GameState,
  Metrics,
  MetricDelta,
  Decision,
  LogEntry,
  GameOverReason,
  PlayerStats,
  GameEvent,
  EventChoice,
} from '../types';
import { DECISIONS } from '../data/decisions';
import { getRandomEvent } from '../data/events';
import { determineArchetype } from '../data/archetypes';

// ─── Constants ──────────────────────────────────────────────────────────────

export const TOTAL_TURNS = 40;

const INITIAL_METRICS: Metrics = {
  backlog: 20,
  capacity: 65,
  sla: 78,
  cost: 35,
  trust: 75,
  energy: 82,
};

const PEAK_INITIAL_METRICS: Metrics = {
  backlog: 30,
  capacity: 55,
  sla: 65,
  cost: 45,
  trust: 70,
  energy: 70,
};

// Order inflow per turn, scaled by difficulty
const BASE_ORDERS_NORMAL = 14;
const BASE_ORDERS_PEAK = 20;

// Event spawn probability per turn
const EVENT_CHANCE = 0.35;

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function applyDelta(metrics: Metrics, delta: MetricDelta): Metrics {
  const result = { ...metrics } as Record<string, number>;
  for (const key of Object.keys(delta)) {
    const d = delta[key];
    if (d !== undefined && key in metrics) {
      result[key] = clamp(result[key] + d);
    }
  }
  return result as unknown as Metrics;
}

function addLog(
  log: LogEntry[],
  turn: number,
  text: string,
  type: LogEntry['type']
): LogEntry[] {
  const entry: LogEntry = { turn, text, type };
  return [entry, ...log].slice(0, 40); // keep last 40 entries
}

function checkGameOver(metrics: Metrics): GameOverReason | null {
  if (metrics.backlog >= 100) return 'backlog';
  if (metrics.sla <= 8) return 'sla';
  if (metrics.trust <= 8) return 'trust';
  if (metrics.energy <= 8) return 'energy';
  if (metrics.cost >= 100) return 'cost';
  return null;
}

// ─── Turn processing ─────────────────────────────────────────────────────────

/**
 * Compute natural turn changes (orders in, deliveries out, metric drift).
 * Called at the START of each turn before the player chooses an action.
 */
function computeNaturalTick(state: GameState): {
  newMetrics: Metrics;
  ordersIn: number;
  deliveriesOut: number;
  logEntries: string[];
} {
  const { metrics, turn, difficulty } = state;
  const logEntries: string[] = [];

  // Orders arriving this turn (increases over time, peaks mid-game)
  const baseOrders =
    difficulty === 'peak' ? BASE_ORDERS_PEAK : BASE_ORDERS_NORMAL;
  const scaleFactor = 1 + Math.min(turn / TOTAL_TURNS, 1) * 0.6; // up to 60% more by turn 40
  const variance = (Math.random() - 0.5) * 6;
  const ordersIn = Math.round(baseOrders * scaleFactor + variance);

  // Deliveries = capacity throughput vs backlog pressure
  const deliveryRate = metrics.capacity / 100;
  const deliveriesOut = Math.round(
    Math.min(metrics.backlog + ordersIn, metrics.capacity * 0.85 + Math.random() * 5)
  );

  let newBacklog = clamp(metrics.backlog + ordersIn - deliveriesOut);

  // Natural SLA drift based on backlog vs capacity
  const pressure = newBacklog / (metrics.capacity + 1);
  const slaDrift = pressure > 0.8 ? -4 : pressure > 0.5 ? -2 : pressure < 0.3 ? +1 : 0;

  // Natural trust drift
  const trustDrift = metrics.sla < 30 ? -3 : metrics.sla > 70 ? +1 : 0;

  // Natural energy recovery (slow)
  const energyDrift = metrics.energy < 30 ? +2 : -1;

  // Natural cost drift (infrastructure, fixed costs)
  const costDrift = metrics.cost > 60 ? +1 : 0;

  const newMetrics: Metrics = {
    ...metrics,
    backlog: newBacklog,
    sla: clamp(metrics.sla + slaDrift),
    trust: clamp(metrics.trust + trustDrift),
    energy: clamp(metrics.energy + energyDrift),
    cost: clamp(metrics.cost + costDrift),
  };

  if (ordersIn > baseOrders * scaleFactor + 2) {
    logEntries.push(`${ordersIn} new orders flooded in this turn.`);
  }
  if (pressure > 0.9) {
    logEntries.push('Backlog pressure is critical — delivery rate suffering.');
  }

  return { newMetrics, ordersIn, deliveriesOut, logEntries };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function createInitialState(difficulty: 'normal' | 'peak'): GameState {
  return {
    phase: 'playing',
    turn: 1,
    totalTurns: TOTAL_TURNS,
    metrics: difficulty === 'peak' ? { ...PEAK_INITIAL_METRICS } : { ...INITIAL_METRICS },
    pendingEvent: null,
    delayedEffects: [],
    log: [
      {
        turn: 0,
        text: 'Quarter started. Backlog is manageable. Famous last words.',
        type: 'system',
      },
    ],
    gameOverReason: null,
    decisionCooldowns: {},
    recentDecisions: [],
    stats: {
      decisionCounts: {},
      timesBacklogCritical: 0,
      timesSlaLow: 0,
      timesEnergyCritical: 0,
      timesHighCost: 0,
      totalOrdersDelivered: 0,
      maxBacklogReached: 0,
      timesManualMode: 0,
      timesIgnored: 0,
      turnsOnCooldown: 0,
    },
    difficulty,
    ordersThisTurn: 0,
    deliveriesThisTurn: 0,
  };
}

/** Called at turn start — computes natural tick + possibly spawns event. */
export function processTurnStart(
  state: GameState,
  usedEventIds: Set<string>
): GameState {
  const { newMetrics, ordersIn, deliveriesOut, logEntries } = computeNaturalTick(state);

  let log = state.log;
  for (const entry of logEntries) {
    log = addLog(log, state.turn, entry, 'system');
  }

  // Tick down delayed effects and apply any that expired
  const triggeredEffects: string[] = [];
  const stillPending = state.delayedEffects
    .map(e => ({ ...e, turnsRemaining: e.turnsRemaining - 1 }));

  let effectMetrics = { ...newMetrics };
  const remaining = stillPending.filter(e => {
    if (e.turnsRemaining <= 0) {
      effectMetrics = applyDelta(effectMetrics, e.delta);
      triggeredEffects.push(e.description);
      return false;
    }
    return true;
  });

  for (const msg of triggeredEffects) {
    log = addLog(log, state.turn, `[Delayed] ${msg}`, 'delayed');
  }

  // Update stats
  const stats = { ...state.stats };
  stats.totalOrdersDelivered += deliveriesOut;
  stats.maxBacklogReached = Math.max(stats.maxBacklogReached, effectMetrics.backlog);
  if (effectMetrics.backlog > 70) stats.timesBacklogCritical++;
  if (effectMetrics.sla < 30) stats.timesSlaLow++;
  if (effectMetrics.energy < 25) stats.timesEnergyCritical++;
  if (effectMetrics.cost > 75) stats.timesHighCost++;

  // Cooldown tick
  const cooldowns: Record<string, number> = {};
  for (const [id, turns] of Object.entries(state.decisionCooldowns)) {
    if (turns > 1) cooldowns[id] = turns - 1;
  }

  // Check game over
  const gameOverReason = checkGameOver(effectMetrics);
  if (gameOverReason) {
    return {
      ...state,
      metrics: effectMetrics,
      delayedEffects: remaining,
      log,
      stats,
      gameOverReason,
      phase: 'result',
      ordersThisTurn: ordersIn,
      deliveriesThisTurn: deliveriesOut,
      decisionCooldowns: cooldowns,
    };
  }

  // Maybe spawn event
  const spawnEvent = Math.random() < EVENT_CHANCE;
  let pendingEvent: GameEvent | null = null;
  if (spawnEvent) {
    pendingEvent = getRandomEvent(state.turn, usedEventIds);
  }

  const nextPhase = pendingEvent ? 'event' : 'playing';

  return {
    ...state,
    metrics: effectMetrics,
    delayedEffects: remaining,
    log,
    stats,
    pendingEvent,
    phase: nextPhase,
    ordersThisTurn: ordersIn,
    deliveriesThisTurn: deliveriesOut,
    decisionCooldowns: cooldowns,
  };
}

/** Apply event auto-delta (no choices) and advance to playing phase. */
export function applyAutoEvent(state: GameState): GameState {
  if (!state.pendingEvent || state.pendingEvent.choices) return state;

  const event = state.pendingEvent;
  const newMetrics = event.delta ? applyDelta(state.metrics, event.delta) : state.metrics;
  const log = addLog(
    state.log,
    state.turn,
    `[Event] ${event.title}: ${event.description}`,
    'event'
  );

  const gameOverReason = checkGameOver(newMetrics);

  return {
    ...state,
    metrics: newMetrics,
    pendingEvent: null,
    phase: gameOverReason ? 'result' : 'playing',
    gameOverReason: gameOverReason ?? state.gameOverReason,
    log,
  };
}

/** Apply a player's choice to an event with choices. */
export function applyEventChoice(state: GameState, choice: EventChoice): GameState {
  if (!state.pendingEvent) return state;

  const event = state.pendingEvent;
  const newMetrics = applyDelta(state.metrics, choice.delta);
  const log = addLog(
    state.log,
    state.turn,
    `[Event] ${event.title} → ${choice.label}: ${choice.consequence}`,
    'event'
  );

  const gameOverReason = checkGameOver(newMetrics);

  return {
    ...state,
    metrics: newMetrics,
    pendingEvent: null,
    phase: gameOverReason ? 'result' : 'playing',
    gameOverReason: gameOverReason ?? state.gameOverReason,
    log,
  };
}

/** Player picks a decision and we apply immediate + queue delayed effects. */
export function applyDecision(state: GameState, decision: Decision): GameState {
  const newMetrics = applyDelta(state.metrics, decision.immediate);

  const delayedEffects = [...state.delayedEffects];
  if (decision.delayed) {
    delayedEffects.push({
      turnsRemaining: decision.delayed.turns,
      delta: decision.delayed.delta,
      description: decision.delayed.description,
      sourceDecisionId: decision.id,
    });
  }

  const cooldowns = { ...state.decisionCooldowns };
  if (decision.cooldown) {
    cooldowns[decision.id] = decision.cooldown;
  }

  const recentDecisions = [decision.id, ...state.recentDecisions].slice(0, 6);

  // Update stats
  const stats = { ...state.stats };
  stats.decisionCounts[decision.id] = (stats.decisionCounts[decision.id] ?? 0) + 1;
  if (decision.id === 'manual_mode') stats.timesManualMode++;
  if (decision.id === 'do_nothing') stats.timesIgnored++;

  let logText = `[Decision] ${decision.label}: ${decision.description}`;
  if (decision.delayed) {
    logText += ` (Effect in ${decision.delayed.turns} turns)`;
  }
  const log = addLog(state.log, state.turn, logText, 'decision');

  const gameOverReason = checkGameOver(newMetrics);

  // Advance turn
  const nextTurn = state.turn + 1;
  const won = nextTurn > state.totalTurns;

  if (gameOverReason) {
    return {
      ...state,
      metrics: newMetrics,
      delayedEffects,
      log,
      stats,
      recentDecisions,
      gameOverReason,
      phase: 'result',
      decisionCooldowns: cooldowns,
    };
  }

  if (won) {
    return {
      ...state,
      metrics: newMetrics,
      delayedEffects,
      log,
      stats,
      recentDecisions,
      gameOverReason: 'victory',
      phase: 'result',
      decisionCooldowns: cooldowns,
      turn: nextTurn,
    };
  }

  return {
    ...state,
    metrics: newMetrics,
    delayedEffects,
    log,
    stats,
    recentDecisions,
    decisionCooldowns: cooldowns,
    turn: nextTurn,
    phase: 'playing',
    pendingEvent: null,
  };
}

/** Pick 4 decisions for the player to choose from this turn. */
export function getAvailableDecisions(state: GameState): Decision[] {
  const cooldowns = state.decisionCooldowns;

  // Filter out decisions on cooldown
  const available = DECISIONS.filter(d => !(cooldowns[d.id] && cooldowns[d.id] > 0));

  // Always include do_nothing if available
  const doNothing = available.find(d => d.id === 'do_nothing');

  // Score others: avoid recent decisions, prefer varied
  const scored = available
    .filter(d => d.id !== 'do_nothing')
    .map(d => ({
      d,
      score: Math.random() * 10 - state.recentDecisions.indexOf(d.id) * 2,
    }))
    .sort((a, b) => b.score - a.score);

  const top3 = scored.slice(0, 3).map(s => s.d);
  const result = doNothing ? [...top3, doNothing] : top3.slice(0, 4);
  return result;
}

export function buildEndgameResult(state: GameState) {
  const { stats, metrics, turn, gameOverReason } = state;
  const won = gameOverReason === 'victory';

  // Score: weighted sum of final metrics, with turn bonus for victory
  const score = Math.round(
    (metrics.trust * 2 +
      metrics.sla * 1.5 +
      (100 - metrics.backlog) * 1.5 +
      (100 - metrics.cost) +
      metrics.energy +
      metrics.capacity) /
      8 +
      (won ? turn * 2 : 0)
  );

  const archetype = determineArchetype(stats, metrics);

  return {
    won,
    reason: gameOverReason ?? 'backlog',
    finalMetrics: metrics,
    score: clamp(score, 0, 999),
    archetype,
    stats,
    turnsPlayed: turn,
  };
}
