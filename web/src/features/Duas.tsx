import { useState } from 'react';
import { Check, Eye, GraduationCap, Heart, RotateCcw, Volume2 } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { isoOf } from '../lib/rituals';
import { DHIKR_ROUTINE, DUA_CATEGORIES, DUAS, type Dua, type DuaCategory } from '../lib/duas';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
export const DUA_PREFS_KIND = 'invocations';

/** Mes invocations : arabe, phonétique, traduction française, référence ; favoris et routine de dhikr du jour. */
export function Duas({ entries, onCreate, onUpdate }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save }) {
  const prefs = entries.find((e) => e.kind === DUA_PREFS_KIND);
  const favs: string[] = Array.isArray(prefs?.data.favs) ? (prefs!.data.favs as string[]) : [];
  const routine = (prefs?.data.routine && typeof prefs.data.routine === 'object' ? prefs.data.routine : {}) as Record<string, string[]>;
  const today = isoOf(new Date());
  const doneToday = new Set(routine[today] ?? []);
  const [cat, setCat] = useState<DuaCategory | 'Favoris' | 'Routine' | 'Apprendre'>('Routine');
  const learn = (prefs?.data.learn && typeof prefs.data.learn === 'object' ? prefs.data.learn : {}) as Record<string, Learn>;
  const [studying, setStudying] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const save = (patch: Record<string, unknown>) => prefs ? onUpdate(prefs, { ...prefs.data, ...patch })
    : onCreate({ module: 'spiritualite', kind: DUA_PREFS_KIND, title: 'Mes invocations', entry_date: null, data: { favs: [], routine: {}, ...patch } });
  const toggleFav = (id: string) => void save({ favs: favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id] });
  const toggleDone = (id: string) => {
    const next = doneToday.has(id) ? [...doneToday].filter((x) => x !== id) : [...doneToday, id];
    const keep = Object.fromEntries(Object.entries(routine).filter(([d]) => d >= isoOf(new Date(Date.now() - 60 * 86_400_000))));
    void save({ routine: { ...keep, [today]: next } });
  };
  const list = cat === 'Favoris' ? DUAS.filter((d) => favs.includes(d.id)) : DUAS.filter((d) => d.category === cat);
  const streak = (() => { let n = 0; for (let i = 0; i < 365; i++) { const d = isoOf(new Date(Date.now() - i * 86_400_000)); if ((routine[d]?.length ?? 0) >= DHIKR_ROUTINE.length) n++; else if (i > 0) break; } return n; })();

  return <section className="duas">
    <div className="chip-row">{(['Routine', 'Apprendre', 'Favoris', ...DUA_CATEGORIES] as const).map((c) => <button key={c} className={'chip' + (cat === c ? ' on' : '')} onClick={() => { setCat(c); setStudying(null); }}>{c === 'Routine' ? 'Routine du jour' : c === 'Favoris' ? '♥ Favoris' : c === 'Apprendre' ? 'Apprendre par cœur' + (dueCount(learn, today) ? ' (' + dueCount(learn, today) + ')' : '') : c}</button>)}</div>

    {cat === 'Apprendre' && (studying ? <Study key={studying} dua={DUAS.find((d) => d.id === studying)!} state={learn[studying]} today={today}
        onDone={(next) => { void save({ learn: { ...learn, [studying]: next } }); setStudying(null); }} onClose={() => setStudying(null)} />
      : <LearnList learn={learn} today={today} onPick={setStudying} />)}

    {cat === 'Routine' && <div className="soft-card dhikr-routine">
      <div className="routine-head"><strong>Dhikr du jour</strong><small className="muted">{doneToday.size} / {DHIKR_ROUTINE.length}{streak > 1 ? ' · ' + streak + ' jours complets' : ''}</small></div>
      {DHIKR_ROUTINE.map((d) => { const on = doneToday.has(d.id), c = counts[d.id] ?? 0;
        return <div key={d.id} className={'routine-row' + (on ? ' done' : '')}>
          <button className="habit-check" aria-pressed={on} aria-label={(on ? 'Décocher ' : 'Fait : ') + d.phonetic} onClick={() => toggleDone(d.id)}>{on ? <Check size={18} strokeWidth={3} /> : null}</button>
          <div className="routine-text"><strong>{d.phonetic} <span className="times">×{d.times}</span></strong><small>{d.french}{d.ref ? ' · ' + d.ref : ''}</small></div>
          {d.times > 1 && !on && <button className="count-btn" aria-label={'Compter ' + d.phonetic} onClick={() => { const n = c + 1; setCounts((x) => ({ ...x, [d.id]: n })); if (n >= d.times) { toggleDone(d.id); setCounts((x) => ({ ...x, [d.id]: 0 })); } }}>{c}/{d.times}</button>}
        </div>; })}
      <p className="muted small">Source : @your._habibtii</p>
    </div>}

    {cat !== 'Routine' && cat !== 'Apprendre' && <div className="stack-8">
      {list.map((d) => <article key={d.id} className="dua-card">
        <div className="dua-head"><div><strong>{d.title}</strong>{d.repeat ? <small className="muted"> · à réciter {d.repeat} fois</small> : null}</div>
          <button className={'icon-btn' + (favs.includes(d.id) ? ' fav' : '')} aria-pressed={favs.includes(d.id)} aria-label={(favs.includes(d.id) ? 'Retirer des favoris : ' : 'Ajouter aux favoris : ') + d.title} onClick={() => toggleFav(d.id)}><Heart size={18} /></button></div>
        <p className="dua-ar" lang="ar" dir="rtl">{d.arabic}</p>
        <p className="dua-ph">{d.phonetic}</p>
        <p className="dua-fr">{d.french}</p>
        <small className="muted">{[d.ref, d.source].filter(Boolean).join(' · ')}</small>
        <div className="repeat-row">{d.repeat && <RepeatCounter key={d.id} total={d.repeat} />}
          <button className="button ghost small" onClick={() => { setCat('Apprendre'); setStudying(d.id); }}><GraduationCap size={14} /> {learn[d.id]?.level ? niveau(learn[d.id]!.level) : 'Apprendre'}</button></div>
      </article>)}
      {!list.length && <p className="muted">Touche le cœur d’une invocation pour la retrouver ici.</p>}
    </div>}
  </section>;
}

