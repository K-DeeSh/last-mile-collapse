import React, { useState, useCallback, useRef } from 'react';
import { GameState, Decision, EndgameResult } from './types';
import {
  createInitialState,
  processTurnStart,
  applyAutoEvent,
  applyEventChoice,
  applyDecision,
  getAvailableDecisions,
  buildEndgameResult,
} from './game/engine';
import { LoginScreen, getSavedLogin } from './components/LoginScreen';
import { StartScreen } from './components/StartScreen';
import { MetricsPanel } from './components/MetricsPanel';
import { DecisionPanel } from './components/DecisionPanel';
import { EventCard } from './components/EventCard';
import { LogPanel } from './components/LogPanel';
import { EndScreen } from './components/EndScreen';
import { TurnHeader } from './components/TurnHeader';
import { startSession, submitScore } from './api';

type AppPhase = 'login' | 'start' | 'game' | 'end';

const HIGH_SCORE_KEY = 'lmc_highscore';

function loadHighScore(): number | null {
  try {
    const val = localStorage.getItem(HIGH_SCORE_KEY);
    return val ? parseInt(val) : null;
  } catch {
    return null;
  }
}

function saveHighScore(score: number) {
  try {
    const current = loadHighScore();
    if (current === null || score > current) {
      localStorage.setItem(HIGH_SCORE_KEY, String(score));
    }
  } catch {
    // ignore
  }
}

