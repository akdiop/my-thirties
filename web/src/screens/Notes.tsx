import { Glyph, MoodIcon } from '../ui/Glyph';
import { useMemo, useState } from 'react';
import { ArrowLeft, Flame, Plus, Search, Trash2 } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { NoteMedia } from '../features/NoteMedia';
import { deleteMedia, mediaOf, type Media } from '../lib/media';
import { DAILY_KIND, MOODS, NOTE_FOLDERS, NOTE_KIND, NOTE_TYPES, noteType, type NoteType } from '../lib/rituals';
import { saveLabel, useAutosave } from '../lib/autosave';
import { OneYearAgo } from './Review';
import { yearAgoOn } from '../features/JournalSettings';
import { PrintJournal } from '../features/PrintJournal';
import { FileDown } from 'lucide-react';

type Edit = (id: string, patch: { title: string; data: Record<string, unknown> }) => Promise<void>;
const when = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
const textOf = (e: Entry) => [e.title, e.data.body, e.data.intention, e.data.win, e.data.letgo, e.data.tomorrow, e.data.selfcare,
  ...(Array.isArray(e.data.gratitudes) ? e.data.gratitudes : []), ...(Array.isArray(e.data.priorities) ? e.data.priorities : [])].filter(Boolean).join(' ');

