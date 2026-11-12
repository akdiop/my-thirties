// Objectifs de dhikr de la journée (100 ou 1000 fois…). Fonctions pures, partagées avec l'app et testées.
type Data = Record<string, unknown>;
const mins = (t: unknown, d: number) => { const m = /^(\d{2}):(\d{2})$/.exec(String(t ?? '')); return m ? Number(m[1]) * 60 + Number(m[2]) : d; };

export const goalOf = (d: Data) => Math.max(1, Math.min(100000, Math.round(Number(d.goal) || 100)));
export const countOn = (d: Data, day: string) => Math.max(0, Number((d.counts as Record<string, number> | undefined)?.[day]) || 0);

/** Où j'en suis à cette heure : réparti régulièrement entre l'heure de début et l'heure de fin choisies. */
export function wirdPace(d: Data, day: string, minutesNow: number) {
  const goal = goalOf(d), done = countOn(d, day);
  const start = mins(d.start, 7 * 60), end = Math.max(start + 60, mins(d.end, 22 * 60));
  const share = Math.max(0, Math.min(1, (minutesNow - start) / (end - start)));
  const expected = Math.round(goal * share);
  return { goal, done, expected, behind: Math.max(0, expected - done), finished: done >= goal, left: Math.max(0, goal - done) };
}

/** Heures de rappel réparties dans la journée (4 par défaut), entre le début et la fin. */
export function wirdSlots(d: Data, n = 4) {
  const start = mins(d.start, 7 * 60), end = Math.max(start + 60, mins(d.end, 22 * 60));
  return Array.from({ length: n }, (_, i) => Math.round(start + ((i + 1) * (end - start)) / (n + 1)));
}
