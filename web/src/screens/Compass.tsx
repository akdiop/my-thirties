import { useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Plus, Trash2, Trophy } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { saveLabel, useAutosave } from '../lib/autosave';
import { readProfile } from '../lib/profile';
import { DAILY_KIND, HABIT_KIND, habitDone, isoOf, MOODS, NOTE_KIND } from '../lib/rituals';
import { isDoneOn } from '../lib/day';
import { DOMAIN_QUESTIONS, GOAL_KIND, goalHabits, goalProgress, goalSteps, LIFE_DOMAINS, monthKey, VISION_KIND, WHEEL_KIND, wheelScores, type GoalStep, type LifeDomain } from '../lib/growth';
import { moodOn } from './Review';
import { Bar, Segmented } from '../ui/kit';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
type Tab = 'vision' | 'objectifs' | 'roue' | 'retro';

/** Ma boussole : ce qui compte, où je vais, comment je me sens dans chaque domaine, et le chemin parcouru. */
export function Compass({ entries, profileEntry, onCreate, onUpdate, onRemove, onEditProfile }: {
  entries: Entry[]; profileEntry: Entry | undefined; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save;
  onRemove: (e: Entry) => Promise<void>; onEditProfile: () => void;
}) {
  const [tab, setTab] = useState<Tab>('vision');
  return <div className="screen compass">
    <header className="tab-head"><h1>Ma boussole</h1><p>Qui je veux devenir, et le chemin parcouru</p></header>
    <Segmented label="Boussole" value={tab} onChange={setTab} options={[
      { value: 'vision', label: 'Vision' }, { value: 'objectifs', label: 'Objectifs' }, { value: 'roue', label: 'Roue' }, { value: 'retro', label: 'Rétro' }]} />
    {tab === 'vision' && <Vision entries={entries} profileEntry={profileEntry} onCreate={onCreate} onUpdate={onUpdate} onEditProfile={onEditProfile} />}
    {tab === 'objectifs' && <Goals entries={entries} onCreate={onCreate} onUpdate={onUpdate} onRemove={onRemove} />}
    {tab === 'roue' && <Wheel entries={entries} onCreate={onCreate} onUpdate={onUpdate} />}
    {tab === 'retro' && <Retro entries={entries} />}
  </div>;
}

/* ---------- 1. Vision ---------- */
const LIFE_PATH_DEFAULT = 'Mon grand thème : m’exprimer, avec le cœur autant qu’avec la tête.\n'
  + 'Mes forces : une grande sensibilité, de l’intuition, de la force intérieure, le talent d’encourager et d’inspirer les autres.\n'
  + 'Mon défi : dépasser le doute de moi et le perfectionnisme, ne pas me décourager, et transformer la critique en propositions.\n'
  + 'Ma piste : oser prendre la parole (écrire, parler, créer), en commençant par un petit cercle, et me concentrer sur les solutions.';

