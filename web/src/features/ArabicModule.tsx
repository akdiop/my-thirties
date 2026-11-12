import { useMemo, useRef, useState } from 'react';
import { BookOpen, Brain, Ear, Languages, PenLine, Repeat, Shuffle, Timer, Type, Volume2 } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { isoOf } from '../lib/rituals';
import { ALPHABET, HARAKAT, SOURCE_ARABE, vocalise } from '../lib/arabe/alphabet';
import { PREMIERS_MOTS } from '../lib/arabe/premiersMots';
import { RELIGIEUX, type Famille } from '../lib/arabe/religieux';
import { FORMES, VERBES } from '../lib/arabe/verbes';
import { FAWAID, GRAMMAIRE_SIMPLIFIEE, type Chapitre } from '../lib/arabe/grammaire';
import { addXp, ARABE_KIND, boxOf, grade, mastered, MAX_BOX, PAQUETS, paquet, question, session, shuffle, streak, type ArabeData, type Carte } from '../lib/arabe/jeux';
import type { Book } from '../lib/lessons';
import { BookPages } from './SpiritLessons';
import { speak } from './LearningPaths';
import { Bar, RowLink, Segmented } from '../ui/kit';

type Tab = 'jeux' | 'fiches' | 'grammaire' | 'lecture';
type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
type Finish = (xp: number, update?: (d: ArabeData) => ArabeData, best?: number) => void;
const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window;
const say = (t: string) => speak(t, 'ar-SA');

const GAMES = [
  { id: 'cartes', name: 'Cartes à retourner', hint: 'Je savais ou à revoir : les cartes reviennent selon ta mémoire', Icon: Repeat },
  { id: 'sens', name: 'Que veut dire… ?', hint: 'Un mot arabe, quatre traductions', Icon: Languages },
  { id: 'arabe', name: 'Comment dit-on… ?', hint: 'Un mot français, quatre mots arabes', Icon: PenLine },
  { id: 'ecoute', name: 'À l’écoute', hint: 'Écoute le mot et trouve son sens', Icon: Ear },
  { id: 'paires', name: 'Les paires', hint: 'Relie chaque mot arabe à sa traduction', Icon: Brain },
  { id: 'lettres', name: 'Lire les voyelles', hint: 'Une lettre vocalisée : comment se lit-elle ?', Icon: Type },
  { id: 'chrono', name: 'Défi 60 secondes', hint: 'Le plus de bonnes réponses en une minute', Icon: Timer },
  { id: 'conjugaison', name: 'Conjugaison', hint: 'Passé, présent, impératif et nom d’action des 50 verbes', Icon: Shuffle },
] as const;
type GameId = (typeof GAMES)[number]['id'];

const LIVRETS: { title: string; sub: string; book: Book }[] = [
  { title: 'Apprendre à lire l’arabe', sub: 'lettres, voyelles, exercices de lecture', book: { dir: 'apprendre-lire', pages: 35, size: [1169, 658] } },
  { title: 'Lire l’arabe sans les voyelles', sub: 'méthode et exemples', book: { dir: 'lire-sans-voyelles', pages: 18, size: [827, 1170] } },
];

/** Mon arabe : jeux de mémorisation, fiches avec phonétique, alphabet et voyelles, livrets d'origine. */
export function ArabicModule({ entries, onCreate, onUpdate }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save }) {
  const [tab, setTab] = useState<Tab>('jeux');
  const entry = entries.find((e) => e.kind === ARABE_KIND);
  const data = (entry?.data ?? {}) as ArabeData;
  const today = isoOf(new Date());
  const save = (d: ArabeData) => entry ? onUpdate(entry, { ...entry.data, ...d })
    : onCreate({ module: 'spiritualite', kind: ARABE_KIND, title: 'Mon arabe', entry_date: null, data: d });
  const finish: Finish = (xp, update, best) => void save(addXp(update ? update(data) : data, xp, today, best));
  const total = PAQUETS.reduce((n, p) => n + p.cards.length, 0);
  return <section className="stack-8 arabe">
    <div className="soft-card ar-stats">
      <div><strong>{data.xp ?? 0}</strong><small>points</small></div>
      <div><strong>{streak(data, today)}</strong><small>jours de suite</small></div>
      <div><strong>{mastered(data)}</strong><small>mots retenus sur {total}</small></div>
    </div>
    <Segmented label="Mon arabe" value={tab} onChange={setTab} options={[{ value: 'jeux', label: 'Jeux' }, { value: 'fiches', label: 'Fiches' }, { value: 'grammaire', label: 'Grammaire' }, { value: 'lecture', label: 'Lecture' }]} />
    {tab === 'jeux' && <Games data={data} onFinish={finish} />}
    {tab === 'fiches' && <Fiches data={data} />}
    {tab === 'grammaire' && <Grammaire />}
    {tab === 'lecture' && <><Alphabet /><Livrets /></>}
    <p className="fineprint">Contenus : {SOURCE_ARABE}. Phonétique ajoutée : â, î, û longs ; ‘ pour le ‘ayn ; ’ pour la hamza.</p>
  </section>;
}

