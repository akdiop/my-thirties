import { describe, expect, it } from 'vitest';
import { checklistShare, endOf, milestones, PILLARS, progressOf } from '../transformation';

describe('programme 3 mois', () => {
  it('dure 90 jours et situe le jour, le mois et la semaine', () => {
    expect(endOf('2026-11-10')).toBe('2027-02-07');
    expect(progressOf('2026-11-10', '2027-02-07', '2026-11-10')).toMatchObject({ day: 1, month: 1, week: 1, started: true, done: false });
    expect(progressOf('2026-11-10', '2027-02-07', '2027-01-01')).toMatchObject({ day: 53, month: 2, week: 8 });
    expect(progressOf('2026-11-10', '2027-02-07', '2027-03-01').done).toBe(true);
  });
  it('compte les engagements cochés, ajouts compris', () => {
    const r = checklistShare({ checks: { env1: true, 'env-c0': true }, custom: { env: ['Ranger mon bureau'] } }, PILLARS);
    expect(r.done).toBe(2);
    expect(r.total).toBe(PILLARS.reduce((n, s) => n + s.items.length, 0) + 1);
  });
  it('cinq paliers vers l’objectif, atteints selon la dernière mesure', () => {
    const m = milestones({ start: 70, target: 62 }, [{ date: '2026-11-20', value: 67.5 }]);
    expect(m.map((x) => x.delta)).toEqual([-1.6, -3.2, -4.8, -6.4, -8]);
    expect(m.filter((x) => x.reached)).toHaveLength(1);
    expect(milestones({})).toEqual([]);
  });
});
