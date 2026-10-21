import { useMemo, useState } from 'react';
import type { Entry } from '../lib/cloud';
import { downloadCalendar } from '../lib/calendar';

type Props = { entries: Entry[]; onUpdate: (entry: Entry, data: Record<string, unknown>) => Promise<void> };
const iso = (d: Date) => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
const plusDays = (date: Date, n: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
const parse = (s: string) => new Date(s + 'T12:00:00');
const dayOfWeek = (d: Date) => (d.getDay() + 6) % 7;
const labelDate = (d: Date) => d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });

function occurs(entry: Entry, date: Date): boolean {
  if (entry.module !== 'quotidien') return false;
  const key = iso(date);
  const frequency = String(entry.data.frequency || '');
  const origin = entry.entry_date || String(entry.data.date || '');
  if (!origin) return entry.kind === 'routine' && frequency === 'Quotidienne';
  if (frequency === 'Quotidienne' && key >= origin) return true;
  if (frequency === 'Hebdomadaire' && key >= origin && dayOfWeek(parse(origin)) === dayOfWeek(date)) return true;
  return origin === key;
}

function CalendarRow({ entry, day, onUpdate }: { entry: Entry; day: Date; onUpdate: Props['onUpdate'] }) {
  const date = iso(day);
  const recurring = entry.kind === 'routine' || ['Quotidienne', 'Hebdomadaire'].includes(String(entry.data.frequency || ''));
  const completed = recurring
    ? entry.data.completions && typeof entry.data.completions === 'object' && (entry.data.completions as Record<string, boolean>)[date] === true
    : entry.data.completed === true;
  const toggle = (next: boolean) => {
    const completions = entry.data.completions && typeof entry.data.completions === 'object'
      ? entry.data.completions as Record<string, boolean> : {};
    return onUpdate(entry, recurring ? { ...entry.data, completions: { ...completions, [date]: next } } : { ...entry.data, completed: next });
  };
  return <div className="calendar-agenda-item">
    {entry.kind === 'task' || entry.kind === 'routine'
      ? <label className="checklist-item"><input type="checkbox" checked={Boolean(completed)} onChange={(e) => void toggle(e.target.checked)} />
        <span className={completed ? 'checked' : ''}>{entry.title}</span></label>
      : <strong>{entry.title}</strong>}
    {typeof entry.data.time === 'string' && <small>{entry.data.time}</small>}
  </div>;
}

export function CalendarBoard({ entries, onUpdate }: Props) {
  const [mode, setMode] = useState<'day' | 'week' | 'month'>('month');
  const [selected, setSelected] = useState(() => iso(new Date()));
  const selectedDate = parse(selected);
  const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const start = mode === 'month'
    ? plusDays(monthStart, -dayOfWeek(monthStart))
    : mode === 'week' ? plusDays(selectedDate, -dayOfWeek(selectedDate)) : selectedDate;
  const count = mode === 'month' ? 42 : mode === 'week' ? 7 : 1;
  const days = useMemo(() => Array.from({ length: count }, (_, i) => plusDays(start, i)), [count, iso(start)]);
  const selectedEntries = entries.filter((e) => occurs(e, selectedDate))
    .sort((a, b) => String(a.data.time || '').localeCompare(String(b.data.time || '')));
  const shift = (direction: number) => {
    const next = mode === 'month' ? new Date(selectedDate.getFullYear(), selectedDate.getMonth() + direction, Math.min(selectedDate.getDate(), 28))
      : plusDays(selectedDate, direction * (mode === 'week' ? 7 : 1));
    setSelected(iso(next));
  };
  return <section className="calendar-panel">
    <div className="calendar-head">
      <h3>{mode === 'month' ? monthStart.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
        : mode === 'week' ? 'Semaine du ' + labelDate(start) : labelDate(selectedDate)}</h3>
      <div><button className="icon-button" onClick={() => shift(-1)} aria-label="Période précédente">‹</button>
        <button className="icon-button" onClick={() => setSelected(iso(new Date()))}>Aujourd'hui</button>
        <button className="icon-button" onClick={() => shift(1)} aria-label="Période suivante">›</button></div>
    </div>
    <div className="calendar-export"><button className="button secondary" onClick={() => downloadCalendar(entries)} disabled={!entries.some((e) => e.entry_date)}>Exporter mon agenda (.ics)</button></div>
    <div className="calendar-modes" role="group" aria-label="Affichage de l'agenda">
      {([['day', 'Jour'], ['week', 'Semaine'], ['month', 'Mois']] as const).map(([id, label]) =>
        <button key={id} className={mode === id ? 'active' : ''} onClick={() => setMode(id)} aria-pressed={mode === id}>{label}</button>)}
    </div>
    <div className={'calendar-grid ' + (mode === 'day' ? 'calendar-single' : '')} role="group" aria-label="Calendrier">
      {mode !== 'day' && ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((w, i) => <span className="weekday" key={i}>{w}</span>)}
      {days.map((day) => {
        const key = iso(day);
        const count = entries.filter((e) => occurs(e, day)).length;
        return <button key={key} onClick={() => setSelected(key)} className={'calendar-cell ' +
          (mode === 'month' && day.getMonth() !== monthStart.getMonth() ? 'other-month ' : '') +
          (key === selected ? 'selected ' : '') + (key === iso(new Date()) ? 'today' : '')}
          aria-label={labelDate(day) + (count ? ' : ' + count + ' éléments' : '')}>
          {day.getDate()}{count > 0 && <span className="calendar-dot" />}
        </button>;
      })}
    </div>
    <div className="calendar-agenda">
      <h4>{selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</h4>
      {selectedEntries.length ? selectedEntries.map((entry) => <CalendarRow key={entry.id} entry={entry} day={selectedDate} onUpdate={onUpdate} />)
        : <p className="muted">Aucun élément prévu pour cette date.</p>}
    </div>
  </section>;
}
