/** Mode Ramadan : où en est le mois (calendrier Umm al-Qura), plan de lecture du Coran et jeûnes à rattraper. */
import { hijriOf } from './hijri';

export const RAMADAN_KIND = 'ramadan';
export const QURAN_PAGES = 604;

const addDays = (iso: string, n: number) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

export type RamadanStatus =
  | { active: true; day: number; hijriYear: number; startIso: string }
  | { active: false; daysUntil: number; startIso: string; hijriYear: number }
  | null;

/** Le Ramadan en cours (jour 1 à 30) ou le prochain (dans combien de jours). Le début réel peut varier d'un jour selon l'observation de la lune. */
export function ramadanStatus(iso: string): RamadanStatus {
  const h = hijriOf(iso);
  if (!h) return null;
  if (h.month === 9) return { active: true, day: h.day, hijriYear: h.year, startIso: addDays(iso, 1 - h.day) };
  for (let i = 1; i <= 400; i++) {
    const d = addDays(iso, i), x = hijriOf(d);
    if (x && x.month === 9 && x.day === 1) return { active: false, daysUntil: i, startIso: d, hijriYear: x.year };
  }
  return null;
}

/** Page à atteindre ce jour-là pour finir le Coran en 30 jours (Mushaf de Médine, 604 pages). */
export const targetPage = (day: number) => Math.min(QURAN_PAGES, Math.ceil(QURAN_PAGES * Math.max(0, Math.min(30, day)) / 30));

export type RamadanData = { fasted?: Record<string, boolean>; page?: number; madeUp?: number };

/** Jeûnes manqués (jours notés « non jeûné ») et ce qu'il reste à rattraper. */
export function fastingSummary(d: RamadanData) {
  const days = Object.values(d.fasted ?? {});
  const fasted = days.filter(Boolean).length, missed = days.filter((x) => x === false).length;
  return { fasted, missed, toMakeUp: Math.max(0, missed - (d.madeUp ?? 0)) };
}
