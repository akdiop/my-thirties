import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { Entry } from '../lib/cloud';
import { cloud } from '../lib/cloud';
import { isDoneOn } from '../lib/day';
import { amountOf, currencyOf, fmt } from '../lib/money';
import { addDays, DAILY_KIND, freqTarget, HABIT_KIND, habitDone, habitFreq, isoOf, moodEmoji, MOODS, NOTE_KIND, weekStartOf } from '../lib/rituals';
import { getIntegrationPrefs } from '../lib/integrations';
import { Bar, Segmented } from '../ui/kit';

const LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const MOOD_COLOR: Record<string, string> = { 'Épuisée': '#C9A9A6', 'Fatiguée': '#E3CBB8', Neutre: '#E9E2D6', Bien: '#C6D6BF', Rayonnante: '#8FB08A',
  Stressée: '#C9A9A6', Sereine: '#C6D6BF', Joyeuse: '#8FB08A' };
const short = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

/** Humeur d'un jour : celle de « Mon jour », sinon celle notée dans Bien-être. */
export function moodOn(entries: Entry[], day: string) {
  const d = entries.find((e) => e.kind === DAILY_KIND && e.entry_date === day);
  if (typeof d?.data.mood === 'string' && d.data.mood) return d.data.mood;
  const m = entries.find((e) => e.kind === 'mood' && e.entry_date === day);
  return typeof m?.data.mood === 'string' ? m.data.mood : '';
}

/** Bilan : la semaine résumée automatiquement (humeurs, habitudes, victoires, gratitudes, tâches, dépenses) et le calendrier d'humeur. */
export function Review({ entries }: { entries: Entry[] }) {
  const [tab, setTab] = useState<'semaine' | 'humeurs'>('semaine');
  return <div className="screen review">
    <header className="tab-head"><h1>Mon bilan</h1><p>Ta semaine, en un coup d’œil</p></header>
    <Segmented label="Bilan" value={tab} onChange={setTab} options={[{ value: 'semaine', label: 'Semaine' }, { value: 'humeurs', label: 'Calendrier d’humeur' }]} />
    {tab === 'semaine' ? <Week entries={entries} /> : <MoodCalendar entries={entries} />}
  </div>;
}

