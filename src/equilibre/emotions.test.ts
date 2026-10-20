import { emotionTrends } from './emotions';

describe('emotion trends', () => {
  const e = (at: string, emotion: string, intensity: number, trigger: string | null, strategy: string | null, outcome: string | null) => ({ at, emotion, intensity, trigger, strategy, outcome });
  const entries = [
    e('2026-10-01T09:00', 'Anxiété', 7, 'Réunion', 'Respiration', 'mieux'),
    e('2026-10-05T09:00', 'Anxiété', 5, 'réunion ', 'Respiration', 'mieux'),
    e('2026-10-08T09:00', 'Colère', 6, 'Trafic', 'Marche', 'pareil'),
    e('2026-09-01T09:00', 'Tristesse', 4, null, null, null),
  ];

  it('describes patterns of the period without scoring', () => {
    const t = emotionTrends(entries, '2026-09-20');
    expect(t.total).toBe(3);
    expect(t.emotions[0]).toEqual({ name: 'Anxiété', n: 2 });
    expect(t.triggers).toEqual([{ name: 'réunion', n: 2 }]);
    expect(t.helpful).toEqual([{ name: 'Respiration', used: 2, helped: 2 }]);
    expect(t.averageIntensity).toBe(6);
  });

  it('handles an empty period', () => {
    expect(emotionTrends([], '2026-10-01')).toMatchObject({ total: 0, averageIntensity: null, emotions: [] });
  });
});
