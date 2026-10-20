import { addDays, addMonths, daysBetween, isoWeekday, type ISODate } from './dates';

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type RecurrenceRule = {
  freq: Frequency;
  interval: number;
  weekdays?: number[];
  until?: ISODate;
  count?: number;
};

export const RECURRENCE_LABEL: Record<Frequency, string> = {
  daily: 'Tous les jours',
  weekly: 'Toutes les semaines',
  monthly: 'Tous les mois',
  yearly: 'Tous les ans',
};

const MAX_ITERATIONS = 5000;

export function occurrencesBetween(start: ISODate, rule: RecurrenceRule | null | undefined, from: ISODate, to: ISODate, exceptions: string[] = []) {
  const skip = new Set(exceptions);
  const out: ISODate[] = [];
  const push = (d: ISODate) => {
    if (d >= from && d <= to && !skip.has(d)) out.push(d);
  };

  if (!rule) {
    push(start);
    return out;
  }

  const interval = Math.max(1, Math.floor(rule.interval || 1));
  const limit = (d: ISODate, n: number) => (rule.until && d > rule.until) || (rule.count !== undefined && n >= rule.count) || d > to;
  let n = 0;

  if (rule.freq === 'weekly' && rule.weekdays?.length) {
    const days = [...new Set(rule.weekdays)].sort();
    const weekStart = addDays(start, 1 - isoWeekday(start));
    for (let w = 0; w < MAX_ITERATIONS; w += interval) {
      for (const wd of days) {
        const d = addDays(weekStart, w * 7 + wd - 1);
        if (d < start) continue;
        if (limit(d, n)) return out;
        n++;
        push(d);
      }
    }
    return out;
  }

  const periodDays = rule.freq === 'daily' ? 1 : rule.freq === 'weekly' ? 7 : 0;
  const first = periodDays && rule.count === undefined ? Math.max(0, Math.floor(daysBetween(start, from) / (periodDays * interval))) : 0;
  for (let i = first; i < first + MAX_ITERATIONS; i++) {
    const step = i * interval;
    const d =
      rule.freq === 'daily' ? addDays(start, step) : rule.freq === 'weekly' ? addDays(start, step * 7) : rule.freq === 'monthly' ? addMonths(start, step) : addMonths(start, step * 12);
    if (limit(d, n)) break;
    n++;
    push(d);
  }
  return out;
}

export function nextOccurrenceAfter(start: ISODate, rule: RecurrenceRule, after: ISODate) {
  return occurrencesBetween(start, rule, addDays(after, 1), addDays(after, 400 * Math.max(1, rule.interval)))[0] ?? null;
}

export function describeRule(rule: RecurrenceRule | null | undefined) {
  if (!rule) return 'Ne se répète pas';
  if (rule.interval > 1) {
    const unit = { daily: 'jours', weekly: 'semaines', monthly: 'mois', yearly: 'ans' }[rule.freq];
    return `${rule.freq === 'weekly' ? 'Toutes' : 'Tous'} les ${rule.interval} ${unit}`;
  }
  return RECURRENCE_LABEL[rule.freq];
}
