import { useMemo, useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { CATEGORIES, dayNumber, templateById, templateLength, TEMPLATES, type ChallengeCategory } from '../lib/challenges';
import { HeroPhoto } from './HeroPhoto';
import { EXERCISES, GROUPS, type ExerciseGroup } from '../lib/exercises';

type Progress = Record<string, { status: string; notes?: string }>;
const today = () => new Date().toLocaleDateString('en-CA');
const progressOf = (e: Entry) => (e.data.progress && typeof e.data.progress === 'object' ? e.data.progress : {}) as Progress;
const categoryOf = (e: Entry): ChallengeCategory => {
  const c = e.data.category;
  return c === 'Bien-être' || c === 'Habitudes' ? c : templateById(e.data.template)?.category ?? 'Sport';
};

export function ChallengesBoard({ entries, onCreate, onUpdate }: { entries: Entry[]; onCreate: (input: EntryInput) => Promise<void>; onUpdate: (entry: Entry, data: Record<string, unknown>) => Promise<void> }) {
  const [tab, setTab] = useState<ChallengeCategory>('Sport');
  const [focus, setFocus] = useState<string | null>(null);
  const [busy, setBusy] = useState('');
  const challenges = entries.filter((e) => e.kind === 'challenge');
  const inTab = challenges.filter((e) => categoryOf(e) === tab);
  const active = inTab.find((e) => e.id === focus) ?? inTab[0];
  const startedIds = new Set(challenges.map((e) => e.data.template));

  const start = async (id: string) => {
    const t = templateById(id);
    if (!t) return;
    setBusy(id);
    try {
      const startDate = today();
      await onCreate({ module: 'challenges', kind: 'challenge', title: t.title, entry_date: startDate,
        data: { template: t.id, category: t.category, discipline: t.discipline, days: String(templateLength(t.id)), start: startDate, plan: t.tagline, progress: {} } });
    } finally { setBusy(''); }
  };

  return <section className="challenges-board">
    <div className="pill-tabs" role="tablist">{CATEGORIES.map((c) =>
      <button key={c} role="tab" aria-selected={tab === c} className={tab === c ? 'active' : ''} onClick={() => { setTab(c); setFocus(null); }}>{c}</button>)}</div>
    {active ? <ActiveChallenge key={active.id} entry={active} onUpdate={onUpdate} /> : <p className="muted">Aucun défi en cours dans cette catégorie. Choisis-en un ci-dessous.</p>}
    {inTab.length > 1 && <div className="challenge-switch">{inTab.map((e) =>
      <button key={e.id} className={e.id === active?.id ? 'active' : ''} onClick={() => setFocus(e.id)}>{e.title}</button>)}</div>}
    <h3 className="board-subtitle">Commencer un défi</h3>
    <div className="template-grid">{TEMPLATES.filter((t) => t.category === tab).map((t) =>
      <article key={t.id} className="template-card">
        <HeroPhoto slot={'challenge-' + t.id} tone={t.tone} label={t.discipline === 'Autre' ? t.category : t.discipline} compact />
        <div className="template-body"><strong>{t.title}</strong><span className="muted">{t.tagline}</span>
          <button className="button ghost" disabled={Boolean(busy) || startedIds.has(t.id)} onClick={() => void start(t.id)}>
            {startedIds.has(t.id) ? 'En cours' : busy === t.id ? '…' : 'Commencer'}</button></div>
      </article>)}</div>
    {tab === 'Sport' && <ExerciseLibrary />}
  </section>;
}

function ExerciseLibrary() {
  const [group, setGroup] = useState<ExerciseGroup>('Abdos');
  return <div className="exercise-library">
    <h3 className="board-subtitle">Bibliothèque d’exercices</h3>
    <div className="challenge-switch">{GROUPS.map((g) => <button key={g} className={g === group ? 'active' : ''} onClick={() => setGroup(g)}>{g}</button>)}</div>
    <div className="lesson-grid">{EXERCISES[group].map((ex) => <article className="lesson-card exercise-card" key={ex.name}>
      <h3>{ex.name}</h3><p>{ex.how}</p><p className="exercise-tip">{ex.tip}</p></article>)}</div>
    <p className="fineprint">Au poids du corps ou avec des bouteilles d’eau. Échauffe-toi, respire et arrête un exercice douloureux ; en cas de doute, demande conseil à un professionnel.</p>
  </div>;
}

function ActiveChallenge({ entry, onUpdate }: { entry: Entry; onUpdate: (entry: Entry, data: Record<string, unknown>) => Promise<void> }) {
  const t = templateById(entry.data.template);
  const days = Math.min(30, Math.max(7, Number(entry.data.days) || 30));
  const startDate = typeof entry.data.start === 'string' ? entry.data.start : entry.entry_date ?? today();
  const current = Math.min(days, dayNumber(startDate, today()));
  const progress = progressOf(entry);
  const done = Object.values(progress).filter((p) => p.status === 'done').length;
  const [selected, setSelected] = useState<number | null>(null);
  const plan = useMemo(() => (n: number) => t ? t.day(n) : (typeof entry.data.plan === 'string' ? entry.data.plan : ''), [t, entry.data.plan]);

  const mark = async (day: number, status: string) => {
    await onUpdate(entry, { ...entry.data, progress: { ...progress, [day]: { ...(progress[String(day)] ?? {}), status } } });
  };
  const shown = selected ?? (current || 1);
  const shownPlan = plan(shown);
  const state = progress[String(shown)]?.status ?? 'not_done';

  return <article className="active-challenge">
    <HeroPhoto slot={'challenge-' + (t?.id ?? 'custom')} tone={t?.tone ?? 'caramel'} label={String(entry.data.discipline || 'Défi')}>
      <div className="hero-title"><h2>{entry.title}</h2>{t && <span>{t.tagline}</span>}</div>
    </HeroPhoto>
    <div className="active-head"><span className="muted">{current ? `Jour ${current} sur ${days}` : 'Commence bientôt'}</span><strong>{done}/{days} jours</strong></div>
    <div className="progress-track"><div style={{ width: (100 * done / days) + '%' }} /></div>
    <div className="day-dots">{Array.from({ length: days }, (_, i) => {
      const n = i + 1, s = progress[String(n)]?.status ?? (t && t.day(n) === null ? 'planned-rest' : 'todo');
      return <button key={n} className={['day-dot', s, n === current ? 'today' : '', n === shown ? 'selected' : ''].join(' ')}
        onClick={() => setSelected(n)} aria-label={`Jour ${n} : ${s === 'done' ? 'réalisé' : s === 'rest' || s === 'planned-rest' ? 'repos' : 'à faire'}`}>
        {s === 'done' ? <Check size={15} strokeWidth={3} /> : n}</button>;
    })}</div>
    <div className="dot-legend"><span><i className="day-dot done" /> Réalisé</span><span><i className="day-dot rest" /> Repos</span><span><i className="day-dot todo" /> Non réalisé</span></div>
    <div className="day-session">
      <span className="eyebrow">{shown === current ? 'SÉANCE DU JOUR' : 'JOUR ' + shown}</span>
      <p>{shownPlan ?? 'Jour de repos prévu : récupère, étire-toi doucement si tu en as envie.'}</p>
      <div className="button-group">
        <button className={state === 'done' ? 'button primary' : 'button ghost'} onClick={() => void mark(shown, 'done')}>Réalisé</button>
        <button className={state === 'rest' ? 'button secondary' : 'button ghost'} onClick={() => void mark(shown, 'rest')}>Repos</button>
        <button className={state === 'not_done' ? 'button secondary' : 'button ghost'} onClick={() => void mark(shown, 'not_done')}>Non réalisé</button>
      </div>
      <p className="fineprint">Un jour manqué n’efface rien : reprends simplement où tu en es. Écoute tes sensations et adapte l’intensité.</p>
    </div>
    {selected !== null && selected !== current && current > 0 &&
      <button className="button primary wide" onClick={() => setSelected(null)}>Voir la séance du jour <ChevronRight size={16} /></button>}
  </article>;
}
