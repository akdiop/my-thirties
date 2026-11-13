import { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Check, ChevronLeft, ChevronRight, Search, Star } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { chercher, hadithDuJourRef, JARDIN_KIND, JARDIN_SOURCE, jardinOf, loadChapitre, loadCourts, loadIndex, loadRecherche, THEMES_JARDIN, versets, type Chapitre, type ChapitreIndex, type JardinState } from '../lib/jardin';
import { isoOf } from '../lib/rituals';
import { FICHES_SPI } from '../lib/fichesSpirituelles';
import { refCoran } from '../lib/coran';
import { Bar } from '../ui/kit';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
type Props = { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; start?: number; onCoran?: (s: number, v: number) => void };

/** Le Jardin des vertueux : le livre entier, un hadith du jour, des thèmes choisis pour moi, la recherche, mes favoris et ma progression. */
export function Jardin({ entries, onCreate, onUpdate, start, onCoran }: Props) {
  const { entry, state } = jardinOf(entries);
  const [open, setOpen] = useState<{ c: number; h?: number } | null>(start ? { c: start } : null);
  const [index, setIndex] = useState<ChapitreIndex[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { loadIndex().then(setIndex).catch(() => setError('Le livre n’a pas pu se charger. Vérifie ta connexion.')); }, []);
  const save = (patch: Partial<JardinState>) => {
    const data = { ...state, ...patch };
    return entry ? onUpdate(entry, { ...entry.data, ...data }) : onCreate({ module: 'spiritualite', kind: JARDIN_KIND, title: 'Le Jardin des vertueux', entry_date: null, data });
  };
  const fav = (c: number, n: number) => state.favoris.some(([a, b]) => a === c && b === n);
  const toggleFav = (c: number, n: number) => void save({ favoris: fav(c, n) ? state.favoris.filter(([a, b]) => !(a === c && b === n)) : [...state.favoris, [c, n]] });
  if (open) return <Lecteur key={open.c} n={open.c} highlight={open.h} index={index} state={state} isFav={fav} onFav={toggleFav}
    onOpen={(c) => setOpen({ c })} onRead={(c, lu) => void save({ lus: lu ? [...new Set([...state.lus, c])] : state.lus.filter((x) => x !== c) })}
    onBack={() => setOpen(null)} onCoran={onCoran} onMount={(c) => { if (state.dernier !== c) void save({ dernier: c }); }} />;
  return <div className="screen jardin">
    <header className="tab-head"><h1>Le Jardin des vertueux</h1><p>Riyâd as-Sâlihîn de l’imam an-Nawawî</p></header>
    {error && <p className="fineprint" role="alert">{error}</p>}
    <HadithDuJour index={index} isFav={fav} onFav={toggleFav} onOpen={(c, h) => setOpen({ c, h })} />
    {state.dernier && <button className="soft-card jardin-resume" onClick={() => setOpen({ c: state.dernier! })}><BookOpen size={18} />
      <span className="workout-title"><strong>Reprendre ma lecture</strong><small>Chapitre {state.dernier} · {index.find((x) => x[0] === state.dernier)?.[1] ?? ''}</small></span><ChevronRight size={16} /></button>}
    {index.length > 0 && <div className="habit-rate"><span>Chapitres lus</span><Bar value={state.lus.length / index.length} tone="sauge" /><small>{state.lus.length}/{index.length}</small></div>}
    <section className="ritual-card"><p className="ritual-label">Pour moi</p>
      <div className="jardin-themes">{THEMES_JARDIN.map((t) => <button key={t.titre} className="jardin-theme" onClick={() => setOpen({ c: t.chapitres[0]! })}>
        <strong>{t.titre}</strong><small>{t.pour}</small></button>)}</div></section>
    <Recherche onOpen={(c, h) => setOpen({ c, h })} />
    {state.favoris.length > 0 && <Favoris favoris={state.favoris} onOpen={(c, h) => setOpen({ c, h })} />}
    <section className="ritual-card"><p className="ritual-label">Fiches de spiritualité</p>
      {FICHES_SPI.map((f) => <details key={f.id} className="astro-q"><summary><strong>{f.titre}</strong></summary>
        <p className="astro-essentiel">{f.intro}</p>
        {f.sections.map((x) => <div key={x.titre} className="astro-detail"><p className="ritual-label">{x.titre}</p><ul className="astro-list">{x.points.map((p) => <li key={p}>{p}</li>)}</ul></div>)}
        <p className="ritual-label">Pour moi, aujourd’hui</p><ul className="astro-list">{f.questions.map((q) => <li key={q}>{q}</li>)}</ul>
        <p className="fineprint">{f.source}. <a href={f.lien} target="_blank" rel="noreferrer">Lire l’article complet</a></p></details>)}
    </section>
    <details className="soft-card"><summary className="ritual-label">Tous les chapitres ({index.length})</summary><Chapitres index={index} lus={state.lus} onOpen={(c) => setOpen({ c })} /></details>
    <p className="fineprint">{JARDIN_SOURCE}.</p>
  </div>;
}

