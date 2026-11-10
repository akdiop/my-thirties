import { describe, expect, it } from 'vitest';
import { momentOf, waterOf } from '../moment';

describe('moments de la journée', () => {
  it('découpe la journée', () => {
    expect(momentOf(6)).toBe('matin');
    expect(momentOf(14)).toBe('journee');
    expect(momentOf(20)).toBe('soir');
    expect(momentOf(1)).toBe('nuit');
  });
  it('lit le nombre de verres d’eau', () => {
    expect(waterOf({ water: 3 })).toBe(3);
    expect(waterOf({})).toBe(0);
    expect(waterOf({ water: -2 })).toBe(0);
  });
});
