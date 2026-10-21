import { useMemo, useState } from 'react';
import { BookOpen, Check, ChevronRight, Eye, LogOut, X } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { CATEGORIES, dayNumber, templateById, templateLength, TEMPLATES, type ChallengeCategory, type ChallengeTemplate } from '../lib/challenges';
import { STAY_ON_TRACK } from '../lib/challengePrograms';
import { pathById } from '../lib/learning';
import { HeroPhoto } from './HeroPhoto';
import { EXERCISES, GROUPS, type ExerciseGroup } from '../lib/exercises';

type Progress = Record<string, { status: string; notes?: string }>;
const today = () => new Date().toLocaleDateString('en-CA');
const progressOf = (e: Entry) => (e.data.progress && typeof e.data.progress === 'object' ? e.data.progress : {}) as Progress;
const categoryOf = (e: Entry): ChallengeCategory => {
  const c = e.data.category;
  return CATEGORIES.includes(c as ChallengeCategory) ? c as ChallengeCategory : templateById(e.data.template)?.category ?? 'Sport';
};

/** Méthode quotidienne : celle du programme, sinon une méthode type selon la catégorie. */
function howFor(t: ChallengeTemplate | undefined): string[] {
  if (t?.how) return t.how;
  switch (t?.category) {
    case 'Sport': return ['Échauffe-toi 3 minutes : rotations des bras, des hanches, montées de genoux.', 'Fais la séance du jour ci-dessus, en gardant une respiration régulière.', 'Si c’est trop dur, fais la moitié des répétitions : la régularité compte plus que le volume.', 'Termine par 2 minutes d’étirements et coche le jour.'];
    case 'Cuisine': return ['La veille, choisis la recette et vérifie ta liste de courses.', 'Prépare tous les ingrédients avant d’allumer le feu.', 'Cuisine, goûte, ajuste.', 'Note ce que tu changerais la prochaine fois et coche le jour.'];
    default: return ['Bloque un créneau fixe dans ta journée.', 'Fais l’action du jour ci-dessus.', 'Note en une phrase comment ça s’est passé.', 'Coche le jour.'];
  }
}

export function ChallengesBoard({ entries, onCreate, onUpdate, onQuit }: { entries: Entry[]; onCreate: (input: EntryInput) => Promise<void>; onUpdate: (entry: Entry, data: Record<string, unknown>) => Promise<void>; onQuit: (entry: Entry) => Promise<void> }) {
  const [tab, setTab] = useState<ChallengeCategory>('Sport');
  const [focus, setFocus] = useState<string | null>(null);
  const [busy, setBusy] = useState('');
  const challenges = entries.filter((e) => e.kind === 'challenge');
  const inTab = challenges.filter((e) => categoryOf(e) === tab);
  const active = inTab.find((e) => e.id === focus) ?? inTab[0];
  const startedIds = new Set(challenges.map((e) => e.data.template));
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const previewed = preview ? templateById(preview) : undefined;
  const suggestions = TEMPLATES.filter((t) => t.category === tab && !t.retired && (t.title + ' ' + t.discipline + ' ' + t.tagline).toLocaleLowerCase('fr').includes(search.trim().toLocaleLowerCase('fr')));

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
      <button key={c} role="tab" aria-selected={tab === c} className={tab === c ? 'active' : ''} onClick={() => { setTab(c); setFocus(null); setSearch(''); }}>{c}</button>)}</div>
    {active ? <ActiveChallenge key={active.id} entry={active} onUpdate={onUpdate} onQuit={async (e) => { await onQuit(e); setFocus(null); }} /> : <p className="muted">Aucun défi en cours dans cette catégorie. Choisis-en un ci-dessous.</p>}
    {inTab.length > 1 && <div className="challenge-switch">{inTab.map((e) =>
      <button key={e.id} className={e.id === active?.id ? 'active' : ''} onClick={() => setFocus(e.id)}>{e.title}</button>)}</div>}
    <h3 className="board-subtitle">Découvrir les suggestions ({suggestions.length})</h3>
    <label>Rechercher une suggestion <input type="search" value={search} placeholder="Langues, écriture, organisation…" onChange={(e) => setSearch(e.target.value)} /></label>
    <div className="template-grid">{suggestions.map((t) =>
      <article key={t.id} className="template-card">
        <HeroPhoto slot={'challenge-' + t.id} tone={t.tone} label={t.discipline === 'Autre' ? t.category : t.discipline} compact />
        <div className="template-body"><strong>{t.title}</strong><span className="muted">{t.tagline}</span>
          <div className="template-actions">
            <button className="button ghost" onClick={() => setPreview(t.id)}><Eye size={15} /> Voir</button>
            <button className="button ghost" disabled={Boolean(busy) || startedIds.has(t.id)} onClick={() => void start(t.id)}>
              {startedIds.has(t.id) ? 'En cours' : busy === t.id ? '…' : 'Commencer'}</button>
          </div></div>
      </article>)}</div>
    {tab === 'Sport' && <ExerciseLibrary />}
    {previewed && <ChallengePreview t={previewed} started={startedIds.has(previewed.id)} busy={busy === previewed.id}
      onClose={() => setPreview(null)} onStart={async () => { await start(previewed.id); setPreview(null); setFocus(null); }} />}
  </section>;
}

