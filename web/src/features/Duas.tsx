import { useState } from 'react';
import { Check, Eye, GraduationCap, Heart, RotateCcw } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { isoOf } from '../lib/rituals';
import { DHIKR_ROUTINE, DUA_CATEGORIES, DUAS, type Dua, type DuaCategory } from '../lib/duas';
import { AFFIRMATIONS, AKHIRA_GOALS, FICHES, QURAN_DAILY } from '../lib/mindset';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
export const DUA_PREFS_KIND = 'invocations';

/** Mes invocations : arabe, phonétique, traduction française, référence ; favoris et routine de dhikr du jour. */
export function Duas({ entries, onCreate, onUpdate }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save }) {
  const prefs = entries.find((e) => e.kind === DUA_PREFS_KIND);
  const favs: string[] = Array.isArray(prefs?.data.favs) ? (prefs!.data.favs as string[]) : [];
  const routine = (prefs?.data.routine && typeof prefs.data.routine === 'object' ? prefs.data.routine : {}) as Record<string, string[]>;
  const today = isoOf(new Date());
  const doneToday = new Set(routine[today] ?? []);
  const [cat, setCat] = useState<DuaCategory | 'Favoris' | 'Routine' | 'Apprendre' | 'Carnet'>('Routine');
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
    {/* Quatre modes en haut ; les catégories d'invocations défilent sur une seule ligne. */}
    <div className="duas-modes" role="tablist">{([['Routine', 'Routine'], ['Invocations', 'Invocations'], ['Apprendre', 'Par cœur' + (dueCount(learn, today) ? ' · ' + dueCount(learn, today) : '')], ['Carnet', 'Carnet']] as const).map(([k, label]) => {
      const on = k === 'Invocations' ? !['Routine', 'Apprendre', 'Carnet'].includes(cat) : cat === k;
      return <button key={k} role="tab" aria-selected={on} className={'duas-mode' + (on ? ' on' : '')} onClick={() => { setCat(k === 'Invocations' ? (favs.length ? 'Favoris' : 'Pause dhikr') : k); setStudying(null); }}>{label}</button>; })}</div>
    {!['Routine', 'Apprendre', 'Carnet'].includes(cat) && <div className="chip-scroll">{(['Favoris', ...DUA_CATEGORIES] as const).map((c) =>
      <button key={c} className={'chip' + (cat === c ? ' on' : '')} onClick={() => setCat(c)}>{c === 'Favoris' ? '♥ Favoris' : c}</button>)}</div>}

    {cat === 'Apprendre' && (studying ? <Study key={studying} dua={DUAS.find((d) => d.id === studying)!} state={learn[studying]} today={today}
        onDone={(next) => { void save({ learn: { ...learn, [studying]: next } }); setStudying(null); }} onClose={() => setStudying(null)} />
      : <LearnList learn={learn} today={today} onPick={setStudying} />)}

    {cat === 'Routine' && <div className="soft-card dhikr-routine">
      <div className="routine-head"><strong>Dhikr du jour</strong><small className="muted">{doneToday.size} / {DHIKR_ROUTINE.length}{streak > 1 ? ' · ' + streak + ' jours complets' : ''}</small></div>
      <div className="routine-bar"><span style={{ width: Math.round(doneToday.size / DHIKR_ROUTINE.length * 100) + '%' }} /></div>
      {DHIKR_ROUTINE.map((d) => { const on = doneToday.has(d.id), c = counts[d.id] ?? 0;
        return <div key={d.id} className={'routine-row' + (on ? ' done' : '')}>
          <button className="habit-check" aria-pressed={on} aria-label={(on ? 'Décocher ' : 'Fait : ') + d.phonetic} onClick={() => toggleDone(d.id)}>{on ? <Check size={18} strokeWidth={3} /> : null}</button>
          <div className="routine-text"><strong>{d.phonetic} <span className="times">×{d.times}</span></strong><small>{d.french}{d.ref ? ' · ' + d.ref : ''}</small></div>
          {d.times > 1 && !on && <button className="count-btn" aria-label={'Compter ' + d.phonetic} onClick={() => { const n = c + 1; setCounts((x) => ({ ...x, [d.id]: n })); if (n >= d.times) { toggleDone(d.id); setCounts((x) => ({ ...x, [d.id]: 0 })); } }}>{c}/{d.times}</button>}
        </div>; })}
      <p className="muted small">Source : @your._habibtii</p>
    </div>}

    {cat === 'Carnet' && <Carnet data={prefs?.data ?? {}} today={today} onSave={save} />}

    {cat !== 'Routine' && cat !== 'Apprendre' && cat !== 'Carnet' && <div className="stack-8">
      {list.map((d) => <article key={d.id} className="dua-card">
        <div className="dua-head"><div><strong>{d.title}</strong>{d.repeat ? <small className="muted"> · à réciter {d.repeat} fois</small> : null}</div>
          <button className={'icon-btn' + (favs.includes(d.id) ? ' fav' : '')} aria-pressed={favs.includes(d.id)} aria-label={(favs.includes(d.id) ? 'Retirer des favoris : ' : 'Ajouter aux favoris : ') + d.title} onClick={() => toggleFav(d.id)}><Heart size={18} /></button></div>
        <p className="dua-ar" lang="ar" dir="rtl">{d.arabic}</p>
        <p className="dua-ph">{d.phonetic}</p>
        <p className="dua-fr">{d.french}</p>
        <small className="muted">{[d.ref, d.source].filter(Boolean).join(' · ')}</small>
        {d.uses && <details className="dua-uses"><summary>Quand la réciter</summary>
          {d.uses.map((u) => <div key={u.title}><strong>{u.title}</strong><ul>{u.items.map((i) => <li key={i}>{i}</li>)}</ul></div>)}</details>}
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
      {step >= 2 && <button className="button ghost small" onClick={() => setReveal(!reveal)}><Eye size={14} /> {reveal ? 'Cacher' : 'Voir la réponse'}</button>}
    </div>
    <p className="muted small">Récite-la à voix haute, puis dis-moi comment ça s’est passé.</p>
    <div className="button-group">
      <button className="button primary" onClick={() => onDone({ level: next, next: addDays(today, GAPS[Math.min(next, GAPS.length) - 1] ?? 30) })}>Je m’en souviens</button>
      <button className="button secondary" onClick={() => onDone({ level: Math.max(1, step - 1), next: addDays(today, 1) })}>À revoir demain</button>
    </div>
  </article>;
}

/* ---------- Carnet de foi : Coran du jour, objectifs pour l'au-delà, affirmations, fiches ---------- */
function Carnet({ data, today, onSave }: { data: Record<string, unknown>; today: string; onSave: (p: Record<string, unknown>) => Promise<void> }) {
  const quran = (data.quran && typeof data.quran === 'object' ? data.quran : {}) as Record<string, string[]>;
  const qToday = new Set(quran[today] ?? []);
  const akhira = (data.akhira && typeof data.akhira === 'object' ? data.akhira : {}) as Record<string, string>;
  const [open, setOpen] = useState<string | null>(null);
  const toggleQ = (id: string) => void onSave({ quran: { ...quran, [today]: qToday.has(id) ? [...qToday].filter((x) => x !== id) : [...qToday, id] } });
  const toggleA = (i: number) => { const n = { ...akhira }; if (n[i]) delete n[i]; else n[i] = today; void onSave({ akhira: n }); };
  const reframes = (Array.isArray(data.reframes) ? data.reframes : []) as { from: string; to: string }[];
  const reads = (Array.isArray(data.reframeReads) ? data.reframeReads : []) as string[];
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const week = new Set(Array.from({ length: 7 }, (_, i) => { const d = new Date(today + 'T12:00:00'); d.setDate(d.getDate() - i); return isoOf(d); }));
  const readsWeek = reads.filter((d) => week.has(d)).length;
  const addReframe = () => { if (!from.trim() || !to.trim()) return; void onSave({ reframes: [...reframes, { from: from.trim().slice(0, 200), to: to.trim().slice(0, 200) }] }); setFrom(''); setTo(''); };
  const toggleRead = () => void onSave({ reframeReads: reads.includes(today) ? reads.filter((d) => d !== today) : [...reads, today].slice(-60) });
  return <div className="stack-8">
    <div className="soft-card dhikr-routine">
      <div className="routine-head"><strong>Mon Coran du jour</strong><small className="muted">{qToday.size} / {QURAN_DAILY.length}</small></div>
      {QURAN_DAILY.map((q) => <label key={q.id} className="checklist-item routine-check"><input type="checkbox" checked={qToday.has(q.id)} onChange={() => toggleQ(q.id)} /> {q.label}</label>)}
    </div>
    <div className="soft-card dhikr-routine">
      <div className="routine-head"><strong>Mes objectifs pour l’au-delà</strong><small className="muted">{Object.keys(akhira).length} / {AKHIRA_GOALS.length}</small></div>
      {AKHIRA_GOALS.map((g, i) => <label key={i} className="checklist-item routine-check"><input type="checkbox" checked={Boolean(akhira[i])} onChange={() => toggleA(i)} /> <span>{g}{akhira[i] ? <small className="muted"> · fait le {new Date(akhira[i] + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</small> : null}</span></label>)}
    </div>
    <div className="soft-card dhikr-routine">
      <div className="routine-head"><strong>Mes reformulations</strong><small className="muted">lues {readsWeek} / 7 jours</small></div>
      <p className="muted small">Une pensée négative → sa version alignée avec la foi. À relire à voix haute chaque matin.</p>
      {reframes.map((r, i) => <div key={i} className="reframe-row"><span className="reframe-from">{r.from}</span><span className="reframe-to">→ {r.to}</span>
        <button className="icon-btn" aria-label="Supprimer" onClick={() => void onSave({ reframes: reframes.filter((_, j) => j !== i) })}>×</button></div>)}
      <input className="input" placeholder="Ex. : je n’y arrive jamais" value={from} onChange={(e) => setFrom(e.target.value)} maxLength={200} />
      <input className="input" placeholder="Ex. : j’apprends à gérer, Allah me donne la force" value={to} onChange={(e) => setTo(e.target.value)} maxLength={200} />
      <button className="button secondary" disabled={!from.trim() || !to.trim()} onClick={addReframe}>Ajouter la reformulation</button>
      {reframes.length > 0 && <label className="checklist-item routine-check"><input type="checkbox" checked={reads.includes(today)} onChange={toggleRead} /> Je les ai relues ce matin</label>}
    </div>
    <div className="soft-card"><strong>Mes affirmations</strong>{AFFIRMATIONS.map((a) => <p key={a} className="dua-fr affirm">« {a} »</p>)}</div>
    {FICHES.map((f) => <article key={f.id} className="dua-card">
      <button className="fiche-head" aria-expanded={open === f.id} onClick={() => setOpen(open === f.id ? null : f.id)}><strong>{f.title}</strong><span>{open === f.id ? '−' : '+'}</span></button>
      {open === f.id && <>{f.points.map((p) => <p key={p} className="fiche-pt">{p}</p>)}
        {f.quote && <blockquote className="book-quote">« {f.quote.text} »<br /><small>{f.quote.ref}</small></blockquote>}</>}
    </article>)}
    <p className="muted small">D’après ma lecture de Muslima Mindset Reset (Muslima Glow).</p>
  </div>;
}