function HadithDuJour({ index, isFav, onFav, onOpen }: { index: ChapitreIndex[]; isFav: (c: number, n: number) => boolean; onFav: (c: number, n: number) => void; onOpen: (c: number, h: number) => void }) {
  const [h, setH] = useState<{ c: number; n: number; t: string } | null>(null);
  useEffect(() => { let alive = true;
    loadCourts().then((courts) => { const ref = hadithDuJourRef(courts, isoOf(new Date())); if (!ref) return; return loadChapitre(ref[0]).then((ch) => { const x = ch.h.find(([n]) => n === ref[1]); if (alive && x) setH({ c: ref[0], n: x[0], t: x[1] }); }); }).catch(() => undefined);
    return () => { alive = false; }; }, []);
  if (!h) return null;
  return <section className="ritual-card jardin-jour"><p className="ritual-label">Le hadith du jour</p>
    <p className="jardin-texte">{h.t}</p>
    <small className="muted">Hadith {h.n} · chapitre {h.c} · {index.find((x) => x[0] === h.c)?.[1] ?? ''}</small>
    <div className="button-group"><button className="button secondary small" onClick={() => onOpen(h.c, h.n)}>Lire le chapitre</button>
      <button className="icon-btn" aria-pressed={isFav(h.c, h.n)} aria-label={isFav(h.c, h.n) ? 'Retirer des favoris' : 'Ajouter aux favoris'} onClick={() => onFav(h.c, h.n)}><Star size={18} fill={isFav(h.c, h.n) ? '#C2B48C' : 'none'} /></button></div>
  </section>;
}

function Recherche({ onOpen }: { onOpen: (c: number, h?: number) => void }) {
  const [q, setQ] = useState(''), [busy, setBusy] = useState(false), [res, setRes] = useState<ReturnType<typeof chercher> | null>(null);
  const run = async () => { if (!q.trim()) return; setBusy(true); try { setRes(chercher(await loadRecherche(), q)); } catch { setRes([]); } finally { setBusy(false); } };
  return <section className="ritual-card form-stack"><p className="ritual-label">Chercher dans le livre</p>
    <div className="jardin-search"><input value={q} placeholder="patience, sourire, parents…" aria-label="Chercher dans le livre" onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void run(); }} />
      <button className="icon-btn" aria-label="Chercher" onClick={() => void run()}><Search size={18} /></button></div>
    {busy && <p className="muted">Recherche dans les 373 chapitres…</p>}
    {res && !busy && (res.length ? <div className="jardin-results">{res.map((r, i) => <button key={i} className="jardin-result" onClick={() => onOpen(r.c, r.n || undefined)}>
      <small className="ritual-label">{r.n ? 'Hadith ' + r.n : 'Verset'} · chapitre {r.c}</small><span>{r.extrait}</span></button>)}
      {res.length >= 40 && <p className="fineprint">Les 40 premiers résultats : précise ta recherche avec un mot de plus.</p>}</div> : <p className="muted">Aucun passage ne contient tous ces mots.</p>)}
  </section>;
}

function Favoris({ favoris, onOpen }: { favoris: [number, number][]; onOpen: (c: number, h: number) => void }) {
  const [items, setItems] = useState<{ c: number; n: number; t: string }[]>([]);
  useEffect(() => { let alive = true;
    Promise.all([...new Set(favoris.map(([c]) => c))].map((c) => loadChapitre(c))).then((chs) => {
      if (!alive) return;
      setItems(favoris.flatMap(([c, n]) => { const t = chs.find((x) => x.n === c)?.h.find(([k]) => k === n)?.[1]; return t ? [{ c, n, t }] : []; }));
    }).catch(() => undefined);
    return () => { alive = false; }; }, [favoris]);
  return <details className="soft-card"><summary className="ritual-label">Mes favoris ({favoris.length})</summary>
    {items.map((x) => <button key={x.c + '-' + x.n} className="jardin-result" onClick={() => onOpen(x.c, x.n)}><small className="ritual-label">Hadith {x.n} · chapitre {x.c}</small><span>{x.t.length > 260 ? x.t.slice(0, 260) + ' …' : x.t}</span></button>)}
  </details>;
}

