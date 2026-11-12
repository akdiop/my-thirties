import { Glyph } from '../ui/Glyph';
import { Dictate, appendText } from '../ui/Dictate';
import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { isDoneOn, toggledData } from '../lib/day';
import { activeHabits, addDays, affirmationOf, DAILY_KIND, habitDone, isoOf, MOODS, toggleData } from '../lib/rituals';
import { saveLabel, useAutosave } from '../lib/autosave';
import { eveningQuestion } from '../lib/growth';
import { Check22, Segmented } from '../ui/kit';
import { EveningCoach, RELANCES, type Coach } from '../features/EveningCoach';

type Part = 'matin' | 'soir';
type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
const three = (v: unknown) => { const a = Array.isArray(v) ? v.map(String) : []; return [a[0] ?? '', a[1] ?? '', a[2] ?? '']; };
const frDay = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

/** Mon jour : journal du matin (humeur, intention, priorités, to-do, gratitudes, self-care) et débriefing du soir. */
export function MyDay({ entries, initialDate, initialPart, onCreate, onUpdate }: {
  entries: Entry[]; initialDate?: string; initialPart?: Part;
  onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save;
}) {
  const today = isoOf(new Date());
  const [date, setDate] = useState(initialDate ?? today);
  const [part, setPart] = useState<Part>(initialPart ?? (new Date().getHours() >= 18 ? 'soir' : 'matin'));
  const entry = entries.find((e) => e.kind === DAILY_KIND && e.entry_date === date);
  return <div className="screen myday">
    <header className="tab-head myday-head">
      <div><h1>Mon jour</h1><p className="cap">{frDay(date)}</p></div>
      <div className="day-nav">
        <button className="icon-btn" aria-label="Jour précédent" onClick={() => setDate(addDays(date, -1))}><ChevronLeft size={20} /></button>
        <button className="icon-btn" aria-label="Jour suivant" disabled={date >= today} onClick={() => setDate(addDays(date, 1))}><ChevronRight size={20} /></button>
      </div>
    </header>
    <Segmented label="Moment" value={part} onChange={setPart} options={[{ value: 'matin', label: 'Matin' }, { value: 'soir', label: 'Débriefing du soir' }]} />
    <DayForm key={date} date={date} part={part} entry={entry} entries={entries} onCreate={onCreate} onUpdate={onUpdate} />
  </div>;
}