function Week({ entries }: { entries: Entry[] }) {
  const today = isoOf(new Date());
  const [start, setStart] = useState(weekStartOf(today));
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const inWeek = (d?: string | null) => Boolean(d && d >= days[0]! && d <= days[6]!);
  const s = useMemo(() => {
    const dailies = entries.filter((e) => e.kind === DAILY_KIND && inWeek(e.entry_date)).sort((a, b) => String(a.entry_date).localeCompare(String(b.entry_date)));
    const wins = dailies.flatMap((e) => typeof e.data.win === 'string' && e.data.win.trim() ? [{ day: String(e.entry_date), text: e.data.win.trim() }] : []);
    const grats = dailies.flatMap((e) => Array.isArray(e.data.gratitudes) ? e.data.gratitudes.map(String).filter((g) => g.trim()) : []);
    const habits = entries.filter((e) => e.kind === HABIT_KIND).map((e) => {
      const f = habitFreq(e), done = habitDone(e);
      return { e, count: days.filter((d) => done[d]).length, target: freqTarget(f) };
    });
    const tasks = entries.filter((e) => e.kind === 'task' && inWeek(e.entry_date));
    const doneTasks = tasks.filter((e) => isDoneOn(e, String(e.entry_date))).length;
    const spend = new Map<string, number>();
    for (const e of entries) if (e.module === 'finances' && e.kind === 'expense' && inWeek(e.entry_date)) spend.set(currencyOf(e), (spend.get(currencyOf(e)) ?? 0) + amountOf(e));
    const notes = entries.filter((e) => e.kind === NOTE_KIND && inWeek(e.entry_date)).length;
    return { dailies, wins, grats, habits, tasks: tasks.length, doneTasks, spend, notes, moods: days.map((d) => moodOn(entries, d)) };
  }, [entries, start]);

  const [ai, setAi] = useState(''), [aiBusy, setAiBusy] = useState(false), [aiError, setAiError] = useState('');
  const summarize = async () => {
    if (!cloud) return;
    setAiBusy(true); setAiError('');
    // Uniquement des éléments du bilan, raccourcis : la question reste sous 1 200 caractères.
    const facts = [
      'Humeurs : ' + s.moods.map((m, i) => LETTERS[i] + '=' + (m || '?')).join(', '),
      'Habitudes : ' + s.habits.map((h) => h.e.title + ' ' + h.count + '/' + h.target).join(' ; '),
      'Victoires : ' + s.wins.map((w) => w.text.slice(0, 80)).join(' ; '),
      'Gratitudes : ' + s.grats.slice(0, 6).map((g) => g.slice(0, 50)).join(' ; '),
      'Tâches : ' + s.doneTasks + '/' + s.tasks + ' faites',
    ].join('\n');
    const message = ('Voici ma semaine. Fais-moi un bilan bienveillant en 4 points courts (ce qui a bien marché, ce qui a pesé, une tendance, une idée simple pour la semaine prochaine), sans diagnostic.\n' + facts).slice(0, 1190);
    try {
      const { data, error } = await cloud.functions.invoke('personal-assistant', { body: { message } });
      if (error || typeof data?.answer !== 'string') throw new Error();
      setAi(data.answer);
    } catch { setAiError('Le résumé n’a pas pu être généré.'); }
    finally { setAiBusy(false); }
  };

  return <div className="review-week">
    <div className="week-nav">
      <button className="icon-btn" aria-label="Semaine précédente" onClick={() => { setStart(addDays(start, -7)); setAi(''); }}><ChevronLeft size={20} /></button>
      <strong>Semaine du {short(days[0]!)} au {short(days[6]!)}</strong>
      <button className="icon-btn" aria-label="Semaine suivante" disabled={days[6]! >= today} onClick={() => { setStart(addDays(start, 7)); setAi(''); }}><ChevronRight size={20} /></button>
    </div>
    <section className="ritual-card"><p className="ritual-label">Mes humeurs</p>
      <div className="mood-week">{days.map((d, i) => <div key={d}><span className="mood-pill" style={{ background: MOOD_COLOR[s.moods[i]!] ?? '#F3ECE5' }}>{moodEmoji(s.moods[i]) || (s.moods[i] ? '•' : '')}</span><small>{LETTERS[i]}</small></div>)}</div></section>
    <div className="stat-row">
      <div><strong>{s.dailies.length}/7</strong><small>jours notés</small></div>
      <div><strong>{s.doneTasks}/{s.tasks}</strong><small>tâches faites</small></div>
      <div><strong>{s.notes}</strong><small>notes écrites</small></div>
    </div>
    {s.habits.length > 0 && <section className="ritual-card"><p className="ritual-label">Mes habitudes</p>
      {s.habits.map(({ e, count, target }) => <div key={e.id} className="habit-stat"><span>{String(e.data.emoji ?? '•')} {e.title}</span><small>{count}/{target}</small><Bar value={Math.min(1, count / target)} /></div>)}</section>}
    <section className="ritual-card"><p className="ritual-label">🏆 Mes victoires</p>
      {s.wins.length ? <ul className="win-list">{s.wins.map((w) => <li key={w.day}><small>{short(w.day)}</small> {w.text}</li>)}</ul> : <p className="muted">Note ta victoire du jour dans le débriefing du soir.</p>}</section>
    {s.grats.length > 0 && <section className="ritual-card"><p className="ritual-label">🙏🏾 {s.grats.length} gratitude(s)</p><p className="muted">{s.grats.slice(0, 8).join(' · ')}</p></section>}
    {s.spend.size > 0 && <section className="ritual-card"><p className="ritual-label">💸 Dépenses de la semaine</p>{[...s.spend].map(([c, n]) => <strong key={c}>{fmt(n, c)}</strong>)}</section>}
    <section className="ritual-card ai-card">
      <p className="ritual-label"><Sparkles size={16} /> Résumé de l’assistant</p>
      {ai ? <p className="ai-answer">{ai}</p> : <>
        <p className="muted">À ta demande uniquement : envoie ce bilan (humeurs, habitudes, victoires, gratitudes, tâches) à l’assistant IA pour un résumé bienveillant.{getIntegrationPrefs().assistant ? '' : ' Active d’abord l’assistant IA dans Paramètres › Intégrations.'}</p>
        <button className="button soft" disabled={aiBusy || !getIntegrationPrefs().assistant} onClick={() => void summarize()}>{aiBusy ? 'Résumé en cours…' : 'Résumer ma semaine'}</button>
        <p className="fineprint">L’offre gratuite de Gemini peut utiliser les textes envoyés pour améliorer ses services.</p></>}
      {aiError && <p className="error" role="alert">{aiError}</p>}
    </section>
  </div>;
}

