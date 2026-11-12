import { MOODS, moodOf } from './rituals';

const LABELS = ['Épuisée', 'Fatiguée', 'Plutôt neutre', 'Plutôt bien', 'Rayonnante'];

/** Humeurs d'une semaine : niveau de 0 (épuisée) à 4 (rayonnante), humeur moyenne, bons jours de suite (bien ou rayonnante, jusqu'au dernier jour noté) et la plus fréquente. */
export function moodWeekStats(moods: (string | undefined)[]) {
  const levels = moods.map((m) => { const x = moodOf(m); return x ? MOODS.indexOf(x) : null; });
  const noted = levels.filter((v): v is number => v !== null);
  const avg = noted.length ? noted.reduce((a, b) => a + b, 0) / noted.length : null;
  let goodStreak = 0;
  for (let i = levels.length - 1; i >= 0; i--) { const v = levels[i]; if (v === null) { if (goodStreak) break; continue; } if (v >= 3) goodStreak++; else break; }
  const count = new Map<number, number>(); for (const v of noted) count.set(v, (count.get(v) ?? 0) + 1);
  const top = [...count.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0];
  return { levels, notes: noted.length, average: avg === null ? '' : LABELS[Math.round(avg)]!, goodStreak, common: top ? MOODS[top[0]]!.value : '' };
}
