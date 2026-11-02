import { useState } from 'react';
import { BookOpen, Plus, Quote, Star, Trash2 } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { isoOf } from '../lib/rituals';
import { Segmented } from '../ui/kit';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
export const READING_KIND = 'lecture';
type Status = 'a_lire' | 'en_cours' | 'lu';
const STATUS: { value: Status; label: string }[] = [{ value: 'en_cours', label: 'En cours' }, { value: 'a_lire', label: 'À lire' }, { value: 'lu', label: 'Lus' }];
const quotesOf = (e: Entry) => (Array.isArray(e.data.quotes) ? (e.data.quotes as unknown[]).map(String) : []);

/** Mes lectures : livres en cours, à lire et lus, avec mes citations préférées et une note sur 5. */
export function Reading({ entries, onCreate, onUpdate, onRemove }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; onRemove: (e: Entry) => Promise<void> }) {
  const books = entries.filter((e) => e.kind === READING_KIND);
  const [tab, setTab] = useState<Status>(books.some((b) => b.data.status === 'en_cours') ? 'en_cours' : 'a_lire');
  const [title, setTitle] = useState(''), [author, setAuthor] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const [quote, setQuote] = useState('');
  const year = String(new Date().getFullYear());
  const readThisYear = books.filter((b) => b.data.status === 'lu' && String(b.data.finished ?? '').startsWith(year)).length;
  const shown = books.filter((b) => (b.data.status ?? 'a_lire') === tab)
    .sort((a, b) => String(b.data.finished ?? b.created_at ?? '').localeCompare(String(a.data.finished ?? a.created_at ?? '')));

  const add = async () => {
    await onCreate({ module: 'equilibre', kind: READING_KIND, title: title.trim().slice(0, 120), entry_date: null,
      data: { author: author.trim().slice(0, 80), status: tab, quotes: [], rating: 0, ...(tab === 'en_cours' ? { started: isoOf(new Date()) } : {}), ...(tab === 'lu' ? { finished: isoOf(new Date()) } : {}) } });
    setTitle(''); setAuthor('');
  };
  const move = (e: Entry, status: Status) => onUpdate(e, { ...e.data, status, ...(status === 'lu' ? { finished: isoOf(new Date()) } : {}), ...(status === 'en_cours' ? { started: isoOf(new Date()) } : {}) });

  return <div className="screen reading">
    <header className="tab-head"><h1>Mes lectures</h1><p>{readThisYear ? readThisYear + ' livre' + (readThisYear > 1 ? 's' : '') + ' lu' + (readThisYear > 1 ? 's' : '') + ' en ' + year : 'Livres en cours, à lire et citations'}</p></header>
    <Segmented label="Mes livres" value={tab} onChange={(v) => setTab(v)} options={STATUS.map((s) => ({ value: s.value, label: s.label + ' (' + books.filter((b) => (b.data.status ?? 'a_lire') === s.value).length + ')' }))} />
    <div className="stack-8">{shown.map((b) => {
      const isOpen = open === b.id, quotes = quotesOf(b), rating = Number(b.data.rating) || 0;
      return <article key={b.id} className="book-card">
        <button className="relative-head" onClick={() => { setOpen(isOpen ? null : b.id); setQuote(''); }} aria-expanded={isOpen}>
          <span className="relative-badge"><BookOpen size={18} /></span>
          <span className="habit-body"><strong>{b.title}</strong><small>{[String(b.data.author || ''), quotes.length ? quotes.length + ' citation' + (quotes.length > 1 ? 's' : '') : '', rating ? '★'.repeat(rating) : ''].filter(Boolean).join(' · ')}</small></span>
        </button>
        {isOpen && <div className="form-stack relative-more">
          <div className="chip-row">{STATUS.filter((s) => s.value !== (b.data.status ?? 'a_lire')).map((s) => <button key={s.value} className="chip" onClick={() => void move(b, s.value)}>{s.value === 'lu' ? 'Terminé !' : s.value === 'en_cours' ? 'Je commence' : 'Remettre à lire'}</button>)}</div>
          <div className="stars" role="radiogroup" aria-label="Ma note">{[1, 2, 3, 4, 5].map((n) => <button key={n} role="radio" aria-checked={rating === n} aria-label={n + ' sur 5'} className={n <= rating ? 'on' : ''} onClick={() => void onUpdate(b, { ...b.data, rating: rating === n ? 0 : n })}><Star size={20} /></button>)}</div>
          {quotes.map((q, i) => <blockquote key={i} className="book-quote"><Quote size={14} /> {q}
            <button className="icon-btn" aria-label="Retirer la citation" onClick={() => void onUpdate(b, { ...b.data, quotes: quotes.filter((_, j) => j !== i) })}><Trash2 size={14} /></button></blockquote>)}
          <label>Une citation que j’aime<textarea rows={2} value={quote} maxLength={600} onChange={(e) => setQuote(e.target.value)} placeholder="Recopie la phrase qui t’a marquée…" /></label>
          <button className="button secondary" disabled={!quote.trim()} onClick={() => { void onUpdate(b, { ...b.data, quotes: [...quotes, quote.trim()].slice(-40) }); setQuote(''); }}><Plus size={14} /> Ajouter la citation</button>
          <label>Ce que j’en retiens<textarea rows={3} defaultValue={String(b.data.note ?? '')} maxLength={2000} onBlur={(e) => void onUpdate(b, { ...b.data, note: e.target.value })} /></label>
          <button className="link-btn small danger" onClick={() => { if (confirm('Retirer « ' + b.title + ' » ?')) void onRemove(b); }}><Trash2 size={14} /> Retirer</button>
        </div>}
      </article>; })}
      {!shown.length && <p className="muted">{tab === 'en_cours' ? 'Aucun livre en cours.' : tab === 'a_lire' ? 'Ta pile à lire est vide.' : 'Pas encore de livre terminé.'}</p>}
    </div>
    <section className="ritual-card form-stack">
      <p className="ritual-label">Ajouter un livre ({STATUS.find((s) => s.value === tab)!.label.toLowerCase()})</p>
      <label>Titre<input value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} /></label>
      <label>Auteur·e<input value={author} maxLength={80} onChange={(e) => setAuthor(e.target.value)} /></label>
      <button className="button primary" disabled={!title.trim()} onClick={() => void add()}>Ajouter</button>
    </section>
  </div>;
}
