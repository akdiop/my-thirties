import { useState } from 'react';
import { ChevronRight, Copy } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { exercicesHsp, FICHES_HSP, HSP_KIND, OUTILS_HSP, PHRASES, progresHsp, SOS_HSP } from '../lib/hypersensibilite';
import { isoOf } from '../lib/rituals';
import type { Outil } from '../lib/tcc';
import { Worksheet } from './Tcc';
import { Segmented } from '../ui/kit';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
type Props = { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; onRemove: (e: Entry) => Promise<void>; onBreathe?: () => void };
type Tab = 'sos' | 'exercices' | 'comprendre' | 'phrases' | 'suivi';
const frDay = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

/** Mon hypersensibilité : SOS surcharge, exercices, fiches pour comprendre, phrases toutes prêtes et suivi. */
export function Hypersensibilite({ entries, onCreate, onUpdate, onRemove, onBreathe }: Props) {
  const [tab, setTab] = useState<Tab>('exercices');
  const [open, setOpen] = useState<{ outil: Outil; entry?: Entry } | null>(null);
  const list = exercicesHsp(entries);
  if (open) return <div className="screen hsp"><Worksheet back="Mon hypersensibilité" outil={open.outil} entry={open.entry} echelle={[]} onClose={() => setOpen(null)}
    onSave={async (values) => { if (open.entry) await onUpdate(open.entry, { ...open.entry.data, values });
      else await onCreate({ module: 'equilibre', kind: HSP_KIND, title: open.outil.nom, entry_date: isoOf(new Date()), data: { outil: open.outil.id, values } }); setOpen(null); }}
    onRemove={open.entry ? async () => { await onRemove(open.entry!); setOpen(null); } : undefined} /></div>;
  const start = (id: string) => setOpen({ outil: OUTILS_HSP.find((o) => o.id === id)! });
  return <div className="screen hsp">
    <header className="tab-head"><h1>Mon hypersensibilité</h1><p>Comprendre, protéger et honorer ma sensibilité</p></header>
    <Segmented label="Hypersensibilité" value={tab} onChange={setTab} options={[{ value: 'sos', label: 'SOS' }, { value: 'exercices', label: 'Exercices' }, { value: 'comprendre', label: 'Comprendre' }, { value: 'phrases', label: 'Phrases' }, { value: 'suivi', label: 'Suivi' }]} />
    {tab === 'sos' && <div className="stack-8">
      <p className="calm-sub">Tu es en surcharge. Ce n’est pas grave, ça va redescendre.</p>
      {SOS_HSP.map((s, i) => <div key={s.titre} className="soft-card hsp-step"><span className="workout-dot">{i + 1}</span><span><strong>{s.titre}</strong><p className="muted small">{s.texte}</p></span></div>)}
      <div className="button-group">{onBreathe && <button className="button primary" onClick={onBreathe}>Respirer avec un guide</button>}
        <button className="button secondary" onClick={() => start('surcharge')}>Noter ce qui s’est passé</button></div>
    </div>}
    {tab === 'exercices' && <div className="stack-8">
      <button className="med-row next" onClick={() => start('batterie')}><span className="workout-title"><strong>Ma batterie du jour</strong><small>Une minute, matin et soir</small></span><ChevronRight size={16} /></button>
      {OUTILS_HSP.filter((o) => o.id !== 'batterie').map((o) => <button key={o.id} className="med-row" onClick={() => setOpen({ outil: o })}>
        <span className="workout-title"><strong>{o.nom}</strong><small>{o.but}</small></span><ChevronRight size={16} /></button>)}</div>}
    {tab === 'comprendre' && <div className="stack-8">{FICHES_HSP.map((f) => <details key={f.id} className="soft-card"><summary className="ritual-label">{f.titre}</summary>{f.points.map((p) => <p key={p} className="fiche-pt">{p}</p>)}</details>)}</div>}
    {tab === 'phrases' && <Phrases />}
    {tab === 'suivi' && <Suivi list={list} onOpen={(x) => setOpen({ outil: x.outil, entry: x.entry })} />}
  </div>;
}

function Phrases() {
  const [copied, setCopied] = useState('');
  const copy = async (t: string) => { try { await navigator.clipboard.writeText(t); setCopied(t); } catch { /* copie indisponible */ } };
  return <div className="stack-8"><p className="muted">Courtes, calmes et aimables : pas besoin de te justifier davantage.</p>
    {PHRASES.map((p) => <div key={p.quand} className="soft-card hsp-phrase"><small className="ritual-label">{p.quand}</small><p>« {p.phrase} »</p>
      <button className="icon-btn small" aria-label="Copier la phrase" onClick={() => void copy(p.phrase)}><Copy size={15} /></button>{copied === p.phrase && <small className="muted">Copiée</small>}</div>)}</div>;
}

function Suivi({ list, onOpen }: { list: ReturnType<typeof exercicesHsp>; onOpen: (x: ReturnType<typeof exercicesHsp>[number]) => void }) {
  const p = progresHsp(list);
  if (!list.length) return <p className="muted">Remplis ta batterie du jour ou un journal de surcharge : tes déclencheurs et ce qui t’aide apparaîtront ici.</p>;
  const tags = (title: string, items: { nom: string; n: number }[]) => items.length > 0 && <div><p className="ritual-label">{title}</p><div className="chip-row">{items.map((x) => <span key={x.nom} className="chip">{x.nom} · {x.n}</span>)}</div></div>;
  return <div className="stack-8">
    <div className="soft-card ar-stats"><div><strong>{p.total}</strong><small>fiches</small></div>
      <div><strong>{p.batterieSoir === null ? '·' : p.batterieSoir + '/10'}</strong><small>batterie du soir en moyenne</small></div>
      <div><strong>{p.baisse === null ? '·' : '−' + p.baisse}</strong><small>surcharge après avoir agi</small></div></div>
    <div className="soft-card form-stack">{tags('Ce qui me vide le plus', p.declencheurs)}{tags('Ce qui m’aide le plus', p.aide)}{tags('Mes premiers signaux', p.signes)}</div>
    {list.map((x) => <button key={x.entry.id} className="med-row" onClick={() => onOpen(x)}>
      <span className="workout-title"><strong>{x.outil.nom}</strong><small>{frDay(x.date)}{typeof x.values.situation === 'string' && x.values.situation ? ' · ' + x.values.situation.slice(0, 70) : typeof x.values.soir === 'number' ? ' · batterie ' + x.values.soir + '/10' : ''}</small></span><ChevronRight size={16} /></button>)}
  </div>;
}
