/**
 * « Ma meilleure version » : programme de 3 mois pour changer de vie (d'après le visuel « Comment changer ta vie en 3 mois » d'Aïda).
 * Contenu reformulé, données dans une seule entrée de réglages.
 */
export const TRANSFO_KIND = 'programme_3mois';
export const TRANSFO_DAYS = 90;

export type Link = 'finances' | 'habits' | 'notes' | 'boussole' | 'sommeil' | 'lectures' | 'challenges';
export type Item = { id: string; text: string; link?: Link };
export type Section = { id: string; title: string; items: Item[] };

/** Les 7 piliers du changement. */
export const PILLARS: Section[] = [
  { id: 'env', title: 'Environnement', items: [
    { id: 'env1', text: 'Faire un grand tri et nettoyage' }, { id: 'env2', text: 'Me séparer de ce qui n’apporte plus de valeur' },
    { id: 'env3', text: 'Apporter une touche esthétique à chaque pièce' }, { id: 'env4', text: 'Créer un vision board inspirant', link: 'boussole' }] },
  { id: 'esprit', title: 'État d’esprit', items: [
    { id: 'esp1', text: 'Noter 3 gratitudes chaque soir', link: 'notes' }, { id: 'esp2', text: 'Écouter des contenus positifs' },
    { id: 'esp3', text: 'Reformuler mes pensées en positif' }, { id: 'esp4', text: 'Écrire pour me libérer l’esprit', link: 'notes' }] },
  { id: 'image', title: 'Image personnelle', items: [
    { id: 'img1', text: 'Porter des vêtements qui me mettent en valeur' }, { id: 'img2', text: 'Simplifier et affirmer mon style' },
    { id: 'img3', text: 'Choisir un parfum signature' }, { id: 'img4', text: 'Soigner les détails : mains, cheveux…' }] },
  { id: 'dev', title: 'Développement personnel', items: [
    { id: 'dev1', text: 'Bouger mon corps 3 fois par semaine minimum', link: 'habits' }, { id: 'dev2', text: 'Apprendre quelque chose de nouveau' },
    { id: 'dev3', text: 'Prendre 10 minutes pour moi chaque jour' }, { id: 'dev4', text: 'Lire régulièrement', link: 'lectures' },
    { id: 'dev5', text: 'Cultiver des relations saines' }] },
  { id: 'sante', title: 'Santé', items: [
    { id: 'san1', text: 'Boire 2 L d’eau par jour' }, { id: 'san2', text: 'Manger sain et équilibré (80/20)' },
    { id: 'san3', text: '10 000 pas par jour' }, { id: 'san4', text: 'Dormir 7 à 8 heures par nuit', link: 'sommeil' }, { id: 'san5', text: 'Prendre soin de ma peau' }] },
  { id: 'fin', title: 'Finances', items: [
    { id: 'fin1', text: 'Mettre de côté chaque mois', link: 'finances' }, { id: 'fin2', text: 'Suivre mes dépenses', link: 'finances' },
    { id: 'fin3', text: 'Construire une épargne de sécurité (6 mois)', link: 'finances' }, { id: 'fin4', text: 'Développer mes sources de revenus' }] },
  { id: 'vision', title: 'Vision', items: [
    { id: 'vis1', text: 'Clarifier la vie que je veux', link: 'boussole' }, { id: 'vis2', text: 'Avancer chaque jour, même doucement' }] },
];

/** Le plan de l'objectif chiffré (par défaut, perte de poids). */
export const PLAN: Section[] = [
  { id: 'alim', title: 'Alimentation', items: [
    { id: 'al1', text: 'Alimentation végétarienne équilibrée' }, { id: 'al2', text: 'Des légumes à chaque repas' },
    { id: 'al3', text: 'Des protéines végétales à chaque repas' }, { id: 'al4', text: 'Moins de sucres, plus de fibres' },
    { id: 'al5', text: '2 L d’eau par jour' }, { id: 'al6', text: 'Limiter les produits ultra-transformés' },
    { id: 'al7', text: 'Préparer mes repas à l’avance' }, { id: 'al8', text: 'Des recettes saines et gourmandes' }] },
  { id: 'act', title: 'Activité physique', items: [
    { id: 'ac1', text: '3 à 4 séances par semaine', link: 'challenges' }, { id: 'ac2', text: 'Marche : 8 000 à 12 000 pas par jour' },
    { id: 'ac3', text: 'Cardio doux : course lente' }, { id: 'ac4', text: 'Renforcement à la maison' }, { id: 'ac5', text: 'Étirements et mobilité' }] },
  { id: 'suivi', title: 'Suivi et motivation', items: [
    { id: 'su1', text: 'Me peser une fois par semaine' }, { id: 'su2', text: 'Prendre des photos' }, { id: 'su3', text: 'Noter mes progrès' },
    { id: 'su4', text: 'Rester patiente et constante' }, { id: 'su5', text: 'Me rappeler mon pourquoi' }] },
];

export const WHY = ['Énergie', 'Confiance en moi', 'Santé', 'Liberté', 'Respect de mon corps'];

