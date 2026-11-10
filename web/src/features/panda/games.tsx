import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Brain, Calculator, CircleHelp, EyeOff, Heart, Leaf, Moon, Music, ShoppingBasket, Sparkles, Sun, Type } from 'lucide-react';
import { assetUrl } from './assets';

/** Mini-jeux du panda. Chaque jeu rend le nombre de bambous gagnés (plafonnés par jour dans PandaScreen). */
type End = (n: number) => void;
export const GAMES = [
  { id: 'bambous', name: 'Attrape les bambous', hint: 'Touche les bambous avant qu’ils disparaissent', Icon: Leaf },
  { id: 'panier', name: 'Le panier', hint: 'Déplace le panier pour attraper ce qui tombe', Icon: ShoppingBasket },
  { id: 'memory', name: 'Memory', hint: 'Retrouve les paires d’objets du panda', Icon: Brain },
  { id: 'simon', name: 'Suis le rythme', hint: 'Répète la séquence de plus en plus longue', Icon: Music },
  { id: 'cache', name: 'Cache-cache', hint: 'Suis le coussin où le panda se cache', Icon: EyeOff },
  { id: 'quiz', name: 'Vrai ou faux panda', hint: 'Ce que tu sais sur les pandas', Icon: CircleHelp },
  { id: 'mot', name: 'Le mot mystère', hint: 'Devine le mot lettre par lettre', Icon: Type },
  { id: 'calcul', name: 'Calcul express', hint: 'Un maximum de calculs en 30 secondes', Icon: Calculator },
] as const;
export type GameId = (typeof GAMES)[number]['id'];

const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const Top = ({ left, right }: { left: string; right?: string }) => <div className="game-top"><strong>{left}</strong>{right ? <span>{right}</span> : null}</div>;
function Done({ text, n, onEnd }: { text: string; n: number; onEnd: End }) {
  return <div className="game-done"><p><strong>{text}</strong></p><p className="muted">{n > 0 ? '+' + n + ' bambou' + (n > 1 ? 's' : '') : 'Pas de bambou cette fois, on retente ?'}</p>
    <button className="button primary" onClick={() => onEnd(n)}>Terminer</button></div>;
}

export function GameHub({ left, onEnd }: { left: number; onEnd: End }) {
  const [g, setG] = useState<GameId | null>(null);
  const finish: End = (n) => { setG(null); onEnd(Math.min(n, left)); };
  if (!g) return <section className="game-hub" aria-label="Mini-jeux">
    {!left && <p className="muted small">Les bambous de jeu du jour sont déjà gagnés : on joue juste pour le plaisir !</p>}
    <div className="game-grid">{GAMES.map((x) => <button key={x.id} className="game-card" onClick={() => setG(x.id)}>
      <span className="game-emoji" aria-hidden="true"><x.Icon size={22} /></span><strong>{x.name}</strong><small className="muted">{x.hint}</small></button>)}</div>
    <button className="button ghost small" onClick={() => onEnd(0)}>Fermer</button>
  </section>;
  return <section className="mini-game" aria-label={'Mini-jeu : ' + GAMES.find((x) => x.id === g)!.name}>
    <button className="link-btn small" onClick={() => setG(null)}>← Tous les jeux</button>
    {g === 'bambous' && <Bamboo onEnd={finish} />}
    {g === 'panier' && <Basket onEnd={finish} />}
    {g === 'memory' && <Memory onEnd={finish} />}
    {g === 'simon' && <Simon onEnd={finish} />}
    {g === 'cache' && <Cushions onEnd={finish} />}
    {g === 'quiz' && <Quiz onEnd={finish} />}
    {g === 'mot' && <Word onEnd={finish} />}
    {g === 'calcul' && <Maths onEnd={finish} />}
  </section>;
}

