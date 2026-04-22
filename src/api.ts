const API_URL = 'http://localhost:3001';

export interface LeaderboardEntry {
  login: string;
  score: number;
  archetype: string | null;
  difficulty: string | null;
  turns: number | null;
  victory: number | null;
  created_at: string;
}

export async function submitScore(payload: {
  login: string;
  score: number;
  victory: boolean;
  archetype: string;
  difficulty: string;
  turns: number;
  metrics: Record<string, number>;
  stats: Record<string, number | Record<string, number>>;
}): Promise<void> {
  try {
    await fetch(`${API_URL}/api/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game_id: 'last_mile_collapse', ...payload }),
    });
  } catch {
    // backend unavailable — silently ignore
  }
}

export async function fetchLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  try {
    const res = await fetch(`${API_URL}/api/leaderboard/last_mile_collapse?limit=${limit}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}
