import React, { useState, useCallback, useRef, useEffect } from 'react';
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
import { StartScreen } from './components/StartScreen';
import { MetricsPanel } from './components/MetricsPanel';
import { DecisionPanel } from './components/DecisionPanel';
import { EventCard } from './components/EventCard';
import { LogPanel } from './components/LogPanel';
import { EndScreen } from './components/EndScreen';
import { TurnHeader } from './components/TurnHeader';

type AppPhase = 'start' | 'game' | 'end';

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
  const [appPhase, setAppPhase] = useState<AppPhase>('start');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [endgameResult, setEndgameResult] = useState<EndgameResult | null>(null);
  const [prevMetrics, setPrevMetrics] = useState<GameState['metrics'] | undefined>(undefined);
  const [availableDecisions, setAvailableDecisions] = useState<Decision[]>([]);
  const [highScore, setHighScore] = useState<number | null>(loadHighScore);
  const [animKey, setAnimKey] = useState(0);

  // Track used event IDs to avoid repeats
  const usedEventIds = useRef<Set<string>>(new Set());

  const startGame = useCallback((difficulty: 'normal' | 'peak') => {
    usedEventIds.current = new Set();
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
      const result = buildEndgameResult(afterDecision);
      saveHighScore(result.score);
      setHighScore(loadHighScore);
      setEndgameResult(result);
      setGameState(afterDecision);
      setAppPhase('end');
      return;
    }

    // Process next turn start
    const afterTick = processTurnStart(afterDecision, usedEventIds.current);
    const decisions = getAvailableDecisions(afterTick);

    if (afterTick.phase === 'result') {
      const result = buildEndgameResult(afterTick);
      saveHighScore(result.score);
      setHighScore(loadHighScore);
      setEndgameResult(result);
      setGameState(afterTick);
      setAppPhase('end');
      return;
    }

    setGameState(afterTick);
    setAvailableDecisions(decisions);
  }, [gameState]);

  const handleEventContinue = useCallback(() => {
    if (!gameState?.pendingEvent) return;
    const event = gameState.pendingEvent;

    if (event.id) usedEventIds.current.add(event.id);

    const afterEvent = applyAutoEvent(gameState);

    if (afterEvent.phase === 'result') {
      const result = buildEndgameResult(afterEvent);
      saveHighScore(result.score);
      setHighScore(loadHighScore);
      setEndgameResult(result);
      setGameState(afterEvent);
      setAppPhase('end');
      return;
    }

    const decisions = getAvailableDecisions(afterEvent);
    setGameState(afterEvent);
    setAvailableDecisions(decisions);
  }, [gameState]);

  const handleEventChoice = useCallback((choiceIndex: number) => {
    if (!gameState?.pendingEvent) return;
    const event = gameState.pendingEvent;
    const choice = event.choices?.[choiceIndex];
    if (!choice) return;

    if (event.id) usedEventIds.current.add(event.id);

    const afterEvent = applyEventChoice(gameState, choice);

    if (afterEvent.phase === 'result') {
      const result = buildEndgameResult(afterEvent);
      saveHighScore(result.score);
      setHighScore(loadHighScore);
      setEndgameResult(result);
      setGameState(afterEvent);
      setAppPhase('end');
      return;
    }

    const decisions = getAvailableDecisions(afterEvent);
    setGameState(afterEvent);
    setAvailableDecisions(decisions);
  }, [gameState]);

  const handleRestart = useCallback(() => {
    setGameState(null);
    setEndgameResult(null);
    setPrevMetrics(undefined);
    setAppPhase('start');
  }, []);

  if (appPhase === 'start') {
    return <StartScreen onStart={startGame} highScore={highScore} />;
  }

  if (appPhase === 'end' && endgameResult) {
    return <EndScreen result={endgameResult} onRestart={handleRestart} />;
  }

  if (!gameState) return null;

  return (
    <div className="game-layout" key={animKey}>
      <header className="game-header">
        <span className="game-brand">📦 Last Mile Collapse</span>
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
              <h3 className="section-title">Pending Consequences</h3>
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
