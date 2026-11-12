import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Eye, Plus, Printer, Settings2, Trash2, UserRound } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { CARNET_PAGE, CARNET_SETTINGS, carnetWindow, monthLabel, monthOf, pageOf, pathByMonth, settingsOf, TAGS, tagCounts, VOEU, wishes, type Tag, type Wish } from '../lib/carnet';
import { inWindow } from '../../supabase/functions/push-reminders/carnet';
import { DUAS } from '../lib/duas';
import { isoOf, MOODS } from '../lib/rituals';
import { Glyph } from '../ui/Glyph';
import { Dictate } from '../ui/Dictate';
import { Bar, Segmented } from '../ui/kit';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
type Props = { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; onRemove: (e: Entry) => Promise<void>; signFirst?: boolean };
const frDay = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

/** Mon carnet de vœux : la page du mois, mes souhaits (signes, personnes, invocation) et le chemin parcouru. */
export function Carnet({ entries, onCreate, onUpdate, onRemove, signFirst }: Props) {
  const today = isoOf(new Date());
  const [tab, setTab] = useState<'mois' | 'souhaits' | 'chemin'>('mois');
  const [sign, setSign] = useState(Boolean(signFirst));
  const [settings, setSettings] = useState(false);
  const all = wishes(entries), open = all.filter((w) => !w.done);
  const win = carnetWindow(entries, today), now = inWindow(win, today);

  return <div className="screen carnet">
    <header className="tab-head row"><div><h1>Mon carnet</h1><p>{now ? 'Ta page du mois t’attend' : 'Prochaine page : ' + frDay(win.start)}</p></div>
      <button className="icon-btn" aria-label="Réglages du carnet" onClick={() => setSettings(!settings)}><Settings2 size={20} /></button></header>
    {settings && <WindowSettings entries={entries} onCreate={onCreate} onUpdate={onUpdate} />}
    {open.length > 0 && <button className="button soft wide" onClick={() => setSign(true)}><Eye size={16} /> J’ai vu un signe</button>}
    <Segmented label="Carnet" value={tab} onChange={setTab} options={[{ value: 'mois', label: 'Ce mois-ci' }, { value: 'souhaits', label: 'Mes souhaits' }, { value: 'chemin', label: 'Le chemin' }]} />
    {tab === 'mois' && <MonthPage entries={entries} today={today} onCreate={onCreate} onUpdate={onUpdate} />}
    {tab === 'souhaits' && <WishList list={all} onUpdate={onUpdate} onRemove={onRemove} today={today} />}
    {tab === 'chemin' && <Path entries={entries} today={today} />}
    {sign && <SignSheet list={open} today={today} onUpdate={onUpdate} onClose={() => setSign(false)} />}
  </div>;
}

/** Fenêtre d'écriture : automatique (d'après le cycle) ou un jour fixe du mois. */
function WindowSettings({ entries, onCreate, onUpdate }: Pick<Props, 'entries' | 'onCreate' | 'onUpdate'>) {
  const s = settingsOf(entries), entry = entries.find((e) => e.kind === CARNET_SETTINGS);
  const save = (d: Record<string, unknown>) => entry ? onUpdate(entry, { ...entry.data, ...d })
    : onCreate({ module: 'quotidien', kind: CARNET_SETTINGS, title: 'Réglages du carnet', entry_date: null, data: d });
  const hasCycle = entries.some((e) => e.kind === 'cycle');
  return <section className="soft-card form-stack">
    <p className="ritual-label">Ma page du mois</p>
    <Segmented label="Fenêtre" value={s.mode === 'manuel' ? 'manuel' : 'auto'} onChange={(v) => void save({ mode: v })}
      options={[{ value: 'auto', label: 'Automatique' }, { value: 'manuel', label: 'Jour fixe' }]} />
    {s.mode === 'manuel' || !hasCycle
      ? <label>Jour du mois<select value={String(s.day ?? 1)} onChange={(e) => void save({ day: Number(e.target.value) })}>
          {Array.from({ length: 28 }, (_, i) => <option key={i} value={i + 1}>Le {i + 1}</option>)}</select></label>
      : <p className="muted small">Calculée d’après les débuts de règles notés dans Bien-être. C’est une estimation.</p>}
  </section>;
}

