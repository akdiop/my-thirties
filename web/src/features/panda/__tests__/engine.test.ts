import { describe, expect, test } from 'vitest';
import type { Entry } from '../../../lib/cloud';
import { DAILY_CAP } from '../data';
import { addCare, eventsFrom, isGift, progress, readState } from '../engine';
import { ITEMS } from '../data';

const e = (id: string, module: string, kind: string, entry_date: string | null, data: Record<string, unknown> = {}) => ({ id, module, kind, title: id, entry_date, data, created_at: '2026-10-01T10:00:00Z', updated_at: '2026-10-01T10:00:00Z' }) as unknown as Entry;
const prefs = { linkPersonalActivities: true, useMoodContext: false, animationsEnabled: true };
const TODAY = '2026-11-02';

describe('adaptateur d’événements', () => {
  test('une activité = un événement, sans doublon ni futur', () => {
    const list = [e('s1', 'sport', 'session', '2026-11-01'), e('s1', 'sport', 'session', '2026-11-01'), e('s2', 'sport', 'session', '2026-12-01'),
      e('h1', 'quotidien', 'habit', null, { done: { '2026-10-30': true, '2026-10-31': true, '2026-11-01': false } })];
    const ev = eventsFrom(list, prefs, TODAY);
    expect(ev.map((x) => x.id).sort()).toEqual(['h1:2026-10-30', 'h1:2026-10-31', 's1']);
  });
  test('rien sans autorisation, et jamais le journal intime', () => {
    expect(eventsFrom([e('s1', 'sport', 'session', '2026-11-01')], { ...prefs, linkPersonalActivities: false }, TODAY)).toEqual([]);
    expect(eventsFrom([e('n1', 'equilibre', 'note', '2026-11-01', { body: 'secret' }), e('d1', 'quotidien', 'daily', '2026-11-01', { mood: 'Stressée' })], prefs, TODAY)).toEqual([]);
  });
});

describe('progression', () => {
  test('plafond quotidien d’XP', () => {
    const many = Array.from({ length: 20 }, (_, i) => e('s' + i, 'sport', 'session', '2026-11-01'));
    const p = progress(eventsFrom(many, prefs, TODAY), readState({}));
    expect(p.xp).toBe(DAILY_CAP.xp);
  });
  test('l’XP acquise ne baisse jamais (activité supprimée)', () => {
    const s = readState({ xpPeak: 350 });
    const p = progress([], s);
    expect(p.xp).toBe(350);
    expect(p.level.n).toBe(3);
  });
  test('niveaux et au-delà du niveau 5', () => {
    expect(progress([], readState({ xpPeak: 99 })).level.n).toBe(1);
    expect(progress([], readState({ xpPeak: 100 })).level.n).toBe(2);
    const top = progress([], readState({ xpPeak: 4000 }));
    expect(top.level.n).toBe(5); expect(top.next).toBeUndefined();
  });
  test('bambous : jamais négatifs', () => {
    expect(progress([], readState({ spent: 999 })).bamboo).toBe(0);
  });
});

describe('récompenses et interactions', () => {
  test('objet offert par un module', () => {
    const coussin = ITEMS.find((i) => i.id === 'coussin')!;
    expect(isGift(coussin, { repos: 3 } as never)).toBe(true);
    expect(isGift(coussin, { repos: 2 } as never)).toBe(false);
  });
  test('câlins plafonnés par jour', () => {
    let s = readState({});
    for (let i = 0; i < 20; i++) s = { ...s, ...addCare(s, 'pet', TODAY) };
    expect(s.care[TODAY]).toBe(5);
    expect(progress([], s).xp).toBe(DAILY_CAP.careXp + DAILY_CAP.playXp);
  });
});
