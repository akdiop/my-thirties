import { useEffect, useRef, useState } from 'react';
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

  // Dernières données connues (mises à jour dès qu'on enregistre, sans attendre le rechargement).
  const dataRef = useRef(entry.data);
  useEffect(() => { dataRef.current = entry.data; }, [entry.data]);
  // Texte en attente d'enregistrement automatique, et son minuteur.
  const pending = useRef<{ day: number; text: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef({ entry, onUpdate });
  latest.current = { entry, onUpdate };

  const write = (patch: (data: Record<string, unknown>) => Record<string, unknown>) => {
    const next = patch(dataRef.current);
    dataRef.current = next;
    return latest.current.onUpdate(latest.current.entry, next);
  };
  const withNote = (data: Record<string, unknown>, d: number, t: string) => ({
    ...data, notes: { ...((data.notes && typeof data.notes === 'object' ? data.notes : {}) as Record<string, string>), [d]: t },
  });
  /** Enregistre tout de suite le texte en attente (changement de jour, sortie de l'écran, bouton « fait »). */
  const flush = () => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    const p = pending.current;
    pending.current = null;
    return p ? write((data) => withNote(data, p.day, p.text)) : Promise.resolve();
  };
  useEffect(() => () => { void flush(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onType = (value: string) => {
    setText(value);
    pending.current = { day, text: value };
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void flush(), 900);
  };
  const choose = (d: number) => {
    void flush();
    const saved = (dataRef.current.notes && typeof dataRef.current.notes === 'object' ? dataRef.current.notes : {}) as Record<string, string>;
    setDay(d);
    setText(saved[String(d)] ?? '');
  };
  const toggleDone = async () => {
    // Le texte du jour et l'état « fait » partent ensemble : aucun enregistrement en retard ne peut l'écraser.
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    pending.current = null;
    const wasDone = Boolean(((dataRef.current.progress ?? {}) as Record<string, boolean>)[String(day)]);
    await write((data) => ({
      ...withNote(data, day, text),
      progress: { ...((data.progress && typeof data.progress === 'object' ? data.progress : {}) as Record<string, boolean>), [day]: !wasDone },
    }));
    if (!wasDone && day < days) choose(day + 1);
  };

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
        onClick={() => choose(d)} aria-pressed={d === day} aria-label={'Jour ' + d + (isDone ? ', accompli' : '')}>
        {isDone ? <Check size={14} /> : d}
      </button>;
    })}</div>

    <section className="booster-today">
      <span className="eyebrow">JOUR {day}{days > 7 ? ' · SEMAINE ' + week : ''}</span>
      <h3>{p.titre}</h3>
      <p className="booster-advice">{p.conseil}</p>
      <label className="booster-write">
        <span>{p.question}</span>
        <textarea rows={5} value={text} onChange={(e) => onType(e.target.value)} placeholder="Écris ici, librement…" />
      </label>
      <button className={'button ' + (done ? 'secondary' : 'primary')}
        onClick={() => void toggleDone()}>
        {done ? 'Marquer comme non fait' : 'J’ai fait ce jour'}
      </button>
    </section>
    <p className="fineprint">{completed} / {days} jours faits. Un jour manqué n’efface rien : reprends où tu veux.</p>
  </div>;
}