function Vision({ entries, profileEntry, onCreate, onUpdate, onEditProfile }: { entries: Entry[]; profileEntry: Entry | undefined; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; onEditProfile: () => void }) {
  const entry = entries.find((e) => e.kind === VISION_KIND);
  const profile = readProfile(profileEntry);
  const init = (k: string) => String(entry?.data[k] ?? '');
  const [words, setWords] = useState(init('words'));
  const [year1, setYear1] = useState(init('year1'));
  const [year5, setYear5] = useState(init('year5'));
  const [who, setWho] = useState(init('who'));
  const [notList, setNotList] = useState(init('notList'));
  const [lifePath, setLifePath] = useState(init('lifePath') || LIFE_PATH_DEFAULT);
  const [touched, setTouched] = useState(false);
  const t = (f: (v: string) => void) => (v: string) => { f(v); setTouched(true); };
  const draft = useMemo(() => touched ? { words, year1, year5, who, notList, lifePath } : null, [touched, words, year1, year5, who, notList, lifePath]);
  const state = useAutosave(entry, draft, () => onCreate({ module: 'equilibre', kind: VISION_KIND, title: 'Ma vision', entry_date: null, data: draft! }), onUpdate);
  const goals = entries.filter((e) => e.kind === GOAL_KIND && goalProgress(e) < 1);

  return <div className="compass-body">
    <section className="ritual-card">
      <p className="ritual-label">Ce qui compte pour moi</p>
      {profile.values.length ? <div className="chip-row">{profile.values.map((v) => <span key={v} className="chip on static">{v}</span>)}</div>
        : <p className="muted">Choisis tes valeurs dans ton profil.</p>}
      <button className="link-btn" onClick={onEditProfile}>Modifier mes valeurs</button>
    </section>
    <section className="ritual-card life-path">
      <p className="ritual-label">Mon chemin de vie · 30/3</p>
      <p className="muted small">Expression et sensibilité, avec des dons intérieurs (d’après Life Purpose App). Résumé à ma façon, modifiable :</p>
      <textarea rows={6} value={lifePath} maxLength={2000} onChange={(e) => t(setLifePath)(e.target.value)} />
    </section>
    <Field label="Mes 3 mots pour cette année" hint="Par exemple : sereine, audacieuse, alignée" value={words} onChange={t(setWords)} rows={1} />
    <Field label="Dans 1 an, ma vie ressemble à…" hint="Décris une journée type, ce que tu ressens, ce qui a changé." value={year1} onChange={t(setYear1)} rows={4} />
    <Field label="Dans 5 ans, je suis…" hint="Où tu vis, ce que tu fais, qui t’entoure, ce dont tu es fière." value={year5} onChange={t(setYear5)} rows={4} />
    <Field label="La femme que je deviens" hint="Ses habitudes, sa façon de parler, de prendre soin d’elle." value={who} onChange={t(setWho)} rows={3} />
    <Field label="Ce que je ne veux plus" hint="Ce que tu laisses derrière toi." value={notList} onChange={t(setNotList)} rows={2} />
    {goals.length > 0 && <section className="ritual-card"><p className="ritual-label">Mes objectifs en cours</p>
      {goals.map((g) => <div key={g.id} className="goal-mini"><span>{g.title}</span><Bar value={goalProgress(g)} tone="caramel" /></div>)}
    </section>}
    <p className="save-state" aria-live="polite">{saveLabel(state) || 'Tout s’enregistre automatiquement.'}</p>
  </div>;
}

function Field({ label, hint, value, onChange, rows }: { label: string; hint: string; value: string; onChange: (v: string) => void; rows: number }) {
  return <label className="compass-field"><span>{label}</span>
    {rows === 1 ? <input value={value} maxLength={120} placeholder={hint} onChange={(e) => onChange(e.target.value)} />
      : <textarea rows={rows} value={value} maxLength={2000} placeholder={hint} onChange={(e) => onChange(e.target.value)} />}
  </label>;
}

/* ---------- 2. Objectifs à jalons ---------- */
const uid = () => Math.random().toString(36).slice(2, 10);