/** Notes : journal intime et notes libres rangées par dossier, recherche, et accès aux Daily Reset passés. */
export function Notes({ entries, onCreate, onEdit, onRemove, onOpenDay }: {
  entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onEdit: Edit; onRemove: (e: Entry) => Promise<void>;
  onOpenDay: (date: string, part?: 'matin' | 'soir') => void;
}) {
  const notes = entries.filter((e) => e.kind === NOTE_KIND).sort((a, b) => String(b.data.updated ?? b.created_at).localeCompare(String(a.data.updated ?? a.created_at)));
  const days = entries.filter((e) => e.kind === DAILY_KIND).sort((a, b) => String(b.entry_date).localeCompare(String(a.entry_date)));
  const [folder, setFolder] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [picker, setPicker] = useState(false);
  const [editing, setEditing] = useState<{ noteId: string; type: NoteType } | null>(null);
  const [printMonth, setPrintMonth] = useState('');
  const [pdfMonth, setPdfMonth] = useState(new Date().toLocaleDateString('en-CA').slice(0, 7));

  const found = useMemo(() => {
    const s = q.trim().toLocaleLowerCase('fr');
    return s ? [...notes, ...days].filter((e) => textOf(e).toLocaleLowerCase('fr').includes(s)) : [];
  }, [q, notes, days]);

  if (editing) {
    const entry = notes.find((e) => e.data.noteId === editing.noteId);
    return <NoteEditor key={editing.noteId} noteId={editing.noteId} type={editing.type} entry={entry} onCreate={onCreate} onEdit={onEdit}
      onRemove={async (e) => { await onRemove(e); setEditing(null); }} onClose={() => setEditing(null)} />;
  }
  const open = (e: Entry) => e.kind === DAILY_KIND ? onOpenDay(String(e.entry_date)) : setEditing({ noteId: String(e.data.noteId), type: noteType(e.data.type) });
  const start = (t: NoteType) => { setPicker(false); if (t.to) onOpenDay(new Date().toLocaleDateString('en-CA'), t.to); else setEditing({ noteId: crypto.randomUUID(), type: t }); };

  const list = (items: Entry[]) => <div className="note-list">{items.map((e) => e.kind === DAILY_KIND
    ? <button key={e.id} className="note-row" onClick={() => open(e)}><span className="note-emoji">{e.data.mood ? <MoodIcon mood={e.data.mood} badge={36} /> : <Glyph name="calendar" tint="caramel" badge={36} />}</span>
      <span><strong>Mon jour · {when(String(e.entry_date) + 'T12:00:00')}</strong><small>{String(e.data.intention || e.data.win || 'Daily Reset')}</small></span></button>
    : <button key={e.id} className="note-row" onClick={() => open(e)}><span className="note-emoji"><Glyph name={noteType(e.data.type).icon} tint={noteType(e.data.type).tint} badge={36} /></span>
      <span><strong>{e.title}</strong><small>{String(e.data.body ?? '').slice(0, 90)}</small><small className="muted">{when(e.created_at)}</small></span></button>)}</div>;

  const current = NOTE_FOLDERS.find((f) => f.id === folder);
  return <div className="screen notes">
    <header className="tab-head notes-head">
      {folder ? <button className="icon-btn back" onClick={() => setFolder(null)} aria-label="Retour"><ArrowLeft size={22} /></button> : null}
      <div><h1>{folder === 'daily' ? 'Mes journées' : current ? current.label : 'Notes'}</h1><p>{folder ? '' : 'Mon journal, rien qu’à moi'}</p></div>
      <button className="round-btn" aria-label="Nouvelle note" onClick={() => setPicker(true)}><Plus size={22} /></button>
    </header>
    {!folder && <>
      <label className="search-field-icon"><Search size={16} /><input type="search" value={q} placeholder="Rechercher dans toutes mes notes…" onChange={(e) => setQ(e.target.value)} /></label>
      {q.trim() ? (found.length ? list(found) : <p className="muted">Rien trouvé pour « {q} ».</p>) : <>
        <p className="eyebrow-s">Dossiers</p>
        <div className="folder-grid">
          {NOTE_FOLDERS.map((f) => <button key={f.id} className="folder" onClick={() => setFolder(f.id)}><Glyph name={f.icon} tint={f.tint} size={22} badge={44} /><strong>{f.label}</strong><small>{notes.filter((n) => (n.data.folder ?? 'journal') === f.id).length} note(s)</small></button>)}
          <button className="folder" onClick={() => setFolder('daily')}><Glyph name="calendar" tint="caramel" size={22} badge={44} /><strong>Mes journées</strong><small>{days.length} jour(s)</small></button>
        </div>
        {yearAgoOn() && <OneYearAgo entries={entries} onOpenDay={(d) => onOpenDay(d)} onOpenNote={open} />}
        {notes.length > 0 && <><p className="eyebrow-s">Récentes</p>{list(notes.slice(0, 5))}</>}
        <section className="pdf-export"><p className="ritual-label"><FileDown size={16} /> Exporter un mois en PDF</p>
          <div className="todo-add"><input type="month" className="soft-input" value={pdfMonth} max={new Date().toLocaleDateString('en-CA').slice(0, 7)} onChange={(e) => setPdfMonth(e.target.value)} />
            <button className="button soft" disabled={!pdfMonth} onClick={() => setPrintMonth(pdfMonth)}>Exporter</button></div>
          <p className="fineprint">Choisis « Enregistrer en PDF » dans la fenêtre d’impression. Le fichier est créé sur ton appareil.</p></section>
      </>}
    </>}
    {folder === 'daily' && (days.length ? list(days) : <p className="muted">Tes journées remplies dans « Mon jour » apparaîtront ici.</p>)}
    {current && (() => { const items = notes.filter((n) => (n.data.folder ?? 'journal') === current.id); return items.length ? list(items) : <p className="muted">Aucune note dans ce dossier pour l’instant.</p>; })()}

    {printMonth && <PrintJournal entries={entries} month={printMonth} onDone={() => setPrintMonth('')} />}
    {picker && <div className="modal-overlay sheet" role="dialog" aria-modal="true" aria-label="Nouvelle note" onClick={() => setPicker(false)}>
      <div className="sheet-body" onClick={(e) => e.stopPropagation()}>
        <span className="sheet-grip" /><h2>Quel type de note ?</h2>
        {NOTE_TYPES.map((t) => <button key={t.id} className="type-row" onClick={() => start(t)}><span className="note-emoji"><Glyph name={t.icon} tint={t.tint} badge={38} /></span><span><strong>{t.label}</strong><small>{t.hint}</small></span></button>)}
      </div>
    </div>}
  </div>;
}

