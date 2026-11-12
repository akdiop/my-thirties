import { describe, expect, it } from 'vitest';
import { moodWeekStats } from '../moodStats';

describe('humeurs de la semaine', () => {
  it('donne la moyenne, les bons jours de suite et la plus fréquente', () => {
    const s = moodWeekStats(['Fatiguée', 'Bien', undefined, 'Bien', 'Rayonnante', 'Bien', undefined]);
    expect(s.levels).toEqual([1, 3, null, 3, 4, 3, null]);
    expect(s).toMatchObject({ notes: 5, average: 'Plutôt bien', goodStreak: 3, common: 'Bien' });
  });
  it('reconnaît les anciennes humeurs', () => {
    expect(moodWeekStats(['Sereine', 'Stressée']).levels).toEqual([3, 0]);
  });
});
