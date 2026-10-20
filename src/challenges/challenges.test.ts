import { adapt, buildPlan, cellState, CHALLENGE_TEMPLATES, cycleStatus, dayIndexFor, postponeFrom, proposals, summary } from './challenges';

describe('challenge plans', () => {
  it('builds a 30-day squat plan with rest every fourth day', () => {
    const plan = buildPlan(CHALLENGE_TEMPLATES[0]!);
    expect(plan).toHaveLength(30);
    expect(plan.slice(0, 8)).toEqual([15, 15, 20, 0, 20, 25, 25, 0]);
    expect(plan.filter((v) => v === 0)).toHaveLength(7);
    expect(Math.max(...plan)).toBeLessThanOrEqual(75);
  });

  it('keeps every template at a moderate volume', () => {
    for (const t of CHALLENGE_TEMPLATES) {
      const plan = buildPlan(t);
      const max = Math.max(...plan);
      expect(max).toBeLessThanOrEqual(t.unit === 'seconds' ? 90 : t.unit === 'minutes' ? 30 : 80);
      expect(plan.some((v) => v === 0) || t.restEvery === 0).toBe(true);
    }
  });
});

describe('challenge days', () => {
  const plan = [10, 10, 0, 15];

  it('derives the day number from the start date', () => {
    expect(dayIndexFor('2026-10-07', '2026-10-20')).toBe(14);
  });

  it('computes cell states without punishing missed days', () => {
    expect(cellState(plan, 1, 2, 'done')).toBe('done');
    expect(cellState(plan, 3, 2, undefined)).toBe('planned-rest');
    expect(cellState(plan, 2, 2, undefined)).toBe('today');
    expect(cellState(plan, 1, 4, undefined)).toBe('pending');
  });

  it('summarises progress; a missed day never resets it', () => {
    const records = new Map([[1, 'done' as const], [2, 'missed' as const], [4, 'done' as const]]);
    expect(summary(plan, 4, records)).toEqual({ done: 2, rest: 1, missed: 1, elapsed: 4, total: 4 });
  });

  it('cycles done → missed → rest → done', () => {
    expect(cycleStatus('done')).toBe('missed');
    expect(cycleStatus('missed')).toBe('rest');
    expect(cycleStatus('rest')).toBe('done');
    expect(cycleStatus('pending')).toBe('rest');
  });

  it('adapts intensity and postpones by inserting a rest day', () => {
    expect(adapt(40)).toBe(32);
    expect(adapt(1)).toBe(1);
    expect(postponeFrom([1, 2, 3], 2)).toEqual([1, 0, 2, 3]);
  });

  it('proposes lighter challenges after a hard month', () => {
    const p = proposals(['squats'], 0.4);
    expect(p.every((x) => x.template.id !== 'squats' && x.easier)).toBe(true);
    expect(p.length).toBeLessThanOrEqual(3);
  });
});