function Goals({ entries, onCreate, onUpdate, onRemove }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; onRemove: (e: Entry) => Promise<void> }) {
  const goals = entries.filter((e) => e.kind === GOAL_KIND);
  const habits = entries.filter((e) => e.kind === HABIT_KIND);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState(''), [domain, setDomain] = useState<string>(LIFE_DOMAINS[0]), [why, setWhy] = useState(''), [deadline, setDeadline] = useState('');
  const [steps, setSteps] = useState('');
  const [busy, setBusy] = useState(false);
  const active = goals.filter((g) => goalProgress(g) < 1 || !goalSteps(g).length);
  const reached = goals.filter((g) => goalSteps(g).length && goalProgress(g) >= 1);

  const create = async () => {
    if (!title.trim()) return;
    setBusy(true);
    try {
      const list: GoalStep[] = steps.split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 20).map((text) => ({ id: uid(), text: text.slice(0, 160), done: false }));
      await onCreate({ module: 'equilibre', kind: GOAL_KIND, title: title.trim().slice(0, 170), entry_date: deadline || null, data: { domain, why: why.trim(), deadline, steps: list, habits: [] } });
      setTitle(''); setWhy(''); setDeadline(''); setSteps(''); setCreating(false);
    } finally { setBusy(false); }
  };

  return <div className="compass-body">
    {active.map((g) => <GoalCard key={g.id} goal={g} habits={habits} onUpdate={onUpdate} onRemove={onRemove} />)}
    {!goals.length && !creating && <p className="muted">Un objectif devient concret quand il est découpé en petites étapes. Commence par un seul.</p>}
    {creating ? <section className="ritual-card form-stack">
      <p className="ritual-label">Nouvel objectif</p>
      <label>Mon objectif<input value={title} maxLength={170} onChange={(e) => setTitle(e.target.value)} placeholder="Précis et daté : courir 10 km d’ici juin, épargner 500 000 XOF…" /></label>
      <label>Domaine<select value={domain} onChange={(e) => setDomain(e.target.value)}>{LIFE_DOMAINS.map((d) => <option key={d}>{d}</option>)}</select></label>
      <label>Pourquoi c’est important pour moi<textarea rows={2} value={why} maxLength={500} onChange={(e) => setWhy(e.target.value)} /></label>
      <label>Échéance (facultatif)<input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} /></label>
      <label>Les étapes (une par ligne)<textarea rows={4} value={steps} onChange={(e) => setSteps(e.target.value)} placeholder={'Courir 3 km sans m’arrêter\nCourir 5 km\nCourir 8 km\nCourir 10 km'} /></label>
      <div className="button-group"><button className="button primary" disabled={busy || !title.trim()} onClick={() => void create()}>Créer l’objectif</button>
        <button className="button ghost" onClick={() => setCreating(false)}>Annuler</button></div>
    </section> : <button className="button secondary wide" onClick={() => setCreating(true)}><Plus size={16} /> Nouvel objectif</button>}
    {reached.length > 0 && <section><h3 className="habit-group">Objectifs atteints</h3>
      {reached.map((g) => <div key={g.id} className="goal-done"><Trophy size={16} /> <span>{g.title}</span></div>)}</section>}
  </div>;
}

function GoalCard({ goal, habits, onUpdate, onRemove }: { goal: Entry; habits: Entry[]; onUpdate: Save; onRemove: (e: Entry) => Promise<void> }) {
  const steps = goalSteps(goal), linked = goalHabits(goal);
  const [text, setText] = useState('');
  const [pickHabits, setPickHabits] = useState(false);
  const save = (patch: Record<string, unknown>) => onUpdate(goal, { ...goal.data, ...patch });
  const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return isoOf(d); });
  const domain = typeof goal.data.domain === 'string' ? goal.data.domain : '';
  const deadline = typeof goal.data.deadline === 'string' && goal.data.deadline ? new Date(goal.data.deadline + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  return <article className="goal-card">
    <div className="goal-head"><div><span className="pill">{domain}</span><h3>{goal.title}</h3>{deadline && <small className="muted">Avant le {deadline}</small>}</div>
      <button className="icon-btn" aria-label={'Supprimer ' + goal.title} onClick={() => { if (confirm('Supprimer l’objectif « ' + goal.title + ' » ?')) void onRemove(goal); }}><Trash2 size={16} /></button></div>
    {typeof goal.data.why === 'string' && goal.data.why && <p className="goal-why">« {goal.data.why} »</p>}
    <Bar value={goalProgress(goal)} tone="caramel" />
    <small className="muted">{steps.filter((s) => s.done).length} / {steps.length} étapes</small>
    <ul className="goal-steps">{steps.map((s) => <li key={s.id}>
      <button className={s.done ? 'on' : ''} aria-pressed={s.done} onClick={() => void save({ steps: steps.map((x) => x.id === s.id ? { ...x, done: !x.done } : x) })}>
        <span className="tick">{s.done ? <Check size={14} strokeWidth={3} /> : null}</span><span>{s.text}</span></button>
    </li>)}</ul>
    <div className="chip-other">
      <input value={text} maxLength={160} placeholder="Ajouter une étape" onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && text.trim()) { void save({ steps: [...steps, { id: uid(), text: text.trim(), done: false }] }); setText(''); } }} />
      <button className="button secondary" disabled={!text.trim()} onClick={() => { void save({ steps: [...steps, { id: uid(), text: text.trim(), done: false }] }); setText(''); }}><Plus size={16} /></button>
    </div>
    <div className="goal-habits">
      <p className="ritual-label">Habitudes qui m’y mènent</p>
      {linked.length ? linked.map((id) => { const h = habits.find((x) => x.id === id); if (!h) return null; const done = habitDone(h);
        return <div key={id} className="goal-habit"><span>{h.title}</span><small>{week.filter((d) => done[d]).length} / 7 jours</small></div>; })
        : <p className="muted">Aucune habitude liée.</p>}
      <button className="link-btn" onClick={() => setPickHabits(!pickHabits)}>{pickHabits ? 'Fermer' : 'Lier des habitudes'}</button>
      {pickHabits && (habits.length ? <div className="chip-row">{habits.map((h) => <button key={h.id} className={'chip' + (linked.includes(h.id) ? ' on' : '')}
        onClick={() => void save({ habits: linked.includes(h.id) ? linked.filter((x) => x !== h.id) : [...linked, h.id] })}>{h.title}</button>)}</div>
        : <p className="muted">Ajoute d’abord des habitudes dans l’onglet Habitudes.</p>)}
    </div>
  </article>;
}

