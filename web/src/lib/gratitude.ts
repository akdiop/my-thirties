/**
 * Ma gratitude : trois gratitudes guidées le matin et le soir (questions d'Aïda), le parcours de 7 jours
 * et les 30 amorces du « Journal de gratitude 7 jours » (journaldegratitude.fr), et la relecture de tout ce qui a été écrit.
 */
import type { Entry } from './cloud';
import { DAILY_KIND, NOTE_KIND } from './rituals';

export const GRAT_KIND = 'gratitude_jour';
export const GRAT_SETTINGS = 'gratitude_reglages';
export type Moment = 'matin' | 'soir';

export const MATIN = [
  'Une chose qui me donne envie de me lever aujourd’hui', 'Un moment d’hier que je veux savourer encore', 'Une qualité que j’aime chez moi',
  'Une personne qui m’apporte de la douceur', 'Une petite chose que j’attends avec joie aujourd’hui', 'Un détail agréable autour de moi (couleur, odeur, lumière)',
  'Ce dont je suis fière cette semaine', 'Un objectif du jour qui me rend heureuse', 'Ce que j’aime dans ma routine du matin',
  'Une inspiration ou citation qui me motive', 'Une sensation agréable dans mon corps', 'Quelque chose que j’ai appris récemment', 'Un défi que je suis capable de relever',
];
export const SOIR = [
  'Trois choses qui ont rendu ma journée meilleure', 'Une personne qui m’a apporté quelque chose aujourd’hui', 'Un moment où j’ai réussi à rester calme',
  'Une émotion positive ressentie aujourd’hui', 'Une preuve de progrès dans ma vie', 'Une situation difficile dont je retire un enseignement', 'Le meilleur moment de ma journée',
  'Quelque chose que j’ai apprécié chez moi', 'Une bonne surprise du jour', 'Un geste de gentillesse donné ou reçu', 'Une réussite, même petite',
  'Ce que mon corps m’a permis d’accomplir aujourd’hui', 'Une chose que j’ai envie de célébrer',
];
export const AMORCES = [
  'Un moment calme aujourd’hui', 'Une personne qui m’a aidée', 'Un goût ou une odeur appréciée', 'Une petite victoire', 'Quelque chose que mon corps a permis',
  'Un objet qui me simplifie la vie', 'Un rire ou un sourire', 'Une attention reçue', 'Un confort que j’oublie souvent', 'Un coin de nature remarqué',
  'Un message qui m’a fait du bien', 'Une pause que je me suis accordée', 'Une chose faite malgré la fatigue', 'Un détail beau ou drôle', 'Un repas ou une boisson savourée',
  'Une chose apprise récemment', 'Une erreur qui m’a fait avancer', 'Un endroit où je me sens bien', 'Une musique qui m’a accompagnée', 'Un problème évité',
  'Une personne à remercier', 'Une qualité que j’ai utilisée', 'Un instant sans écran', 'Une tâche enfin terminée', 'Une chose qui a été plus simple que prévu',
  'Un souvenir revenu aujourd’hui', 'Une liberté dont je profite', 'Une chose que j’attends avec plaisir', 'Ce qui a tenu dans une journée difficile', 'Une chose que je veux garder en mémoire',
];
export const GESTES = ['Bouger', 'Lire', 'Respirer', 'Me reposer'];

