import { describe, expect, it } from 'vitest';
import { analyseNight, minuteStats, nextAt, phasesOf, shouldWake } from '../sleepAnalysis';

const night = (): number[] => [
  ...Array(15).fill(12), // endormissement agité
  ...Array(60).fill(0), ...Array(40).fill(2), ...Array(5).fill(15), ...Array(60).fill(0), ...Array(40).fill(3),
];

describe('analyse de nuit', () => {
  it('compte les bruits brefs au-dessus du fond sonore', () => {
    const calm = Array(120).fill(0.002);
    expect(minuteStats(calm).events).toBe(0);
    const moving = [...calm.slice(0, 110), ...Array(10).fill(0.02)];
    expect(minuteStats(moving).events).toBe(10);
    expect(minuteStats(moving).loud).toBe(false);
  });
  it('estime éveil, léger et profond', () => {
    const p = phasesOf(night());
    expect(p[0]).toBe('eveil');
    expect(p).toContain('profond');
    expect(p).toContain('leger');
  });
  it('résume la nuit avec une qualité entre 0 et 100', () => {
    const a = analyseNight(new Date('2026-11-03T23:00:00'), new Date('2026-11-04T06:40:00'), night(), 2);
    expect(a.onset).toBeGreaterThan(5);
    expect(a.awakenings).toBeGreaterThanOrEqual(1);
    expect(a.quality).toBeGreaterThan(0); expect(a.quality).toBeLessThanOrEqual(100);
    expect(a.phases.eveil + a.phases.leger + a.phases.profond).toBe(220);
  });
  it('ignore les minutes sans écoute', () => {
    const a = analyseNight(new Date(), new Date(), [0, 0, -1, -1, 0], 0);
    expect(a.gaps).toBe(2);
  });
  it('réveil intelligent : dans la fenêtre seulement si sommeil léger', () => {
    const wake = new Date('2026-11-04T07:00:00');
    const calm = Array(200).fill(0), active = [...Array(200).fill(1), 6, 7, 8];
    expect(shouldWake(new Date('2026-11-04T06:20:00'), wake, 30, active)).toBe(false);
    expect(shouldWake(new Date('2026-11-04T06:40:00'), wake, 30, calm)).toBe(false);
    expect(shouldWake(new Date('2026-11-04T06:40:00'), wake, 30, active)).toBe(true);
    expect(shouldWake(new Date('2026-11-04T07:00:00'), wake, 30, calm)).toBe(true);
  });
  it('prochaine heure de réveil après le coucher', () => {
    expect(nextAt('07:00', new Date('2026-11-03T23:10:00')).toISOString()).toBe(new Date('2026-11-04T07:00:00').toISOString());
  });
});
