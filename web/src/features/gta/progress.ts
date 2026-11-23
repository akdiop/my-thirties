/**
 * Progression GTA VI : séparée du référentiel, rangée par identifiant stable dans une entrée `gta_progress`.
 * Mettre à jour les fichiers de données ne touche jamais à cet état ; les identifiants inconnus sont conservés.
 */
import type { Mission, MoneyLocation } from './types';

export const GTA_KIND = 'gta_progress';
export const PROGRESS_VERSION = 1;

export type MissionProgress = { completed: boolean; dateCompleted?: string; personalNotes?: string; favorite?: boolean };
export const MONEY_STATUSES = ['non_decouvert', 'decouvert', 'visite', 'butin', 'converti', 'termine'] as const;
export type MoneyStatus = typeof MONEY_STATUSES[number];
export const MONEY_STATUS_LABEL: Record<MoneyStatus, string> = { non_decouvert: 'Non découvert', decouvert: 'Découvert', visite: 'Visité', butin: 'Butin récupéré', converti: 'Valeur convertie', termine: 'Terminé' };
export type MoneyProgress = { status: MoneyStatus; steps: number[]; cash_recovered?: number; converted_amount?: number; visited_at?: string; notes?: string };
export const MARKER_CATEGORIES = ['repere', 'argent', 'mission', 'perso'] as const;
export type MarkerCategory = typeof MARKER_CATEGORIES[number];
/** Repère posé par Aïda sur l'image de la carte (coordonnées en % de l'image, jamais des coordonnées du jeu). */
export type Marker = { id: string; x: number; y: number; label: string; note?: string; category: MarkerCategory; createdAt: string };
export const COLLECTION_TYPES = ['objet', 'trophée', 'activité', 'collectible'] as const;
export type CollectionType = typeof COLLECTION_TYPES[number];
export type CollectionItem = { id: string; name: string; type: CollectionType; done: boolean; note?: string };
export type GtaSettings = { theme: boolean; hideSpoilers: boolean };
export type GtaProgress = {
  version: number;
  missions: Record<string, MissionProgress>;
  money: Record<string, MoneyProgress>;
  markers: Marker[];
  collections: CollectionItem[];
  recent: string[];
  /** Cases des listes « Astuces » (préparatifs, voitures rares…), par identifiant stable. */
  checks: Record<string, boolean>;
  /** Compteurs de la liste des 100 % (nombre ou montant en dollars du jeu), par identifiant stable. */
  counts: Record<string, number>;
  settings: GtaSettings;
};

export const emptyProgress = (): GtaProgress => ({ version: PROGRESS_VERSION, missions: {}, money: {}, markers: [], collections: [], recent: [], checks: {}, counts: {}, settings: { theme: true, hideSpoilers: true } });

const obj = (v: unknown): v is Record<string, unknown> => Boolean(v) && typeof v === 'object' && !Array.isArray(v);
const optStr = (v: unknown, max = 2000) => (typeof v === 'string' && v ? v.slice(0, max) : undefined);
const optNum = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.round(v) : undefined);
const MAX_COUNT = 100_000_000;
const clamp = (n: number) => Math.min(100, Math.max(0, n));
export const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

