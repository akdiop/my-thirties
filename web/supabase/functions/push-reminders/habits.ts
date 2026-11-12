// Règles des habitudes (fréquence, pause, échéance, rappel). Fonctions pures, partagées avec l'app et testées.
type Data = Record<string, unknown>;

export type HabitRule = { type: 'daily' | 'week' | 'every' | 'month'; n: number };
export const RULE_RANGE: Record<HabitRule['type'], [number, number]> = { daily: [1, 1], week: [1, 6], every: [2, 60], month: [1, 15] };
export const clampN = (type: HabitRule['type'], n: unknown) => { const [lo, hi] = RULE_RANGE[type]; const x = Math.round(Number(n)); return Number.isFinite(x) ? Math.min(hi, Math.max(lo, x)) : lo; };

/** Fréquence : chaque jour, n fois par semaine, tous les n jours ou n fois par mois (anciennes valeurs « 3w » et « 1w » comprises). */
export function ruleOf(d: Data): HabitRule {
  const f = String(d.freq ?? 'daily');
  if (f === 'week' || f === 'every' || f === 'month') return { type: f, n: clampN(f, d.n) };
  return f === '3w' ? { type: 'week', n: 3 } : f === '1w' ? { type: 'week', n: 1 } : { type: 'daily', n: 1 };
}

export const dayNo = (iso: string) => Math.floor(Date.parse(iso + 'T12:00:00Z') / 86_400_000);
export const isoOfNo = (n: number) => new Date(n * 86_400_000).toISOString().slice(0, 10);
export const addIso = (iso: string, k: number) => isoOfNo(dayNo(iso) + k);
/** 0 = lundi … 6 = dimanche. */
export const weekdayOf = (iso: string) => (new Date(iso + 'T12:00:00Z').getUTCDay() + 6) % 7;
export const weekStart = (iso: string) => addIso(iso, -weekdayOf(iso));
export const monthStart = (iso: string) => iso.slice(0, 8) + '01';
export const monthLength = (iso: string) => new Date(Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)), 0)).getUTCDate();

export const doneOf = (d: Data) => (d.done && typeof d.done === 'object' ? d.done as Record<string, boolean> : {});
export const doneDates = (d: Data) => { const done = doneOf(d); return Object.keys(done).filter((k) => done[k] && /^\d{4}-\d{2}-\d{2}$/.test(k)).sort(); };
export const daysOf = (d: Data) => (Array.isArray(d.days) ? (d.days as unknown[]).map(Number).filter((n) => n >= 0 && n <= 6) : []);
export const scheduledOn = (d: Data, iso: string) => { const days = daysOf(d); return !days.length || days.length === 7 || days.includes(weekdayOf(iso)); };

/** Pause : du jour « from » au jour « to » inclus. */
export const pauseOf = (d: Data) => { const p = d.pause as { from?: unknown; to?: unknown } | null | undefined;
  return p && typeof p.from === 'string' && typeof p.to === 'string' && p.from <= p.to ? { from: p.from, to: p.to } : null; };
export const pausedOn = (d: Data, iso: string) => { const p = pauseOf(d); return Boolean(p && iso >= p.from && iso <= p.to); };
/** Jours écoulés de a à b, sans compter les jours de pause. */
export function activeGap(d: Data, a: string, b: string) {
  const gap = dayNo(b) - dayNo(a), p = pauseOf(d);
  if (!p) return gap;
  const lo = Math.max(dayNo(a) + 1, dayNo(p.from)), hi = Math.min(dayNo(b), dayNo(p.to));
  return gap - Math.max(0, hi - lo + 1);
}

/** Jours restants avant la prochaine fois (« tous les n jours ») : 0 = à faire ce jour-là. */
export function everyWait(d: Data, iso: string) {
  const r = ruleOf(d), last = doneDates(d).filter((x) => x < iso).pop();
  return r.type !== 'every' || !last ? 0 : Math.max(0, r.n - activeGap(d, last, iso));
}
/** Attendue ce jour-là : quotidienne prévue, ou « tous les n jours » arrivée à échéance ; jamais en pause ni archivée. */
export function dueOn(d: Data, iso: string) {
  if (d.archived || pausedOn(d, iso)) return false;
  const r = ruleOf(d);
  return r.type === 'daily' ? scheduledOn(d, iso) : r.type === 'every' ? everyWait(d, iso) === 0 : false;
}
/** Nombre de fois sur la semaine ou le mois de ce jour. */
export function periodCount(d: Data, iso: string) {
  const month = ruleOf(d).type === 'month', from = month ? monthStart(iso) : weekStart(iso), to = month ? iso.slice(0, 8) + '31' : addIso(from, 6);
  return doneDates(d).filter((x) => x >= from && x <= to).length;
}

export type HabitRemind = { on?: boolean; time?: string; day?: number; mday?: number };
export const remindOf = (d: Data) => (d.remind && typeof d.remind === 'object' ? d.remind as HabitRemind : {});
/** Le rappel individuel doit-il partir ce jour-là ? Par semaine : le jour choisi (dimanche par défaut) ; par mois : le jour choisi ou les 3 derniers jours ; seulement si l'objectif n'est pas atteint. */
export function remindOn(d: Data, iso: string) {
  if (d.archived || pausedOn(d, iso) || doneOf(d)[iso]) return false;
  const r = ruleOf(d), rem = remindOf(d);
  if (r.type === 'daily' || r.type === 'every') return dueOn(d, iso);
  if (periodCount(d, iso) >= r.n) return false;
  if (r.type === 'week') return weekdayOf(iso) === (Number.isInteger(rem.day) ? rem.day : 6);
  const dom = Number(iso.slice(8)), last = monthLength(iso), mday = Number(rem.mday) || 0;
  return mday ? dom === Math.min(mday, last) : dom > last - 3;
}
