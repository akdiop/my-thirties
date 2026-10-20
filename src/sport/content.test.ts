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
    for (const p of PROGRAMS) expect(AXES.some((a) => a.id === p.axisId)).toBe(true);
    expect(new Set(PROGRAMS.map((p) => p.id)).size).toBe(PROGRAMS.length);
    const lengths = Object.fromEntries(PROGRAMS.map((p) => [p.id, p.days.length]));
    expect(lengths).toEqual({
      'anxiete-7': 7,
      'nervosite-7': 7,
      'impulsivite-7': 7,
      'anxiete-14': 14,
      'nervosite-14': 14,
      'impulsivite-14': 14,
      'confiance-7': 7,
      'lacher-prise-7': 7,
      'equilibre-30': 30,
    });
    for (const p of PROGRAMS) for (const d of p.days) expect(d.steps.length).toBeGreaterThan(0);
  });
});
