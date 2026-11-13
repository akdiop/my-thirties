/**
 * Le Jardin des vertueux (Riyâd as-Sâlihîn) de l'imam an-Nawawî, traduction française diffusée par IslamHouse (PDF transmis par Aïda).
 * Le texte intégral est dans public/riyad : un index léger, un fichier par chapitre chargé à la demande, et un fichier de recherche chargé seulement quand je cherche.
 */
import type { Entry } from './cloud';

export const JARDIN_KIND = 'jardin';
export const JARDIN_SOURCE = 'Riyâd as-Sâlihîn (Le Jardin des vertueux), imam an-Nawawî, traduction française diffusée par IslamHouse';

/** [numéro, titre, nombre de hadiths, premier hadith, dernier hadith] */
export type ChapitreIndex = [number, string, number, number, number];
export type Chapitre = { n: number; t: string; v: string[]; h: [number, string][] };
export type Recherche = [number, number, string][];

const cache = new Map<string, Promise<unknown>>();
const load = <T,>(path: string): Promise<T> => {
  if (!cache.has(path)) cache.set(path, fetch(path).then((r) => { if (!r.ok) throw new Error('Lecture impossible'); return r.json(); }).catch((e) => { cache.delete(path); throw e; }));
  return cache.get(path) as Promise<T>;
};
export const loadIndex = () => load<ChapitreIndex[]>('/riyad/index.json');
export const loadChapitre = (n: number) => load<Chapitre>('/riyad/c' + n + '.json');
export const loadCourts = () => load<[number, number][]>('/riyad/courts.json');
export const loadRecherche = () => load<Recherche>('/riyad/recherche.json');

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
/** Recherche plein texte (tous les mots demandés, sans tenir compte des accents). */
export function chercher(data: Recherche, q: string, max = 40) {
  const words = fold(q).split(/\s+/).filter((w) => w.length > 1);
  if (!words.length) return [];
  const out: { c: number; n: number; extrait: string }[] = [];
  for (const [c, n, t] of data) {
    const f = fold(t);
    if (!words.every((w) => f.includes(w))) continue;
    const i = f.indexOf(words[0]!), from = Math.max(0, i - 80);
    out.push({ c, n, extrait: (from ? '… ' : '') + t.slice(from, from + 240) + (t.length > from + 240 ? ' …' : '') });
    if (out.length >= max) break;
  }
  return out;
}

/** Le hadith du jour : un hadith court, différent chaque jour. */
export function hadithDuJourRef(courts: [number, number][], day: string) {
  if (!courts.length) return null;
  const n = Math.floor(Date.parse(day + 'T12:00:00Z') / 86_400_000);
  return courts[((n * 7) % courts.length + courts.length) % courts.length]!;
}

/** Découpe une introduction en versets repérés « 3.200 » (sourate.verset). */
export function versets(intro: string) {
  const parts = intro.split(/(?:^|\s)(?=\d{1,3}\.\d{1,3}\s*[:«…\p{L}])/u).map((x) => x.trim()).filter(Boolean);
  return parts.map((p) => { const m = /^(\d{1,3})\.(\d{1,3})\s*:?\s*([\s\S]*)$/.exec(p); return m ? { ref: 'Coran ' + m[1] + ':' + m[2], texte: m[3]! } : { ref: '', texte: p }; });
}

/** Thèmes choisis pour moi, reliés à mon thème et à mes points de vigilance. */
export const THEMES_JARDIN: { titre: string; pour: string; chapitres: number[] }[] = [
  { titre: 'La patience', pour: 'Quand l’épreuve dure', chapitres: [3] },
  { titre: 'La modération', pour: 'Contre le perfectionnisme et la surcharge', chapitres: [14, 57] },
  { titre: 'La clémence et la douceur', pour: 'Quand les émotions sont fortes, contre la colère', chapitres: [74] },
  { titre: 'La confiance en Dieu', pour: 'Quand j’ai peur de manquer', chapitres: [7] },
  { titre: 'La sincérité et l’intention', pour: 'Ma niyya, au cœur de mes habitudes', chapitres: [1, 4] },
  { titre: 'La modestie', pour: 'Accueillir la critique avec humilité', chapitres: [71, 72] },
  { titre: 'Le bon préjugé', pour: 'Quand je soupçonne des intentions cachées', chapitres: [272] },
  { titre: 'La parole aimable et le sourire', pour: 'Ma chaleur, au service des liens', chapitres: [88] },
  { titre: 'Le repentir', pour: 'Repartir, sans me juger durement', chapitres: [2] },
  { titre: 'La crainte et l’espérance', pour: 'Garder l’équilibre du cœur', chapitres: [53] },
  { titre: 'La famille', pour: 'Mon foyer, mes liens', chapitres: [36] },
  { titre: 'Le Coran et les invocations', pour: 'Nourrir ma vie spirituelle', chapitres: [180, 250] },
];

export type JardinState = { lus: number[]; favoris: [number, number][]; dernier?: number };
export function jardinOf(entries: Entry[]): { entry?: Entry; state: JardinState } {
  const e = entries.find((x) => x.kind === JARDIN_KIND);
  const d = (e?.data ?? {}) as Partial<JardinState>;
  return { entry: e, state: { lus: Array.isArray(d.lus) ? d.lus.map(Number) : [], favoris: Array.isArray(d.favoris) ? d.favoris.filter((f) => Array.isArray(f) && f.length === 2) as [number, number][] : [], dernier: typeof d.dernier === 'number' ? d.dernier : undefined } };
}
