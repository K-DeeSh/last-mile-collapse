# Last Mile Collapse

A small, complete, browser-based logistics management game. You are the last mile. Survive the quarter.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Production build

```bash
npm run build
```

Output goes to `dist/`. Serve it as a static site from any host (Vercel, Netlify, GitHub Pages, nginx, etc.).

```bash
npm run preview   # preview the production build locally
```

---

## How to play

- **40 turns** = one quarter. Survive all 40 to win.
- Each turn: orders arrive, deliveries happen, a random event may fire, then you pick one of 4 actions.
- Every action has **trade-offs** — there is no always-correct button.
- Some effects trigger **2–5 turns later**. Plan accordingly.

### Metrics

| Metric | What it means | Game over if… |
|--------|---------------|---------------|
| 📦 Backlog | Undelivered orders | ≥ 100 |
| 🚴 Capacity | Courier throughput | — |
| ⏱ SLA | Compliance rate | ≤ 8 |
| 💸 Cost | Operational burn | ≥ 100 |
| 🤝 Trust | Customer confidence | ≤ 8 |
| ⚡ Energy | Team reserves | ≤ 8 |

---

## Architecture

```
src/
├── types/index.ts          — All TypeScript interfaces (GameState, Metrics, Event, …)
├── data/
│   ├── events.ts           — 31 unique events (auto-apply + player choices)
│   ├── decisions.ts        — 15 decisions with immediate + delayed effects
│   └── archetypes.ts       — 13 end-game archetypes with conditions
├── game/
│   └── engine.ts           — Turn processing, game-over checks, endgame scoring
├── components/
│   ├── StartScreen.tsx
│   ├── TurnHeader.tsx
│   ├── MetricsPanel.tsx
│   ├── DecisionPanel.tsx
│   ├── EventCard.tsx
│   ├── LogPanel.tsx
│   └── EndScreen.tsx
├── styles/global.css       — All styling (dark dashboard theme, responsive)
├── App.tsx                 — State orchestration, turn flow
└── main.tsx
```

No external runtime dependencies beyond React. No backend, no API, no DB.

---

## Design decisions

**Turn-based, not real-time.** Reduces stress, allows mobile play, keeps the decision weight clear.

**Delayed effects as core mechanic.** Decisions that look good now degrade later. Forces the player to think 2–5 turns ahead and creates the "I caused this" feeling when things collapse.

**No dominant strategy.** Every decision trades off at least two metrics. Aggressive optimisation, manual mode, and cost-cutting all have payback windows.

**Balance approach:**
- Normal: forgiving first 10 turns, pressure builds to turn 30, hard sprint to turn 40.
- Peak Season: starts at higher backlog/lower capacity, events hit harder.
- Events spawn at 35% probability per turn. Choice events are weighted rarer than auto events.
- Natural SLA and trust drift are gentle — players must actively damage them for game over.

**High score** is persisted in `localStorage` (key: `lmc_highscore`).

---

## What's implemented

- ✅ Full 40-turn game loop with win/loss detection
- ✅ 6 metrics with game-over thresholds
- ✅ 15 decisions with immediate + delayed effects
- ✅ 31 unique events (25 auto, 6 with player choices)
- ✅ Delayed effects system (2–5 turn payback)
- ✅ 13 end-game archetypes based on play style
- ✅ Turn header with progress bar and order throughput
- ✅ Pending consequences panel
- ✅ Activity log (last 8 entries)
- ✅ Responsive layout (desktop + mobile portrait)
- ✅ Normal + Peak Season difficulty
- ✅ High score via localStorage
- ✅ Full result screen with score, archetype, statistics

## Possible future improvements

- Sound effects (optional toggle)
- Seed-based replay
- More decision variety (cooldown display)
- Combo/chain event system
- Per-run unlockable modifiers