/* 1. Attraper les bambous pendant 20 secondes. */
function Bamboo({ onEnd }: { onEnd: End }) {
  const [t, setT] = useState(20), [score, setScore] = useState(0), [spots, setSpots] = useState<{ id: number; x: number; y: number }[]>([]);
  const id = useRef(0);
  useEffect(() => {
    const tick = window.setInterval(() => setT((v) => v - 1), 1000);
    const spawn = window.setInterval(() => { const n = ++id.current; setSpots((v) => [...v.slice(-4), { id: n, x: 6 + Math.random() * 80, y: 14 + Math.random() * 66 }]); window.setTimeout(() => setSpots((v) => v.filter((x) => x.id !== n)), 1400); }, 650);
    return () => { window.clearInterval(tick); window.clearInterval(spawn); };
  }, []);
  if (t <= 0) return <Done text={score + ' bambous attrapés !'} n={score} onEnd={onEnd} />;
  return <div className="bamboo-game"><Top left={score + ' bambou' + (score > 1 ? 's' : '')} right={t + ' s'} />
    {spots.map((p) => <button key={p.id} className="bamboo-target" style={{ left: p.x + '%', top: p.y + '%' }} aria-label="Attraper le bambou"
      onClick={() => { setScore((n) => n + 1); setSpots((x) => x.filter((y) => y.id !== p.id)); }}><Leaf size={26} /></button>)}
  </div>;
}

/* 2. Le panier : bambous (+1), bambous dorés (+3), cailloux à éviter (−2). */
function Basket({ onEnd }: { onEnd: End }) {
  const [x, setX] = useState(50), [score, setScore] = useState(0), [t, setT] = useState(25);
  const [items, setItems] = useState<{ id: number; x: number; y: number; k: 'b' | 'g' | 'r' }[]>([]);
  const xs = useRef(50), id = useRef(0), area = useRef<HTMLDivElement>(null);
  xs.current = x;
  useEffect(() => {
    const tick = window.setInterval(() => setT((v) => v - 1), 1000);
    const spawn = window.setInterval(() => { const r = Math.random(); setItems((v) => [...v, { id: ++id.current, x: 8 + Math.random() * 84, y: 0, k: r < 0.12 ? 'g' : r < 0.32 ? 'r' : 'b' }]); }, 700);
    const fall = window.setInterval(() => setItems((v) => {
      let gain = 0; const keep = [];
      for (const it of v) { const y = it.y + 3; if (y >= 84 && y < 96 && Math.abs(it.x - xs.current) < 11) gain += it.k === 'g' ? 3 : it.k === 'r' ? -2 : 1; else if (y < 100) keep.push({ ...it, y }); }
      if (gain) setScore((s) => Math.max(0, s + gain));
      return keep;
    }), 60);
    return () => { window.clearInterval(tick); window.clearInterval(spawn); window.clearInterval(fall); };
  }, []);
  const move = (clientX: number) => { const r = area.current?.getBoundingClientRect(); if (r) setX(Math.max(8, Math.min(92, ((clientX - r.left) / r.width) * 100))); };
  if (t <= 0) return <Done text={'Panier rempli : ' + score + ' points !'} n={score} onEnd={onEnd} />;
  return <>
    <div ref={area} className="bamboo-game basket-game" onPointerMove={(e) => move(e.clientX)} onPointerDown={(e) => move(e.clientX)}>
      <Top left={score + (score > 1 ? ' pts' : ' pt')} right={t + ' s'} />
      {items.map((it) => <span key={it.id} className={'fall-item k-' + it.k} style={{ left: it.x + '%', top: it.y + '%' }} aria-hidden="true">{it.k === 'r' ? <span className="rock" /> : <Leaf size={22} />}</span>)}
      <span className="basket" style={{ left: x + '%' }} aria-hidden="true">{assetUrl('icon_panier') ? <img src={assetUrl('icon_panier')} alt="" /> : <ShoppingBasket size={34} />}</span>
    </div>
    <div className="game-row"><button className="button secondary" aria-label="Gauche" onClick={() => setX((v) => Math.max(8, v - 12))}><ArrowLeft size={18} /></button>
      <small className="muted">Doré = +3 · caillou = −2</small>
      <button className="button secondary" aria-label="Droite" onClick={() => setX((v) => Math.min(92, v + 12))}><ArrowRight size={18} /></button></div>
  </>;
}

