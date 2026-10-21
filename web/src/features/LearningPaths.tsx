import { useState } from 'react';
import { BookOpen, Brush, Check, ChevronDown, Languages, PenLine, Volume2 } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { PATH_CATEGORIES, PATHS, pathById, type PathCategory } from '../lib/learning';
import { HeroPhoto } from './HeroPhoto';
import { Bar, Segmented } from '../ui/kit';
import { HiddenNote, HideButton, useHidden } from '../lib/hidden';

const ICON: Record<PathCategory, typeof Languages> = { Langues: Languages, 'Peinture & dessin': Brush, Écriture: PenLine };
const doneOf = (e: Entry) => (e.data.done && typeof e.data.done === 'object' ? e.data.done as Record<string, boolean> : {});

/** Lit une phrase modèle avec la synthèse vocale du navigateur, si elle est disponible (rien n'est envoyé). */
function speak(text: string, lang: string) {
  try {
    const u = new SpeechSynthesisUtterance(text.split(' — ')[0]);
    u.lang = lang; u.rate = 0.85;
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
  } catch { /* synthèse vocale indisponible */ }
}
const LANG_CODE: Record<string, string> = { 'lang-espagnol': 'es-ES', 'lang-portugais': 'pt-PT', 'lang-arabe': 'ar-SA' };

export function LearningPaths({ entries, onCreate, onUpdate }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void> }) {
  const mine = entries.filter((e) => e.kind === 'path' && pathById(e.data.pathId));
  const [focus, setFocus] = useState<string | null>(null);
  const [cat, setCat] = useState<PathCategory>('Langues');
  const [busy, setBusy] = useState('');
  const hidden = useHidden().ids;
  const active = mine.find((e) => e.id === focus) ?? mine[0];

  const start = async (id: string) => {
    const p = pathById(id)!;
    setBusy(id);
    try { await onCreate({ module: 'passions', kind: 'path', title: p.title, entry_date: new Date().toLocaleDateString('en-CA'), data: { pathId: id, done: {} } }); }
    finally { setBusy(''); }
  };

  return <section className="learning">
    {active && <>
      {mine.length > 1 && <div className="challenge-switch">{mine.map((e) => <button key={e.id} className={e.id === active.id ? 'active' : ''} onClick={() => setFocus(e.id)}>{e.title}</button>)}</div>}
      <ActivePath key={active.id} entry={active} onUpdate={onUpdate} />
    </>}
    <h3 className="board-subtitle">{mine.length ? 'Commencer un autre parcours' : 'Choisir un parcours'}</h3>
    <Segmented label="Catégorie" value={cat} onChange={setCat} options={PATH_CATEGORIES.map((c) => ({ value: c, label: c === 'Peinture & dessin' ? 'Art' : c }))} />
    <div className="path-list">{PATHS.filter((p) => p.category === cat && !hidden.has('path:' + p.id)).map((p) => {
      const Icon = ICON[p.category];
      const started = mine.some((e) => e.data.pathId === p.id);
      return <div key={p.id} className="path-item">
        <span className="row-icon"><Icon size={19} /></span>
        <span className="row-text"><strong>{p.title}</strong><small>{p.tagline} · {p.steps.length} étapes</small></span>
        <button className="button ghost" disabled={Boolean(busy) || started} onClick={() => void start(p.id)}>{started ? 'En cours' : busy === p.id ? '…' : 'Commencer'}</button>
        {!started && <HideButton id={'path:' + p.id} label={p.title} />}
      </div>;
    })}</div>
    <HiddenNote prefix="path:" />
  </section>;
}

function ActivePath({ entry, onUpdate }: { entry: Entry; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void> }) {
  const p = pathById(entry.data.pathId)!;
  const done = doneOf(entry);
  const count = p.steps.filter((_, i) => done[i]).length;
  const next = p.steps.findIndex((_, i) => !done[i]);
  const [open, setOpen] = useState<number>(next === -1 ? p.steps.length - 1 : next);
  const toggle = (i: number) => void onUpdate(entry, { ...entry.data, done: { ...done, [i]: !done[i] } });
  const lang = LANG_CODE[p.id];

  return <article className="active-path">
    <HeroPhoto slot={'path-' + p.id} tone={p.tone} label={p.title}>
      <div className="hero-title"><h2>{p.title}</h2><span>{p.tagline}</span></div>
    </HeroPhoto>
    <div className="active-head"><span className="muted">{next === -1 ? 'Parcours terminé, bravo !' : `Étape ${next + 1} sur ${p.steps.length}`}</span><strong>{count}/{p.steps.length}</strong></div>
    <Bar value={count / p.steps.length} />
    <ol className="steps">{p.steps.map((s, i) => <li key={i} className={'step' + (done[i] ? ' done' : '') + (i === next ? ' current' : '')}>
      <button className="step-head" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
        <span className="step-num">{done[i] ? <Check size={15} strokeWidth={3} /> : i + 1}</span>
        <span className="step-title"><strong>{s.title}</strong><small>{s.minutes} min · {s.goal}</small></span>
        <ChevronDown size={18} className="chev" />
      </button>
      {open === i && <div className="step-body">
        <ul className="step-tasks">{s.tasks.map((t) => <li key={t}>{t}</li>)}</ul>
        {s.phrases && <div className="phrases"><span className="eyebrow-s"><BookOpen size={14} /> Phrases modèles</span>
          {s.phrases.map(([o, fr]) => <div key={o} className="phrase"><div><strong>{o}</strong><small>{fr}</small></div>
            {lang && 'speechSynthesis' in window && <button className="icon-btn" aria-label={'Écouter ' + o} onClick={() => speak(o, lang)}><Volume2 size={18} /></button>}</div>)}
        </div>}
        <button className={done[i] ? 'button ghost' : 'button primary'} onClick={() => toggle(i)}>{done[i] ? 'Marquer comme à refaire' : 'Étape terminée'}</button>
      </div>}
    </li>)}</ol>
    <p className="fineprint">Avance à ton rythme : une étape peut prendre plusieurs jours. Note tes séances avec « Séance de pratique ».</p>
  </article>;
}
