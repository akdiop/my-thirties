import { Glyph, type GlyphName, type Tint } from '../ui/Glyph';
import { useState } from 'react';
import { Check, Flame, Link2, Minus, Pencil, Plus, Sparkles, Trash2, Trophy, X } from 'lucide-react';
import { SwipeRow } from '../ui/SwipeRow';
import type { Entry, EntryInput } from '../lib/cloud';
import { addDays, DAY_LETTERS, everyWait, expectedOver, FREQ_LABEL, HABIT_GROUPS, HABIT_KIND, HABIT_LIBRARY, habitDays, habitDaysLabel, habitDone, habitDue, habitRule, habitStreak, isoOf, periodCount, RULE_RANGE, ruleData, ruleLabel, ruleOfFreq, streakUnit, weekStartOf, type HabitLevel, type HabitRule, type HabitTemplate } from '../lib/rituals';
import { Bar, Segmented } from '../ui/kit';
import { bilanDay } from '../lib/day';
import { DaySwitch, dayName } from '../features/DaySwitch';
import { badgesOf, nextBadge } from '../lib/growth';
import { JOURNEYS, JOURNEY_KIND, journeyWeek } from '../lib/journeys';

type EditFull = (id: string, patch: { title: string; data: Record<string, unknown> }) => Promise<void>;
type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
type HabitDraft = { title: string; icon: GlyphName; tint: Tint; why: string; level: HabitLevel; rule: HabitRule };
const LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