export type JourProgramme = { theme: string; q: [string, string, string]; extra: string; extraHint: string; mot: string };
export const PROGRAMME: JourProgramme[] = [
  { theme: 'Aujourd’hui, j’ai envie de garder…', q: ['Une chose précise qui m’a fait du bien', 'Une personne, un geste ou une présence', 'Une petite chose que j’aurais pu oublier'], extra: 'Une note pour demain', extraHint: 'si j’en ai envie', mot: 'Le précis bat le parfait.' },
  { theme: 'Ce qui a compté aujourd’hui', q: ['Un moment que j’ai apprécié', 'Une petite victoire', 'Un confort ou un détail agréable'], extra: 'Une photo mentale', extraHint: 'la scène que j’aimerais revoir', mot: 'Trois lignes, c’est déjà une page.' },
  { theme: 'Les petits appuis de ma journée', q: ['Quelqu’un qui m’a fait du bien', 'Quelque chose que mon corps a permis', 'Une chose qui n’est pas arrivée, heureusement'], extra: 'Mon besoin du moment', extraHint: 'repos, lien, mouvement, calme…', mot: 'Tout n’a pas besoin d’aller bien.' },
  { theme: 'Ce que mes sens ont remarqué', q: ['Une odeur, un son ou une lumière', 'Quelque chose de bon ou de réconfortant', 'Un lieu où je me suis sentie bien'], extra: 'Le détail du jour', extraHint: 'celui que je ne veux pas oublier', mot: 'Les petites choses sont assez grandes.' },
  { theme: 'Mes petites victoires', q: ['Une chose commencée ou terminée', 'Une limite que j’ai respectée', 'Un effort discret dont je suis contente'], extra: 'Mon prochain petit pas', extraHint: 'assez petit pour être faisable', mot: 'Un effort minuscule compte aussi.' },
  { theme: 'Les personnes autour de moi', q: ['Un geste reçu', 'Une conversation ou une présence', 'Un merci que j’aimerais dire'], extra: 'Une personne à qui penser', extraHint: 'un message, peut-être', mot: 'Un merci précis vaut mieux qu’un merci automatique.' },
  { theme: 'Ma semaine, vue d’ici', q: ['La gratitude que j’aime le plus relire', 'Ce qui m’a surprise cette semaine', 'Ce que j’aimerais emporter dans la suivante'], extra: 'Ce que ces sept jours m’ont appris', extraHint: 'quelques mots', mot: 'Tu peux reprendre demain ou plus tard.' },
];

export type GratData = { date?: string; matin?: string[]; soir?: string[]; qMatin?: string[]; qSoir?: string[]; p7?: string[]; p7extra?: string; meteo?: string; gestes?: string[]; note?: string;
  photo?: string; media?: { path: string; type: 'photo' | 'audio'; secs?: number }[]; nom?: { n: number; text: string } };

const dayNumber = (iso: string) => Math.floor(Date.parse(iso + 'T12:00:00Z') / 86_400_000);
/** Les trois questions du jour : elles changent chaque jour, dans l'ordre des listes. */
export function questionsOf(moment: Moment, day: string): [string, string, string] {
  const list = moment === 'matin' ? MATIN : SOIR, n = dayNumber(day) * 3;
  return [0, 1, 2].map((k) => list[((n + k) % list.length + list.length) % list.length]!) as [string, string, string];
}
/** Jour du parcours de 7 jours (1 à 7), ou 0 s'il n'est pas en cours. */
export function programDay(start: unknown, day: string) {
  if (typeof start !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(start)) return 0;
  const d = dayNumber(day) - dayNumber(start) + 1;
  return d >= 1 && d <= 7 ? d : 0;
}

export type Gratitude = { date: string; text: string; source: string };
const lines = (v: unknown) => (Array.isArray(v) ? v.map(String) : typeof v === 'string' ? v.split('\n') : []).map((s) => s.trim()).filter(Boolean);

