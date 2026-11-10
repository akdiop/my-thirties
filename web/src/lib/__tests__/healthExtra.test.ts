import { describe, expect, it } from 'vitest';
import { parseExtra } from '../../../supabase/functions/health-import/extra';
import { parseSamples } from '../../../supabase/functions/health-import/sleep';

describe('import Santé : pas, sport, règles', () => {
  const body = [
    'PAS|2026-11-09T00:00:00Z|8 432',
    'PAS|2026-11-10|1200',
    'SPORT|2026-11-09T18:00:00Z|2026-11-09T18:45:00Z|Pilates|Apple Watch',
    'SPORT|2026-11-08T09:00:00Z|2026-11-08T10:30:00Z|Entraînement fonctionnel de haute intensité|',
    'REGLES|2026-11-01|Moyen', 'REGLES|2026-11-02|Abondant', 'REGLES|2026-11-04|Léger', 'REGLES|2026-11-20|Aucun',
    '2026-11-09T23:00:00Z|2026-11-10T06:00:00Z|Asleep|Sleep Cycle',
  ].join('\n');
  it('lit les pas par jour', () => {
    expect(parseExtra(body).steps).toEqual([{ date: '2026-11-09', steps: 8432 }, { date: '2026-11-10', steps: 1200 }]);
  });
  it('lit les séances et reconnaît la discipline', () => {
    const w = parseExtra(body).workouts;
    expect(w[0]).toMatchObject({ date: '2026-11-09', time: '18:00', minutes: 45, discipline: 'Pilates', source: 'Apple Watch' });
    expect(w[1]!.discipline).toBe('Workout');
  });
  it('regroupe les jours de règles en périodes', () => {
    expect(parseExtra(body).periods).toEqual([{ start: '2026-11-01', end: '2026-11-04', flow: 'Moyen' }]);
  });
  it('le sommeil continue d’être lu à côté', () => {
    expect(parseSamples(body)).toHaveLength(1);
  });
});
