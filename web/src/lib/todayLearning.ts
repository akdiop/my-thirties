/** « Aujourd'hui, je n'oublie pas » : ce qui revient chaque jour sur l'accueil (défis, mot du jour, tafsir, lecture du Coran). */
import type { Entry } from './cloud';
import type { LangCourse, Triple } from './langCourses/types';
import { LESSONS } from './lessons';
import { QURAN_PAGES } from './ramadan';
import { dayNumber, templateById } from './challenges';

export const QURAN_KIND = 'lecture_coran';

/** Même élément toute la journée, un autre le lendemain. */
export function pickOfDay<T>(list: T[], iso: string, salt = 0): T | undefined {
  if (!list.length) return undefined;
  const days = Math.floor(Date.parse(iso + 'T12:00:00Z') / 86_400_000);
  return list[(((days + salt) % list.length) + list.length) % list.length];
}

/** Mot du jour : pris dans le vocabulaire des étapes déjà ouvertes du parcours (jusqu'à l'étape en cours). */
export function wordOfDay(course: LangCourse, done: Record<string, boolean>, iso: string, salt = 0): Triple | undefined {
  const next = course.lessons.findIndex((_, i) => !done[i]);
  const upTo = next === -1 ? course.lessons.length : next + 1;
  return pickOfDay(course.lessons.slice(0, upTo).flatMap((l) => l.vocab), iso, salt);
}

export type TafsirBit = { lesson: string; title: string; arabic?: string; phonetic?: string; french?: string; point?: string };

/** Tafsir du jour : un verset expliqué (ou une notion) tiré des cours de tafsir de « Mes cours ». */
export function tafsirOfDay(iso: string): TafsirBit | undefined {
  const bits = LESSONS.filter((l) => l.id.startsWith('tafsir-')).flatMap((l) => l.parts.filter((p) => (p.arabic && p.arabic.length <= 120) || (!p.arabic && p.points?.length))
    .map((p) => ({ lesson: l.title, title: p.title, arabic: p.arabic, phonetic: p.phonetic, french: p.french, point: p.points?.[0] })));
  return pickOfDay(bits, iso);
}

export type QuranPlan = { from: number; to: number; perDay: number; doneToday: boolean; finished: boolean };

/** Lecture du Coran : la prochaine page à lire et le rythme choisi. */
export function quranPlan(data: Record<string, unknown> | undefined, today: string): QuranPlan {
  const perDay = Math.max(1, Math.min(40, Math.round(Number(data?.perDay) || 1)));
  const page = Math.max(1, Math.round(Number(data?.page) || 1));
  const doneToday = data?.lastDone === today;
  const from = doneToday ? Math.max(1, page - (Number(data?.lastCount) || perDay)) : page;
  return { from, to: Math.min(QURAN_PAGES, from + perDay - 1), perDay, doneToday, finished: page > QURAN_PAGES };
}

/** Pages lues aujourd'hui : on avance la page suivante (et on recommence au début après la dernière). */
export function quranRead(data: Record<string, unknown> | undefined, today: string): Record<string, unknown> {
  const plan = quranPlan(data, today);
  if (plan.doneToday) return { ...data };
  const count = plan.to - plan.from + 1;
  const next = plan.to + 1;
  return { ...data, page: next > QURAN_PAGES ? 1 : next, lastDone: today, lastCount: count, khatm: next > QURAN_PAGES ? (Number(data?.khatm) || 0) + 1 : Number(data?.khatm) || 0 };
}

export type ChallengeToday = { entry: Entry; day: number; days: number; action: string | null; done: boolean };

/** Défis en cours : le jour atteint et l'action prévue aujourd'hui. */
export function challengesToday(entries: Entry[], today: string): ChallengeToday[] {
  return entries.filter((e) => e.kind === 'challenge').flatMap((entry) => {
    const t = templateById(entry.data.template);
    const days = Math.min(30, Math.max(7, Number(entry.data.days) || 30));
    const day = dayNumber(String(entry.data.start || entry.entry_date || today), today);
    if (day < 1 || day > days) return [];
    const progress = (entry.data.progress && typeof entry.data.progress === 'object' ? entry.data.progress : {}) as Record<string, { status?: string }>;
    return [{ entry, day, days, action: t ? t.day(day) : null, done: progress[String(day)]?.status === 'done' }];
  });
}
