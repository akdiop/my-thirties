/**
 * Le Coran en français : PDF « Coran Français texte » diffusé par sunnisme.com (transmis par Aïda).
 * Le texte est dans public/coran : un index léger, un fichier par sourate chargé à la demande, et un fichier de recherche chargé seulement quand je cherche.
 */
import type { Entry } from './cloud';
import type { Recherche } from './jardin';

export const CORAN_KIND = 'coran';
export const CORAN_SOURCE = 'Traduction française du sens, d’après le PDF « Coran Français texte » diffusé par sunnisme.com';
export const SOURATES = 114;

/** [numéro, nom, nombre de versets] */
export type SourateIndex = [number, string, number];
export type Sourate = { n: number; t: string; v: string[] };

const cache = new Map<string, Promise<unknown>>();
const load = <T,>(path: string): Promise<T> => {
  if (!cache.has(path)) cache.set(path, fetch(path).then((r) => { if (!r.ok) throw new Error('Lecture impossible'); return r.json(); }).catch((e) => { cache.delete(path); throw e; }));
  return cache.get(path) as Promise<T>;
};
export const loadSourates = () => load<SourateIndex[]>('/coran/index.json');
export const loadSourate = (n: number) => load<Sourate>('/coran/s' + n + '.json');
export const loadRechercheCoran = () => load<Recherche>('/coran/recherche.json');

/** Versets choisis pour le verset du jour : réconfort, confiance, invocations. */
export const VERSETS_DU_JOUR: [number, number][] = [
  [2, 152], [2, 153], [2, 186], [2, 201], [2, 286], [3, 8], [3, 139], [4, 28], [6, 162], [7, 23], [7, 56], [9, 51], [12, 86], [12, 87],
  [13, 28], [14, 7], [16, 97], [17, 24], [17, 80], [18, 10], [18, 46], [19, 96], [20, 25], [20, 46], [21, 83], [21, 87], [23, 118], [24, 35],
  [25, 74], [29, 69], [33, 41], [39, 53], [42, 19], [49, 10], [49, 12], [50, 16], [55, 60], [59, 18], [64, 11], [65, 3], [66, 8], [84, 6],
  [87, 14], [89, 27], [93, 3], [93, 5], [94, 5], [94, 6],
];
export function versetDuJourRef(day: string): [number, number] {
  const n = Math.floor(Date.parse(day + 'T12:00:00Z') / 86_400_000);
  return VERSETS_DU_JOUR[((n * 5) % VERSETS_DU_JOUR.length + VERSETS_DU_JOUR.length) % VERSETS_DU_JOUR.length]!;
}

/** Lit une référence « Coran 3:200 » ou « 3.200 ». */
export function refCoran(ref: string): [number, number] | null {
  const m = /(\d{1,3})[:.](\d{1,3})/.exec(ref);
  if (!m) return null;
  const s = Number(m[1]), v = Number(m[2]);
  return s >= 1 && s <= SOURATES && v >= 1 ? [s, v] : null;
}

/** jours : les jours où j'ai coché « Lu aujourd'hui » (défiler ne compte pas). */
export type CoranState = { lus: number[]; favoris: [number, number][]; marque?: [number, number]; khatm: number; jours: string[] };
const pair = (x: unknown): x is [number, number] => Array.isArray(x) && x.length === 2 && x.every((n) => typeof n === 'number');
export function coranOf(entries: Entry[]): { entry?: Entry; state: CoranState } {
  const e = entries.find((x) => x.kind === CORAN_KIND);
  const d = (e?.data ?? {}) as Record<string, unknown>;
  return { entry: e, state: {
    lus: Array.isArray(d.lus) ? d.lus.map(Number).filter((n) => n >= 1 && n <= SOURATES) : [],
    favoris: Array.isArray(d.favoris) ? d.favoris.filter(pair) : [],
    marque: pair(d.marque) ? d.marque : undefined,
    khatm: Number(d.khatm) || 0,
    jours: Array.isArray(d.jours) ? d.jours.filter((x): x is string => typeof x === 'string') : [],
  } };
}
