import { useEffect, useRef, useState } from 'react';
import { Check, Gamepad2, Heart, Leaf, Lock, Moon, Sparkles, Utensils } from 'lucide-react';
import type { Entry, EntryInput } from '../../lib/cloud';
import { readProfile } from '../../lib/profile';
import { moodOn } from '../../screens/Review';
import { Bar, Segmented } from '../../ui/kit';
import { usePanda } from './PandaWidget';
import { DAILY_CAP, DOMAINS, ITEMS, LEVELS, MESSAGES, OUTFITS, PANDA_KIND, pick, RULES_VERSION, type Item } from './data';
import { addCare, booksOnShelf, foodsUnlocked, isGift, trim } from './engine';
import { GardenArt, ItemArt, PandaCharacter } from './PandaCharacter';
import type { PandaMood, PandaState, Room } from './types';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
type Tab = 'panda' | 'evolution' | 'deco';
const LOW = ['Épuisée', 'Fatiguée', 'Stressée'];
const seasonOf = (d: Date) => { const m = d.getMonth() + 1; return m >= 9 && m <= 11 ? 'automne' : m === 12 || m <= 2 ? 'hiver' : m <= 5 ? 'printemps' : 'ete'; };
const WALL: Record<string, string> = { automne: '#F6E7D8', hiver: '#EEF0F2', printemps: '#F7EEEA', ete: '#FBF1DF' };