/* 3. Memory avec les objets du panda. */
const MEM = ['lunettes', 'chapeau', 'sac', 'livre', 'the', 'coussin', 'panier', 'plante', 'lanterne', 'echarpe', 'coeur', 'bambou'];
function Memory({ onEnd }: { onEnd: End }) {
  const [cards] = useState(() => shuffle(shuffle(MEM).slice(0, 6).flatMap((k) => [k, k])));
  const [open, setOpen] = useState<number[]>([]), [found, setFound] = useState<string[]>([]), [moves, setMoves] = useState(0);
  const flip = (i: number) => {
    if (open.length === 2 || open.includes(i) || found.includes(cards[i])) return;
    const o = [...open, i]; setOpen(o);
    if (o.length === 2) { setMoves((m) => m + 1);
      if (cards[o[0]] === cards[o[1]]) { setFound((f) => [...f, cards[i]]); setOpen([]); } else window.setTimeout(() => setOpen([]), 800); }
  };
  if (found.length === 6) { const n = Math.max(3, 18 - moves); return <Done text={'Toutes les paires en ' + moves + ' coups !'} n={n} onEnd={onEnd} />; }
  return <><Top left={found.length + ' / 6 paires'} right={moves + (moves > 1 ? ' coups' : ' coup')} />
    <div className="memory-grid">{cards.map((k, i) => { const up = open.includes(i) || found.includes(k);
      return <button key={i} className={'memory-card' + (up ? ' up' : '')} aria-label={up ? k : 'Carte cachée'} onClick={() => flip(i)}>
        {up ? (assetUrl('icon_' + k) ? <img src={assetUrl('icon_' + k)} alt="" /> : k) : <Leaf size={20} />}</button>; })}</div></>;
}

/* 4. Suis le rythme (séquence à mémoriser). */
const PADS = [{ c: '#d4dad1', I: Leaf }, { c: '#e5e2d9', I: Heart }, { c: '#dcd5ea', I: Moon }, { c: '#e5dfd1', I: Sun }];
function Simon({ onEnd }: { onEnd: End }) {
  const [seq, setSeq] = useState<number[]>(() => [Math.floor(Math.random() * 4)]);
  const [lit, setLit] = useState<number | null>(null), [pos, setPos] = useState(0), [showing, setShowing] = useState(true), [over, setOver] = useState(false);
  useEffect(() => {
    if (over) return; setShowing(true); setPos(0); let i = 0;
    const iv = window.setInterval(() => { if (i >= seq.length) { window.clearInterval(iv); setLit(null); setShowing(false); return; }
      setLit(seq[i]); window.setTimeout(() => setLit(null), 380); i++; }, 650);
    return () => window.clearInterval(iv);
  }, [seq, over]);
  const press = (p: number) => {
    if (showing || over) return; setLit(p); window.setTimeout(() => setLit(null), 200);
    if (p !== seq[pos]) { setOver(true); return; }
    if (pos + 1 === seq.length) window.setTimeout(() => setSeq((s) => [...s, Math.floor(Math.random() * 4)]), 450); else setPos(pos + 1);
  };
  const rounds = seq.length - 1;
  if (over) return <Done text={'Séquence de ' + rounds + ' réussie' + (rounds > 1 ? 's' : '')} n={Math.min(15, rounds * 2)} onEnd={onEnd} />;
  return <><Top left={'Niveau ' + seq.length} right={showing ? 'Regarde…' : 'À toi !'} />
    <div className="simon-grid">{PADS.map(({ c, I }, i) => <button key={i} className={'simon-pad' + (lit === i ? ' lit' : '')} style={{ background: c }} aria-label={'Touche ' + (i + 1)} onClick={() => press(i)}><I size={30} /></button>)}</div></>;
}