/** Habitudes : bibliothèque d'idées, habitudes personnelles, coche du jour, série et semaine en cours. */
export function Habits({ entries, onCreate, onUpdate, onRemove, onEdit }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; onRemove: (e: Entry) => Promise<void>; onEdit?: EditFull }) {
  const mine = entries.filter((e) => e.kind === HABIT_KIND);
  const [view, setView] = useState<'list' | 'library' | 'create'>('list');
  const [editing, setEditing] = useState<Entry | null>(null);
  const [tab, setTab] = useState<'today' | 'parcours' | 'stats'>('today');
  const [chainFor, setChainFor] = useState<string | null>(null);
  const [settingsFor, setSettingsFor] = useState<string | null>(null);
  const today = isoOf(new Date());
  const [day, setDay] = useState(bilanDay);
  const week = weekStartOf(today);
  const days = Array.from({ length: 7 }, (_, i) => addDays(week, i));
  const doneToday = mine.filter((e) => habitDone(e)[day]).length;
  const dueToday = mine.filter((e) => habitDue(e, day)).length;
  // Rangées par catégorie de la bibliothèque ; celles que j'ai créées vont dans « Mes habitudes ».
  const groupOf = (e: Entry) => HABIT_LIBRARY.find((t) => t.id === String(e.data.templateId))?.group ?? 'Mes habitudes';
  const groups = [...HABIT_GROUPS, 'Mes habitudes'].map((name) => ({ name, items: mine.filter((e) => groupOf(e) === name) })).filter((g) => g.items.length);

  const add = (t: HabitDraft, templateId = '') => onCreate({ module: 'quotidien', kind: HABIT_KIND, title: t.title, entry_date: null,
    data: { templateId, icon: t.icon, tint: t.tint, why: t.why, level: t.level, ...ruleData(t.rule), done: {} } });

  if (view === 'library') return <Library mine={mine} onAdd={(t) => add({ ...t, rule: ruleOfFreq(t.freq) }, t.id)} onClose={() => setView('list')} />;
  if (view === 'create') return <HabitForm onSave={async (t) => { await add(t); setView('list'); }} onClose={() => setView('list')} />;
  if (editing) {
    const e = editing;
    return <HabitForm heading="Modifier mon habitude" submit="Enregistrer" onClose={() => setEditing(null)}
      initial={{ title: e.title, icon: String(e.data.icon || 'sprout') as GlyphName, tint: (e.data.tint as Tint) || 'sauge', why: String(e.data.why ?? ''), level: (e.data.level as HabitLevel) || 'Douce', rule: habitRule(e) }}
      onSave={async (t) => {
        const data = { ...e.data, icon: t.icon, why: t.why, level: t.level, ...ruleData(t.rule) };
        if (onEdit) await onEdit(e.id, { title: t.title, data }); else await onUpdate(e, data);
        setEditing(null);
      }} />;
  }

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
        const done = habitDone(e), r = habitRule(e), on = Boolean(done[day]);
        const streak = habitStreak(e, today), wait = r.type === 'every' && !on ? everyWait(e, day) : 0;
        const resting = !on && !habitDue(e, day) && (r.type === 'daily' || r.type === 'every');
        const total = Object.values(done).filter(Boolean).length, badges = badgesOf(total), next = nextBadge(total);
        const anchor = mine.find((x) => x.id === e.data.after);
        return <SwipeRow key={e.id} className="card-swipe" actions={[
          { label: 'Renommer', icon: <Pencil size={18} />, onClick: () => { const v = window.prompt('Nouveau nom', e.title)?.trim(); if (v && onEdit) void onEdit(e.id, { title: v.slice(0, 80), data: e.data }); } },
          { label: 'Supprimer', icon: <Trash2 size={18} />, tone: 'danger', onClick: () => void onRemove(e) },
        ]}><article className={'habit-card' + (on ? ' on' : '') + (resting ? ' rest' : '')}>
          <button className="habit-check" aria-pressed={on} aria-label={(on ? 'Décocher ' : 'Fait ' + dayName(day) + ' : ') + e.title}
            onClick={() => void onUpdate(e, { ...e.data, done: { ...done, [day]: !on } })}>{on ? <Check size={22} strokeWidth={3} /> : <Glyph name={String(e.data.icon || 'sprout')} tint={(e.data.tint as Tint) || 'sauge'} size={24} />}</button>
          <div className="habit-body">
            {anchor && <span className="habit-after"><Link2 size={12} /> Après « {anchor.title} »</span>}
            <strong>{e.title}</strong>
            <small>{ruleLabel(r)}{r.type === 'daily' && habitDaysLabel(e) ? ' · ' + habitDaysLabel(e) : ''}{r.type === 'daily' && resting ? ' · pas prévue ' + dayName(day) : ''}{r.type === 'every' && !on ? (wait > 1 ? ' · dans ' + wait + ' jours' : wait ? ' · demain' : ' · à faire') : ''}{(e.data.remind as { on?: boolean; time?: string } | undefined)?.on ? ' · rappel ' + String((e.data.remind as { time?: string }).time ?? '') : ''}{r.type === 'week' || r.type === 'month' ? ' · ' + periodCount(e, today) + '/' + r.n + (r.type === 'week' ? ' cette semaine' : ' ce mois-ci') : ''}{streak > 1 ? <> · <Flame size={12} /> {streak} {streakUnit(r)}</> : null}</small>
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
          <div className="habit-actions">
            <button className="icon-btn" aria-label={'Modifier ' + e.title} onClick={() => setEditing(e)}><Pencil size={16} /></button>
            <button className="icon-btn" aria-label={'Supprimer ' + e.title} onClick={() => void onRemove(e)}><Trash2 size={16} /></button>
          </div>
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

const ICONS: GlyphName[] = ['sprout', 'drop', 'steps', 'book', 'stretch', 'salad', 'bed', 'phoneOff', 'heart', 'target', 'palette', 'music', 'dumbbell', 'feather'];
const RULE_TYPES: { type: HabitRule['type']; label: string; n: number }[] = [
  { type: 'daily', label: 'Chaque jour', n: 1 }, { type: 'week', label: 'Par semaine', n: 3 }, { type: 'every', label: 'Tous les X jours', n: 3 }, { type: 'month', label: 'Par mois', n: 1 }];

/** Créer ou modifier une habitude : nom, symbole, fréquence, intensité, pourquoi. */
function HabitForm({ initial, heading = 'Ma nouvelle habitude', submit = 'Ajouter mon habitude', onSave, onClose }: { initial?: HabitDraft; heading?: string; submit?: string; onSave: (t: HabitDraft) => Promise<void>; onClose: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [icon, setIcon] = useState<GlyphName>(initial?.icon ?? 'sprout');
  const [rule, setRule] = useState<HabitRule>(initial?.rule ?? { type: 'daily', n: 1 });
  const [level, setLevel] = useState<HabitLevel>(initial?.level ?? 'Douce');
  const [why, setWhy] = useState(initial?.why ?? '');
  const [busy, setBusy] = useState(false);
  const icons = ICONS.includes(icon) ? ICONS : [icon, ...ICONS];
  return <div className="screen habits">
    <header className="screen-header"><button className="icon-btn back" onClick={onClose} aria-label="Retour"><X size={22} /></button><h1>{heading}</h1></header>
    <div className="form-stack">
      <label>Nom<input value={title} maxLength={80} placeholder="Ex. Marcher après le déjeuner" onChange={(e) => setTitle(e.target.value)} /></label>
      <fieldset className="gfield"><legend>Symbole</legend><div className="gchips">{icons.map((x) =>
        <button type="button" key={x} className={'gchip icon' + (icon === x ? ' on' : '')} aria-label={x} onClick={() => setIcon(x)}><Glyph name={x} tint="sauge" size={20} /></button>)}</div></fieldset>
      <FreqPicker value={rule} onChange={setRule} />
      <fieldset className="gfield"><legend>Intensité</legend><div className="gchips">{(['Douce', 'Modérée', 'Engagée'] as HabitLevel[]).map((l) =>
        <button type="button" key={l} className={'gchip' + (level === l ? ' on' : '')} onClick={() => setLevel(l)}>{l}</button>)}</div></fieldset>
      <label>Pourquoi elle compte pour moi (facultatif)<input value={why} maxLength={140} onChange={(e) => setWhy(e.target.value)} /></label>
      <button className="button primary wide" disabled={busy || !title.trim()} onClick={async () => { setBusy(true); try { await onSave({ title: title.trim(), icon, tint: initial?.tint ?? 'sauge', rule, level, why: why.trim() }); } finally { setBusy(false); } }}>
        {busy ? 'Enregistrement…' : submit}</button>
    </div>
  </div>;
}

/** Fréquence : chaque jour, n fois par semaine, tous les n jours ou n fois par mois. */
function FreqPicker({ value, onChange }: { value: HabitRule; onChange: (r: HabitRule) => void }) {
  const [lo, hi] = RULE_RANGE[value.type];
  const set = (n: number) => onChange({ ...value, n: Math.min(hi, Math.max(lo, n)) });
  return <fieldset className="gfield"><legend>Fréquence</legend>
    <div className="gchips">{RULE_TYPES.map((t) => <button type="button" key={t.type} className={'gchip' + (value.type === t.type ? ' on' : '')}
      onClick={() => value.type !== t.type && onChange({ type: t.type, n: t.n })}>{t.label}</button>)}</div>
    {value.type !== 'daily' && <div className="gstepper freq-stepper">
      <button type="button" aria-label="Moins" disabled={value.n <= lo} onClick={() => set(value.n - 1)}><Minus size={18} /></button>
      <span className="freq-value">{ruleLabel(value)}</span>
      <button type="button" aria-label="Plus" disabled={value.n >= hi} onClick={() => set(value.n + 1)}><Plus size={18} /></button>
    </div>}
  </fieldset>;
}

const WEEKDAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

/** Statistiques sur 3 mois : taux de réussite par habitude, meilleurs jours, évolution semaine par semaine. */
function HabitStats({ habits }: { habits: Entry[] }) {
  const today = isoOf(new Date());
  const from = addDays(today, -89);
  if (!habits.length) return <p className="muted">Ajoute des habitudes pour voir tes statistiques.</p>;
  const rows = habits.map((e) => {
    const done = habitDone(e), r = habitRule(e);
    const start = [from, String(e.created_at ?? from).slice(0, 10)].sort().reverse()[0]!;
    const span = Math.max(1, Math.round((new Date(today + 'T12:00:00').getTime() - new Date(start + 'T12:00:00').getTime()) / 86400000) + 1);
    const count = Object.keys(done).filter((d) => done[d] && d >= start && d <= today).length;
    const expected = expectedOver(r, span);
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
    {habitRule(habit).type === 'daily' && <><p className="ritual-label">Répéter le</p>
      <div className="day-chips">{DAY_LETTERS.map((l, i) => { const on = all || days.includes(i);
        return <button key={i} type="button" className={'day-chip' + (on ? ' on' : '')} aria-pressed={on} aria-label={['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'][i]} onClick={() => toggle(i)}>{l}</button>; })}</div></>}
    <label className="habit-remind"><input type="checkbox" checked={Boolean(remind.on)} onChange={(ev) => onSave({ remind: { time: remind.time ?? '08:00', on: ev.target.checked } })} /> Me le rappeler
      {remind.on && <input type="time" value={remind.time ?? '08:00'} onChange={(ev) => onSave({ remind: { on: true, time: ev.target.value } })} />}</label>
  </div>;
}
