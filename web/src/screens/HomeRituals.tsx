import { useEffect, useState } from 'react';
import { Brain, Clapperboard, Feather, HandHeart, Waves, BookHeart, BookOpen, Cake, Gift, CalendarCheck, ChevronDown, ChevronUp, Compass, Flower2, Heart, Leaf, Moon, Pill, Settings2, Sparkles, Timer } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { PandaWidget } from '../features/panda/PandaWidget';
import { MomentBar } from '../features/MomentBar';
import { TodayLearning, type LearningTarget } from '../features/TodayLearning';
import { affirmationOf, DAILY_KIND, HABIT_KIND, habitDone, habitFreq, habitScheduled, isoOf, NOTE_KIND } from '../lib/rituals';
import type { HomeSlot } from './Home';
import { taskBuckets } from '../features/TaskQuick';
import { prayerDay } from '../lib/wellbeing';
import { GRAT_KIND, type GratData } from '../lib/gratitude';

type Target = 'myday' | 'habits' | 'notes' | 'bienetre' | 'bilan' | 'boussole' | 'focus' | 'sommeil' | 'mediter' | 'complements' | 'proches' | 'lectures' | 'envies' | 'panda' | 'finances' | 'transformation' | 'carnet' | 'gratitude' | 'tcc' | 'hsp' | 'culture';
type Shortcut = { id: Exclude<Target, 'myday' | 'panda' | 'finances'>; label: string; sub: string; icon: typeof Heart };
const SHORTCUTS: Shortcut[] = [
  { id: 'habits', label: 'Habitudes', sub: 'Suivi quotidien', icon: Heart },
  { id: 'transformation', label: 'Ma meilleure version', sub: 'Programme 3 mois', icon: Sparkles },
  { id: 'gratitude', label: 'Ma gratitude', sub: 'Trois gratitudes, matin et soir', icon: HandHeart },
  { id: 'hsp', label: 'Mon hypersensibilité', sub: 'Surcharge, limites, recharge', icon: Waves },
  { id: 'tcc', label: 'Mes outils TCC', sub: 'Pensées, émotions, exercices', icon: Brain },
  { id: 'carnet', label: 'Mon carnet', sub: 'Souhaits, signes, chemin', icon: Feather },
  { id: 'notes', label: 'Mon journal', sub: 'Notes et historique', icon: BookHeart },
  { id: 'bienetre', label: 'Bien-être', sub: 'Humeur, cycle, prière', icon: Leaf },
  { id: 'bilan', label: 'Bilan de la semaine', sub: 'Humeurs, habitudes, victoires', icon: CalendarCheck },
  { id: 'boussole', label: 'Ma boussole', sub: 'Vision, objectifs, roue de la vie', icon: Compass },
  { id: 'focus', label: 'Focus', sub: 'Une plante pousse quand tu te concentres', icon: Timer },
  { id: 'sommeil', label: 'Sommeil', sub: 'Routine du soir et nuits', icon: Moon },
  { id: 'mediter', label: 'Méditer', sub: 'Respirations, guidées, minuteur', icon: Flower2 },
  { id: 'complements', label: 'Mes compléments', sub: 'Vitamines, cures, rappels', icon: Pill },
  { id: 'proches', label: 'Mes proches', sub: 'Anniversaires et idées de cadeaux', icon: Cake },
  { id: 'culture', label: 'Ma culture', sub: 'Lectures, séries et films', icon: Clapperboard },
  { id: 'lectures', label: 'Mes lectures', sub: 'Livres et citations', icon: BookOpen },
  { id: 'envies', label: 'Mes envies', sub: 'Ce que je veux m’offrir', icon: Gift },
];
export const HOME_CFG_KIND = 'reglages_accueil';