/** Toutes mes gratitudes, d'où qu'elles viennent : Ma gratitude, Mon jour, notes « Gratitude », entrées Gratitude de Mon équilibre. */
export function allGratitudes(entries: Entry[]): Gratitude[] {
  const out: Gratitude[] = [];
  for (const e of entries) {
    const date = String(e.entry_date ?? e.data.date ?? e.created_at?.slice(0, 10) ?? '');
    if (!date) continue;
    if (e.kind === GRAT_KIND) {
      const d = e.data as GratData;
      for (const t of lines(d.matin)) out.push({ date, text: t, source: 'Matin' });
      for (const t of lines(d.soir)) out.push({ date, text: t, source: 'Soir' });
      for (const t of lines(d.p7)) out.push({ date, text: t, source: '7 jours' });
    } else if (e.kind === DAILY_KIND) for (const t of lines(e.data.gratitudes)) out.push({ date, text: t, source: 'Mon jour' });
    else if (e.kind === NOTE_KIND && e.data.folder === 'gratitude') { const t = String(e.data.body ?? '').trim(); if (t) out.push({ date, text: t, source: 'Note' }); }
    else if (e.kind === 'gratitude') for (const t of lines(e.data.positive)) out.push({ date, text: t, source: 'Mon équilibre' });
  }
  return out.sort((a, b) => b.date.localeCompare(a.date));
}

/** Jours de suite avec au moins une gratitude (aujourd'hui compte s'il est rempli, sinon on part d'hier). */
export function gratitudeStreak(list: Gratitude[], today: string) {
  const days = new Set(list.map((g) => g.date));
  let n = dayNumber(today) - (days.has(today) ? 0 : 1), count = 0;
  const iso = (k: number) => new Date(k * 86_400_000 + 43_200_000).toISOString().slice(0, 10);
  while (days.has(iso(n))) { count++; n--; }
  return count;
}

/** Une idée quand rien ne vient : les 30 amorces et les idées du moment (matin ou soir). */
export const ideasFor = (moment: Moment | 'sept') => [...AMORCES, ...(moment === 'matin' ? MATIN : SOIR)];

const STOP = new Set(('le la les un une des de du d l à au aux et en dans pour par sur avec sans que qui quoi ce cet cette ces mon ma mes ton ta tes son sa ses notre nos votre vos leur leurs je j me m moi tu te t il elle on nous vous ils elles y a ai as est été être avoir fait faire plus très bien tout tous toute toutes ne pas n se s qu c ça cela comme mais ou où donc si aussi encore déjà quand chez entre peu un peu aujourd hui aujourd’hui jour journée').split(' '));
/** Les mots qui reviennent le plus dans mes gratitudes d'une période. */
export function topWords(list: Gratitude[], from: string, to: string, n = 8) {
  const count = new Map<string, number>();
  for (const g of list) if (g.date >= from && g.date <= to)
    for (const w of g.text.toLowerCase().normalize('NFC').split(/[^\p{L}]+/u)) if (w.length > 2 && !STOP.has(w)) count.set(w, (count.get(w) ?? 0) + 1);
  return [...count.entries()].filter(([, c]) => c > 1).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n).map(([word, c]) => ({ word, c }));
}

/** Une gratitude d'un autre jour, à relire (au hasard, ou stable pour la journée si un jour est donné). */
export function gratitudeToReread(list: Gratitude[], today: string, stable = false) {
  const old = list.filter((g) => g.date < today);
  if (!old.length) return null;
  return old[stable ? dayNumber(today) % old.length : Math.floor(Math.random() * old.length)]!;
}

/** Une fois par semaine (le vendredi), relier un bienfait à un Nom d'Allah : un nom différent chaque semaine. */
export const isNameDay = (day: string) => new Date(day + 'T12:00:00').getDay() === 5;
export const nameIndexOf = (day: string) => Math.floor(dayNumber(day) / 7);

/** Météo intérieure et gestes du jour notés dans Ma gratitude, pour le calendrier d'humeur du bilan. */
export function weatherOf(entries: Entry[], day: string) {
  const d = entries.find((e) => e.kind === GRAT_KIND && e.entry_date === day)?.data as GratData | undefined;
  return { meteo: d?.meteo ?? '', gestes: d?.gestes ?? [] };
}

export const MERCI = (name: string, why: string) => 'Je pensais à toi' + (name ? ', ' + name : '') + '. ' + (why ? 'Merci pour ' + why.replace(/^(pour|merci)\s+/i, '') + '.' : 'Merci d’être là, tout simplement.') + ' Ça m’a fait du bien.';
