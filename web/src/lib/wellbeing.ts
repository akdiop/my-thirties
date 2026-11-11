import type { Entry, EntryInput } from './cloud';
import { parseDay, todayIso } from './day';
import { computeTimes, readSettings } from './prayertimes';

export const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

/** Horaires du jour (saisis ou récupérés dans Ma spiritualité) et prochaine prière. */
export function prayerDay(entries: Entry[], now = new Date()) {
  const day = todayIso();
  // Position enregistrée une fois : horaires recalculés chaque jour sur l'appareil. Sinon, ancien horaire saisi pour aujourd'hui.
  const saved = readSettings(entries);
  const schedule = saved ? null : entries.filter((e) => e.kind === 'prayer_schedule' && e.entry_date === day).sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0];
  if (!saved && !schedule) return null;
  const source: Record<string, unknown> = saved ? computeTimes(saved.settings, now) : schedule!.data;
  const times = PRAYERS.map((name) => ({ name, time: typeof source[name] === 'string' ? (source[name] as string) : '' })).filter((p) => /^\d{2}:\d{2}/.test(p.time));
  const minutes = now.getHours() * 60 + now.getMinutes();
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  const next = times.find((p) => toMin(p.time) > minutes) ?? null;
  const prayed = new Set(entries.filter((e) => e.kind === 'prayer' && e.entry_date === day).map((e) => String(e.data.prayer)));
  const inText = next ? (() => { const d = toMin(next.time) - minutes; return d >= 60 ? `dans ${Math.floor(d / 60)} h ${String(d % 60).padStart(2, '0')}` : `dans ${d} min`; })() : '';
  return { times, next, inText, prayed, city: saved ? saved.settings.place.split(',')[0] ?? '' : typeof schedule!.data.city === 'string' ? schedule!.data.city : '', sunrise: saved ? computeTimes(saved.settings, now).Sunrise : '' };
}

/** Coche ou décoche une prière du jour (une entrée « prayer » par prière accomplie). */
export async function togglePrayer(entries: Entry[], name: string, on: boolean, onCreate: (i: EntryInput) => Promise<void>, onRemove: (e: Entry) => Promise<void>, day = todayIso()) {
  const existing = entries.find((e) => e.kind === 'prayer' && e.entry_date === day && String(e.data.prayer) === name);
  if (on && !existing) await onCreate({ module: 'spiritualite', kind: 'prayer', title: name, entry_date: day, data: { date: day, prayer: name } });
  if (!on && existing) await onRemove(existing);
}

/** Dernière prière dont l'heure est passée et pas encore cochée (pour le bouton « C'est fait »). */
export function currentPrayer(p: NonNullable<ReturnType<typeof prayerDay>>, now = new Date()) {
  const m = now.getHours() * 60 + now.getMinutes();
  const past = p.times.filter((t) => Number(t.time.slice(0, 2)) * 60 + Number(t.time.slice(3, 5)) <= m);
  const last = past.at(-1);
  return last && !p.prayed.has(last.name) ? last : null;
}

/** Jour du cycle et estimation des prochaines règles à partir des débuts notés (indicatif). */
export function cycleInfo(entries: Entry[], today = todayIso()) {
  const starts = entries.filter((e) => e.kind === 'cycle' && e.entry_date).map((e) => e.entry_date!).sort();
  const last = starts.filter((d) => d <= today).at(-1);
  if (!last) return null;
  const day = Math.round((parseDay(today).getTime() - parseDay(last).getTime()) / 86_400_000) + 1;
  const gaps = starts.slice(1).map((d, i) => Math.round((parseDay(d).getTime() - parseDay(starts[i]!).getTime()) / 86_400_000)).filter((g) => g >= 20 && g <= 45);
  const avg = gaps.length ? Math.round(gaps.reduce((s, g) => s + g, 0) / gaps.length) : null;
  const next = avg ? new Date(parseDay(last).getTime() + avg * 86_400_000) : null;
  return { day, last, avg, next, starts };
}