function Games({ data, onFinish }: { data: ArabeData; onFinish: Finish }) {
  const [game, setGame] = useState<GameId | null>(null);
  const [deckId, setDeckId] = useState('pm-salutations');
  const deck = paquet(deckId).cards;
  const end: Finish = (xp, update, best) => { onFinish(xp, update, best); };
  if (!game) return <>
    <label>Paquet de mots<select value={deckId} onChange={(e) => setDeckId(e.target.value)}>
      <optgroup label="Pour commencer">{PAQUETS.filter((p) => p.id === 'alphabet' || p.id.startsWith('pm-')).map((p) => <option key={p.id} value={p.id}>{p.title} ({p.cards.length})</option>)}</optgroup>
      <optgroup label="Vocabulaire religieux">{PAQUETS.filter((p) => p.id.startsWith('rel-')).map((p) => <option key={p.id} value={p.id}>{p.title} ({p.cards.length})</option>)}</optgroup>
      <optgroup label="Verbes et grammaire"><option value="verbes">50 verbes (50)</option><option value="grammaire">{paquet('grammaire').title} ({paquet('grammaire').cards.length})</option></optgroup>
    </select></label>
    <Bar value={deck.filter((c) => boxOf(data, c.id) >= 3).length / deck.length} />
    <div className="game-grid">{GAMES.filter((g) => g.id !== 'ecoute' || canSpeak()).map((g) => <button key={g.id} className="game-card" onClick={() => setGame(g.id)}>
      <span className="game-emoji" aria-hidden="true"><g.Icon size={22} /></span><strong>{g.name}</strong><small className="muted">{g.hint}</small></button>)}</div>
  </>;
  const close = () => setGame(null);
  return <section className="mini-game" aria-label={GAMES.find((g) => g.id === game)!.name}>
    <button className="link-btn small" onClick={close}>← Tous les jeux</button>
    {game === 'cartes' && <Flashcards data={data} deck={deck} onEnd={(xp, u) => { end(xp, u); close(); }} />}
    {(game === 'sens' || game === 'arabe' || game === 'ecoute') && <Choice mode={game} data={data} deck={deck} onEnd={(xp, u) => { end(xp, u); close(); }} />}
    {game === 'paires' && <Pairs deck={deck} onEnd={(xp) => { end(xp); close(); }} />}
    {game === 'lettres' && <Letters onEnd={(xp) => { end(xp); close(); }} />}
    {game === 'chrono' && <Chrono deck={deck.length >= 4 ? deck : PAQUETS.flatMap((p) => p.cards)} best={data.best ?? 0} onEnd={(xp, best) => { end(xp, undefined, best); close(); }} />}
    {game === 'conjugaison' && <Conjugation onEnd={(xp) => { end(xp); close(); }} />}
  </section>;
}

const Ar = ({ text, big }: { text: string; big?: boolean }) => <span className={'ar-word' + (big ? ' big' : '')} lang="ar" dir="rtl">{text}</span>;
const Listen = ({ text }: { text: string }) => canSpeak() ? <button className="icon-btn" aria-label="Écouter" onClick={() => say(text)}><Volume2 size={18} /></button> : null;
const Top = ({ left, right }: { left: string; right?: string }) => <div className="game-top"><strong>{left}</strong>{right ? <span>{right}</span> : null}</div>;
function Done({ text, xp, onEnd }: { text: string; xp: number; onEnd: () => void }) {
  return <div className="game-done"><p><strong>{text}</strong></p><p className="muted">+{xp} point{xp > 1 ? 's' : ''}</p>
    <button className="button primary" onClick={onEnd}>Terminer</button></div>;
}

