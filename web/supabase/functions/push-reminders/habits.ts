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

/** Contexte : débuts de règles notés et données du jour (pas, verres d'eau) par date. */
export type HabitCtx = { cycleStarts?: string[]; daily?: Record<string, Data> };

/** Saison : seulement pendant le Ramadan, ou entre deux dates de l'année (MM-JJ, l'hiver peut chevaucher le Nouvel An). */
export type HabitSeason = { type: 'ramadan' } | { type: 'dates'; from: string; to: string };
export const seasonOf = (d: Data): HabitSeason | null => { const s = d.season as { type?: unknown; from?: unknown; to?: unknown } | null | undefined;
  if (s?.type === 'ramadan') return { type: 'ramadan' };
  const md = /^\d{2}-\d{2}$/;
  return s?.type === 'dates' && md.test(String(s.from)) && md.test(String(s.to)) ? { type: 'dates', from: String(s.from), to: String(s.to) } : null; };
const hijriFmt = (() => { try { return new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { month: 'numeric', timeZone: 'UTC' }); } catch { return null; } })();
export const hijriMonth = (iso: string) => { const m = hijriFmt?.formatToParts(new Date(iso + 'T12:00:00Z')).find((x) => x.type === 'month')?.value; return m ? parseInt(m, 10) : 0; };
export function inSeason(d: Data, iso: string) {
  const s = seasonOf(d);
  if (!s) return true;
  if (s.type === 'ramadan') return hijriMonth(iso) === 9;
  const md = iso.slice(5);
  return s.from <= s.to ? md >= s.from && md <= s.to : md >= s.from || md <= s.to;
}
/** Repos pendant les règles : les premiers jours du cycle (5 par défaut). */
export function cycleRestOn(d: Data, iso: string, starts: string[] = []) {
  if (d.cycleRest !== true) return false;
  const len = Math.min(10, Math.max(1, Number(d.cycleDays) || 5)), last = starts.filter((x) => x <= iso).sort().pop();
  return Boolean(last && dayNo(iso) - dayNo(last) < len);
}
/** Jour sans attente : pause, hors saison ou repos du cycle. Ces jours ne cassent jamais une série. */
export const restOn = (d: Data, iso: string, ctx?: HabitCtx) => pausedOn(d, iso) || !inSeason(d, iso) || cycleRestOn(d, iso, ctx?.cycleStarts);

/** Jours écoulés de a à b, sans compter les jours de repos. */
export function activeGap(d: Data, a: string, b: string, ctx?: HabitCtx) {
  const gap = dayNo(b) - dayNo(a);
  if (!pauseOf(d) && !seasonOf(d) && d.cycleRest !== true) return gap;
  let n = 0;
  for (let k = 1; k <= Math.min(gap, 1000); k++) if (!restOn(d, addIso(a, k), ctx)) n++;
  return n;
}

/** Objectif chiffré rempli automatiquement depuis Santé (pas) ou l'hydratation (verres d'eau). */
export const goalOf = (d: Data) => { const g = d.goal as { target?: unknown; unit?: unknown; source?: unknown } | undefined; const t = Math.round(Number(g?.target));
  return g && t >= 2 ? { target: Math.min(100000, t), unit: String(g.unit ?? '').slice(0, 20), source: (g.source === 'pas' || g.source === 'eau' ? g.source : '') as '' | 'pas' | 'eau' } : null; };
export const autoCount = (d: Data, iso: string, ctx?: HabitCtx) => { const g = goalOf(d), day = ctx?.daily?.[iso];
  return !g?.source || !day ? 0 : Math.max(0, Math.floor(Number(g.source === 'pas' ? day.steps : day.water) || 0)); };
/** Faite ce jour-là : cochée, ou objectif atteint par la source automatique. */
export const doneWith = (d: Data, iso: string, ctx?: HabitCtx) => { const g = goalOf(d); return Boolean(doneOf(d)[iso]) || Boolean(g?.source && autoCount(d, iso, ctx) >= g.target); };

/** Jours restants avant la prochaine fois (« tous les n jours ») : 0 = à faire ce jour-là. */
export function everyWait(d: Data, iso: string, ctx?: HabitCtx) {
  const r = ruleOf(d), last = doneDates(d).filter((x) => x < iso).pop();
  return r.type !== 'every' || !last ? 0 : Math.max(0, r.n - activeGap(d, last, iso, ctx));
}
/** Attendue ce jour-là : quotidienne prévue, ou « tous les n jours » arrivée à échéance ; jamais en pause ni archivée. */
export function dueOn(d: Data, iso: string, ctx?: HabitCtx) {
  if (d.archived || restOn(d, iso, ctx)) return false;
  const r = ruleOf(d);
  return r.type === 'daily' ? scheduledOn(d, iso) : r.type === 'every' ? everyWait(d, iso, ctx) === 0 : false;
}
/** Nombre de fois sur la semaine ou le mois de ce jour. */
export function periodCount(d: Data, iso: string) {
  const month = ruleOf(d).type === 'month', from = month ? monthStart(iso) : weekStart(iso), to = month ? iso.slice(0, 8) + '31' : addIso(from, 6);
  return doneDates(d).filter((x) => x >= from && x <= to).length;
}