export const App: React.FC = () => {
  const [login, setLogin] = useState<string>(() => getSavedLogin());
  const [appPhase, setAppPhase] = useState<AppPhase>(() => getSavedLogin() ? 'start' : 'login');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [endgameResult, setEndgameResult] = useState<EndgameResult | null>(null);
  const [prevMetrics, setPrevMetrics] = useState<GameState['metrics'] | undefined>(undefined);
  const [availableDecisions, setAvailableDecisions] = useState<Decision[]>([]);
  const [highScore, setHighScore] = useState<number | null>(loadHighScore);
  const [animKey, setAnimKey] = useState(0);

  // Track used event IDs to avoid repeats
  const usedEventIds = useRef<Set<string>>(new Set());
  const sessionTokenRef = useRef<string | null>(null);

  const finishGame = useCallback((result: EndgameResult, state: GameState) => {
    saveHighScore(result.score);
    setHighScore(loadHighScore);
    setEndgameResult(result);
    setGameState(state);
    setAppPhase('end');
    submitScore({
      login,
      score: result.score,
      victory: result.won,
      archetype: result.archetype.name,
      difficulty: result.won ? state.difficulty : state.difficulty,
      turns: result.turnsPlayed,
      metrics: result.finalMetrics as unknown as Record<string, number>,
      stats: {
        totalOrdersDelivered: result.stats.totalOrdersDelivered,
        maxBacklogReached: result.stats.maxBacklogReached,
        timesBacklogCritical: result.stats.timesBacklogCritical,
        timesManualMode: result.stats.timesManualMode,
        timesIgnored: result.stats.timesIgnored,
      },
      token: sessionTokenRef.current,
    });
    sessionTokenRef.current = null;
  }, [login]);

  const startGame = useCallback((difficulty: 'normal' | 'peak') => {
    usedEventIds.current = new Set();
    startSession('last_mile_collapse').then(token => { sessionTokenRef.current = token; });
    const initial = createInitialState(difficulty);
    // Process turn 1 start immediately
    const afterTick = processTurnStart(initial, usedEventIds.current);
    const decisions = getAvailableDecisions(afterTick);
    setGameState(afterTick);
    setAvailableDecisions(decisions);
    setPrevMetrics(undefined);
    setAnimKey(k => k + 1);
    setAppPhase('game');
  }, []);

  const handleDecision = useCallback((decision: Decision) => {
    if (!gameState) return;
    setPrevMetrics({ ...gameState.metrics });

    const afterDecision = applyDecision(gameState, decision);
    setAnimKey(k => k + 1);

    if (afterDecision.phase === 'result') {
      finishGame(buildEndgameResult(afterDecision), afterDecision);
      return;
    }

    // Process next turn start
    const afterTick = processTurnStart(afterDecision, usedEventIds.current);
    const decisions = getAvailableDecisions(afterTick);

    if (afterTick.phase === 'result') {
      finishGame(buildEndgameResult(afterTick), afterTick);
      return;
    }

    setGameState(afterTick);
    setAvailableDecisions(decisions);
  }, [gameState, finishGame]);

  const handleEventContinue = useCallback(() => {
    if (!gameState?.pendingEvent) return;
    const event = gameState.pendingEvent;

    if (event.id) usedEventIds.current.add(event.id);

    const afterEvent = applyAutoEvent(gameState);

    if (afterEvent.phase === 'result') {
      finishGame(buildEndgameResult(afterEvent), afterEvent);
      return;
    }

    const decisions = getAvailableDecisions(afterEvent);
    setGameState(afterEvent);
    setAvailableDecisions(decisions);
  }, [gameState, finishGame]);

  const handleEventChoice = useCallback((choiceIndex: number) => {
    if (!gameState?.pendingEvent) return;
    const event = gameState.pendingEvent;
    const choice = event.choices?.[choiceIndex];
    if (!choice) return;

    if (event.id) usedEventIds.current.add(event.id);

    const afterEvent = applyEventChoice(gameState, choice);

    if (afterEvent.phase === 'result') {
      finishGame(buildEndgameResult(afterEvent), afterEvent);
      return;
    }

    const decisions = getAvailableDecisions(afterEvent);
    setGameState(afterEvent);
    setAvailableDecisions(decisions);
  }, [gameState, finishGame]);

  const handleRestart = useCallback(() => {
    setGameState(null);
    setEndgameResult(null);
    setPrevMetrics(undefined);
    setAppPhase('start');
  }, []);

  if (appPhase === 'login') {
    return <LoginScreen onLogin={(l) => { setLogin(l); setAppPhase('start'); }} />;
  }

  if (appPhase === 'start') {
    return <StartScreen onStart={startGame} highScore={highScore} login={login} />;
  }

  if (appPhase === 'end' && endgameResult) {
    return <EndScreen result={endgameResult} onRestart={handleRestart} />;
  }

  if (!gameState) return null;

  return (
    <div className="game-layout" key={animKey}>
      <header className="game-header">
        <span className="game-brand">📦 Last Mile Collapse</span>
        {/* название оставляем на английском — это бренд игры */}
      </header>

      <TurnHeader
        turn={gameState.turn}
        totalTurns={gameState.totalTurns}
        ordersIn={gameState.ordersThisTurn}
        deliveriesOut={gameState.deliveriesThisTurn}
        difficulty={gameState.difficulty}
      />

      <main className="game-main">
        <section className="game-left">
          <MetricsPanel metrics={gameState.metrics} prevMetrics={prevMetrics} />
          {gameState.delayedEffects.length > 0 && (
            <div className="pending-effects">
              <h3 className="section-title">Отложенные последствия</h3>
              {gameState.delayedEffects.map((e, i) => (
                <div key={i} className="pending-effect-item">
                  <span className="pending-turns">in {e.turnsRemaining}t</span>
                  <span className="pending-desc">{e.description}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="game-right">
          <DecisionPanel
            decisions={availableDecisions}
            onSelect={handleDecision}
            disabled={gameState.phase === 'event'}
          />
          <LogPanel log={gameState.log} currentTurn={gameState.turn} />
        </section>
      </main>

      {gameState.phase === 'event' && gameState.pendingEvent && (
        <EventCard
          event={gameState.pendingEvent}
          onContinue={handleEventContinue}
          onChoice={handleEventChoice}
        />
      )}
    </div>
  );
};
