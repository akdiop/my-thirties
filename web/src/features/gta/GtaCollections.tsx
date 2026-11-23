import { useState } from 'react';
import { Check, Info, Minus, Plus, Trash2 } from 'lucide-react';
import { MISSIONS, MONEY_UNIT } from './data';
import { addCollection, COLLECTION_TYPES, missionStats, setCount, type CollectionType } from './progress';
import { CENT_CATEGORIES, CENT_ITEMS, CENT_SOURCE, centDone, centValue, type CentItem } from './centPourCent';
import type { GtaCtx } from './ctx';

const LABEL: Record<CollectionType, string> = { objet: 'Objets', 'trophée': 'Trophées', 'activité': 'Activités', collectible: 'Collectibles' };
const fmt = (n: number) => n.toLocaleString('fr-FR');

/** Liste des 100 % (compteurs) puis inventaire libre d'objets, trophées, activités et collectibles. */
export function GtaCollections(ctx: GtaCtx) {
  const [name, setName] = useState('');
  const [type, setType] = useState<CollectionType>('objet');
  const [msg, setMsg] = useState('');
  const items = ctx.p.collections;
  const stats = missionStats(MISSIONS, ctx.p);
  const storyDone = stats.total > 0 && stats.done === stats.total;
  const centOk = CENT_ITEMS.filter((i) => centDone(i, ctx.p.counts, storyDone)).length;
  const add = () => {
    const r = addCollection(ctx.p, name, type);
    if (r.duplicate) { setMsg('« ' + name.trim() + ' » est déjà dans tes ' + LABEL[type].toLowerCase() + '.'); return; }
    ctx.update(() => r.progress); setName(''); setMsg('');
  };
  return <>
    <p className="g-alert info"><Info size={16} aria-hidden="true" /> Terminer toutes les missions n’est pas la même chose que les 100 % : la liste ci-dessous compte à part. Dans le jeu, elle n’apparaît qu’après l’histoire (Progression &gt; Statistiques &gt; 100 %) et rien n’y est manquable.</p>
    <section className="g-card" aria-labelledby="g-cent">
      <div className="g-chapter-head"><p className="g-label" id="g-cent">Checklist 100 %</p><span className="g-muted">{centOk}/{CENT_ITEMS.length}</span></div>
      <div className="g-bar"><span style={{ width: Math.round((centOk / CENT_ITEMS.length) * 100) + '%' }} /></div>
      <p className="g-muted">Gain de temps : 100 tâches facultatives suffisent, 200 véhicules sur 277 et 100 animaux sur 255.</p>
    </section>
    {CENT_CATEGORIES.map((c) => { const list = CENT_ITEMS.filter((i) => i.category === c.id);
      return <section key={c.id} className="g-card">
        <div className="g-chapter-head"><p className="g-label">{c.label}</p><span className="g-muted">{list.filter((i) => centDone(i, ctx.p.counts, storyDone)).length}/{list.length}</span></div>
        <div className="g-list">{list.map((i) => <CentRow key={i.id} item={i} value={centValue(i, ctx.p.counts, storyDone)} ctx={ctx} />)}</div>
      </section>; })}
    <p className="g-muted" style={{ fontSize: '.75rem' }}>Liste reformulée d’après le <a href={CENT_SOURCE.url} target="_blank" rel="noreferrer">guide 100 % de PowerPyx</a>, consulté le 23/11/2026.</p>
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
    {!items.length && <p className="g-muted">Ta collection personnelle est vide : ajoute ici ce que tu veux suivre en plus de la checklist.</p>}
  </>;
}

function CentRow({ item, value, ctx }: { item: CentItem; value: number; ctx: GtaCtx }) {
  const [draft, setDraft] = useState<string | null>(null);
  const done = value >= item.need;
  const step = item.money ? 1000 : 1;
  const set = (n: number) => ctx.update((p) => setCount(p, item.id, n));
  const commit = () => { if (draft !== null) { const n = Number(draft.replace(/\s/g, '')); if (Number.isFinite(n)) set(n); setDraft(null); } };
  const unit = item.money ? ' ' + MONEY_UNIT : '';
  return <div className={'g-cent' + (done ? ' done' : '')}>
    <div className="g-chapter-head"><strong>{item.label}</strong>
      <span className="g-muted">{done && <Check size={14} strokeWidth={3} aria-hidden="true" />} {fmt(value)}/{fmt(item.need)}{unit}{item.total ? ' · ' + item.total + ' en tout' : ''}</span></div>
    <div className="g-bar"><span style={{ width: Math.min(100, Math.round((value / item.need) * 100)) + '%' }} /></div>
    {item.id === 'story'
      ? <button className="g-btn ghost" onClick={() => ctx.go('missions')}>{done ? 'Histoire terminée' : 'Voir les missions'}</button>
      : <div className="g-row" style={{ flexWrap: 'nowrap' }}>
        <button className="g-icon" aria-label={'Retirer ' + fmt(step) + ' : ' + item.label} disabled={!value} onClick={() => set(value - step)}><Minus size={18} /></button>
        <input className="g-count" inputMode="numeric" aria-label={item.label + (item.money ? ' (montant)' : ' (nombre)')} value={draft ?? String(value)}
          onChange={(e) => setDraft(e.target.value.replace(/[^\d\s]/g, ''))} onBlur={commit} onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }} />
        <button className="g-icon" aria-label={'Ajouter ' + fmt(step) + ' : ' + item.label} onClick={() => set(value + step)}><Plus size={18} /></button>
        {item.link && <button className="g-btn ghost" onClick={() => ctx.go('missions')}>Missions</button>}
      </div>}
    <details className="g-tip"><summary>Astuce</summary><p className="g-muted">{item.tip}</p></details>
  </div>;
}