/** Cartes à retourner : je savais (la carte monte d'une boîte) ou à revoir (elle revient au début). */
function Flashcards({ data, deck, onEnd }: { data: ArabeData; deck: Carte[]; onEnd: (xp: number, u: (d: ArabeData) => ArabeData) => void }) {
  const [cards] = useState(() => session(data, deck, 12));
  const [i, setI] = useState(0), [shown, setShown] = useState(false);
  const results = useRef<[string, boolean][]>([]);
  const apply = (d: ArabeData) => results.current.reduce((acc, [id, ok]) => grade(acc, id, ok), d);
  const known = results.current.filter(([, ok]) => ok).length;
  if (i >= cards.length) return <Done text={known + ' sur ' + cards.length + ' retenues'} xp={known * 2} onEnd={() => onEnd(known * 2, apply)} />;
  const c = cards[i]!;
  const next = (ok: boolean) => { results.current.push([c.id, ok]); setShown(false); setI(i + 1); };
  return <div className="soft-card ar-card">
    <Top left={(i + 1) + ' / ' + cards.length} right={'boîte ' + (boxOf(data, c.id) + 1) + ' sur ' + (MAX_BOX + 1)} />
    <button className="ar-flip" onClick={() => setShown(true)} aria-label="Retourner la carte"><Ar text={c.ar} big />
      {shown ? <><em>{c.ph}</em><strong>{c.fr}</strong></> : <small className="muted">Touche pour voir la réponse</small>}</button>
    <div className="game-row"><Listen text={c.ar} />
      {shown && <><button className="button ghost" onClick={() => next(false)}>À revoir</button><button className="button primary" onClick={() => next(true)}>Je savais</button></>}</div>
  </div>;
}

/** Questions à quatre réponses : sens d'un mot arabe, mot arabe pour un sens, ou mot entendu. */
function Choice({ mode, data, deck, onEnd }: { mode: 'sens' | 'arabe' | 'ecoute'; data: ArabeData; deck: Carte[]; onEnd: (xp: number, u: (d: ArabeData) => ArabeData) => void }) {
  const [cards] = useState(() => session(data, deck, 10));
  const [i, setI] = useState(0), [picked, setPicked] = useState<string | null>(null);
  const results = useRef<[string, boolean][]>([]);
  const c = cards[i];
  const options = useMemo(() => (c ? question(c, deck) : []), [c, deck]);
  const good = results.current.filter(([, ok]) => ok).length;
  if (!c) return <Done text={good + ' bonnes réponses sur ' + cards.length} xp={good} onEnd={() => onEnd(good, (d) => results.current.reduce((acc, [id, ok]) => grade(acc, id, ok), d))} />;
  const pick = (o: Carte) => { if (picked) return; setPicked(o.id); results.current.push([c.id, o.id === c.id]); if (mode !== 'arabe') say(c.ar); };
  return <div className="soft-card ar-card">
    <Top left={(i + 1) + ' / ' + cards.length} right={good + ' juste' + (good > 1 ? 's' : '')} />
    <div className="ar-prompt">{mode === 'sens' && <><Ar text={c.ar} big />{picked && <em>{c.ph}</em>}</>}
      {mode === 'arabe' && <strong>{c.fr}</strong>}
      {mode === 'ecoute' && <button className="button soft" onClick={() => say(c.ar)}><Volume2 size={18} /> Écouter le mot</button>}</div>
    <div className="ar-options">{options.map((o) => <button key={o.id} className={'ar-option' + (picked ? (o.id === c.id ? ' good' : o.id === picked ? ' bad' : '') : '')} onClick={() => pick(o)}>
      {mode === 'arabe' ? <><Ar text={o.ar} />{picked && <small>{o.ph}</small>}</> : o.fr}</button>)}</div>
    {picked && <button className="button primary wide" onClick={() => { setPicked(null); setI(i + 1); }}>Suivant</button>}
  </div>;
}

