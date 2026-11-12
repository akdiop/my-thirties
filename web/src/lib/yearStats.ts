/** « Ma trentaine en chiffres » : le récapitulatif d'une année de vie, d'un anniversaire au suivant. */
import type { Entry } from './cloud';
import { ageOn } from './profile';

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Depuis mon dernier anniversaire (ou depuis le 1er janvier sans date de naissance) jusqu'à aujourd'hui. */
export function yearWindow(birthDate: string, today: Date) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    const [, m, d] = birthDate.split('-').map(Number) as [number, number, number];
    let last = new Date(today.getFullYear(), m - 1, d);
    if (last > today) last = new Date(today.getFullYear() - 1, m - 1, d);
    const age = ageOn(birthDate, today);
    return { from: iso(last), to: iso(today), label: age ? 'Depuis mes ' + age + ' ans' : 'Depuis mon anniversaire' };
  }
  return { from: `${today.getFullYear()}-01-01`, to: iso(today), label: 'Depuis le 1er janvier' };
}

export type YearStats = {
  nights: number; avgSleep: number; habits: number; prayers: number; books: number; trips: number;
  challengeDays: number; notes: number; sessions: number; water: number; steps: number; fasts: number; wishes: number;
};

export function yearStats(entries: Entry[], from: string, to: string, sleepHoursOf: (e: Entry) => number): YearStats {
  const inRange = (d: unknown) => typeof d === 'string' && d.slice(0, 10) >= from && d.slice(0, 10) <= to;
  const dated = (kind: string) => entries.filter((e) => e.kind === kind && inRange(e.entry_date));
  const nights = dated('sommeil').map(sleepHoursOf).filter((h) => h > 0);
  const habits = entries.filter((e) => e.kind === 'habit').reduce((n, e) => n + Object.entries((e.data.done ?? {}) as Record<string, boolean>).filter(([d, v]) => v && inRange(d)).length, 0);
  const challengeDays = entries.filter((e) => e.kind === 'challenge' && inRange(e.entry_date))
    .reduce((n, e) => n + Object.values((e.data.progress ?? {}) as Record<string, { status?: string }>).filter((p) => p?.status === 'done').length, 0);
  const days = dated('daily');
  const fasts = entries.filter((e) => e.kind === 'ramadan').reduce((n, e) => n + Object.entries((e.data.fasted ?? {}) as Record<string, boolean>).filter(([d, v]) => v && inRange(d)).length, 0);
  return {
    nights: nights.length,
    avgSleep: nights.length ? nights.reduce((a, b) => a + b, 0) / nights.length : 0,
    habits,
    prayers: dated('prayer').length,
    books: entries.filter((e) => e.kind === 'lecture' && e.data.status === 'lu' && inRange(e.data.finished)).length,
    trips: dated('trip').length,
    challengeDays,
    notes: dated('note').length + days.filter((e) => e.data.intention || e.data.win).length,
    sessions: dated('session').length,
    water: days.reduce((n, e) => n + (Number(e.data.water) || 0), 0),
    steps: days.reduce((n, e) => n + (Number(e.data.steps) || 0), 0),
    fasts,
    wishes: entries.filter((e) => e.kind === 'voeu' && e.data.status === 'realise' && inRange(e.data.realisedOn)).length,
  };
}
