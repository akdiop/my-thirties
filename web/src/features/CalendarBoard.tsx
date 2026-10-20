import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Entry } from '../lib/cloud';

type Props = {
  entries: Entry[];
  onUpdate: (entry: Entry, data: Record<string, unknown>) => Promise<void>;
};

const dateKey = (d: Date) => [
  d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0'),
].join('-');

export function CalendarBoard({ entries, onUpdate }: Props) {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selected, setSelected] = useState(() => dateKey(new Date()));
  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    return Array.from({ length: 42 }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i - offset + 1));
  }, [month]);
  const byDay = useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const entry of entries) {
      if (!entry.entry_date) continue;
      const group = map.get(entry.entry_date) ?? [];
      group.push(entry); map.set(entry.entry_date, group);
    }
    return map;
  }, [entries]);
  const selectedEntries = byDay.get(selected) ?? [];
  const shift = (delta: number) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  return <section className="calendar-panel">
    <div className="calendar-head">
      <h3>{month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</h3>
      <div><button className="icon-button" onClick={() => shift(-1)} aria-label="Mois précédent"><ChevronLeft size={19} /></button>
        <button className="icon-button" onClick={() => shift(1)} aria-label="Mois suivant"><ChevronRight size={19} /></button></div>
    </div>
    <div className="calendar-grid" role="group" aria-label="Calendrier mensuel">
      {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((w, i) => <span className="weekday" key={i}>{w}</span>)}
      {days.map((day) => {
        const key = dateKey(day);
        const count = byDay.get(key)?.length ?? 0;
        return <button key={key} onClick={() => setSelected(key)} className={'calendar-cell ' +
          (day.getMonth() === month.getMonth() ? '' : 'other-month ') +
          (key === selected ? 'selected ' : '') + (key === dateKey(new Date()) ? 'today' : '')}
          aria-label={day.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) + (count ? ' : ' + count + ' éléments' : '')}>
          {day.getDate()}{count > 0 && <span className="calendar-dot" />}
        </button>;
      })}
    </div>
    <div className="calendar-agenda">
      <h4>{new Date(selected + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</h4>
      {selectedEntries.length ? selectedEntries.map((entry) => {
        const done = entry.data.completed === true;
        return <div className="calendar-agenda-item" key={entry.id}>
          {entry.kind === 'task' ? <label className="checklist-item"><input type="checkbox" checked={done}
            onChange={(e) => void onUpdate(entry, { ...entry.data, completed: e.target.checked })} />
            <span className={done ? 'checked' : ''}>{entry.title}</span></label> : <strong>{entry.title}</strong>}
          {typeof entry.data.time === 'string' && <small>{entry.data.time}</small>}
        </div>;
      }) : <p className="muted">Aucun élément prévu pour cette date.</p>}
    </div>
  </section>;
}