function RepeatCounter({ total }: { total: number }) {
  const [n, setN] = useState(0);
  return <div className="repeat-row">
    <button className="button secondary small" onClick={() => setN((x) => Math.min(total, x + 1))} disabled={n >= total}>{n >= total ? 'Terminé' : 'Récitée ' + n + '/' + total}</button>
    {n > 0 && <button className="icon-btn" aria-label="Recommencer" onClick={() => setN(0)}><RotateCcw size={16} /></button>}
  </div>;
}

/* ---------- Apprendre par cœur : lecture, puis mots cachés progressivement, révisions espacées ---------- */
type Learn = { level: number; next: string };
const GAPS = [1, 2, 4, 7, 15, 30]; // jours avant la prochaine révision, selon le niveau atteint
const LEVELS = ['Découverte', 'Je lis', 'Quelques trous', 'Moitié cachée', 'Presque par cœur', 'Par cœur'];
const niveau = (l: number) => LEVELS[Math.min(l, LEVELS.length - 1)]!;
const addDays = (iso: string, n: number) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const dueCount = (learn: Record<string, Learn>, today: string) => Object.values(learn).filter((x) => x.next <= today && x.level < LEVELS.length).length;

function LearnList({ learn, today, onPick }: { learn: Record<string, Learn>; today: string; onPick: (id: string) => void }) {
  const started = DUAS.filter((d) => learn[d.id]), due = started.filter((d) => learn[d.id]!.next <= today), later = started.filter((d) => learn[d.id]!.next > today), fresh = DUAS.filter((d) => !learn[d.id]);
  const row = (d: Dua, sub: string) => <button key={d.id} className="row-plain learn-row" onClick={() => onPick(d.id)}><span>{d.title}</span><small>{sub}</small></button>;
  return <div className="stack-8">
    <p className="muted small">Chaque invocation se travaille en étapes : tu la lis et l’écoutes, puis des mots se cachent peu à peu. Quand tu la retiens, elle revient plus tard pour une révision (1, 2, 4, 7, 15 puis 30 jours).</p>
    {due.length > 0 && <section><h3 className="habit-group">À réviser aujourd’hui</h3>{due.map((d) => row(d, niveau(learn[d.id]!.level)))}</section>}
    {later.length > 0 && <section><h3 className="habit-group">En cours</h3>{later.map((d) => row(d, niveau(learn[d.id]!.level) + ' · révision le ' + new Date(learn[d.id]!.next + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })))}</section>}
    {fresh.length > 0 && <section><h3 className="habit-group">À découvrir</h3>{fresh.map((d) => row(d, d.category + (d.ref ? ' · ' + d.ref : '')))}</section>}
  </div>;
}

