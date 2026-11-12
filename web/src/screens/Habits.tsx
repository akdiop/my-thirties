import { Glyph, type GlyphName, type Tint } from '../ui/Glyph';
import { useState } from 'react';
import { Check, Flame, Link2, Pencil, Plus, Sparkles, Trash2, Trophy, X } from 'lucide-react';
import { SwipeRow } from '../ui/SwipeRow';
import type { Entry, EntryInput } from '../lib/cloud';
import { addDays, DAY_LETTERS, FREQ_LABEL, freqTarget, HABIT_GROUPS, HABIT_KIND, HABIT_LIBRARY, habitDays, habitDaysLabel, habitDone, habitFreq, habitScheduled, habitStreak, isoOf, weekStartOf, type HabitFreq, type HabitLevel, type HabitTemplate } from '../lib/rituals';
import { Bar, Segmented } from '../ui/kit';
import { bilanDay } from '../lib/day';
import { DaySwitch, dayName } from '../features/DaySwitch';
import { badgesOf, nextBadge } from '../lib/growth';
import { JOURNEYS, JOURNEY_KIND, journeyWeek } from '../lib/journeys';

type EditFull = (id: string, patch: { title: string; data: Record<string, unknown> }) => Promise<void>;
type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
const LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

/** Habitudes : bibliothèque d'idées, habitudes personnelles, coche du jour, série et semaine en cours. */
export function Habits({ entries, onCreate, onUpdate, onRemove, onEdit }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; onRemove: (e: Entry) => Promise<void>; onEdit?: EditFull }) {
  const mine = entries.filter((e) => e.kind === HABIT_KIND);
  const [view, setView] = useState<'list' | 'library' | 'create'>('list');
  const [tab, setTab] = useState<'today' | 'parcours' | 'stats'>('today');
  const [chainFor, setChainFor] = useState<string | null>(null);
  const [settingsFor, setSettingsFor] = useState<string | null>(null);
  const today = isoOf(new Date());
  const [day, setDay] = useState(bilanDay);
  const week = weekStartOf(today);
  const days = Array.from({ length: 7 }, (_, i) => addDays(week, i));
  const doneToday = mine.filter((e) => habitDone(e)[day]).length;
  const dueToday = mine.filter((e) => habitFreq(e) === 'daily' && habitScheduled(e, day)).length;
  // Rangées par catégorie de la bibliothèque ; celles que j'ai créées vont dans « Mes habitudes ».
  const groupOf = (e: Entry) => HABIT_LIBRARY.find((t) => t.id === String(e.data.templateId))?.group ?? 'Mes habitudes';
  const groups = [...HABIT_GROUPS, 'Mes habitudes'].map((name) => ({ name, items: mine.filter((e) => groupOf(e) === name) })).filter((g) => g.items.length);

  const add = (t: Omit<HabitTemplate, 'id' | 'group'> & { id?: string }) => onCreate({ module: 'quotidien', kind: HABIT_KIND, title: t.title, entry_date: null,
    data: { templateId: t.id ?? '', icon: t.icon, tint: t.tint, why: t.why, level: t.level, freq: t.freq, done: {} } });

  if (view === 'library') return <Library mine={mine} onAdd={add} onClose={() => setView('list')} />;
  if (view === 'create') return <CreateHabit onSave={async (t) => { await add(t); setView('list'); }} onClose={() => setView('list')} />;

  return <div className="screen habits">
    {!mine.length && tab === 'today' ? <div className="habits-empty">
      <Glyph name="sprout" tint="sauge" size={36} badge={84} />
      <h1 className="serif">Mes habitudes,<br />mon rythme</h1>
      <p>Les petits gestes répétés font les grands changements. Commence par une à trois habitudes qui te ressemblent, et avance un jour à la fois.</p>
      <button className="button dark wide" onClick={() => setView('library')}><Sparkles size={16} /> Choisir dans la bibliothèque</button>
      <button className="button ghost wide" onClick={() => setView('create')}><Pencil size={16} /> Créer la mienne</button>
      <button className="button ghost wide" onClick={() => setTab('parcours')}>Suivre un parcours progressif</button>
    </div> : <>
      <header className="tab-head"><h1>Habitudes</h1><p>{dueToday ? doneToday + ' sur ' + mine.length + ' ' + dayName(day) : 'Ton suivi de la semaine'}</p></header>
      <Segmented label="Habitudes" value={tab} onChange={setTab} options={[{ value: 'today', label: 'Aujourd’hui' }, { value: 'parcours', label: 'Parcours' }, { value: 'stats', label: 'Statistiques' }]} />
      {tab === 'parcours' && <Journeys entries={entries} onCreate={onCreate} onUpdate={onUpdate} onRemove={onRemove} />}
      {tab === 'stats' && <HabitStats habits={mine} />}
      {tab === 'today' && <><DaySwitch day={day} onChange={setDay} /><Bar value={mine.length ? doneToday / mine.length : 0} />
      {groups.map(({ name, items }) => <section key={name} className="habit-section">
        <h2 className="habit-group">{name}</h2>
        <div className="habit-list">{items.map((e) => {
        const done = habitDone(e), f = habitFreq(e), on = Boolean(done[day]);
        const weekCount = days.filter((d) => done[d]).length, streak = habitStreak(e, today);
        const total = Object.values(done).filter(Boolean).length, badges = badgesOf(total), next = nextBadge(total);
        const anchor = mine.find((x) => x.id === e.data.after);
        return <SwipeRow key={e.id} className="card-swipe" actions={[
          { label: 'Renommer', icon: <Pencil size={18} />, onClick: () => { const v = window.prompt('Nouveau nom', e.title)?.trim(); if (v && onEdit) void onEdit(e.id, { title: v.slice(0, 80), data: e.data }); } },
          { label: 'Supprimer', icon: <Trash2 size={18} />, tone: 'danger', onClick: () => void onRemove(e) },
        ]}><article className={'habit-card' + (on ? ' on' : '') + (f === 'daily' && !habitScheduled(e, day) && !on ? ' rest' : '')}>
          <button className="habit-check" aria-pressed={on} aria-label={(on ? 'Décocher ' : 'Fait ' + dayName(day) + ' : ') + e.title}
            onClick={() => void onUpdate(e, { ...e.data, done: { ...done, [day]: !on } })}>{on ? <Check size={22} strokeWidth={3} /> : <Glyph name={String(e.data.icon || 'sprout')} tint={(e.data.tint as Tint) || 'sauge'} size={24} />}</button>
          <div className="habit-body">
            {anchor && <span className="habit-after"><Link2 size={12} /> Après « {anchor.title} »</span>}
            <strong>{e.title}</strong>
            <small>{FREQ_LABEL[f]}{habitDaysLabel(e) ? ' · ' + habitDaysLabel(e) : ''}{f === 'daily' && !habitScheduled(e, day) && !on ? ' · pas prévue ' + dayName(day) : ''}{(e.data.remind as { on?: boolean; time?: string } | undefined)?.on ? ' · rappel ' + String((e.data.remind as { time?: string }).time ?? '') : ''}{f !== 'daily' ? ' · ' + weekCount + '/' + freqTarget(f) + ' cette semaine' : ''}{streak > 1 ? <> · <Flame size={12} /> {streak} {f === 'daily' ? 'jours' : 'semaines'}</> : null}</small>
            <div className="week-dots">{days.map((d, i) => <span key={d} title={d} className={(done[d] ? 'on' : '') + (d === today ? ' today' : '') + (d > today ? ' future' : '')}>{LETTERS[i]}</span>)}</div>
            <div className="habit-meta">
              {badges.map((b) => <span key={b} className="badge"><Trophy size={12} /> {b} jours</span>)}
              {next && <small className="muted">{next - total} {next - total > 1 ? 'fois' : 'fois'} avant le badge {next}</small>}
              <button className="link-btn small" onClick={() => setSettingsFor(settingsFor === e.id ? null : e.id)}>Jours et rappel</button>
              <button className="link-btn small" onClick={() => setChainFor(chainFor === e.id ? null : e.id)}>{anchor ? 'Changer l’enchaînement' : 'Enchaîner après…'}</button>
            </div>
            {settingsFor === e.id && <HabitSettings habit={e} onSave={(d) => void onUpdate(e, { ...e.data, ...d })} />}
            {chainFor === e.id && <select className="chain-select" value={String(e.data.after ?? '')} onChange={(ev) => { void onUpdate(e, { ...e.data, after: ev.target.value || null }); setChainFor(null); }}>
              <option value="">Aucune (habitude indépendante)</option>
              {mine.filter((x) => x.id !== e.id && x.data.after !== e.id).map((x) => <option key={x.id} value={x.id}>Après « {x.title} »</option>)}
            </select>}
          </div>
          <button className="icon-btn" aria-label={'Supprimer ' + e.title} onClick={() => void onRemove(e)}><Trash2 size={16} /></button>
        </article></SwipeRow>;
        })}</div>
      </section>)}
      <div className="button-group">
        <button className="button secondary" onClick={() => setView('library')}><Plus size={16} /> Bibliothèque</button>
        <button className="button ghost" onClick={() => setView('create')}><Pencil size={16} /> Créer la mienne</button>
      </div>
      <p className="fineprint">Un jour manqué ne remet rien à zéro : tes badges restent acquis, reprends simplement le lendemain.</p></>}
    </>}
  </div>;
}

