import { describe, expect, it } from 'vitest';
import { nightsFrom, parseSamples, stageOf } from '../../../supabase/functions/health-import/sleep';

describe('import Santé (Sleep Cycle)', () => {
  it('reconnaît les valeurs en anglais, en français et en code', () => {
    expect(stageOf('In Bed')).toBe('lit');
    expect(stageOf('Endormi')).toBe('endormie');
    expect(stageOf('Éveillé')).toBe('eveil');
    expect(stageOf('Profond')).toBe('profond');
    expect(stageOf('Core')).toBe('leger');
    expect(stageOf('REM')).toBe('paradoxal');
    expect(stageOf('4')).toBe('profond');
    expect(stageOf('Pas')).toBeNull();
  });
  it('regroupe une nuit Sleep Cycle et calcule le sommeil sans compter deux fois', () => {
    const body = [
      '2026-11-03T23:10:00Z|2026-11-04T07:02:00Z|In Bed|Sleep Cycle',
      '2026-11-03T23:30:00Z|2026-11-04T03:00:00Z|Asleep|Sleep Cycle',
      '2026-11-04T02:30:00Z|2026-11-04T06:50:00Z|Asleep|Sleep Cycle',
      'ligne invalide',
    ].join('\n');
    const [n] = nightsFrom(parseSamples(body));
    expect(n!.date).toBe('2026-11-04');
    expect(n!.bed).toBe('23:10'); expect(n!.wake).toBe('07:02');
    expect(n!.asleep).toBe(440);
    expect(n!.inBed).toBe(472);
    expect(n!.sources).toEqual(['Sleep Cycle']);
    expect(n!.segments.every(([, , st]) => st !== 'lit')).toBe(true);
  });
  it('sépare deux nuits et accepte le JSON', () => {
    const lines = ['2026-11-02T23:00:00+00:00|2026-11-03T06:00:00+00:00|Asleep|A', '2026-11-03T23:00:00+00:00|2026-11-04T06:30:00+00:00|Core|Watch'];
    expect(nightsFrom(parseSamples(JSON.stringify({ samples: lines.join('\n') })))).toHaveLength(2);
  });
});
