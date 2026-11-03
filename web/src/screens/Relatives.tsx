import { useState } from 'react';
import { Check, ChevronDown, Gift, Plus, Trash2, UserPlus } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { isoOf } from '../lib/rituals';
import { VISION_KIND as VISION_KIND_ALIAS } from '../lib/growth';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
type EditFull = (id: string, patch: { title: string; data: Record<string, unknown> }) => Promise<void>;
export const RELATIVE_KIND = 'proche';
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const SHORT = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
const FAMILY = new Set(['Famille', 'Maman', 'Papa', 'Sœur', 'Frère', 'Fille', 'Fils', 'Nièce', 'Neveu', 'Cousine', 'Cousin', 'Tante', 'Oncle', 'Grand-mère', 'Grand-père', 'Petite-fille', 'Petit-fils', 'Belle-sœur', 'Beau-frère', 'Belle-mère', 'Beau-père', 'Mari', 'Filleul·e']);
const toneOf = (rel: unknown) => FAMILY.has(String(rel)) ? 'fam' : rel === 'Amie' || rel === 'Ami' ? 'ami' : 'autre';
const RELATIONS = ['Famille', 'Amie', 'Ami', 'Maman', 'Papa', 'Sœur', 'Frère', 'Fille', 'Fils', 'Nièce', 'Neveu', 'Cousine', 'Cousin', 'Tante', 'Oncle', 'Grand-mère', 'Grand-père', 'Petite-fille', 'Petit-fils', 'Belle-sœur', 'Beau-frère', 'Belle-mère', 'Beau-père', 'Mari', 'Filleul·e', 'Collègue', 'Autre'];

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
export function Relatives({ entries, onCreate, onUpdate, onEdit, onRemove }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; onEdit: EditFull; onRemove: (e: Entry) => Promise<void> }) {
  const today = isoOf(new Date());
  const list = entries.filter((e) => e.kind === RELATIVE_KIND && /^\d{2}-\d{2}$/.test(String(e.data.day)))
    .map((e) => ({ e, ...nextBirthday(String(e.data.day), Number(e.data.year) || 0, today) })).sort((a, b) => a.days - b.days);
  const groups: { key: string; label: string; items: typeof list }[] = [];
  for (const it of list) {
    const key = it.date.getFullYear() + '-' + it.date.getMonth();
    let g = groups.find((x) => x.key === key);
    if (!g) {
      const now = new Date();
      const label = it.date.getMonth() === now.getMonth() && it.date.getFullYear() === now.getFullYear() ? 'Ce mois-ci' : MONTHS[it.date.getMonth()]![0]!.toUpperCase() + MONTHS[it.date.getMonth()]!.slice(1) + (it.date.getFullYear() !== new Date().getFullYear() ? ' ' + it.date.getFullYear() : '');
      g = { key, label, items: [] }; groups.push(g);
    }
    g.items.push(it);
  }
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
    <img className="screen-cover" src="/modules/proches.webp" alt="Deux tasses de café et des fleurs" loading="lazy" />
    {groups.map((g) => <section key={g.key} className="relatives-month">
      <p className="relatives-month-title">{g.label}<small>{g.items.length}</small></p>
      <div className="relatives-list">{g.items.map(({ e, days, age, date }) => {
        const isOpen = open === e.id;
        return <article key={e.id} className={'relative-row' + (days <= 7 ? ' soon' : '') + (isOpen ? ' open' : '')}>
          <button className="relative-head" onClick={() => setOpen(isOpen ? null : e.id)} aria-expanded={isOpen}>
            <span className={'relative-date ' + toneOf(e.data.relation)}><strong>{date.getDate()}</strong><small>{SHORT[date.getMonth()]}</small></span>
            <span className="habit-body"><strong>{e.title}</strong><small>{[age ? (days === 0 ? age + ' ans aujourd’hui' : 'fêtera ses ' + age + ' ans') : '', e.data.relation ? String(e.data.relation) : ''].filter(Boolean).join(' · ')}</small></span>
            <span className="relative-days">{days === 0 ? 'Aujourd’hui' : days === 1 ? 'Demain' : 'J-' + days}</span>
            <ChevronDown size={16} className={'list-chev' + (isOpen ? ' flip' : '')} />
          </button>
          {isOpen && <RelativeDetails entry={e} onUpdate={onUpdate} onEdit={onEdit} onRemove={onRemove} />}
        </article>; })}</div>
    </section>)}

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

/** Fiche d'un proche : tout est modifiable (prénom, date, année, lien), plus cadeaux, note et rappel. */
function RelativeDetails({ entry: e, onUpdate, onEdit, onRemove }: { entry: Entry; onUpdate: Save; onEdit: EditFull; onRemove: (e: Entry) => Promise<void> }) {
  const [m0, d0] = String(e.data.day).split('-').map(Number) as [number, number];
  const [name, setName] = useState(e.title), [dd, setDd] = useState(String(d0)), [mm, setMm] = useState(String(m0));
  const [year, setYear] = useState(e.data.year ? String(e.data.year) : ''), [relation, setRelation] = useState(String(e.data.relation ?? 'Famille'));
  const [gifts, setGifts] = useState(String(e.data.gifts ?? '')), [note, setNote] = useState(String(e.data.note ?? ''));
  const [saved, setSaved] = useState(false);
  const day = mm.padStart(2, '0') + '-' + dd.padStart(2, '0');
  const dirty = name.trim() !== e.title || day !== e.data.day || (Number(year) || 0) !== (Number(e.data.year) || 0) || relation !== String(e.data.relation ?? '')
    || gifts !== String(e.data.gifts ?? '') || note !== String(e.data.note ?? '');
  const save = async () => {
    await onEdit(e.id, { title: name.trim().slice(0, 80) || e.title, data: { ...e.data, day, year: Number(year) || 0, relation, gifts: gifts.slice(0, 1000), note: note.slice(0, 200) } });
    setSaved(true);
  };
  return <div className="form-stack relative-more">
    <label>Prénom<input value={name} maxLength={80} onChange={(ev) => { setName(ev.target.value); setSaved(false); }} /></label>
    <div className="two-inputs">
      <label>Jour<select value={dd} onChange={(ev) => { setDd(ev.target.value); setSaved(false); }}>{Array.from({ length: 31 }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select></label>
      <label>Mois<select value={mm} onChange={(ev) => { setMm(ev.target.value); setSaved(false); }}>{MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</select></label>
    </div>
    <div className="two-inputs">
      <label>Année<input inputMode="numeric" value={year} maxLength={4} placeholder="1990" onChange={(ev) => { setYear(ev.target.value.replace(/\D/g, '')); setSaved(false); }} /></label>
      <label>Lien<select value={relation} onChange={(ev) => { setRelation(ev.target.value); setSaved(false); }}>{[...new Set([relation, ...RELATIONS])].map((r) => <option key={r}>{r}</option>)}</select></label>
    </div>
    <label><span className="label-strong"><Gift size={14} /> Idées de cadeaux</span><textarea rows={3} value={gifts} placeholder="Un parfum, un livre de cuisine, un week-end…" onChange={(ev) => { setGifts(ev.target.value); setSaved(false); }} /></label>
    <label>Note<input value={note} maxLength={200} placeholder="Ses goûts, sa taille, ce qu’elle aime…" onChange={(ev) => { setNote(ev.target.value); setSaved(false); }} /></label>
    <label className="checklist-item"><input type="checkbox" checked={e.data.remind !== false} onChange={() => void onUpdate(e, { ...e.data, remind: e.data.remind === false })} /> Me prévenir 3 jours avant et le jour J</label>
    <div className="relative-actions">
      <button className="button primary" disabled={!dirty || !name.trim()} onClick={() => void save()}>{saved && !dirty ? <><Check size={16} /> Enregistré</> : 'Enregistrer'}</button>
      <button className="link-btn small danger" onClick={() => { if (confirm('Retirer ' + e.title + ' ?')) void onRemove(e); }}><Trash2 size={14} /> Retirer</button>
    </div>
  </div>;
}