function Library({ mine, onAdd, onClose }: { mine: Entry[]; onAdd: (t: HabitTemplate) => Promise<void>; onClose: () => void }) {
  const [busy, setBusy] = useState('');
  const taken = new Set(mine.map((e) => String(e.data.templateId)));
  return <div className="screen habits">
    <header className="screen-header"><button className="icon-btn back" onClick={onClose} aria-label="Retour"><X size={22} /></button><h1>Bibliothèque d’habitudes</h1></header>
    {HABIT_GROUPS.map((g) => <section key={g}><h2 className="habit-group">{g}</h2>
      {HABIT_LIBRARY.filter((t) => t.group === g).map((t) => <article key={t.id} className="habit-lib">
        <Glyph name={t.icon} tint={t.tint} size={20} badge={42} />
        <div className="habit-body"><strong>{t.title} <span className={'level ' + t.level.toLowerCase()}>{t.level}</span></strong><small>{t.why}</small><small className="muted">{FREQ_LABEL[t.freq]}</small></div>
        <button className="button ghost small" disabled={taken.has(t.id) || Boolean(busy)} onClick={async () => { setBusy(t.id); try { await onAdd(t); } finally { setBusy(''); } }}>
          {taken.has(t.id) ? 'Ajoutée' : busy === t.id ? '…' : 'Ajouter'}</button>
      </article>)}
    </section>)}
  </div>;
}

