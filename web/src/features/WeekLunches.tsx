import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarPlus, ChevronLeft, ChevronRight, Lock, LockOpen, RefreshCw, Shuffle, Smartphone } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { consolidateIngredients } from '../lib/groceries';
import { cycleInfo } from '../lib/wellbeing';
import { addDays, isoOf, weekStartOf } from '../lib/rituals';
import { PERSONALIZED_RECIPES } from '../recipes/recipeIndex';
import type { CuratedRecipe } from '../recipes/types';
import { ColorTile, dishIcon } from '../ui/ColorTile';
import { Glyph } from '../ui/Glyph';
import { Segmented } from '../ui/kit';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const DRINKS = /chocolat chaud|jus de pomme|latte/i;
/** Plats qui se transportent et se réchauffent bien pour le midi. */
const POOL = PERSONALIZED_RECIPES.filter((r) => ['dejeuner', 'diner', 'quiches', 'poulet', 'automne'].includes(r.category) && !DRINKS.test(r.title) && r.servings >= 2);
const byId = new Map(PERSONALIZED_RECIPES.map((r) => [r.id, r]));

type Phase = 'menstruelle' | 'folliculaire' | 'ovulatoire' | 'luteale';
const PHASES: Record<Phase, { label: string; idea: string; words: RegExp }> = {
  menstruelle: { label: 'Phase menstruelle', idea: 'Du chaud et du réconfortant, riche en fer : lentilles, épinards, bœuf, soupes.', words: /lentille|épinard|epinard|bœuf|boeuf|pois chiche|soupe|velouté|haricot|betterave|potée|mijot/i },
  folliculaire: { label: 'Phase folliculaire', idea: 'Léger et frais : salades, poisson, légumes verts, agrumes.', words: /salade|poisson|saumon|thon|brocoli|courgette|citron|quinoa|avocat|crudit/i },
  ovulatoire: { label: 'Phase ovulatoire', idea: 'Coloré et plein de fibres : légumes crus et cuits, céréales complètes.', words: /tomate|poivron|légume|legume|quinoa|feta|salade|courgette|aubergine|ratatouille/i },
  luteale: { label: 'Phase lutéale', idea: 'Rassasiant et doux : patate douce, courges, céréales complètes, oléagineux.', words: /patate douce|butternut|potimarron|courge|pomme de terre|riz|avoine|noix|lentille|curry/i },
};
const phaseOfDay = (n: number, len: number): Phase => { const d = ((n - 1) % len) + 1; return d <= 5 ? 'menstruelle' : d <= 13 ? 'folliculaire' : d <= 16 ? 'ovulatoire' : 'luteale'; };

type Plan = { days: (string | null)[]; locked: boolean[]; mode: 'varie' | 'batch'; cycle: boolean };
const KEY = 'mt-midis-v1';
const empty = (): Plan => ({ days: [null, null, null, null, null], locked: [false, false, false, false, false], mode: 'varie', cycle: false });
const read = (week: string): Plan => { try { const all = JSON.parse(localStorage.getItem(KEY) || '{}'); return { ...empty(), ...all[week] }; } catch { return empty(); } };
const write = (week: string, p: Plan) => { try { const all = JSON.parse(localStorage.getItem(KEY) || '{}'); all[week] = p; localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* stockage indisponible */ } };
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)]!;
const text = (r: CuratedRecipe) => r.title + ' ' + r.ingredients;

