import type { Entry } from './cloud';

/** Ma boussole : vision, objectifs à jalons et roue de la vie. */
export const VISION_KIND = 'vision';
export const GOAL_KIND = 'objectif';
export const WHEEL_KIND = 'roue';
export const GROWTH_KINDS = [VISION_KIND, GOAL_KIND, WHEEL_KIND];

/** Les domaines de la roue de la vie (et des objectifs). */
export const LIFE_DOMAINS = ['Santé', 'Argent', 'Travail', 'Amour', 'Famille et amis', 'Spiritualité', 'Épanouissement', 'Loisirs', 'Contribution'] as const;
/** Une question pour se noter honnêtement dans chaque domaine. */
export const DOMAIN_QUESTIONS: Record<string, string> = {
  'Santé': 'Est-ce que je me sens pleine d’énergie au quotidien ?',
  'Argent': 'Est-ce que je me sens en sécurité et libre avec mes finances ?',
  'Travail': 'Mon travail a-t-il du sens et utilise-t-il mes forces ?',
  'Amour': 'Ma vie amoureuse me rend-elle heureuse et sereine ?',
  'Famille et amis': 'Mes liens sont-ils soutenants et authentiques ?',
  'Spiritualité': 'Est-ce que je me sens reliée à ma foi au quotidien ?',
  'Épanouissement': 'Est-ce que j’apprends et je grandis ?',
  'Loisirs': 'Est-ce que je prends du temps pour le plaisir ?',
  'Contribution': 'Est-ce que je donne de mon temps ou de mes talents aux autres ?',
};
export type LifeDomain = typeof LIFE_DOMAINS[number];

export type GoalStep = { id: string; text: string; done: boolean };
export const goalSteps = (e: Entry): GoalStep[] => Array.isArray(e.data.steps)
  ? (e.data.steps as GoalStep[]).filter((s) => s && typeof s.text === 'string') : [];
export const goalHabits = (e: Entry): string[] => Array.isArray(e.data.habits) ? (e.data.habits as unknown[]).map(String) : [];
export const goalProgress = (e: Entry) => { const s = goalSteps(e); return s.length ? s.filter((x) => x.done).length / s.length : 0; };

export const monthKey = (iso: string) => iso.slice(0, 7);
export const wheelScores = (e: Entry | undefined): Partial<Record<LifeDomain, number>> =>
  e && e.data.scores && typeof e.data.scores === 'object' ? e.data.scores as Partial<Record<LifeDomain, number>> : {};

/** Récompenses douces : des paliers atteints au total, jamais perdus quand on manque un jour. */
export const BADGE_STEPS = [7, 30, 100] as const;
export const badgesOf = (doneCount: number) => BADGE_STEPS.filter((n) => doneCount >= n);
export const nextBadge = (doneCount: number) => BADGE_STEPS.find((n) => doneCount < n);

/** Question du soir : une différente chaque jour, toujours la même pour une date donnée. */
export const EVENING_QUESTIONS = [
  'Qu’est-ce qui m’a fait sourire aujourd’hui ?',
  'Quel moment de la journée j’aimerais revivre ?',
  'Qu’ai-je appris sur moi aujourd’hui ?',
  'De quoi suis-je fière, même un peu ?',
  'Qui m’a fait du bien aujourd’hui, et pourquoi ?',
  'Qu’est-ce qui m’a donné de l’énergie ?',
  'Qu’est-ce qui m’a pris de l’énergie ?',
  'Quelle petite chose ai-je bien faite ?',
  'Qu’est-ce que j’ai remis à plus tard, et pourquoi ?',
  'Si cette journée avait un titre, lequel ?',
  'Qu’ai-je fait aujourd’hui pour mon moi de 40 ans ?',
  'Quelle émotion a dominé ma journée ?',
  'Qu’est-ce que je veux garder de cette journée ?',
  'À quoi ai-je dit oui alors que je voulais dire non ?',
  'Qu’est-ce qui m’a surprise aujourd’hui ?',
  'Comment ai-je pris soin de mon corps ?',
  'Quelle pensée est revenue souvent aujourd’hui ?',
  'Qu’est-ce qui m’a rapprochée de mes objectifs ?',
  'Quelle conversation m’a marquée ?',
  'Pour quoi suis-je reconnaissante ce soir ?',
  'Qu’aurais-je aimé dire et que je n’ai pas dit ?',
  'Qu’est-ce qui m’a apaisée aujourd’hui ?',
  'Quelle décision ai-je prise, même petite ?',
  'Où ai-je été trop dure avec moi-même ?',
  'Qu’ai-je fait juste pour le plaisir ?',
  'Quel conseil donnerais-je à la moi de ce matin ?',
  'Qu’est-ce qui m’a rendue curieuse ?',
  'Quelle habitude m’a aidée aujourd’hui ?',
  'Qu’est-ce que je peux laisser partir ce soir ?',
  'De quoi ai-je besoin demain pour bien commencer ?',
  'Quel moment de calme ai-je trouvé ?',
  'Qu’ai-je fait pour quelqu’un d’autre ?',
  'Qu’est-ce qui m’a fait me sentir vivante ?',
  'Quelle peur ai-je affrontée, même un peu ?',
  'Qu’est-ce qui a été plus facile que prévu ?',
  'Quel mot résume mon humeur ce soir ?',
  'Qu’est-ce que j’ai envie de célébrer ?',
  'Qu’est-ce qui m’a manqué aujourd’hui ?',
  'Quelle beauté ai-je remarquée autour de moi ?',
  'Qu’ai-je fait aujourd’hui qui me ressemble vraiment ?',
];

export function eveningQuestion(iso: string) {
  const n = Math.floor(new Date(iso + 'T12:00:00').getTime() / 86400000);
  return EVENING_QUESTIONS[((n % EVENING_QUESTIONS.length) + EVENING_QUESTIONS.length) % EVENING_QUESTIONS.length]!;
}
