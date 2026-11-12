/** Jeux d'arabe : paquets de cartes, boîtes de révision (Leitner), questions à choix et progression. Fonctions pures. */
import { ALPHABET } from './alphabet';
import { PREMIERS_MOTS } from './premiersMots';
import { RELIGIEUX, type Mot } from './religieux';
import { VERBES } from './verbes';
import { FAWAID, GRAMMAIRE_SIMPLIFIEE } from './grammaire';
import { isoOf } from '../rituals';

export const ARABE_KIND = 'arabe_jeux';
export type Carte = Mot & { id: string; deck: string };
export type Paquet = { id: string; title: string; cards: Carte[] };

const cards = (deck: string, words: Mot[]) => words.map((w, i) => ({ ...w, id: deck + ':' + i, deck }));

export const PAQUETS: Paquet[] = [
  { id: 'alphabet', title: 'L’alphabet', cards: ALPHABET.map((x, i) => ({ ar: x.ar, ph: x.name, fr: 'la lettre ' + x.name + ' (' + x.ph + ')', id: 'alphabet:' + i, deck: 'alphabet' })) },
  ...PREMIERS_MOTS.map((f) => ({ id: 'pm-' + f.id, title: f.title, cards: cards('pm-' + f.id, f.words) })),
  ...RELIGIEUX.map((f) => ({ id: 'rel-' + f.id, title: f.title, cards: cards('rel-' + f.id, f.words.map((w) => ({ ...w, ph: w.ph.split(' → ')[0]! }))) })),
  { id: 'grammaire', title: 'Les notions de grammaire', cards: [...GRAMMAIRE_SIMPLIFIEE, ...FAWAID].filter((c) => c.titre[1] && /[\u0600-\u06FF]/.test(c.titre[0])).filter((c, i, a) => a.findIndex((x) => x.titre[2] === c.titre[2]) === i)
    .map((c) => ({ ar: c.titre[0], ph: c.titre[1], fr: c.titre[2], id: 'grammaire:' + c.id, deck: 'grammaire' })) },
  { id: 'verbes', title: '50 verbes', cards: VERBES.map((v) => ({ ar: v.ar[0], ph: v.ph[0], fr: v.fr, id: 'verbes:' + v.n, deck: 'verbes' })) },
];
export const paquet = (id: string) => PAQUETS.find((p) => p.id === id) ?? PAQUETS[0]!;

/** Progression enregistrée : boîte de chaque carte (0 à 5), points, jours joués. */
export type ArabeData = { boxes?: Record<string, number>; xp?: number; days?: string[]; best?: number };
export const MAX_BOX = 5;
export const boxOf = (d: ArabeData, id: string) => Math.max(0, Math.min(MAX_BOX, d.boxes?.[id] ?? 0));
export const mastered = (d: ArabeData) => Object.values(d.boxes ?? {}).filter((b) => b >= 3).length;

/** Je savais : la carte monte d'une boîte ; à revoir : elle revient à la première. */
export function grade(d: ArabeData, id: string, known: boolean): ArabeData {
  return { ...d, boxes: { ...(d.boxes ?? {}), [id]: known ? Math.min(MAX_BOX, boxOf(d, id) + 1) : 0 } };
}

/** Une séance : les cartes des petites boîtes d'abord (à revoir), puis les nouvelles, dans un ordre mêlé. */
export function session(d: ArabeData, deck: Carte[], n = 12, rnd = Math.random) {
  return shuffle(deck, rnd).sort((a, b) => boxOf(d, a.id) - boxOf(d, b.id)).slice(0, n);
}

/** Points du jour et série : un jour joué compte une fois. */
export function addXp(d: ArabeData, n: number, day: string, best?: number): ArabeData {
  const days = d.days?.includes(day) ? d.days : [...(d.days ?? []), day].slice(-400);
  return { ...d, xp: (d.xp ?? 0) + Math.max(0, n), days, best: Math.max(d.best ?? 0, best ?? 0) };
}
export function streak(d: ArabeData, today: string) {
  const set = new Set(d.days ?? []);
  const day = new Date(today + 'T12:00:00');
  if (!set.has(today)) day.setDate(day.getDate() - 1);
  let n = 0;
  while (set.has(isoOf(day))) { n++; day.setDate(day.getDate() - 1); }
  return n;
}

export function shuffle<T>(a: T[], rnd = Math.random) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j]!, b[i]!]; }
  return b;
}

/** Une question à quatre réponses : la bonne et trois autres du même paquet, sans doublon de sens. */
export function question(c: Carte, pool: Carte[], rnd = Math.random) {
  const others = shuffle(pool.filter((x) => x.id !== c.id && x.fr !== c.fr && x.ar !== c.ar), rnd);
  const seen = new Set([c.fr]);
  const wrong = others.filter((x) => (seen.has(x.fr) ? false : (seen.add(x.fr), true))).slice(0, 3);
  return shuffle([c, ...wrong], rnd);
}

/** Le mot du jour, le même toute la journée, en parcourant tous les paquets sauf l'alphabet. */
export function arabicWordOfDay(day: string) {
  const all = PAQUETS.filter((p) => p.id !== 'alphabet').flatMap((p) => p.cards);
  const n = Math.floor(new Date(day + 'T12:00:00').getTime() / 86400000);
  return all[((n * 37) % all.length + all.length) % all.length]!;
}
