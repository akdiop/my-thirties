import { describe, expect, it } from 'vitest';
import type { Entry } from '../cloud';
import { exercicesHsp, OUTILS_HSP, PHRASES, progresHsp, SOS_HSP } from '../hypersensibilite';

const e = (date: string, outil: string, values: Record<string, unknown>) => ({ id: date + outil, kind: 'hsp', entry_date: date, data: { outil, values }, module: 'equilibre', title: '' }) as unknown as Entry;

describe('hypersensibilité', () => {
  it('a des exercices cohérents', () => {
    expect(OUTILS_HSP.length).toBeGreaterThanOrEqual(10); expect(SOS_HSP.length).toBeGreaterThan(3); expect(PHRASES.length).toBeGreaterThan(5);
    for (const o of OUTILS_HSP) {
      expect(new Set(o.fields.map((f) => f.id)).size).toBe(o.fields.length);
      for (const k of [o.avant, o.apres]) if (k) expect(o.fields.some((f) => f.id === k)).toBe(true);
    }
  });
  it('fait ressortir déclencheurs, aides et batterie', () => {
    const list = exercicesHsp([
      e('2026-11-10', 'surcharge', { pic: 8, apres: 3, declencheurs: ['Bruit', 'Foule'], aide: ['Silence'], signes: ['Irritabilité'] }),
      e('2026-11-11', 'batterie', { matin: 7, soir: 3, vide: ['Bruit'], recharge: ['Silence', 'Prière, dhikr'] }),
      e('2026-11-12', 'batterie', { matin: 6, soir: 5, vide: ['Imprévu'] }),
    ]);
    const p = progresHsp(list);
    expect(p).toMatchObject({ total: 3, batterieSoir: 4, baisse: 5 });
    expect(p.declencheurs[0]).toEqual({ nom: 'Bruit', n: 2 });
    expect(p.aide[0]).toEqual({ nom: 'Silence', n: 2 });
  });
});