/** Les paires : six mots arabes à relier à leur traduction. */
function Pairs({ deck, onEnd }: { deck: Carte[]; onEnd: (xp: number) => void }) {
  const [set] = useState(() => shuffle(deck).filter((c, i, a) => a.findIndex((x) => x.fr === c.fr) === i).slice(0, 6));
  const [tiles] = useState(() => shuffle(set.flatMap((c) => [{ key: c.id + 'a', id: c.id, text: c.ar, ar: true }, { key: c.id + 'f', id: c.id, text: c.fr, ar: false }])));
  const [sel, setSel] = useState<string | null>(null), [found, setFound] = useState<string[]>([]), [miss, setMiss] = useState(0);
  if (found.length === set.length) { const xp = Math.max(1, set.length * 2 - miss); return <Done text={'Toutes les paires, ' + miss + ' erreur' + (miss > 1 ? 's' : '')} xp={xp} onEnd={() => onEnd(xp)} />; }
  const tap = (t: (typeof tiles)[number]) => {
    if (found.includes(t.id)) return;
    if (!sel) { setSel(t.key); return; }
    const first = tiles.find((x) => x.key === sel)!;
    if (first.key === t.key) { setSel(null); return; }
    if (first.id === t.id && first.ar !== t.ar) { setFound([...found, t.id]); if (t.ar || first.ar) say(set.find((c) => c.id === t.id)!.ar); } else setMiss(miss + 1);
    setSel(null);
  };
  return <div className="soft-card ar-card"><Top left={found.length + ' / ' + set.length + ' paires'} right={miss ? miss + ' erreur' + (miss > 1 ? 's' : '') : undefined} />
    <div className="ar-pairs">{tiles.map((t) => <button key={t.key} className={'ar-option' + (found.includes(t.id) ? ' good' : sel === t.key ? ' on' : '')} onClick={() => tap(t)}>
      {t.ar ? <Ar text={t.text} /> : t.text}</button>)}</div></div>;
}

/** Lire les voyelles : une lettre avec sa voyelle, et quatre lectures possibles. */
function Letters({ onEnd }: { onEnd: (xp: number) => void }) {
  const [round] = useState(() => Array.from({ length: 10 }, () => {
    const h = HARAKAT[Math.floor(Math.random() * 7)]!, x = ALPHABET[1 + Math.floor(Math.random() * 27)]!;
    const right = vocalise(x, h);
    const wrong = shuffle(HARAKAT.slice(0, 7).filter((o) => o.id !== h.id)).slice(0, 2).map((o) => vocalise(x, o).ph);
    const near = ALPHABET.find((y) => y.ph !== x.ph && y.ph[0] === x.ph[0]) ?? ALPHABET[(ALPHABET.indexOf(x) + 1) % 28]!;
    return { ar: right.ar, ph: right.ph, name: x.name, options: shuffle([...new Set([right.ph, ...wrong, vocalise(near, h).ph])]) };
  }));
  const [i, setI] = useState(0), [picked, setPicked] = useState<string | null>(null), [good, setGood] = useState(0);
  const q = round[i];
  if (!q) return <Done text={good + ' lectures justes sur ' + round.length} xp={good} onEnd={() => onEnd(good)} />;
  return <div className="soft-card ar-card"><Top left={(i + 1) + ' / ' + round.length} right={good + ' juste' + (good > 1 ? 's' : '')} />
    <div className="ar-prompt"><Ar text={q.ar} big />{picked && <small className="muted">la lettre {q.name}</small>}</div>
    <div className="ar-options">{q.options.map((o) => <button key={o} className={'ar-option' + (picked ? (o === q.ph ? ' good' : o === picked ? ' bad' : '') : '')}
      onClick={() => { if (picked) return; setPicked(o); if (o === q.ph) setGood(good + 1); say(q.ar); }}>{o}</button>)}</div>
    {picked && <button className="button primary wide" onClick={() => { setPicked(null); setI(i + 1); }}>Suivant</button>}
  </div>;
}

/** Défi 60 secondes : sens des mots arabes, le plus vite possible. */
function Chrono({ deck, best, onEnd }: { deck: Carte[]; best: number; onEnd: (xp: number, best: number) => void }) {
  const [start, setStart] = useState<number | null>(null), [now, setNow] = useState(0);
  const [c, setC] = useState(() => deck[Math.floor(Math.random() * deck.length)]!);
  const [score, setScore] = useState(0), [miss, setMiss] = useState(0);
  const options = useMemo(() => question(c, deck), [c, deck]);
  const timer = useRef<number | null>(null);
  const left = start ? Math.max(0, 60 - Math.floor((now - start) / 1000)) : 60;
  if (start && left === 0) { if (timer.current) { window.clearInterval(timer.current); timer.current = null; }
    return <Done text={score + ' bonnes réponses' + (score > best ? ', nouveau record' : best ? ' · record ' + best : '')} xp={score} onEnd={() => onEnd(score, score)} />; }
  if (!start) return <div className="soft-card ar-card"><p>Une minute pour trouver le sens d’un maximum de mots.{best ? ' Ton record : ' + best + '.' : ''}</p>
    <button className="button primary wide" onClick={() => { const t = Date.now(); setStart(t); setNow(t); timer.current = window.setInterval(() => setNow(Date.now()), 250); }}>C’est parti</button></div>;
  return <div className="soft-card ar-card"><Top left={score + ' juste' + (score > 1 ? 's' : '') + (miss ? ' · ' + miss + ' raté' + (miss > 1 ? 's' : '') : '')} right={left + ' s'} />
    <div className="ar-prompt"><Ar text={c.ar} big /></div>
    <div className="ar-options">{options.map((o) => <button key={o.id} className="ar-option" onClick={() => {
      if (o.id === c.id) setScore(score + 1); else setMiss(miss + 1);
      let n = c; while (deck.length > 1 && n.id === c.id) n = deck[Math.floor(Math.random() * deck.length)]!; setC(n);
    }}>{o.fr}</button>)}</div></div>;
}