/** Cache un mot sur deux, trois sur quatre… selon le niveau ; la première lettre reste visible comme indice. */
function masked(text: string, level: number, reveal: boolean) {
  const ratio = [0, 0, 0.25, 0.5, 0.8, 1][Math.min(level, 5)]!;
  return text.split(/(\s+)/).map((w, i) => {
    if (reveal || /^\s+$/.test(w) || !ratio) return <span key={i}>{w}</span>;
    const k = Math.floor(i / 2), hide = ratio >= 1 || (((k * 37 + 11) % 20) / 20) < ratio;
    return hide ? <span key={i} className="blank">{w.slice(0, 1)}{'_'.repeat(Math.max(2, Math.min(8, w.length - 1)))}</span> : <span key={i}>{w}</span>;
  });
}

function Study({ dua, state, today, onDone, onClose }: { dua: Dua; state?: Learn; today: string; onDone: (n: Learn) => void; onClose: () => void }) {
  const level = state?.level ?? 0;
  const [step, setStep] = useState(Math.max(1, level));
  const [reveal, setReveal] = useState(false);
  const speak = () => { try { const u = new SpeechSynthesisUtterance(dua.arabic.replace(/۝/g, '')); u.lang = 'ar-SA'; u.rate = 0.75; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch { /* lecture indisponible */ } };
  const next = Math.min(LEVELS.length - 1, step + 1);
  return <article className="dua-card study">
    <div className="dua-head"><div><strong>{dua.title}</strong><small className="muted"> · {niveau(step)}</small></div>
      <button className="link-btn small" onClick={onClose}>Fermer</button></div>
    <div className="study-steps">{LEVELS.slice(1).map((l, i) => <button key={l} className={'chip' + (step === i + 1 ? ' on' : '')} onClick={() => { setStep(i + 1); setReveal(false); }}>{i + 1}</button>)}</div>
    <p className="dua-ar" lang="ar" dir="rtl">{masked(dua.arabic, step, reveal)}</p>
    <p className="dua-ph">{masked(dua.phonetic, step, reveal)}</p>
    {step <= 2 || reveal ? <p className="dua-fr">{dua.french}</p> : null}
    <small className="muted">{[dua.ref, dua.source].filter(Boolean).join(' · ')}</small>
    <div className="repeat-row">
      {'speechSynthesis' in window && <button className="button ghost small" onClick={speak}><Volume2 size={14} /> Écouter</button>}
      {step >= 2 && <button className="button ghost small" onClick={() => setReveal(!reveal)}><Eye size={14} /> {reveal ? 'Cacher' : 'Voir la réponse'}</button>}
    </div>
    <p className="muted small">Récite-la à voix haute, puis dis-moi comment ça s’est passé.</p>
    <div className="button-group">
      <button className="button primary" onClick={() => onDone({ level: next, next: addDays(today, GAPS[Math.min(next, GAPS.length) - 1] ?? 30) })}>Je m’en souviens</button>
      <button className="button secondary" onClick={() => onDone({ level: Math.max(1, step - 1), next: addDays(today, 1) })}>À revoir demain</button>
    </div>
  </article>;
}