/** Accueil : carte « Mon jour », micro-rituels (respiration, affirmation) et raccourcis. */
export function HomeRituals({ entries, onGo, onLearn, onOpenDay, onCreate, onUpdate, slot }: {
  slot: HomeSlot;
  entries: Entry[]; onGo: (t: Target) => void; onLearn: (t: LearningTarget) => void; onOpenDay: (part: 'matin' | 'soir') => void; onCreate: (i: EntryInput) => Promise<void>;
  onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void>;
}) {
  // Raccourcis de l'accueil : choisis et ordonnés par moi (enregistrés avec mes données).
  const cfg = entries.find((e) => e.kind === HOME_CFG_KIND);
  const ids = SHORTCUTS.map((x) => x.id) as string[];
  const savedOrder = Array.isArray(cfg?.data.order) ? (cfg!.data.order as string[]).filter((x) => ids.includes(x)) : [];
  const order = [...savedOrder, ...ids.filter((x) => !savedOrder.includes(x))] as Shortcut['id'][];
  // Un raccourci ajouté depuis mon dernier réglage apparaît d'office (je peux le masquer ensuite).
  const shown = Array.isArray(cfg?.data.shown) ? [...(cfg!.data.shown as string[]), ...ids.filter((x) => !savedOrder.includes(x))] : ['habits', 'notes', 'bienetre', 'bilan', 'boussole', 'complements', 'proches'];
  const [editing, setEditing] = useState(false);
  const saveCfg = (o: string[], sh: string[]) => cfg ? onUpdate(cfg, { ...cfg.data, order: o, shown: sh })
    : onCreate({ module: 'quotidien', kind: HOME_CFG_KIND, title: 'Réglages de l’accueil', entry_date: null, data: { order: o, shown: sh } });
  const today = isoOf(new Date());
  const day = entries.find((e) => e.kind === DAILY_KIND && e.entry_date === today);
  const evening = new Date().getHours() >= 18;
  const morningDone = Boolean(day?.data.intention || day?.data.mood);
  const eveningDone = Boolean(day?.data.win || day?.data.tomorrow);
  const habits = entries.filter((e) => e.kind === HABIT_KIND);
  const habitsDone = habits.filter((e) => habitDone(e)[today]).length;
  const part = evening && morningDone ? 'soir' : 'matin';

  if (slot === 'pills') return <HomePills entries={entries} habitsLeft={habits.filter((h) => habitFreq(h) === 'daily' && habitScheduled(h, today) && !habitDone(h)[today]).length} onGo={onGo} onLearn={onLearn} />;
  if (slot === 'learning') return <TodayLearning entries={entries} today={today} onOpen={onLearn} onCreate={onCreate} onUpdate={onUpdate} />;
  if (slot === 'top') return <>
    {(part === 'soir' ? eveningDone : morningDone)
      // Une fois fait : une ligne discrète au lieu de la grande carte.
      ? <button className="reset-mini" onClick={() => onOpenDay(part)}>
          <span className="reset-icon small"><Sparkles size={16} /></span>
          <span className="reset-mini-text"><strong>{part === 'soir' ? 'Débriefing fait' : 'Intention du jour'}</strong>
            <small>{part === 'soir' ? 'Repose-toi bien.' : typeof day?.data.intention === 'string' && day.data.intention.trim() ? '« ' + day.data.intention.trim().slice(0, 70) + ' »' : 'Posée ce matin.'}</small></span>
          <span className="reset-mini-go">Revoir ›</span></button>
      : <section className="reset-card">
      <span className="reset-icon"><Sparkles size={22} /></span>
      <h2 className="serif">{part === 'soir' ? 'Mon débriefing du soir' : 'Mon Daily Reset'}</h2>
      <p>{part === 'soir' ? 'Ta victoire, ce que tu déposes, ton intention pour demain.' : '3 minutes pour t’aligner avec ta journée'}</p>
      <button className="button reset-btn" onClick={() => onOpenDay(part)}>Commencer →</button>
    </section>}

    <MomentBar entries={entries} onGo={onGo} onCreate={onCreate} onUpdate={onUpdate} />
  </>;
  if (slot === 'micro') return <>
    <div className="ritual-grid">
      <Breathing />
      <Affirmation day={today} kept={(text) => entries.some((e) => e.kind === NOTE_KIND && e.data.body === text)} onKeep={(text) => onCreate({ module: 'equilibre', kind: NOTE_KIND, title: 'Affirmation', entry_date: today,
        data: { noteId: crypto.randomUUID(), type: 'gratitude', heading: 'Affirmation', body: text, folder: 'bienetre', mood: '', updated: new Date().toISOString() } })} />
    </div>

    <PandaWidget entries={entries} onOpen={() => onGo('panda')} />
  </>;
  return <>
    <div className="shortcut-head"><span /><button className="link-btn small" onClick={() => setEditing(!editing)}><Settings2 size={14} /> {editing ? 'Terminé' : 'Personnaliser'}</button></div>
    {editing ? <div className="shortcut-edit">
      {order.map((id, i) => { const sc = SHORTCUTS.find((x) => x.id === id)!; const on = shown.includes(id);
        return <div key={id} className={'sc-row' + (on ? '' : ' off')}>
          <button className={'switch' + (on ? ' on' : '')} role="switch" aria-checked={on} aria-label={'Afficher ' + sc.label} onClick={() => void saveCfg(order, on ? shown.filter((x) => x !== id) : [...shown, id])}><span /></button>
          <span className="sc-label"><sc.icon size={16} /> {sc.label}</span>
          <button className="icon-btn" aria-label={'Monter ' + sc.label} disabled={i === 0} onClick={() => { const o = [...order]; [o[i - 1], o[i]] = [o[i]!, o[i - 1]!]; void saveCfg(o, shown); }}><ChevronUp size={16} /></button>
          <button className="icon-btn" aria-label={'Descendre ' + sc.label} disabled={i === order.length - 1} onClick={() => { const o = [...order]; [o[i + 1], o[i]] = [o[i]!, o[i + 1]!]; void saveCfg(o, shown); }}><ChevronDown size={16} /></button>
        </div>; })}
      <p className="muted small">Les raccourcis masqués restent accessibles depuis Espaces ou Bien-être.</p>
    </div> : <div className="shortcut-grid">
      {order.filter((id) => shown.includes(id)).map((id) => { const sc = SHORTCUTS.find((x) => x.id === id)!;
        return <button key={id} className="shortcut" onClick={() => onGo(sc.id)}><span><sc.icon size={20} /></span><strong>{sc.label}</strong><small>{sc.id === 'habits' && habits.length ? habitsDone + '/' + habits.length + ' aujourd’hui' : sc.sub}</small></button>; })}
    </div>}
  </>;
}