export type HabitRemind = { on?: boolean; time?: string; day?: number; mday?: number; after?: number };
export const remindOf = (d: Data) => (d.remind && typeof d.remind === 'object' ? d.remind as HabitRemind : {});
/** Le rappel individuel doit-il partir ce jour-là ? Par semaine : le jour choisi (dimanche par défaut) ; par mois : le jour choisi ou les 3 derniers jours ; seulement si l'objectif n'est pas atteint. */
export function remindOn(d: Data, iso: string, ctx?: HabitCtx) {
  if (d.archived || restOn(d, iso, ctx) || doneWith(d, iso, ctx)) return false;
  const r = ruleOf(d), rem = remindOf(d);
  if (r.type === 'daily' || r.type === 'every') return dueOn(d, iso, ctx);
  if (periodCount(d, iso) >= r.n) return false;
  if (r.type === 'week') return weekdayOf(iso) === (Number.isInteger(rem.day) ? rem.day : 6);
  const dom = Number(iso.slice(8)), last = monthLength(iso), mday = Number(rem.mday) || 0;
  return mday ? dom === Math.min(mday, last) : dom > last - 3;
}

/** Habitude liée à une prière (« après Fajr ») : le rappel part quelques minutes après l'heure du jour. */
export const PRAYER_LINKS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
export const prayerOf = (d: Data) => (PRAYER_LINKS as readonly string[]).includes(String(d.prayer)) ? String(d.prayer) : '';
const toMin = (t: string) => { const m = /^(\d{2}):(\d{2})/.exec(t); return m ? Number(m[1]) * 60 + Number(m[2]) : -1; };
/** Minute du rappel : après la prière liée si les horaires sont connus, sinon l'heure choisie. */
export function remindMinute(d: Data, prayers: { name: string; time: string }[] = []) {
  const rem = remindOf(d), p = prayerOf(d), at = p ? prayers.find((x) => x.name === p) : undefined;
  if (at) { const m = toMin(at.time); return m < 0 ? -1 : m + Math.max(0, Math.min(120, Number(rem.after ?? 10))); }
  return toMin(String(rem.time ?? ''));
}

export const streakUnit = (r: HabitRule) => ({ daily: 'jours', week: 'semaines', every: 'fois de suite', month: 'mois' })[r.type];
/** Série en cours : jours consécutifs (quotidienne), semaines ou mois où l'objectif est atteint, ou fois faites à temps (tous les n jours). Les jours non prévus et les jours de repos ne cassent rien. */
export function streakOf(d: Data, today: string, ctx?: HabitCtx) {
  const done = doneOf(d), r = ruleOf(d);
  if (r.type === 'daily') {
    let day = done[today] || !scheduledOn(d, today) || restOn(d, today, ctx) ? today : addIso(today, -1), n = 0;
    for (let guard = 0; guard < 3660; guard++) {
      if (done[day]) n++; else if (scheduledOn(d, day) && !restOn(d, day, ctx)) break;
      day = addIso(day, -1);
    }
    return n;
  }
  if (r.type === 'every') {
    const list = doneDates(d).filter((x) => x <= today);
    if (!list.length || activeGap(d, list[list.length - 1]!, today, ctx) > r.n) return 0;
    let n = 1;
    for (let i = list.length - 1; i > 0 && activeGap(d, list[i - 1]!, list[i]!, ctx) <= r.n; i--) n++;
    return n;
  }
  const month = r.type === 'month';
  const start = (iso: string) => (month ? monthStart(iso) : weekStart(iso));
  const prev = (p: string) => start(addIso(p, -1));
  const last = (p: string) => (month ? p.slice(0, 8) + String(monthLength(p)).padStart(2, '0') : addIso(p, 6));
  const touchesRest = (p: string) => { for (let x = p; x <= last(p); x = addIso(x, 1)) if (restOn(d, x, ctx)) return true; return false; };
  let p = start(today), n = 0;
  if (periodCount(d, p) < r.n) p = prev(p);
  for (let guard = 0; guard < 600; guard++) {
    if (periodCount(d, p) >= r.n) n++; else if (!touchesRest(p)) break;
    p = prev(p);
  }
  return n;
}

/** Récap du dimanche : habitudes cochées sur les 7 derniers jours et plus belle série en cours (habitudes non archivées). */
export function weekRecap(habits: { title: string; data: Data }[], today: string, ctx?: HabitCtx) {
  const from = addIso(today, -6), active = habits.filter((h) => !h.data.archived);
  const done = active.reduce((n, h) => n + doneDates(h.data).filter((x) => x >= from && x <= today).length, 0);
  let best: { title: string; streak: number; unit: string } | null = null;
  for (const h of active) { const s = streakOf(h.data, today, ctx); if (s > 1 && (!best || s > best.streak)) best = { title: h.title, streak: s, unit: streakUnit(ruleOf(h.data)) }; }
  return { count: active.length, done, best };
}
