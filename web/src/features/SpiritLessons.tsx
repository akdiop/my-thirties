import { useState } from 'react';
import { BookOpen, Check, ChevronDown, X } from 'lucide-react';
import { LESSONS, type LessonPart } from '../lib/lessons';
import { RowLink } from '../ui/kit';

function Part({ part, open, onToggle }: { part: LessonPart; open: boolean; onToggle: () => void }) {
  return <article className="dua-card lesson-part">
    <button className="fiche-head" aria-expanded={open} onClick={onToggle}><strong>{part.title}</strong><ChevronDown size={18} className={'list-chev' + (open ? ' flip' : '')} /></button>
    {open && <>
      {part.arabic && <p className="dua-ar" lang="ar" dir="rtl">{part.arabic}</p>}
      {part.french && <p className="dua-fr">{part.french}</p>}
      {part.points?.map((p) => <p key={p} className="fiche-pt">{p}</p>)}
      {part.duas?.map((d) => <div key={d.arabic} className="lesson-dua">
        <p className="dua-ar" lang="ar" dir="rtl">{d.arabic}</p>
        <p className="dua-fr">{d.french}</p>
        {d.note && <small className="muted">{d.note}</small>}
      </div>)}
      {part.avoid && <div className="lesson-avoid"><strong>Erreurs à éviter</strong><ul>{part.avoid.map((a) => <li key={a}>{a}</li>)}</ul></div>}
    </>}
  </article>;
}

/** Vrai ou faux : chaque réponse s'affiche dès qu'on choisit. */
function Quiz({ items }: { items: { q: string; a: boolean }[] }) {
  const [picked, setPicked] = useState<Record<number, boolean>>({});
  const answered = Object.keys(picked).length;
  const good = items.filter((it, i) => picked[i] === it.a).length;
  return <div className="soft-card lesson-quiz">
    <div className="routine-head"><strong>Je révise · vrai ou faux</strong>{answered > 0 && <small className="muted">{good} / {answered}</small>}</div>
    {items.map((it, i) => { const p = picked[i]; const done = p !== undefined;
      return <div key={it.q} className={'quiz-row' + (done ? (p === it.a ? ' ok' : ' ko') : '')}>
        <span>{it.q}</span>
        <span className="quiz-btns">{([true, false] as const).map((v) => <button key={String(v)} className={'chip' + (p === v ? ' on' : '')} disabled={done} onClick={() => setPicked({ ...picked, [i]: v })}>{v ? 'Vrai' : 'Faux'}</button>)}
          {done && (p === it.a ? <Check size={16} aria-label="Juste" /> : <X size={16} aria-label={'Réponse : ' + (it.a ? 'vrai' : 'faux')} />)}</span>
      </div>; })}
    {answered > 0 && <button className="link-btn small" onClick={() => setPicked({})}>Recommencer</button>}
  </div>;
}

/** Mes cours : tafsir, Ayat al-Kursî, prière pas à pas, roqya ; chaque partie se déplie. */
export function SpiritLessons({ onBack }: { onBack: () => void }) {
  const [id, setId] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(0);
  const lesson = LESSONS.find((l) => l.id === id);
  if (!lesson) return <>
    <button className="link-btn back-link" onClick={onBack}>‹ Ma spiritualité</button>
    <div className="rows">{LESSONS.map((l) =>
      <RowLink key={l.id} icon={BookOpen} title={l.title} sub={l.sub} onClick={() => { setId(l.id); setOpen(0); }} />)}</div></>;
  return <div className="stack-8 lesson">
    <button className="link-btn back-link" onClick={() => setId(null)}>‹ Mes cours</button>
    <div className="soft-card"><strong className="serif lesson-title">{lesson.title}</strong><p className="muted">{lesson.intro}</p></div>
    {lesson.parts.map((p, i) => <Part key={p.title} part={p} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />)}
    {lesson.retain && <div className="soft-card"><strong>Ce que je retiens</strong>{lesson.retain.map((r) => <p key={r} className="fiche-pt">{r}</p>)}</div>}
    {lesson.quiz && <Quiz items={lesson.quiz} />}
  </div>;
}
