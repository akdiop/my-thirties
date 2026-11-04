/** Analyse de nuit à partir des sons captés par le micro : seuls des niveaux par minute sont gardés, jamais l'audio. */
export type Phase = 'eveil' | 'leger' | 'profond';
export type NightAnalysis = {
  start: string; end: string;
  /** Mouvements détectés par minute (-1 : écoute interrompue). */
  act: number[];
  phases: Record<Phase, number>;
  onset: number; awakenings: number; loud: number; gaps: number; quality: number;
};

export const PHASE_LABEL: Record<Phase, string> = { eveil: 'Éveil', leger: 'Sommeil léger', profond: 'Sommeil profond' };

const quantile = (xs: number[], q: number) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(q * s.length))]!;
};

/** Résume une minute de niveaux sonores : bruits brefs au-dessus du fond (mouvements) et sons forts prolongés. */
export function minuteStats(rms: number[]): { events: number; loud: boolean } {
  const floor = quantile(rms, 0.5);
  const thr = Math.max(floor * 2.5, floor + 0.002);
  const events = rms.filter((x) => x > thr).length;
  const loud = rms.filter((x) => x > Math.max(0.05, floor * 8)).length >= 6;
  return { events, loud };
}

/** Moyenne glissante sur ±r minutes ; les minutes sans écoute reprennent la valeur voisine. */
export function smooth(act: number[], r = 3): number[] {
  const filled: number[] = [];
  act.forEach((v, i) => { filled.push(v >= 0 ? v : (filled[i - 1] ?? 0)); });
  return filled.map((_, i) => {
    const w = filled.slice(Math.max(0, i - r), i + r + 1);
    return w.reduce((a, b) => a + b, 0) / w.length;
  });
}

/** Phases estimées minute par minute : beaucoup de mouvements = éveil, très peu = sommeil profond. */
export function phasesOf(act: number[]): Phase[] {
  const s = smooth(act);
  const wakeT = Math.max(6, quantile(s, 0.9));
  const deepT = Math.max(0.4, quantile(s, 0.35));
  const raw: Phase[] = s.map((v) => (v >= wakeT ? 'eveil' : v <= deepT ? 'profond' : 'leger'));
  // Endormissement : éveil jusqu'aux 5 premières minutes calmes d'affilée.
  let calm = 0, onset = raw.length;
  for (let i = 0; i < raw.length; i++) { calm = raw[i] === 'eveil' || s[i]! > deepT * 3 ? 0 : calm + 1; if (calm >= 5) { onset = i - 4; break; } }
  return raw.map((p, i) => (i < onset ? 'eveil' : p));
}

export function analyseNight(start: Date, end: Date, act: number[], loud: number): NightAnalysis {
  const ph = phasesOf(act);
  const phases: Record<Phase, number> = { eveil: 0, leger: 0, profond: 0 };
  ph.forEach((p) => { phases[p]++; });
  const onsetIdx = ph.findIndex((p) => p !== 'eveil');
  const onset = onsetIdx < 0 ? ph.length : onsetIdx;
  let awakenings = 0;
  for (let i = onset, run = 0; i <= ph.length; i++) {
    if (ph[i] === 'eveil') run++;
    else { if (run >= 2) awakenings++; run = 0; }
  }
  const asleep = phases.leger + phases.profond;
  const quality = act.length ? Math.round(
    50 * Math.min(1, asleep / 480)
    + 25 * (asleep ? Math.min(1, phases.profond / (asleep * 0.25)) : 0)
    + 25 * Math.max(0, 1 - awakenings / 6)) : 0;
  return { start: start.toISOString(), end: end.toISOString(), act: act.map((v) => Math.min(99, Math.round(v))), phases, onset, awakenings, loud, gaps: act.filter((v) => v < 0).length, quality };
}

/** Prochaine occurrence de l'heure HH:MM après `from`. */
export function nextAt(hhmm: string, from: Date): Date {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(from); d.setHours(h || 0, m || 0, 0, 0);
  if (d <= from) d.setDate(d.getDate() + 1);
  return d;
}

/** Réveil intelligent : à l'heure prévue, ou plus tôt dans la fenêtre si le sommeil est léger (mouvements récents). */
export function shouldWake(now: Date, wake: Date, windowMin: number, act: number[]): boolean {
  if (now >= wake) return true;
  if (!windowMin || now.getTime() < wake.getTime() - windowMin * 60000) return false;
  const known = act.filter((v) => v >= 0);
  const recent = known.slice(-3);
  if (recent.length < 3) return false;
  const mean = recent.reduce((a, b) => a + b, 0) / 3;
  return mean >= Math.max(2, quantile(known, 0.75));
}

export const fmtMin = (m: number) => `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}`;