function Chapitres({ index, lus, onOpen }: { index: ChapitreIndex[]; lus: number[]; onOpen: (c: number) => void }) {
  const [f, setF] = useState('');
  const list = useMemo(() => { const k = f.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    return index.filter(([n, t]) => !k || String(n) === k || t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().includes(k)); }, [index, f]);
  return <div className="form-stack"><input value={f} placeholder="Filtrer par titre ou numéro" aria-label="Filtrer les chapitres" onChange={(e) => setF(e.target.value)} />
    <div className="jardin-list">{list.map(([n, t, nb]) => <button key={n} className={'jardin-chap' + (lus.includes(n) ? ' lu' : '')} onClick={() => onOpen(n)}>
      <span className="astro-abbr">{lus.includes(n) ? <Check size={14} /> : n}</span><span className="workout-title"><strong>{t}</strong><small>{nb ? nb + ' hadith' + (nb > 1 ? 's' : '') : 'Versets'}</small></span></button>)}</div></div>;
}

function Lecteur({ n, highlight, index, state, isFav, onFav, onOpen, onRead, onBack, onMount, onCoran }: { n: number; highlight?: number; index: ChapitreIndex[]; state: JardinState; isFav: (c: number, n: number) => boolean;
  onFav: (c: number, n: number) => void; onOpen: (c: number) => void; onRead: (c: number, lu: boolean) => void; onBack: () => void; onMount: (c: number) => void; onCoran?: (s: number, v: number) => void }) {
  const [ch, setCh] = useState<Chapitre | null>(null), [error, setError] = useState('');
  const target = useRef<HTMLElement | null>(null);
  useEffect(() => { onMount(n); loadChapitre(n).then(setCh).catch(() => setError('Ce chapitre n’a pas pu se charger. Vérifie ta connexion.')); }, [n]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (ch && highlight) target.current?.scrollIntoView({ block: 'center' }); else window.scrollTo(0, 0); }, [ch, highlight]);
  const lu = state.lus.includes(n), max = index.length || 373;
  return <div className="screen jardin">
    <button className="link-btn small jardin-back" onClick={onBack}><ChevronLeft size={16} /> Le Jardin des vertueux</button>
    <header className="tab-head"><p className="ritual-label">Chapitre {n}</p><h1 className="jardin-titre">{ch?.t ?? index.find((x) => x[0] === n)?.[1] ?? ''}</h1></header>
    {error && <p className="fineprint" role="alert">{error}</p>}
    {ch && ch.v.length > 0 && <section className="ritual-card jardin-versets">{ch.v.flatMap((v) => versets(v)).map((v, i) => { const r = onCoran ? refCoran(v.ref) : null;
      return <p key={i}>{v.ref && (r ? <button className="ritual-label jardin-ref" onClick={() => onCoran!(r[0], r[1])}>{v.ref}</button> : <small className="ritual-label">{v.ref}</small>)}{v.texte}</p>; })}</section>}
    {ch?.h.map(([k, t]) => <article key={k} ref={k === highlight ? (el) => { target.current = el; } : undefined} className={'soft-card jardin-hadith' + (k === highlight ? ' on' : '')}>
      <div className="jardin-hadith-head"><span className="ritual-label">Hadith {k}</span>
        <button className="icon-btn" aria-pressed={isFav(n, k)} aria-label={isFav(n, k) ? 'Retirer des favoris' : 'Ajouter aux favoris'} onClick={() => onFav(n, k)}><Star size={16} fill={isFav(n, k) ? '#C2B48C' : 'none'} /></button></div>
      <p className="jardin-texte">{t}</p></article>)}
    {ch && <button className={'button wide ' + (lu ? 'ghost' : 'secondary')} onClick={() => onRead(n, !lu)}>{lu ? 'Chapitre lu (retirer)' : 'J’ai lu ce chapitre'}</button>}
    <div className="button-group jardin-nav">{n > 1 && <button className="button ghost small" onClick={() => onOpen(n - 1)}><ChevronLeft size={14} /> Chapitre {n - 1}</button>}
      {n < max && <button className="button ghost small" onClick={() => onOpen(n + 1)}>Chapitre {n + 1} <ChevronRight size={14} /></button>}</div>
    <p className="fineprint">{JARDIN_SOURCE}.</p>
  </div>;
}
