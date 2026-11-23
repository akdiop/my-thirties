import { useState } from 'react';
import { Check, Info, Plus, Trash2 } from 'lucide-react';
import { addCollection, COLLECTION_TYPES, type CollectionType } from './progress';
import type { GtaCtx } from './ctx';

const LABEL: Record<CollectionType, string> = { objet: 'Objets', 'trophée': 'Trophées', 'activité': 'Activités', collectible: 'Collectibles' };

/** Inventaire libre pour le 100 % : rien n'est pré-rempli tant que les listes officielles ne sont pas vérifiées. */
export function GtaCollections(ctx: GtaCtx) {
  const [name, setName] = useState('');
  const [type, setType] = useState<CollectionType>('objet');
  const [msg, setMsg] = useState('');
  const items = ctx.p.collections;
  const add = () => {
    const r = addCollection(ctx.p, name, type);
    if (r.duplicate) { setMsg('« ' + name.trim() + ' » est déjà dans tes ' + LABEL[type].toLowerCase() + '.'); return; }
    ctx.update(() => r.progress); setName(''); setMsg('');
  };
  return <>
    <p className="g-alert info"><Info size={16} aria-hidden="true" /> Terminer toutes les missions n’est pas la même chose que les 100 % : objets, trophées, activités et collectibles comptent à part.</p>
    <section className="g-card">
      <p className="g-label">Ajouter à ma collection</p>
      <input value={name} maxLength={120} placeholder="Nom de l’objet, du trophée, de l’activité…" aria-label="Nom" onChange={(e) => { setName(e.target.value); setMsg(''); }} onKeyDown={(e) => { if (e.key === 'Enter') add(); }} />
      <div className="g-chips">{COLLECTION_TYPES.map((t) => <button key={t} className="g-chip" aria-pressed={type === t} onClick={() => setType(t)}>{LABEL[t]}</button>)}</div>
      <button className="g-btn" disabled={!name.trim()} onClick={add}><Plus size={16} /> Ajouter</button>
      {msg && <p className="g-muted" role="status">{msg}</p>}
    </section>
    {COLLECTION_TYPES.map((t) => { const list = items.filter((c) => c.type === t); if (!list.length) return null;
      const done = list.filter((c) => c.done).length;
      return <section key={t} className="g-card">
        <div className="g-chapter-head"><p className="g-label">{LABEL[t]}</p><span className="g-muted">{done}/{list.length}</span></div>
        <div className="g-list">{list.map((c) => <div key={c.id} className={'g-mission' + (c.done ? ' done' : '')}>
          <span className="g-open" style={{ cursor: 'default' }}><strong>{c.name}</strong></span>
          <button className="g-check" aria-pressed={c.done} aria-label={(c.done ? 'Décocher : ' : 'Obtenu : ') + c.name} onClick={() => ctx.update((p) => ({ ...p, collections: p.collections.map((x) => x.id === c.id ? { ...x, done: !x.done } : x) }))}>{c.done && <Check size={20} strokeWidth={3} />}</button>
          <button className="g-icon" aria-label={'Retirer ' + c.name} onClick={() => ctx.update((p) => ({ ...p, collections: p.collections.filter((x) => x.id !== c.id) }))}><Trash2 size={16} /></button>
        </div>)}</div>
      </section>; })}
    {!items.length && <p className="g-muted">Ta collection est vide. Les listes officielles d’objets et de trophées ne sont pas encore dans le kit : ajoute-les au fil du jeu.</p>}
  </>;
}
