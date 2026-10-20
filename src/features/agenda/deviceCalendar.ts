import * as Calendar from 'expo-calendar';

import { addDays, parseISODate, toISODate, type ISODate } from '@/agenda/dates';
import type { ExternalEvent } from '@/agenda/agenda';

const hhmm = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

export async function requestCalendarAccess() {
  const current = await Calendar.getCalendarPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  return (await Calendar.requestCalendarPermissionsAsync()).granted;
}

export async function loadDeviceEvents(from: ISODate, to: ISODate): Promise<ExternalEvent[]> {
  const permission = await Calendar.getCalendarPermissionsAsync();
  if (!permission.granted) return [];
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  if (!calendars.length) return [];
  const names = new Map(calendars.map((cal) => [cal.id, cal.title]));
  const events = await Calendar.getEventsAsync(
    calendars.map((cal) => cal.id),
    parseISODate(from),
    parseISODate(addDays(to, 1)),
  );
  return events.map((e) => {
    const start = new Date(e.startDate);
    const end = new Date(e.endDate);
    return {
      id: e.id,
      title: e.title || 'Sans titre',
      date: toISODate(start),
      startTime: e.allDay ? null : hhmm(start),
      endTime: e.allDay ? null : hhmm(end),
      calendar: names.get(e.calendarId) ?? 'Calendrier',
    };
  });
}
