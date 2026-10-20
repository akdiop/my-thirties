import { DEFAULT_PRAYER_SETTINGS } from '@/spiritualite/prayer';
import { wellbeingReminders } from './wellbeingReminders';

describe('wellbeing reminders', () => {
  it('reminds only the chosen prayers', () => {
    const r = wellbeingReminders('2026-10-20', 0, { ...DEFAULT_PRAYER_SETTINGS, remind: ['fajr', 'maghrib'] }, []);
    expect(r.map((x) => x.title)).toEqual(['Fajr', 'Maghrib']);
    expect(r.every((x) => x.priority === 'high')).toBe(true);
  });

  it('reminds challenge days not yet recorded and skips rest days', () => {
    const challenge = { id: 'c', title: 'Squat challenge', startDate: '2026-10-19', plan: [10, 10, 0, 15], status: 'active', reminderTime: '18:00', records: new Map([[2, 'done' as const]]) };
    const r = wellbeingReminders('2026-10-19', 3, DEFAULT_PRAYER_SETTINGS, [challenge]);
    expect(r.map((x) => x.id)).toEqual(['challenge-c-1', 'challenge-c-4']);
  });

  it('ignores paused challenges', () => {
    const challenge = { id: 'c', title: 'x', startDate: '2026-10-19', plan: [10], status: 'paused', reminderTime: '18:00', records: new Map() };
    expect(wellbeingReminders('2026-10-19', 0, DEFAULT_PRAYER_SETTINGS, [challenge])).toEqual([]);
  });
});
