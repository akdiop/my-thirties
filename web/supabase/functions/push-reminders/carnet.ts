// Carnet de vœux : la fenêtre d'écriture du mois. Fonctions pures, partagées avec l'app et testées.
// Fenêtre automatique : autour de l'ovulation estimée (14 jours avant les prochaines règles prévues), de J-2 à J+1.
// Sans règles notées, ou en mode manuel : le jour du mois choisi, et les 2 jours suivants.
const DAY = 86_400_000;
const at = (iso: string) => Date.parse(iso + 'T12:00:00Z');
const shift = (iso: string, n: number) => new Date(at(iso) + n * DAY).toISOString().slice(0, 10);

export type CarnetSettings = { mode?: 'auto' | 'manuel'; day?: number };
export type Window = { start: string; end: string; source: 'cycle' | 'manuel' };

/** Durée moyenne du cycle d'après les débuts de règles notés (entre 20 et 45 jours), sinon 28. */
export function cycleLength(starts: string[]) {
  const s = [...starts].sort();
  const gaps = s.slice(1).map((d, i) => Math.round((at(d) - at(s[i]!)) / DAY)).filter((g) => g >= 20 && g <= 45);
  return gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : 28;
}

/** Prochaine fenêtre d'écriture qui n'est pas encore terminée (celle en cours si aujourd'hui en fait partie). */
export function writingWindow(starts: string[], settings: CarnetSettings, today: string): Window {
  const last = [...starts].filter((d) => d <= today).sort().at(-1);
  if (settings.mode !== 'manuel' && last) {
    const len = cycleLength(starts);
    let next = shift(last, len);
    for (let i = 0; i < 24; i++) {
      const ov = shift(next, -14);
      const w = { start: shift(ov, -2), end: shift(ov, 1), source: 'cycle' as const };
      if (w.end >= today) return w;
      next = shift(next, len);
    }
  }
  const day = Math.max(1, Math.min(28, Math.round(Number(settings.day) || 1)));
  let month = today.slice(0, 7);
  for (let i = 0; i < 3; i++) {
    const start = month + '-' + String(day).padStart(2, '0');
    const w = { start, end: shift(start, 2), source: 'manuel' as const };
    if (w.end >= today) return w;
    const [y, m] = month.split('-').map(Number) as [number, number];
    month = m === 12 ? (y + 1) + '-01' : y + '-' + String(m + 1).padStart(2, '0');
  }
  return { start: today, end: today, source: 'manuel' };
}

export const inWindow = (w: Window, today: string) => today >= w.start && today <= w.end;
/** La veille du début : pour le rappel « Demain, ta page du mois t'attend ». */
export const isEve = (w: Window, today: string) => shift(w.start, -1) === today;
