import { useState } from 'react';
import type { Entry, EntryInput } from '../lib/cloud';

const suggestions = [
  { title: 'Découvrir le yoga en douceur', discipline: 'Yoga', days: '7',
    plan: 'Explorer une posture ou une respiration confortable, puis noter son ressenti. Prévoir des jours de repos selon ses besoins. Ne jamais forcer une posture.' },
  { title: 'Carnet technique tennis', discipline: 'Tennis', days: '14',
    plan: 'Observer ou pratiquer une notion à son rythme : prise de raquette, règles, placement, service ou retour. Les jours sans court peuvent servir à apprendre les règles ou à récupérer.' },
  { title: 'Mes pauses bien-être', discipline: 'Mobilité', days: '30',
    plan: 'Choisir librement une activité douce ou un moment de repos : marche tranquille, étirements confortables, respiration ou récupération. Aucun objectif de performance.' },
] as const;

export function ChallengeIdeas({ entries, onCreate }: { entries: Entry[]; onCreate: (input: EntryInput) => Promise<void> }) {
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const create = async (idea: typeof suggestions[number]) => {
    setBusy(idea.title); setMessage('');
    try {
      const start = new Date().toLocaleDateString('en-CA');
      await onCreate({ module: 'challenges', kind: 'challenge', title: idea.title, entry_date: start,
        data: { discipline: idea.discipline, days: idea.days, start, plan: idea.plan, progress: {} } });
      setMessage('Challenge ajouté à tes programmes.');
    } catch { setMessage('Création impossible.'); } finally { setBusy(''); }
  };
  return <section className="tool-card"><h3>Idées de challenges facultatifs</h3>
    <p className="muted">Tu peux suivre plusieurs programmes indépendamment et marquer autant de jours de repos que nécessaire.</p>
    <div className="lesson-grid">{suggestions.map((idea) => <article className="lesson-card" key={idea.title}>
      <h3>{idea.title}</h3><p>{idea.days} jours · {idea.discipline}</p><p className="fineprint">{idea.plan}</p>
      <button className="button secondary" disabled={Boolean(busy) || entries.some((e) => e.title === idea.title)}
        onClick={() => void create(idea)}>{entries.some((e) => e.title === idea.title) ? 'Déjà ajouté' : 'Choisir ce challenge'}</button>
    </article>)}</div>{message && <p role="status">{message}</p>}
  </section>;
}
