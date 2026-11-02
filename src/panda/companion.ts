/**
 * Le panda est un compagnon ludique, pas un score de santé.
 * Aucun recul de niveau, aucune série obligatoire, aucun jugement sur l'humeur,
 * l'alimentation, les calories, le poids ou l'intensité du sport.
 */
export const CARE_ACTIONS = [
  { id: 'pause', title: 'Souffler', description: 'Prendre un moment pour respirer' },
  { id: 'repos', title: 'Me reposer', description: 'Prendre du temps pour récupérer' },
  { id: 'mouvement', title: 'Bouger doucement', description: 'Faire un mouvement agréable' },
  { id: 'creativite', title: 'Créer ou apprendre', description: 'Explorer une curiosité' },
] as const;
export type CareAction = typeof CARE_ACTIONS[number]['id'];
export type PandaMoment = { day: string; action: CareAction };
export type PandaState = {
  name: string;
  adoptedAt: string;
  moments: PandaMoment[];
  linkHabits: boolean;
  bestLevel: number;
};
const LIMITS = [0, 3, 9, 18, 30] as const;
export const PANDA_STAGES = ['Petit panda', 'Panda curieux', 'Panda explorateur', 'Panda épanoui', 'Panda sage'] as const;
export const stageFromPoints = (points: number) => LIMITS.reduce<number>((best, limit, i) => points >= limit ? i : best, 0);
export const nextStage = (stage: number) => LIMITS[stage + 1] ?? null;
export const isCareDone = (state: PandaState, day: string, action: CareAction) =>
  state.moments.some((item) => item.day === day && item.action === action);

export function pandaProgress(state: PandaState, linkedDates: string[]) {
  const recorded = new Set(state.moments.map((x) => x.day));
  const uniqueLinked = new Set(state.linkHabits ? linkedDates.filter((d) => d >= state.adoptedAt) : []);
  const extras = [...uniqueLinked].filter((day) => !recorded.has(day)).length;
  const points = state.moments.length + extras;
  const stage = Math.max(state.bestLevel, stageFromPoints(points));
  return { points, stage, next: nextStage(stage), linkedDays: extras,
    daysTogether: new Set([...recorded, ...uniqueLinked]).size };
}