/** Respiration guidée de 2 minutes : 4 s d'inspiration, 6 s d'expiration. */
function Breathing() {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (!left) return;
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  const elapsed = 120 - left, inhale = elapsed % 10 < 4;
  return <div className="ritual-mini">
    <span className="ritual-k">Respiration · 2 min</span>
    <div className={'breath-dot' + (left ? (inhale ? ' in' : ' out') : '')} aria-hidden="true" />
    <strong>{left ? (inhale ? 'Inspire…' : 'Expire…') : 'Prête ?'}</strong>
    {left ? <button className="button ghost small" onClick={() => setLeft(0)}>Arrêter · {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</button>
      : <button className="button soft small" onClick={() => setLeft(120)}>Commencer</button>}
  </div>;
}

function Affirmation({ day, kept: already, onKeep }: { day: string; kept: (text: string) => boolean; onKeep: (text: string) => Promise<void> }) {
  const [shift, setShift] = useState(0);
  const text = affirmationOf(day, shift);
  const [keptNow, setKept] = useState(false);
  const kept = keptNow || already(text);
  return <div className="ritual-mini">
    <span className="ritual-k">Affirmation</span>
    <p className="affirm">« {text} »</p>
    <div className="ritual-actions">
      <button className="link-btn" onClick={() => { setShift(shift + 1); setKept(false); }}>Une autre</button>
      <button className="button soft small" disabled={kept} onClick={() => void onKeep(text).then(() => setKept(true))}>{kept ? 'Gardée ✓' : 'La garder'}</button>
    </div>
  </div>;
}

/** Pastilles en haut de l'accueil : un coup d'œil, et un geste pour aller à la bonne carte. */
function HomePills({ entries, habitsLeft, onGo, onLearn }: { entries: Entry[]; habitsLeft: number; onGo: (t: Target) => void; onLearn: (t: LearningTarget) => void }) {
  const today = isoOf(new Date()), now = new Date(), mins = now.getHours() * 60 + now.getMinutes();
  const tasks = taskBuckets(entries, today).jour.length;
  const times = prayerDay(entries)?.times ?? [];
  const next = times.find((t: { name: string; time: string }) => Number(t.time.slice(0, 2)) * 60 + Number(t.time.slice(3, 5)) > mins);
  const moment = now.getHours() < 14 ? 'matin' : 'soir';
  const grat = ((entries.find((e) => e.kind === GRAT_KIND && e.entry_date === today)?.data ?? {}) as GratData)[moment]?.filter((x) => x.trim()).length ?? 0;
  const jump = (id: string) => { const el = document.getElementById('home-' + id); el?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  return <div className="home-pills" role="navigation" aria-label="En un coup d’œil">
    <button onClick={() => jump('taches')}><strong>{tasks}</strong> tâche{tasks > 1 ? 's' : ''}</button>
    {next && <button onClick={() => jump('journee')}>{next.name} <strong>{next.time}</strong></button>}
    {habitsLeft > 0 && <button onClick={() => onGo('habits')}><strong>{habitsLeft}</strong> habitude{habitsLeft > 1 ? 's' : ''}</button>}
    <button onClick={() => onLearn('gratitude')}><strong>{grat}/3</strong> gratitude</button>
  </div>;
}
