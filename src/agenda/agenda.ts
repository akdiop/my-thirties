import { timeToMinutes, type ISODate } from './dates';
import { occurrencesBetween, type RecurrenceRule } from './recurrence';

export type AgendaEventSource = {
  id: string;
  title: string;
  date: ISODate;
  startTime: string | null;
  endTime: string | null;
  category: string;
  recurrence: RecurrenceRule | null;
  exceptions: string[];
};

export type AgendaTaskSource = { id: string; title: string; dueDate: string | null; dueTime: string | null; completedAt: string | null; priority: number };

export type AgendaRoutineSource = { id: string; name: string; weekdays: number[]; time: string | null };

export type ExternalEvent = { id: string; title: string; date: ISODate; startTime: string | null; endTime: string | null; calendar: string };

export type AgendaItem = {
  key: string;
  kind: 'event' | 'task' | 'routine' | 'external';
  id: string;
  date: ISODate;
  title: string;
  startTime: string | null;
  endTime: string | null;
  category: string;
  done?: boolean;
  subtitle?: string;
};

const order = (a: AgendaItem, b: AgendaItem) => {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1;
  const ta = a.startTime ? timeToMinutes(a.startTime) : -1;
  const tb = b.startTime ? timeToMinutes(b.startTime) : -1;
  return ta - tb || a.title.localeCompare(b.title, 'fr');
};

export function buildAgenda(
  from: ISODate,
  to: ISODate,
  sources: { events: AgendaEventSource[]; tasks: AgendaTaskSource[]; routines: AgendaRoutineSource[]; external?: ExternalEvent[] },
): AgendaItem[] {
  const items: AgendaItem[] = [];

  for (const e of sources.events) {
    for (const date of occurrencesBetween(e.date, e.recurrence, from, to, e.exceptions)) {
      items.push({ key: `event:${e.id}:${date}`, kind: 'event', id: e.id, date, title: e.title, startTime: e.startTime, endTime: e.endTime, category: e.category });
    }
  }

  for (const t of sources.tasks) {
    if (!t.dueDate || t.dueDate < from || t.dueDate > to) continue;
    items.push({ key: `task:${t.id}`, kind: 'task', id: t.id, date: t.dueDate, title: t.title, startTime: t.dueTime, endTime: null, category: 'tache', done: !!t.completedAt });
  }

  for (const r of sources.routines) {
    for (const date of occurrencesBetween(from, { freq: 'weekly', interval: 1, weekdays: r.weekdays }, from, to)) {
      items.push({ key: `routine:${r.id}:${date}`, kind: 'routine', id: r.id, date, title: r.name, startTime: r.time, endTime: null, category: 'routine' });
    }
  }

  for (const x of sources.external ?? []) {
    if (x.date < from || x.date > to) continue;
    items.push({ key: `external:${x.id}:${x.date}`, kind: 'external', id: x.id, date: x.date, title: x.title, startTime: x.startTime, endTime: x.endTime, category: 'externe', subtitle: x.calendar });
  }

  return items.sort(order);
}

export function groupByDate(items: AgendaItem[]) {
  const map = new Map<ISODate, AgendaItem[]>();
  for (const item of items) map.set(item.date, [...(map.get(item.date) ?? []), item]);
  return map;
}
