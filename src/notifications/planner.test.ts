import { deferPastQuietHours, isInQuietHours, planNotifications, type NotificationSettings, type Reminder } from './planner';

const H = 3_600_000;
const day0 = Date.UTC(2026, 9, 20, 0, 0);
const quiet = { start: '22:00', end: '07:00' };
const settings: NotificationSettings = { enabled: true, disabledCategories: [], quietHours: quiet };
const r = (id: string, fireAt: number, extra: Partial<Reminder> = {}): Reminder => ({
  id, category: 'agenda', title: id, body: '', fireAt, ...extra,
});

describe('quiet hours', () => {
  it('handles a window that crosses midnight', () => {
    expect(isInQuietHours(day0 + 23 * H, quiet, 0)).toBe(true);
    expect(isInQuietHours(day0 + 3 * H, quiet, 0)).toBe(true);
    expect(isInQuietHours(day0 + 7 * H, quiet, 0)).toBe(false);
    expect(isInQuietHours(day0 + 12 * H, quiet, 0)).toBe(false);
  });

  it('defers to the end of the window, in local time', () => {
    expect(deferPastQuietHours(day0 + 23 * H, quiet, 0)).toBe(day0 + 31 * H);
    expect(deferPastQuietHours(day0 + 22 * H, quiet, 60)).toBe(day0 + 30 * H);
  });
});

describe('planNotifications', () => {
  it('drops past, disabled and duplicate reminders and sorts the rest', () => {
    const plan = planNotifications(
      [
        r('b', day0 + 15 * H),
        r('a', day0 + 9 * H),
        r('a', day0 + 9 * H),
        r('old', day0 - H),
        r('sport', day0 + 10 * H, { category: 'sport' }),
      ],
      { ...settings, disabledCategories: ['sport'] },
      day0,
      0,
    );
    expect(plan.map((p) => p.id)).toEqual(['a', 'b']);
  });

  it('keeps high priority reminders inside quiet hours', () => {
    const plan = planNotifications([r('urgent', day0 + 23 * H, { priority: 'high' }), r('soft', day0 + 23 * H)], settings, day0, 0);
    expect(plan.find((p) => p.id === 'urgent')?.deliverAt).toBe(day0 + 23 * H);
    expect(plan.find((p) => p.id === 'soft')).toMatchObject({ deliverAt: day0 + 31 * H, deferred: true });
  });

  it('stays under the iOS pending limit', () => {
    const many = Array.from({ length: 200 }, (_, i) => r(`n${i}`, day0 + 8 * H + i * 60_000));
    expect(planNotifications(many, settings, day0, 0).length).toBeLessThanOrEqual(60);
  });

  it('returns nothing when notifications are off', () => {
    expect(planNotifications([r('a', day0 + 9 * H)], { ...settings, enabled: false }, day0, 0)).toEqual([]);
  });
});
