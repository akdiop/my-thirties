import { useEffect, useMemo, useRef, useState } from 'react';
import { Bookmark, BookOpen, Check, ChevronLeft, ChevronRight, Search, Star } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { CORAN_KIND, CORAN_SOURCE, coranOf, loadRechercheCoran, loadSourate, loadSourates, SOURATES, versetDuJourRef, type CoranState, type Sourate, type SourateIndex } from '../lib/coran';
import { chercher } from '../lib/jardin';
import { isoOf } from '../lib/rituals';
import { Bar } from '../ui/kit';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
type Props = { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; start?: [number, number] };
type Pos = { s: number; v?: number };
type Fav = { isFav: (s: number, v: number) => boolean; onFav: (s: number, v: number) => void };

const nom = (index: SourateIndex[], s: number) => index.find((x) => x[0] === s)?.[1] ?? '';

/** Le Coran : le texte entier en français, un verset du jour, mon marque-page, la recherche, mes favoris et mes lectures complètes. */
export function Coran({ entries, onCreate, onUpdate, start }: Props) {
  const { entry, state } = coranOf(entries);
  const [open, setOpen] = useState<Pos | null>(start ? { s: start[0], v: start[1] } : null);
  const [index, setIndex] = useState<SourateIndex[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { loadSourates().then(setIndex).catch(() => setError('Le Coran n’a pas pu se charger. Vérifie ta connexion.')); }, []);
  const save = (patch: Partial<CoranState>) => {
    const data = { ...state, ...patch };
    return entry ? onUpdate(entry, { ...entry.data, ...data }) : onCreate({ module: 'spiritualite', kind: CORAN_KIND, title: 'Le Coran', entry_date: null, data });
  };
  const isFav = (s: number, v: number) => state.favoris.some(([a, b]) => a === s && b === v);
  const fav: Fav = { isFav, onFav: (s, v) => void save({ favoris: isFav(s, v) ? state.favoris.filter(([a, b]) => !(a === s && b === v)) : [...state.favoris, [s, v]] }) };
  const today = isoOf(new Date()), luJour = state.jours.includes(today);
  const toggleJour = () => void save({ jours: luJour ? state.jours.filter((d) => d !== today) : [...state.jours, today].slice(-400) });
  if (open) return <Lecteur key={open.s} s={open.s} highlight={open.v} index={index} state={state} fav={fav} luJour={luJour} onJour={toggleJour} onOpen={(s) => setOpen({ s })} onBack={() => setOpen(null)}
    onMark={(s, v) => void save({ marque: [s, v] })} onRead={(s, lu) => void save({ lus: lu ? [...new Set([...state.lus, s])] : state.lus.filter((x) => x !== s) })} />;
  const done = state.lus.length >= SOURATES;
  const vendredi = new Date().getDay() === 5;
  return <div className="screen jardin">
    <header className="tab-head"><h1>Le Coran</h1><p>Le texte entier, en français</p></header>
    {error && <p className="fineprint" role="alert">{error}</p>}
    <VersetDuJour index={index} fav={fav} onOpen={(s, v) => setOpen({ s, v })} />
    {state.marque && <button className="soft-card jardin-resume" onClick={() => setOpen({ s: state.marque![0], v: state.marque![1] })}><Bookmark size={18} />
      <span className="workout-title"><strong>Reprendre ma lecture</strong><small>Sourate {state.marque[0]} · {nom(index, state.marque[0])} · verset {state.marque[1]}</small></span><ChevronRight size={16} /></button>}
    {vendredi && <button className="soft-card jardin-resume" onClick={() => setOpen({ s: 18 })}><BookOpen size={18} />
      <span className="workout-title"><strong>C’est vendredi</strong><small>Sourate 18 · al-Kahf (La Caverne)</small></span><ChevronRight size={16} /></button>}
    <LuJour on={luJour} onToggle={toggleJour} />
    <div className="habit-rate"><span>Sourates lues</span><Bar value={state.lus.length / SOURATES} tone="sauge" /><small>{state.lus.length}/{SOURATES}</small></div>
    {state.khatm > 0 && <p className="muted small">{state.khatm} lecture{state.khatm > 1 ? 's' : ''} complète{state.khatm > 1 ? 's' : ''} du Coran</p>}
    {done && <section className="ritual-card"><p className="ritual-label">Lecture complète</p><p>Tu as lu les 114 sourates. Al-hamdulillah.</p>
      <button className="button secondary" onClick={() => void save({ khatm: state.khatm + 1, lus: [], marque: [1, 1] })}>Commencer une nouvelle lecture</button></section>}
    <Recherche index={index} onOpen={(s, v) => setOpen({ s, v })} />
    {state.favoris.length > 0 && <Favoris favoris={state.favoris} onOpen={(s, v) => setOpen({ s, v })} />}
    <details className="soft-card"><summary className="ritual-label">Les 114 sourates</summary><Liste index={index} lus={state.lus} onOpen={(s) => setOpen({ s })} /></details>
    <p className="fineprint">{CORAN_SOURCE}.</p>
  </div>;
}

