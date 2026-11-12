import { useState } from 'react';
import { BookOpen, Check, ChevronDown, X } from 'lucide-react';
import { LESSONS, type Book, type LessonPart } from '../lib/lessons';
import { RowLink } from '../ui/kit';

function Part({ part, open, onToggle }: { part: LessonPart; open: boolean; onToggle: () => void }) {
  return <article className="dua-card lesson-part">
    <button className="fiche-head" aria-expanded={open} onClick={onToggle}><strong>{part.title}</strong><ChevronDown size={18} className={'list-chev' + (open ? ' flip' : '')} /></button>
    {open && <>
      {part.arabic && <p className="dua-ar" lang="ar" dir="rtl">{part.arabic}</p>}
      {part.phonetic && <p className="dua-ph">{part.phonetic}</p>}
      {part.french && <p className="dua-fr">{part.french}</p>}
      {part.points?.map((p) => <p key={p} className="fiche-pt">{p}</p>)}
      {part.duas?.map((d) => <div key={d.arabic} className="lesson-dua">
        <p className="dua-ar" lang="ar" dir="rtl">{d.arabic}</p>
        <p className="dua-ph">{d.phonetic}</p>
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
      <RowLink key={l.id} icon={BookOpen} title={l.title} sub={l.sub} onClick={() => { setId(l.id); setOpen(0); }} />)}</div>
    <p className="fineprint">Lire la phonétique : â, î, û se prononcent longs ; ‘ est le son de gorge du ‘ayn ; ’ est un petit arrêt de voix ; une lettre doublée (bb, mm) se marque en appuyant ; kh comme la jota espagnole, gh comme un r grasseyé, dh comme le « th » anglais de « this », th comme « think ».</p></>;
  return <div className="stack-8 lesson">
    <button className="link-btn back-link" onClick={() => setId(null)}>‹ Mes cours</button>
    <div className="soft-card"><strong className="serif lesson-title">{lesson.title}</strong><p className="muted">{lesson.intro}</p></div>
    {lesson.book && <BookPages book={lesson.book} title={lesson.title} />}
    {lesson.parts.map((p, i) => <Part key={p.title} part={p} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />)}
    {lesson.retain && <div className="soft-card"><strong>Ce que je retiens</strong>{lesson.retain.map((r) => <p key={r} className="fiche-pt">{r}</p>)}</div>}
    {lesson.quiz && <Quiz items={lesson.quiz} />}
  </div>;
}

/** Livret intégré page par page (images), avec son sommaire. Les pages se chargent au fil de la lecture. */
function BookPages({ book, title }: { book: Book; title: string }) {
  const src = (n: number) => '/cours/' + book.dir + '/p-' + String(n).padStart(2, '0') + '.jpg';
  const go = (n: number) => document.getElementById(book.dir + '-' + n)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return <>
    {book.toc && <details className="soft-card book-toc"><summary>Sommaire</summary>
      <ol>{book.toc.map(([t, n]) => <li key={t}><button className="link-btn" onClick={() => go(n)}>{t}</button><small>p. {n}</small></li>)}</ol></details>}
    <p className="muted small">Touche une page pour l’ouvrir en grand et zoomer.</p>
    <div className="book-pages">{Array.from({ length: book.pages }, (_, i) => <a key={i} id={book.dir + '-' + (i + 1)} href={src(i + 1)} target="_blank" rel="noreferrer">
      <img src={src(i + 1)} loading="lazy" decoding="async" alt={title + ', page ' + (i + 1)} width={993} height={1404} /></a>)}</div>
  </>;
}

