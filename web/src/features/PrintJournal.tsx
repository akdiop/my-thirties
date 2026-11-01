import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Entry } from '../lib/cloud';
import { DAILY_KIND, NOTE_KIND } from '../lib/rituals';

const long = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
const list = (v: unknown) => (Array.isArray(v) ? v.map(String).filter((x) => x.trim()) : []);

/** Journal du mois en page imprimable : le navigateur propose « Enregistrer en PDF ». Rien n'est envoyé. */
export function PrintJournal({ entries, month, onDone }: { entries: Entry[]; month: string; onDone: () => void }) {
  const items = entries.filter((e) => (e.kind === DAILY_KIND || e.kind === NOTE_KIND) && String(e.entry_date).startsWith(month))
    .sort((a, b) => String(a.entry_date).localeCompare(String(b.entry_date)) || a.created_at.localeCompare(b.created_at));
  useEffect(() => {
    const done = () => onDone();
    window.addEventListener('afterprint', done);
    const t = setTimeout(() => window.print(), 300);
    return () => { clearTimeout(t); window.removeEventListener('afterprint', done); };
  }, []);
  const title = new Date(month + '-01T12:00:00').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  return createPortal(<div className="print-area">
    <h1>Mon journal · {title}</h1>
    {!items.length && <p>Aucune page ce mois-ci.</p>}
    {items.map((e) => e.kind === DAILY_KIND ? <article key={e.id}>
      <h2>{long(String(e.entry_date))}{typeof e.data.mood === 'string' && e.data.mood ? ' · ' + e.data.mood : ''}</h2>
      {[['Intention', e.data.intention], ['Priorités', list(e.data.priorities).join(' · ')], ['Gratitudes', list(e.data.gratitudes).join(' · ')],
        ['Moment pour moi', e.data.selfcare], ['Victoire', e.data.win], ['Autrement', e.data.different], ['Déposé', e.data.letgo], ['Pour demain', e.data.tomorrow]]
        .filter(([, v]) => typeof v === 'string' && v.trim()).map(([k, v]) => <p key={String(k)}><b>{String(k)} :</b> {String(v)}</p>)}
    </article> : <article key={e.id}>
      <h2>{e.title} <small>· {long(String(e.entry_date))}</small></h2>
      <p className="print-body">{String(e.data.body ?? '')}</p>
    </article>)}
  </div>, document.body);
}
