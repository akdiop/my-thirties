import { AXES, PROGRAMS } from '@/equilibre/content';
import { FICHES, ficheById, YOGA_SESSIONS } from './content';

describe('editorial content integrity', () => {
  it('has unique fiche ids and sessions point to real postures', () => {
    expect(new Set(FICHES.map((f) => f.id)).size).toBe(FICHES.length);
    for (const s of YOGA_SESSIONS) for (const id of s.ficheIds) expect(ficheById(id)?.discipline).toBe('yoga');
  });

  it('covers the three disciplines', () => {
    for (const d of ['tennis', 'pilates', 'yoga']) expect(FICHES.some((f) => f.discipline === d)).toBe(true);
  });

  it('lists the three priority axes first and links programs to axes', () => {
    expect(AXES.slice(0, 3).map((a) => a.id)).toEqual(['anxiete', 'nervosite', 'impulsivite']);
    expect(AXES.slice(0, 3).every((a) => a.priority)).toBe(true);
    for (const p of PROGRAMS) {
      expect(AXES.some((a) => a.id === p.axisId)).toBe(true);
      expect(p.days).toHaveLength(7);
    }
  });
});