/** La page du mois : mot du mois, humeur, pensées libres et nouveaux souhaits. */
function MonthPage({ entries, today, onCreate, onUpdate }: Pick<Props, 'entries' | 'onCreate' | 'onUpdate'> & { today: string }) {
  const month = monthOf(today), page = pageOf(entries, month);
  const [thoughts, setThoughts] = useState(String(page?.data.thoughts ?? ''));
  const [word, setWord] = useState(String(page?.data.word ?? ''));
  const [wish, setWish] = useState(''), [tag, setTag] = useState<Tag | ''>('');
  useEffect(() => { setThoughts(String(page?.data.thoughts ?? '')); setWord(String(page?.data.word ?? '')); }, [page?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const savePage = (d: Record<string, unknown>) => page ? onUpdate(page, { ...page.data, ...d })
    : onCreate({ module: 'quotidien', kind: CARNET_PAGE, title: 'Page de ' + monthLabel(month), entry_date: month + '-01', data: { month, ...d } });
  const addWish = async () => {
    const text = wish.trim(); if (!text) return;
    await onCreate({ module: 'quotidien', kind: VOEU, title: text.slice(0, 200), entry_date: today, data: { month, tag, status: 'chemin', signs: [], people: [] } });
    setWish(''); setTag('');
  };
  const mood = String(page?.data.mood ?? '');
  const mine = wishes(entries).filter((w) => w.month === month), before = wishes(entries).filter((w) => w.month < month && !w.done);

  return <div className="stack-8">
    <section className="soft-card form-stack">
      <p className="ritual-label">Page de {monthLabel(month)}</p>
      <label>Mon mot du mois<input value={word} maxLength={30} placeholder="Ouverture, patience, confiance…" onChange={(e) => setWord(e.target.value)} onBlur={() => { if (word !== String(page?.data.word ?? '')) void savePage({ word: word.trim() }); }} /></label>
      <div><span className="label-strong">Ce que je ressens en écrivant</span>
        <div className="mood5">{MOODS.map((m) => <button key={m.value} className={mood === m.value ? 'on' : ''} aria-pressed={mood === m.value} onClick={() => void savePage({ mood: mood === m.value ? '' : m.value })}>
          <Glyph name={m.icon} tint={m.tint} size={22} badge={46} /><small>{m.value}</small></button>)}</div></div>
      <label>Ce qui me passe par la tête<textarea rows={6} value={thoughts} placeholder="Écris tout, sans filtre." onChange={(e) => setThoughts(e.target.value)}
        onBlur={() => { if (thoughts !== String(page?.data.thoughts ?? '')) void savePage({ thoughts }); }} /></label>
      <Dictate onText={(t) => { const v = (thoughts ? thoughts + ' ' : '') + t; setThoughts(v); void savePage({ thoughts: v }); }} />
    </section>

    <section className="soft-card form-stack">
      <p className="ritual-label">Ce que je souhaite</p>
      <p className="muted small">Un projet, pas un plan : écris ce que tu veux, pas comment.</p>
      {mine.map((w) => <p key={w.entry.id} className="carnet-wish-line">{w.text}{w.tag && <span className="tag">{w.tag}</span>}</p>)}
      <div className="row-input"><input value={wish} maxLength={200} placeholder="Je souhaite…" onChange={(e) => setWish(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void addWish(); }} />
        <Dictate onText={(t) => setWish((w) => (w ? w + ' ' : '') + t)} /></div>
      <div className="chip-row">{TAGS.map((t) => <button key={t} className={'chip' + (tag === t ? ' on' : '')} aria-pressed={tag === t} onClick={() => setTag(tag === t ? '' : t)}>{t}</button>)}</div>
      <button className="button primary" disabled={!wish.trim()} onClick={() => void addWish()}><Plus size={16} /> Ajouter ce souhait</button>
    </section>

    {before.length > 0 && <section className="soft-card"><p className="ritual-label">Mes souhaits des mois précédents</p>
      {before.map((w) => <p key={w.entry.id} className="carnet-wish-line"><small>{monthLabel(w.month)}</small> {w.text} <span className="muted small">· {w.signs.length} signe{w.signs.length > 1 ? 's' : ''}</span></p>)}</section>}
  </div>;
}

/** Tous mes souhaits : signes datés, personnes rencontrées, invocation rattachée, statut. */
function WishList({ list, onUpdate, onRemove, today }: { list: Wish[]; onUpdate: Save; onRemove: (e: Entry) => Promise<void>; today: string }) {
  const [filter, setFilter] = useState<Tag | ''>('');
  const [open, setOpen] = useState<string | null>(null);
  const shown = list.filter((w) => !filter || w.tag === filter);
  if (!list.length) return <p className="muted">Tes souhaits apparaîtront ici dès que tu en écris un sur la page du mois.</p>;
  return <div className="stack-8">
    <div className="chip-row"><button className={'chip' + (!filter ? ' on' : '')} onClick={() => setFilter('')}>Tous</button>
      {TAGS.filter((t) => list.some((w) => w.tag === t)).map((t) => <button key={t} className={'chip' + (filter === t ? ' on' : '')} onClick={() => setFilter(t)}>{t}</button>)}</div>
    {shown.map((w) => <WishCard key={w.entry.id} w={w} open={open === w.entry.id} onToggle={() => setOpen(open === w.entry.id ? null : w.entry.id)} onUpdate={onUpdate} onRemove={onRemove} today={today} />)}
  </div>;
}

function WishCard({ w, open, onToggle, onUpdate, onRemove, today }: { w: Wish; open: boolean; onToggle: () => void; onUpdate: Save; onRemove: (e: Entry) => Promise<void>; today: string }) {
  const [signText, setSignText] = useState(''), [person, setPerson] = useState('');
  const set = (d: Record<string, unknown>) => onUpdate(w.entry, { ...w.entry.data, ...d });
  const dua = DUAS.find((d) => d.id === w.duaId);
  return <article className={'soft-card carnet-wish' + (w.done ? ' done' : '')}>
    <button className="carnet-wish-head" aria-expanded={open} onClick={onToggle}>
      <span className="carnet-wish-text"><strong>{w.text}</strong>
        <small>{monthLabel(w.month)}{w.tag ? ' · ' + w.tag : ''} · {w.signs.length} signe{w.signs.length > 1 ? 's' : ''} · {w.people.length} personne{w.people.length > 1 ? 's' : ''}</small></span>
      <span className={'carnet-status' + (w.done ? ' done' : '')}>{w.done ? 'Réalisé, alhamdulillah' : 'En chemin'}</span>
    </button>
    {open && <div className="form-stack">
      <p className="ritual-label">Les signes</p>
      {w.signs.length ? <ul className="carnet-list">{[...w.signs].sort((a, b) => b.d.localeCompare(a.d)).map((s, i) => <li key={i}><small>{frDay(s.d)}</small> {s.t}</li>)}</ul> : <p className="muted small">Aucun signe noté pour l’instant.</p>}
      <div className="row-input"><input value={signText} maxLength={300} placeholder="Une porte qui s’ouvre, une coïncidence…" onChange={(e) => setSignText(e.target.value)} />
        <Dictate onText={(t) => setSignText((v) => (v ? v + ' ' : '') + t)} />
        <button className="button soft" disabled={!signText.trim()} onClick={() => { void set({ signs: [...w.signs, { d: today, t: signText.trim() }] }); setSignText(''); }}>Noter</button></div>

      <p className="ritual-label"><UserRound size={16} /> Les personnes qui m’aident</p>
      {w.people.length > 0 && <ul className="carnet-list">{w.people.map((p, i) => <li key={i}><small>{frDay(p.d)}</small> {p.n}</li>)}</ul>}
      <div className="row-input"><input value={person} maxLength={120} placeholder="Qui, et comment ?" onChange={(e) => setPerson(e.target.value)} />
        <button className="button soft" disabled={!person.trim()} onClick={() => { void set({ people: [...w.people, { d: today, n: person.trim() }] }); setPerson(''); }}>Ajouter</button></div>

      <label>Une invocation pour ce souhait<select value={w.duaId} onChange={(e) => void set({ duaId: e.target.value })}>
        <option value="">Aucune</option>{DUAS.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}</select></label>
      {dua && <div className="carnet-dua"><p className="dua-ar" lang="ar" dir="rtl">{dua.arabic}</p><em>{dua.phonetic}</em><p>{dua.french}</p>{dua.ref && <small>{dua.ref}</small>}</div>}

      <label>Étiquette<select value={w.tag} onChange={(e) => void set({ tag: e.target.value })}><option value="">Sans étiquette</option>{TAGS.map((t) => <option key={t} value={t}>{t}</option>)}</select></label>
      <div className="button-group">
        <button className={w.done ? 'button ghost' : 'button primary'} onClick={() => void set(w.done ? { status: 'chemin', realisedOn: '' } : { status: 'realise', realisedOn: today })}>
          {w.done ? 'Remettre en chemin' : <><Check size={16} /> Réalisé, alhamdulillah</>}</button>
        <button className="icon-btn" aria-label={'Supprimer ' + w.text} onClick={() => void onRemove(w.entry)}><Trash2 size={17} /></button>
      </div>
    </div>}
  </article>;
}

/** Le chemin : mois par mois, puis la relecture de l'année (imprimable en PDF). */
function Path({ entries, today }: { entries: Entry[]; today: string }) {
  const all = wishes(entries);
  const years = [...new Set(pathByMonth(entries).map((m) => m.month.slice(0, 4)))];
  const [year, setYear] = useState(today.slice(0, 4));
  const [print, setPrint] = useState(false);
  const months = pathByMonth(entries, year);
  const yearWishes = all.filter((w) => w.month.startsWith(year) || w.realisedOn.startsWith(year));
  const tags = tagCounts(all);
  const signs = all.reduce((n, w) => n + w.signs.length, 0), people = all.reduce((n, w) => n + w.people.length, 0);
  if (!months.length && !all.length) return <p className="muted">Ton chemin se dessinera ici au fil des mois.</p>;
  return <div className="stack-8">
    <div className="year-grid">
      <div className="year-tile"><strong>{all.length}</strong><span>souhait{all.length > 1 ? 's' : ''}</span></div>
      <div className="year-tile"><strong>{all.filter((w) => w.done).length}</strong><span>réalisé{all.filter((w) => w.done).length > 1 ? 's' : ''}</span></div>
      <div className="year-tile"><strong>{signs}</strong><span>signe{signs > 1 ? 's' : ''}</span></div>
      <div className="year-tile"><strong>{people}</strong><span>personne{people > 1 ? 's' : ''}</span></div>
    </div>
    {tags.length > 0 && <section className="soft-card"><p className="ritual-label">Où va mon énergie</p>
      {tags.map((t) => <div key={t.tag} className="carnet-tag-row"><span>{t.tag}</span><Bar value={t.total / Math.max(...tags.map((x) => x.total))} /><small>{t.done}/{t.total}</small></div>)}</section>}

    <section className="soft-card">
      <div className="carnet-year-head"><p className="ritual-label">Ma relecture de {year}</p>
        {years.length > 1 && <select value={year} aria-label="Année" onChange={(e) => setYear(e.target.value)}>{years.map((y) => <option key={y}>{y}</option>)}</select>}</div>
      <p className="muted small">{yearWishes.length} souhait{yearWishes.length > 1 ? 's' : ''} · {yearWishes.filter((w) => w.done).length} réalisé{yearWishes.filter((w) => w.done).length > 1 ? 's' : ''} cette année.</p>
      <button className="button soft" onClick={() => setPrint(true)}><Printer size={16} /> Exporter en PDF</button>
    </section>

    {months.map((m) => <section key={m.month} className="soft-card carnet-month">
      <p className="ritual-label">{monthLabel(m.month)}{m.page?.data.word ? ' · « ' + String(m.page.data.word) + ' »' : ''}{m.page?.data.mood ? ' · ' + String(m.page.data.mood) : ''}</p>
      {m.posed.length > 0 && <p className="small"><b>Posés :</b> {m.posed.map((w) => w.text).join(' · ')}</p>}
      {m.signs.length > 0 && <ul className="carnet-list">{m.signs.map((s, i) => <li key={i}><small>{frDay(s.d)}</small> {s.t} <span className="muted">({s.wish})</span></li>)}</ul>}
      {m.realised.map((w) => <p key={w.entry.id} className="carnet-realised"><Check size={14} /> {w.text} · réalisé, alhamdulillah</p>)}
    </section>)}
    {print && <PrintCarnet entries={entries} year={year} onDone={() => setPrint(false)} />}
  </div>;
}

function PrintCarnet({ entries, year, onDone }: { entries: Entry[]; year: string; onDone: () => void }) {
  useEffect(() => {
    const done = () => onDone();
    window.addEventListener('afterprint', done);
    const t = setTimeout(() => window.print(), 300);
    return () => { clearTimeout(t); window.removeEventListener('afterprint', done); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const months = pathByMonth(entries, year).reverse();
  return createPortal(<div className="print-area">
    <h1>Mon carnet de vœux · {year}</h1>
    {months.map((m) => <article key={m.month}>
      <h2>{monthLabel(m.month)}{m.page?.data.word ? ' · ' + String(m.page.data.word) : ''}</h2>
      {m.page?.data.thoughts ? <p className="print-body">{String(m.page.data.thoughts)}</p> : null}
      {m.posed.length > 0 && <p><b>Souhaits :</b> {m.posed.map((w) => w.text + (w.tag ? ' (' + w.tag + ')' : '')).join(' · ')}</p>}
      {m.signs.map((s, i) => <p key={i}>{frDay(s.d)} · {s.t} ({s.wish})</p>)}
      {m.realised.map((w) => <p key={w.entry.id}><b>Réalisé :</b> {w.text}</p>)}
    </article>)}
    {wishes(entries).some((w) => w.people.length) && <article><h2>Les personnes rencontrées</h2>
      {wishes(entries).flatMap((w) => w.people.map((p, i) => <p key={w.entry.id + i}>{p.n} · {w.text}</p>))}</article>}
  </div>, document.body);
}

/** Noter un signe en dix secondes : le souhait concerné et une phrase. */
function SignSheet({ list, today, onUpdate, onClose }: { list: Wish[]; today: string; onUpdate: Save; onClose: () => void }) {
  const [id, setId] = useState(list[0]?.entry.id ?? ''), [text, setText] = useState('');
  const w = list.find((x) => x.entry.id === id);
  const save = async () => { if (!w || !text.trim()) return; await onUpdate(w.entry, { ...w.entry.data, signs: [...w.signs, { d: today, t: text.trim() }] }); onClose(); };
  return <div className="modal-overlay sheet" role="dialog" aria-modal="true" aria-label="J’ai vu un signe" onClick={onClose}>
    <div className="sheet-body form-stack" onClick={(e) => e.stopPropagation()}>
      <span className="sheet-grip" /><h2>J’ai vu un signe</h2>
      <label>Pour quel souhait ?<select value={id} onChange={(e) => setId(e.target.value)}>{list.map((x) => <option key={x.entry.id} value={x.entry.id}>{x.text}</option>)}</select></label>
      <label>Ce qui s’est passé<textarea rows={3} value={text} maxLength={300} autoFocus onChange={(e) => setText(e.target.value)} /></label>
      <Dictate onText={(t) => setText((v) => (v ? v + ' ' : '') + t)} />
      <div className="button-group"><button className="button primary" disabled={!text.trim()} onClick={() => void save()}>Noter le signe</button><button className="button ghost" onClick={onClose}>Annuler</button></div>
    </div>
  </div>;
}
