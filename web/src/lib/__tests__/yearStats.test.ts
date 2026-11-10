import { describe, expect, it } from 'vitest';
import type { Entry } from '../cloud';
import { yearStats, yearWindow } from '../yearStats';

const e = (kind: string, entry_date: string | null, data: Record<string, unknown> = {}): Entry =>
  ({ id: kind + Math.random(), module: 'equilibre', kind, title: kind, entry_date, data, created_at: '', updated_at: '' } as Entry);

describe('ma trentaine en chiffres', () => {
  it('compte depuis le dernier anniversaire', () => {
    expect(yearWindow('1992-03-14', new Date(2026, 10, 10))).toMatchObject({ from: '2026-03-14', label: 'Depuis mes 34 ans' });
    expect(yearWindow('1992-12-01', new Date(2026, 10, 10)).from).toBe('2025-12-01');
    expect(yearWindow('', new Date(2026, 10, 10)).from).toBe('2026-01-01');
  });
  it('additionne les données de la période', () => {
    const s = yearStats([
      e('sommeil', '2026-05-01', { h: 7 }), e('sommeil', '2025-01-01', { h: 9 }),
      e('habit', null, { done: { '2026-05-01': true, '2026-05-02': true, '2025-01-01': true } }),
      e('lecture', null, { status: 'lu', finished: '2026-06-01' }),
      e('daily', '2026-05-01', { water: 6, steps: 5000, intention: 'x' }),
      e('ramadan', '2026-02-18', { fasted: { '2026-03-20': true, '2026-02-20': true } }),
    ], '2026-03-14', '2026-11-10', (x) => Number(x.data.h) || 0);
    expect(s).toMatchObject({ nights: 1, avgSleep: 7, habits: 2, books: 1, water: 6, steps: 5000, notes: 1, fasts: 1 });
  });
});
