import { buildAgenda, type AgendaEventSource, type AgendaRoutineSource, type AgendaTaskSource } from '@/agenda/agenda';
import { addDays, localTimestamp, type ISODate } from '@/agenda/dates';
import type { Reminder } from './planner';

type Sources = {
  events: (AgendaEventSource & { reminderMinutes: number | null })[];
  tasks: (AgendaTaskSource & { reminderMinutes: number | null })[];
  routines: (AgendaRoutineSource & { remind: boolean })[];
  briefingTime: string | null;
  eveningTime: string | null;
};

export function collectReminders(today: ISODate, days: number, s: Sources): Reminder[] {
  const to = addDays(today, days);
  const items = buildAgenda(today, to, { events: s.events, tasks: s.tasks, routines: s.routines });
  const byEvent = new Map(s.events.map((e) => [e.id, e]));
  const byTask = new Map(s.tasks.map((t) => [t.id, t]));
  const byRoutine = new Map(s.routines.map((r) => [r.id, r]));
  const out: Reminder[] = [];

  for (const item of items) {
    if (item.kind === 'event') {
      const e = byEvent.get(item.id);
      if (!e || e.reminderMinutes === null) continue;
      const at = localTimestamp(item.date, item.startTime ?? '09:00') - e.reminderMinutes * 60_000;
      out.push({ id: `event-${item.id}-${item.date}`, category: 'agenda', title: item.title, body: item.startTime ? `À ${item.startTime}` : 'Aujourd’hui', fireAt: at });
    } else if (item.kind === 'task') {
      const t = byTask.get(item.id);
      if (!t || t.reminderMinutes === null || item.done) continue;
      const at = localTimestamp(item.date, item.startTime ?? '09:00') - t.reminderMinutes * 60_000;
      out.push({ id: `task-${item.id}`, category: 'taches', title: item.title, body: 'Tâche à faire', fireAt: at });
    } else if (item.kind === 'routine') {
      const r = byRoutine.get(item.id);
      if (!r?.remind || !item.startTime) continue;
      out.push({ id: `routine-${item.id}-${item.date}`, category: 'taches', title: item.title, body: 'C’est l’heure de votre routine', fireAt: localTimestamp(item.date, item.startTime) });
    }
  }

  for (let i = 0; i <= days; i++) {
    const date = addDays(today, i);
    if (s.briefingTime) {
      out.push({ id: `briefing-${date}`, category: 'briefing', title: 'Votre journée', body: 'Votre briefing du matin est prêt.', fireAt: localTimestamp(date, s.briefingTime) });
    }
    if (s.eveningTime) {
      out.push({ id: `bilan-${date}`, category: 'briefing', title: 'Bilan du soir', body: 'Un moment pour faire le point, si vous le souhaitez.', fireAt: localTimestamp(date, s.eveningTime) });
    }
  }
  return out;
}
