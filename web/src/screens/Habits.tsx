import { Glyph, type GlyphName, type Tint } from '../ui/Glyph';
import { useEffect, useMemo, useState } from 'react';
import { Archive, Check, ChevronLeft, ChevronRight, Flame, Link2, Minus, Pencil, Plus, Sparkles, Trash2, Trophy, X } from 'lucide-react';
import { SwipeRow } from '../ui/SwipeRow';
import type { Entry, EntryInput } from '../lib/cloud';
import { addDays, countData, countOn, DAY_LETTERS, everyWait, expectedOver, FREQ_LABEL, HABIT_GROUPS, HABIT_KIND, HABIT_LIBRARY, habitCtx, habitDays, habitDaysLabel, habitDone, habitDue, habitGoal, habitNotes, habitPause, habitPrayer, habitRule, habitSeason, habitSteps, habitStreak, isArchived, isoOf, isResting, momentNow, monthReview, momentOf, momentRank, MOMENTS, monthStartOf, periodCount, restReason, RULE_RANGE, ruleData, ruleLabel, ruleOfFreq, stepData, stepsOn, streakUnit, toggleData, weekStartOf, type HabitCtx, type HabitLevel, type HabitMoment, type HabitRule, type HabitSeason, type HabitTemplate } from '../lib/rituals';
import { PRAYER_LINKS } from '../../supabase/functions/push-reminders/habits';
import { prayerDay } from '../lib/wellbeing';
import { askAssistant } from '../lib/assistant';
import { useIntegrationPrefs } from '../lib/integrations';
import { Bar, Segmented } from '../ui/kit';
import { bilanDay } from '../lib/day';
import { DaySwitch, dayName } from '../features/DaySwitch';
import { badgesOf, nextBadge } from '../lib/growth';
import { JOURNEYS, JOURNEY_KIND, journeyWeek } from '../lib/journeys';
import { ouvrirCoran } from '../ui/CoranLien';

type EditFull = (id: string, patch: { title: string; data: Record<string, unknown> }) => Promise<void>;
type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
type Goal = { target: number; unit: string; source: '' | 'pas' | 'eau' };
type HabitDraft = { title: string; icon: GlyphName; tint: Tint; why: string; level: HabitLevel; rule: HabitRule; moment: HabitMoment | ''; goal: Goal | null; steps: string[]; prayer: string; season: HabitSeason | null; cycleRest: boolean; niyya: string };
type Prayers = { name: string; time: string }[];
const LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