function VersetDuJour({ index, fav, onOpen }: { index: SourateIndex[]; fav: Fav; onOpen: (s: number, v: number) => void }) {
  const [s, v] = versetDuJourRef(isoOf(new Date()));
  const [t, setT] = useState('');
  useEffect(() => { let alive = true; loadSourate(s).then((x) => { if (alive) setT(x.v[v - 1] ?? ''); }).catch(() => undefined); return () => { alive = false; }; }, [s, v]);
  if (!t) return null;
  return <section className="ritual-card jardin-jour"><p className="ritual-label">Le verset du jour</p>
    <p className="jardin-texte">{t}</p>
    <small className="muted">Sourate {s} · {nom(index, s)} · verset {v}</small>
    <div className="button-group"><button className="button secondary small" onClick={() => onOpen(s, v)}>Lire la sourate</button>
      <button className="icon-btn" aria-pressed={fav.isFav(s, v)} aria-label={fav.isFav(s, v) ? 'Retirer des favoris' : 'Ajouter aux favoris'} onClick={() => fav.onFav(s, v)}><Star size={18} fill={fav.isFav(s, v) ? '#C2B48C' : 'none'} /></button></div>
  </section>;
}

function Recherche({ index, onOpen }: { index: SourateIndex[]; onOpen: (s: number, v: number) => void }) {
  const [q, setQ] = useState(''), [busy, setBusy] = useState(false), [res, setRes] = useState<ReturnType<typeof chercher> | null>(null);
  const run = async () => { if (!q.trim()) return; setBusy(true); try { setRes(chercher(await loadRechercheCoran(), q)); } catch { setRes([]); } finally { setBusy(false); } };
  return <section className="ritual-card form-stack"><p className="ritual-label">Chercher dans le Coran</p>
    <div className="jardin-search"><input value={q} placeholder="patience, miséricorde, parents…" aria-label="Chercher dans le Coran" onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void run(); }} />
      <button className="icon-btn" aria-label="Chercher" onClick={() => void run()}><Search size={18} /></button></div>
    {busy && <p className="muted">Recherche dans les 114 sourates…</p>}
    {res && !busy && (res.length ? <div className="jardin-results">{res.map((r) => <button key={r.c + '-' + r.n} className="jardin-result" onClick={() => onOpen(r.c, r.n)}>
      <small className="ritual-label">Sourate {r.c} · {nom(index, r.c)} · verset {r.n}</small><span>{r.extrait}</span></button>)}
      {res.length >= 40 && <p className="fineprint">Les 40 premiers résultats : précise ta recherche avec un mot de plus.</p>}</div> : <p className="muted">Aucun verset ne contient tous ces mots.</p>)}
  </section>;
}

function Favoris({ favoris, onOpen }: { favoris: [number, number][]; onOpen: (s: number, v: number) => void }) {
  const [items, setItems] = useState<{ s: number; v: number; t: string }[]>([]);
  useEffect(() => { let alive = true;
    Promise.all([...new Set(favoris.map(([s]) => s))].map((s) => loadSourate(s))).then((all) => {
      if (alive) setItems(favoris.flatMap(([s, v]) => { const t = all.find((x) => x.n === s)?.v[v - 1]; return t ? [{ s, v, t }] : []; }));
    }).catch(() => undefined);
    return () => { alive = false; }; }, [favoris]);
  return <details className="soft-card"><summary className="ritual-label">Mes versets favoris ({favoris.length})</summary>
    {items.map((x) => <button key={x.s + '-' + x.v} className="jardin-result" onClick={() => onOpen(x.s, x.v)}><small className="ritual-label">Coran {x.s}:{x.v}</small><span>{x.t.length > 260 ? x.t.slice(0, 260) + ' …' : x.t}</span></button>)}
  </details>;
}