function CreateHabit({ onSave, onClose }: { onSave: (t: Omit<HabitTemplate, 'id' | 'group'>) => Promise<void>; onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState<GlyphName>('sprout');
  const [freq, setFreq] = useState<HabitFreq>('daily');
  const [level, setLevel] = useState<HabitLevel>('Douce');
  const [why, setWhy] = useState('');
  const [busy, setBusy] = useState(false);
  return <div className="screen habits">
    <header className="screen-header"><button className="icon-btn back" onClick={onClose} aria-label="Retour"><X size={22} /></button><h1>Ma nouvelle habitude</h1></header>
    <div className="form-stack">
      <label>Nom<input value={title} maxLength={80} placeholder="Ex. Marcher après le déjeuner" onChange={(e) => setTitle(e.target.value)} /></label>
      <fieldset className="gfield"><legend>Symbole</legend><div className="gchips">{(['sprout', 'drop', 'steps', 'book', 'stretch', 'salad', 'bed', 'phoneOff', 'heart', 'target', 'palette', 'music', 'dumbbell', 'feather'] as GlyphName[]).map((x) =>
        <button type="button" key={x} className={'gchip icon' + (icon === x ? ' on' : '')} aria-label={x} onClick={() => setIcon(x)}><Glyph name={x} tint="sauge" size={20} /></button>)}</div></fieldset>
      <fieldset className="gfield"><legend>Fréquence</legend><div className="gchips">{(Object.keys(FREQ_LABEL) as HabitFreq[]).map((f) =>
        <button type="button" key={f} className={'gchip' + (freq === f ? ' on' : '')} onClick={() => setFreq(f)}>{FREQ_LABEL[f]}</button>)}</div></fieldset>
      <fieldset className="gfield"><legend>Intensité</legend><div className="gchips">{(['Douce', 'Modérée', 'Engagée'] as HabitLevel[]).map((l) =>
        <button type="button" key={l} className={'gchip' + (level === l ? ' on' : '')} onClick={() => setLevel(l)}>{l}</button>)}</div></fieldset>
      <label>Pourquoi elle compte pour moi (facultatif)<input value={why} maxLength={140} onChange={(e) => setWhy(e.target.value)} /></label>
      <button className="button primary wide" disabled={busy || !title.trim()} onClick={async () => { setBusy(true); try { await onSave({ title: title.trim(), icon, tint: 'sauge', freq, level, why: why.trim() }); } finally { setBusy(false); } }}>
        {busy ? 'Ajout…' : 'Ajouter mon habitude'}</button>
    </div>
  </div>;
}

const WEEKDAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

/** Statistiques sur 3 mois : taux de réussite par habitude, meilleurs jours, évolution semaine par semaine. */
function HabitStats({ habits }: { habits: Entry[] }) {
  const today = isoOf(new Date());
  const from = addDays(today, -89);
  if (!habits.length) return <p className="muted">Ajoute des habitudes pour voir tes statistiques.</p>;
  const rows = habits.map((e) => {
    const done = habitDone(e), f = habitFreq(e);
    const start = [from, String(e.created_at ?? from).slice(0, 10)].sort().reverse()[0]!;
    const span = Math.max(1, Math.round((new Date(today + 'T12:00:00').getTime() - new Date(start + 'T12:00:00').getTime()) / 86400000) + 1);
    const count = Object.keys(done).filter((d) => done[d] && d >= start && d <= today).length;
    const expected = f === 'daily' ? span : Math.max(1, Math.ceil(span / 7) * freqTarget(f));
    return { e, rate: Math.min(1, count / expected), count };
  }).sort((a, b) => b.rate - a.rate);
  const byWeekday = Array.from({ length: 7 }, () => 0);
  for (const e of habits) for (const [d, v] of Object.entries(habitDone(e))) if (v && d >= from && d <= today) byWeekday[(new Date(d + 'T12:00:00').getDay() + 6) % 7]! += 1;
  const maxW = Math.max(1, ...byWeekday);
  const best = byWeekday.indexOf(Math.max(...byWeekday)), worst = byWeekday.indexOf(Math.min(...byWeekday));
  const weeks = Array.from({ length: 13 }, (_, i) => addDays(weekStartOf(today), -7 * (12 - i)));
  const perWeek = weeks.map((w) => habits.reduce((n, e) => { const done = habitDone(e); return n + Array.from({ length: 7 }, (_, i) => addDays(w, i)).filter((d) => done[d]).length; }, 0));
  const maxWk = Math.max(1, ...perWeek);
  return <div className="stack-8">
    <section className="ritual-card"><p className="ritual-label">Taux de réussite sur 3 mois</p>
      {rows.map(({ e, rate, count }) => <div key={e.id} className="habit-rate"><span>{e.title}</span><Bar value={rate} /><small>{Math.round(rate * 100)} % · {count} fois</small></div>)}</section>
    <section className="ritual-card"><p className="ritual-label">Mes meilleurs jours</p>
      <div className="focus-week">{byWeekday.map((n, i) => <div key={i} className="focus-col"><span style={{ height: Math.round(n / maxW * 100) + '%' }} /><small>{LETTERS[i]}</small></div>)}</div>
      {byWeekday.some(Boolean) && <p className="sleep-insight">Tu tiens le mieux tes habitudes le {WEEKDAYS[best]!.toLowerCase()}, et le moins le {WEEKDAYS[worst]!.toLowerCase()}.</p>}</section>
    <section className="ritual-card"><p className="ritual-label">Évolution sur 13 semaines</p>
      <div className="focus-week wide">{perWeek.map((n, i) => <div key={weeks[i]} className="focus-col"><span style={{ height: Math.round(n / maxWk * 100) + '%' }} /><small>{new Date(weeks[i] + 'T12:00:00').getDate()}</small></div>)}</div>
      <p className="muted">Nombre d’habitudes cochées par semaine (date du lundi).</p></section>
  </div>;
}

/** Parcours progressifs : une étape de plus chaque semaine, à cocher chaque jour. */
function Journeys({ entries, onCreate, onUpdate, onRemove }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; onRemove: (e: Entry) => Promise<void> }) {
  const today = isoOf(new Date());
  const mine = entries.filter((e) => e.kind === JOURNEY_KIND);
  const [busy, setBusy] = useState('');
  const available = JOURNEYS.filter((j) => !mine.some((e) => e.data.journeyId === j.id));
  return <div className="stack-8">
    <p className="muted">On commence par un seul petit geste. Chaque semaine, une étape s’ajoute. Un jour manqué n’efface rien.</p>
    {mine.map((e) => { const j = JOURNEYS.find((x) => x.id === e.data.journeyId); if (!j) return null;
      const week = journeyWeek(String(e.data.start ?? today), today), unlocked = Math.min(j.steps.length, week);
      const done = (e.data.done && typeof e.data.done === 'object' ? e.data.done : {}) as Record<string, number[]>;
      const todayDone = done[today] ?? [];
      const toggle = (i: number) => void onUpdate(e, { ...e.data, done: { ...done, [today]: todayDone.includes(i) ? todayDone.filter((x) => x !== i) : [...todayDone, i] } });
      return <article key={e.id} className="goal-card">
        <div className="goal-head"><div><span className="pill">Semaine {week}</span><h3>{j.title}</h3><small className="muted">{j.why}</small></div>
          <button className="icon-btn" aria-label={'Arrêter ' + j.title} onClick={() => void onRemove(e)}><Trash2 size={16} /></button></div>
        <Bar value={unlocked ? todayDone.filter((i) => i < unlocked).length / unlocked : 0} tone="caramel" />
        <ul className="goal-steps">{j.steps.slice(0, unlocked).map((st, i) => <li key={st.text}>
          <button className={todayDone.includes(i) ? 'on' : ''} aria-pressed={todayDone.includes(i)} onClick={() => toggle(i)}>
            <span className="tick">{todayDone.includes(i) ? <Check size={14} strokeWidth={3} /> : null}</span>
            <span>{st.text}{i === unlocked - 1 && week <= j.steps.length ? <em className="new-step"> nouveau</em> : null}<small className="muted block">{st.tip}</small></span></button></li>)}</ul>
        {unlocked < j.steps.length && <p className="muted">La semaine prochaine : « {j.steps[unlocked]!.text} »</p>}
      </article>; })}
    {available.length > 0 && <h3 className="habit-group">Commencer un parcours</h3>}
    {available.map((j) => <article key={j.id} className="habit-lib">
      <div className="habit-body"><strong>{j.title}</strong><small>{j.why}</small><small className="muted">{j.steps.length} semaines · 1re étape : {j.steps[0]!.text}</small></div>
      <button className="button ghost small" disabled={Boolean(busy)} onClick={async () => { setBusy(j.id); try { await onCreate({ module: 'quotidien', kind: JOURNEY_KIND, title: 'Parcours · ' + j.title, entry_date: today, data: { journeyId: j.id, start: today, done: {} } }); } finally { setBusy(''); } }}>
        {busy === j.id ? '…' : 'Commencer'}</button></article>)}
  </div>;
}

