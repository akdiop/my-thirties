import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Entry } from '../lib/cloud';
import { iso, str, todayIso } from '../lib/day';
import { cycleInfo } from '../lib/wellbeing';
import { Segmented, SectionTitle } from '../ui/kit';

const HEAD = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const LEVEL: Record<string, [number, string]> = {
  Sereine: [0.8, 'sereine'], Joyeuse: [0.9, 'joyeuse'], Fatiguée: [0.4, 'fatiguée'], Stressée: [0.3, 'stressée'], Autre: [0.5, 'autre'],
  Faible: [0.25, 'faible'], Modérée: [0.55, 'moyenne'], Bonne: [0.85, 'bonne'], Moyenne: [0.55, 'moyenne'], Difficile: [0.25, 'difficile'],
};

export function HealthTop({ entries, onAdd }: { entries: Entry[]; onAdd: (kind: string) => void }) {
  const [tab, setTab] = useState<'cycle' | 'sleep' | 'food'>('cycle');
  const day = todayIso();
  const now = new Date();
  const [month, setMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const cycle = cycleInfo(entries, day);
  const periods = new Set<string>();
  for (const e of entries.filter((x) => x.kind === 'cycle' && x.entry_date)) {
    const start = new Date(e.entry_date + 'T12:00:00');
    const end = str(e, 'endDate') ? new Date(str(e, 'endDate') + 'T12:00:00') : new Date(start.getTime() + 4 * 86_400_000);
    for (let d = start; d <= end && d.getTime() - start.getTime() < 12 * 86_400_000; d = new Date(d.getTime() + 86_400_000)) periods.add(iso(d));
  }
  const ovulation = cycle?.next ? iso(new Date(cycle.next.getTime() - 14 * 86_400_000)) : '';
  const lead = (month.getDay() + 6) % 7;
  const daysIn = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const mood = entries.find((e) => e.kind === 'mood' && e.entry_date === day);
  const sleep = entries.filter((e) => e.kind === 'sleep' && e.entry_date).sort((a, b) => b.entry_date!.localeCompare(a.entry_date!));
  const lastSleep = sleep[0];
  const pain = entries.filter((e) => (e.kind === 'symptom') && e.entry_date === day);
  const bars: { k: string; w: number; v: string }[] = [
    { k: 'Humeur', w: LEVEL[mood ? str(mood, 'mood') : '']?.[0] ?? 0, v: LEVEL[mood ? str(mood, 'mood') : '']?.[1] ?? '—' },
    { k: 'Énergie', w: LEVEL[mood ? str(mood, 'energy') : '']?.[0] ?? 0, v: LEVEL[mood ? str(mood, 'energy') : '']?.[1] ?? '—' },
    { k: 'Douleurs', w: pain.length ? 0.5 : 0.05, v: pain.length ? 'notées' : 'aucune' },
    { k: 'Sommeil', w: lastSleep ? Math.min(1, Number(lastSleep.data.hours) / 9) : 0, v: lastSleep ? String(lastSleep.data.hours).replace('.', ',') + ' h' : '—' },
  ];
  const monthLabel = month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return <div className="module-top">
    <Segmented label="Santé" value={tab} onChange={setTab} options={[{ value: 'cycle', label: 'Cycle' }, { value: 'sleep', label: 'Sommeil' }, { value: 'food', label: 'Alimentation' }]} />
    {tab === 'cycle' && <>
      <div className="title-row"><span className="serif h22">{cycle ? `Jour ${cycle.day} du cycle` : 'Mon cycle'}</span>
        <span className="month-nav"><button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Mois précédent">‹</button>
          {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
          <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Mois suivant">›</button></span></div>
      <div className="cycle-grid">
        {HEAD.map((h, i) => <span key={'h' + i} className="cg-head">{h}</span>)}
        {Array.from({ length: lead }, (_, i) => <span key={'b' + i} />)}
        {Array.from({ length: daysIn }, (_, i) => {
          const key = iso(new Date(month.getFullYear(), month.getMonth(), i + 1));
          const cls = key === day ? 'today' : periods.has(key) ? 'period' : key === ovulation ? 'ovu' : '';
          return <span key={key} className="cg-cell"><span className={'cg-day ' + cls}>{i + 1}</span></span>;
        })}
      </div>
      <div className="legend"><span><i className="lg period" />Règles</span><span><i className="lg ovu" />Ovulation (estimée)</span><span><i className="lg today" />Aujourd’hui</span></div>
      <button className="button ghost small" onClick={() => onAdd('cycle')}><Plus size={15} /> Noter le début des règles</button>
      <SectionTitle action="+ Ajouter" onAction={() => onAdd('mood')}>Aujourd’hui</SectionTitle>
      <div className="soft-card bars-card">{bars.map((b) => <div className="sym-row" key={b.k}><span>{b.k}</span>
        <span className="sym-bar"><span style={{ width: Math.round(b.w * 100) + '%' }} /></span><small>{b.v}</small></div>)}</div>
      <p className="disclaimer">Les prévisions sont indicatives, calculées sur vos cycles passés. Elles ne sont ni un diagnostic ni une méthode de contraception.</p>
    </>}
    {tab === 'sleep' && <>
      <SectionTitle action="+ Ajouter" onAction={() => onAdd('sleep')}>Mes nuits</SectionTitle>
      <div className="soft-card bars-card">{sleep.length ? sleep.slice(0, 7).map((e) => <div className="sym-row" key={e.id}>
        <span>{new Date(e.entry_date + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}</span>
        <span className="sym-bar"><span style={{ width: Math.min(100, Number(e.data.hours) / 9 * 100) + '%' }} /></span>
        <small>{String(e.data.hours).replace('.', ',')} h</small></div>) : <p className="muted">Aucune nuit notée.</p>}</div>
    </>}
    {tab === 'food' && <>
      <SectionTitle action="+ Ajouter" onAction={() => onAdd('food')}>Journal bienveillant</SectionTitle>
      <div className="soft-card list-card">{entries.filter((e) => e.kind === 'food').slice(0, 7).map((e) => <div className="prio-row" key={e.id}>
        <span>{e.title}<small> · {e.entry_date ? new Date(e.entry_date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''}</small></span></div>)}
        {!entries.some((e) => e.kind === 'food') && <p className="muted">Note tes repas et tes découvertes, sans compter.</p>}</div>
    </>}
  </div>;
}