function DayForm({ date, part, entry, entries, onCreate, onUpdate }: { date: string; part: Part; entry: Entry | undefined; entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save }) {
  const init = (k: string) => entry?.data[k];
  const [mood, setMood] = useState(String(init('mood') ?? ''));
  const [intention, setIntention] = useState(String(init('intention') ?? ''));
  const [prios, setPrios] = useState(three(init('priorities')));
  const [grats, setGrats] = useState(three(init('gratitudes')));
  const [selfcare, setSelfcare] = useState(String(init('selfcare') ?? ''));
  const [win, setWin] = useState(String(init('win') ?? ''));
  const [different, setDifferent] = useState(String(init('different') ?? ''));
  const [letgo, setLetgo] = useState(String(init('letgo') ?? ''));
  const [tomorrow, setTomorrow] = useState(String(init('tomorrow') ?? ''));
  const [answer, setAnswer] = useState(String(init('answer') ?? ''));
  const [coach, setCoach] = useState<Coach | null>(() => { const c = init('coach') as Coach | undefined; return c && Array.isArray(c.pistes) ? c : null; });
  const question = typeof entry?.data.question === 'string' && entry.data.question ? entry.data.question : eveningQuestion(date);
  const [touched, setTouched] = useState(false);
  const t = <A,>(f: (v: A) => void) => (v: A) => { f(v); setTouched(true); };

  const draft = useMemo(() => touched ? { date, mood, intention, priorities: prios, gratitudes: grats, selfcare, win, different, letgo, tomorrow, ...(answer ? { question, answer } : {}), ...(coach ? { coach } : {}) } : null,
    [touched, date, mood, intention, prios, grats, selfcare, win, different, letgo, tomorrow, answer, question, coach]);
  const state = useAutosave(entry, draft,
    () => onCreate({ module: 'equilibre', kind: DAILY_KIND, title: 'Mon jour · ' + date, entry_date: date, data: draft! }), onUpdate);

  const yesterday = entries.find((e) => e.kind === DAILY_KIND && e.entry_date === addDays(date, -1));
  const plannedYesterday = typeof yesterday?.data.tomorrow === 'string' ? yesterday.data.tomorrow : '';

  return <div className="myday-form">
    {part === 'matin' ? <>
      <section className="ritual-card"><p className="ritual-label">Comment te sens-tu ?</p>
        <div className="mood5">{MOODS.map((m) => <button key={m.value} className={mood === m.value ? 'on' : ''} aria-pressed={mood === m.value} onClick={() => t(setMood)(mood === m.value ? '' : m.value)}>
          <Glyph name={m.icon} tint={m.tint} size={22} badge={46} /><small>{m.value}</small></button>)}</div></section>

      <section className="ritual-card accent"><p className="ritual-label"><Glyph name="target" tint="terre" /> Mon intention du jour</p>
        {!intention && plannedYesterday && <button className="link-btn" onClick={() => t(setIntention)(plannedYesterday)}>Reprendre celle d’hier soir : « {plannedYesterday} »</button>}
        <textarea rows={2} value={intention} placeholder="Quelle énergie veux-tu donner à ta journée ?" onChange={(e) => t(setIntention)(e.target.value)} /><Dictate onText={(x) => t(setIntention)(appendText(intention, x))} /></section>

      <section><p className="ritual-label">Mes 3 priorités</p>
        {prios.map((p, i) => <input key={i} className="soft-input" value={p} placeholder={'Priorité ' + (i + 1)} onChange={(e) => t(setPrios)(prios.map((x, j) => j === i ? e.target.value : x))} />)}</section>

      <TodoToday date={date} entries={entries} onCreate={onCreate} onUpdate={onUpdate} />

      <section><p className="ritual-label"><Glyph name="handHeart" tint="rose" /> 3 gratitudes</p>
        {grats.map((g, i) => <input key={i} className="soft-input" value={g} placeholder={'Gratitude ' + (i + 1)} onChange={(e) => t(setGrats)(grats.map((x, j) => j === i ? e.target.value : x))} />)}</section>

      <section><p className="ritual-label"><Glyph name="leaf" tint="sauge" /> Mon moment pour moi</p>
        <textarea className="soft-input" rows={2} value={selfcare} placeholder="Qu’est-ce que tu fais pour toi aujourd’hui ?" onChange={(e) => t(setSelfcare)(e.target.value)} /></section>

      <div className="affirm-inline"><Glyph name="sparkles" tint="or" /> <em>{affirmationOf(date)}</em></div>
    </> : <>
      <section><p className="ritual-label">Ma victoire du jour (même petite)</p>
        <textarea className="soft-input" rows={3} value={win} placeholder="Même un petit pas compte…" onChange={(e) => t(setWin)(e.target.value)} /><Dictate onText={(x) => t(setWin)(appendText(win, x))} /></section>
      <section><p className="ritual-label">Ce que je ferais autrement</p>
        <textarea className="soft-input" rows={3} value={different} placeholder="Sans jugement, juste une leçon…" onChange={(e) => t(setDifferent)(e.target.value)} /></section>
      <section className="ritual-card question-card"><p className="ritual-label">La question du soir</p>
        <p className="evening-q">{question}</p>
        <textarea className="soft-input" rows={3} value={answer} placeholder="Réponds librement…" onChange={(e) => t(setAnswer)(e.target.value)} /><Dictate onText={(x) => t(setAnswer)(appendText(answer, x))} />
        {answer.trim() && <div className="relances"><small className="muted">Pour aller plus loin</small>
          <div className="chip-row">{RELANCES.map((r) => <button key={r} className="chip" disabled={answer.includes(r)} onClick={() => t(setAnswer)(answer.trimEnd() + '\n' + r + ' ')}>{r}</button>)}</div></div>}</section>
      <section><p className="ritual-label">Ce que je dépose ce soir</p>
        <textarea className="soft-input" rows={3} value={letgo} placeholder="Je le pose ici pour ne plus y penser…" onChange={(e) => t(setLetgo)(e.target.value)} /><Dictate onText={(x) => t(setLetgo)(appendText(letgo, x))} /></section>
      <HabitsOfDay date={date} entries={entries} onUpdate={onUpdate} />
      <EveningCoach date={date} debrief={{ mood, win, different, question, answer, letgo }} coach={coach} onCoach={t(setCoach)} onIntention={t(setTomorrow)} onCreate={onCreate} />
      <section><p className="ritual-label">Mon intention pour demain</p>
        <textarea className="soft-input" rows={2} value={tomorrow} placeholder="Demain, je veux avant tout…" onChange={(e) => t(setTomorrow)(e.target.value)} /></section>
      <TomorrowTodos date={date} entries={entries} onCreate={onCreate} />
    </>}
    <p className="save-state" aria-live="polite">{saveLabel(state) || 'Tout s’enregistre automatiquement.'}</p>
  </div>;
}

