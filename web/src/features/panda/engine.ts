import type { Entry } from '../../lib/cloud';
import { goalSteps } from '../../lib/growth';
import { CARE, DAILY_CAP, DOMAINS, FOODS, ITEMS, LEVELS, OUTFITS, REWARD, RULES_VERSION, type Item } from './data';
import type { Domain, PandaEvent, PandaPreferences, PandaState } from './types';

const day = (v: unknown) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v) ? v.slice(0, 10) : '');
const ev = (id: string, domain: Domain, date: string): PandaEvent | null => (date ? { id, domain, date, ...REWARD[domain] } : null);

/**
 * Adaptateur : transforme mes données existantes en événements pour le panda.
 * - identifiant stable par activité (fiche + jour + étape) : pas de double comptage après un redémarrage ou une synchronisation ;
 * - ne lit jamais le contenu du journal, des humeurs ou de la santé : seulement « une activité a eu lieu tel jour » ;
 * - rien du tout si je n'ai pas autorisé le lien avec mes modules.
 */
export function eventsFrom(entries: Entry[], prefs: PandaPreferences, today: string): PandaEvent[] {
  if (!prefs.linkPersonalActivities) return [];
  const out: (PandaEvent | null)[] = [];
  for (const e of entries) {
    const d = day(e.entry_date) || day(e.created_at);
    if (e.module === 'sport' && e.entry_date) out.push(ev(e.id, 'corps', d));
    else if (e.kind === 'sommeil' || e.kind === 'meditation') out.push(ev(e.id, 'repos', d));
    else if (e.kind === 'lecture' && e.data.status === 'lu') out.push(ev(e.id + ':lu', 'savoir', day(e.data.finished) || d));
    else if (e.kind === 'focus' || e.kind === 'path') out.push(ev(e.id, 'savoir', d));
    else if (e.kind === 'parcours_progressif') { const steps = e.data.done && typeof e.data.done === 'object' ? Object.keys(e.data.done as object) : []; for (const k of steps) out.push(ev(e.id + ':' + k, 'savoir', day(k) || d)); }
    else if (e.module === 'spiritualite' && e.kind !== 'prayer_schedule') out.push(ev(e.id, 'serenite', d));
    else if (e.kind === 'recipe' || (e.kind === 'meal' && d <= today)) out.push(ev(e.id, 'cuisine', d));
    else if (e.kind === 'habit') { const done = (e.data.done ?? {}) as Record<string, boolean>; for (const k of Object.keys(done)) if (done[k]) out.push(ev(e.id + ':' + k, 'objectifs', day(k))); }
    else if (e.kind === 'objectif') goalSteps(e).filter((s) => s.done).forEach((s) => out.push(ev(e.id + ':' + s.id, 'projets', day(e.updated_at) || d)));
    else if (e.module === 'challenges' && e.data.completed === true) out.push(ev(e.id, 'objectifs', day(e.updated_at) || d));
    else if (e.module === 'decouvertes' && (e.kind === 'trip' || e.kind === 'destination')) out.push(ev(e.id, 'voyages', d));
    else if (e.module === 'equilibre' && ['emotion', 'gratitude', 'positive', 'review', 'booster'].includes(e.kind)) out.push(ev(e.id, 'equilibre', d));
  }
  // Déduplication par identifiant (une même activité ne compte qu'une fois) et rien dans le futur.
  const seen = new Map<string, PandaEvent>();
  for (const x of out) if (x && x.date <= today && !seen.has(x.id)) seen.set(x.id, x);
  return [...seen.values()];
}

export type Progress = { xp: number; level: (typeof LEVELS)[number]; next?: (typeof LEVELS)[number]; into: number; span: number; bamboo: number; counts: Record<Domain, number>; earnedXp: number };

