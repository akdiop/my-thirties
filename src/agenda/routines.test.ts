import { describeWeekdays, isScheduledOn, routineProgress } from './routines';

describe('routines', () => {
  it('knows when a routine applies', () => {
    expect(isScheduledOn([1, 2, 3, 4, 5], '2026-10-20')).toBe(true);
    expect(isScheduledOn([1, 2, 3, 4, 5], '2026-10-25')).toBe(false);
  });

  it('measures daily progress', () => {
    expect(routineProgress(['a', 'b', 'c', 'd'], new Set(['a', 'c', 'x']))).toEqual({ done: 2, total: 4, ratio: 0.5 });
  });

  it('describes weekdays in French', () => {
    expect(describeWeekdays([1, 2, 3, 4, 5, 6, 7])).toBe('Tous les jours');
    expect(describeWeekdays([5, 1, 2, 3, 4])).toBe('En semaine');
    expect(describeWeekdays([6, 7])).toBe('Le week-end');
    expect(describeWeekdays([1, 3])).toBe('lun. mer.');
  });
});
