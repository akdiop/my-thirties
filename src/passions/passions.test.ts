import { tripCountdown } from '@/decouvertes/trips';
import { defaultPath, passionStats } from './passions';

describe('passions', () => {
  it('builds a monthly path', () => {
    const path = defaultPath(6, '2026-10-20');
    expect(path).toHaveLength(6);
    expect(path[0]?.targetDate).toBe('2026-11-20');
    expect(defaultPath(12, '2026-10-20')).toHaveLength(12);
  });

  it('counts minutes this month and the weekly streak', () => {
    const s = passionStats(
      [
        { date: '2026-10-19', minutes: 30 },
        { date: '2026-10-14', minutes: 45 },
        { date: '2026-10-06', minutes: null },
        { date: '2026-09-20', minutes: 60 },
      ],
      '2026-10-20',
    );
    expect(s).toEqual({ monthMinutes: 75, sessions: 4, weekStreak: 3 });
  });
});

describe('trips', () => {
  it('counts down to departure', () => {
    expect(tripCountdown({ startDate: '2026-10-21', endDate: '2026-10-28' }, '2026-10-20')).toBe('Départ demain');
    expect(tripCountdown({ startDate: '2026-11-01', endDate: null }, '2026-10-20')).toBe('Départ dans 12 jours');
    expect(tripCountdown({ startDate: '2026-10-18', endDate: '2026-10-25' }, '2026-10-20')).toBe('En voyage');
    expect(tripCountdown({ startDate: '2026-10-01', endDate: '2026-10-05' }, '2026-10-20')).toBeNull();
  });
});
