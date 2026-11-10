import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { PASSION_IDEAS, THAT_GIRL } from '../lib/passionIdeas';

/** 100 passions à explorer : un toucher ajoute l'idée à mes hobbies (onglet Hobby libre). */
export function PassionIdeas({ entries, onCreate }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void> }) {
  const mine = new Set(entries.filter((e) => e.kind === 'hobby').map((e) => e.title.toLowerCase()));
  const [family, setFamily] = useState(PASSION_IDEAS[0]!.name);
  const [busy, setBusy] = useState('');
  const add = async (title: string) => {
    setBusy(title);
    try { await onCreate({ module: 'passions', kind: 'hobby', title, entry_date: null, data: { duration: '6 mois', goal: '' } }); } finally { setBusy(''); }
  };
  const current = PASSION_IDEAS.find((f) => f.name === family)!;
  return <section className="passion-ideas stack-8">
    <p className="muted">Des idées pour t’inspirer, t’épanouir et créer la vie qui te ressemble. Touche une passion pour l’ajouter à tes hobbies.</p>
    <div className="chip-scroll">{PASSION_IDEAS.map((f) => <button key={f.name} className={'chip' + (f.name === family ? ' on' : '')} onClick={() => setFamily(f.name)}>{f.name}</button>)}</div>
    <div className="idea-grid">{current.items.map((t) => { const has = mine.has(t.toLowerCase());
      return <button key={t} className={'idea-chip' + (has ? ' on' : '')} disabled={has || busy === t} onClick={() => void add(t)}>{has ? <Check size={15} /> : <Plus size={15} />} {t}</button>; })}</div>
    <div className="soft-card">
      <p className="ritual-label">La liste « That girl »</p>
      <p className="muted small">Un équilibre entre plaisir, bien-être et épanouissement.</p>
      <ol className="how-list">{THAT_GIRL.map((t) => <li key={t}>{t}</li>)}</ol>
    </div>
  </section>;
}