function Liste({ index, lus, onOpen }: { index: SourateIndex[]; lus: number[]; onOpen: (s: number) => void }) {
  const [f, setF] = useState('');
  const list = useMemo(() => { const k = f.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    return index.filter(([n, t]) => !k || String(n) === k || t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().includes(k)); }, [index, f]);
  return <div className="form-stack"><input value={f} placeholder="Filtrer par nom ou numéro" aria-label="Filtrer les sourates" onChange={(e) => setF(e.target.value)} />
    <div className="jardin-list">{list.map(([n, t, nb]) => <button key={n} className={'jardin-chap' + (lus.includes(n) ? ' lu' : '')} onClick={() => onOpen(n)}>
      <span className="astro-abbr">{lus.includes(n) ? <Check size={14} /> : n}</span><span className="workout-title"><strong>{t}</strong><small>{nb} verset{nb > 1 ? 's' : ''}</small></span></button>)}</div></div>;
}

function LuJour({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return <div className="soft-card coran-lu"><span className="workout-title"><strong>Ma lecture du jour</strong><small>{on ? 'Comptée dans ma régularité' : 'Coche quand tu as lu, défiler ne compte pas'}</small></span>
    <button className={'button small ' + (on ? 'ghost' : 'secondary')} aria-pressed={on} onClick={onToggle}>{on ? <><Check size={14} /> Lu aujourd’hui</> : 'Lu'}</button></div>;
}

function Lecteur({ s, highlight, index, state, fav, luJour, onJour, onOpen, onBack, onMark, onRead }: { s: number; highlight?: number; index: SourateIndex[]; state: CoranState; fav: Fav; luJour: boolean; onJour: () => void;
  onOpen: (s: number) => void; onBack: () => void; onMark: (s: number, v: number) => void; onRead: (s: number, lu: boolean) => void }) {
  const [so, setSo] = useState<Sourate | null>(null), [error, setError] = useState('');
  const target = useRef<HTMLElement | null>(null);
  useEffect(() => { loadSourate(s).then(setSo).catch(() => setError('Cette sourate n’a pas pu se charger. Vérifie ta connexion.')); }, [s]);
  useEffect(() => { if (so && highlight) target.current?.scrollIntoView({ block: 'center' }); else window.scrollTo(0, 0); }, [so, highlight]);
  const lu = state.lus.includes(s);
  const marked = (v: number) => state.marque?.[0] === s && state.marque[1] === v;
  return <div className="screen jardin">
    <button className="link-btn small jardin-back" onClick={onBack}><ChevronLeft size={16} /> Le Coran</button>
    <header className="tab-head"><p className="ritual-label">Sourate {s}{so ? ' · ' + so.v.length + ' versets' : ''}</p><h1 className="jardin-titre">{so?.t ?? nom(index, s)}</h1></header>
    {error && <p className="fineprint" role="alert">{error}</p>}
    {so && s !== 1 && s !== 9 && <p className="coran-basmala">Au nom d’Allah, le Tout Miséricordieux, le Très Miséricordieux.</p>}
    {so && <section className="soft-card coran-texte">{so.v.map((t, i) => { const v = i + 1;
      return <p key={v} ref={v === highlight ? (el) => { target.current = el; } : undefined} className={'coran-verset' + (v === highlight ? ' on' : '')}>
        <span className="coran-num">{v}</span>{t}
        <span className="coran-actions">
          <button className="icon-btn" aria-pressed={marked(v)} aria-label={marked(v) ? 'Marque-page ici' : 'Mettre le marque-page ici'} onClick={() => onMark(s, v)}><Bookmark size={15} fill={marked(v) ? '#C2B48C' : 'none'} /></button>
          <button className="icon-btn" aria-pressed={fav.isFav(s, v)} aria-label={fav.isFav(s, v) ? 'Retirer des favoris' : 'Ajouter aux favoris'} onClick={() => fav.onFav(s, v)}><Star size={15} fill={fav.isFav(s, v) ? '#C2B48C' : 'none'} /></button>
        </span></p>; })}</section>}
    {so && <LuJour on={luJour} onToggle={onJour} />}
    {so && <button className={'button wide ' + (lu ? 'ghost' : 'secondary')} onClick={() => onRead(s, !lu)}>{lu ? 'Sourate lue (retirer)' : 'J’ai lu cette sourate'}</button>}
    <div className="button-group jardin-nav">{s > 1 && <button className="button ghost small" onClick={() => onOpen(s - 1)}><ChevronLeft size={14} /> Sourate {s - 1}</button>}
      {s < SOURATES && <button className="button ghost small" onClick={() => onOpen(s + 1)}>Sourate {s + 1} <ChevronRight size={14} /></button>}</div>
    <p className="fineprint">{CORAN_SOURCE}.</p>
  </div>;
}
