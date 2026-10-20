import { lifeReminders } from './lifeReminders';

describe('life reminders', () => {
  it('reminds before a subscription, even when the stored date is in the past', () => {
    const r = lifeReminders('2026-10-20', 7, [{ id: 's', name: 'Musique', amountMinor: 1099, currency: 'EUR', frequency: 'monthly', nextDate: '2026-09-23', remindDays: 1 }], []);
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({ id: 'subscription-s-2026-10-23', category: 'finances' });
    expect(r[0]?.body).toContain('23/10');
  });

  it('skips subscriptions without reminder and trips that are only ideas', () => {
    expect(
      lifeReminders(
        '2026-10-20',
        7,
        [{ id: 's', name: 'x', amountMinor: 1, currency: 'EUR', frequency: 'monthly', nextDate: '2026-10-22', remindDays: null }],
        [{ id: 't', destination: 'Dakar', startDate: '2026-10-22', status: 'idea' }],
      ),
    ).toEqual([]);
  });

  it('reminds a week and a day before a planned trip', () => {
    const r = lifeReminders('2026-10-20', 7, [], [{ id: 't', destination: 'Lisbonne', startDate: '2026-10-27', status: 'planned' }]);
    expect(r.map((x) => x.id)).toEqual(['trip-t-7', 'trip-t-1']);
  });
});
