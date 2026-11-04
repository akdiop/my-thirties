import { useState } from 'react';
import { Check, ChevronDown, EyeOff, Pencil, Plus, RotateCcw, Settings, Trash2 } from 'lucide-react';
import { SwipeRow } from '../ui/SwipeRow';
import type { Entry } from '../lib/cloud';

type Item = { id: string; text: string; checked: boolean };
type Save = (entry: Entry, data: Record<string, unknown>) => Promise<void>;

/** « Famille · article » → rangé sous le titre « Famille ». */
function split(text: string) {
  const m = /^([^·]{2,30}) · (.+)$/.exec(text);
  return m ? { group: m[1]!.trim(), label: m[2]!.trim() } : { group: '', label: text };
}

/** Une liste (courses, valise…) : repliable, progression, articles rangés par famille, ajout rapide. */
export function ListCard({ entry, onUpdate, onEdit, onDelete }: { entry: Entry; onUpdate: Save; onEdit: (e: Entry) => void; onDelete: (e: Entry) => void }) {
  const items: Item[] = Array.isArray(entry.data.items) ? (entry.data.items as Item[]) : [];
  const done = items.filter((i) => i.checked).length;
  const [open, setOpen] = useState(done < items.length && items.length <= 12);
  const [hideDone, setHideDone] = useState(false);
  const [text, setText] = useState('');
  const save = (next: Item[]) => onUpdate(entry, { ...entry.data, items: next, itemsText: next.map((i) => i.text).join('\n') });
  const toggle = (id: string) => void save(items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  const add = () => { const t = text.trim(); if (!t) return; void save([...items, { id: crypto.randomUUID(), text: t.slice(0, 160), checked: false }]); setText(''); };

  // Regroupement par famille, dans l'ordre d'apparition.
  const groups: { name: string; items: (Item & { label: string })[] }[] = [];
  for (const i of items) {
    const { group, label } = split(i.text);
    let g = groups.find((x) => x.name === group);
    if (!g) { g = { name: group, items: [] }; groups.push(g); }
    g.items.push({ ...i, label });
  }
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;
  const category = typeof entry.data.category === 'string' ? entry.data.category : 'Liste';

  return <article className={'list-card' + (open ? ' open' : '')}>
    <button className="list-head" aria-expanded={open} onClick={() => setOpen(!open)}>
      <span className="list-title"><small>{category}</small><strong>{entry.title}</strong></span>
      <span className="list-count">{done}/{items.length}</span>
      <ChevronDown size={18} className={'list-chev' + (open ? ' flip' : '')} />
    </button>
    <div className="list-bar"><span style={{ width: pct + '%' }} /></div>
    {open && <>
      {groups.map((g) => { const shown = hideDone ? g.items.filter((i) => !i.checked) : g.items; if (!shown.length) return null;
        const gDone = g.items.filter((i) => i.checked).length;
        return <section key={g.name || '_'} className="list-group">
          {g.name && <p className="list-group-name">{g.name}<small>{gDone}/{g.items.length}</small></p>}
          {shown.map((i) => <SwipeRow key={i.id} className="list-swipe" actions={[
            { label: 'Modifier', icon: <Pencil size={16} />, onClick: () => { const v = window.prompt('Modifier l’article', i.label)?.trim(); if (v) void save(items.map((x) => x.id === i.id ? { ...x, text: (g.name ? g.name + ' · ' : '') + v.slice(0, 140) } : x)); } },
            { label: 'Supprimer', icon: <Trash2 size={16} />, tone: 'danger', onClick: () => void save(items.filter((x) => x.id !== i.id)) },
          ]}><button className={'list-item' + (i.checked ? ' on' : '')} role="checkbox" aria-checked={i.checked} onClick={() => toggle(i.id)}>
            <span className="list-tick">{i.checked && <Check size={14} strokeWidth={3} />}</span><span>{i.label}</span></button></SwipeRow>)}
        </section>; })}
      {done === items.length && items.length > 0 && <p className="list-done">Tout est coché ✓</p>}
      <form className="list-add" onSubmit={(e) => { e.preventDefault(); add(); }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ajouter un article…" aria-label={'Ajouter un article à ' + entry.title} maxLength={160} />
        <button className="icon-btn" aria-label="Ajouter" disabled={!text.trim()}><Plus size={18} /></button></form>
      <div className="list-tools">
        {done > 0 && <button className="link-btn small" onClick={() => setHideDone(!hideDone)}><EyeOff size={14} /> {hideDone ? 'Afficher les cochés' : 'Masquer les cochés'}</button>}
        {done > 0 && <button className="link-btn small" onClick={() => void save(items.map((i) => ({ ...i, checked: false })))}><RotateCcw size={14} /> Tout décocher</button>}
        <span className="list-tools-end">
          <button className="icon-btn" aria-label={'Modifier ' + entry.title} onClick={() => onEdit(entry)}><Settings size={16} /></button>
          <button className="icon-btn" aria-label={'Supprimer ' + entry.title} onClick={() => onDelete(entry)}><Trash2 size={16} /></button></span>
      </div>
    </>}
  </article>;
}
