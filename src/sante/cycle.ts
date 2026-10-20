import { addDays, daysBetween, type ISODate } from '@/agenda/dates';

export type Period = { startDate: ISODate; endDate: ISODate | null };

export const DEFAULT_CYCLE = 28;
export const DEFAULT_PERIOD = 5;

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

export function cycleStats(periods: Period[]) {
  const sorted = [...periods].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const lengths = sorted.slice(1).map((p, i) => daysBetween(sorted[i]!.startDate, p.startDate)).filter((n) => n >= 15 && n <= 60).slice(-6);
  const durations = sorted.filter((p) => p.endDate).map((p) => daysBetween(p.startDate, p.endDate!) + 1).filter((n) => n >= 1 && n <= 12).slice(-6);
  const cycle = lengths.length ? Math.round(mean(lengths)) : DEFAULT_CYCLE;
  const spread = lengths.length >= 2 ? Math.max(...lengths) - Math.min(...lengths) : null;
  return {
    cycleLength: cycle,
    periodLength: durations.length ? Math.round(mean(durations)) : DEFAULT_PERIOD,
    basedOn: lengths.length,
    regular: spread !== null && spread <= 7,
    variability: spread,
  };
}

export function predict(periods: Period[], today: ISODate) {
  const last = [...periods].sort((a, b) => b.startDate.localeCompare(a.startDate))[0];
  if (!last) return null;
  const stats = cycleStats(periods);
  let next = addDays(last.startDate, stats.cycleLength);
  while (next < today) next = addDays(next, stats.cycleLength);
  const margin = stats.basedOn >= 3 && stats.variability !== null ? Math.max(2, Math.ceil(stats.variability / 2)) : 4;
  const ovulation = addDays(next, -14);
  return {
    cycleDay: daysBetween(last.startDate, today) + 1,
    nextStart: next,
    window: [addDays(next, -margin), addDays(next, margin)] as const,
    ovulation: ovulation > today ? ovulation : null,
    confidence: stats.basedOn >= 3 ? ('moyenne' as const) : ('faible' as const),
    stats,
  };
}

export function periodDays(periods: Period[], today: ISODate, defaultLength = DEFAULT_PERIOD) {
  const days = new Set<ISODate>();
  for (const p of periods) {
    const end = p.endDate ?? (addDays(p.startDate, defaultLength - 1) < today ? addDays(p.startDate, defaultLength - 1) : today);
    for (let d = p.startDate; d <= end; d = addDays(d, 1)) days.add(d);
  }
  return days;
}

export const CYCLE_DISCLAIMER =
  'Prévisions indicatives, calculées sur vos cycles passés. Elles ne sont ni un diagnostic ni une méthode de contraception.';