/** Jours de répétition (pour une habitude quotidienne) et rappel à l'heure choisie. */
function HabitSettings({ habit, onSave }: { habit: Entry; onSave: (d: Record<string, unknown>) => void }) {
  const days = habitDays(habit), all = !days.length || days.length === 7;
  const remind = (habit.data.remind ?? {}) as { on?: boolean; time?: string };
  const toggle = (i: number) => { const cur = all ? [0, 1, 2, 3, 4, 5, 6] : days; const next = cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i].sort(); if (next.length) onSave({ days: next.length === 7 ? [] : next }); };
  return <div className="habit-settings">
    {habitFreq(habit) === 'daily' && <><p className="ritual-label">Répéter le</p>
      <div className="day-chips">{DAY_LETTERS.map((l, i) => { const on = all || days.includes(i);
        return <button key={i} type="button" className={'day-chip' + (on ? ' on' : '')} aria-pressed={on} aria-label={['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'][i]} onClick={() => toggle(i)}>{l}</button>; })}</div></>}
    <label className="habit-remind"><input type="checkbox" checked={Boolean(remind.on)} onChange={(ev) => onSave({ remind: { time: remind.time ?? '08:00', on: ev.target.checked } })} /> Me le rappeler
      {remind.on && <input type="time" value={remind.time ?? '08:00'} onChange={(ev) => onSave({ remind: { on: true, time: ev.target.value } })} />}</label>
  </div>;
}
