import { addDays, localTimestamp, type ISODate } from '@/agenda/dates';
import { formatMoney, rollForward, type Currency, type Frequency } from '@/finances/money';
import type { Reminder } from './planner';

type SubscriptionSource = { id: string; name: string; amountMinor: number; currency: Currency; frequency: Frequency; nextDate: string; remindDays: number | null };
type TripSource = { id: string; destination: string; startDate: string | null; status: string };

export function lifeReminders(today: ISODate, days: number, subscriptions: SubscriptionSource[], trips: TripSource[]): Reminder[] {
  const out: Reminder[] = [];
  const last = addDays(today, days);
  for (const s of subscriptions) {
    if (s.remindDays === null) continue;
    const due = rollForward(s.nextDate, s.frequency, today);
    const on = addDays(due, -s.remindDays);
    if (on < today || on > last) continue;
    out.push({
      id: `subscription-${s.id}-${due}`,
      category: 'finances',
      title: s.name,
      body: `Prélèvement prévu le ${due.slice(8, 10)}/${due.slice(5, 7)} · ${formatMoney(s.amountMinor, s.currency)}`,
      fireAt: localTimestamp(on, '09:00'),
    });
  }
  for (const t of trips) {
    if (t.status !== 'planned' || !t.startDate) continue;
    for (const [before, body] of [
      [7, 'Départ dans une semaine : un coup d’œil aux préparatifs ?'],
      [1, 'Départ demain : pensez à la valise et aux documents.'],
    ] as const) {
      const on = addDays(t.startDate, -before);
      if (on < today || on > last) continue;
      out.push({ id: `trip-${t.id}-${before}`, category: 'voyages', title: t.destination, body, fireAt: localTimestamp(on, '18:00') });
    }
  }
  return out;
}
