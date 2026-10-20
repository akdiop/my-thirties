import { cycleStats, periodDays, predict } from './cycle';
import { averageSleep, formatDuration, sleepMinutes } from './sleep';

describe('cycle', () => {
  const periods = [
    { startDate: '2026-07-20', endDate: '2026-07-24' },
    { startDate: '2026-08-17', endDate: '2026-08-21' },
    { startDate: '2026-09-15', endDate: '2026-09-19' },
    { startDate: '2026-10-12', endDate: '2026-10-16' },
  ];

  it('averages cycle and period lengths', () => {
    expect(cycleStats(periods)).toMatchObject({ cycleLength: 28, periodLength: 5, basedOn: 3, regular: true });
  });

  it('predicts the next period with a window, never as a certainty', () => {
    const p = predict(periods, '2026-10-20')!;
    expect(p.cycleDay).toBe(9);
    expect(p.nextStart).toBe('2026-11-09');
    expect(p.window[0] < p.nextStart && p.window[1] > p.nextStart).toBe(true);
    expect(p.confidence).toBe('moyenne');
  });

  it('uses defaults and low confidence with one period', () => {
    const p = predict([{ startDate: '2026-10-12', endDate: null }], '2026-10-20')!;
    expect(p.nextStart).toBe('2026-11-09');
    expect(p.confidence).toBe('faible');
  });

  it('ignores implausible gaps (a forgotten month)', () => {
    expect(cycleStats([{ startDate: '2026-01-01', endDate: null }, { startDate: '2026-04-01', endDate: null }]).basedOn).toBe(0);
  });

  it('lists period days, an open period stops at today', () => {
    const days = periodDays([{ startDate: '2026-10-18', endDate: null }], '2026-10-20');
    expect([...days]).toEqual(['2026-10-18', '2026-10-19', '2026-10-20']);
  });

  it('returns null without history', () => {
    expect(predict([], '2026-10-20')).toBeNull();
  });
});

describe('sleep', () => {
  it('handles nights across midnight', () => {
    expect(sleepMinutes('23:30', '07:00')).toBe(450);
    expect(sleepMinutes('01:00', '08:15')).toBe(435);
    expect(formatDuration(450)).toBe('7 h 30');
    expect(averageSleep([{ bedTime: '23:00', wakeTime: '07:00' }, { bedTime: '00:00', wakeTime: '07:00' }])).toBe(450);
  });
});
