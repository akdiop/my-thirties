import type { Entry } from './cloud';

const safeDate = (date: unknown): date is string => typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date + 'T12:00:00'));
const safeTime = (time: unknown): time is string => typeof time === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
const escape = (s: string) => s.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const toLocal = (date: string, time: string) => date.replace(/-/g, '') + 'T' + time.replace(':', '') + '00';
const toDay = (date: string) => date.replace(/-/g, '');
const plusDay = (date: string) => {
  const d = new Date(date + 'T12:00:00');
  d.setDate(d.getDate() + 1);
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
};
const line = (name: string, value: string) => name + ':' + escape(value);
const fold = (s: string) => s.split('\r\n').flatMap((l) => {
  const parts: string[] = [];
  let remaining = l;
  while (remaining.length > 70) { parts.push(remaining.slice(0, 70)); remaining = ' ' + remaining.slice(70); }
  parts.push(remaining);
  return parts;
}).join('\r\n');

export function makeCalendar(entries: Entry[]): string {
  const now = stamp(new Date());
  const events: string[] = [];
  for (const e of entries) {
    if (!safeDate(e.entry_date)) continue;
    if (!['task', 'routine', 'event', 'appointment'].includes(e.kind)) continue;
    const time = safeTime(e.data.time) ? e.data.time : null;
    const date = e.entry_date;
    const frequency = e.data.frequency;
    const recurrence = frequency === 'Quotidienne' ? 'RRULE:FREQ=DAILY' : frequency === 'Hebdomadaire' ? 'RRULE:FREQ=WEEKLY' : null;
    const start = time ? 'DTSTART:' + toLocal(date, time) : 'DTSTART;VALUE=DATE:' + toDay(date);
    const end = time
      ? (() => { const d = new Date(date + 'T' + time + ':00'); d.setMinutes(d.getMinutes() + 30); return 'DTEND:' + toLocal([d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-'), [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(':')); })()
      : 'DTEND;VALUE=DATE:' + toDay(plusDay(date));
    events.push(['BEGIN:VEVENT', 'UID:' + e.id.replace(/[^a-zA-Z0-9-]/g, '') + '@my-thirties.local',
      'DTSTAMP:' + now, start, end, line('SUMMARY', e.title),
      e.data.location ? line('LOCATION', String(e.data.location)) : '',
      e.data.notes ? line('DESCRIPTION', String(e.data.notes)) : '',
      recurrence || '', 'END:VEVENT'].filter(Boolean).join('\r\n'));
  }
  return fold(['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//My Thirties//Personal Calendar//FR',
    'CALSCALE:GREGORIAN', 'X-WR-CALNAME:My Thirties', ...events, 'END:VCALENDAR'].join('\r\n')) + '\r\n';
}

export function downloadCalendar(entries: Entry[]) {
  const data = makeCalendar(entries);
  const blob = new Blob([data], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = 'my-thirties-agenda.ics';
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