/** Midis de la semaine de travail : composer, mélanger (bouton ou secousse du téléphone), suivre son cycle, préparer le batch du dimanche. */
export function WeekLunches({ entries, onCreate }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void> }) {
  const today = isoOf(new Date());
  const thisMonday = weekStartOf(today);
  const [week, setWeek] = useState(new Date().getDay() === 0 || new Date().getDay() === 6 ? addDays(thisMonday, 7) : thisMonday);
  const [plan, setPlan] = useState<Plan>(() => read(week));
  const [shake, setShake] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [choosing, setChoosing] = useState<number | null>(null);
  const [q, setQ] = useState('');
  useEffect(() => setPlan(read(week)), [week]);
  const save = (p: Plan) => { setPlan(p); write(week, p); setMsg(''); };
  const dates = DAYS.map((_, i) => addDays(week, i));

  // Phase du cycle pour chaque jour (estimation à partir des débuts de règles notés dans Ma santé).
  const cycle = cycleInfo(entries);
  const phases = useMemo(() => dates.map((d) => {
    if (!cycle) return null;
    const n = Math.round((new Date(d + 'T12:00:00').getTime() - new Date(cycle.last + 'T12:00:00').getTime()) / 86_400_000) + 1;
    return n >= 1 ? phaseOfDay(n, cycle.avg ?? 28) : null;
  }), [week, cycle?.last, cycle?.avg]);

  const candidates = (i: number, taken: Set<string>) => {
    const ph = plan.cycle ? phases[i] : null;
    const base = POOL.filter((r) => !taken.has(r.id));
    const matched = ph ? base.filter((r) => PHASES[ph].words.test(text(r))) : [];
    return matched.length >= 3 ? matched : base;
  };
  const shuffle = (only?: number) => {
    const days = [...plan.days];
    if (plan.mode === 'batch') {
      // 2 plats cuisinés le dimanche, alternés sur la semaine (3 si personne n'est verrouillé et que tu veux varier).
      const keep = days.filter((d, i) => d && plan.locked[i]) as string[];
      const chosen = new Set(keep);
      while (chosen.size < 2) chosen.add(pick(candidates(0, chosen)).id);
      const two = [...chosen];
      for (let i = 0; i < 5; i++) if (!plan.locked[i] && (only === undefined || only === i)) days[i] = two[i % two.length]!;
    } else {
      const taken = new Set(days.filter((d, i) => d && (plan.locked[i] || (only !== undefined && i !== only))) as string[]);
      for (let i = 0; i < 5; i++) {
        if (plan.locked[i] || (only !== undefined && only !== i)) continue;
        const r = pick(candidates(i, taken)); days[i] = r.id; taken.add(r.id);
      }
    }
    save({ ...plan, days });
  };

  // Secouer le téléphone pour mélanger les jours non verrouillés.
  const last = useRef(0);
  const shuffleRef = useRef(shuffle); shuffleRef.current = shuffle;
  useEffect(() => {
    if (!shake) return;
    const onMotion = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity; if (!a) return;
      const force = Math.abs((a.x ?? 0)) + Math.abs((a.y ?? 0)) + Math.abs((a.z ?? 0));
      if (force > 32 && Date.now() - last.current > 1200) { last.current = Date.now(); navigator.vibrate?.(60); shuffleRef.current(); }
    };
    window.addEventListener('devicemotion', onMotion);
    return () => window.removeEventListener('devicemotion', onMotion);
  }, [shake]);
  const toggleShake = async () => {
    if (shake) return setShake(false);
    const DM = (window as unknown as { DeviceMotionEvent?: { requestPermission?: () => Promise<string> } }).DeviceMotionEvent;
    try { if (DM?.requestPermission && await DM.requestPermission() !== 'granted') return setMsg('Autorise l’accès aux mouvements pour secouer le téléphone.'); }
    catch { return setMsg('Les mouvements du téléphone ne sont pas disponibles ici.'); }
    if (!('ondevicemotion' in window)) return setMsg('Cet appareil ne détecte pas les secousses : utilise « Surprends-moi ».');
    setShake(true); setMsg('Secoue ton téléphone pour mélanger les jours non verrouillés.');
  };

  const chosen = plan.days.map((id) => (id ? byId.get(id) ?? null : null));
  // Batch : combien de fois préparer chaque recette pour couvrir ses jours.
  const batch = useMemo(() => {
    const m = new Map<string, { r: CuratedRecipe; days: number[] }>();
    chosen.forEach((r, i) => { if (r) { const x = m.get(r.id) ?? { r, days: [] }; x.days.push(i); m.set(r.id, x); } });
    return [...m.values()].map((x) => ({ ...x, times: Math.ceil(x.days.length / x.r.servings) })).sort((a, b) => (b.r.prepMin + b.r.cookMin) - (a.r.prepMin + a.r.cookMin));
  }, [plan.days]);
  const groceries = useMemo(() => consolidateIngredients(batch.map((b) => ({ lines: b.r.ingredients.split(';').join('\n'), multiplier: b.times }))), [batch]);

  const schedule = async () => {
    setBusy(true); setMsg('');
    try {
      for (const b of batch) for (const i of b.days) {
        const date = dates[i]!;
        await onCreate({ module: 'cuisine', kind: 'meal', title: 'Déjeuner · ' + b.r.title, entry_date: date,
          data: { date, slot: 'Déjeuner', recipe: b.r.title, libraryId: b.r.id, ingredients: b.r.ingredients.split(';').join('\n'), portionShare: String(b.times / b.days.length) } });
      }
      setMsg('Midis ajoutés à « Ma semaine » et à ton agenda. La liste de courses est à jour.');
    } catch { setMsg('Impossible de planifier ces midis.'); }
    finally { setBusy(false); }
  };

  const list = q.trim() ? POOL.filter((r) => r.title.toLocaleLowerCase('fr').includes(q.trim().toLocaleLowerCase('fr'))).slice(0, 30) : POOL.slice(0, 0);
  const shortDate = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

  return <section className="lunches">
    <div className="week-nav">
      <button className="icon-btn" aria-label="Semaine précédente" onClick={() => setWeek(addDays(week, -7))}><ChevronLeft size={20} /></button>
      <strong>Midis du {shortDate(dates[0]!)} au {shortDate(dates[4]!)}</strong>
      <button className="icon-btn" aria-label="Semaine suivante" onClick={() => setWeek(addDays(week, 7))}><ChevronRight size={20} /></button>
    </div>
    <Segmented label="Mode" value={plan.mode} onChange={(mode) => save({ ...plan, mode })} options={[{ value: 'varie', label: 'Un plat par jour' }, { value: 'batch', label: 'Batch : 2 plats' }]} />
    <div className="lunch-actions">
      <button className="button primary" onClick={() => shuffle()}><Shuffle size={16} /> Surprends-moi</button>
      <button className={'button ' + (shake ? 'secondary' : 'ghost')} onClick={() => void toggleShake()}><Smartphone size={16} /> {shake ? 'Secousse activée' : 'Secouer le téléphone'}</button>
    </div>
    <div className="toggle-row cycle-toggle"><span><strong><Glyph name="moon" tint="lilas" /> Selon mon cycle</strong>
      <small>{cycle ? 'Idées adaptées à la phase estimée de chaque jour.' : 'Note le début de tes règles dans Ma santé pour activer les suggestions.'}</small></span>
      <button className={'switch' + (plan.cycle ? ' on' : '')} role="switch" aria-checked={plan.cycle} aria-label="Selon mon cycle" disabled={!cycle} onClick={() => save({ ...plan, cycle: !plan.cycle })}><span /></button></div>

    <div className="lunch-days">{DAYS.map((d, i) => {
      const r = chosen[i], ph = plan.cycle ? phases[i] : null;
      return <article key={d} className={'lunch-day' + (plan.locked[i] ? ' locked' : '')}>
        <div className="lunch-head"><strong>{d}</strong><small>{shortDate(dates[i]!)}</small>
          {ph && <span className={'phase-pill ' + ph}>{PHASES[ph].label.replace('Phase ', '')}</span>}</div>
        {r ? <button className="lunch-recipe" onClick={() => { setChoosing(i); setQ(''); }}>
          <ColorTile seed={r.category + r.id} icon={dishIcon(r.title, r.category)} label={r.title} />
          <span><strong>{r.title}</strong><small>{r.prepMin + r.cookMin} min · {r.servings} portions</small></span></button>
          : <button className="lunch-empty" onClick={() => { setChoosing(i); setQ(''); }}>+ Choisir un plat</button>}
        <div className="lunch-tools">
          <button className="icon-btn" aria-label={'Changer ' + d} disabled={plan.locked[i]} onClick={() => shuffle(i)}><RefreshCw size={16} /></button>
          <button className="icon-btn" aria-label={(plan.locked[i] ? 'Déverrouiller ' : 'Garder ') + d} onClick={() => save({ ...plan, locked: plan.locked.map((x, j) => j === i ? !x : x) })}>
            {plan.locked[i] ? <Lock size={16} /> : <LockOpen size={16} />}</button>
        </div>
        {choosing === i && <div className="lunch-picker">
          <input className="soft-input" autoFocus placeholder="Chercher une recette (quiche, poulet, lentilles…)" value={q} onChange={(e) => setQ(e.target.value)} />
          {list.map((x) => <button key={x.id} className="note-row" onClick={() => { const days = [...plan.days]; days[i] = x.id; save({ ...plan, days }); setChoosing(null); }}>
            <span className="note-emoji"><Glyph name={dishIcon(x.title, x.category)} tint="caramel" badge={34} /></span><span><strong>{x.title}</strong><small>{x.prepMin + x.cookMin} min</small></span></button>)}
          <button className="link-btn" onClick={() => setChoosing(null)}>Fermer</button>
        </div>}
      </article>;
    })}</div>

    {plan.cycle && cycle && <div className="phase-tips">{[...new Set(phases.filter(Boolean))].map((p) => <p key={p!}><strong>{PHASES[p!].label} :</strong> {PHASES[p!].idea}</p>)}</div>}

    {batch.length > 0 && <section className="ritual-card batch-plan">
      <p className="ritual-label"><Glyph name="pot" tint="caramel" /> Mon batch cooking du dimanche</p>
      <ol>{batch.map((b) => <li key={b.r.id}><strong>{b.r.title}</strong> × {b.times} ({b.times * b.r.servings} portions, pour {b.days.map((i) => DAYS[i]!.slice(0, 3)).join(', ')})
        <small> · {b.r.prepMin + b.r.cookMin} min · {b.r.storage}</small></li>)}</ol>
      <p className="fineprint">Commence par le plat le plus long, prépare les légumes de tout le monde en même temps, laisse refroidir avant de fermer les boîtes. Au-delà de 3 jours, congèle les portions du jeudi et du vendredi.</p>
      <details><summary>Courses pour ces midis ({groceries.length})</summary><ul className="planned">{groceries.map((g) => <li key={g}>{g}</li>)}</ul></details>
      <button className="button primary wide" disabled={busy} onClick={() => void schedule()}><CalendarPlus size={16} /> {busy ? 'Planification…' : 'Planifier ces midis'}</button>
    </section>}
    {msg && <p role="status" className="muted">{msg}</p>}
  </section>;
}
