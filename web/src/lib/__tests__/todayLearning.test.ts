import { describe, expect, it } from 'vitest';
import { challengesToday, pickOfDay, quranPlan, quranRead, tafsirOfDay, wordOfDay } from '../todayLearning';
import type { Entry } from '../cloud';
import type { LangCourse } from '../langCourses/types';

const course = { lessons: [
  { lesson: [], phrases: [], vocab: [['a', 'a', 'A'], ['b', 'b', 'B']] },
  { lesson: [], phrases: [], vocab: [['c', 'c', 'C']] },
  { lesson: [], phrases: [], vocab: [['d', 'd', 'D']] },
] } as LangCourse;

describe('aujourd’hui, je n’oublie pas', () => {
  it('garde le même élément toute la journée et change le lendemain', () => {
    const list = [1, 2, 3, 4, 5];
    expect(pickOfDay(list, '2026-11-10')).toBe(pickOfDay(list, '2026-11-10'));
    expect(pickOfDay(list, '2026-11-11')).not.toBe(pickOfDay(list, '2026-11-10'));
    expect(pickOfDay([], '2026-11-10')).toBeUndefined();
  });

  it('prend le mot du jour jusqu’à l’étape en cours seulement', () => {
    const seen = new Set(Array.from({ length: 20 }, (_, i) => wordOfDay(course, { 0: true }, '2026-11-' + String(10 + i).padStart(2, '0'))?.[0]));
    expect([...seen].sort()).toEqual(['a', 'b', 'c']);
  });

  it('donne un tafsir tiré des cours', () => {
    const t = tafsirOfDay('2026-11-10');
    expect(t?.lesson).toMatch(/^Tafsir/);
  });

  it('avance la lecture du Coran une fois par jour et repart au début après la dernière page', () => {
    const d = { page: 45, perDay: 2 };
    expect(quranPlan(d, '2026-11-10')).toMatchObject({ from: 45, to: 46, doneToday: false });
    const after = quranRead(d, '2026-11-10');
    expect(after).toMatchObject({ page: 47, lastDone: '2026-11-10' });
    expect(quranPlan(after, '2026-11-10')).toMatchObject({ from: 45, to: 46, doneToday: true });
    expect(quranRead(after, '2026-11-10')).toMatchObject({ page: 47 });
    expect(quranPlan(after, '2026-11-11')).toMatchObject({ from: 47, to: 48 });
    expect(quranRead({ page: 604, perDay: 2 }, '2026-11-10')).toMatchObject({ page: 1, khatm: 1 });
  });

  it('montre l’action du jour des défis en cours', () => {
    const e = { id: '1', kind: 'challenge', title: 'Défi 30 jours bien-être mental', entry_date: '2026-11-08', data: { template: 'mental-30', start: '2026-11-08', days: '30', progress: { 3: { status: 'done' } } } } as unknown as Entry;
    const [c] = challengesToday([e], '2026-11-10');
    expect(c).toMatchObject({ day: 3, days: 30, done: true });
    expect(c!.action).toBe('Sors prendre l’air au moins 20 minutes.');
    expect(challengesToday([e], '2026-12-20')).toEqual([]);
  });
});
