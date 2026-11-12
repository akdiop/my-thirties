import { describe, expect, it } from 'vitest';
import type { Entry } from '../cloud';
import { habitDaysLabel, habitScheduled, habitStreak } from '../rituals';
import { taskBuckets } from '../../features/TaskQuick';

const e = (kind: string, data: Record<string, unknown>, title = 'x') => ({ id: title + JSON.stringify(data), kind, module: 'quotidien', title, entry_date: (data.date as string) ?? null, data }) as unknown as Entry;

describe('habitudes : jours de répétition', () => {
  // 2026-11-09 est un lundi.
  const h = e('habit', { freq: 'daily', days: [0, 2, 4], done: { '2026-11-09': true, '2026-11-11': true, '2026-11-13': true } });
  it('sait si l’habitude est prévue', () => {
    expect(habitScheduled(h, '2026-11-09')).toBe(true);
    expect(habitScheduled(h, '2026-11-10')).toBe(false);
    expect(habitScheduled(e('habit', { freq: 'daily' }), '2026-11-10')).toBe(true);
    expect(habitDaysLabel(h)).toBe('lun, mer, ven');
    expect(habitDaysLabel(e('habit', { days: [0, 1, 2, 3, 4] }))).toBe('en semaine');
  });
  it('ne casse pas la série les jours non prévus', () => {
    expect(habitStreak(h, '2026-11-14')).toBe(3);
    expect(habitStreak(e('habit', { freq: 'daily', done: { '2026-11-13': true, '2026-11-11': true } }), '2026-11-13')).toBe(1);
  });
});

describe('tâches de l’accueil', () => {
  it('range en retard et aujourd’hui, à venir, et les faites du jour', () => {
    const b = taskBuckets([
      e('task', { date: '2026-11-10' }, 'retard'), e('task', { date: '2026-11-12', time: '16:00' }, 'jour'), e('task', { date: '2026-11-14' }, 'avenir'),
      e('task', { date: '2026-11-12', completed: true }, 'faite'), e('task', { date: '2026-11-01', completed: true }, 'vieille'),
    ], '2026-11-12');
    expect(b.jour.map((x) => x.title)).toEqual(['retard', 'jour']);
    expect(b.avenir.map((x) => x.title)).toEqual(['avenir']);
    expect(b.doneToday.map((x) => x.title)).toEqual(['faite']);
  });
});
