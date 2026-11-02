import { useMemo } from 'react';
import { Link2 } from 'lucide-react';
import type { Entry } from '../lib/cloud';
import { addDays, isoOf } from '../lib/rituals';
import { amountOf, currencyOf, fmt } from '../lib/money';
import { moodOn } from '../screens/Review';

const GOOD = ['Bien', 'Rayonnante', 'Sereine', 'Joyeuse'];
const LOW = ['Épuisée', 'Fatiguée', 'Stressée'];
const pct = (n: number, d: number) => Math.round((100 * n) / d);

/** Liens entre mes données sur 90 jours : sport, cycle et dépenses comparés à mon humeur. Affichés seulement avec assez de jours. */
export function Insights({ entries }: { entries: Entry[] }) {
  const lines = useMemo(() => {
    const today = isoOf(new Date());
    const days = Array.from({ length: 90 }, (_, i) => addDays(today, -i)).filter((d) => moodOn(entries, d));
    const out: string[] = [];
    if (days.length < 6) return out;
    const good = (d: string) => GOOD.includes(moodOn(entries, d));

    // Sport et humeur.
    const sportDays = new Set(entries.filter((e) => e.module === 'sport' && e.kind === 'session' && e.entry_date).map((e) => String(e.entry_date)));
    const withS = days.filter((d) => sportDays.has(d)), without = days.filter((d) => !sportDays.has(d));
    if (withS.length >= 3 && without.length >= 3) {
      const a = pct(withS.filter(good).length, withS.length), b = pct(without.filter(good).length, without.length);
      out.push(a > b + 5 ? `Les jours où tu fais du sport, tu te sens bien ${a} % du temps, contre ${b} % les autres jours.`
        : a + 5 < b ? `Les jours de sport, tu te sens bien ${a} % du temps, contre ${b} % sinon : peut-être des séances trop intenses ou trop tard ?`
        : `Ton humeur est à peu près la même avec ou sans sport (${a} % contre ${b} %).`);
    }

    // Cycle et humeur, par phase (règles, après les règles, milieu de cycle, fin de cycle).
    const starts = entries.filter((e) => e.kind === 'cycle' && e.entry_date).map((e) => String(e.entry_date)).sort();
    if (starts.length >= 2) {
      const phaseOf = (d: string) => { const s = starts.filter((x) => x <= d).at(-1); if (!s) return '';
        const n = Math.round((Date.parse(d + 'T12:00:00') - Date.parse(s + 'T12:00:00')) / 86400000) + 1;
        return n <= 5 ? 'pendant les règles' : n <= 13 ? 'après les règles' : n <= 16 ? 'en milieu de cycle' : n <= 40 ? 'en fin de cycle' : ''; };
      const by = new Map<string, string[]>();
      for (const d of days) { const p = phaseOf(d); if (p) by.set(p, [...(by.get(p) ?? []), d]); }
      const rates = [...by].filter(([, l]) => l.length >= 3).map(([p, l]) => ({ p, r: pct(l.filter(good).length, l.length) })).sort((x, y) => y.r - x.r);
      if (rates.length >= 2) out.push(`C’est ${rates[0]!.p} que tu te sens le mieux (${rates[0]!.r} % de bons jours), et ${rates.at(-1)!.p} le moins (${rates.at(-1)!.r} %). De quoi prévoir tes semaines chargées au bon moment.`);
    }

    // Dépenses et humeur basse.
    const spend = new Map<string, number>(); let cur = 'XOF';
    for (const e of entries) if (e.module === 'finances' && e.kind === 'expense' && e.entry_date) { spend.set(String(e.entry_date), (spend.get(String(e.entry_date)) ?? 0) + amountOf(e)); cur = currencyOf(e); }
    const low = days.filter((d) => LOW.includes(moodOn(entries, d))), rest = days.filter((d) => !LOW.includes(moodOn(entries, d)));
    if (low.length >= 3 && rest.length >= 3 && spend.size >= 5) {
      const avg = (l: string[]) => l.reduce((a, d) => a + (spend.get(d) ?? 0), 0) / l.length;
      const a = avg(low), b = avg(rest);
      if (a > b * 1.2 && a - b > 0) out.push(`Les jours où tu te sens fatiguée ou stressée, tu dépenses en moyenne ${fmt(Math.round(a), cur)}, contre ${fmt(Math.round(b), cur)} les autres jours.`);
      else out.push(`Tes dépenses ne changent pas vraiment selon ton humeur : bonne nouvelle.`);
    }
    return out;
  }, [entries]);

  return <section className="ritual-card">
    <p className="ritual-label"><Link2 size={16} /> Mes liens (90 derniers jours)</p>
    {lines.length ? <ul className="insight-list">{lines.map((l) => <li key={l}>{l}</li>)}</ul>
      : <p className="muted">Note ton humeur quelques semaines (dans Mon jour ou Bien-être) : l’app te montrera ici les liens avec ton sport, ton cycle et tes dépenses.</p>}
    <p className="muted small">Ce sont des tendances dans tes propres notes, pas des diagnostics.</p>
  </section>;
}
