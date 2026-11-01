import { useEffect, useState } from 'react';
import { BookHeart, CalendarCheck, Heart, Leaf, Sparkles } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { affirmationOf, DAILY_KIND, HABIT_KIND, habitDone, isoOf, NOTE_KIND } from '../lib/rituals';

type Target = 'myday' | 'habits' | 'notes' | 'bienetre' | 'bilan';

/** Accueil : carte « Mon jour », micro-rituels (respiration, affirmation) et raccourcis. */
export function HomeRituals({ entries, onGo, onOpenDay, onCreate }: {
  entries: Entry[]; onGo: (t: Target) => void; onOpenDay: (part: 'matin' | 'soir') => void; onCreate: (i: EntryInput) => Promise<void>;
}) {
  const today = isoOf(new Date());
  const day = entries.find((e) => e.kind === DAILY_KIND && e.entry_date === today);
  const evening = new Date().getHours() >= 18;
  const morningDone = Boolean(day?.data.intention || day?.data.mood);
  const eveningDone = Boolean(day?.data.win || day?.data.tomorrow);
  const habits = entries.filter((e) => e.kind === HABIT_KIND);
  const habitsDone = habits.filter((e) => habitDone(e)[today]).length;
  const part = evening && morningDone ? 'soir' : 'matin';

  return <>
    <section className="reset-card">
      <span className="reset-icon"><Sparkles size={22} /></span>
      <h2 className="serif">{part === 'soir' ? 'Mon débriefing du soir' : 'Mon Daily Reset'}</h2>
      <p>{part === 'soir' ? (eveningDone ? 'Fait ce soir. Repose-toi bien.' : 'Ta victoire, ce que tu déposes, ton intention pour demain.')
        : morningDone ? 'Intention posée. Tu peux la relire à tout moment.' : '3 minutes pour t’aligner avec ta journée'}</p>
      <button className="button reset-btn" onClick={() => onOpenDay(part)}>{(part === 'soir' ? eveningDone : morningDone) ? 'Revoir' : 'Commencer'} →</button>
    </section>

    <p className="eyebrow-s">Micro-rituels</p>
    <div className="ritual-grid">
      <Breathing />
      <Affirmation day={today} onKeep={(text) => onCreate({ module: 'equilibre', kind: NOTE_KIND, title: 'Affirmation', entry_date: today,
        data: { noteId: crypto.randomUUID(), type: 'gratitude', heading: 'Affirmation', body: text, folder: 'bienetre', mood: '', updated: new Date().toISOString() } })} />
    </div>

    <div className="shortcut-grid">
      <button className="shortcut" onClick={() => onGo('habits')}><span><Heart size={20} /></span><strong>Habitudes</strong><small>{habits.length ? habitsDone + '/' + habits.length + ' aujourd’hui' : 'Suivi quotidien'}</small></button>
      <button className="shortcut" onClick={() => onGo('notes')}><span><BookHeart size={20} /></span><strong>Mon journal</strong><small>Notes et historique</small></button>
      <button className="shortcut" onClick={() => onGo('bienetre')}><span><Leaf size={20} /></span><strong>Bien-être</strong><small>Humeur, cycle, prière</small></button>
      <button className="shortcut" onClick={() => onGo('bilan')}><span><CalendarCheck size={20} /></span><strong>Bilan de la semaine</strong><small>Humeurs, habitudes, victoires</small></button>
    </div>
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

function Affirmation({ day, onKeep }: { day: string; onKeep: (text: string) => Promise<void> }) {
  const [shift, setShift] = useState(0);
  const [kept, setKept] = useState(false);
  const text = affirmationOf(day, shift);
  return <div className="ritual-mini">
    <span className="ritual-k">Affirmation</span>
    <p className="affirm">« {text} »</p>
    <div className="ritual-actions">
      <button className="link-btn" onClick={() => { setShift(shift + 1); setKept(false); }}>Une autre</button>
      <button className="button soft small" disabled={kept} onClick={() => void onKeep(text).then(() => setKept(true))}>{kept ? 'Gardée ✓' : 'La garder'}</button>
    </div>
  </div>;
}
