import { addDays, type ISODate } from './dates';
import { nextOccurrenceAfter, type RecurrenceRule } from './recurrence';

export const PRIORITY_LABEL = ['Aucune', 'Basse', 'Moyenne', 'Haute'] as const;

export const MAX_DAILY_PRIORITIES = 3;

export type TaskLike = {
  id: string;
  title: string;
  dueDate: string | null;
  dueTime: string | null;
  priority: number;
  focusDate: string | null;
  recurrence: RecurrenceRule | null;
  completedAt: string | null;
  postponedCount: number;
};

export type TaskFilter = 'today' | 'upcoming' | 'all' | 'done';

export function filterTasks<T extends TaskLike>(tasks: T[], filter: TaskFilter, today: ISODate) {
  const open = tasks.filter((t) => !t.completedAt);
  switch (filter) {
    case 'today':
      return open.filter((t) => t.focusDate === today || (t.dueDate !== null && t.dueDate <= today));
    case 'upcoming':
      return open.filter((t) => t.dueDate !== null && t.dueDate > today);
    case 'all':
      return open;
    case 'done':
      return tasks.filter((t) => t.completedAt).sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''));
  }
}

export function sortTasks<T extends TaskLike>(tasks: T[]) {
  return [...tasks].sort(
    (a, b) =>
      b.priority - a.priority ||
      (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999') ||
      (a.dueTime ?? '99').localeCompare(b.dueTime ?? '99') ||
      a.title.localeCompare(b.title, 'fr'),
  );
}

export const isOverdue = (t: TaskLike, today: ISODate) => !t.completedAt && t.dueDate !== null && t.dueDate < today;

export function postpone(t: TaskLike, today: ISODate): Pick<TaskLike, 'dueDate' | 'focusDate' | 'postponedCount'> {
  const base = t.dueDate && t.dueDate > today ? t.dueDate : today;
  return {
    dueDate: addDays(base, 1),
    focusDate: t.focusDate === today ? null : t.focusDate,
    postponedCount: t.postponedCount + 1,
  };
}

export function nextRecurringDue(t: TaskLike, today: ISODate) {
  if (!t.recurrence) return null;
  const start = t.dueDate ?? today;
  const after = start > today ? start : today;
  return nextOccurrenceAfter(start, t.recurrence, after);
}

export function canFocus(tasks: TaskLike[], today: ISODate, id: string) {
  const focused = tasks.filter((t) => t.focusDate === today && !t.completedAt && t.id !== id);
  return focused.length < MAX_DAILY_PRIORITIES;
}

export const dailyPriorities = <T extends TaskLike>(tasks: T[], today: ISODate) =>
  sortTasks(tasks.filter((t) => t.focusDate === today)).slice(0, MAX_DAILY_PRIORITIES);
