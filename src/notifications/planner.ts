export const NOTIFICATION_CATEGORIES = [
  'agenda',
  'taches',
  'sport',
  'challenges',
  'sante',
  'spiritualite',
  'finances',
  'cuisine',
  'voyages',
  'passions',
  'equilibre',
  'briefing',
] as const;

export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number];

export type Reminder = {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  fireAt: number;
  priority?: 'normal' | 'high';
};

export type NotificationSettings = {
  enabled: boolean;
  disabledCategories: NotificationCategory[];
  quietHours: { start: string; end: string } | null;
};

export const IOS_PENDING_LIMIT = 64;
export const PLANNING_CAP = 60;
export const PLANNING_WINDOW_MS = 7 * 24 * 60 * 60_000;

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};

const MINUTE = 60_000;

export function minutesOfDay(ts: number, utcOffsetMinutes: number) {
  const local = new Date(ts + utcOffsetMinutes * MINUTE);
  return local.getUTCHours() * 60 + local.getUTCMinutes();
}

export function isInQuietHours(ts: number, quiet: NotificationSettings['quietHours'], utcOffsetMinutes: number) {
  if (!quiet) return false;
  const start = toMinutes(quiet.start);
  const end = toMinutes(quiet.end);
  const m = minutesOfDay(ts, utcOffsetMinutes);
  return start <= end ? m >= start && m < end : m >= start || m < end;
}

export function deferPastQuietHours(ts: number, quiet: NotificationSettings['quietHours'], utcOffsetMinutes: number) {
  if (!quiet || !isInQuietHours(ts, quiet, utcOffsetMinutes)) return ts;
  const end = toMinutes(quiet.end);
  const m = minutesOfDay(ts, utcOffsetMinutes);
  const wait = (end - m + 24 * 60) % (24 * 60);
  const shifted = ts + wait * MINUTE;
  return shifted - (shifted % MINUTE);
}

export type PlannedNotification = Reminder & { deliverAt: number; deferred: boolean };

export function planNotifications(
  reminders: Reminder[],
  settings: NotificationSettings,
  now: number,
  utcOffsetMinutes: number,
  cap = PLANNING_CAP,
): PlannedNotification[] {
  if (!settings.enabled) return [];
  const disabled = new Set(settings.disabledCategories);
  const seen = new Set<string>();
  const planned: PlannedNotification[] = [];

  for (const r of reminders) {
    if (disabled.has(r.category) || r.fireAt <= now || r.fireAt > now + PLANNING_WINDOW_MS) continue;
    const deliverAt = r.priority === 'high' ? r.fireAt : deferPastQuietHours(r.fireAt, settings.quietHours, utcOffsetMinutes);
    const key = `${r.category}|${r.title}|${Math.floor(deliverAt / MINUTE)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    planned.push({ ...r, deliverAt, deferred: deliverAt !== r.fireAt });
  }

  return planned.sort((a, b) => a.deliverAt - b.deliverAt).slice(0, Math.min(cap, IOS_PENDING_LIMIT));
}
