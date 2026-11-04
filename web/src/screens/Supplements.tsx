import { useState } from 'react';
import { Bell, Check, Pill, Plus, Trash2, Pencil } from 'lucide-react';
import { SwipeRow } from '../ui/SwipeRow';
import type { Entry, EntryInput } from '../lib/cloud';
import { addDays, isoOf } from '../lib/rituals';
import { Bar } from '../ui/kit';

type EditFull = (id: string, patch: { title: string; data: Record<string, unknown> }) => Promise<void>;
type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
export const SUPPLEMENT_KIND = 'complement';

const SUGGESTIONS = ['Vitamine D', 'Forcapil', 'Magnésium', 'Fer', 'Oméga 3', 'Zinc', 'Vitamine C', 'Vitamine B12', 'Acide folique', 'Biotine', 'Collagène', 'Probiotiques', 'Spiruline', 'Calcium'];
const MOMENTS = [{ label: 'Matin', time: '08:00' }, { label: 'Midi', time: '13:00' }, { label: 'Soir', time: '20:00' }];

const dayOf = (start: string, today: string) => Math.floor((new Date(today + 'T12:00:00').getTime() - new Date(start + 'T12:00:00').getTime()) / 86400000) + 1;

/** Mes compléments : ce que je prends, quand, et où j'en suis de ma cure. Rappel par notification à l'heure choisie. */
export function Supplements({ entries, onCreate, onUpdate, onRemove, onEdit }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; onRemove: (e: Entry) => Promise<void>; onEdit?: EditFull }) {
  const today = isoOf(new Date());
  const list = entries.filter((e) => e.kind === SUPPLEMENT_KIND);
  const active = list.filter((e) => { const d = Number(e.data.days) || 0; return !d || dayOf(String(e.data.start ?? today), today) <= d; });
  const ended = list.filter((e) => !active.includes(e));
  const [adding, setAdding] = useState(!list.length);
  const [name, setName] = useState(''), [dose, setDose] = useState('1 gélule'), [time, setTime] = useState('08:00'), [days, setDays] = useState('30'), [start, setStart] = useState(today), [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const takenToday = active.filter((e) => (e.data.done as Record<string, boolean> | undefined)?.[today]).length;

  const add = async () => {
    setBusy(true);
    try {
      await onCreate({ module: 'sante', kind: SUPPLEMENT_KIND, title: name.trim().slice(0, 80), entry_date: start,
        data: { dose: dose.trim(), time, days: days === 'continu' ? 0 : Number(days), start, note: note.trim(), done: {}, remind: true } });
      setName(''); setNote(''); setAdding(false);
    } finally { setBusy(false); }
  };

  return <div className="screen supplements">
    <header className="tab-head"><h1>Mes compléments</h1><p>{active.length ? takenToday + ' sur ' + active.length + ' pris aujourd’hui' : 'Vitamines, cures et rappels'}</p></header>
    {active.length > 0 && <Bar value={takenToday / active.length} tone="caramel" />}
    <div className="stack-8">{active.sort((a, b) => String(a.data.time).localeCompare(String(b.data.time))).map((e) => {
      const done = (e.data.done && typeof e.data.done === 'object' ? e.data.done : {}) as Record<string, boolean>;
      const on = Boolean(done[today]);
      const total = Number(e.data.days) || 0, n = Math.max(1, dayOf(String(e.data.start ?? today), today));
      const taken = Object.values(done).filter(Boolean).length;
      const week = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
      return <SwipeRow key={e.id} className="card-swipe" actions={[
          { label: 'Renommer', icon: <Pencil size={18} />, onClick: () => { const v = window.prompt('Nouveau nom', e.title)?.trim(); if (v && onEdit) void onEdit(e.id, { title: v.slice(0, 80), data: e.data }); } },
          { label: 'Supprimer', icon: <Trash2 size={18} />, tone: 'danger', onClick: () => { if (confirm('Supprimer « ' + e.title + ' » ?')) void onRemove(e); } },
        ]}><article className={'supp-card' + (on ? ' on' : '')}>
        <button className="habit-check" aria-pressed={on} aria-label={(on ? 'Décocher ' : 'Pris : ') + e.title} onClick={() => void onUpdate(e, { ...e.data, done: { ...done, [today]: !on } })}>
          {on ? <Check size={22} strokeWidth={3} /> : <Pill size={22} />}</button>
        <div className="habit-body">
          <strong>{e.title}</strong>
          <small>{[String(e.data.dose || ''), String(e.data.time || '')].filter(Boolean).join(' · ')}{e.data.note ? ' · ' + String(e.data.note) : ''}</small>
          {total ? <><Bar value={Math.min(1, n / total)} /><small className="muted">Cure : jour {Math.min(n, total)} sur {total} · {taken} prise{taken > 1 ? 's' : ''}{n >= total - 3 && n <= total ? ' · bientôt terminée' : ''}</small></>
            : <small className="muted">En continu · {taken} prise{taken > 1 ? 's' : ''}</small>}
          <div className="week-dots">{week.map((d) => <span key={d} className={(done[d] ? 'on' : '') + (d === today ? ' today' : '')}>{new Date(d + 'T12:00:00').getDate()}</span>)}</div>
          <button className="link-btn small" onClick={() => void onUpdate(e, { ...e.data, remind: e.data.remind === false })}><Bell size={12} /> {e.data.remind === false ? 'Rappel désactivé' : 'Rappel à ' + String(e.data.time || '08:00')}</button>
        </div>
        <button className="icon-btn" aria-label={'Supprimer ' + e.title} onClick={() => { if (confirm('Supprimer « ' + e.title + ' » ?')) void onRemove(e); }}><Trash2 size={16} /></button>
      </article></SwipeRow>; })}</div>

    {adding ? <section className="ritual-card form-stack">
      <p className="ritual-label">Nouveau complément</p>
      <label>Nom<input list="supp-list" value={name} maxLength={80} placeholder="Vitamine D, Forcapil…" onChange={(e) => setName(e.target.value)} /></label>
      <datalist id="supp-list">{SUGGESTIONS.map((s) => <option key={s} value={s} />)}</datalist>
      <div className="chip-row">{SUGGESTIONS.slice(0, 8).map((s) => <button key={s} className={'chip' + (name === s ? ' on' : '')} onClick={() => setName(s)}>{s}</button>)}</div>
      <label>Dose<input value={dose} maxLength={60} onChange={(e) => setDose(e.target.value)} placeholder="1 gélule, 2 comprimés, 10 gouttes…" /></label>
      <div><span className="label-strong">Moment</span>
        <div className="chip-row">{MOMENTS.map((m) => <button key={m.label} className={'chip' + (time === m.time ? ' on' : '')} onClick={() => setTime(m.time)}>{m.label}</button>)}
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="time-inline" aria-label="Heure du rappel" /></div></div>
      <div className="two-inputs">
        <label>Début<input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></label>
        <label>Durée de la cure<select value={days} onChange={(e) => setDays(e.target.value)}>
          {['7', '14', '30', '60', '90', '120', '180'].map((d) => <option key={d} value={d}>{d} jours</option>)}<option value="continu">En continu</option></select></label>
      </div>
      <label>Note (facultatif)<input value={note} maxLength={120} onChange={(e) => setNote(e.target.value)} placeholder="Pendant le repas, avec un verre d’eau…" /></label>
      <p className="muted small">Tu recevras une notification à l’heure choisie tant que la prise du jour n’est pas cochée.</p>
      <div className="button-group"><button className="button primary" disabled={busy || !name.trim()} onClick={() => void add()}>Ajouter</button>
        {list.length > 0 && <button className="button ghost" onClick={() => setAdding(false)}>Annuler</button>}</div>
    </section> : <button className="button secondary wide" onClick={() => setAdding(true)}><Plus size={16} /> Ajouter un complément</button>}

    {ended.length > 0 && <section><h3 className="habit-group">Cures terminées</h3>
      {ended.map((e) => <div key={e.id} className="goal-done"><Check size={16} /> <span>{e.title} · {Number(e.data.days)} jours</span>
        <button className="link-btn small" onClick={() => void onUpdate(e, { ...e.data, start: today, done: {} })}>Recommencer</button></div>)}</section>}
  </div>;
}
