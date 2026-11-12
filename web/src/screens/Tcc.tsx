import { useState } from 'react';
import { ChevronRight, Plus, Trash2 } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { DISTORSIONS, echelleOf, EMOTIONS, exercices, FICHES, OUTILS, progres, PSYCHO_POSITIVE, QUESTIONS_SOCRATIQUES, TCC_ECHELLE, TCC_KIND, type Force, type Marche, type Outil } from '../lib/tcc';
import { isoOf } from '../lib/rituals';
import { Segmented } from '../ui/kit';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
type Props = { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; onRemove: (e: Entry) => Promise<void> };
type Tab = 'outils' | 'comprendre' | 'echelle' | 'journal';
const frDay = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

/** Mes outils TCC : exercices à remplir, fiches pour comprendre, échelle d'exposition et journal des progrès. */
export function Tcc({ entries, onCreate, onUpdate, onRemove }: Props) {
  const [tab, setTab] = useState<Tab>('outils');
  const [open, setOpen] = useState<{ outil: Outil; entry?: Entry } | null>(null);
  const list = exercices(entries);
  if (open) return <div className="screen tcc"><Worksheet outil={open.outil} entry={open.entry} echelle={echelleOf(entries)} onClose={() => setOpen(null)}
    onSave={async (values) => { if (open.entry) await onUpdate(open.entry, { ...open.entry.data, values });
      else await onCreate({ module: 'equilibre', kind: TCC_KIND, title: open.outil.nom, entry_date: isoOf(new Date()), data: { outil: open.outil.id, values } }); setOpen(null); }}
    onRemove={open.entry ? async () => { await onRemove(open.entry!); setOpen(null); } : undefined} /></div>;
  return <div className="screen tcc">
    <header className="tab-head"><h1>Mes outils TCC</h1><p>Comprendre ce qui se passe, et s’entraîner à faire autrement</p></header>
    <Segmented label="TCC" value={tab} onChange={setTab} options={[{ value: 'outils', label: 'Exercices' }, { value: 'comprendre', label: 'Comprendre' }, { value: 'echelle', label: 'Mon échelle' }, { value: 'journal', label: 'Mon suivi' }]} />
    {tab === 'outils' && <div className="stack-8">{OUTILS.map((o) => <button key={o.id} className="med-row" onClick={() => setOpen({ outil: o })}>
      <span className="workout-title"><strong>{o.nom}</strong><small>{o.but}</small></span><ChevronRight size={16} /></button>)}
      <p className="ritual-label">Psychologie positive</p>
      {PSYCHO_POSITIVE.map((o) => <button key={o.id} className="med-row" onClick={() => setOpen({ outil: o })}>
        <span className="workout-title"><strong>{o.nom}</strong><small>{o.but}</small></span><ChevronRight size={16} /></button>)}</div>}
    {tab === 'comprendre' && <Understand />}
    {tab === 'echelle' && <Ladder entries={entries} onCreate={onCreate} onUpdate={onUpdate} />}
    {tab === 'journal' && <Journal list={list} onOpen={(x) => setOpen({ outil: x.outil, entry: x.entry })} />}
  </div>;
}