export const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
export const SLOTS = ['Matin', 'Après-midi', 'Soir'];
/** Semaine type proposée au départ, modifiable case par case. */
export const DEFAULT_WEEK: string[][] = [
  ['Routine du matin', 'Travail', 'Dîner léger'], ['Routine du matin', 'Travail', 'Séance maison'], ['Routine du matin', 'Travail', 'Dîner léger'],
  ['Routine du matin', 'Travail', 'Séance maison'], ['Routine du matin', 'Travail', 'Dîner léger'], ['Marche nature', 'Famille', 'Sortie ou balade'],
  ['Repos actif', 'Repos actif', 'Convivialité'],
];
export const DEFAULT_FOCUS = 'Rester régulière, écouter mon corps et célébrer chaque petite victoire.';

export const MONTH_HABITS = ['Sport ou marche', '10 000 pas par jour', 'Eau (2 L)', 'Lecture ou détente', 'Gratitude'];
export const DEFAULT_MONTH_GOALS = ['Être régulière', 'Me sentir bien'];
export const DONT_FORGET = ['Boire de l’eau', 'Préparer mes repas', 'Écouter mon corps', 'Faire de mon mieux'];

export const LIFESTYLE: Section[] = [
  { id: 'semaine', title: 'En semaine', items: [
    { id: 'ls1', text: 'Préparer mes repas' }, { id: 'ls2', text: 'Routine du matin', link: 'habits' }, { id: 'ls3', text: 'Lunchbox saine' },
    { id: 'ls4', text: 'Pause active' }, { id: 'ls5', text: 'Hydratation' }, { id: 'ls6', text: 'Déconnexion le soir' }] },
  { id: 'vacances', title: 'En vacances', items: [
    { id: 'lv1', text: 'Profiter de mes proches' }, { id: 'lv2', text: 'Manger avec plaisir' }, { id: 'lv3', text: 'Bouger chaque jour' },
    { id: 'lv4', text: 'Découvrir, explorer' }, { id: 'lv5', text: 'Me reposer' }, { id: 'lv6', text: 'Rester alignée à 80/20' }] },
];
export const SESSIONS = ['Marche rapide', 'Course douce', 'Renforcement maison', 'Étirements', 'Yoga et mobilité'];
export const GOLDEN_RULE = 'Moins de pression, plus de constance. Moins de perfection, plus de progrès.';

export type Weigh = { date: string; value: number };
export type TransfoData = {
  start?: string; end?: string;
  checks?: Record<string, boolean>;
  custom?: Record<string, string[]>;
  goal?: { label?: string; unit?: string; start?: number; target?: number };
  why?: string[]; whyOther?: string;
  weighs?: Weigh[];
  week?: string[][]; focus?: string;
  months?: string[][];
  mode?: 'semaine' | 'vacances';
};

const toDate = (iso: string) => new Date(iso + 'T12:00:00');
const addDays = (iso: string, n: number) => { const d = toDate(iso); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
export const endOf = (start: string) => addDays(start, TRANSFO_DAYS - 1);

/** Où j'en suis : jour (1-90), mois (1-3), semaine (1-13), terminé ou non. */
export function progressOf(start: string, end: string, today: string) {
  const total = Math.max(1, Math.round((toDate(end).getTime() - toDate(start).getTime()) / 86_400_000) + 1);
  const day = Math.min(total, Math.max(1, Math.round((toDate(today).getTime() - toDate(start).getTime()) / 86_400_000) + 1));
  return { day, total, month: Math.min(3, Math.ceil(day / (total / 3))), week: Math.ceil(day / 7), done: today > end, started: today >= start };
}

/** Part des cases cochées parmi les piliers et le plan (éléments ajoutés compris). */
export function checklistShare(d: TransfoData, sections: Section[]) {
  const ids = sections.flatMap((s) => [...s.items.map((i) => i.id), ...(d.custom?.[s.id] ?? []).map((_, k) => s.id + '-c' + k)]);
  const done = ids.filter((id) => d.checks?.[id]).length;
  return { done, total: ids.length, share: ids.length ? done / ids.length : 0 };
}

/** Cinq paliers réguliers entre le point de départ et l'objectif, et ceux déjà atteints d'après la dernière mesure. */
export function milestones(goal: TransfoData['goal'], weighs: Weigh[] = []) {
  const s = Number(goal?.start), t = Number(goal?.target);
  if (!Number.isFinite(s) || !Number.isFinite(t) || s === t) return [];
  const last = [...weighs].sort((a, b) => a.date.localeCompare(b.date)).at(-1)?.value;
  const step = (t - s) / 5;
  return [1, 2, 3, 4, 5].map((k) => {
    const value = Math.round((s + step * k) * 10) / 10;
    const reached = last !== undefined && (t < s ? last <= value : last >= value);
    return { value, delta: Math.round((value - s) * 10) / 10, reached };
  });
}

/** Les trois mois du programme (nom du mois de chaque tiers). */
export function monthsOf(start: string) {
  return [0, 1, 2].map((k) => { const d = toDate(addDays(start, k * 30)); return d.toLocaleDateString('fr-FR', { month: 'long' }); });
}
