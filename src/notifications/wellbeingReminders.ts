import { addDays, localTimestamp, parseISODate, type ISODate } from '@/agenda/dates';
import { dayIndexFor, type DayStatus } from '@/challenges/challenges';
import { formatTime, PRAYER_LABEL, prayerTimes, type PrayerSettings } from '@/spiritualite/prayer';
import type { Reminder } from './planner';

type ChallengeSource = { id: string; title: string; startDate: string; plan: number[]; status: string; reminderTime: string | null; records: Map<number, DayStatus> };

export function wellbeingReminders(today: ISODate, days: number, prayer: PrayerSettings, challenges: ChallengeSource[]): Reminder[] {
  const out: Reminder[] = [];
  for (let i = 0; i <= days; i++) {
    const date = addDays(today, i);
    if (prayer.remind.length) {
      for (const p of prayerTimes(parseISODate(date), prayer)) {
        if (!prayer.remind.includes(p.name)) continue;
        out.push({ id: `prayer-${p.name}-${date}`, category: 'spiritualite', title: PRAYER_LABEL[p.name], body: `Heure de la prière · ${formatTime(p.at)}`, fireAt: p.at.getTime(), priority: 'high' });
      }
    }
    for (const c of challenges) {
      if (c.status !== 'active' || !c.reminderTime) continue;
      const day = dayIndexFor(c.startDate, date);
      const value = c.plan[day - 1];
      if (!value || c.records.has(day)) continue;
      out.push({ id: `challenge-${c.id}-${day}`, category: 'challenges', title: c.title, body: `Jour ${day} · votre séance vous attend, si vous en avez l’énergie.`, fireAt: localTimestamp(date, c.reminderTime) });
    }
  }
  return out;
}
