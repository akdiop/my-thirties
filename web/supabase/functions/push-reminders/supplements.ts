// Compléments pris tous les X jours (tous les jours, tous les 15 jours…). Fonctions pures, partagées avec l'app et testées.
type Data = Record<string, unknown>;
const DAY = 86_400_000;
const at = (iso: string) => Date.parse(iso + 'T12:00:00Z');
const shift = (iso: string, n: number) => new Date(at(iso) + n * DAY).toISOString().slice(0, 10);

/** Écart entre deux prises, en jours (1 = tous les jours). */
export const everyOf = (d: Data) => Math.max(1, Math.min(365, Math.round(Number(d.every) || 1)));

/** Où en est la prise : faite aujourd'hui, à prendre aujourd'hui (éventuellement en retard), ou prochaine date. */
export function suppStatus(d: Data, today: string) {
  const every = everyOf(d), done = (d.done && typeof d.done === 'object' ? d.done : {}) as Record<string, boolean>;
  const start = String(d.start ?? today);
  const takenToday = Boolean(done[today]);
  const last = Object.keys(done).filter((k) => done[k] && k < today).sort().at(-1);
  const next = takenToday ? shift(today, every) : last ? shift(last, every) : start;
  const due = !takenToday && next <= today;
  return { every, takenToday, due, next, late: due ? Math.round((at(today) - at(next)) / DAY) : 0, last: takenToday ? today : last };
}
