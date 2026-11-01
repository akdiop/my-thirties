import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import type { Entry } from '../lib/cloud';
import { boosterDay } from '../lib/boosterDays';

export function BoosterPlan({ entry, onUpdate }: {
  entry: Entry;
  onUpdate: (entry: Entry, data: Record<string, unknown>) => Promise<void>;
}) {
  const days = [7, 14, 30].includes(Number(entry.data.days)) ? Number(entry.data.days) : 30;
  const axis = String(entry.data.axis || 'Mon équilibre');
  const progress = (entry.data.progress && typeof entry.data.progress === 'object'
    ? entry.data.progress : {}) as Record<string, boolean>;
  const notes = (entry.data.notes && typeof entry.data.notes === 'object'
    ? entry.data.notes : {}) as Record<string, string>;
  const completed = Object.values(progress).filter(Boolean).length;
  const firstOpen = Array.from({ length: days }, (_, i) => i + 1).find((d) => !progress[String(d)]) ?? days;
  const [day, setDay] = useState(firstOpen);
  const [text, setText] = useState(notes[String(day)] ?? '');
  useEffect(() => { setText(notes[String(day)] ?? ''); }, [day]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async (extra: Record<string, unknown> = {}) => onUpdate(entry, {
    ...entry.data, notes: { ...notes, [day]: text }, ...extra,
  });
  // Enregistrement automatique pendant l'écriture.
  useEffect(() => {
    if ((notes[String(day)] ?? '') === text) return;
    const t = setTimeout(() => void save(), 900);
    return () => clearTimeout(t);
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

  const done = Boolean(progress[String(day)]);
  const p = boosterDay(axis, day);
  const week = Math.ceil(day / 7);

  return <div className="booster-panel">
    <p className="muted">Programme : {axis} · {days} jours</p>
    <div className="progress-track"><div style={{ width: (completed / days * 100) + '%' }} /></div>
    <div className="booster-grid">{Array.from({ length: days }, (_, i) => {
      const d = i + 1;
      const isDone = Boolean(progress[String(d)]);
      return <button key={d} className={'booster-day' + (isDone ? ' done' : '') + (d === day ? ' current' : '') + (notes[String(d)] ? ' written' : '')}
        onClick={() => setDay(d)} aria-pressed={d === day} aria-label={'Jour ' + d + (isDone ? ', accompli' : '')}>
        {isDone ? <Check size={14} /> : d}
      </button>;
    })}</div>

    <section className="booster-today">
      <span className="eyebrow">JOUR {day}{days > 7 ? ' · SEMAINE ' + week : ''}</span>
      <h3>{p.titre}</h3>
      <p className="booster-advice">{p.conseil}</p>
      <label className="booster-write">
        <span>{p.question}</span>
        <textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder="Écris ici, librement…" />
      </label>
      <button className={'button ' + (done ? 'secondary' : 'primary')}
        onClick={() => void save({ progress: { ...progress, [day]: !done } }).then(() => { if (!done && day < days) setDay(day + 1); })}>
        {done ? 'Marquer comme non fait' : 'J’ai fait ce jour'}
      </button>
    </section>
    <p className="fineprint">{completed} / {days} jours faits. Un jour manqué n’efface rien : reprends où tu veux.</p>
  </div>;
}
