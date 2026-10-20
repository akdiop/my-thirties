import { canFocus, dailyPriorities, filterTasks, isOverdue, nextRecurringDue, postpone, sortTasks, type TaskLike } from './tasks';

const t = (id: string, extra: Partial<TaskLike> = {}): TaskLike => ({
  id, title: id, dueDate: null, dueTime: null, priority: 0, focusDate: null, recurrence: null, completedAt: null, postponedCount: 0, ...extra,
});
const today = '2026-10-20';

describe('tasks', () => {
  const tasks = [
    t('late', { dueDate: '2026-10-18' }),
    t('today', { dueDate: today, priority: 3 }),
    t('focus', { focusDate: today }),
    t('later', { dueDate: '2026-10-25' }),
    t('none'),
    t('done', { dueDate: today, completedAt: '2026-10-20T09:00:00Z' }),
  ];

  it('filters today, upcoming, all and done', () => {
    expect(filterTasks(tasks, 'today', today).map((x) => x.id).sort()).toEqual(['focus', 'late', 'today']);
    expect(filterTasks(tasks, 'upcoming', today).map((x) => x.id)).toEqual(['later']);
    expect(filterTasks(tasks, 'all', today)).toHaveLength(5);
    expect(filterTasks(tasks, 'done', today).map((x) => x.id)).toEqual(['done']);
  });

  it('sorts by priority then due date', () => {
    expect(sortTasks(tasks.slice(0, 4)).map((x) => x.id)).toEqual(['today', 'late', 'later', 'focus']);
  });

  it('flags overdue tasks only when open', () => {
    expect(isOverdue(tasks[0]!, today)).toBe(true);
    expect(isOverdue(t('x', { dueDate: '2026-10-01', completedAt: 'x' }), today)).toBe(false);
  });

  it('postpones to tomorrow and counts it', () => {
    expect(postpone(t('a', { dueDate: '2026-10-18', focusDate: today }), today)).toEqual({ dueDate: '2026-10-21', focusDate: null, postponedCount: 1 });
    expect(postpone(t('b', { dueDate: '2026-10-25' }), today).dueDate).toBe('2026-10-26');
  });

  it('computes the next due date of a recurring task', () => {
    expect(nextRecurringDue(t('r', { dueDate: '2026-10-20', recurrence: { freq: 'weekly', interval: 1 } }), today)).toBe('2026-10-27');
    expect(nextRecurringDue(t('r', { dueDate: '2026-10-10', recurrence: { freq: 'daily', interval: 1 } }), today)).toBe('2026-10-21');
    expect(nextRecurringDue(t('n'), today)).toBeNull();
  });

  it('limits daily priorities to three', () => {
    const focused = ['a', 'b', 'c'].map((id) => t(id, { focusDate: today }));
    expect(canFocus(focused, today, 'd')).toBe(false);
    expect(canFocus(focused, today, 'a')).toBe(true);
    expect(dailyPriorities([...focused, t('d', { focusDate: today })], today)).toHaveLength(3);
  });
});