/** Relit n'importe quelle version enregistrée (ou un import) et la ramène au schéma courant, sans perdre de données valides. */
export function migrateProgress(input: unknown): GtaProgress {
  const out = emptyProgress();
  if (!obj(input)) return out;
  // v0 (avant versionnage) : { completed: string[] } — conservé pour un éventuel import ancien.
  if (Array.isArray(input.completed)) for (const id of input.completed) if (typeof id === 'string') out.missions[id] = { completed: true };
  if (obj(input.missions)) for (const [id, v] of Object.entries(input.missions)) {
    if (!obj(v)) continue;
    const m: MissionProgress = { completed: v.completed === true };
    const date = optStr(v.dateCompleted, 10); if (date && m.completed) m.dateCompleted = date;
    const notes = optStr(v.personalNotes); if (notes) m.personalNotes = notes;
    if (v.favorite === true) m.favorite = true;
    if (m.completed || m.personalNotes || m.favorite) out.missions[id] = m;
  }
  if (obj(input.money)) for (const [id, v] of Object.entries(input.money)) {
    if (!obj(v)) continue;
    const status = (MONEY_STATUSES as readonly string[]).includes(String(v.status)) ? v.status as MoneyStatus : 'non_decouvert';
    const steps = Array.isArray(v.steps) ? [...new Set(v.steps.filter((n): n is number => Number.isInteger(n) && n >= 0))].sort((a, b) => a - b) : [];
    out.money[id] = { status, steps, cash_recovered: optNum(v.cash_recovered), converted_amount: optNum(v.converted_amount), visited_at: optStr(v.visited_at, 10), notes: optStr(v.notes) };
  }
  if (Array.isArray(input.markers)) {
    const seen = new Set<string>();
    for (const v of input.markers) {
      if (!obj(v) || typeof v.x !== 'number' || typeof v.y !== 'number' || typeof v.label !== 'string') continue;
      const id = typeof v.id === 'string' ? v.id : 'm-' + Math.round(v.x * 100) + '-' + Math.round(v.y * 100);
      if (seen.has(id)) continue; seen.add(id);
      const category = (MARKER_CATEGORIES as readonly string[]).includes(String(v.category)) ? v.category as MarkerCategory : 'perso';
      out.markers.push({ id, x: clamp(v.x), y: clamp(v.y), label: v.label.slice(0, 80), note: optStr(v.note, 500), category, createdAt: optStr(v.createdAt, 30) ?? '' });
    }
  }
  if (Array.isArray(input.collections)) for (const v of input.collections) {
    if (!obj(v) || typeof v.name !== 'string' || !v.name.trim()) continue;
    const type = (COLLECTION_TYPES as readonly string[]).includes(String(v.type)) ? v.type as CollectionType : 'objet';
    const item = { id: typeof v.id === 'string' ? v.id : collectionKey(v.name, type), name: v.name.trim().slice(0, 120), type, done: v.done === true, note: optStr(v.note, 500) };
    if (!out.collections.some((c) => collectionKey(c.name, c.type) === collectionKey(item.name, item.type))) out.collections.push(item);
  }
  if (obj(input.checks)) for (const [k, v] of Object.entries(input.checks)) if (v === true && k.length <= 40) out.checks[k] = true;
  if (obj(input.counts)) for (const [k, v] of Object.entries(input.counts)) { const n = optNum(v); if (n && k.length <= 40) out.counts[k] = Math.min(n, MAX_COUNT); }
  if (Array.isArray(input.recent)) out.recent = [...new Set(input.recent.filter((x): x is string => typeof x === 'string'))].slice(0, 8);
  if (obj(input.settings)) out.settings = { theme: input.settings.theme !== false, hideSpoilers: input.settings.hideSpoilers !== false };
  return out;
}

export const missionDone = (p: GtaProgress, id: string) => p.missions[id]?.completed === true;

export function setMission(p: GtaProgress, id: string, patch: Partial<MissionProgress>, today: string): GtaProgress {
  const prev = p.missions[id] ?? { completed: false };
  const next: MissionProgress = { ...prev, ...patch };
  if (patch.completed === true && !prev.completed) next.dateCompleted = today;
  if (patch.completed === false) delete next.dateCompleted;
  const missions = { ...p.missions };
  if (!next.completed && !next.personalNotes && !next.favorite) delete missions[id]; else missions[id] = next;
  return { ...p, missions };
}

export const pushRecent = (p: GtaProgress, id: string): GtaProgress => (p.recent[0] === id ? p : { ...p, recent: [id, ...p.recent.filter((x) => x !== id)].slice(0, 8) });

export const moneyOf = (p: GtaProgress, id: string): MoneyProgress => p.money[id] ?? { status: 'non_decouvert', steps: [] };
export function setMoney(p: GtaProgress, id: string, patch: Partial<MoneyProgress>): GtaProgress {
  return { ...p, money: { ...p.money, [id]: { ...moneyOf(p, id), ...patch } } };
}
export function toggleStep(p: GtaProgress, id: string, step: number): GtaProgress {
  const cur = moneyOf(p, id);
  const steps = cur.steps.includes(step) ? cur.steps.filter((s) => s !== step) : [...cur.steps, step].sort((a, b) => a - b);
  const status: MoneyStatus = cur.status === 'non_decouvert' && steps.length ? 'decouvert' : cur.status;
  return setMoney(p, id, { steps, status });
}

export const collectionKey = (name: string, type: string) => type + ':' + normalize(name);
/** Ajoute un élément de collection ; refuse un doublon (même nom, même type, accents et casse ignorés). */
export function addCollection(p: GtaProgress, name: string, type: CollectionType): { progress: GtaProgress; duplicate: boolean } {
  const clean = name.trim().slice(0, 120);
  if (!clean) return { progress: p, duplicate: false };
  const key = collectionKey(clean, type);
  if (p.collections.some((c) => collectionKey(c.name, c.type) === key)) return { progress: p, duplicate: true };
  return { progress: { ...p, collections: [...p.collections, { id: key + ':' + Date.now().toString(36), name: clean, type, done: false }] }, duplicate: false };
}

