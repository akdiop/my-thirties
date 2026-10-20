import { useMemo } from 'react';
import type { Entry } from '../lib/cloud';

const today = () => new Date().toLocaleDateString('en-CA');
const text = (e: Entry, key: string) => typeof e.data[key] === 'string' ? e.data[key] as string : '';
const priority = (e: Entry) => text(e, 'priority') === 'Haute' ? 0 : text(e, 'priority') === 'Normale' ? 1 : 2;

export function PersonalBrief({ entries, onGo }: {
  entries: Entry[];
  onGo: (screen: 'quotidien' | 'cuisine' | 'equilibre' | 'finances' | 'decouvertes') => void;
}) {
  const brief = useMemo(() => {
    const day = today();
    const tasks = entries.filter((e) => e.module === 'quotidien' && e.kind === 'task' && e.entry_date && e.entry_date <= day && e.data.completed !== true)
      .sort((a, b) => priority(a) - priority(b) || (a.entry_date ?? '').localeCompare(b.entry_date ?? '')).slice(0, 3);
    const appointments = entries.filter((e) => (e.kind === 'event' || e.kind === 'appointment') && e.entry_date === day);
    const plannedMeals = entries.filter((e) => e.module === 'cuisine' && e.kind === 'meal' && e.entry_date === day);
    const suggestions: { title: string; body: string; screen: 'quotidien' | 'cuisine' | 'equilibre' | 'finances' | 'decouvertes' }[] = [];
    if (tasks.length) suggestions.push({ title: 'Tes priorités', body: tasks.map((e) => e.title).join(' · '), screen: 'quotidien' });
    if (appointments.length) suggestions.push({ title: 'Rendez-vous aujourd’hui', body: appointments.map((e) => e.title).join(' · '), screen: 'quotidien' });
    if (plannedMeals.length) suggestions.push({ title: 'Au menu', body: plannedMeals.map((e) => e.title).join(' · '), screen: 'cuisine' });
    if (!suggestions.length) suggestions.push({ title: 'Une journée à ton rythme', body: 'Tu peux commencer par une petite tâche ou simplement consulter ton agenda.', screen: 'quotidien' });
    return suggestions;
  }, [entries]);
  return <section className="personal-brief">
    <div className="section-row"><h2>Mon aperçu du jour</h2><span className="pill sage">Sans IA externe</span></div>
    <div className="brief-grid">{brief.map((item) => <button className="brief-card" key={item.title} onClick={() => onGo(item.screen)}>
      <strong>{item.title}</strong><p>{item.body}</p><span>Ouvrir l’espace ›</span>
    </button>)}</div>
    <p className="fineprint">Résumé automatique calculé uniquement à partir des entrées affichées. Aucune analyse externe de tes données.</p>
  </section>;
}
