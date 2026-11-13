import { describe, expect, it } from 'vitest';
import { coranOf, refCoran, versetDuJourRef, VERSETS_DU_JOUR, type SourateIndex } from '../coran';
import data from '../../../public/coran/index.json';

const index = data as SourateIndex[];

describe('Coran', () => {
  it('contient les 114 sourates et les 6236 versets', () => {
    expect(index).toHaveLength(114);
    expect(index.reduce((t, [, , nb]) => t + nb, 0)).toBe(6236);
  });
  it('chaque verset du jour existe', () => {
    for (const [s, v] of VERSETS_DU_JOUR) expect(v).toBeLessThanOrEqual(index[s - 1]![2]);
    expect(VERSETS_DU_JOUR).toContainEqual(versetDuJourRef('2026-11-13'));
  });
  it('lit les références', () => {
    expect(refCoran('Coran 3:200')).toEqual([3, 200]);
    expect(refCoran('3.200')).toEqual([3, 200]);
    expect(refCoran('Coran 200:1')).toBeNull();
  });
  it('relit un état incomplet', () => {
    expect(coranOf([]).state).toEqual({ lus: [], favoris: [], marque: undefined, khatm: 0 });
  });
});