/* ---------- 3. Roue de la vie ---------- */
function Wheel({ entries, onCreate, onUpdate }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save }) {
  const month = monthKey(isoOf(new Date()));
  const wheels = entries.filter((e) => e.kind === WHEEL_KIND && e.entry_date).sort((a, b) => String(a.entry_date).localeCompare(String(b.entry_date)));
  const current = wheels.find((e) => monthKey(String(e.entry_date)) === month);
  const previous = [...wheels].reverse().find((e) => monthKey(String(e.entry_date)) < month);
  const [scores, setScores] = useState<Partial<Record<LifeDomain, number>>>(wheelScores(current));
  const [touched, setTouched] = useState(false);
  const draft = useMemo(() => touched ? { scores, month } : null, [touched, scores, month]);
  const state = useAutosave(current, draft, () => onCreate({ module: 'equilibre', kind: WHEEL_KIND, title: 'Roue de la vie · ' + month, entry_date: month + '-01', data: draft! }), onUpdate);
  const prev = wheelScores(previous);
  const low = Object.keys(scores).length >= 4 ? [...LIFE_DOMAINS].filter((d) => scores[d] !== undefined).sort((a, b) => (scores[a] ?? 10) - (scores[b] ?? 10)).slice(0, 2) : [];
  const monthLabel = new Date(month + '-15T12:00:00').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  return <div className="compass-body">
    <p className="muted">Une fois par mois, note chaque domaine de ta vie de 1 à 10. Pas de bonne réponse : juste ton ressenti du moment.</p>
    <Radar now={scores} before={prev} />
    <p className="radar-legend"><span className="dot now" /> {monthLabel}{previous && <><span className="dot before" /> mois précédent</>}</p>
    {LIFE_DOMAINS.map((d) => { const v = scores[d] ?? 5; const delta = prev[d] !== undefined && scores[d] !== undefined ? (scores[d]! - prev[d]!) : null;
      return <label key={d} className="wheel-row"><small className="muted">{DOMAIN_QUESTIONS[d]}</small><span>{d}<strong>{scores[d] ?? '–'}{delta ? <small className={delta > 0 ? 'up' : 'down'}> {delta > 0 ? '+' : ''}{delta}</small> : null}</strong></span>
        <input type="range" min={1} max={10} value={v} onChange={(e) => { setScores({ ...scores, [d]: Number(e.target.value) }); setTouched(true); }} /></label>; })}
    {low.length > 0 && <p className="sleep-insight">Tes domaines les plus bas ce mois-ci : <strong>{low.join(' et ')}</strong>. Choisis-en un seul et crée un petit objectif dans l’onglet Objectifs : précis, mesurable, avec une date.</p>}
    <p className="save-state" aria-live="polite">{saveLabel(state) || 'Tout s’enregistre automatiquement.'}</p>
    {wheels.length > 1 && <section><h3 className="habit-group">Évolution de ma moyenne</h3>
      <div className="wheel-history">{wheels.slice(-6).map((w) => { const s = wheelScores(w); const vals = Object.values(s).filter((n): n is number => typeof n === 'number');
        const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
        return <div key={w.id} className="wheel-col"><span style={{ height: (avg * 10) + '%' }} /><small>{new Date(String(w.entry_date) + 'T12:00:00').toLocaleDateString('fr-FR', { month: 'short' })}</small><b>{avg.toFixed(1)}</b></div>; })}</div></section>}
  </div>;
}

