import { describe, expect, it } from 'vitest';
import { ACCORDS, accordDeLaSemaine } from '../quatreAccords';
import { DISTORSIONS } from '../tcc';

describe('Quatre accords', () => {
  it('relie chaque accord à un piège de pensée existant', () => {
    for (const a of ACCORDS) expect(DISTORSIONS.some((d) => d.id === a.piege)).toBe(true);
  });
  it('change d’accord chaque semaine et reste stable dans la semaine', () => {
    expect(accordDeLaSemaine('2026-11-16')).toBe(accordDeLaSemaine('2026-11-22'));
    expect(accordDeLaSemaine('2026-11-16')).not.toBe(accordDeLaSemaine('2026-11-23'));
  });
});