export function PandaScreen({ entries, profileEntry, onCreate, onUpdate, onGo }: { entries: Entry[]; profileEntry?: Entry; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; onGo: (s: string) => void }) {
  const { entry, s, pr, today } = usePanda(entries);
  const [tab, setTab] = useState<Tab>('panda');
  const [act, setAct] = useState<{ mood: PandaMood; text: string } | null>(null);
  const [resting, setResting] = useState(false);
  const [game, setGame] = useState(false);
  const [name, setName] = useState('');
  const [link, setLink] = useState(true);
  const timer = useRef<number | undefined>(undefined), idle = useRef<number | undefined>(undefined);
  const now = new Date(), h = now.getHours();

  const save = (patch: Partial<PandaState>) => entry ? onUpdate(entry, { ...entry.data, ...patch }) : Promise.resolve();
  // XP acquise : on mémorise le plus haut total atteint (jamais de perte), et chaque nouveau niveau devient un souvenir.
  useEffect(() => {
    if (!entry) return;
    const patch: Partial<PandaState> = {};
    if (pr.earnedXp > s.xpPeak) patch.xpPeak = pr.earnedXp;
    if (pr.level.n > s.levelSeen) { patch.levelSeen = pr.level.n; patch.memories = [...s.memories, { date: today, text: s.name + ' devient ' + pr.level.name.toLowerCase() + '. Débloqué : ' + pr.level.unlock.toLowerCase() + '.' }]; }
    if (Object.keys(patch).length) void save({ ...patch, ...trim(s, today) });
  }, [entry?.id, pr.earnedXp, pr.level.n]); // eslint-disable-line react-hooks/exhaustive-deps
  // Mode repos : sans interaction pendant 40 s, il se détend (rien de négatif).
  const wake = () => { setResting(false); window.clearTimeout(idle.current); idle.current = window.setTimeout(() => setResting(true), 40_000); };
  useEffect(() => { wake(); return () => { window.clearTimeout(timer.current); window.clearTimeout(idle.current); }; }, []);

  if (!entry) return <div className="screen panda-screen">
    <header className="tab-head"><h1>Mon Panda</h1><p>Un compagnon doux qui grandit avec toi, à ton rythme.</p></header>
    <div className="panda-adopt"><PandaCharacter mood="happy" size={190} level={1} /></div>
    <section className="ritual-card form-stack">
      <p>Ton bébé panda mange, dort, joue et aménage son cocon. Ce que tu fais dans My Thirties peut l’aider à grandir, mais ne rien faire ne lui enlève jamais rien : il reste là, bienveillant.</p>
      <label>Son nom<input value={name} maxLength={24} placeholder="Bambou, Mochi, Caramel…" onChange={(e) => setName(e.target.value)} /></label>
      <label className="checklist-item"><input type="checkbox" checked={link} onChange={() => setLink(!link)} /> Relier mes activités (sport, sommeil, lecture, cuisine, habitudes, objectifs…) — seulement « fait tel jour », jamais le contenu</label>
      <button className="button primary" disabled={!name.trim()} onClick={() => void onCreate({ module: 'equilibre', kind: PANDA_KIND, title: 'Mon panda', entry_date: null,
        data: { name: name.trim(), createdAt: today, xpPeak: 0, spent: 0, care: {}, games: {}, unlocked: ['tapis', 'tenue:aucune'], equipped: ['tapis'], outfit: 'aucune', room: 'maison', levelSeen: 1,
          memories: [{ date: today, text: name.trim() + ' arrive dans ton cocon.' }], prefs: { linkPersonalActivities: link, useMoodContext: false, animationsEnabled: true }, rulesVersion: RULES_VERSION } })}>Adopter {name.trim() || 'mon panda'}</button>
    </section>
  </div>;

  const me = readProfile(profileEntry);
  const myBirthday = Boolean(me.birthDate) && me.birthDate.slice(5) === today.slice(5);
  const pandaBirthday = Boolean(s.createdAt) && s.createdAt.slice(5) === today.slice(5) && s.createdAt !== today;
  const lowMood = s.prefs.useMoodContext && LOW.includes(moodOn(entries, today));
  const unlocked = new Set(s.unlocked), equipped = new Set(s.equipped);
  const room: Room = pr.level.n >= 4 ? s.room : 'maison';
  const seed = Number(today.replace(/-/g, '')) + now.getHours();
  const night = h >= 22 || h < 6;
  const mood: PandaMood = act?.mood ?? (resting || night ? 'sleepy' : lowMood ? 'calm' : pr.level.n > s.levelSeen ? 'proud' : equipped.has('etagere') && h >= 14 && h < 17 ? 'reading' : equipped.has('theiere') && h >= 16 && h < 18 ? 'tea' : 'idle');
  const message = act?.text ?? (myBirthday ? 'Joyeux anniversaire ! J’ai sorti mon chapeau de fête.' : pandaBirthday ? 'C’est notre anniversaire ensemble aujourd’hui !'
    : lowMood ? MESSAGES.calm : night ? MESSAGES.night : resting ? pick(MESSAGES.rest, seed) : pick(MESSAGES.hello, seed));
  const react = (m: PandaMood, list: readonly string[], kind?: 'pet' | 'feed' | 'play') => {
    wake(); setAct({ mood: m, text: pick(list, Date.now()) });
    window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setAct(null), 3500);
    if (kind) { const patch = addCare(s, kind, today); if (Object.keys(patch).length) void save(patch); }
  };
  const careLeft = Number(s.care[today]) || 0;
  const gameToday = Math.max(0, (Number(s.games[today]) || 0));
  const unlock = (id: string, price: number, equip = true) => void save({ unlocked: [...s.unlocked, id], spent: s.spent + price, ...(equip && !id.startsWith('tenue:') ? { equipped: [...s.equipped, id] } : {}),
    memories: [...s.memories, { date: today, text: 'Nouveau : ' + (ITEMS.find((i) => i.id === id)?.name ?? OUTFITS.find((o) => 'tenue:' + o.id === id)?.name ?? id) + '.' }] });
  const season = seasonOf(now);
  const shown = ITEMS.filter((i) => unlocked.has(i.id) && equipped.has(i.id));
  const foods = foodsUnlocked(pr.counts);

  return <div className={'screen panda-screen' + (s.prefs.animationsEnabled ? '' : ' no-anim')}>
    <header className="panda-head">
      <div><small className="eyebrow">MY THIRTIES · MON COMPAGNON</small><h1>{s.name}</h1><p>{pr.level.name} · Niveau {pr.level.n}</p></div>
      <span className="bamboo-pill" aria-label={pr.bamboo + ' bambous'}><Leaf size={16} /> {pr.bamboo}</span>
    </header>
    <div className="panda-xp"><Bar value={pr.span ? pr.into / pr.span : 1} tone="caramel" /><small className="muted">{pr.next ? pr.into + ' / ' + pr.span + ' XP vers ' + pr.next.name.toLowerCase() : pr.xp + ' XP · il continue d’apprendre'}</small></div>
    <Segmented label="Espace du panda" value={tab} onChange={setTab} options={[{ value: 'panda', label: 'Mon panda' }, { value: 'evolution', label: 'Évolution' }, { value: 'deco', label: 'Déco & tenues' }]} />

    {tab === 'panda' && <>
      {pr.level.n >= 4 && <Segmented label="Pièce" value={room} onChange={(r) => void save({ room: r })} options={[{ value: 'maison', label: 'Maison' }, { value: 'jardin', label: 'Jardin' }]} />}
      <div className={'panda-scene room-' + room} style={{ background: room === 'jardin' ? '#E7F0E4' : WALL[season] }}>
        <svg className="scene-bg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
          {room === 'maison' ? <>
            <rect x="0" y="210" width="400" height="90" fill="#EAD9C7" />
            <rect x="130" y="40" width="140" height="110" rx="12" fill="#E9EEF0" stroke="#6B4433" strokeWidth="3" /><path d="M200 40 V150 M130 95 H270" stroke="#6B4433" strokeWidth="3" />
            {shown.filter((i) => i.room === 'maison').map((i) => <ItemArt key={i.id} id={i.id} books={booksOnShelf(pr.counts)} />)}
          </> : <>
            <rect x="0" y="0" width="400" height="300" fill="#DDEBDF" /><path d="M0 200 Q200 150 400 200 V300 H0Z" fill="#B9CFAE" />
            <g transform="translate(0 110)">{shown.filter((i) => i.room === 'jardin').map((i) => <GardenArt key={i.id} id={i.id} />)}</g>
          </>}
          {season === 'automne' && <g fill="#C98A55">{[40, 340, 90, 300].map((x, i) => <path key={x} className="leaf-fall" style={{ animationDelay: i * 1.2 + 's' }} d={`M${x} 20 q8 -8 14 0 q-6 10 -14 0Z`} />)}</g>}
          {season === 'hiver' && <g fill="#fff">{[60, 330, 110, 280].map((x, i) => <circle key={x} className="leaf-fall" style={{ animationDelay: i * 1.1 + 's' }} cx={x} cy="20" r="4" />)}</g>}
          {(myBirthday || pandaBirthday) && <g><rect x="320" y="226" width="44" height="26" rx="4" fill="#F7E3C3" stroke="#6B4433" strokeWidth="3" /><path d="M342 226 v-12" stroke="#6B4433" strokeWidth="3" /><circle cx="342" cy="210" r="4" fill="#FFB86B" /></g>}
        </svg>
        <button className={'scene-panda' + (act ? ' acting' : '')} aria-label={'Caresser ' + s.name} onClick={() => react('happy', MESSAGES.pet, 'pet')}>
          <PandaCharacter mood={mood} outfit={s.outfit} level={pr.level.n} size={170} party={myBirthday} /></button>
        {act?.mood === 'happy' && <span className="hearts" aria-hidden="true"><Heart size={18} /><Heart size={14} /><Heart size={16} /></span>}
      </div>
      <p className="panda-bubble" role="status">{message}</p>
      {lowMood && !act && <button className="button secondary wide" onClick={() => onGo('calme')}>Un moment calme</button>}
      <div className="panda-actions">
        <button className="button secondary" onClick={() => react('eating', MESSAGES.feed, 'feed')}><Utensils size={16} /> Nourrir</button>
        <button className="button secondary" onClick={() => { react('playful', MESSAGES.play, 'play'); setGame(true); }}><Gamepad2 size={16} /> Jouer</button>
        <button className="button secondary" onClick={() => { setAct({ mood: 'sleepy', text: pick(MESSAGES.rest, Date.now()) }); window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setAct(null), 6000); }}><Moon size={16} /> Repos</button>
      </div>
      <p className="muted small">Touche {s.name} pour un câlin. {careLeft >= 5 ? 'Il a eu plein d’attentions aujourd’hui : l’XP de câlins est au maximum, mais il adore toujours ça.' : ''}</p>
      {game && <BambooGame left={Math.max(0, DAILY_CAP.gameBamboo - gameToday)} onEnd={(n) => { setGame(false); if (n > 0) { void save({ games: { ...s.games, [today]: gameToday + n } }); setAct({ mood: 'proud', text: 'Bravo ! +' + n + ' bambous.' }); } }} />}
      <section className="ritual-card"><p className="ritual-label">Son garde-manger</p><div className="chip-row">{foods.map((f) => <span key={f} className="chip">{f}</span>)}</div>
        <p className="muted small">Chaque recette ou repas noté dans Ma cuisine lui fait découvrir un nouvel aliment.</p></section>
    </>}

    {tab === 'evolution' && <>
      <ol className="panda-levels">{LEVELS.map((l) => <li key={l.n} className={l.n < pr.level.n ? 'done' : l.n === pr.level.n ? 'now' : ''}>
        <span className="lvl-dot">{l.n < pr.level.n ? <Check size={14} /> : l.n}</span>
        <div><strong>{l.name}</strong> <small className="muted">· {l.stage} · {l.from} XP</small><p className="muted small">{l.unlock}</p></div></li>)}</ol>
      <section className="ritual-card"><p className="ritual-label">Ce qui l’a fait grandir</p>
        {!s.prefs.linkPersonalActivities && <p className="muted small">Le lien avec tes modules est désactivé : il grandit seulement grâce à vos moments ensemble.</p>}
        <div className="skill-grid">{DOMAINS.map((d) => <div key={d.id} className="skill"><strong>{d.module}</strong><small>{pr.counts[d.id]} activité{pr.counts[d.id] > 1 ? 's' : ''} · il {d.reaction}</small><small className="muted">Récompense : {d.reward}</small></div>)}</div>
        <p className="muted small">Ces récompenses sont un petit plus facultatif, pas une mesure de ta valeur ni de ta santé.</p>
      </section>
      <section className="ritual-card"><p className="ritual-label"><Sparkles size={14} /> Nos souvenirs</p>
        {[...s.memories].reverse().map((m, i) => <p key={i} className="memory"><small className="muted">{new Date(m.date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</small> {m.text}</p>)}</section>
      <section className="ritual-card form-stack"><p className="ritual-label">Réglages et confidentialité</p>
        <label className="checklist-item"><input type="checkbox" checked={s.prefs.linkPersonalActivities} onChange={() => void save({ prefs: { ...s.prefs, linkPersonalActivities: !s.prefs.linkPersonalActivities } })} /> Relier mes activités (seulement « fait tel jour », jamais le contenu)</label>
        <label className="checklist-item"><input type="checkbox" checked={s.prefs.useMoodContext} onChange={() => void save({ prefs: { ...s.prefs, useMoodContext: !s.prefs.useMoodContext } })} /> Adapter ses messages à mon humeur déclarée du jour</label>
        <label className="checklist-item"><input type="checkbox" checked={s.prefs.animationsEnabled} onChange={() => void save({ prefs: { ...s.prefs, animationsEnabled: !s.prefs.animationsEnabled } })} /> Animations</label>
        <label>Son nom<input defaultValue={s.name} maxLength={24} onBlur={(e) => e.target.value.trim() && e.target.value.trim() !== s.name && void save({ name: e.target.value.trim() })} /></label>
        <p className="muted small">Tout reste dans tes données privées. Aucune IA externe, aucun achat réel, aucune notification du panda. Désactiver un lien n’efface jamais l’XP déjà acquise.</p>
      </section>
    </>}

    {tab === 'deco' && <>
      <p className="muted">Tu as <strong>{pr.bamboo} bambous</strong>, gagnés avec tes activités et les jeux, jamais avec de l’argent réel.</p>
      <section className="ritual-card"><p className="ritual-label">Maison et jardin</p>
        <div className="shop-grid">{ITEMS.map((it) => <ShopItem key={it.id} it={it} level={pr.level.n} gift={isGift(it, pr.counts)} owned={unlocked.has(it.id)} on={equipped.has(it.id)} bamboo={pr.bamboo}
          onUnlock={(free) => unlock(it.id, free ? 0 : it.price)} onToggle={() => void save({ equipped: equipped.has(it.id) ? s.equipped.filter((x) => x !== it.id) : [...s.equipped, it.id] })} />)}</div></section>
      <section className="ritual-card"><p className="ritual-label">Tenues</p>
        <div className="shop-grid">{OUTFITS.map((o) => { const has = o.price === 0 || unlocked.has('tenue:' + o.id), locked = pr.level.n < o.level;
          return <div key={o.id} className={'shop-item' + (has ? ' owned' : '') + (locked && !has ? ' locked' : '')}><strong>{o.name}</strong>
            {has ? <button className={'link-btn small' + (s.outfit === o.id ? ' on' : '')} onClick={() => void save({ outfit: o.id })}>{s.outfit === o.id ? 'Portée' : 'La porter'}</button>
              : locked ? <small className="muted"><Lock size={12} /> Niveau {o.level}</small>
              : <button className="button secondary small" disabled={pr.bamboo < o.price} onClick={() => unlock('tenue:' + o.id, o.price, false)}><Leaf size={12} /> {o.price}</button>}</div>; })}</div></section>
    </>}
  </div>;
}

function ShopItem({ it, level, gift, owned, on, bamboo, onUnlock, onToggle }: { it: Item; level: number; gift: boolean; owned: boolean; on: boolean; bamboo: number; onUnlock: (free: boolean) => void; onToggle: () => void }) {
  const locked = level < it.level && !gift;
  const d = it.gift ? DOMAINS.find((x) => x.id === it.gift!.domain) : undefined;
  return <div className={'shop-item' + (owned ? ' owned' : '') + (locked && !owned ? ' locked' : '')}>
    <strong>{it.name}</strong><small className="muted">{it.room === 'jardin' ? 'Jardin' : 'Maison'}</small>
    {owned ? <button className="link-btn small" onClick={onToggle}>{on ? 'Le ranger' : 'Le sortir'}</button>
      : gift || it.price === 0 ? <button className="button primary small" onClick={() => onUnlock(true)}>Offert : le récupérer</button>
      : locked ? <small className="muted"><Lock size={12} /> Niveau {it.level}</small>
      : <button className="button secondary small" disabled={bamboo < it.price} onClick={() => onUnlock(false)}><Leaf size={12} /> {it.price}</button>}
    {!owned && d && !gift && <small className="muted">Offert après {it.gift!.n} activité{it.gift!.n > 1 ? 's' : ''} « {d.module} »</small>}
  </div>;
}

/** Mini-jeu indépendant de mes habitudes : attraper les bambous pendant 20 secondes. */
function BambooGame({ left, onEnd }: { left: number; onEnd: (n: number) => void }) {
  const [t, setT] = useState(20), [score, setScore] = useState(0), [spots, setSpots] = useState<{ id: number; x: number; y: number }[]>([]);
  const id = useRef(0);
  useEffect(() => {
    const tick = window.setInterval(() => setT((v) => v - 1), 1000);
    const spawn = window.setInterval(() => { const n = ++id.current; setSpots((v) => [...v.slice(-4), { id: n, x: 6 + Math.random() * 80, y: 14 + Math.random() * 66 }]); window.setTimeout(() => setSpots((v) => v.filter((x) => x.id !== n)), 1400); }, 650);
    return () => { window.clearInterval(tick); window.clearInterval(spawn); };
  }, []);
  useEffect(() => { if (t <= 0) onEnd(Math.min(score, left)); }, [t]); // eslint-disable-line react-hooks/exhaustive-deps
  return <section className="bamboo-game" aria-label="Mini-jeu : attrape les bambous">
    <div className="game-top"><strong>{score} bambou{score > 1 ? 's' : ''}</strong><span>{Math.max(0, t)} s</span></div>
    {!left && <p className="muted small">Les bambous de jeu du jour sont déjà gagnés : on joue juste pour le plaisir !</p>}
    {spots.map((p) => <button key={p.id} className="bamboo-target" style={{ left: p.x + '%', top: p.y + '%' }} aria-label="Attraper le bambou"
      onClick={() => { setScore((n) => n + 1); setSpots((x) => x.filter((y) => y.id !== p.id)); }}><Leaf size={26} /></button>)}
  </section>;
}
