import { cellState, dayIndexFor, summary, UNIT_SHORT, type ChallengeUnit, type DayStatus } from '@/challenges/challenges';
import type { Challenge } from '@/db/schema';

export function challengeView(c: Challenge, records: Map<number, DayStatus>, today: string) {
  const todayIndex = dayIndexFor(c.startDate, today);
  const s = summary(c.plan, todayIndex, records);
  const value = c.plan[todayIndex - 1];
  return {
    todayIndex,
    summary: s,
    finished: todayIndex > c.plan.length,
    notStarted: todayIndex < 1,
    todayValue: value,
    todayState: todayIndex >= 1 && todayIndex <= c.plan.length ? cellState(c.plan, todayIndex, todayIndex, records.get(todayIndex)) : null,
  };
}

export const formatAmount = (value: number, unit: string) => (unit === 'reps' ? `${value}` : `${value} ${UNIT_SHORT[unit as ChallengeUnit]}`);
