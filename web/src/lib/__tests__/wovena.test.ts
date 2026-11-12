import { describe, expect, it } from 'vitest';
import type { Entry } from '../cloud';
import { activeHabits, countData, easierRule, monthReview, countOn, everyWait, expectedOver, habitDaysLabel, habitDue, habitRule, habitScheduled, habitStreak, momentNow, momentRank, periodCount, ruleData, ruleLabel, stepData, toggleData, weekTarget } from '../rituals';
import { doneWith, dueOn, inSeason, remindMinute, remindOn } from '../../../supabase/functions/push-reminders/habits';
import { routineMilestones } from '../../features/panda/engine';
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

describe('recherche et mot doux', () => {
  it('ouvre chaque résultat au bon endroit', async () => {
    const { targetOf } = await import('../../screens/GlobalSearch');
    expect(targetOf(e('note', {})).screen).toBe('notes');
    expect(targetOf(e('daily', { date: '2026-11-12' }))).toEqual({ screen: 'myday', day: '2026-11-12' });
    expect(targetOf(e('series', {})).screen).toBe('culture');
    expect(targetOf(e('expense', {})).screen).toBe('entry');
  });
  it('encourage selon l’avancée', async () => {
    const { cheerOf } = await import('../../features/TodayCard');
    expect(cheerOf(3, 3, 600)).toContain('Tout est fait');
    expect(cheerOf(2, 4, 600)).toBe('Joli rythme, continue.');
    expect(cheerOf(0, 4, 1200)).toBe('Une petite chose ce soir suffit.');
  });
});

describe('habitudes : fréquences', () => {
  it('lit les anciennes fréquences et les nouvelles', () => {
    expect(habitRule(e('habit', { freq: '3w' }))).toEqual({ type: 'week', n: 3 });
    expect(habitRule(e('habit', {}))).toEqual({ type: 'daily', n: 1 });
    expect(habitRule(e('habit', { freq: 'month', n: 99 }))).toEqual({ type: 'month', n: 15 });
    expect(ruleLabel({ type: 'every', n: 3 })).toBe('Tous les 3 jours');
    expect(ruleLabel({ type: 'month', n: 1 })).toBe('1 fois par mois');
    expect(ruleData({ type: 'daily', n: 1 })).toEqual({ freq: 'daily', n: null });
  });
  it('tous les 3 jours : échéance et série', () => {
    const g = e('habit', { freq: 'every', n: 3, done: { '2026-11-03': true, '2026-11-06': true, '2026-11-09': true } });
    expect(everyWait(g, '2026-11-10')).toBe(2);
    expect(habitDue(g, '2026-11-10')).toBe(false);
    expect(habitDue(g, '2026-11-12')).toBe(true);
    expect(habitStreak(g, '2026-11-12')).toBe(3);
    expect(habitStreak(g, '2026-11-13')).toBe(0);
    expect(habitDue(e('habit', { freq: 'every', n: 3 }), '2026-11-10')).toBe(true);
  });
  it('par mois : avancement et série', () => {
    const p = e('habit', { freq: 'month', n: 1, done: { '2026-09-20': true, '2026-10-02': true, '2026-11-05': true } });
    expect(periodCount(p, '2026-11-12')).toBe(1);
    expect(habitStreak(p, '2026-11-12')).toBe(3);
    expect(habitDue(p, '2026-11-12')).toBe(false);
    expect(expectedOver({ type: 'month', n: 1 }, 90)).toBe(3);
    expect(weekTarget({ type: 'every', n: 3 })).toBe(3);
  });
});

