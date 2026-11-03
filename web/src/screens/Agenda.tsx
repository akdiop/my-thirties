import { QuickAdd } from '../features/QuickAdd';
import { useState } from 'react';
import { ChevronDown, Plus, Search } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { iso, parseDay, plusDays, timeline, todayIso, weekday, isDoneOn, toggledData } from '../lib/day';
import { CalendarBoard } from '../features/CalendarBoard';
import { Check22, Segmented } from '../ui/kit';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const TONE_BG = { caramel: '#F3EBE2', chocolat: '#EFE3DA', sauge: '#E6ECE8', or: '#F3EBE2' } as const;
const TONE_BAR = { caramel: '#C9A08C', chocolat: '#8C6257', sauge: '#6F8A80', or: '#D8B69F' } as const;

export function Agenda({ entries, onAdd, onOpen, onUpdate, onCreate, embedded }: {
  onImported?: () => void; embedded?: boolean; onCreate?: (i: EntryInput) => Promise<void>; entries: Entry[]; onAdd: () => void; onOpen: (e: Entry) => void; onUpdate: (entry: Entry, data: Record<string, unknown>) => Promise<void>;
}) {
  const [mode, setMode] = useState<'day' | 'week' | 'month'>('week');
  const [selected, setSelected] = useState(todayIso());
  const [query, setQuery] = useState<string | null>(null);
  const sel = parseDay(selected);
  const monday = plusDays(sel, -weekday(sel));
  const week = Array.from({ length: 7 }, (_, i) => plusDays(monday, i));
  const items = timeline(entries, sel);
  const found = query ? entries.filter((e) => e.title.toLowerCase().includes(query.toLowerCase())).slice(0, 20) : [];
  const month = sel.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return <div className={embedded ? 'embedded' : 'screen'}>
    {!embedded && <header className="tab-head row">
      <h1>Agenda</h1>
      <div className="head-actions">
        <button className="icon-btn" aria-label="Rechercher" onClick={() => setQuery(query === null ? '' : null)}><Search size={22} /></button>
        <button className="icon-btn" aria-label="Ajouter" onClick={onAdd}><Plus size={24} /></button>
      </div>
    </header>}
    {onCreate && query === null && <QuickAdd onCreate={onCreate} />}
    {query !== null && <input className="search-field" autoFocus placeholder="Rechercher un événement, une tâche…" value={query} onChange={(e) => setQuery(e.target.value)} />}
    {query ? <div className="stack-8">{found.length ? found.map((e) => <button key={e.id} className="row-plain" onClick={() => onOpen(e)}>{e.title}<small>{e.entry_date ? new Date(e.entry_date + 'T12:00:00').toLocaleDateString('fr-FR') : ''}</small></button>) : <p className="muted">Aucun résultat.</p>}</div> : <>
      <label className="month-pick">{month.charAt(0).toUpperCase() + month.slice(1)} <ChevronDown size={16} />
        <input type="date" value={selected} onChange={(e) => e.target.value && setSelected(e.target.value)} aria-label="Choisir une date" />
      </label>
      <Segmented label="Vue" value={mode} onChange={setMode} options={[{ value: 'day', label: 'Jour' }, { value: 'week', label: 'Semaine' }, { value: 'month', label: 'Mois' }]} />
      {mode === 'month' ? <CalendarBoard entries={entries.filter((e) => e.module === 'quotidien')} onUpdate={onUpdate} /> : <>
        {mode === 'week' && <div className="week-strip">{week.map((d, i) => {
          const key = iso(d);
          const has = timeline(entries, d).length > 0;
          return <button key={key} className={'week-day' + (key === selected ? ' on' : '') + (key === todayIso() ? ' today' : '')} onClick={() => setSelected(key)}>
            <span>{DAYS[i]}</span><strong>{d.getDate()}</strong><i style={{ background: has ? '#C9A08C' : 'transparent' }} />
          </button>;
        })}</div>}
        {mode === 'day' && <p className="day-title">{sel.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>}
        <div className="timeline">{items.length ? items.map((t) => {
          const task = t.entry.kind === 'task' || t.entry.kind === 'routine';
          const done = task && isDoneOn(t.entry, selected);
          return <div className="tl-row" key={t.id}>
            <span className="tl-time">{t.time || ''}</span>
            <div className="tl-block" style={{ background: TONE_BG[t.tone] }}>
              <span className="tl-bar" style={{ background: TONE_BAR[t.tone] }} />
              <button className="tl-text" onClick={() => onOpen(t.entry)}><strong className={done ? 'done' : ''}>{t.title}</strong><small>{t.sub}</small></button>
              {task && <Check22 checked={done} label={t.title} onChange={(v) => void onUpdate(t.entry, toggledData(t.entry, selected, v))} />}
            </div>
          </div>;
        }) : <p className="muted center">Rien de prévu ce jour-là.</p>}</div>
      </>}
    </>}
    {!embedded && <button className="fab" aria-label="Nouvel événement" onClick={onAdd}><Plus size={26} /></button>}
  </div>;
}