function MoodCalendar({ entries }: { entries: Entry[] }) {
  const now = new Date();
  const [month, setMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const first = isoOf(month), lead = (month.getDay() + 6) % 7;
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: count }, (_, i) => addDays(first, i));
  const moods = days.map((d) => moodOn(entries, d));
  const totals = MOODS.map((m) => ({ ...m, n: moods.filter((x) => x === m.value).length }));
  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
  return <div className="mood-cal">
    <div className="week-nav">
      <button className="icon-btn" aria-label="Mois précédent" onClick={() => shift(-1)}><ChevronLeft size={20} /></button>
      <strong className="cap">{month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</strong>
      <button className="icon-btn" aria-label="Mois suivant" disabled={month.getFullYear() === now.getFullYear() && month.getMonth() === now.getMonth()} onClick={() => shift(1)}><ChevronRight size={20} /></button>
    </div>
    <div className="cal-grid">{LETTERS.map((l, i) => <span key={'h' + i} className="cal-h">{l}</span>)}
      {Array.from({ length: lead }, (_, i) => <span key={'b' + i} />)}
      {days.map((d, i) => <span key={d} className={'cal-day' + (d === isoOf(now) ? ' today' : '')} style={{ background: MOOD_COLOR[moods[i]!] ?? '#F7F2EC' }} title={moods[i] || ''}>
        <small>{i + 1}</small>{moodEmoji(moods[i])}</span>)}</div>
    <div className="cal-legend">{totals.map((t) => <span key={t.value}><i style={{ background: MOOD_COLOR[t.value] }} />{t.emoji} {t.value} · {t.n}</span>)}</div>
  </div>;
}

/** « Il y a un an… » : la journée et les notes à la même date l'an dernier. */
export function OneYearAgo({ entries, onOpenDay, onOpenNote }: { entries: Entry[]; onOpenDay: (d: string) => void; onOpenNote?: (e: Entry) => void }) {
  const t = new Date(); const d = isoOf(new Date(t.getFullYear() - 1, t.getMonth(), t.getDate()));
  const day = entries.find((e) => e.kind === DAILY_KIND && e.entry_date === d);
  const notes = entries.filter((e) => e.kind === NOTE_KIND && e.entry_date === d);
  if (!day && !notes.length) return null;
  return <section className="year-ago">
    <p className="ritual-label">🕰️ Il y a un an, jour pour jour</p>
    {day && <button className="note-row" onClick={() => onOpenDay(d)}><span className="note-emoji">{moodEmoji(day.data.mood) || '📅'}</span>
      <span><strong>Mon jour</strong><small>{String(day.data.intention || day.data.win || '')}</small></span></button>}
    {notes.map((n) => <button key={n.id} className="note-row" onClick={() => onOpenNote?.(n)}><span className="note-emoji">📓</span><span><strong>{n.title}</strong><small>{String(n.data.body ?? '').slice(0, 100)}</small></span></button>)}
  </section>;
}