/** Moteur : XP et bambous avec plafonds quotidiens. L'XP acquise est permanente (xpPeak). */
export function progress(events: PandaEvent[], s: PandaState): Progress {
  const byDay = new Map<string, { xp: number; bamboo: number }>();
  const counts = Object.fromEntries(DOMAINS.map((d) => [d.id, 0])) as Record<Domain, number>;
  for (const e of events) {
    counts[e.domain]++;
    const t = byDay.get(e.date) ?? { xp: 0, bamboo: 0 };
    t.xp = Math.min(DAILY_CAP.xp, t.xp + e.xp); t.bamboo = Math.min(DAILY_CAP.bamboo, t.bamboo + e.bamboo);
    byDay.set(e.date, t);
  }
  let xp = 0, bamboo = 0;
  for (const t of byDay.values()) { xp += t.xp; bamboo += t.bamboo; }
  for (const [, n] of Object.entries(s.care)) { const c = Number(n) || 0; xp += Math.min(DAILY_CAP.careXp + DAILY_CAP.playXp, c * CARE.pet.xp); }
  for (const [, n] of Object.entries(s.games)) bamboo += Math.min(DAILY_CAP.gameBamboo, Number(n) || 0);
  const earnedXp = xp;
  const total = Math.max(xp, s.xpPeak);
  const i = LEVELS.reduce((k, l, j) => (total >= l.from ? j : k), 0);
  const level = LEVELS[i]!, next = LEVELS[i + 1];
  return { xp: total, level, next, into: total - level.from, span: next ? next.from - level.from : 0, bamboo: Math.max(0, bamboo - s.spent), counts, earnedXp };
}

/** Récompenses : objet offert par un module, ou achetable avec des bambous à partir d'un niveau. */
export const isGift = (it: Item, counts: Record<Domain, number>) => Boolean(it.gift && counts[it.gift.domain] >= it.gift.n);
export const canBuy = (price: number, minLevel: number, level: number, bamboo: number) => level >= minLevel && bamboo >= price;
export const foodsUnlocked = (counts: Record<Domain, number>) => FOODS.slice(0, 1 + Math.floor(counts.cuisine / 2));
export const booksOnShelf = (counts: Record<Domain, number>) => Math.min(12, counts.savoir);

/** Interactions du jour, plafonnées : caresser/nourrir 5 XP (max 10 XP), jouer 5 XP (max 15 XP) + 3 bambous. */
export function addCare(s: PandaState, kind: 'pet' | 'feed' | 'play', today: string): Partial<PandaState> {
  const n = Number(s.care[today]) || 0, max = (DAILY_CAP.careXp + DAILY_CAP.playXp) / CARE.pet.xp;
  const patch: Partial<PandaState> = {};
  if (n < max) patch.care = { ...s.care, [today]: n + 1 };
  if (kind === 'play') { const g = Number(s.games[today]) || 0; if (g < DAILY_CAP.playBamboo) patch.games = { ...s.games, [today]: g + CARE.play.bamboo }; }
  return patch;
}

export const DEFAULT_PREFS: PandaPreferences = { linkPersonalActivities: true, useMoodContext: false, animationsEnabled: true };
export function readState(data: Record<string, unknown> | undefined): PandaState {
  const d = (data ?? {}) as Partial<PandaState>;
  const obj = <T,>(v: unknown, f: T) => (v && typeof v === 'object' && !Array.isArray(v) ? v as T : f);
  const arr = (v: unknown) => (Array.isArray(v) ? v.map(String) : []);
  return { name: typeof d.name === 'string' && d.name ? d.name : 'Panda', createdAt: typeof d.createdAt === 'string' ? d.createdAt : '',
    xpPeak: Number(d.xpPeak) || 0, spent: Number(d.spent) || 0, care: obj(d.care, {}), games: obj(d.games, {}),
    unlocked: arr(d.unlocked), equipped: arr(d.equipped), outfit: OUTFITS.some((o) => o.id === d.outfit) ? String(d.outfit) : 'aucune',
    room: d.room === 'jardin' ? 'jardin' : 'maison', levelSeen: Number(d.levelSeen) || 1,
    memories: Array.isArray(d.memories) ? (d.memories as PandaState['memories']).slice(-40) : [],
    prefs: { ...DEFAULT_PREFS, ...obj(d.prefs, {}) }, rulesVersion: Number(d.rulesVersion) || RULES_VERSION };
}
/** Garde 60 jours d'historique d'interactions (l'XP correspondante est déjà acquise dans xpPeak). */
export function trim(s: PandaState, today: string): Pick<PandaState, 'care' | 'games'> {
  const limit = new Date(Date.parse(today + 'T12:00:00Z') - 60 * 86_400_000).toISOString().slice(0, 10);
  const keep = (m: Record<string, number>) => Object.fromEntries(Object.entries(m).filter(([k]) => k >= limit));
  return { care: keep(s.care), games: keep(s.games) };
}
export { ITEMS, OUTFITS };