/** To-do du jour : les tâches datées de ce jour dans Ma journée, à cocher, et ajout rapide. */
function TodoToday({ date, entries, onCreate, onUpdate }: { date: string; entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const tasks = entries.filter((e) => e.module === 'quotidien' && e.kind === 'task' && e.entry_date === date);
  const add = async () => {
    if (!text.trim()) return;
    setBusy(true);
    try { await onCreate({ module: 'quotidien', kind: 'task', title: text.trim().slice(0, 170), entry_date: date, data: { date, priority: 'Normale' } }); setText(''); }
    finally { setBusy(false); }
  };
  return <section><p className="ritual-label">Ma to-do du jour</p>
    <div className="todo-list">{tasks.map((e) => { const done = isDoneOn(e, date); return <div key={e.id} className="todo-row">
      <Check22 checked={done} label={e.title} onChange={(v) => void onUpdate(e, toggledData(e, date, v))} /><span className={done ? 'done' : ''}>{e.title}</span></div>; })}</div>
    <form className="todo-add" onSubmit={(e) => { e.preventDefault(); void add(); }}>
      <input className="soft-input" value={text} placeholder="Ajouter une tâche…" onChange={(e) => setText(e.target.value)} />
      <button className="square-btn" disabled={busy || !text.trim()} aria-label="Ajouter la tâche"><Plus size={20} /></button></form>
  </section>;
}

/** To-do de demain : les tâches écrites ici sont ajoutées à l'agenda du lendemain. */
function TomorrowTodos({ date, entries, onCreate }: { date: string; entries: Entry[]; onCreate: (i: EntryInput) => Promise<void> }) {
  const next = addDays(date, 1);
  const [lines, setLines] = useState(['', '', '']);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState('');
  useEffect(() => setDone(''), [lines]);
  const planned = entries.filter((e) => e.module === 'quotidien' && e.kind === 'task' && e.entry_date === next);
  const save = async () => {
    const list = lines.map((l) => l.trim()).filter(Boolean);
    if (!list.length) return;
    setBusy(true);
    try {
      for (const title of list) await onCreate({ module: 'quotidien', kind: 'task', title: title.slice(0, 170), entry_date: next, data: { date: next, priority: 'Normale' } });
      setLines(['', '', '']); setDone(list.length + ' tâche(s) ajoutée(s) à demain.');
    } finally { setBusy(false); }
  };
  return <section className="ritual-card"><p className="ritual-label"><Glyph name="list" tint="caramel" /> Ma to-do de demain</p>
    {planned.length > 0 && <ul className="planned">{planned.map((e) => <li key={e.id}>{e.title}</li>)}</ul>}
    {lines.map((l, i) => <div key={i} className="todo-row edit"><span className="ring" />
      <input className="soft-input" value={l} placeholder="Une tâche pour demain…" onChange={(e) => setLines(lines.map((x, j) => j === i ? e.target.value : x))} />
      {lines.length > 1 && <button className="icon-btn" aria-label="Retirer" onClick={() => setLines(lines.filter((_, j) => j !== i))}><X size={16} /></button>}</div>)}
    <button className="link-btn" onClick={() => setLines([...lines, ''])}>+ Une autre tâche</button>
    <button className="button primary wide" disabled={busy || !lines.some((l) => l.trim())} onClick={() => void save()}>{busy ? 'Ajout…' : 'Ajouter à mon agenda de demain'}</button>
    {done && <p className="muted" role="status">{done}</p>}
  </section>;
}


/** Débriefing : les habitudes du jour, à cocher sans quitter le soir. */
function HabitsOfDay({ date, entries, onUpdate }: { date: string; entries: Entry[]; onUpdate: Save }) {
  const habits = activeHabits(entries);
  if (!habits.length) return null;
  const done = habits.filter((e) => habitDone(e)[date]).length;
  return <section className="ritual-card"><p className="ritual-label"><Glyph name="sprout" tint="sauge" /> Mes habitudes du jour · {done}/{habits.length}</p>
    {habits.map((e) => { const d = habitDone(e), on = Boolean(d[date]); return <div key={e.id} className="todo-row">
      <Check22 checked={on} label={e.title} onChange={(v) => void onUpdate(e, toggleData(e, date, v))} />
      <span className={on ? 'done' : ''}>{e.title}</span></div>; })}
  </section>;
}
