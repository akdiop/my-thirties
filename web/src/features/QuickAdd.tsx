import { useState } from 'react';
import { CalendarPlus, Check } from 'lucide-react';
import type { EntryInput } from '../lib/cloud';
import { parseQuick } from '../lib/quickparse';

/** Champ « ajout rapide » : on écrit comme on parle, l'aperçu montre ce qui sera créé avant de valider. */
export function QuickAdd({ onCreate }: { onCreate: (i: EntryInput) => Promise<void> }) {
  const [text, setText] = useState(''), [busy, setBusy] = useState(false), [done, setDone] = useState('');
  const p = text.trim().length >= 2 ? parseQuick(text) : null;
  const when = p ? new Date(p.date + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : '';
  const add = async () => {
    if (!p || busy) return;
    setBusy(true);
    try {
      await onCreate(p.kind === 'event'
        ? { module: 'quotidien', kind: 'event', title: p.title, entry_date: p.date, data: { date: p.date, time: p.time, ...(p.endTime ? { endTime: p.endTime } : {}) } }
        : { module: 'quotidien', kind: 'task', title: p.title, entry_date: p.date, data: { date: p.date, priority: 'Normale' } });
      setDone(p.title + ' · ' + when + (p.time ? ' à ' + p.time : '')); setText('');
      window.setTimeout(() => setDone(''), 3500);
    } finally { setBusy(false); }
  };
  return <form className="quick-add" onSubmit={(e) => { e.preventDefault(); void add(); }}>
    <div className="quick-row"><CalendarPlus size={18} aria-hidden="true" />
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ajout rapide : dentiste jeudi 15h" aria-label="Ajout rapide" maxLength={160} enterKeyHint="done" />
      <button className="button primary small" disabled={!p || busy}>Ajouter</button></div>
    {p && <p className="quick-preview"><b>{p.title}</b> · {when}{p.time ? ' · ' + p.time + (p.endTime ? '–' + p.endTime : '') : ''} · {p.kind === 'event' ? 'événement' : 'tâche'}</p>}
    {done && !p && <p className="quick-preview ok" role="status"><Check size={14} /> Ajouté : {done}</p>}
  </form>;
}
