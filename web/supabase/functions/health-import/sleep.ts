// Lecture des nuits envoyées par le raccourci iPhone (échantillons « Analyse du sommeil » de l'app Santé,
// écrits par Sleep Cycle ou une montre). Fonctions pures, partagées avec l'app et testées.
export type Stage = 'lit' | 'eveil' | 'endormie' | 'leger' | 'profond' | 'paradoxal';
export type Sample = { start: string; end: string; stage: Stage; source: string };
export type HealthNight = {
  date: string; bed: string; wake: string; start: string; end: string;
  /** Minutes. */
  inBed: number; asleep: number;
  stages: Partial<Record<Stage, number>>;
  /** [début en minutes depuis le coucher, durée en minutes, phase] */
  segments: [number, number, Stage][];
  sources: string[];
};

export const STAGE_LABEL: Record<Stage, string> = { lit: 'Au lit', eveil: 'Éveil', endormie: 'Endormie', leger: 'Sommeil léger', profond: 'Sommeil profond', paradoxal: 'Sommeil paradoxal' };
const ASLEEP: Stage[] = ['endormie', 'leger', 'profond', 'paradoxal'];

const plain = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

/** Valeur d'un échantillon (anglais, français ou code HealthKit 0-5) → phase. */
export function stageOf(value: string): Stage | null {
  const v = plain(value);
  const codes: Stage[] = ['lit', 'endormie', 'eveil', 'leger', 'profond', 'paradoxal'];
  if (/^[0-5]$/.test(v)) return codes[Number(v)]!;
  if (/in ?bed|au lit|dans le lit/.test(v)) return 'lit';
  if (/awake|eveil|reveil/.test(v)) return 'eveil';
  if (/rem|paradox/.test(v)) return 'paradoxal';
  if (/deep|profond/.test(v)) return 'profond';
  if (/core|principal|leger|light/.test(v)) return 'leger';
  if (/asleep|endormi|sommeil|unspecified|non specifie/.test(v)) return 'endormie';
  return null;
}

const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

/** Une ligne par échantillon : « début|fin|valeur|source » (dates ISO 8601). Accepte aussi un tableau JSON. */
export function parseSamples(body: string): Sample[] {
  let lines: string[];
  try {
    const v = JSON.parse(body) as unknown;
    const arr = Array.isArray(v) ? v : (v && typeof v === 'object' && 'samples' in v ? (v as { samples: unknown }).samples : null);
    lines = Array.isArray(arr) ? arr.map(String) : typeof arr === 'string' ? arr.split(/\r?\n/) : body.split(/\r?\n/);
  } catch { lines = body.split(/\r?\n/); }
  const out: Sample[] = [];
  for (const line of lines.slice(0, 3000)) {
    const [start = '', end = '', value = '', source = ''] = line.split('|').map((x) => x.trim());
    const stage = stageOf(value);
    if (!stage || !ISO.test(start) || !ISO.test(end) || Number.isNaN(Date.parse(start)) || Date.parse(end) <= Date.parse(start)) continue;
    out.push({ start, end, stage, source: source.slice(0, 60) });
  }
  return out.sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
}

/** Somme de la réunion des intervalles (pour ne pas compter deux fois deux sources qui se chevauchent). */
function union(ranges: [number, number][]): number {
  const r = [...ranges].sort((a, b) => a[0] - b[0]);
  let total = 0, cur: [number, number] | null = null;
  for (const [s, e] of r) {
    if (!cur || s > cur[1]) { if (cur) total += cur[1] - cur[0]; cur = [s, e]; } else cur[1] = Math.max(cur[1], e);
  }
  return cur ? total + cur[1] - cur[0] : total;
}

/** Regroupe les échantillons en nuits (nouvelle nuit après 4 h sans données). L'heure locale est celle écrite dans la date. */
export function nightsFrom(samples: Sample[]): HealthNight[] {
  const groups: Sample[][] = [];
  let lastEnd = -Infinity;
  for (const s of samples) {
    if (Date.parse(s.start) - lastEnd > 4 * 3600000) groups.push([]);
    groups[groups.length - 1]!.push(s);
    lastEnd = Math.max(lastEnd, Date.parse(s.end));
  }
  return groups.map((g) => {
    const first = g.reduce((a, b) => (Date.parse(b.start) < Date.parse(a.start) ? b : a));
    const last = g.reduce((a, b) => (Date.parse(b.end) > Date.parse(a.end) ? b : a));
    const t0 = Date.parse(first.start), min = (ms: number) => Math.round(ms / 60000);
    const stages: Partial<Record<Stage, number>> = {};
    for (const s of g) stages[s.stage] = (stages[s.stage] ?? 0) + min(Date.parse(s.end) - Date.parse(s.start));
    const asleep = min(union(g.filter((s) => ASLEEP.includes(s.stage)).map((s) => [Date.parse(s.start), Date.parse(s.end)])));
    return {
      date: last.end.slice(0, 10), bed: first.start.slice(11, 16), wake: last.end.slice(11, 16), start: first.start, end: last.end,
      inBed: min(Date.parse(last.end) - t0), asleep, stages,
      segments: g.filter((s) => s.stage !== 'lit').slice(0, 400).map((s) => [min(Date.parse(s.start) - t0), min(Date.parse(s.end) - Date.parse(s.start)), s.stage] as [number, number, Stage]),
      sources: [...new Set(g.map((s) => s.source).filter(Boolean))],
    };
  }).filter((n) => n.inBed >= 30);
}