/** Conjugaison : pour un verbe, retrouver la forme demandée parmi ses quatre formes. */
function Conjugation({ onEnd }: { onEnd: (xp: number) => void }) {
  const [round] = useState(() => shuffle(VERBES).slice(0, 10).map((v) => ({ v, k: 1 + Math.floor(Math.random() * 3) })));
  const [i, setI] = useState(0), [picked, setPicked] = useState<number | null>(null), [good, setGood] = useState(0);
  const q = round[i];
  const order = useMemo(() => shuffle([0, 1, 2, 3]), [i]);
  if (!q) return <Done text={good + ' formes justes sur ' + round.length} xp={good * 2} onEnd={() => onEnd(good * 2)} />;
  return <div className="soft-card ar-card"><Top left={(i + 1) + ' / ' + round.length} right={good + ' juste' + (good > 1 ? 's' : '')} />
    <div className="ar-prompt"><strong>{q.v.fr}</strong><Ar text={q.v.ar[0]} big /><em>{q.v.ph[0]}</em><p className="ritual-label">{FORMES[q.k]} ?</p></div>
    <div className="ar-options">{order.map((k) => <button key={k} className={'ar-option' + (picked !== null ? (k === q.k ? ' good' : k === picked ? ' bad' : '') : '')}
      onClick={() => { if (picked !== null) return; setPicked(k); if (k === q.k) setGood(good + 1); say(q.v.ar[q.k]); }}>
      <Ar text={q.v.ar[k]} />{picked !== null && <small>{q.v.ph[k]} · {FORMES[k]}</small>}</button>)}</div>
    {picked !== null && <button className="button primary wide" onClick={() => { setPicked(null); setI(i + 1); }}>Suivant</button>}
  </div>;
}

/** Fiches : chaque famille de mots avec l'arabe, la phonétique et le sens. */
function Fiches({ data }: { data: ArabeData }) {
  const [group, setGroup] = useState<'pm' | 'rel' | 'verbes'>('pm');
  return <>
    <Segmented label="Fiches" value={group} onChange={setGroup} options={[{ value: 'pm', label: 'Premiers mots' }, { value: 'rel', label: 'Religieux' }, { value: 'verbes', label: '50 verbes' }]} />
    {group === 'pm' && <Families list={PREMIERS_MOTS} prefix="pm-" data={data} />}
    {group === 'rel' && <Families list={RELIGIEUX} prefix="rel-" data={data} />}
    {group === 'verbes' && VERBES.map((v) => <details key={v.n} className="soft-card ar-verb"><summary><span>{v.n}. {v.fr}</span><Ar text={v.ar[0]} /></summary>
      <div className="ar-table">{FORMES.map((f, k) => <div key={f} className="ar-line"><small>{f}</small><Ar text={v.ar[k]} /><em>{v.ph[k]}</em><Listen text={v.ar[k]} /></div>)}</div></details>)}
  </>;
}

function Families({ list, prefix, data }: { list: Famille[]; prefix: string; data: ArabeData }) {
  return <>{list.map((f) => { const deck = paquet(prefix + f.id).cards; const known = deck.filter((c) => boxOf(data, c.id) >= 3).length;
    return <details key={f.id} className="soft-card ar-verb"><summary><span>{f.title}</span><small className="muted">{known}/{deck.length}</small></summary>
      {f.note && <p className="muted small">{f.note}</p>}
      <div className="ar-table">{f.words.map((w, i) => <div key={i} className="ar-line"><Ar text={w.ar} /><em>{w.ph}</em><span>{w.fr}</span><Listen text={w.ar} /></div>)}</div></details>; })}</>;
}

