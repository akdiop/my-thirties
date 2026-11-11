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

import { ALLAH_NAMES, PLAN_WEEKS } from '../asmaUlHusna';
import { LESSONS } from '../lessons';
import { allahNameOfDay } from '../todayLearning';

describe('les 99 noms d’Allah', () => {
  it('contient 99 noms numérotés (81 du Coran, 18 de la Sunna) répartis sur 6 semaines', () => {
    expect(ALLAH_NAMES).toHaveLength(99);
    expect(ALLAH_NAMES.map((x) => x.n)).toEqual(Array.from({ length: 99 }, (_, i) => i + 1));
    expect(ALLAH_NAMES.filter((x) => x.source === 'Sunna')).toHaveLength(18);
    expect(new Set(ALLAH_NAMES.map((x) => x.ar)).size).toBe(99);
    expect(PLAN_WEEKS.map((w) => w.length)).toEqual([18, 18, 18, 18, 18, 9]);
  });
  it('a sa fiche dans « Mes cours » et un nom du jour', () => {
    expect(LESSONS.find((l) => l.id === 'noms-allah')?.parts).toHaveLength(7);
    expect(allahNameOfDay('2026-11-10')).toBe(allahNameOfDay('2026-11-10'));
    expect(allahNameOfDay('2026-11-11')!.n).not.toBe(allahNameOfDay('2026-11-10')!.n);
  });
});

import { actsDone, DH_ACTS, DH_DAYS, dhulHijjaStatus } from '../dhulHijja';

describe('les 10 jours de Dhu al-Hijja', () => {
  it('a dix jours complets et compte les actes faits', () => {
    expect(DH_DAYS).toHaveLength(10);
    expect(DH_DAYS.every((d) => d.theme && d.question && d.quote.ref)).toBe(true);
    expect(actsDone({ days: { 3: { acts: { Fajr: true, Coran: true, Jeûne: true, Dhuhr: false } } } }, 3)).toBe(2);
    expect(DH_ACTS).toHaveLength(8);
  });
  it('sait où on en est dans le calendrier', () => {
    const s = dhulHijjaStatus('2026-11-10');
    expect(s && 'daysUntil' in s ? s.daysUntil : 0).toBeGreaterThan(0);
  });
});

describe('nouvelles fiches de Mes cours', () => {
  it('contient la prière de consultation et Retour vers Allah', () => {
    const ist = LESSONS.find((l) => l.id === 'istikhara');
    expect(ist?.parts[0]?.duas?.[0]?.note).toBe('Sahîh al-Boukhârî n° 7390');
    expect(LESSONS.find((l) => l.id === 'retour-allah')?.parts).toHaveLength(9);
  });
});

import { bilanDay, dayBefore } from '../day';

describe('bilan après minuit', () => {
  it('avant 4 h, le bilan porte sur la veille', () => {
    expect(bilanDay(new Date(2026, 10, 11, 0, 30))).toBe('2026-11-10');
    expect(bilanDay(new Date(2026, 10, 11, 3, 59))).toBe('2026-11-10');
    expect(bilanDay(new Date(2026, 10, 11, 4, 0))).toBe('2026-11-11');
    expect(dayBefore('2026-03-01')).toBe('2026-02-28');
  });
});
