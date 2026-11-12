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

import { everyOf, suppStatus } from '../../../supabase/functions/push-reminders/supplements';

describe('compléments tous les X jours', () => {
  it('tous les jours par défaut', () => {
    expect(everyOf({})).toBe(1);
    expect(suppStatus({ start: '2026-11-01', done: { '2026-11-11': true } }, '2026-11-12')).toMatchObject({ due: true, late: 0 });
  });
  it('tous les 15 jours : prochaine prise 15 jours après la dernière, retard compté', () => {
    const d = { every: 15, start: '2026-10-01', done: { '2026-10-28': true } };
    expect(suppStatus(d, '2026-11-05')).toMatchObject({ due: false, next: '2026-11-12' });
    expect(suppStatus(d, '2026-11-12')).toMatchObject({ due: true, late: 0 });
    expect(suppStatus(d, '2026-11-14')).toMatchObject({ due: true, late: 2 });
    expect(suppStatus({ ...d, done: { ...d.done, '2026-11-14': true } }, '2026-11-14')).toMatchObject({ due: false, takenToday: true, next: '2026-11-29' });
  });
  it('avant la première prise : à prendre dès le début', () => {
    expect(suppStatus({ every: 30, start: '2026-11-20', done: {} }, '2026-11-12')).toMatchObject({ due: false, next: '2026-11-20' });
    expect(suppStatus({ every: 30, start: '2026-11-10', done: {} }, '2026-11-12')).toMatchObject({ due: true, late: 2 });
  });
});

import { cycleLength, inWindow, isEve, writingWindow } from '../../../supabase/functions/push-reminders/carnet';
import { pathByMonth, realisedBetween, tagCounts, wishes } from '../carnet';

describe('carnet de vœux', () => {
  it('estime la fenêtre d’écriture autour de l’ovulation', () => {
    const starts = ['2026-09-05', '2026-10-03', '2026-10-31'];
    expect(cycleLength(starts)).toBe(28);
    const w = writingWindow(starts, {}, '2026-11-05');
    expect(w).toEqual({ start: '2026-11-12', end: '2026-11-15', source: 'cycle' });
    expect(inWindow(w, '2026-11-13')).toBe(true);
    expect(isEve(w, '2026-11-11')).toBe(true);
    expect(writingWindow(starts, {}, '2026-11-16').start).toBe('2026-12-10');
  });
  it('sans cycle ou en mode manuel : le jour choisi', () => {
    expect(writingWindow([], { day: 20 }, '2026-11-05')).toEqual({ start: '2026-11-20', end: '2026-11-22', source: 'manuel' });
    expect(writingWindow([], { day: 3 }, '2026-11-12').start).toBe('2026-12-03');
    expect(writingWindow(['2026-10-31'], { mode: 'manuel', day: 1 }, '2026-11-12').start).toBe('2026-12-01');
  });
  it('suit les souhaits, les signes et les réalisations mois par mois', () => {
    const e = (id: string, title: string, data: Record<string, unknown>) => ({ id, kind: 'voeu', title, entry_date: '2026-10-12', data } as unknown as Entry);
    const list = [e('1', 'Un nouveau travail', { month: '2026-10', tag: 'Travail', status: 'realise', realisedOn: '2026-11-08', signs: [{ d: '2026-10-20', t: 'Un appel' }], people: [{ d: '2026-10-25', n: 'Awa' }] }),
      e('2', 'Voyager', { month: '2026-11', tag: 'Moi', status: 'chemin', signs: [] })];
    expect(wishes(list)).toHaveLength(2);
    expect(realisedBetween(list, '2026-11-02', '2026-11-08').map((w) => w.text)).toEqual(['Un nouveau travail']);
    const path = pathByMonth(list);
    expect(path.map((m) => m.month)).toEqual(['2026-11', '2026-10']);
    expect(path[0]!.realised).toHaveLength(1);
    expect(path[1]!.signs).toHaveLength(1);
    expect(tagCounts(wishes(list))).toEqual([{ tag: 'Moi', total: 1, done: 0 }, { tag: 'Travail', total: 1, done: 1 }]);
  });
});

const PAGES = new Set(Object.keys(import.meta.glob('../../../public/cours/*/*.jpg')).map((k) => k.replace('../../../', '')));

describe('livrets intégrés', () => {
  it('chaque page du sommaire existe', () => {
    for (const l of LESSONS.filter((x) => x.book)) {
      const b = l.book!;
      for (let n = 1; n <= b.pages; n++) expect(PAGES.has('public/cours/' + b.dir + '/p-' + String(n).padStart(2, '0') + '.jpg')).toBe(true);
      for (const [, n] of b.toc ?? []) expect(n).toBeLessThanOrEqual(b.pages);
    }
  });
});
