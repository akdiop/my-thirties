import { describe, expect, it } from 'vitest';
import type { Entry } from '../cloud';
import { AMORCES, allGratitudes, gratitudeStreak, MATIN, programDay, PROGRAMME, questionsOf, SOIR } from '../gratitude';

const e = (kind: string, date: string, data: Record<string, unknown>) => ({ id: kind + date, kind, entry_date: date, data, module: 'equilibre', title: '' }) as unknown as Entry;

describe('ma gratitude', () => {
  it('a les listes complètes', () => {
    expect(MATIN).toHaveLength(13); expect(SOIR).toHaveLength(13); expect(AMORCES).toHaveLength(30); expect(PROGRAMME).toHaveLength(7);
  });
  it('change les trois questions chaque jour, sans doublon', () => {
    const a = questionsOf('matin', '2026-11-12'), b = questionsOf('matin', '2026-11-13');
    expect(new Set(a).size).toBe(3); expect(a).not.toEqual(b); expect(questionsOf('matin', '2026-11-12')).toEqual(a);
  });
  it('compte les jours du parcours', () => {
    expect(programDay('2026-11-10', '2026-11-12')).toBe(3);
    expect(programDay('2026-11-10', '2026-11-17')).toBe(0);
    expect(programDay(undefined, '2026-11-12')).toBe(0);
  });
  it('rassemble les gratitudes de partout et compte la série', () => {
    const list = allGratitudes([
      e('gratitude_jour', '2026-11-12', { matin: ['Le café', ''], soir: ['Maman'], p7: [] }),
      e('daily', '2026-11-11', { gratitudes: ['Le soleil', ' '] }),
      e('note', '2026-11-10', { folder: 'gratitude', body: 'Ma sœur' }),
      e('gratitude', '2026-11-08', { positive: 'Un\nDeux' }),
      e('note', '2026-11-09', { folder: 'journal', body: 'pas une gratitude' }),
    ]);
    expect(list.map((g) => g.text)).toEqual(['Le café', 'Maman', 'Le soleil', 'Ma sœur', 'Un', 'Deux']);
    expect(gratitudeStreak(list, '2026-11-12')).toBe(3);
    expect(gratitudeStreak(list, '2026-11-13')).toBe(3);
  });
});