/* 5. Cache-cache : le panda se cache sous un coussin, les coussins se mélangent. */
function Cushions({ onEnd }: { onEnd: End }) {
  const [round, setRound] = useState(1), [order, setOrder] = useState([0, 1, 2]), [phase, setPhase] = useState<'show' | 'mix' | 'pick' | 'res'>('show');
  const [pick, setPick] = useState<number | null>(null), [score, setScore] = useState(0);
  useEffect(() => {
    if (phase === 'show') { const t = window.setTimeout(() => setPhase('mix'), 1200); return () => window.clearTimeout(t); }
    if (phase === 'mix') { let n = 0; const swaps = 3 + round * 2;
      const iv = window.setInterval(() => { setOrder((o) => { const a = Math.floor(Math.random() * 3), b = (a + 1 + Math.floor(Math.random() * 2)) % 3; const c = [...o]; [c[a], c[b]] = [c[b], c[a]]; return c; });
        if (++n >= swaps) { window.clearInterval(iv); window.setTimeout(() => setPhase('pick'), 450); } }, Math.max(260, 560 - round * 60));
      return () => window.clearInterval(iv); }
  }, [phase, round]);
  if (round > 5) return <Done text={score + ' / 5 trouvés'} n={score * 2} onEnd={onEnd} />;
  const choose = (c: number) => { if (phase !== 'pick') return; setPick(c); setPhase('res'); if (c === 0) setScore((s) => s + 1); };
  const panda = assetUrl('panda_curious');
  return <><Top left={'Manche ' + round + ' / 5'} right={score + ' trouvé' + (score > 1 ? 's' : '')} />
    <div className="cushion-row">{[0, 1, 2].map((c) => { const up = phase === 'show' || (phase === 'res' && (c === 0 || c === pick));
      return <button key={c} className={'cushion' + (up ? ' up' : '')} style={{ left: order[c] * 33.3 + 3 + '%' }} aria-label={'Coussin ' + (order[c] + 1)} onClick={() => choose(c)}>
        <span className="cushion-top" aria-hidden="true" />{up && c === 0 && (panda ? <img src={panda} alt="Le panda" /> : <span>Panda</span>)}</button>; })}</div>
    {phase === 'res' && <div className="game-row"><strong>{pick === 0 ? 'Trouvé !' : 'Raté, il était là !'}</strong>
      <button className="button secondary" onClick={() => { setRound((r) => r + 1); setPick(null); setPhase('show'); }}>Suivant</button></div>}
    {phase === 'pick' && <p className="muted small center">Où se cache le panda ?</p>}
  </>;
}

/* 6. Vrai ou faux sur les pandas. */
const FACTS: [string, boolean, string][] = [
  ['Le panda géant mange surtout du bambou.', true, 'Le bambou fait l’essentiel de son alimentation.'],
  ['Un panda peut passer plus de 10 heures par jour à manger.', true, 'Le bambou nourrit peu, alors il en mange beaucoup.'],
  ['À la naissance, un bébé panda pèse environ 100 à 200 grammes.', true, 'Il est minuscule par rapport à sa mère.'],
  ['Le panda géant vit à l’état sauvage en Chine.', true, 'Dans les forêts de montagne du centre de la Chine.'],
  ['Le panda géant hiberne tout l’hiver.', false, 'Il n’hiberne pas : il descend plutôt vers des zones moins froides.'],
  ['Son système digestif est celui d’un carnivore.', true, 'C’est pour ça qu’il digère mal le bambou.'],
  ['Il a une sorte de « sixième doigt » pour tenir le bambou.', true, 'Un os du poignet allongé qui fait office de pouce.'],
  ['Le panda roux est un proche cousin du panda géant.', false, 'Malgré le nom, ils appartiennent à des familles différentes.'],
  ['Le panda géant est un ours.', true, 'Il fait partie de la famille des ursidés.'],
  ['Les pandas vivent en grands troupeaux.', false, 'Ce sont des animaux plutôt solitaires.'],
  ['Un panda adulte peut peser plus de 100 kg.', true, 'Surtout les mâles.'],
  ['Les bébés pandas naissent déjà noirs et blancs.', false, 'Ils naissent roses, presque sans poils ; les taches arrivent ensuite.'],
];
function Quiz({ onEnd }: { onEnd: End }) {
  const [qs] = useState(() => shuffle(FACTS).slice(0, 6));
  const [i, setI] = useState(0), [score, setScore] = useState(0), [ans, setAns] = useState<boolean | null>(null);
  if (i >= qs.length) return <Done text={score + ' / ' + qs.length + ' bonnes réponses'} n={score * 2} onEnd={onEnd} />;
  const [q, truth, why] = qs[i];
  const answer = (v: boolean) => { if (ans !== null) return; setAns(v); if (v === truth) setScore((s) => s + 1); };
  return <><Top left={'Question ' + (i + 1) + ' / ' + qs.length} right={score + (score > 1 ? ' pts' : ' pt')} />
    <p className="quiz-q">{q}</p>
    {ans === null ? <div className="game-row"><button className="button secondary" onClick={() => answer(true)}>Vrai</button><button className="button secondary" onClick={() => answer(false)}>Faux</button></div>
      : <div className="quiz-res"><strong>{ans === truth ? 'Bonne réponse !' : 'Pas tout à fait…'}</strong> {truth ? 'Vrai' : 'Faux'} : {why}
        <button className="button secondary" onClick={() => { setI(i + 1); setAns(null); }}>Suivante</button></div>}
  </>;
}