/** Alphabet : les 28 lettres avec leur nom et leur son, puis chaque lettre avec la voyelle choisie et sa lecture. */
function Alphabet() {
  const [h, setH] = useState<(typeof HARAKAT)[number]['id']>('fatha');
  const haraka = HARAKAT.find((x) => x.id === h)!;
  return <>
    <div className="ar-letters">{ALPHABET.map((x) => <button key={x.ar} className="ar-letter" onClick={() => say(x.ar)} aria-label={'Lettre ' + x.name}>
      <Ar text={x.ar} big /><strong>{x.name}</strong><small>{x.hint}</small></button>)}</div>
    <div className="soft-card"><p className="ritual-label">Les voyelles</p>
      <div className="chip-row">{HARAKAT.map((x) => <button key={x.id} className={'chip' + (x.id === h ? ' on' : '')} aria-pressed={x.id === h} onClick={() => setH(x.id)}>{x.name}</button>)}</div>
      <p className="muted small">{haraka.rule}</p>
      <div className="ar-letters syl">{ALPHABET.map((x) => { const v = vocalise(x, haraka); return <button key={x.ar} className="ar-letter" onClick={() => say(v.ar)}><Ar text={v.ar} big /><strong>{v.ph}</strong></button>; })}</div>
    </div>
    <div className="soft-card"><p className="ritual-label">Lettres solaires et lunaires</p>
      <p className="muted small">Devant une lettre solaire, le « l » de « al » ne se prononce pas et la lettre se double : الشَّمْس, ash-shams. Devant une lettre lunaire, il se prononce : الْقَمَر, al-qamar.</p>
      <p><strong>Solaires</strong> <Ar text={ALPHABET.filter((x) => x.solar).map((x) => x.ar).join(' ')} /></p>
      <p><strong>Lunaires</strong> <Ar text={ALPHABET.filter((x) => !x.solar).map((x) => x.ar).join(' ')} /></p></div>
  </>;
}

/** Livrets dont les pages ne sont pas encore transcrites : pages d'origine. */
function Livrets() {
  const [open, setOpen] = useState<string | null>(null);
  const l = LIVRETS.find((x) => x.book.dir === open);
  if (l) return <><button className="link-btn back-link" onClick={() => setOpen(null)}>‹ Livrets</button><BookPages book={l.book} title={l.title} /></>;
  return <><p className="ritual-label">Livrets de lecture, pages d’origine</p>
    <div className="rows">{LIVRETS.map((x) => <RowLink key={x.book.dir} icon={BookOpen} title={x.title} sub={x.sub} onClick={() => setOpen(x.book.dir)} />)}</div></>;
}

/** Grammaire : les deux livrets recopiés, chaque fiche avec l'arabe, la phonétique et la traduction. */
function Grammaire() {
  const [book, setBook] = useState<'gs' | 'fw'>('gs');
  const list: Chapitre[] = book === 'gs' ? GRAMMAIRE_SIMPLIFIEE : FAWAID;
  return <>
    <Segmented label="Livret de grammaire" value={book} onChange={setBook} options={[{ value: 'gs', label: 'Grammaire simplifiée' }, { value: 'fw', label: '30 fawâ’id' }]} />
    {list.map((c, i) => <details key={c.id} className="soft-card ar-verb"><summary><span>{i + 1}. {c.titre[2]}</span>{/[\u0600-\u06FF]/.test(c.titre[0]) && <Ar text={c.titre[0]} />}</summary>
      {c.titre[1] && <p className="muted small">{c.titre[1]}</p>}
      {c.blocs.map((bl, k) => <div key={k} className="ar-table">
        {bl.titre && <div className="ar-bloc-title">{/[\u0600-\u06FF]/.test(bl.titre[0]) ? <Ar text={bl.titre[0]} /> : <strong>{bl.titre[0]}</strong>}{bl.titre[1] && <em>{bl.titre[1]}</em>}{bl.titre[2] && <strong>{bl.titre[2]}</strong>}</div>}
        {bl.lignes.map((l, j) => <div key={j} className="ar-line">{l[0] && <Ar text={l[0]} />}{l[1] && <em>{l[1]}</em>}{l[2] && <span>{l[2]}</span>}{l[0] && /[\u0600-\u06FF]/.test(l[0]) && <Listen text={l[0]} />}</div>)}
      </div>)}
    </details>)}
    <p className="fineprint">{book === 'gs' ? '« La grammaire simplifiée »' : '« 30 fawâ’id indispensables dans la grammaire et la conjugaison »'}, Apprendre l’arabe facilement. Phonétique et traductions ajoutées.</p>
  </>;
}