/** Habitudes : bibliothèque d'idées, habitudes personnelles, coche du jour, série et semaine en cours. */
export function Habits({ entries, onCreate, onUpdate, onRemove, onEdit, focusNow = 0 }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; onRemove: (e: Entry) => Promise<void>; onEdit?: EditFull; focusNow?: number }) {
  const today = isoOf(new Date());
  const ctx = useMemo(() => habitCtx(entries), [entries]);
  const prayers: Prayers = useMemo(() => prayerDay(entries)?.times ?? [], [entries]);
  const all = entries.filter((e) => e.kind === HABIT_KIND);
  const current = all.filter((e) => !isArchived(e)), archived = all.filter(isArchived);
  // Habitudes saisonnières hors de leur saison : en sommeil, elles reviennent seules.
  const sleeping = current.filter((e) => habitSeason(e) && restReason(e, today, ctx) === 'saison'), mine = current.filter((e) => !sleeping.includes(e));
  const [only, setOnly] = useState<HabitMoment | ''>('');
  const [justDone, setJustDone] = useState<{ id: string; day: string } | null>(null);
  useEffect(() => { if (!justDone) return; const t = window.setTimeout(() => setJustDone(null), 12000); return () => window.clearTimeout(t); }, [justDone]);
  useEffect(() => { if (focusNow) setOnly(momentNow(new Date().getHours())); }, [focusNow]);
  const [view, setView] = useState<'list' | 'library' | 'create'>('list');
  const [editing, setEditing] = useState<Entry | null>(null);
  const [tab, setTab] = useState<'today' | 'parcours' | 'stats'>('today');
  const [day, setDay] = useState(bilanDay);
  const doneToday = mine.filter((e) => habitDone(e)[day]).length;
  const dueToday = mine.filter((e) => habitDue(e, day, ctx)).length;
  const now = momentNow(new Date().getHours());
  // Rangées par catégorie de la bibliothèque ; celles que j'ai créées vont dans « Mes habitudes ». Celles du moment présent passent en premier.
  const groupOf = (e: Entry) => HABIT_LIBRARY.find((t) => t.id === String(e.data.templateId))?.group ?? 'Mes habitudes';
  const groups = [...HABIT_GROUPS, 'Mes habitudes'].map((name) => ({ name, items: mine.filter((e) => groupOf(e) === name && (!only || !momentOf(e) || momentOf(e) === only)).sort((x, y) => momentRank(momentOf(x), now) - momentRank(momentOf(y), now)) }))
    .filter((g) => g.items.length);

  const add = (t: HabitDraft, templateId = '') => onCreate({ module: 'quotidien', kind: HABIT_KIND, title: t.title, entry_date: null,
    data: { templateId, icon: t.icon, tint: t.tint, why: t.why, level: t.level, ...ruleData(t.rule), ...draftExtras(t), done: {} } });

  if (view === 'library') return <Library mine={all} onAdd={(t) => add({ ...t, rule: ruleOfFreq(t.freq), moment: '', goal: null, steps: [], prayer: '', season: null, cycleRest: false, niyya: '' }, t.id)} onClose={() => setView('list')} />;
  if (view === 'create') return <HabitForm onSave={async (t) => { await add(t); setView('list'); }} onClose={() => setView('list')} />;
  if (editing) {
    const e = editing;
    return <HabitForm heading="Modifier mon habitude" submit="Enregistrer" onClose={() => setEditing(null)}
      initial={{ title: e.title, icon: String(e.data.icon || 'sprout') as GlyphName, tint: (e.data.tint as Tint) || 'sauge', why: String(e.data.why ?? ''), level: (e.data.level as HabitLevel) || 'Douce', rule: habitRule(e),
        moment: momentOf(e), goal: habitGoal(e), steps: habitSteps(e), prayer: habitPrayer(e), season: habitSeason(e), cycleRest: e.data.cycleRest === true, niyya: String(e.data.niyya ?? '') }}
      onSave={async (t) => {
        const data = { ...e.data, icon: t.icon, why: t.why, level: t.level, ...ruleData(t.rule), ...draftExtras(t) };
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
      {archived.length > 0 && <Archived items={archived} onUpdate={onUpdate} onRemove={onRemove} />}
      {sleeping.length > 0 && <Sleeping items={sleeping} />}
    </div> : <>
      <header className="tab-head"><h1>Habitudes</h1><p>{dueToday ? doneToday + ' sur ' + mine.length + ' ' + dayName(day) : 'Ton suivi de la semaine'}</p></header>
      <Segmented label="Habitudes" value={tab} onChange={setTab} options={[{ value: 'today', label: 'Aujourd’hui' }, { value: 'parcours', label: 'Parcours' }, { value: 'stats', label: 'Statistiques' }]} />
      {tab === 'parcours' && <Journeys entries={entries} onCreate={onCreate} onUpdate={onUpdate} onRemove={onRemove} />}
      {tab === 'stats' && <HabitStats habits={mine} ctx={ctx} onUpdate={onUpdate} />}
      {tab === 'today' && <><DaySwitch day={day} onChange={setDay} /><Bar value={mine.length ? doneToday / mine.length : 0} />
      {mine.some((e) => momentOf(e)) && <div className="gchips small habit-moments">{[{ id: '' as const, label: 'Toutes' }, ...MOMENTS].map((m) =>
        <button type="button" key={m.id || 'all'} className={'gchip' + (only === m.id ? ' on' : '')} aria-pressed={only === m.id} onClick={() => setOnly(m.id)}>{m.label}</button>)}</div>}
      {groups.map(({ name, items }) => <section key={name} className="habit-section">
        <h2 className="habit-group">{name}</h2>
        <div className="habit-list">{items.map((e) => <HabitCard key={e.id} e={e} mine={mine} day={day} today={today} ctx={ctx} prayers={prayers} onUpdate={onUpdate} onRemove={onRemove} onOpenEdit={() => setEditing(e)} onChecked={() => setJustDone({ id: e.id, day })} />)}</div>
      </section>)}
      <div className="button-group">
        <button className="button secondary" onClick={() => setView('library')}><Plus size={16} /> Bibliothèque</button>
        <button className="button ghost" onClick={() => setView('create')}><Pencil size={16} /> Créer la mienne</button>
      </div>
      {sleeping.length > 0 && <Sleeping items={sleeping} />}
      {archived.length > 0 && <Archived items={archived} onUpdate={onUpdate} onRemove={onRemove} />}
      {justDone && <AfterCheck done={all.find((x) => x.id === justDone.id)} next={mine.filter((x) => x.data.after === justDone.id && !habitDone(x)[justDone.day])}
        onDo={(x) => { void onUpdate(x, toggleData(x, justDone.day, true)); setJustDone({ id: x.id, day: justDone.day }); }} onClose={() => setJustDone(null)} />}
      <p className="fineprint">Un jour manqué ne remet rien à zéro : tes badges restent acquis, reprends simplement le lendemain.</p></>}
    </>}
  </div>;
}

const draftExtras = (t: HabitDraft) => ({ moment: t.moment || null, goal: t.goal, steps: t.steps.length ? t.steps : null, prayer: t.prayer || null, season: t.season, cycleRest: t.cycleRest || null, niyya: t.niyya.trim() || null });
const seasonLabel = (s: HabitSeason) => (s.type === 'ramadan' ? 'pendant le Ramadan' : 'du ' + mdLabel(s.from) + ' au ' + mdLabel(s.to));
const mdLabel = (md: string) => new Date('2000-' + md + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

/** Le cadre donné au coach IA des habitudes : seulement les habitudes, leur fréquence et leur régularité. */
function coachHabits(habits: Entry[], rows: { e: Entry; rate: number; count: number }[], today: string, ctx: HabitCtx) {
  const lines = habits.map((e) => { const r = rows.find((x) => x.e.id === e.id), m = momentOf(e);
    return '- ' + e.title.slice(0, 60) + ' : ' + ruleLabel(habitRule(e)).toLowerCase() + (m ? ', ' + m : '') + ', série ' + habitStreak(e, today, ctx) + ' ' + streakUnit(habitRule(e))
      + (r ? ', ' + Math.round(r.rate * 100) + ' % ce mois-ci (' + r.count + ' fois)' : '') + (e.data.why ? ', pourquoi : ' + String(e.data.why).slice(0, 80) : ''); });
  return ['Tu es un coach d’habitudes bienveillant pour Aïda (34 ans, Dakar, musulmane pratiquante). Voici ses habitudes et leur régularité ce mois-ci :', ...lines,
    'Réponds en français, chaleureusement, en 150 à 250 mots, avec des phrases courtes : ce qui marche, ce qui décroche et pourquoi c’est humain, puis 2 ou 3 ajustements concrets (fréquence plus douce, moment de la journée, enchaînement après une autre habitude, version minimale). Pas de jugement, pas de citation religieuse précise.'].join('\n');
}

/** Partager une habitude comme un défi à relever ensemble (texte seulement, envoyé par moi). */
async function shareHabit(e: Entry, streak: number, unit: string) {
  const text = 'Je relève le défi « ' + e.title + ' » (' + ruleLabel(habitRule(e)).toLowerCase() + ')' + (streak > 1 ? ', série en cours : ' + streak + ' ' + unit : '') + '. Tu le fais avec moi ? On se donne des nouvelles chaque semaine.';
  try { if (navigator.share) { await navigator.share({ text }); return ''; } } catch { return ''; }
  try { await navigator.clipboard.writeText(text); return 'Message copié : colle-le dans WhatsApp ou tes messages.'; } catch { return text; }
}
const CORAN_HABITS: Record<string, { label: string; at?: [number, number] }> = { coran: { label: 'Ouvrir le Coran' }, sourate: { label: 'Ouvrir le Coran' }, kahf: { label: 'Lire al-Kahf', at: [18, 1] } };
const shortDate = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

/** Une habitude : coche (ou compteur, ou étapes), semaine à toucher, note du jour, réglages, calendrier, enchaînement. */
function HabitCard({ e, mine, day, today, ctx, prayers, onUpdate, onRemove, onOpenEdit, onChecked }: { e: Entry; mine: Entry[]; day: string; today: string; ctx: HabitCtx; prayers: Prayers; onUpdate: Save; onRemove: (e: Entry) => Promise<void>; onOpenEdit: () => void; onChecked: () => void }) {
  const [panel, setPanel] = useState<'' | 'settings' | 'chain' | 'cal' | 'note'>('');
  const [shared, setShared] = useState('');
  const open = (p: typeof panel) => setPanel(panel === p ? '' : p);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStartOf(today), i));
  const done = habitDone(e), r = habitRule(e), goal = habitGoal(e), steps = habitSteps(e), moment = momentOf(e);
  const count = goal ? countOn(e, day, ctx) : 0, on = Boolean(done[day]) || Boolean(goal?.source && count >= goal.target);
  const reason = restReason(e, day, ctx), pause = habitPause(e), season = habitSeason(e), prayer = habitPrayer(e), prayerTime = prayers.find((p) => p.name === prayer)?.time;
  const streak = habitStreak(e, today, ctx), wait = r.type === 'every' && !on && !reason ? everyWait(e, day, ctx) : 0;
  const resting = !on && (Boolean(reason) || (!habitDue(e, day, ctx) && (r.type === 'daily' || r.type === 'every')));
  const autoReached = Boolean(goal?.source && day === today && count >= goal.target && !done[today]);
  useEffect(() => { if (autoReached) void onUpdate(e, countData(e, today, count)); }, [autoReached]); // eslint-disable-line react-hooks/exhaustive-deps
  const total = Object.values(done).filter(Boolean).length, badges = badgesOf(total), next = nextBadge(total);
  const anchor = mine.find((x) => x.id === e.data.after), note = habitNotes(e)[day] ?? '';
  const save = (data: Record<string, unknown>) => void onUpdate(e, data);
  const ticked = steps.length ? stepsOn(e, day) : [];
  const remind = (e.data.remind ?? {}) as { on?: boolean; time?: string; after?: number };
  return <SwipeRow className="card-swipe" actions={[
    { label: 'Modifier', icon: <Pencil size={18} />, onClick: onOpenEdit },
    { label: 'Archiver', icon: <Archive size={18} />, onClick: () => save({ ...e.data, archived: today }) },
    { label: 'Supprimer', icon: <Trash2 size={18} />, tone: 'danger', onClick: () => void onRemove(e) },
  ]}><article className={'habit-card' + (on ? ' on' : '') + (resting ? ' rest' : '')}>
    <button className="habit-check" aria-pressed={on} aria-label={(on ? 'Décocher ' : 'Fait ' + dayName(day) + ' : ') + e.title}
      onClick={() => { save(toggleData(e, day, !on)); if (!on) onChecked(); }}>{on ? <Check size={22} strokeWidth={3} /> : <Glyph name={String(e.data.icon || 'sprout')} tint={(e.data.tint as Tint) || 'sauge'} size={24} />}</button>
    <div className="habit-body">
      {anchor && <span className="habit-after"><Link2 size={12} /> Après « {anchor.title} »</span>}
      <strong>{e.title}</strong>
      <small>{reason === 'pause' && pause ? 'En pause jusqu’au ' + shortDate(pause.to) : reason === 'saison' && season ? 'En sommeil, revient ' + seasonLabel(season) : reason === 'cycle' ? 'Jour de repos, ta série reste intacte' : <>{ruleLabel(r)}{moment ? ' · ' + MOMENTS.find((m) => m.id === moment)!.label : ''}{prayer ? ' · après ' + prayer + (prayerTime ? ' (' + prayerTime + ')' : '') : ''}{r.type === 'daily' && habitDaysLabel(e) ? ' · ' + habitDaysLabel(e) : ''}{r.type === 'daily' && resting ? ' · pas prévue ' + dayName(day) : ''}{r.type === 'every' && !on ? (wait > 1 ? ' · dans ' + wait + ' jours' : wait ? ' · demain' : ' · à faire') : ''}{remind.on ? (prayer ? ' · rappel ' + Number(remind.after ?? 10) + ' min après' : ' · rappel ' + String(remind.time ?? '')) : ''}{r.type === 'week' || r.type === 'month' ? ' · ' + periodCount(e, today) + '/' + r.n + (r.type === 'week' ? ' cette semaine' : ' ce mois-ci') : ''}{streak > 1 ? <> · <Flame size={12} /> {streak} {streakUnit(r)}</> : null}</>}</small>
      {goal && <div className="habit-count">
        <button type="button" aria-label="Un de moins" disabled={!count} onClick={() => save(countData(e, day, count - 1))}><Minus size={16} /></button>
        <span><b>{count.toLocaleString('fr-FR')}</b>/{goal.target.toLocaleString('fr-FR')}{goal.unit ? ' ' + goal.unit : ''}{goal.source ? <small className="muted"> · {goal.source === 'pas' ? 'Santé' : 'mon eau'}</small> : null}</span>
        <button type="button" aria-label="Un de plus" disabled={count >= goal.target} onClick={() => save(countData(e, day, count + 1))}><Plus size={16} /></button>
        <Bar value={count / goal.target} />
      </div>}
      {steps.length > 0 && <ul className="goal-steps habit-steps">{steps.map((st, i) => <li key={i}>
        <button className={ticked.includes(i) ? 'on' : ''} aria-pressed={ticked.includes(i)} onClick={() => save(stepData(e, day, i))}>
          <span className="tick">{ticked.includes(i) ? <Check size={14} strokeWidth={3} /> : null}</span><span>{st}</span></button></li>)}</ul>}
      <div className="week-dots">{days.map((d, i) => <button key={d} type="button" disabled={d > today} aria-pressed={Boolean(done[d])} aria-label={(done[d] ? 'Décocher ' : 'Cocher ') + new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long' })}
        className={(done[d] ? 'on' : '') + (d === today ? ' today' : '') + (d > today ? ' future' : '') + (isResting(e, d, ctx) ? ' paused' : '')} onClick={() => save(toggleData(e, d, !done[d]))}>{LETTERS[i]}</button>)}</div>
      {on && note && panel !== 'note' && <p className="habit-note">{note}</p>}
      <div className="habit-meta">
        {badges.map((b) => <span key={b} className="badge"><Trophy size={12} /> {b} jours</span>)}
        {next && <small className="muted">{next - total} fois avant le badge {next}</small>}
        {steps.length > 0 && streak >= 7 && <span className="badge"><Trophy size={12} /> Routine complète {streak} jours · panda récompensé</span>}
        {on && <button className="link-btn small" onClick={() => open('note')}>{note ? 'Modifier la note' : 'Ajouter une note'}</button>}
        {CORAN_HABITS[String(e.data.templateId)] && <button className="link-btn small" onClick={() => ouvrirCoran(CORAN_HABITS[String(e.data.templateId)]!.at)}>{CORAN_HABITS[String(e.data.templateId)]!.label}</button>}
        <button className="link-btn small" onClick={() => open('settings')}>Réglages</button>
        <button className="link-btn small" onClick={() => open('cal')}>Calendrier</button>
        <button className="link-btn small" onClick={() => open('chain')}>{anchor ? 'Changer l’enchaînement' : 'Enchaîner après…'}</button>
        <button className="link-btn small" onClick={async () => setShared(await shareHabit(e, streak, streakUnit(r)))}>Partager le défi</button>
      </div>
      {shared && <p className="habit-note">{shared}</p>}
    </div>
    <div className="habit-actions">
      <button className="icon-btn" aria-label={'Modifier ' + e.title} onClick={onOpenEdit}><Pencil size={16} /></button>
      <button className="icon-btn" aria-label={'Supprimer ' + e.title} onClick={() => void onRemove(e)}><Trash2 size={16} /></button>
    </div>
    {panel && <div className="habit-panel">
      {panel === 'note' && <NoteEditor initial={note} onSave={(text) => { const notes = { ...habitNotes(e) }; if (text) notes[day] = text; else delete notes[day]; save({ ...e.data, notes }); setPanel(''); }} />}
      {panel === 'settings' && <HabitSettings habit={e} today={today} prayerTime={prayerTime} onSave={(d) => save({ ...e.data, ...d })} />}
      {panel === 'cal' && <HabitMonth habit={e} today={today} ctx={ctx} onToggle={(d, v) => save(toggleData(e, d, v))} />}
      {panel === 'chain' && <select className="chain-select" value={String(e.data.after ?? '')} onChange={(ev) => { save({ ...e.data, after: ev.target.value || null }); setPanel(''); }}>
        <option value="">Aucune (habitude indépendante)</option>
        {mine.filter((x) => x.id !== e.id && x.data.after !== e.id).map((x) => <option key={x.id} value={x.id}>Après « {x.title} »</option>)}
      </select>}
    </div>}
  </article></SwipeRow>;
}

function NoteEditor({ initial, onSave }: { initial: string; onSave: (text: string) => void }) {
  const [text, setText] = useState(initial);
  return <div className="habit-note-edit">
    <input value={text} maxLength={200} autoFocus placeholder="Ex. le podcast écouté, le livre lu…" aria-label="Note du jour" onChange={(ev) => setText(ev.target.value)} onKeyDown={(ev) => { if (ev.key === 'Enter') onSave(text.trim()); }} />
    <button className="button secondary small" onClick={() => onSave(text.trim())}>Enregistrer</button>
  </div>;
}

/** Habitudes archivées : historique et badges gardés, réactivables. */
function Archived({ items, onUpdate, onRemove }: { items: Entry[]; onUpdate: Save; onRemove: (e: Entry) => Promise<void> }) {
  return <details className="habit-archive"><summary>Archivées ({items.length})</summary>
    {items.map((e) => { const total = Object.values(habitDone(e)).filter(Boolean).length;
      return <div key={e.id} className="habit-archive-row"><span><strong>{e.title}</strong><small className="muted">{total} fois · archivée le {shortDate(String(e.data.archived))}</small></span>
        <button className="link-btn small" onClick={() => void onUpdate(e, { ...e.data, archived: null })}>Réactiver</button>
        <button className="icon-btn" aria-label={'Supprimer ' + e.title} onClick={() => void onRemove(e)}><Trash2 size={16} /></button></div>; })}
  </details>;
}

/** Juste après avoir coché : mon intention (niyya) et l'habitude enchaînée qui suit. */
function AfterCheck({ done, next, onDo, onClose }: { done?: Entry; next: Entry[]; onDo: (e: Entry) => void; onClose: () => void }) {
  const niyya = String(done?.data.niyya ?? '').trim();
  if (!done || (!niyya && !next.length)) return null;
  return <div className="habit-toast" role="status">
    <button className="icon-btn" aria-label="Fermer" onClick={onClose}><X size={16} /></button>
    {niyya && <p><span className="muted">Mon intention</span><em>« {niyya} »</em></p>}
    {next.map((x) => <div key={x.id} className="habit-toast-next"><span>Et maintenant : <strong>{x.title}</strong></span>
      <button className="button secondary small" onClick={() => onDo(x)}>C’est fait</button></div>)}
  </div>;
}

/** Habitudes saisonnières en sommeil : elles reviennent seules à leur saison. */
function Sleeping({ items }: { items: Entry[] }) {
  return <details className="habit-archive"><summary>En sommeil jusqu’à leur saison ({items.length})</summary>
    {items.map((e) => <div key={e.id} className="habit-archive-row"><span><strong>{e.title}</strong><small className="muted">Revient {seasonLabel(habitSeason(e)!)}</small></span></div>)}
  </details>;
}

/** Calendrier du mois : jours faits, jours de pause, notes ; toucher un jour passé le coche ou le décoche. */
function HabitMonth({ habit, today, ctx, onToggle }: { habit: Entry; today: string; ctx: HabitCtx; onToggle: (d: string, on: boolean) => void }) {
  const [month, setMonth] = useState(monthStartOf(today));
  const done = habitDone(habit), notes = habitNotes(habit);
  const lead = (new Date(month + 'T12:00:00').getDay() + 6) % 7, len = new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0).getDate();
  const cells = Array.from({ length: len }, (_, i) => month.slice(0, 8) + String(i + 1).padStart(2, '0'));
  const shift = (k: number) => { const d = new Date(month + 'T12:00:00'); d.setMonth(d.getMonth() + k); setMonth(monthStartOf(isoOf(d))); };
  const count = cells.filter((d) => done[d]).length, monthNotes = cells.filter((d) => notes[d]);
  return <div className="habit-month">
    <div className="habit-month-head"><button className="icon-btn" aria-label="Mois précédent" onClick={() => shift(-1)}><ChevronLeft size={18} /></button>
      <strong>{new Date(month + 'T12:00:00').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</strong>
      <button className="icon-btn" aria-label="Mois suivant" disabled={month >= monthStartOf(today)} onClick={() => shift(1)}><ChevronRight size={18} /></button></div>
    <div className="habit-month-grid">{LETTERS.map((l, i) => <small key={'h' + i}>{l}</small>)}
      {Array.from({ length: lead }, (_, i) => <span key={'b' + i} />)}
      {cells.map((d) => <button key={d} type="button" disabled={d > today} aria-pressed={Boolean(done[d])} aria-label={(done[d] ? 'Décocher le ' : 'Cocher le ') + shortDate(d)}
        className={(done[d] ? 'on' : '') + (isResting(habit, d, ctx) ? ' paused' : '') + (d === today ? ' today' : '') + (notes[d] ? ' noted' : '')} onClick={() => onToggle(d, !done[d])}>{Number(d.slice(8))}</button>)}</div>
    <p className="muted">{count} {count > 1 ? 'fois' : 'fois'} ce mois-ci</p>
    {monthNotes.length > 0 && <ul className="habit-month-notes">{monthNotes.map((d) => <li key={d}><b>{shortDate(d)}</b> {notes[d]}</li>)}</ul>}
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

/** Créer ou modifier une habitude : nom, symbole, fréquence, moment, objectif chiffré, étapes, intensité, pourquoi. */
function HabitForm({ initial, heading = 'Ma nouvelle habitude', submit = 'Ajouter mon habitude', onSave, onClose }: { initial?: HabitDraft; heading?: string; submit?: string; onSave: (t: HabitDraft) => Promise<void>; onClose: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [icon, setIcon] = useState<GlyphName>(initial?.icon ?? 'sprout');
  const [rule, setRule] = useState<HabitRule>(initial?.rule ?? { type: 'daily', n: 1 });
  const [moment, setMoment] = useState<HabitMoment | ''>(initial?.moment ?? '');
  const [target, setTarget] = useState(initial?.goal ? String(initial.goal.target) : '');
  const [unit, setUnit] = useState(initial?.goal?.unit ?? '');
  const [source, setSource] = useState<Goal['source']>(initial?.goal?.source ?? '');
  const [steps, setSteps] = useState((initial?.steps ?? []).join('\n'));
  const [prayer, setPrayer] = useState(initial?.prayer ?? '');
  const [season, setSeason] = useState<HabitSeason | null>(initial?.season ?? null);
  const [cycleRest, setCycleRest] = useState(initial?.cycleRest ?? false);
  const year = new Date().getFullYear();
  const [level, setLevel] = useState<HabitLevel>(initial?.level ?? 'Douce');
  const [why, setWhy] = useState(initial?.why ?? '');
  const [niyya, setNiyya] = useState(initial?.niyya ?? '');
  const [busy, setBusy] = useState(false);
  const icons = ICONS.includes(icon) ? ICONS : [icon, ...ICONS];
  const t = Math.round(Number(target));
  const goal: Goal | null = t >= 2 ? { target: Math.min(100000, t), unit: unit.trim().slice(0, 20), source } : null;
  return <div className="screen habits">
    <header className="screen-header"><button className="icon-btn back" onClick={onClose} aria-label="Retour"><X size={22} /></button><h1>{heading}</h1></header>
    <div className="form-stack">
      <label>Nom<input value={title} maxLength={80} placeholder="Ex. Marcher après le déjeuner" onChange={(e) => setTitle(e.target.value)} /></label>
      <fieldset className="gfield"><legend>Symbole</legend><div className="gchips">{icons.map((x) =>
        <button type="button" key={x} className={'gchip icon' + (icon === x ? ' on' : '')} aria-label={x} onClick={() => setIcon(x)}><Glyph name={x} tint="sauge" size={20} /></button>)}</div></fieldset>
      <FreqPicker value={rule} onChange={setRule} />
      <fieldset className="gfield"><legend>Moment de la journée</legend><div className="gchips">{[{ id: '' as const, label: 'Toute la journée' }, ...MOMENTS].map((m) =>
        <button type="button" key={m.id || 'all'} className={'gchip' + (moment === m.id ? ' on' : '')} onClick={() => setMoment(m.id)}>{m.label}</button>)}</div></fieldset>
      <fieldset className="gfield"><legend>Objectif chiffré (facultatif)</legend>
        <div className="habit-goal-fields"><input inputMode="numeric" value={target} placeholder="Ex. 6" aria-label="Combien par jour" onChange={(e) => setTarget(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} />
          <input value={unit} maxLength={20} placeholder="verres, pages, minutes…" aria-label="Unité" onChange={(e) => setUnit(e.target.value)} /></div>
        <small className="muted">Un compteur remplace la simple coche : l’habitude est faite quand le nombre est atteint.</small>
        {t >= 2 && <label className="habit-remind">Remplir avec
          <select value={source} onChange={(e) => { const v = e.target.value as Goal['source']; setSource(v); if (v && !unit.trim()) setUnit(v === 'pas' ? 'pas' : 'verres'); }}>
            <option value="">rien, je compte moi-même</option><option value="pas">mes pas (Santé iPhone)</option><option value="eau">mes verres d’eau</option></select></label>}</fieldset>
      <label>Après une prière (facultatif)<select value={prayer} onChange={(e) => setPrayer(e.target.value)}>
        <option value="">Aucune</option>{PRAYER_LINKS.map((p) => <option key={p} value={p}>Après {p}</option>)}</select></label>
      <fieldset className="gfield"><legend>Saison</legend><div className="gchips">
        <button type="button" className={'gchip' + (!season ? ' on' : '')} onClick={() => setSeason(null)}>Toute l’année</button>
        <button type="button" className={'gchip' + (season?.type === 'ramadan' ? ' on' : '')} onClick={() => setSeason({ type: 'ramadan' })}>Pendant le Ramadan</button>
        <button type="button" className={'gchip' + (season?.type === 'dates' ? ' on' : '')} onClick={() => setSeason({ type: 'dates', from: '12-01', to: '02-28' })}>Une période de l’année</button></div>
        {season?.type === 'dates' && <div className="habit-goal-fields season-fields">
          <input type="date" aria-label="Du" value={year + '-' + season.from} onChange={(e) => e.target.value && setSeason({ ...season, from: e.target.value.slice(5) })} />
          <input type="date" aria-label="Au" value={year + '-' + season.to} onChange={(e) => e.target.value && setSeason({ ...season, to: e.target.value.slice(5) })} /></div>}
        <small className="muted">Hors saison, l’habitude se met en sommeil toute seule et revient au bon moment.</small></fieldset>
      <label className="habit-remind"><input type="checkbox" checked={cycleRest} onChange={(e) => setCycleRest(e.target.checked)} /> Repos pendant mes règles (5 premiers jours du cycle noté)</label>
      <label>Étapes (facultatif, une par ligne)<textarea rows={3} value={steps} placeholder={'Démaquiller\nSérum\nCrème de nuit'} onChange={(e) => setSteps(e.target.value)} /></label>
      <fieldset className="gfield"><legend>Intensité</legend><div className="gchips">{(['Douce', 'Modérée', 'Engagée'] as HabitLevel[]).map((l) =>
        <button type="button" key={l} className={'gchip' + (level === l ? ' on' : '')} onClick={() => setLevel(l)}>{l}</button>)}</div></fieldset>
      <label>Pourquoi elle compte pour moi (facultatif)<input value={why} maxLength={140} onChange={(e) => setWhy(e.target.value)} /></label>
      <label>Mon intention, ma niyya (facultatif)<input value={niyya} maxLength={160} placeholder="Ex. Prendre soin du corps qu’Allah m’a confié" onChange={(e) => setNiyya(e.target.value)} /></label>
      <button className="button primary wide" disabled={busy || !title.trim()} onClick={async () => { setBusy(true); try {
        await onSave({ title: title.trim(), icon, tint: initial?.tint ?? 'sauge', rule, level, why: why.trim(), moment, goal, steps: steps.split('\n').map((x) => x.trim()).filter(Boolean).slice(0, 12), prayer, season, cycleRest, niyya });
      } finally { setBusy(false); } }}>{busy ? 'Enregistrement…' : submit}</button>
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
function HabitStats({ habits, ctx, onUpdate }: { habits: Entry[]; ctx: HabitCtx; onUpdate: Save }) {
  const today = isoOf(new Date());
  const from = addDays(today, -89);
  if (!habits.length) return <p className="muted">Ajoute des habitudes pour voir tes statistiques.</p>;
  const month = monthReview(habits, today, ctx);
  const { prefs } = useIntegrationPrefs();
  const [question, setQuestion] = useState(''), [answer, setAnswer] = useState(''), [asking, setAsking] = useState(false), [askError, setAskError] = useState('');
  const ask = async () => {
    setAsking(true); setAskError('');
    try { setAnswer(await askAssistant(question.trim() || 'Analyse mon mois d’habitudes et propose-moi un ajustement.', { context: coachHabits(habits, month.rows, today, ctx) })); }
    catch { setAskError('Le coach n’a pas pu répondre. Réessaie dans un moment.'); } finally { setAsking(false); }
  };
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
    {month.rows.length > 0 && <section className="ritual-card"><p className="ritual-label">Mon mois de {new Date(today + 'T12:00:00').toLocaleDateString('fr-FR', { month: 'long' })}</p>
      {month.best && <p className="sleep-insight">La plus régulière : <strong>{month.best.e.title}</strong> ({Math.round(month.best.rate * 100)} %).</p>}
      {month.struggling && <p className="sleep-insight">Celle qui décroche : <strong>{month.struggling.e.title}</strong> ({Math.round(month.struggling.rate * 100)} %).
        {month.suggestion ? <> Et si tu passais à « {ruleLabel(month.suggestion).toLowerCase()} » ? Plus doux, et ça compte autant.</> : <> Une pause ou un autre moment de la journée l’aiderait peut-être.</>}</p>}
      {month.struggling && month.suggestion && <button className="button secondary small" onClick={() => void onUpdate(month.struggling!.e, { ...month.struggling!.e.data, ...ruleData(month.suggestion!) })}>Ajuster à « {ruleLabel(month.suggestion).toLowerCase()} »</button>}
      {month.rows.map(({ e, rate, count }) => <div key={e.id} className="habit-rate"><span>{e.title}</span><Bar value={rate} tone="olive" /><small>{Math.round(rate * 100)} % · {count} fois</small></div>)}</section>}
    <section className="ritual-card"><p className="ritual-label">Mon coach habitudes</p>
      {!prefs.assistant ? <p className="privacy-hint">Le coach utilise l’assistant IA. Active-le dans Profil → Centre de confidentialité pour lui demander un bilan.</p> : <>
        <p className="muted">Il lit seulement tes habitudes (noms, fréquences, régularité du mois) quand tu lui demandes.</p>
        <input value={question} maxLength={300} placeholder="Ta question (facultatif) : pourquoi je décroche le soir ?" aria-label="Question au coach" onChange={(e) => setQuestion(e.target.value)} />
        <button className="button secondary small" disabled={asking} onClick={() => void ask()}>{asking ? 'Le coach réfléchit…' : 'Demander au coach'}</button>
        {askError && <p className="fineprint" role="alert">{askError}</p>}
        {answer && <p className="coach-answer">{answer}</p>}</>}
    </section>
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

const WEEKDAYS_LOWER = WEEKDAYS.map((w) => w.toLowerCase());

/** Jours de répétition (quotidienne), rappel (jour de la semaine ou du mois pour les objectifs par semaine ou par mois), pause et archive. */
function HabitSettings({ habit, today, prayerTime, onSave }: { habit: Entry; today: string; prayerTime?: string; onSave: (d: Record<string, unknown>) => void }) {
  const prayer = habitPrayer(habit);
  const days = habitDays(habit), all = !days.length || days.length === 7, r = habitRule(habit);
  const remind = (habit.data.remind ?? {}) as { on?: boolean; time?: string; day?: number; mday?: number; after?: number };
  const pause = habitPause(habit), [until, setUntil] = useState(addDays(today, 6));
  const setRemind = (patch: Record<string, unknown>) => onSave({ remind: { ...remind, time: remind.time ?? '08:00', ...patch } });
  const toggle = (i: number) => { const cur = all ? [0, 1, 2, 3, 4, 5, 6] : days; const next = cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i].sort(); if (next.length) onSave({ days: next.length === 7 ? [] : next }); };
  return <div className="habit-settings">
    {r.type === 'daily' && <><p className="ritual-label">Répéter le</p>
      <div className="day-chips">{DAY_LETTERS.map((l, i) => { const on = all || days.includes(i);
        return <button key={i} type="button" className={'day-chip' + (on ? ' on' : '')} aria-pressed={on} aria-label={WEEKDAYS_LOWER[i]} onClick={() => toggle(i)}>{l}</button>; })}</div></>}
    <label className="habit-remind"><input type="checkbox" checked={Boolean(remind.on)} onChange={(ev) => setRemind({ on: ev.target.checked })} /> Me le rappeler
      {remind.on && !prayer && <input type="time" value={remind.time ?? '08:00'} onChange={(ev) => setRemind({ on: true, time: ev.target.value })} />}
      {remind.on && prayer && <select value={Number(remind.after ?? 10)} onChange={(ev) => setRemind({ after: Number(ev.target.value) })}>{[0, 5, 10, 15, 30, 45, 60].map((m) =>
        <option key={m} value={m}>{m ? m + ' min après ' + prayer : 'à l’heure de ' + prayer}</option>)}</select>}</label>
    {remind.on && prayer && <small className="muted">{prayerTime ? 'Aujourd’hui, ' + prayer + ' est à ' + prayerTime + '.' : 'Enregistre ta position dans Ma spiritualité pour caler le rappel sur l’horaire du jour ; sinon, il part à ' + (remind.time ?? '08:00') + '.'}</small>}
    {remind.on && r.type === 'week' && <label className="habit-remind">si ce n’est pas fait, le
      <select value={Number.isInteger(remind.day) ? remind.day : 6} onChange={(ev) => setRemind({ day: Number(ev.target.value) })}>{WEEKDAYS_LOWER.map((w, i) => <option key={w} value={i}>{w}</option>)}</select></label>}
    {remind.on && r.type === 'month' && <label className="habit-remind">si ce n’est pas fait,
      <select value={Number(remind.mday) || 0} onChange={(ev) => setRemind({ mday: Number(ev.target.value) })}>
        <option value={0}>les 3 derniers jours</option>
        {Array.from({ length: 28 }, (_, i) => <option key={i + 1} value={i + 1}>le {i + 1} du mois</option>)}</select></label>}
    <p className="ritual-label">Pause</p>
    {pause && pause.to >= today
      ? <div className="habit-pause"><span>En pause du {shortDate(pause.from)} au {shortDate(pause.to)}. Ta série reste intacte.</span><button className="link-btn small" onClick={() => onSave({ pause: null })}>Reprendre maintenant</button></div>
      : <div className="habit-pause"><span>Jusqu’au</span><input type="date" value={until} min={today} onChange={(ev) => setUntil(ev.target.value)} />
        <button className="link-btn small" disabled={!until || until < today} onClick={() => onSave({ pause: { from: today, to: until } })}>Mettre en pause</button></div>}
    <button className="link-btn small habit-archive-btn" onClick={() => onSave({ archived: today })}><Archive size={14} /> Archiver cette habitude</button>
  </div>;
}
