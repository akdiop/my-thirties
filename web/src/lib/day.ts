import type { Entry } from './cloud';

export const iso = (d: Date) => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
export const todayIso = () => iso(new Date());
export const parseDay = (s: string) => new Date(s + 'T12:00:00');
export const plusDays = (date: Date, n: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
export const weekday = (d: Date) => (d.getDay() + 6) % 7;
export const str = (e: Entry, key: string) => (typeof e.data[key] === 'string' ? (e.data[key] as string) : '');

/** Une entrée du quotidien a-t-elle lieu ce jour-là (y compris les répétitions) ? */
export function occursOn(entry: Entry, date: Date): boolean {
  const key = iso(date);
  const frequency = str(entry, 'frequency');
  const origin = entry.entry_date || str(entry, 'date');
  if (!origin) return entry.kind === 'routine' && frequency === 'Quotidienne';
  const end = str(entry, 'endDate');
  if (end && key >= origin && key <= end) return true;
  if (frequency === 'Quotidienne' && key >= origin) return true;
  if (frequency === 'Hebdomadaire' && key >= origin && weekday(parseDay(origin)) === weekday(date)) return true;
  return origin === key;
}

const recurring = (e: Entry) => e.kind === 'routine' || ['Quotidienne', 'Hebdomadaire'].includes(str(e, 'frequency'));

export function isDoneOn(e: Entry, date: string) {
  if (!recurring(e)) return e.data.completed === true;
  const c = e.data.completions;
  return Boolean(c && typeof c === 'object' && (c as Record<string, boolean>)[date] === true);
}

export function toggledData(e: Entry, date: string, next: boolean): Record<string, unknown> {
  if (!recurring(e)) return { ...e.data, completed: next };
  const c = e.data.completions && typeof e.data.completions === 'object' ? (e.data.completions as Record<string, boolean>) : {};
  return { ...e.data, completions: { ...c, [date]: next } };
}

const rank = (e: Entry) => (str(e, 'priority') === 'Haute' ? 0 : str(e, 'priority') === 'Basse' ? 2 : 1);

/** Les trois priorités du jour : tâches du jour ou en retard, non faites d'abord, par priorité. */
export function priorities(entries: Entry[], day: string) {
  return entries
    .filter((e) => e.module === 'quotidien' && e.kind === 'task' && (!e.entry_date || e.entry_date <= day))
    .filter((e) => !isDoneOn(e, day) || e.entry_date === day)
    .sort((a, b) => Number(isDoneOn(a, day)) - Number(isDoneOn(b, day)) || rank(a) - rank(b) || (a.entry_date ?? '').localeCompare(b.entry_date ?? ''))
    .slice(0, 3);
}

export type TimelineItem = { id: string; time: string; title: string; sub: string; tone: 'caramel' | 'chocolat' | 'sauge' | 'or'; entry: Entry };

const MODULE_LABEL: Record<string, string> = {
  quotidien: 'Mon quotidien', sante: 'Ma santé', sport: 'Mon sport', spiritualite: 'Ma spiritualité', cuisine: 'Ma cuisine',
  passions: 'Mes passions', decouvertes: 'Mes découvertes', finances: 'Mes finances', equilibre: 'Mon équilibre', challenges: 'Mes challenges', listes: 'Mes listes',
};

/** Types d'entrées qui ont leur place dans l'agenda (les mesures comme l'humeur ou le sommeil n'y vont pas). */
const DATED_KINDS = new Set(['session', 'appointment', 'meal', 'practice', 'trip', 'event']);

/** Ce qui est daté pour un jour donné, tous espaces confondus, trié par heure. */
export function timeline(entries: Entry[], date: Date): TimelineItem[] {
  const key = iso(date);
  const prayers: TimelineItem[] = [];
  const schedule = entries.find((e) => e.kind === 'prayer_schedule' && e.entry_date === key);
  if (schedule) for (const name of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
    const t = str(schedule, name);
    if (/^\d{2}:\d{2}/.test(t)) prayers.push({ id: schedule.id + name, time: t.slice(0, 5), title: name, sub: 'Ma spiritualité', tone: 'sauge', entry: schedule });
  }
  return [...prayers, ...entries
    .filter((e) => (e.module === 'quotidien' ? occursOn(e, date) : e.entry_date === key && DATED_KINDS.has(e.kind)))
    .map((e) => {
      const tone: TimelineItem['tone'] = e.module === 'sport' || e.module === 'sante' || e.module === 'spiritualite' ? 'sauge'
        : e.kind === 'event' ? 'chocolat' : e.module === 'passions' ? 'or' : 'caramel';
      const extra = [str(e, 'discipline'), str(e, 'duration') && `${str(e, 'duration')} min`, str(e, 'location')].filter(Boolean).join(' · ');
      return { id: e.id, time: str(e, 'time'), title: e.title, sub: extra ? `${MODULE_LABEL[e.module]} · ${extra}` : MODULE_LABEL[e.module] ?? '', tone, entry: e };
    })
  ].sort((a, b) => (a.time || '99').localeCompare(b.time || '99'))
    // Pas de doublon : même titre, même heure et même lieu le même jour (ex. un événement créé ici et importé du calendrier iPhone).
    .filter((item, i, all) => all.findIndex((x) => sameItem(x, item)) === i);
}

const norm = (s: string) => s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');
const sameItem = (a: TimelineItem, b: TimelineItem) => norm(a.title) === norm(b.title) && a.time === b.time && norm(a.sub) === norm(b.sub);

export const longDate = (d = new Date()) => {
  const s = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return s.charAt(0).toUpperCase() + s.slice(1);
};
