import type { LangCourse } from './types';

/** Cours complets, chargés seulement quand le parcours de la langue est ouvert. */
export const COURSE_LOADERS: Record<string, () => Promise<LangCourse>> = {
  'lang-espagnol': () => import('./espagnol').then((m) => m.COURSE),
  'lang-portugais': () => import('./portugais').then((m) => m.COURSE),
  'lang-arabe': () => import('./arabe').then((m) => m.COURSE),
  'lang-wolof': () => import('./wolof').then((m) => m.COURSE),
  'lang-italien': () => import('./italien').then((m) => m.COURSE),
  'lang-allemand': () => import('./allemand').then((m) => m.COURSE),
  'lang-japonais': () => import('./japonais').then((m) => m.COURSE),
  'lang-coreen': () => import('./coreen').then((m) => m.COURSE),
};
