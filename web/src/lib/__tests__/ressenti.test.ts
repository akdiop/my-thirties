import { describe, expect, it } from 'vitest';
import type { Entry } from '../cloud';
import { bilanRessentis, coachContext, RESSENTIS, ressentiOf } from '../ressenti';

describe('je me sens…', () => {
  it('propose des gestes pour chaque émotion', () => {
    for (const r of RESSENTIS) expect(r.gestes.length).toBeGreaterThanOrEqual(3);
  });
  it('donne au coach le cadre et la situation', () => {
    const c = coachContext(ressentiOf('frustree')!, 7, 'Réunion annulée');
    expect(c).toContain('frustrée, intensité 7 sur 10');
    expect(c).toContain('Réunion annulée');
    expect(c).toContain('urgences');
  });
  it('fait le bilan des ressentis', () => {
    const e = (date: string, data: Record<string, unknown>) => ({ id: date + JSON.stringify(data), kind: 'ressenti', entry_date: date, created_at: date + 'T10:00:00Z', data }) as unknown as Entry;
    const b = bilanRessentis([e('2026-11-10', { emotion: 'anxieuse', intensite: 8, apres: 4 }), e('2026-11-11', { emotion: 'anxieuse', intensite: 6, apres: 4 }), e('2026-11-12', { emotion: 'triste', intensite: 5 })]);
    expect(b.frequents[0]).toEqual({ label: 'Anxieuse', n: 2 });
    expect(b.baisse).toBe(3);
    expect(b.list[0]!.date).toBe('2026-11-12');
  });
});