function Radar({ now, before }: { now: Partial<Record<LifeDomain, number>>; before: Partial<Record<LifeDomain, number>> }) {
  const n = LIFE_DOMAINS.length, c = 150, r = 105;
  const pt = (i: number, v: number) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / n; return [c + Math.cos(a) * r * v / 10, c + Math.sin(a) * r * v / 10] as const; };
  const poly = (s: Partial<Record<LifeDomain, number>>) => LIFE_DOMAINS.map((d, i) => pt(i, s[d] ?? 0).join(',')).join(' ');
  const hasBefore = Object.keys(before).length > 0;
  return <svg className="radar" viewBox="-35 -5 370 310" role="img" aria-label="Roue de la vie">
    {[2, 4, 6, 8, 10].map((v) => <polygon key={v} points={LIFE_DOMAINS.map((_, i) => pt(i, v).join(',')).join(' ')} fill="none" stroke="#E6D9CA" strokeWidth={1} />)}
    {LIFE_DOMAINS.map((d, i) => { const [x, y] = pt(i, 10); const [lx, ly] = pt(i, 12.6);
      return <g key={d}><line x1={c} y1={c} x2={x} y2={y} stroke="#EFE5DA" /><text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#7A6355">{d}</text></g>; })}
    {hasBefore && <polygon points={poly(before)} fill="rgba(143,159,122,.18)" stroke="#8F9F7A" strokeDasharray="4 3" strokeWidth={1.5} />}
    <polygon points={poly(now)} fill="rgba(181,96,63,.25)" stroke="#B5603F" strokeWidth={2} />
  </svg>;
}

/* ---------- 4. Rétrospective du mois et de l'année ---------- */
function Retro({ entries }: { entries: Entry[] }) {
  const today = isoOf(new Date());
  const [period, setPeriod] = useState<'mois' | 'annee'>('mois');
  const [offset, setOffset] = useState(0);
  const range = useMemo(() => {
    const d = new Date(today + 'T12:00:00');
    if (period === 'mois') { const s = new Date(d.getFullYear(), d.getMonth() + offset, 1, 12); const e = new Date(d.getFullYear(), d.getMonth() + offset + 1, 0, 12);
      return { from: isoOf(s), to: isoOf(e), label: s.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) }; }
    const y = d.getFullYear() + offset; return { from: `${y}-01-01`, to: `${y}-12-31`, label: String(y) };
  }, [period, offset, today]);
  const inRange = (iso?: string | null) => Boolean(iso && iso >= range.from && iso <= range.to);
  const s = useMemo(() => {
    const days: string[] = []; for (let d = new Date(range.from + 'T12:00:00'); isoOf(d) <= range.to && isoOf(d) <= today; d.setDate(d.getDate() + 1)) days.push(isoOf(d));
    const moods = new Map<string, number>(); for (const d of days) { const m = moodOn(entries, d); if (m) moods.set(m, (moods.get(m) ?? 0) + 1); }
    const dailies = entries.filter((e) => e.kind === DAILY_KIND && inRange(e.entry_date));
    const wins = dailies.flatMap((e) => typeof e.data.win === 'string' && e.data.win.trim() ? [{ day: String(e.entry_date), text: e.data.win.trim() }] : []).sort((a, b) => a.day.localeCompare(b.day));
    const grats = dailies.reduce((n, e) => n + (Array.isArray(e.data.gratitudes) ? e.data.gratitudes.filter((g) => String(g).trim()).length : 0), 0);
    const habits = entries.filter((e) => e.kind === HABIT_KIND).map((e) => ({ title: e.title, n: days.filter((d) => habitDone(e)[d]).length })).filter((h) => h.n > 0).sort((a, b) => b.n - a.n);
    const tasks = entries.filter((e) => e.kind === 'task' && inRange(e.entry_date));
    const goalsDone = entries.filter((e) => e.kind === GOAL_KIND && goalSteps(e).length && goalProgress(e) >= 1 && inRange(e.updated_at?.slice(0, 10)));
    const notes = entries.filter((e) => e.kind === NOTE_KIND && inRange(e.entry_date)).length;
    const sport = entries.filter((e) => e.module === 'sport' && e.kind === 'session' && inRange(e.entry_date)).length;
    return { days: days.length, moods, wins, grats, habits, tasks: tasks.length, tasksDone: tasks.filter((e) => isDoneOn(e, String(e.entry_date))).length, goalsDone, notes, sport, journal: dailies.length };
  }, [entries, range, today]);
  const totalMoods = [...s.moods.values()].reduce((a, b) => a + b, 0);
  return <div className="compass-body">
    <Segmented label="Période" value={period} onChange={(p) => { setPeriod(p); setOffset(0); }} options={[{ value: 'mois', label: 'Mois' }, { value: 'annee', label: 'Année' }]} />
    <div className="retro-nav"><button className="icon-btn" aria-label="Précédent" onClick={() => setOffset(offset - 1)}><ChevronLeft size={20} /></button>
      <strong className="cap">{range.label}</strong>
      <button className="icon-btn" aria-label="Suivant" disabled={offset >= 0} onClick={() => setOffset(offset + 1)}><ChevronRight size={20} /></button></div>
    <div className="retro-stats">
      <div><b>{s.journal}</b><small>jours écrits</small></div>
      <div><b>{s.habits.reduce((a, h) => a + h.n, 0)}</b><small>habitudes cochées</small></div>
      <div><b>{s.tasksDone}/{s.tasks}</b><small>tâches faites</small></div>
      <div><b>{s.sport}</b><small>séances de sport</small></div>
      <div><b>{s.grats}</b><small>gratitudes</small></div>
      <div><b>{s.notes}</b><small>notes</small></div>
    </div>
    <section className="ritual-card"><p className="ritual-label">Mes humeurs</p>
      {totalMoods ? <div className="mood-bars">{MOODS.map((m) => { const n = s.moods.get(m.value) ?? 0; return n ? <div key={m.value} className="mood-bar"><span>{m.value}</span><Bar value={n / totalMoods} /><small>{n} j</small></div> : null; })}</div>
        : <p className="muted">Aucune humeur notée sur cette période.</p>}</section>
    {s.habits.length > 0 && <section className="ritual-card"><p className="ritual-label">Mes habitudes les plus tenues</p>
      {s.habits.slice(0, 6).map((h) => <div key={h.title} className="goal-habit"><span>{h.title}</span><small>{h.n} fois</small></div>)}</section>}
    {s.goalsDone.length > 0 && <section className="ritual-card"><p className="ritual-label">Objectifs atteints</p>
      {s.goalsDone.map((g) => <div key={g.id} className="goal-done"><Trophy size={16} /> <span>{g.title}</span></div>)}</section>}
    <section className="ritual-card"><p className="ritual-label">Mes victoires</p>
      {s.wins.length ? <ul className="retro-wins">{s.wins.slice(-30).map((w) => <li key={w.day + w.text}><small>{new Date(w.day + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</small> {w.text}</li>)}</ul>
        : <p className="muted">Note ta victoire du jour dans le débriefing du soir : elles apparaîtront ici.</p>}</section>
  </div>;
}
