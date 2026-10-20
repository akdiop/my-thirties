import { useMemo } from 'react';
import type { Entry } from '../lib/cloud';

const disciplines = ['Tennis', 'Pilates', 'Yoga', 'Mobilité', 'Autre'];

export function SportProgress({ entries }: { entries: Entry[] }) {
  const stats = useMemo(() => {
    const sessions = entries.filter((e) => e.kind === 'session');
    const byDiscipline = disciplines.map((discipline) => {
      const matches = sessions.filter((e) => e.data.discipline === discipline);
      const minutes = matches.reduce((sum, e) => {
        const n = Number(e.data.duration);
        return sum + (Number.isFinite(n) && n > 0 && n < 1440 ? n : 0);
      }, 0);
      return { discipline, count: matches.length, minutes };
    }).filter((x) => x.count);
    const recent = [...sessions].sort((a, b) => String(b.entry_date || '').localeCompare(String(a.entry_date || ''))).slice(0, 5);
    return { byDiscipline, recent };
  }, [entries]);
  return <section className="tool-card">
    <h3>Mon carnet de progression</h3>
    {stats.byDiscipline.length ? <div className="sport-stats">{stats.byDiscipline.map((s) =>
      <div className="stat-card" key={s.discipline}><span className="eyebrow">{s.discipline}</span>
        <strong>{s.count} séance(s)</strong><span className="fineprint">{s.minutes} minutes notées</span></div>)}</div>
      : <p className="muted">Ajoute une séance pour voir ton historique par discipline.</p>}
    {stats.recent.length > 0 && <><h4>Dernières séances</h4>
      {stats.recent.map((e) => <div className="health-timeline" key={e.id}>
        <span>{e.entry_date || '—'}</span><strong>{e.title}</strong><small>{String(e.data.discipline || '')}</small></div>)}</>}
    <p className="fineprint">Suivi descriptif uniquement. Le repos et l'adaptation aux sensations font partie de la pratique ; aucun volume d'entraînement n'est imposé.</p>
  </section>;
}