describe('habitudes : pause, rappels, compteur, étapes, moment, archives', () => {
  it('la pause ne casse pas la série et retire l’habitude du jour', () => {
    const h = e('habit', { freq: 'daily', pause: { from: '2026-11-05', to: '2026-11-08' }, done: { '2026-11-03': true, '2026-11-04': true, '2026-11-09': true } });
    expect(habitStreak(h, '2026-11-09')).toBe(3);
    expect(habitDue(h, '2026-11-06')).toBe(false);
    const g = e('habit', { freq: 'every', n: 3, pause: { from: '2026-11-04', to: '2026-11-10' }, done: { '2026-11-02': true } });
    expect(everyWait(g, '2026-11-03')).toBe(2);
    expect(everyWait(g, '2026-11-11')).toBe(1);
    expect(everyWait(g, '2026-11-12')).toBe(0);
  });
  it('rappel par semaine et par mois seulement si l’objectif manque', () => {
    const w = e('habit', { freq: 'week', n: 1, remind: { on: true, day: 6 }, done: {} });
    expect(remindOn(w.data, '2026-11-15')).toBe(true);
    expect(remindOn(w.data, '2026-11-14')).toBe(false);
    expect(remindOn({ ...w.data, done: { '2026-11-10': true } }, '2026-11-15')).toBe(false);
    const m = e('habit', { freq: 'month', n: 1, remind: { on: true }, done: {} });
    expect(remindOn(m.data, '2026-11-28')).toBe(true);
    expect(remindOn(m.data, '2026-11-27')).toBe(false);
    expect(remindOn({ ...m.data, remind: { on: true, mday: 15 } }, '2026-11-15')).toBe(true);
    expect(remindOn({ ...m.data, archived: '2026-11-01' }, '2026-11-28')).toBe(false);
  });
  it('compteur et étapes cochent l’habitude une fois complets', () => {
    const c = e('habit', { goal: { target: 3, unit: 'verres' }, done: {} });
    expect(countData(c, '2026-11-12', 2).done).toEqual({ '2026-11-12': false });
    expect(countData(c, '2026-11-12', 3).done).toEqual({ '2026-11-12': true });
    expect(countOn(e('habit', { goal: { target: 3 }, done: { '2026-11-12': true } }), '2026-11-12')).toBe(3);
    const s = e('habit', { steps: ['Démaquiller', 'Sérum'], stepsDone: { '2026-11-12': [0] }, done: {} });
    expect(stepData(s, '2026-11-12', 1).done).toEqual({ '2026-11-12': true });
    expect(toggleData(s, '2026-11-12', false).stepsDone).toEqual({ '2026-11-12': [] });
  });
  it('moment présent en premier, archives à part', () => {
    expect(momentNow(8)).toBe('matin');
    expect(momentRank('soir', 'soir')).toBeLessThan(momentRank('matin', 'soir'));
    expect(momentRank('', 'soir')).toBeGreaterThan(momentRank('midi', 'soir'));
    expect(activeHabits([e('habit', {}, 'a'), e('habit', { archived: '2026-11-01' }, 'b')]).map((x) => x.title)).toEqual(['a']);
  });
});

describe('habitudes : cycle, prière, saison, Santé, bilan du mois, panda', () => {
  it('repos pendant les règles et saison', () => {
    const c = { freq: 'daily', cycleRest: true, done: { '2026-11-01': true, '2026-11-02': true, '2026-11-09': true } };
    const ctx = { cycleStarts: ['2026-11-03'] };
    expect(dueOn(c, '2026-11-05', ctx)).toBe(false);
    expect(dueOn(c, '2026-11-08', ctx)).toBe(true);
    expect(habitStreak(e('habit', { ...c, done: { ...c.done, '2026-11-08': true } }), '2026-11-09', ctx)).toBe(4);
    expect(inSeason({ season: { type: 'dates', from: '12-01', to: '02-28' } }, '2027-01-15')).toBe(true);
    expect(inSeason({ season: { type: 'dates', from: '12-01', to: '02-28' } }, '2026-11-15')).toBe(false);
    expect(inSeason({ season: { type: 'ramadan' } }, '2027-02-20')).toBe(true);
    expect(inSeason({ season: { type: 'ramadan' } }, '2026-11-15')).toBe(false);
  });
  it('rappel après la prière et objectif rempli par Santé', () => {
    expect(remindMinute({ prayer: 'Fajr', remind: { on: true, after: 15 } }, [{ name: 'Fajr', time: '05:40' }])).toBe(5 * 60 + 55);
    expect(remindMinute({ prayer: 'Fajr', remind: { on: true, time: '07:00' } }, [])).toBe(7 * 60);
    const w = { goal: { target: 8000, unit: 'pas', source: 'pas' }, done: {} };
    const ctx = { daily: { '2026-11-12': { steps: 9120 } } };
    expect(doneWith(w, '2026-11-12', ctx)).toBe(true);
    expect(countOn(e('habit', w), '2026-11-12', ctx)).toBe(9120);
    expect(remindOn({ ...w, remind: { on: true } }, '2026-11-12', ctx)).toBe(false);
  });
  it('bilan du mois et fréquence plus douce', () => {
    const good = e('habit', { freq: 'daily', done: Object.fromEntries(Array.from({ length: 12 }, (_, i) => ['2026-11-' + String(i + 1).padStart(2, '0'), true])) }, 'bon');
    const low = e('habit', { freq: 'daily', done: { '2026-11-02': true } }, 'bas');
    const m = monthReview([low, good], '2026-11-12');
    expect(m.best?.e.title).toBe('bon');
    expect(m.struggling?.e.title).toBe('bas');
    expect(m.suggestion).toEqual({ type: 'week', n: 4 });
    expect(easierRule({ type: 'week', n: 1 })).toEqual({ type: 'month', n: 3 });
  });
  it('panda : palier de 7 jours de routine complète', () => {
    const done = Object.fromEntries(Array.from({ length: 15 }, (_, i) => ['2026-11-' + String(i + 1).padStart(2, '0'), true]));
    expect(routineMilestones(done)).toEqual(['2026-11-07', '2026-11-14']);
  });
});
