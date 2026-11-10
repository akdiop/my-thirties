/** Moments de la journée et petits suivis du quotidien (eau), partagés par l'accueil et les rappels. */
export type Moment = 'matin' | 'journee' | 'soir' | 'nuit';

export function momentOf(hour: number): Moment {
  if (hour >= 4 && hour < 11) return 'matin';
  if (hour >= 11 && hour < 18) return 'journee';
  if (hour >= 18 && hour < 23) return 'soir';
  return 'nuit';
}

export const WATER_GOAL = 8;
export const waterOf = (data: Record<string, unknown> | undefined) => Math.max(0, Math.min(30, Number(data?.water) || 0));
