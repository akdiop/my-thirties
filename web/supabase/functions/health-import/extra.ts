// Pas, séances de sport et règles envoyés par le raccourci iPhone (app Santé), une ligne par donnée :
//   PAS|2026-11-10|8432
//   SPORT|début ISO|fin ISO|type|source
//   REGLES|2026-11-10|Moyen
// Fonctions pures, partagées avec l'app et testées.
export type Steps = { date: string; steps: number };
export type Workout = { id: string; date: string; time: string; minutes: number; discipline: string; source: string };
export type Period = { start: string; end: string; flow: string };

const DAY = /^\d{4}-\d{2}-\d{2}/;
const plain = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const FLOWS: [RegExp, string][] = [[/leger|light/, 'Léger'], [/moyen|medium/, 'Moyen'], [/abondant|heavy/, 'Abondant']];
const SPORTS: [RegExp, string][] = [[/tennis/, 'Tennis'], [/padel/, 'Padel'], [/pilates/, 'Pilates'], [/yoga/, 'Yoga'], [/marche|walk/, 'Marche'],
  [/course|run/, 'Course'], [/natation|swim/, 'Natation'], [/velo|cycl/, 'Vélo'], [/danse|danc/, 'Danse'], [/fonctionnel|functional|hiit|renfo|strength|musculation/, 'Workout']];

const addDay = (iso: string, n: number) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

export function parseExtra(body: string) {
  let lines: string[];
  try { const v = JSON.parse(body) as { samples?: unknown }; lines = typeof v?.samples === 'string' ? v.samples.split(/\r?\n/) : body.split(/\r?\n/); }
  catch { lines = body.split(/\r?\n/); }
  const steps = new Map<string, number>(), workouts: Workout[] = [], flowDays = new Map<string, string>();
  for (const line of lines.slice(0, 3000)) {
    const [tag = '', a = '', b = '', c = '', d = ''] = line.split('|').map((x) => x.trim());
    const t = plain(tag);
    if (t === 'pas' && DAY.test(a)) {
      const n = Math.round(Number(b.replace(/[\s\u202f\u00a0]/g, '').replace(',', '.')));
      if (Number.isFinite(n) && n >= 0 && n < 200000) steps.set(a.slice(0, 10), (steps.get(a.slice(0, 10)) ?? 0) + n);
    } else if (t === 'sport' && DAY.test(a) && DAY.test(b)) {
      const minutes = Math.round((Date.parse(b) - Date.parse(a)) / 60000);
      if (!Number.isFinite(minutes) || minutes < 1 || minutes > 600) continue;
      const kind = plain(c), discipline = SPORTS.find(([re]) => re.test(kind))?.[1] ?? (c.slice(0, 40) || 'Séance');
      workouts.push({ id: a, date: a.slice(0, 10), time: a.slice(11, 16), minutes, discipline, source: d.slice(0, 60) });
    } else if (t === 'regles' && DAY.test(a)) {
      const f = plain(b);
      if (/aucun|none/.test(f)) continue;
      flowDays.set(a.slice(0, 10), FLOWS.find(([re]) => re.test(f))?.[1] ?? '');
    }
  }
  // Jours de règles consécutifs (un jour d'écart toléré) regroupés en une période.
  const periods: Period[] = [];
  for (const day of [...flowDays.keys()].sort()) {
    const last = periods[periods.length - 1];
    if (last && day <= addDay(last.end, 2)) { last.end = day; if (!last.flow) last.flow = flowDays.get(day) ?? ''; }
    else periods.push({ start: day, end: day, flow: flowDays.get(day) ?? '' });
  }
  return { steps: [...steps].map(([date, n]) => ({ date, steps: n })).sort((x, y) => x.date.localeCompare(y.date)), workouts, periods };
}
