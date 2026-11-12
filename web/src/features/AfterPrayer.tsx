import { useState } from 'react';
import { Check } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { AFTER_KIND, afterProgress, lastPrayer, PRAYERS, SOURCE, type AfterData, type Prayer } from '../lib/afterPrayer';
import { bilanDay } from '../lib/day';
import { prayerDay } from '../lib/wellbeing';
import { DaySwitch } from './DaySwitch';
import { Bar } from '../ui/kit';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };

export const afterEntry = (entries: Entry[], day: string) => entries.find((e) => e.kind === AFTER_KIND && e.entry_date === day);
export const currentAfterPrayer = (entries: Entry[]) => lastPrayer(prayerDay(entries)?.times ?? [], nowMin());

/** Après la prière : chaque invocation avec son nombre de répétitions, à cocher en comptant. */
export function AfterPrayer({ entries, onCreate, onUpdate }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save }) {
  const [day, setDay] = useState(bilanDay);
  const [prayer, setPrayer] = useState<Prayer>(() => currentAfterPrayer(entries));
  const entry = afterEntry(entries, day);
  const data = (entry?.data ?? {}) as AfterData;
  const { items, done, complete, total } = afterProgress(data, prayer);
  const set = (id: string, n: number) => {
    const next = { ...(data.done ?? {}), [prayer]: { ...done, [id]: Math.max(0, n) } };
    return entry ? onUpdate(entry, { ...entry.data, done: next })
      : onCreate({ module: 'spiritualite', kind: AFTER_KIND, title: 'Après la prière · ' + day, entry_date: day, data: { date: day, done: next } });
  };
  return <section className="stack-8 after-prayer">
    <DaySwitch day={day} onChange={setDay} />
    <div className="chip-row">{PRAYERS.map((p) => { const pr = afterProgress(data, p);
      return <button key={p} className={'chip' + (p === prayer ? ' on' : '')} aria-pressed={p === prayer} onClick={() => setPrayer(p)}>{p}{pr.complete === pr.total ? ' · fait' : pr.complete ? ' · ' + pr.complete + '/' + pr.total : ''}</button>; })}</div>
    <div className="soft-card"><p className="ritual-label">Après {prayer} · {complete}/{total}</p><Bar value={complete / total} /></div>
    {items.map((d) => { const target = d.times(prayer), n = done[d.id] ?? 0, ok = n >= target;
      return <article key={d.id} className={'soft-card after-item' + (ok ? ' done' : '')}>
        <p className="dua-ar" lang="ar" dir="rtl">{d.arabic}</p>
        <em className="after-ph">{d.phonetic}</em>
        <p className="muted small">{d.french}{d.note ? ' ' + d.note : ''}</p>
        <div className="after-count">
          <button className={'after-tap' + (ok ? ' done' : '')} aria-label={d.phonetic + ', ' + n + ' sur ' + target} onClick={() => void set(d.id, ok ? 0 : n + 1)}>
            {ok ? <><Check size={18} strokeWidth={3} /> {target > 1 ? target + ' fois' : 'Récité'}</> : target > 1 ? n + ' / ' + target : 'Récité ?'}</button>
          {!ok && target > 3 && <button className="chip" onClick={() => void set(d.id, target)}>Tout ({target})</button>}
        </div>
      </article>; })}
    <p className="fineprint">D’après la {SOURCE.charAt(0).toLowerCase() + SOURCE.slice(1)}.</p>
  </section>;
}
