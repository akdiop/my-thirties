import { localTimestamp } from '@/agenda/dates';
import { collectReminders } from './reminders';

describe('collectReminders', () => {
  const base = {
    events: [
      { id: 'e', title: 'Pilates', date: '2026-10-20', startTime: '18:00', endTime: null, category: 'sport', recurrence: null, exceptions: [], reminderMinutes: 30 },
      { id: 'quiet', title: 'Sans rappel', date: '2026-10-20', startTime: '12:00', endTime: null, category: 'perso', recurrence: null, exceptions: [], reminderMinutes: null },
    ],
    tasks: [
      { id: 't', title: 'Payer le loyer', dueDate: '2026-10-21', dueTime: null, completedAt: null, priority: 3, reminderMinutes: 0 },
      { id: 'done', title: 'Déjà fait', dueDate: '2026-10-21', dueTime: null, completedAt: 'x', priority: 0, reminderMinutes: 0 },
    ],
    routines: [{ id: 'r', name: 'Routine du matin', weekdays: [2], time: '07:00', remind: true }],
    briefingTime: '07:30',
    eveningTime: null,
  };

  it('turns events, tasks and routines into reminders', () => {
    const r = collectReminders('2026-10-20', 1, base);
    expect(r.find((x) => x.id === 'event-e-2026-10-20')?.fireAt).toBe(localTimestamp('2026-10-20', '17:30'));
    expect(r.find((x) => x.id === 'task-t')?.fireAt).toBe(localTimestamp('2026-10-21', '09:00'));
    expect(r.find((x) => x.id === 'routine-r-2026-10-20')).toBeDefined();
    expect(r.some((x) => x.id.includes('quiet') || x.id.includes('done'))).toBe(false);
  });

  it('adds one briefing per day', () => {
    expect(collectReminders('2026-10-20', 2, base).filter((x) => x.category === 'briefing')).toHaveLength(3);
  });
});
