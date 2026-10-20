import { LEARNING_CHALLENGE_TEMPLATES } from './learningTemplates';
import { addDays, daysBetween, type ISODate } from '@/agenda/dates';

export type DayStatus = 'done' | 'rest' | 'missed';
export type CellState = DayStatus | 'today' | 'planned-rest' | 'future' | 'pending';

export type ChallengeUnit = 'reps' | 'seconds' | 'minutes';

export const UNIT_LABEL: Record<ChallengeUnit, string> = { reps: 'répétitions', seconds: 'secondes', minutes: 'minutes' };
export const UNIT_SHORT: Record<ChallengeUnit, string> = { reps: '', seconds: 's', minutes: 'min' };

export type ChallengeTemplate = {
  id: string;
  title: string;
  exercise: string;
  unit: ChallengeUnit;
  start: number;
  step: number;
  stepEvery: number;
  restEvery: number;
  days: number;
  sets: number;
  instructions: string[];
  cautions: string;
  alternative: string;
};

export function buildPlan(t: Pick<ChallengeTemplate, 'start' | 'step' | 'stepEvery' | 'restEvery' | 'days'>) {
  const plan: number[] = [];
  let level = 0;
  let active = 0;
  for (let d = 1; d <= t.days; d++) {
    if (t.restEvery > 0 && d % t.restEvery === 0) {
      plan.push(0);
      continue;
    }
    plan.push(t.start + level * t.step);
    active++;
    if (active % t.stepEvery === 0) level++;
  }
  return plan;
}

export const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  ...LEARNING_CHALLENGE_TEMPLATES,
  {
    id: 'squats',
    title: 'Squat challenge',
    exercise: 'Squats',
    unit: 'reps',
    start: 15,
    step: 5,
    stepEvery: 2,
    restEvery: 4,
    days: 30,
    sets: 3,
    instructions: ['Pieds à largeur de hanches, pointes légèrement ouvertes.', 'Dos droit, poitrine ouverte, regard devant.', 'Descendez jusqu’à cuisses parallèles au sol, ou moins si besoin.', 'Poussez dans les talons pour remonter, en expirant.'],
    cautions: 'Genoux dans l’axe des pieds. Arrêtez en cas de douleur aiguë au genou ou au dos.',
    alternative: 'Squat vers une chaise, ou demi-amplitude.',
  },
  {
    id: 'gainage',
    title: 'Gainage 30 jours',
    exercise: 'Planche sur les avant-bras',
    unit: 'seconds',
    start: 20,
    step: 5,
    stepEvery: 2,
    restEvery: 4,
    days: 30,
    sets: 2,
    instructions: ['Avant-bras au sol, coudes sous les épaules.', 'Corps aligné des épaules aux talons, nombril rentré.', 'Respirez calmement, sans bloquer.', 'Arrêtez dès que le bas du dos se creuse.'],
    cautions: 'Le bas du dos ne doit pas s’affaisser. Évitez en cas de douleur lombaire.',
    alternative: 'Planche sur les genoux, ou mains sur un plan surélevé.',
  },
  {
    id: 'pompes',
    title: 'Pompes progressives',
    exercise: 'Pompes inclinées puis au sol',
    unit: 'reps',
    start: 5,
    step: 1,
    stepEvery: 2,
    restEvery: 3,
    days: 30,
    sets: 3,
    instructions: ['Mains un peu plus larges que les épaules.', 'Corps gainé, en planche.', 'Descendez la poitrine vers le support en contrôlant.', 'Repoussez en expirant.'],
    cautions: 'Poignets douloureux : appuyez-vous sur les poings ou sur des poignées.',
    alternative: 'Pompes contre un mur ou sur les genoux.',
  },
  {
    id: 'mobilite',
    title: 'Mobilité quotidienne',
    exercise: 'Routine de mobilité (hanches, dos, épaules)',
    unit: 'minutes',
    start: 5,
    step: 1,
    stepEvery: 5,
    restEvery: 0,
    days: 30,
    sets: 1,
    instructions: ['Cercles de bassin et d’épaules.', 'Chat-vache, 8 respirations.', 'Fente basse, 30 s de chaque côté.', 'Torsion allongée, 30 s de chaque côté.'],
    cautions: 'Mouvements sans douleur, jamais en force.',
    alternative: 'Version assise sur une chaise.',
  },
  {
    id: 'yoga',
    title: 'Yoga 30 jours',
    exercise: 'Séance de yoga doux',
    unit: 'minutes',
    start: 10,
    step: 5,
    stepEvery: 8,
    restEvery: 7,
    days: 30,
    sets: 1,
    instructions: ['Commencez par 2 minutes de respiration.', 'Enchaînez les postures de la séance du jour dans Mon sport › Yoga.', 'Terminez par 3 minutes en posture de relaxation.'],
    cautions: 'Adaptez ou sautez une posture inconfortable.',
    alternative: 'Séance de 10 minutes.',
  },
];

export const templateById = (id: string | null) => CHALLENGE_TEMPLATES.find((t) => t.id === id);

export const dayIndexFor = (startDate: ISODate, date: ISODate) => daysBetween(startDate, date) + 1;

export const dateForDay = (startDate: ISODate, day: number) => addDays(startDate, day - 1);

export function cellState(plan: number[], day: number, today: number, recorded: DayStatus | undefined): CellState {
  if (recorded) return recorded;
  if (plan[day - 1] === 0) return day <= today ? 'rest' : 'planned-rest';
  if (day === today) return 'today';
  if (day < today) return 'pending';
  return 'future';
}

export function summary(plan: number[], today: number, records: Map<number, DayStatus>) {
  let done = 0;
  let rest = 0;
  let missed = 0;
  for (let d = 1; d <= Math.min(today, plan.length); d++) {
    const s = cellState(plan, d, today, records.get(d));
    if (s === 'done') done++;
    else if (s === 'rest') rest++;
    else if (s === 'missed' || s === 'pending') missed++;
  }
  return { done, rest, missed, elapsed: Math.min(Math.max(today, 0), plan.length), total: plan.length };
}

export const cycleStatus = (s: CellState): DayStatus => (s === 'done' ? 'missed' : s === 'missed' || s === 'pending' ? 'rest' : 'done');

export const adapt = (value: number, factor = 0.8) => Math.max(1, Math.round(value * factor));

export function postponeFrom(plan: number[], day: number) {
  return [...plan.slice(0, day - 1), 0, ...plan.slice(day - 1)];
}

export function proposals(activeTemplateIds: string[], recentCompletion: number | null) {
  const easier = recentCompletion !== null && recentCompletion < 0.6;
  const available = CHALLENGE_TEMPLATES.filter((t) => !activeTemplateIds.includes(t.id));
  return [...available.filter((t) => !t.id.startsWith('learning-')).slice(0, 3), ...available.filter((t) => t.id.startsWith('learning-')).slice(0, 3)]
    .map((t) => ({ template: t, easier, reason: easier ? 'Version allégée : le mois dernier a été chargé.' : 'Nouveau défi pour ce mois.' }));
}
