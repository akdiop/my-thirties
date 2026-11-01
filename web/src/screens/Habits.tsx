import { Glyph, type GlyphName, type Tint } from '../ui/Glyph';
import { useState } from 'react';
import { Check, Flame, Pencil, Plus, Sparkles, Trash2, X } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { addDays, FREQ_LABEL, freqTarget, HABIT_GROUPS, HABIT_KIND, HABIT_LIBRARY, habitDone, habitFreq, habitStreak, isoOf, weekStartOf, type HabitFreq, type HabitLevel, type HabitTemplate } from '../lib/rituals';
import { Bar } from '../ui/kit';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
const LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

/** Habitudes : bibliothèque d'idées, habitudes personnelles, coche du jour, série et semaine en cours. */
export function Habits({ entries, onCreate, onUpdate, onRemove }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; onRemove: (e: Entry) => Promise<void> }) {
  const mine = entries.filter((e) => e.kind === HABIT_KIND);
  const [view, setView] = useState<'list' | 'library' | 'create'>('list');
  const today = isoOf(new Date());
  const week = weekStartOf(today);
  const days = Array.from({ length: 7 }, (_, i) => addDays(week, i));
  const doneToday = mine.filter((e) => habitDone(e)[today]).length;
  const dueToday = mine.filter((e) => habitFreq(e) === 'daily').length;
  // Rangées par catégorie de la bibliothèque ; celles que j'ai créées vont dans « Mes habitudes ».
  const groupOf = (e: Entry) => HABIT_LIBRARY.find((t) => t.id === String(e.data.templateId))?.group ?? 'Mes habitudes';
  const groups = [...HABIT_GROUPS, 'Mes habitudes'].map((name) => ({ name, items: mine.filter((e) => groupOf(e) === name) })).filter((g) => g.items.length);

  const add = (t: Omit<HabitTemplate, 'id' | 'group'> & { id?: string }) => onCreate({ module: 'quotidien', kind: HABIT_KIND, title: t.title, entry_date: null,
    data: { templateId: t.id ?? '', icon: t.icon, tint: t.tint, why: t.why, level: t.level, freq: t.freq, done: {} } });

  if (view === 'library') return <Library mine={mine} onAdd={add} onClose={() => setView('list')} />;
  if (view === 'create') return <CreateHabit onSave={async (t) => { await add(t); setView('list'); }} onClose={() => setView('list')} />;

  return <div className="screen habits">
    {!mine.length ? <div className="habits-empty">
      <Glyph name="sprout" tint="sauge" size={36} badge={84} />
      <h1 className="serif">Mes habitudes,<br />mon rythme</h1>
      <p>Les petits gestes répétés font les grands changements. Commence par une à trois habitudes qui te ressemblent, et avance un jour à la fois.</p>
      <button className="button dark wide" onClick={() => setView('library')}><Sparkles size={16} /> Choisir dans la bibliothèque</button>
      <button className="button ghost wide" onClick={() => setView('create')}><Pencil size={16} /> Créer la mienne</button>
    </div> : <>
      <header className="tab-head"><h1>Habitudes</h1><p>{dueToday ? doneToday + ' sur ' + mine.length + ' aujourd’hui' : 'Ton suivi de la semaine'}</p></header>
      <Bar value={mine.length ? doneToday / mine.length : 0} />
      {groups.map(({ name, items }) => <section key={name} className="habit-section">
        <h2 className="habit-group">{name}</h2>
        <div className="habit-list">{items.map((e) => {
        const done = habitDone(e), f = habitFreq(e), on = Boolean(done[today]);
        const weekCount = days.filter((d) => done[d]).length, streak = habitStreak(e, today);
        return <article key={e.id} className={'habit-card' + (on ? ' on' : '')}>
          <button className="habit-check" aria-pressed={on} aria-label={(on ? 'Décocher ' : 'Fait aujourd’hui : ') + e.title}
            onClick={() => void onUpdate(e, { ...e.data, done: { ...done, [today]: !on } })}>{on ? <Check size={22} strokeWidth={3} /> : <Glyph name={String(e.data.icon || 'sprout')} tint={(e.data.tint as Tint) || 'sauge'} size={24} />}</button>
          <div className="habit-body">
            <strong>{e.title}</strong>
            <small>{FREQ_LABEL[f]}{f !== 'daily' ? ' · ' + weekCount + '/' + freqTarget(f) + ' cette semaine' : ''}{streak > 1 ? <> · <Flame size={12} /> {streak} {f === 'daily' ? 'jours' : 'semaines'}</> : null}</small>
            <div className="week-dots">{days.map((d, i) => <span key={d} title={d} className={(done[d] ? 'on' : '') + (d === today ? ' today' : '') + (d > today ? ' future' : '')}>{LETTERS[i]}</span>)}</div>
          </div>
          <button className="icon-btn" aria-label={'Supprimer ' + e.title} onClick={() => { if (confirm('Arrêter l’habitude « ' + e.title + ' » ? Son historique sera supprimé.')) void onRemove(e); }}><Trash2 size={16} /></button>
        </article>;
        })}</div>
      </section>)}
      <div className="button-group">
        <button className="button secondary" onClick={() => setView('library')}><Plus size={16} /> Bibliothèque</button>
        <button className="button ghost" onClick={() => setView('create')}><Pencil size={16} /> Créer la mienne</button>
      </div>
      <p className="fineprint">Un jour manqué ne remet rien à zéro : reprends simplement le lendemain.</p>
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
