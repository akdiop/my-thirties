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
  it('chaque référence « Coran X:Y » de l’app existe', () => {
    const files = import.meta.glob(['../*.ts', '../../features/*.tsx', '../../screens/*.tsx'], { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
    const refs = Object.values(files).flatMap((t) => [...t.matchAll(/Coran (\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?/g)]);
    expect(refs.length).toBeGreaterThan(30);
    for (const m of refs) { const nb = index[Number(m[1]) - 1]?.[2] ?? 0; expect(Number(m[3] ?? m[2]), m[0]).toBeLessThanOrEqual(nb); }
  });
  it('relit un état incomplet', () => {
    expect(coranOf([]).state).toEqual({ lus: [], favoris: [], marque: undefined, khatm: 0, jours: [] });
  });
});