/** Fiche d'exercice à remplir (partagée avec le module Hypersensibilité). */
export function Worksheet({ outil, entry, echelle, onSave, onClose, onRemove, back = 'Mes outils TCC' }: { outil: Outil; entry?: Entry; echelle: Marche[]; onSave: (v: Record<string, unknown>) => Promise<void>; onClose: () => void; onRemove?: () => Promise<void>; back?: string }) {
  const [v, setV] = useState<Record<string, unknown>>(() => ({ ...((entry?.data.values ?? {}) as Record<string, unknown>) }));
  const set = (id: string, x: unknown) => setV({ ...v, [id]: x });
  const toggle = (id: string, x: string) => { const cur = Array.isArray(v[id]) ? (v[id] as string[]) : []; set(id, cur.includes(x) ? cur.filter((y) => y !== x) : [...cur, x]); };
  const has = (id: string) => (Array.isArray(v[id]) ? (v[id] as string[]) : []);
  return <section className="stack-8">
    <button className="link-btn back-link" onClick={onClose}>‹ {back}</button>
    <div className="soft-card"><strong className="serif lesson-title">{outil.nom}</strong><p className="muted">{outil.but}</p>{entry && <p className="muted small">{frDay(String(entry.entry_date))}</p>}</div>
    {outil.intro && <details className="soft-card" open={!entry}><summary className="ritual-label">Comment faire</summary>{outil.intro.map((p) => <p key={p} className="fiche-pt">{p}</p>)}</details>}
    {outil.id === 'colonnes' && <details className="soft-card"><summary className="ritual-label">Des questions pour examiner la pensée</summary>{QUESTIONS_SOCRATIQUES.map((q) => <p key={q} className="fiche-pt">{q}</p>)}</details>}
    <div className="soft-card form-stack">{outil.fields.map((f) => {
      if (f.type === 'area') return <label key={f.id}>{f.label}{f.hint && <small className="muted">{f.hint}</small>}<textarea rows={3} value={String(v[f.id] ?? '')} onChange={(e) => set(f.id, e.target.value)} /></label>;
      if (f.type === 'text') return <label key={f.id}>{f.label}{f.hint && <small className="muted">{f.hint}</small>}<input value={String(v[f.id] ?? '')} onChange={(e) => set(f.id, e.target.value)} /></label>;
      if (f.type === 'slider') { const max = f.max ?? 100, min = f.min ?? 0, val = v[f.id] === undefined ? null : Number(v[f.id]);
        return <label key={f.id} className="tcc-slider">{f.label} <strong>{val === null ? '·' : val + (max === 100 ? ' %' : ' / ' + max)}</strong>
          <input type="range" min={min} max={max} step={max === 100 ? 5 : 1} value={val ?? Math.round((min + max) / 2)} onChange={(e) => set(f.id, Number(e.target.value))} /></label>; }
      if (f.type === 'forces') return <Forces key={f.id} label={f.label} rows={Array.isArray(v[f.id]) ? (v[f.id] as Force[]) : []} onChange={(r) => set(f.id, r)} />;
      const opts = f.type === 'emotions' ? EMOTIONS : f.type === 'echelle' ? echelle.map((m) => m.text) : f.type === 'distorsions' ? DISTORSIONS.map((d) => d.id) : f.options ?? [];
      const multi = f.type === 'emotions' || f.type === 'distorsions' || f.type === 'multi';
      return <div key={f.id}><p className="ritual-label">{f.label}</p>
        {f.type === 'echelle' && !opts.length && <p className="muted small">Ajoute d’abord des marches dans « Mon échelle ».</p>}
        <div className="chip-row">{opts.map((o) => { const on = multi ? has(f.id).includes(o) : v[f.id] === o;
          return <button key={o} type="button" className={'chip' + (on ? ' on' : '')} aria-pressed={on} onClick={() => (multi ? toggle(f.id, o) : set(f.id, on ? '' : o))}>
            {f.type === 'distorsions' ? DISTORSIONS.find((d) => d.id === o)!.nom : o}</button>; })}</div>
        {f.type === 'distorsions' && has(f.id).map((id) => { const d = DISTORSIONS.find((x) => x.id === id)!; return <p key={id} className="tcc-q">{d.nom} : {d.question}</p>; })}</div>;
    })}</div>
    {outil.source && <p className="fineprint">D’après {outil.source}.</p>}
    <div className="button-group"><button className="button primary" onClick={() => void onSave(v)}>Enregistrer</button>
      {onRemove && <button className="button ghost" onClick={() => { if (confirm('Supprimer cet exercice ?')) void onRemove(); }}><Trash2 size={16} /> Supprimer</button>}</div>
  </section>;
}

function Understand() {
  return <div className="stack-8">
    {FICHES.map((f) => <details key={f.id} className="soft-card"><summary className="ritual-label">{f.titre}</summary>{f.points.map((p) => <p key={p} className="fiche-pt">{p}</p>)}</details>)}
    <details className="soft-card"><summary className="ritual-label">Les 12 pièges de pensée</summary>
      {DISTORSIONS.map((d) => <div key={d.id} className="tcc-dist"><strong>{d.nom}</strong><p className="muted small">{d.def} {d.ex}</p><p className="tcc-q">{d.question}</p></div>)}</details>
    <details className="soft-card"><summary className="ritual-label">Questions pour examiner une pensée</summary>{QUESTIONS_SOCRATIQUES.map((q) => <p key={q} className="fiche-pt">{q}</p>)}</details>
  </div>;
}

