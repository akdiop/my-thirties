import type { Entry } from '../lib/cloud';
import { isoOf } from '../lib/rituals';
import { PRAYERS } from '../lib/wellbeing';
import { DHIKR_ROUTINE } from '../lib/duas';
import { coranOf } from '../lib/coran';

const addDays = (iso: string, n: number) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return isoOf(d); };

/** Ma régularité : prières cochées, dhikr comptés, routine d'invocations et Coran du jour, sur 7 ou 30 jours. */
export function SpiritStats({ entries, days: span, end = isoOf(new Date()), compact = false }: { entries: Entry[]; days: 7 | 30; end?: string; compact?: boolean }) {
  const days = Array.from({ length: span }, (_, i) => addDays(end, i - span + 1));
  const set = new Set(days);
  const prayed = new Map<string, Set<string>>();
  for (const e of entries) if (e.kind === 'prayer' && e.entry_date && set.has(e.entry_date)) {
    const s = prayed.get(e.entry_date) ?? new Set<string>(); s.add(String(e.data.prayer)); prayed.set(e.entry_date, s);
  }
  const total = days.reduce((n, d) => n + (prayed.get(d)?.size ?? 0), 0);
  const full = days.filter((d) => (prayed.get(d)?.size ?? 0) >= 5).length;
  let streak = 0; for (let i = days.length - 1; i >= 0; i--) { const n = prayed.get(days[i]!)?.size ?? 0; if (n >= 5) streak++; else if (i === days.length - 1) continue; else break; }
  const byPrayer = PRAYERS.map((p) => ({ p, n: days.filter((d) => prayed.get(d)?.has(p)).length }));
  const dhikr = entries.filter((e) => e.kind === 'dhikr' && e.entry_date && set.has(e.entry_date)).reduce((n, e) => n + (Number(e.data.count) || 0), 0);
  const prefs = entries.find((e) => e.kind === 'invocations')?.data ?? {};
  const routine = (prefs.routine && typeof prefs.routine === 'object' ? prefs.routine : {}) as Record<string, string[]>;
  const quran = (prefs.quran && typeof prefs.quran === 'object' ? prefs.quran : {}) as Record<string, string[]>;
  const routineDays = days.filter((d) => (routine[d]?.length ?? 0) >= DHIKR_ROUTINE.length).length;
  const coranJours = new Set(coranOf(entries).state.jours);
  const quranDays = days.filter((d) => (quran[d]?.length ?? 0) > 0 || coranJours.has(d)).length;
  const has = total || dhikr || routineDays || quranDays;

  return <section className="soft-card spirit-stats">
    <strong>Ma régularité spirituelle{compact ? '' : ' · ' + span + ' jours'}</strong>
    {!has ? <p className="muted small">Coche tes prières et ta routine de dhikr : ta régularité s’affichera ici.</p> : <>
      <div className="stat-chips">
        <span><b>{total}</b>/{span * 5} prières</span>
        <span><b>{full}</b> jour{full > 1 ? 's' : ''} complet{full > 1 ? 's' : ''}</span>
        {streak > 1 && <span><b>{streak}</b> jours d’affilée</span>}
      </div>
      <div className={'prayer-grid' + (span === 30 ? ' wide' : '')} role="img" aria-label={total + ' prières cochées sur ' + span + ' jours'}>
        {PRAYERS.map((p) => <div className="pg-row" key={p}><span className="pg-name">{p}</span>
          <div className="pg-cells">{days.map((d) => <i key={d} className={prayed.get(d)?.has(p) ? 'on' : ''} title={d} />)}</div></div>)}
      </div>
      {!compact && <p className="muted small">{byPrayer.slice().sort((a, b) => a.n - b.n)[0]!.n < span ? 'À soigner : ' + byPrayer.slice().sort((a, b) => a.n - b.n)[0]!.p + ' (' + byPrayer.slice().sort((a, b) => a.n - b.n)[0]!.n + '/' + span + ').' : 'Toutes les prières cochées chaque jour, macha’Allah.'}</p>}
      <div className="stat-chips soft">
        {dhikr > 0 && <span><b>{dhikr.toLocaleString('fr-FR')}</b> dhikr comptés</span>}
        {routineDays > 0 && <span><b>{routineDays}</b> j. routine complète</span>}
        {quranDays > 0 && <span><b>{quranDays}</b> j. de Coran</span>}
      </div>
    </>}
  </section>;
}
