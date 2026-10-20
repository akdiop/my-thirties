import { addDays, addMonths, startOfWeek, type ISODate } from '@/agenda/dates';

const PATH_6 = ['Découvrir, se renseigner et s’équiper', 'Apprendre les bases', 'Pratiquer chaque semaine', 'Premier petit projet abouti', 'Approfondir une technique', 'Bilan et projet à montrer'];
const PATH_12 = [
  'Découvrir, se renseigner et s’équiper',
  'Apprendre les bases',
  'Installer une pratique hebdomadaire',
  'Premier petit projet abouti',
  'Suivre un cours ou un atelier',
  'Bilan de mi-parcours',
  'Approfondir une technique',
  'Projet plus ambitieux',
  'Rejoindre une communauté',
  'Explorer un style personnel',
  'Préparer un projet à montrer',
  'Bilan et suite du parcours',
];

/** Parcours de départ, un jalon par mois, entièrement modifiable. */
export function defaultPath(horizonMonths: 6 | 12, start: ISODate) {
  return (horizonMonths === 6 ? PATH_6 : PATH_12).map((title, i) => ({ title, targetDate: addMonths(start, i + 1) }));
}

export function passionStats(logs: { date: string; minutes: number | null }[], today: ISODate) {
  const month = today.slice(0, 7);
  const monthMinutes = logs.filter((l) => l.date.startsWith(month)).reduce((s, l) => s + (l.minutes ?? 0), 0);
  const weeks = new Set(logs.map((l) => startOfWeek(l.date)));
  let streak = 0;
  let week = startOfWeek(today);
  if (!weeks.has(week)) week = startOfWeek(addDays(week, -7));
  while (weeks.has(week)) {
    streak++;
    week = startOfWeek(addDays(week, -7));
  }
  return { monthMinutes, sessions: logs.length, weekStreak: streak };
}

