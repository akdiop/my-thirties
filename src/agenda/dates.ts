export type ISODate = string;

const pad = (n: number) => String(n).padStart(2, '0');

export const toISODate = (d: Date): ISODate => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parseISODate = (iso: ISODate) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
};

export const addDays = (iso: ISODate, days: number) => {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
};

export const addMonths = (iso: ISODate, months: number) => {
  const d = parseISODate(iso);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, last));
  return toISODate(d);
};

export const daysBetween = (a: ISODate, b: ISODate) =>
  Math.round((parseISODate(b).getTime() - parseISODate(a).getTime()) / 86_400_000);

export const isoWeekday = (iso: ISODate) => {
  const wd = parseISODate(iso).getDay();
  return wd === 0 ? 7 : wd;
};

export const startOfWeek = (iso: ISODate) => addDays(iso, 1 - isoWeekday(iso));

export const startOfMonth = (iso: ISODate) => `${iso.slice(0, 7)}-01`;

export const daysInMonth = (iso: ISODate) => {
  const d = parseISODate(iso);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
};

export const rangeDays = (from: ISODate, count: number) => Array.from({ length: count }, (_, i) => addDays(from, i));

export function monthGrid(iso: ISODate) {
  const first = startOfMonth(iso);
  const lead = isoWeekday(first) - 1;
  const total = Math.ceil((lead + daysInMonth(iso)) / 7) * 7;
  return rangeDays(addDays(first, -lead), total);
}

export const isValidTime = (t: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t);

export const timeToMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};

export const localTimestamp = (date: ISODate, time: string | null) => {
  const d = parseISODate(date);
  if (time) {
    const mins = timeToMinutes(time);
    d.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
  }
  return d.getTime();
};

const WEEKDAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

export const weekdayShort = (iso: ISODate) => {
  const w = WEEKDAYS[isoWeekday(iso) - 1] ?? '';
  return w.charAt(0).toUpperCase() + w.slice(1, 3);
};

export const monthLabel = (iso: ISODate) => {
  const d = parseISODate(iso);
  const m = MONTHS[d.getMonth()] ?? '';
  return `${m.charAt(0).toUpperCase()}${m.slice(1)} ${d.getFullYear()}`;
};

export const dayLabel = (iso: ISODate) => {
  const d = parseISODate(iso);
  return `${WEEKDAYS[isoWeekday(iso) - 1]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
};