/* 7. Le mot mystère (7 essais). */
const WORDS = ['BAMBOU', 'NUAGE', 'JARDIN', 'COUSSIN', 'LANTERNE', 'PLANTE', 'VOYAGE', 'SOLEIL', 'PANIER', 'CHOCOLAT', 'BOUGIE', 'PRINTEMPS', 'CERISE', 'LUNETTES', 'TISANE', 'MONTAGNE', 'CARNET', 'BALADE'];
function Word({ onEnd }: { onEnd: End }) {
  const [w] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [tried, setTried] = useState<string[]>([]);
  const miss = tried.filter((l) => !w.includes(l)).length, lives = 7 - miss, won = [...w].every((l) => tried.includes(l));
  if (won || lives <= 0) return <Done text={won ? 'Bravo, c’était « ' + w + ' » !' : 'Le mot était « ' + w + ' »'} n={won ? 3 + lives : 0} onEnd={onEnd} />;
  return <><Top left={'Essais restants : ' + lives} />
    <p className="word-slots" aria-label="Mot à deviner">{[...w].map((l, i) => <span key={i}>{tried.includes(l) ? l : '_'}</span>)}</p>
    <div className="letter-grid">{'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l) => <button key={l} disabled={tried.includes(l)} className={tried.includes(l) ? (w.includes(l) ? 'ok' : 'ko') : ''} onClick={() => setTried([...tried, l])}>{l}</button>)}</div></>;
}

/* 8. Calcul express : 30 secondes. */
function newCalc() { const op = ['+', '−', '×'][Math.floor(Math.random() * 3)]; let a = 2 + Math.floor(Math.random() * 18), b = 2 + Math.floor(Math.random() * 12);
  if (op === '×') { a = 2 + Math.floor(Math.random() * 9); b = 2 + Math.floor(Math.random() * 9); } if (op === '−' && b > a) [a, b] = [b, a];
  const r = op === '+' ? a + b : op === '−' ? a - b : a * b; const opts = shuffle([r, r + 1 + Math.floor(Math.random() * 3), Math.max(0, r - 1 - Math.floor(Math.random() * 3)), r + 10].filter((v, i, s) => s.indexOf(v) === i)).slice(0, 3);
  if (!opts.includes(r)) opts[0] = r; return { q: a + ' ' + op + ' ' + b, r, opts: shuffle(opts) }; }
function Maths({ onEnd }: { onEnd: End }) {
  const [t, setT] = useState(30), [c, setC] = useState(newCalc), [score, setScore] = useState(0), [flash, setFlash] = useState('');
  useEffect(() => { const iv = window.setInterval(() => setT((v) => v - 1), 1000); return () => window.clearInterval(iv); }, []);
  if (t <= 0) return <Done text={score + ' calcul' + (score > 1 ? 's' : '') + ' justes'} n={score} onEnd={onEnd} />;
  return <><Top left={score + (score > 1 ? ' pts' : ' pt')} right={t + ' s'} />
    <p className={'calc-q ' + flash}>{c.q} = ?</p>
    <div className="game-row">{c.opts.map((o) => <button key={o} className="button secondary" onClick={() => { const ok = o === c.r; if (ok) setScore((s) => s + 1); setFlash(ok ? 'ok' : 'ko'); window.setTimeout(() => setFlash(''), 250); setC(newCalc()); }}>{o}</button>)}</div>
    <p className="muted small center"><Sparkles size={12} /> Va vite, mais juste !</p></>;
}
