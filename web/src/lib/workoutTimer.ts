/** Lit la séance d'un défi et en tire une suite d'étapes pour le minuteur (effort chronométré, série à valider, repos). */
export type Segment = { label: string; sec: number; kind: 'work' | 'rest' | 'manual' };

const num = (s: string) => Number(s.replace(',', '.'));
const secOf = (n: string, unit: string) => /min/.test(unit) ? Math.round(num(n) * 60) : num(n);

export function planFromText(text: string | null | undefined): Segment[] {
  if (!text) return [];
  const t = text.replace(/\u00a0/g, ' ');
  const out: Segment[] = [];
  const restAfter = (re: RegExp, fallback: number) => { const m = re.exec(t); return m ? secOf(m[1]!, m[2]!) : fallback; };

  // « 4 tours de 40 s d’effort / 20 s de repos » ou « 6 séries de 30 s de corde, 30 s de repos »
  let m = /(\d+)\s*(?:tours|séries)\s+de\s+(\d+)\s*s\b[^/,.]*[/,]\s*(\d+)\s*s\s+de\s+repos/i.exec(t);
  if (m) {
    const n = num(m[1]!), work = num(m[2]!), rest = num(m[3]!);
    for (let i = 1; i <= n; i++) { out.push({ label: `Effort ${i}/${n}`, sec: work, kind: 'work' }); if (i < n) out.push({ label: 'Repos', sec: rest, kind: 'rest' }); }
    return out;
  }
  // « 3 planches de 30 secondes »
  m = /(\d+)\s+(planches?|gainages?|séries?)\s+de\s+(\d+)\s*(s|secondes?|min)\b/i.exec(t);
  if (m) {
    const n = num(m[1]!), work = secOf(m[3]!, m[4]!), rest = restAfter(/(\d+)\s*(s|min)\s+de\s+(?:pause|repos)/i, 30);
    const what = /planche/i.test(m[2]!) ? 'Planche' : 'Effort';
    for (let i = 1; i <= n; i++) { out.push({ label: `${what} ${i}/${n}`, sec: work, kind: 'work' }); if (i < n) out.push({ label: 'Repos', sec: rest, kind: 'rest' }); }
    return out;
  }
  // « 3 séries de 20 squats, 1 min de pause »
  m = /(\d+)\s+séries\s+de\s+(\d+)\s+([^,.(]+)/i.exec(t);
  if (m) {
    const n = num(m[1]!), reps = m[2]!, what = m[3]!.trim();
    const rest = restAfter(/(\d+(?:,\d+)?)\s*(s|min)\s+de\s+(?:pause|repos)/i, 60);
    for (let i = 1; i <= n; i++) { out.push({ label: `Série ${i}/${n} · ${reps} ${what}`, sec: 0, kind: 'manual' }); if (i < n) out.push({ label: 'Repos', sec: rest, kind: 'rest' }); }
    return out;
  }
  // « 2 tours : Crunch 12 · Planche 30 s · Pont 15. 45 s de pause entre les tours »
  m = /(\d+)\s+tours\s*:\s*([^.]+)\./i.exec(t);
  if (m) {
    const n = num(m[1]!), items = m[2]!.split('·').map((x) => x.trim()).filter(Boolean);
    const rest = restAfter(/(\d+)\s*(s|min)\s+de\s+(?:pause|repos)/i, 45);
    for (let i = 1; i <= n; i++) {
      for (const it of items) {
        const timed = /^(.*?)\s+(\d+)\s*s$/.exec(it);
        if (timed) { out.push({ label: 'Prépare-toi', sec: 5, kind: 'rest' }); out.push({ label: `${timed[1]} · tour ${i}/${n}`, sec: num(timed[2]!), kind: 'work' }); }
        else out.push({ label: `${it} · tour ${i}/${n}`, sec: 0, kind: 'manual' });
      }
      if (i < n) out.push({ label: 'Repos entre les tours', sec: rest, kind: 'rest' });
    }
    return out;
  }
  // « 12 min d’étirements », « 5 min de respiration »
  m = /(\d+)\s*min\b/i.exec(t);
  if (m) return [{ label: 'Séance', sec: num(m[1]!) * 60, kind: 'work' }];
  return [];
}

export const fmtSec = (s: number) => s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : `${s}`;

export const human = (s: number) => s >= 60 ? (s % 60 ? `${Math.floor(s / 60)} min ${s % 60} s` : `${s / 60} min`) : `${s} s`;

/** Petit résumé lisible du programme détecté. */
export function summary(seg: Segment[]): string {
  const steps = seg.filter((s) => s.kind !== 'rest').length;
  const rest = seg.find((s) => s.kind === 'rest' && s.label !== 'Prépare-toi');
  return [steps + ' étape' + (steps > 1 ? 's' : ''), rest ? 'repos de ' + human(rest.sec) : ''].filter(Boolean).join(' · ');
}
