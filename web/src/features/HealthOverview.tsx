import { useMemo, useState } from 'react';
import type { Entry } from '../lib/cloud';

const dateValue = (entry: Entry) => entry.entry_date ?? '';
const today = () => new Date().toLocaleDateString('en-CA');
const formatDate = (date: string) => new Date(date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

export function HealthOverview({ entries }: { entries: Entry[] }) {
  const [filter, setFilter] = useState<'all' | 'cycle' | 'sleep' | 'symptom' | 'mood'>('all');
  const summary = useMemo(() => {
    const cycles = entries.filter((e) => e.kind === 'cycle' && e.entry_date).sort((a, b) => dateValue(b).localeCompare(dateValue(a)));
    const sleeps = entries.filter((e) => e.kind === 'sleep' && Number.isFinite(Number(e.data.hours)) && Number(e.data.hours) > 0);
    const appointments = entries.filter((e) => e.kind === 'appointment' && e.entry_date && e.entry_date >= today())
      .sort((a, b) => dateValue(a).localeCompare(dateValue(b)));
    const avgSleep = sleeps.length ? sleeps.reduce((sum, e) => sum + Number(e.data.hours), 0) / sleeps.length : null;
    return { cycles, appointments, avgSleep };
  }, [entries]);
  const timeline = entries.filter((e) => e.entry_date && (filter === 'all' || e.kind === filter))
    .sort((a, b) => dateValue(b).localeCompare(dateValue(a))).slice(0, 12);
  return <section className="health-overview">
    <div className="section-row"><h2>Mon tableau de bord santé</h2></div>
    <div className="health-stats">
      <div className="stat-card"><span className="eyebrow">DERNIER CYCLE NOTÉ</span>
        <strong>{summary.cycles[0]?.entry_date ? formatDate(summary.cycles[0].entry_date) : 'Non renseigné'}</strong>
        <span className="fineprint">Dates déclarées.</span></div>
      <div className="stat-card"><span className="eyebrow">SOMMEIL MOYEN SAISI</span>
        <strong>{summary.avgSleep === null ? 'Non renseigné' : summary.avgSleep.toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' h'}</strong>
        <span className="fineprint">Moyenne des entrées enregistrées, pas un objectif à atteindre.</span></div>
      <div className="stat-card"><span className="eyebrow">PROCHAIN RENDEZ-VOUS</span>
        <strong>{summary.appointments[0]?.entry_date ? formatDate(summary.appointments[0].entry_date) : 'Aucun'}</strong>
        <span className="fineprint">{summary.appointments[0]?.title || 'Tu peux noter tes rendez-vous dans cet espace.'}</span></div>
    </div>
    <div className="tool-card"><div className="section-row"><h3>Mon historique</h3>
      <label>Afficher<select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
        <option value="all">Tout</option><option value="cycle">Cycle</option><option value="sleep">Sommeil</option>
        <option value="symptom">Symptômes</option><option value="mood">Humeur</option></select></label></div>
      {timeline.length ? timeline.map((e) => <div className="health-timeline" key={e.id}>
        <span>{formatDate(e.entry_date!)}</span><strong>{e.title}</strong><small>{e.kind === 'sleep' ? String(e.data.hours || '') + ' h' : e.kind}</small>
      </div>) : <p className="muted">Aucune donnée pour ce filtre.</p>}</div>
  </section>;
}