/** Aperçu complet d'un défi avant de le rejoindre : méthode, parcours associé et programme jour par jour. */
function ChallengePreview({ t, started, busy, onClose, onStart }: { t: ChallengeTemplate; started: boolean; busy: boolean; onClose: () => void; onStart: () => Promise<void> }) {
  const days = templateLength(t.id);
  const path = t.pathId ? pathById(t.pathId) : undefined;
  return <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={'Aperçu : ' + t.title} onClick={onClose}>
    <div className="editor challenge-preview" onClick={(e) => e.stopPropagation()}>
      <button className="icon-btn preview-close" aria-label="Fermer" onClick={onClose}><X size={20} /></button>
      <HeroPhoto slot={'challenge-' + t.id} tone={t.tone} label={t.discipline === 'Autre' ? t.category : t.discipline}>
        <div className="hero-title"><h2>{t.title}</h2><span>{t.tagline}</span></div>
      </HeroPhoto>
      <p className="muted">{t.category} · {days} jours{path ? ' · avec le parcours « ' + path.title + ' »' : ''}</p>
      <span className="eyebrow-s">CHAQUE JOUR</span>
      <ol className="how-list">{howFor(t).map((h) => <li key={h}>{h}</li>)}</ol>
      <details className="challenge-more" open><summary>Le programme ({days} jours)</summary>
        <ol className="program-list">{Array.from({ length: days }, (_, i) => <li key={i}><strong>Jour {i + 1}</strong> {t.day(i + 1) ?? 'Repos'}</li>)}</ol></details>
      <details className="challenge-more"><summary>Tenir sur la durée</summary>
        <ul className="how-list">{STAY_ON_TRACK.map((x) => <li key={x}>{x}</li>)}</ul></details>
      <div className="button-group preview-actions">
        <button className="button ghost" onClick={onClose}>Plus tard</button>
        <button className="button primary" disabled={started || busy} onClick={() => void onStart()}>{started ? 'Déjà en cours' : busy ? '…' : 'Rejoindre ce défi'}</button>
      </div>
    </div>
  </div>;
}

function ExerciseLibrary() {
  const [group, setGroup] = useState<ExerciseGroup>('Abdos');
  return <div className="exercise-library">
    <h3 className="board-subtitle">Bibliothèque d’exercices</h3>
    <div className="challenge-switch">{GROUPS.map((g) => <button key={g} className={g === group ? 'active' : ''} onClick={() => setGroup(g)}>{g}</button>)}</div>
    <div className="lesson-grid">{EXERCISES[group].map((ex) => <article className="lesson-card exercise-card" key={ex.name}>
      <h3>{ex.name}</h3><p>{ex.how}</p><p className="exercise-tip">{ex.tip}</p></article>)}</div>
  </div>;
}

function ActiveChallenge({ entry, onUpdate, onQuit }: { entry: Entry; onUpdate: (entry: Entry, data: Record<string, unknown>) => Promise<void>; onQuit: (entry: Entry) => Promise<void> }) {
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
  const path = t?.pathId ? pathById(t.pathId) : undefined;
  const pathStep = path ? (() => { const index = Math.min(path.steps.length - 1, Math.floor((shown - 1) * path.steps.length / days)); return { index, step: path.steps[index] }; })() : null;

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
      <p className="day-topic">{shownPlan ?? 'Jour de repos prévu : récupère, étire-toi doucement si tu en as envie.'}</p>
      {shownPlan && <><span className="eyebrow-s">COMMENT FAIRE</span>
        <ol className="how-list">{howFor(t).map((h) => <li key={h}>{h}</li>)}</ol></>}
      {pathStep && <div className="path-in-challenge"><span className="eyebrow-s"><BookOpen size={14} /> PARCOURS · ÉTAPE {pathStep.index + 1} : {pathStep.step.title}</span>
        <p className="muted">{pathStep.step.goal}</p>
        <ul className="step-tasks">{pathStep.step.tasks.map((x) => <li key={x}>{x}</li>)}</ul>
        {pathStep.step.phrases && <div className="phrases">{pathStep.step.phrases.map(([o, fr]) => <div key={o} className="phrase"><div><strong>{o}</strong><small>{fr}</small></div></div>)}</div>}
      </div>}
      <div className="button-group">
        <button className={state === 'done' ? 'button primary' : 'button ghost'} onClick={() => void mark(shown, 'done')}>Réalisé</button>
        <button className={state === 'rest' ? 'button secondary' : 'button ghost'} onClick={() => void mark(shown, 'rest')}>Repos</button>
        <button className={state === 'not_done' ? 'button secondary' : 'button ghost'} onClick={() => void mark(shown, 'not_done')}>Non réalisé</button>
      </div>
    </div>
    <details className="challenge-more"><summary>Tenir sur la durée</summary>
      <ul className="how-list">{STAY_ON_TRACK.map((x) => <li key={x}>{x}</li>)}</ul></details>
    <details className="challenge-more"><summary>Le programme complet ({days} jours)</summary>
      <ol className="program-list">{Array.from({ length: days }, (_, i) => <li key={i} className={progress[String(i + 1)]?.status === 'done' ? 'done' : ''}>
        <strong>Jour {i + 1}</strong> {plan(i + 1) ?? 'Repos'}</li>)}</ol></details>
    <button className="button ghost wide quit-btn" onClick={() => { if (window.confirm('Quitter « ' + entry.title + ' » ? Ta progression sur ce défi sera effacée.')) void onQuit(entry); }}><LogOut size={16} /> Quitter ce défi</button>
    {selected !== null && selected !== current && current > 0 &&
      <button className="button primary wide" onClick={() => setSelected(null)}>Voir la séance du jour <ChevronRight size={16} /></button>}
  </article>;
}