function NoteEditor({ noteId, type, entry, onCreate, onEdit, onRemove, onClose }: {
  noteId: string; type: NoteType; entry: Entry | undefined; onCreate: (i: EntryInput) => Promise<void>; onEdit: Edit; onRemove: (e: Entry) => Promise<void>; onClose: () => void;
}) {
  const [title, setTitle] = useState(entry?.title === type.label ? '' : entry?.title ?? '');
  const [body, setBody] = useState(String(entry?.data.body ?? ''));
  const [folder, setFolder] = useState(String(entry?.data.folder ?? type.folder));
  const [mood, setMood] = useState(String(entry?.data.mood ?? ''));
  const [media, setMedia] = useState<Media[]>(mediaOf(entry?.data.media));
  const [touched, setTouched] = useState(false);
  const [burning, setBurning] = useState(false);
  const heading = (title.trim() || type.label).slice(0, 170);
  const draft = useMemo(() => touched && (body.trim() || title.trim() || media.length) ? { noteId, type: type.id, heading, body, folder, mood, media } : null, [touched, noteId, type.id, heading, body, folder, mood, title, media]);
  const state = useAutosave(entry, draft,
    () => onCreate({ module: 'equilibre', kind: NOTE_KIND, title: heading, entry_date: new Date().toLocaleDateString('en-CA'), data: { ...draft!, updated: new Date().toISOString() } }),
    (e, d) => onEdit(e.id, { title: heading, data: { ...d, updated: new Date().toISOString() } }));
  const t = <A,>(f: (v: A) => void) => (v: A) => { f(v); setTouched(true); };
  const burn = async () => {
    if (!entry || !confirm('Brûler cette note ? Elle sera supprimée définitivement.')) return;
    setBurning(true); setTimeout(() => { void deleteMedia(mediaOf(entry.data.media).map((m) => m.path)).catch(() => undefined); void onRemove(entry); }, 900);
  };
  return <div className={'screen note-editor' + (burning ? ' burning' : '')}>
    <header className="screen-header"><button className="icon-btn back" onClick={onClose} aria-label="Retour"><ArrowLeft size={22} /></button>
      <span className="note-type"><Glyph name={type.icon} tint={type.tint} /> {type.label}</span>
      {entry && type.id !== 'anger' && <button className="icon-btn" aria-label="Supprimer la note" onClick={() => { if (confirm('Supprimer cette note ?')) { void deleteMedia(mediaOf(entry.data.media).map((m) => m.path)).catch(() => undefined); void onRemove(entry); } }}><Trash2 size={18} /></button>}
    </header>
    <p className="muted note-date">{when(entry?.created_at ?? new Date().toISOString())}</p>
    <input className="note-title" value={title} placeholder={type.label} maxLength={170} onChange={(e) => t(setTitle)(e.target.value)} />
    <textarea className="note-body" autoFocus={!entry} value={body} placeholder={type.prompt} onChange={(e) => t(setBody)(e.target.value)} />
    <NoteMedia folder={noteId} media={media} onChange={t(setMedia)} />
    <div className="note-meta">
      <div className="mood5 small">{MOODS.map((m) => <button key={m.value} className={mood === m.value ? 'on' : ''} aria-label={m.value} onClick={() => t(setMood)(mood === m.value ? '' : m.value)}><Glyph name={m.icon} tint={m.tint} size={18} badge={34} /></button>)}</div>
      <select value={folder} aria-label="Dossier" onChange={(e) => t(setFolder)(e.target.value)}>{NOTE_FOLDERS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}</select>
    </div>
    <p className="save-state" aria-live="polite">{saveLabel(state) || 'S’enregistre automatiquement.'}</p>
    {type.id === 'anger' && entry && <button className="button ghost wide burn" onClick={() => void burn()}><Flame size={16} /> Brûler cette note</button>}
  </div>;
}
