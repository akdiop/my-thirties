import type { Entry } from './cloud';

export const PANDA_KIND = 'panda-companion';
export const PANDA_ACTIONS = [
  { id: 'pause', title: 'Souffler', description: 'Un moment pour respirer' },
  { id: 'repos', title: 'Me reposer', description: 'Le repos compte aussi' },
  { id: 'mouvement', title: 'Bouger doucement', description: 'À mon rythme' },
  { id: 'creativite', title: 'Créer ou apprendre', description: 'Nourrir ma curiosité' },
] as const;
export type PandaAction = typeof PANDA_ACTIONS[number]['id'];
export type PandaMoment = { day: string; action: PandaAction };
export type PandaData = { name: string; adoptedAt: string; moments: PandaMoment[]; linkHabits: boolean; bestLevel: number };
const ACTION_IDS = new Set<string>(PANDA_ACTIONS.map((a) => a.id));
const isoDay = /^\d{4}-\d{2}-\d{2}$/;
export const PANDA_LEVELS = [
  { name: 'Petit panda', text: 'On apprend à se connaître.' },
  { name: 'Panda curieux', text: 'Il découvre ses premières habitudes.' },
  { name: 'Panda explorateur', text: 'Il accompagne de nouveaux moments.' },
  { name: 'Panda épanoui', text: 'Il grandit à ton rythme.' },
  { name: 'Panda sage', text: 'Une belle histoire de petits pas.' },
] as const;
const LEVEL_LIMITS = [0, 3, 9, 18, 30] as const;
export const pandaLevel = (points: number) => LEVEL_LIMITS.reduce((level, min, i) => points >= min ? i : level, 0);
export const nextPandaMilestone = (level: number) => LEVEL_LIMITS[level + 1] ?? null;

export function readPandaData(value: Record<string, unknown>): PandaData {
  const name = typeof value.name === 'string' ? value.name.trim().slice(0, 24) : '';
  const adoptedAt = typeof value.adoptedAt === 'string' && isoDay.test(value.adoptedAt) ? value.adoptedAt : '';
  const rawMoments = Array.isArray(value.moments) ? value.moments : [];
  const seen = new Set<string>();
  const moments: PandaMoment[] = [];
  for (const item of rawMoments.slice(0, 3000)) {
    if (!item || typeof item !== 'object' || !('day' in item) || !('action' in item)) continue;
    const day = (item as PandaMoment).day, action = (item as PandaMoment).action;
    if (typeof day !== 'string' || !isoDay.test(day) || !ACTION_IDS.has(action)) continue;
    const key = day + ':' + action;
    if (!seen.has(key)) { seen.add(key); moments.push({ day, action }); }
  }
  return { name: name || 'Mochi', adoptedAt, moments,
    linkHabits: value.linkHabits === true,
    bestLevel: Math.max(0, Math.min(4, Number(value.bestLevel) || 0)) };
}

/** Une trace d'activité = une journée de participation, indépendamment de l'humeur, des calories ou de l'intensité. */
export function linkedPandaDays(entries: Entry[]): string[] {
  const kinds = new Set(['mood', 'sleep', 'gratitude', 'emotion', 'practice', 'session', 'workout']);
  return [...new Set(entries.filter((e) => kinds.has(e.kind) && e.kind !== PANDA_KIND
    && typeof e.entry_date === 'string' && isoDay.test(e.entry_date))
    .map((e) => e.entry_date!))];
}
export function pandaProgress(data: PandaData, entries: Entry[]) {
  const currentDay = new Date().toLocaleDateString('en-CA');
  const linked = data.linkHabits ? linkedPandaDays(entries).filter((day) => day >= data.adoptedAt && day <= currentDay) : [];
  // Les journées suivies comptent une fois ; aucune mauvaise humeur ou journée sans entrée ne pénalise.
  const loggedDays = new Set(data.moments.map((m) => m.day));
  const extraDays = linked.filter((day) => !loggedDays.has(day)).length;
  const points = data.moments.length + extraDays;
  const level = Math.max(data.bestLevel, pandaLevel(points));
  const next = nextPandaMilestone(level);
  return { points, level, next, linkedDays: extraDays, days: new Set([...loggedDays, ...linked]).size };
}
