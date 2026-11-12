import { useState } from 'react';
import { ChevronDown, Moon, Sparkles, Sun } from 'lucide-react';
import type { Entry } from '../lib/cloud';
import { bilanDay, isDoneOn, timeline, todayIso, toggledData } from '../lib/day';
import { DaySwitch, dayName } from './DaySwitch';
import { habitDone, habitFreq, habitScheduled } from '../lib/rituals';
import { Check22, Bar } from '../ui/kit';

const PRAYERS = new Set(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']);
type Item = { key: string; time: string; title: string; sub?: string; kind: 'prayer' | 'event' | 'habits'; done: boolean; toggle?: (on: boolean) => void; open?: () => void };
const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
const inText = (m: number) => m >= 60 ? 'dans ' + Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0') : 'dans ' + m + ' min';

/**
 * Accueil · « Aujourd'hui » : une seule ligne du temps (prières, rendez-vous, habitudes).
 * Compacte par défaut (les 3 prochaines choses) ; « Toute ma journée » déroule le reste.
 */
export function TodayCard({ entries, habits, onUpdate, onTogglePrayer, onOpenHabits, onOpenAgenda }: {
  entries: Entry[]; habits: Entry[]; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void>;
  onTogglePrayer: (name: string, on: boolean, day: string) => void; onOpenHabits: () => void; onOpenAgenda: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState(bilanDay);
  const past = day !== todayIso();
  const now = past ? new Date(day + 'T23:59:00') : new Date(), nowMin = now.getHours() * 60 + now.getMinutes();
  const prayed = new Set(entries.filter((e) => e.kind === 'prayer' && e.entry_date === day).map((e) => String(e.data.prayer)));
  const items: Item[] = timeline(entries, now)
    .filter((t) => /^\d{2}:\d{2}/.test(t.time) && (PRAYERS.has(t.title) && t.sub === 'Ma spiritualité' || (t.entry.module === 'quotidien' && ['event', 'task'].includes(t.entry.kind))))
    .map((t) => PRAYERS.has(t.title) && t.sub === 'Ma spiritualité'
      ? { key: t.id, time: t.time.slice(0, 5), title: t.title, kind: 'prayer' as const, done: prayed.has(t.title), toggle: (on: boolean) => onTogglePrayer(t.title, on, day) }
      : { key: t.id, time: t.time.slice(0, 5), title: t.title, sub: t.entry.kind === 'task' ? 'tâche' : String(t.entry.data.location ?? ''), kind: 'event' as const,
          done: isDoneOn(t.entry, day), toggle: (on: boolean) => void onUpdate(t.entry, toggledData(t.entry, day, on)) });
  const daily = habits.filter((h) => habitFreq(h) === 'daily' && habitScheduled(h, day));
  const left = daily.filter((h) => !habitDone(h)[day]);
  if (daily.length) items.push({ key: 'habits', time: '19:00', title: left.length ? left.length + ' habitude' + (left.length > 1 ? 's' : '') + ' à faire' : 'Habitudes du jour faites', sub: left.slice(0, 3).map((h) => h.title).join(' · '), kind: 'habits', done: !left.length, open: onOpenHabits });
  items.sort((a, b) => a.time.localeCompare(b.time));

  const prayers = items.filter((i) => i.kind === 'prayer');
  const events = items.filter((i) => i.kind === 'event');
  // La prière en cours (heure passée, pas encore cochée) reste en tête, puis ce qui vient.
  const current = [...prayers].reverse().find((p) => toMin(p.time) <= nowMin);
  const nextPrayer = prayers.find((p) => toMin(p.time) > nowMin);
  const upcoming = [...(current && !current.done ? [current] : []), ...items.filter((i) => toMin(i.time) > nowMin && !i.done && i !== current)].slice(0, 3);
  const shown = open || past ? items : upcoming;
  const checkable = items.filter((i) => i.toggle || i.kind === 'habits'), doneCount = checkable.filter((i) => i.done).length;
  const nextUp = past ? undefined : items.find((i) => !i.done && toMin(i.time) >= nowMin && i.kind !== 'habits');
  const nowIndex = items.findIndex((i) => toMin(i.time) > nowMin);

  const row = (i: Item) => <div key={i.key} className={'today-row' + (i.done ? ' done' : '') + (i === nextPrayer && !past ? ' next' : '')}>
    <span className="today-time">{i.time}</span>
    <span className={'today-dot ' + i.kind} aria-hidden="true">{i.kind === 'prayer' ? (toMin(i.time) >= 18 * 60 || toMin(i.time) < 6 * 60 + 30 ? <Moon size={14} /> : <Sun size={14} />) : i.kind === 'habits' ? <Sparkles size={14} /> : null}</span>
    {i.open ? <button className="today-label" onClick={i.open}>    <strong>{i.title}</strong>
      {i === nextPrayer && !past ? <small>{inText(toMin(i.time) - nowMin)}</small> : i.sub ? <small>{i.sub}</small> : null}</button> : <span className="today-label">    <strong>{i.title}</strong>
      {i === nextPrayer && !past ? <small>{inText(toMin(i.time) - nowMin)}</small> : i.sub ? <small>{i.sub}</small> : null}</span>}
    {i.toggle ? <Check22 checked={i.done} label={i.title + (i.done ? ' fait' : ' à faire')} onChange={i.toggle} /> : <span className="check-spacer" />}
  </div>;

  return <section className="today-card">
    <DaySwitch day={day} onChange={(d) => { setDay(d); setOpen(false); }} />
    <div className="today-head"><strong>Ma journée</strong>
      <span className="today-chips">
        {prayers.length > 0 && <span className="tchip sauge">{prayers.filter((p) => p.done).length}/{prayers.length} prières</span>}
        {daily.length > 0 && <span className="tchip rose">{daily.length - left.length}/{daily.length} habitudes</span>}
        {events.length > 0 && <span className="tchip lilas">{events.length} rdv</span>}
      </span></div>
    {checkable.length > 0 && <div className="today-progress"><span><strong>{doneCount}</strong> sur {checkable.length} {doneCount > 1 ? 'faits' : 'fait'}</span><Bar value={doneCount / checkable.length} /></div>}
    {nextUp && <div className="today-next"><small>À suivre</small><strong>{nextUp.title}</strong><span>{nextUp.time}{nextUp.kind === 'prayer' ? ' · ' + inText(toMin(nextUp.time) - nowMin) : nextUp.sub ? ' · ' + nextUp.sub : ''}</span></div>}
    {!items.length ? <p className="day-empty">Rien de prévu pour l’instant. Une journée à ton rythme.</p>
      : !shown.length ? <p className="day-empty">{doneCount < checkable.length && !past ? 'Plus rien de prévu d’ici ce soir.' : 'Tout est fait pour ' + dayName(day) + ', macha’Allah.'}</p>
      : <div className="today-list">{shown.map((i, k) => <div key={i.key}>{open && !past && k === nowIndex && <div className="today-now">{String(now.getHours()).padStart(2, '0')}:{String(now.getMinutes()).padStart(2, '0')} · maintenant</div>}{row(i)}</div>)}</div>}
    <div className="today-foot">
      {!past && (items.length > shown.length || open) ? <button className="link-btn small" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Réduire' : 'Toute ma journée'} <ChevronDown size={14} className={open ? 'flip' : ''} /></button> : <span />}
      <button className="link-btn small" onClick={onOpenAgenda}>Agenda ›</button></div>
  </section>;
}
