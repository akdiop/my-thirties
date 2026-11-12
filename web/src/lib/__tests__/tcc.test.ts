import { describe, expect, it } from 'vitest';
import type { Entry } from '../cloud';
import { DISTORSIONS, echelleOf, exercices, OUTILS, outilOf, progres, PSYCHO_POSITIVE } from '../tcc';

const e = (kind: string, date: string | null, data: Record<string, unknown>) => ({ id: kind + date + JSON.stringify(data).length, kind, entry_date: date, data, module: 'equilibre', title: '' }) as unknown as Entry;

describe('outils TCC', () => {
  it('a des outils cohérents', () => {
    expect(DISTORSIONS).toHaveLength(12);
    expect(PSYCHO_POSITIVE).toHaveLength(6);
    expect(outilOf('valeurs')?.groupe).toBe('Psychologie positive');
    for (const o of [...OUTILS, ...PSYCHO_POSITIVE]) {
      expect(new Set(o.fields.map((f) => f.id)).size).toBe(o.fields.length);
      if (o.avant) expect(o.fields.some((f) => f.id === o.avant)).toBe(true);
      if (o.apres) expect(o.fields.some((f) => f.id === o.apres)).toBe(true);
    }
  });
  it('mesure la baisse d’intensité, la hausse d’humeur et les pièges qui reviennent', () => {
    const list = exercices([
      e('tcc', '2026-11-10', { outil: 'colonnes', values: { intensite: 80, intensiteApres: 40, distorsions: ['catastrophe', 'lecture'] } }),
      e('tcc', '2026-11-11', { outil: 'colonnes', values: { intensite: 50, intensiteApres: 40, distorsions: ['catastrophe'] } }),
      e('tcc', '2026-11-12', { outil: 'activite', values: { humeurAvant: 3, humeurApres: 6 } }),
      e('tcc', '2026-11-12', { outil: 'inconnu', values: {} }),
    ]);
    expect(list).toHaveLength(3);
    expect(list[0]!.date).toBe('2026-11-12');
    const p = progres(list);
    expect(p).toMatchObject({ total: 3, baisse: 35, mesures: 2, humeur: 3 });
    expect(p.pieges[0]).toEqual({ nom: 'Catastrophisme', n: 2 });
  });
  it('trie l’échelle de la marche la plus facile à la plus difficile', () => {
    expect(echelleOf([e('tcc_echelle', null, { items: [{ text: 'B', suds: 70 }, { text: 'A', suds: 30 }] })]).map((m) => m.text)).toEqual(['A', 'B']);
  });
});
