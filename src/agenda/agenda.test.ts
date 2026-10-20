import { buildAgenda, groupByDate } from './agenda';

describe('buildAgenda', () => {
  const sources = {
    events: [
      { id: 'e1', title: 'Pilates', date: '2026-10-20', startTime: '18:00', endTime: '18:30', category: 'sport', recurrence: { freq: 'weekly' as const, interval: 1 }, exceptions: ['2026-10-27'] },
      { id: 'e2', title: 'Réunion', date: '2026-10-21', startTime: '10:00', endTime: '11:00', category: 'travail', recurrence: null, exceptions: [] },
    ],
    tasks: [
      { id: 't1', title: 'Appeler maman', dueDate: '2026-10-20', dueTime: null, completedAt: null, priority: 2 },
      { id: 't2', title: 'Sans date', dueDate: null, dueTime: null, completedAt: null, priority: 0 },
    ],
    routines: [{ id: 'r1', name: 'Routine du matin', weekdays: [1, 2, 3, 4, 5], time: '07:00' }],
  };

  it('merges events, dated tasks and routines sorted by time', () => {
    const day = buildAgenda('2026-10-20', '2026-10-20', sources);
    expect(day.map((i) => i.title)).toEqual(['Appeler maman', 'Routine du matin', 'Pilates']);
  });

  it('expands recurring events and skips exceptions', () => {
    const items = buildAgenda('2026-10-19', '2026-11-08', sources).filter((i) => i.id === 'e1');
    expect(items.map((i) => i.date)).toEqual(['2026-10-20', '2026-11-03']);
  });

  it('places routines only on their weekdays', () => {
    const weekend = buildAgenda('2026-10-24', '2026-10-25', sources);
    expect(weekend.some((i) => i.kind === 'routine')).toBe(false);
  });

  it('groups by date', () => {
    const g = groupByDate(buildAgenda('2026-10-20', '2026-10-21', sources));
    expect(g.get('2026-10-21')?.map((i) => i.title)).toEqual(['Routine du matin', 'Réunion']);
  });
});