/** Statistiques de progression sur le référentiel courant (les identifiants inconnus sont ignorés dans les pourcentages). */
export function missionStats(missions: Mission[], p: GtaProgress) {
  const done = missions.filter((m) => missionDone(p, m.id)).length;
  const byChapter = [1, 2, 3, 4, 5].map((c) => { const list = missions.filter((m) => m.chapter === c); const d = list.filter((m) => missionDone(p, m.id)).length; return { chapter: c, total: list.length, done: d }; });
  const current = byChapter.find((c) => c.total && c.done < c.total)?.chapter ?? 5;
  const orphans = Object.keys(p.missions).filter((id) => p.missions[id]?.completed && !missions.some((m) => m.id === id));
  return { total: missions.length, done, byChapter, current, orphans };
}

/**
 * Totaux d'argent. Seuls comptent comme gains réels les montants saisis par Aïda (espèces récupérées, valeur convertie)
 * et les récompenses de missions vérifiées ET terminées. Les montants annoncés par les guides restent à part.
 */
export function moneyTotals(places: MoneyLocation[], p: GtaProgress, rewards: { missionId: string; amount: number; verified: boolean }[]) {
  let cash = 0, converted = 0, reportedCash = 0, nominal = 0;
  for (const pl of places) {
    const m = moneyOf(p, pl.id);
    cash += m.cash_recovered ?? 0; converted += m.converted_amount ?? 0;
    reportedCash += pl.amount_cash_reported ?? 0; nominal += pl.amount_other_nominal ?? 0;
  }
  const verifiedRewards = rewards.filter((r) => r.verified && missionDone(p, r.missionId)).reduce((t, r) => t + r.amount, 0);
  const pendingRewards = rewards.filter((r) => !r.verified && missionDone(p, r.missionId)).reduce((t, r) => t + r.amount, 0);
  return { cash, converted, verifiedRewards, confirmed: cash + converted + verifiedRewards, reportedCash, nominal, pendingRewards };
}

export const EXPORT_FORMAT = 'my-thirties-gta-vi-progress';
export const exportProgress = (p: GtaProgress, dataVersion: string) => JSON.stringify({ format: EXPORT_FORMAT, exportedAt: new Date().toISOString(), dataVersion, progress: p }, null, 2);

/** Relit un export ; refuse un fichier qui n'est pas une sauvegarde GTA VI de My Thirties. */
export function parseExport(text: string): GtaProgress {
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { throw new Error('Ce fichier n’est pas un JSON valide.'); }
  if (!obj(raw) || raw.format !== EXPORT_FORMAT || !obj(raw.progress)) throw new Error('Ce fichier n’est pas une sauvegarde GTA VI de My Thirties.');
  return migrateProgress(raw.progress);
}

/** Fusion d'un import : l'import l'emporte champ par champ, rien de l'état actuel n'est perdu, repères et collections dédoublonnés. */
export function mergeProgress(current: GtaProgress, incoming: GtaProgress): GtaProgress {
  const missions = { ...current.missions };
  for (const [id, v] of Object.entries(incoming.missions)) missions[id] = { ...missions[id], ...v };
  const money = { ...current.money };
  for (const [id, v] of Object.entries(incoming.money)) {
    const cur = money[id];
    money[id] = cur ? { ...cur, ...Object.fromEntries(Object.entries(v).filter(([, x]) => x !== undefined)), steps: [...new Set([...cur.steps, ...v.steps])].sort((a, b) => a - b) } as MoneyProgress : v;
  }
  return migrateProgress({ ...current, missions, money, markers: [...current.markers, ...incoming.markers], collections: [...current.collections, ...incoming.collections], checks: { ...current.checks, ...incoming.checks }, counts: { ...current.counts, ...incoming.counts }, recent: current.recent, settings: current.settings });
}

export function toggleCheck(p: GtaProgress, id: string): GtaProgress {
  const checks = { ...p.checks };
  if (checks[id]) delete checks[id]; else checks[id] = true;
  return { ...p, checks };
}

export function setCount(p: GtaProgress, id: string, value: number): GtaProgress {
  const n = Number.isFinite(value) ? Math.min(MAX_COUNT, Math.max(0, Math.round(value))) : 0;
  if ((p.counts[id] ?? 0) === n) return p;
  const counts = { ...p.counts };
  if (n) counts[id] = n; else delete counts[id];
  return { ...p, counts };
}
