import { useState } from 'react';
import { Cake, Gift, Plus, Trash2, UserPlus } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { isoOf } from '../lib/rituals';
import { VISION_KIND as VISION_KIND_ALIAS } from '../lib/growth';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
export const RELATIVE_KIND = 'proche';
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const RELATIONS = ['Famille', 'Amie', 'Ami', 'Maman', 'Papa', 'Sœur', 'Frère', 'Cousine', 'Cousin', 'Tante', 'Oncle', 'Collègue', 'Filleul·e', 'Autre'];

/** Jours avant le prochain anniversaire (0 = aujourd'hui) et âge atteint ce jour-là si l'année est connue. */
export function nextBirthday(day: string, year: number, todayIso: string) {
  const [m, d] = day.split('-').map(Number) as [number, number];
  const t = new Date(todayIso + 'T12:00:00');
  let next = new Date(t.getFullYear(), m - 1, d, 12);
  if (next.getTime() < t.getTime() - 43_200_000) next = new Date(t.getFullYear() + 1, m - 1, d, 12);
  const days = Math.round((next.getTime() - t.getTime()) / 86_400_000);
  return { days, age: year ? next.getFullYear() - year : 0, date: next };
}

/** Mes proches : anniversaires (rappel 3 jours avant et le jour J) et idées de cadeaux. */
export function Relatives({ entries, onCreate, onUpdate, onRemove }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; onRemove: (e: Entry) => Promise<void> }) {
  const today = isoOf(new Date());
  const list = entries.filter((e) => e.kind === RELATIVE_KIND && /^\d{2}-\d{2}$/.test(String(e.data.day)))
    .map((e) => ({ e, ...nextBirthday(String(e.data.day), Number(e.data.year) || 0, today) })).sort((a, b) => a.days - b.days);
  const [adding, setAdding] = useState(!list.length);
  const [name, setName] = useState(''), [dd, setDd] = useState('1'), [mm, setMm] = useState('1'), [year, setYear] = useState(''), [relation, setRelation] = useState('Famille');
  const [open, setOpen] = useState<string | null>(null);
  const vision = entries.find((e) => e.kind === VISION_KIND_ALIAS);
  const fromVision = (Array.isArray(vision?.data.people) ? vision!.data.people as { name: string; date: string }[] : [])
    .filter((p) => p.name && /^\d{4}-\d{2}-\d{2}$/.test(p.date) && !list.some((x) => x.e.title.toLowerCase() === p.name.toLowerCase()));

  const create = (title: string, day: string, y: number, rel: string) => onCreate({ module: 'equilibre', kind: RELATIVE_KIND, title: title.trim().slice(0, 80), entry_date: null, data: { day, year: y, relation: rel, gifts: '', note: '', remind: true } });
  const add = async () => {
    await create(name, String(mm).padStart(2, '0') + '-' + String(dd).padStart(2, '0'), Number(year) || 0, relation);
    setName(''); setYear(''); setAdding(false);
  };

  return <div className="screen relatives">
    <header className="tab-head"><h1>Mes proches</h1><p>{list.length ? (list[0]!.days === 0 ? 'C’est l’anniversaire de ' + list[0]!.e.title + ' aujourd’hui !' : 'Prochain : ' + list[0]!.e.title + ' dans ' + list[0]!.days + ' jour' + (list[0]!.days > 1 ? 's' : '')) : 'Anniversaires et idées de cadeaux'}</p></header>
    <div className="stack-8">{list.map(({ e, days, age, date }) => {
      const isOpen = open === e.id;
      return <article key={e.id} className={'relative-card' + (days <= 7 ? ' soon' : '')}>
        <button className="relative-head" onClick={() => setOpen(isOpen ? null : e.id)} aria-expanded={isOpen}>
          <span className="relative-badge"><Cake size={18} /></span>
          <span className="habit-body"><strong>{e.title}</strong><small>{date.getDate()} {MONTHS[date.getMonth()]}{age ? ' · ' + age + ' ans' : ''}{e.data.relation ? ' · ' + String(e.data.relation) : ''}</small></span>
          <span className="relative-days">{days === 0 ? 'Aujourd’hui' : days === 1 ? 'Demain' : 'J-' + days}</span>
        </button>
        {isOpen && <div className="form-stack relative-more">
          <label><span className="label-strong"><Gift size={14} /> Idées de cadeaux</span><textarea rows={3} defaultValue={String(e.data.gifts ?? '')} placeholder="Un parfum, un livre de cuisine, un week-end…" onBlur={(ev) => void onUpdate(e, { ...e.data, gifts: ev.target.value.slice(0, 1000) })} /></label>
          <label>Note<input defaultValue={String(e.data.note ?? '')} maxLength={200} placeholder="Ses goûts, sa taille, ce qu’elle aime…" onBlur={(ev) => void onUpdate(e, { ...e.data, note: ev.target.value })} /></label>
          <label className="checklist-item"><input type="checkbox" checked={e.data.remind !== false} onChange={() => void onUpdate(e, { ...e.data, remind: e.data.remind === false })} /> Me prévenir 3 jours avant et le jour J</label>
          <button className="link-btn small danger" onClick={() => { if (confirm('Retirer ' + e.title + ' ?')) void onRemove(e); }}><Trash2 size={14} /> Retirer</button>
        </div>}
      </article>; })}</div>

    {fromVision.length > 0 && <section className="ritual-card"><p className="ritual-label">Déjà notés dans mon chemin de vie</p>
      <div className="chip-row">{fromVision.map((p) => <button key={p.name} className="chip" onClick={() => void create(p.name, p.date.slice(5), Number(p.date.slice(0, 4)), 'Famille')}><Plus size={12} /> {p.name}</button>)}</div></section>}

    {adding ? <section className="ritual-card form-stack">
      <p className="ritual-label">Ajouter une personne</p>
      <label>Prénom<input value={name} maxLength={80} onChange={(e) => setName(e.target.value)} placeholder="Maman, Fatou, Moussa…" /></label>
      <div className="two-inputs">
        <label>Jour<select value={dd} onChange={(e) => setDd(e.target.value)}>{Array.from({ length: 31 }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select></label>
        <label>Mois<select value={mm} onChange={(e) => setMm(e.target.value)}>{MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</select></label>
      </div>
      <div className="two-inputs">
        <label>Année (facultatif)<input inputMode="numeric" value={year} maxLength={4} onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))} placeholder="1990" /></label>
        <label>Lien<select value={relation} onChange={(e) => setRelation(e.target.value)}>{RELATIONS.map((r) => <option key={r}>{r}</option>)}</select></label>
      </div>
      <div className="button-group"><button className="button primary" disabled={!name.trim()} onClick={() => void add()}>Ajouter</button>
        {list.length > 0 && <button className="button ghost" onClick={() => setAdding(false)}>Annuler</button>}</div>
    </section> : <button className="button secondary wide" onClick={() => setAdding(true)}><UserPlus size={16} /> Ajouter un proche</button>}
  </div>;
}