/** Mon échelle d'exposition : les situations redoutées, notées de 0 à 100, de la plus facile à la plus difficile. */
function Ladder({ entries, onCreate, onUpdate }: Pick<Props, 'entries' | 'onCreate' | 'onUpdate'>) {
  const entry = entries.find((e) => e.kind === TCC_ECHELLE), items = echelleOf(entries);
  const done = exercices(entries).filter((x) => x.outil.id === 'exposition');
  const [text, setText] = useState(''), [suds, setSuds] = useState(40);
  const save = (next: Marche[]) => entry ? onUpdate(entry, { ...entry.data, items: next })
    : onCreate({ module: 'equilibre', kind: TCC_ECHELLE, title: 'Mon échelle d’exposition', entry_date: null, data: { items: next } });
  return <div className="stack-8">
    <p className="muted">Liste les situations que tu évites ou redoutes, note l’anxiété qu’elles te donneraient, puis commence par une marche autour de 30 à 40.</p>
    {items.map((m, i) => { const n = done.filter((x) => x.values.marche === m.text).length;
      return <div key={i} className="soft-card tcc-step"><span className="pill">{m.suds}</span><span className="workout-title"><strong>{m.text}</strong>{n > 0 && <small>{n} exposition{n > 1 ? 's' : ''}</small>}</span>
        <button className="icon-btn" aria-label={'Retirer ' + m.text} onClick={() => void save(items.filter((x) => x !== m))}><Trash2 size={16} /></button></div>; })}
    <div className="soft-card form-stack"><label>Une situation<input value={text} maxLength={120} placeholder="Prendre la parole en réunion" onChange={(e) => setText(e.target.value)} /></label>
      <label className="tcc-slider">Anxiété prévue <strong>{suds}</strong><input type="range" min={0} max={100} step={5} value={suds} onChange={(e) => setSuds(Number(e.target.value))} /></label>
      <button className="button secondary" disabled={!text.trim()} onClick={() => { void save([...items, { text: text.trim(), suds }]); setText(''); }}><Plus size={16} /> Ajouter la marche</button></div>
  </div>;
}

function Journal({ list, onOpen }: { list: ReturnType<typeof exercices>; onOpen: (x: ReturnType<typeof exercices>[number]) => void }) {
  const p = progres(list);
  if (!list.length) return <p className="muted">Tes exercices apparaîtront ici, avec ce qui change au fil des semaines.</p>;
  return <div className="stack-8">
    <div className="soft-card ar-stats"><div><strong>{p.total}</strong><small>exercices</small></div>
      <div><strong>{p.baisse === null ? '·' : '−' + p.baisse + ' %'}</strong><small>intensité en moyenne</small></div>
      <div><strong>{p.humeur === null ? '·' : (p.humeur > 0 ? '+' : '') + p.humeur}</strong><small>humeur après une activité</small></div></div>
    {p.pieges.length > 0 && <p className="muted">Les pièges de pensée qui reviennent : {p.pieges.map((x) => x.nom.toLowerCase() + ' (' + x.n + ')').join(', ')}.</p>}
    {list.map((x) => <button key={x.entry.id} className="med-row" onClick={() => onOpen(x)}>
      <span className="workout-title"><strong>{x.outil.nom}</strong><small>{frDay(x.date)} · {String(x.values.situation ?? x.values.pensee ?? x.values.a ?? x.values.prediction ?? x.values.probleme ?? x.values.inquietude ?? x.values.activite ?? x.values.marche ?? x.values.critique ?? '').slice(0, 80)}</small></span><ChevronRight size={16} /></button>)}
  </div>;
}

/** La roue des forces : pour chaque force, usage actuel et potentiel dans le domaine (0 à 10), et l'écart entre les deux. */
function Forces({ label, rows, onChange }: { label: string; rows: Force[]; onChange: (r: Force[]) => void }) {
  const [name, setName] = useState('');
  const upd = (i: number, d: Partial<Force>) => onChange(rows.map((r, k) => (k === i ? { ...r, ...d } : r)));
  return <div className="form-stack"><p className="ritual-label">{label}</p>
    {rows.map((r, i) => { const gap = r.potentiel - r.usage;
      return <div key={i} className="tcc-force"><div className="tcc-force-head"><strong>{r.force}</strong>
        <span className={'pill' + (gap < 0 ? ' warn' : '')}>{gap > 0 ? '+' + gap + ' à gagner' : gap < 0 ? 'utilisée plus que possible' : 'à sa place'}</span>
        <button type="button" className="icon-btn small" aria-label={'Retirer ' + r.force} onClick={() => onChange(rows.filter((_, k) => k !== i))}><Trash2 size={14} /></button></div>
        <label className="tcc-slider">Usage aujourd’hui <strong>{r.usage}</strong><input type="range" min={0} max={10} value={r.usage} onChange={(e) => upd(i, { usage: Number(e.target.value) })} /></label>
        <label className="tcc-slider">Ce qui serait possible <strong>{r.potentiel}</strong><input type="range" min={0} max={10} value={r.potentiel} onChange={(e) => upd(i, { potentiel: Number(e.target.value) })} /></label>
        <div className="tcc-bar"><i style={{ width: r.usage * 10 + '%' }} /><b style={{ left: r.potentiel * 10 + '%' }} /></div></div>; })}
    <div className="two-inputs"><input value={name} maxLength={40} placeholder="Humour, gratitude, curiosité…" onChange={(e) => setName(e.target.value)} />
      <button type="button" className="button secondary" disabled={!name.trim()} onClick={() => { onChange([...rows, { force: name.trim(), usage: 5, potentiel: 7 }]); setName(''); }}><Plus size={16} /> Ajouter</button></div>
  </div>;
}
