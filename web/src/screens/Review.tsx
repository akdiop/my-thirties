import { SpiritStats } from '../features/SpiritStats';
import { allGratitudes, GRAT_SETTINGS, topWords, weatherOf } from '../lib/gratitude';
import { realisedBetween } from '../lib/carnet';
import { Glyph, MoodIcon, type Tint } from '../ui/Glyph';
import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { Entry } from '../lib/cloud';
import { cloud } from '../lib/cloud';
import { isDoneOn } from '../lib/day';
import { amountOf, currencyOf, fmt } from '../lib/money';
import { addDays, DAILY_KIND, freqTarget, HABIT_KIND, habitDone, habitFreq, isoOf, MOODS, NOTE_KIND, weekStartOf } from '../lib/rituals';
import { getIntegrationPrefs } from '../lib/integrations';
import { Bar, Segmented } from '../ui/kit';
import { yearStats, yearWindow } from '../lib/yearStats';
import { fmtH, sleepHours } from './Sleep';

const LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const MOOD_COLOR: Record<string, string> = { 'Épuisée': '#BEBAB1', 'Fatiguée': '#D6D1C5', Neutre: '#E3E1DC', Bien: '#C8D3C2', Rayonnante: '#98AB8F',
  Stressée: '#BEBAB1', Sereine: '#C8D3C2', Joyeuse: '#98AB8F' };
const short = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

/** Humeur d'un jour : celle de « Mon jour », sinon celle notée dans Bien-être. */
export function moodOn(entries: Entry[], day: string) {
  const d = entries.find((e) => e.kind === DAILY_KIND && e.entry_date === day);
  if (typeof d?.data.mood === 'string' && d.data.mood) return d.data.mood;
  const m = entries.find((e) => e.kind === 'mood' && e.entry_date === day);
  return typeof m?.data.mood === 'string' ? m.data.mood : '';
}

/** Bilan : la semaine résumée automatiquement (humeurs, habitudes, victoires, gratitudes, tâches, dépenses) et le calendrier d'humeur. */
export function Review({ entries, birthDate = '' }: { entries: Entry[]; birthDate?: string }) {
  const [tab, setTab] = useState<'semaine' | 'humeurs' | 'annee'>('semaine');
  return <div className="screen review">
    <header className="tab-head"><h1>Mon bilan</h1><p>{tab === 'annee' ? 'Ma trentaine en chiffres' : 'Ta semaine, en un coup d’œil'}</p></header>
    <Segmented label="Bilan" value={tab} onChange={setTab} options={[{ value: 'semaine', label: 'Semaine' }, { value: 'humeurs', label: 'Humeurs' }, { value: 'annee', label: 'Mon année' }]} />
    {tab === 'semaine' ? <Week entries={entries} /> : tab === 'humeurs' ? <MoodCalendar entries={entries} /> : <YearInNumbers entries={entries} birthDate={birthDate} />}
  </div>;
}

/** Ma trentaine en chiffres : l'année écoulée depuis mon anniversaire, à garder ou à partager. */
function YearInNumbers({ entries, birthDate }: { entries: Entry[]; birthDate: string }) {
  const w = yearWindow(birthDate, new Date());
  const s = yearStats(entries, w.from, w.to, sleepHours);
  const n = (v: number) => v.toLocaleString('fr-FR');
  const pl = (v: number, one: string, many: string) => (v > 1 ? many : one);
  const tiles = [
    s.nights && { k: pl(s.nights, 'nuit suivie', 'nuits suivies'), v: n(s.nights), sub: s.avgSleep ? 'en moyenne ' + fmtH(s.avgSleep) : '' },
    s.habits && { k: pl(s.habits, 'habitude cochée', 'habitudes cochées'), v: n(s.habits) },
    s.prayers && { k: pl(s.prayers, 'prière notée', 'prières notées'), v: n(s.prayers) },
    s.fasts && { k: pl(s.fasts, 'jour de jeûne', 'jours de jeûne'), v: n(s.fasts) },
    s.books && { k: pl(s.books, 'livre lu', 'livres lus'), v: n(s.books) },
    s.trips && { k: pl(s.trips, 'voyage', 'voyages'), v: n(s.trips) },
    s.sessions && { k: pl(s.sessions, 'séance de sport', 'séances de sport'), v: n(s.sessions) },
    s.challengeDays && { k: pl(s.challengeDays, 'jour de défi réussi', 'jours de défi réussis'), v: n(s.challengeDays) },
    s.notes && { k: pl(s.notes, 'page de journal', 'pages de journal'), v: n(s.notes) },
    s.water && { k: pl(s.water, 'verre d’eau', 'verres d’eau'), v: n(s.water) },
    s.steps && { k: 'pas', v: n(s.steps) },
    s.wishes && { k: pl(s.wishes, 'souhait réalisé', 'souhaits réalisés'), v: n(s.wishes) },
  ].filter(Boolean) as { k: string; v: string; sub?: string }[];
  const share = async () => {
    const txt = 'Ma trentaine en chiffres · ' + w.label.toLowerCase() + '\n' + tiles.map((t) => '• ' + t.v + ' ' + t.k).join('\n');
    try { if (navigator.share) await navigator.share({ title: 'Ma trentaine en chiffres', text: txt }); else await navigator.clipboard.writeText(txt); } catch { /* partage annulé */ }
  };
  return <section className="year-numbers">
    <p className="eyebrow-s">{w.label} · depuis le {new Date(w.from + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
    {tiles.length ? <div className="year-grid">{tiles.map((t) => <div key={t.k} className="year-tile"><strong>{t.v}</strong><span>{t.k}</span>{t.sub && <small>{t.sub}</small>}</div>)}</div>
      : <p className="muted">Tes chiffres apparaîtront ici au fil des jours : nuits, habitudes, prières, lectures, voyages…</p>}
    {!birthDate && <p className="muted small">Ajoute ta date de naissance dans ton profil pour compter d’un anniversaire à l’autre.</p>}
    {tiles.length > 0 && <button className="button soft" onClick={() => void share()}>Partager mes chiffres</button>}
  </section>;
}

function Week({ entries }: { entries: Entry[] }) {
  const today = isoOf(new Date());
  const [start, setStart] = useState(weekStartOf(today));
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const inWeek = (d?: string | null) => Boolean(d && d >= days[0]! && d <= days[6]!);
  const s = useMemo(() => {
    const dailies = entries.filter((e) => e.kind === DAILY_KIND && inWeek(e.entry_date)).sort((a, b) => String(a.entry_date).localeCompare(String(b.entry_date)));
    const wins = [...dailies.flatMap((e) => typeof e.data.win === 'string' && e.data.win.trim() ? [{ day: String(e.entry_date), text: e.data.win.trim() }] : []),
      ...realisedBetween(entries, days[0]!, days[6]!).map((w) => ({ day: w.realisedOn, text: 'Souhait réalisé, alhamdulillah : ' + w.text }))].sort((a, b) => a.day.localeCompare(b.day));
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
    const nights = entries.filter((e) => e.kind === 'sommeil' && inWeek(e.entry_date)).map(sleepHours).filter((h) => h > 0);
    const sleepAvg = nights.length ? nights.reduce((a, b) => a + b, 0) / nights.length : 0;
    return { dailies, wins, grats, habits, tasks: tasks.length, doneTasks, spend, notes, moods: days.map((d) => moodOn(entries, d)), sleepAvg, nights: nights.length };
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
      <div className="mood-week">{days.map((d, i) => <div key={d}><span className="mood-pill" style={{ background: MOOD_COLOR[s.moods[i]!] ?? '#EFEDE9' }}><MoodIcon mood={s.moods[i]} size={18} /></span><small>{LETTERS[i]}</small></div>)}</div></section>
    <div className="stat-row">
      <div><strong>{s.dailies.length}/7</strong><small>jours notés</small></div>
      <div><strong>{s.doneTasks}/{s.tasks}</strong><small>tâches faites</small></div>
      <div><strong>{s.notes}</strong><small>notes écrites</small></div>
      {s.nights > 0 && <div><strong>{fmtH(s.sleepAvg)}</strong><small>de sommeil en moyenne</small></div>}
    </div>
    {s.habits.length > 0 && <section className="ritual-card"><p className="ritual-label">Mes habitudes</p>
      {s.habits.map(({ e, count, target }) => <div key={e.id} className="habit-stat"><span className="inline-glyph"><Glyph name={String(e.data.icon || 'sprout')} tint={(e.data.tint as Tint) || 'sauge'} size={16} /> {e.title}</span><small>{count}/{target}</small><Bar value={Math.min(1, count / target)} /></div>)}</section>}
    <SpiritStats entries={entries} days={7} end={days[6]! > today ? today : days[6]!} compact />
    <section className="ritual-card"><p className="ritual-label"><Glyph name="trophy" tint="or" /> Mes victoires</p>
      {s.wins.length ? <ul className="win-list">{s.wins.map((w, i) => <li key={w.day + i}><small>{short(w.day)}</small> {w.text}</li>)}</ul> : <p className="muted">Note ta victoire du jour dans le débriefing du soir.</p>}</section>
    {s.grats.length > 0 && <section className="ritual-card"><p className="ritual-label"><Glyph name="handHeart" tint="rose" /> {s.grats.length} gratitude(s)</p><p className="muted">{s.grats.slice(0, 8).join(' · ')}</p></section>}
    {s.spend.size > 0 && <section className="ritual-card"><p className="ritual-label"><Glyph name="coins" tint="caramel" /> Dépenses de la semaine</p>{[...s.spend].map(([c, n]) => <strong key={c}>{fmt(n, c)}</strong>)}</section>}
    <section className="ritual-card ai-card">
      <p className="ritual-label"><Sparkles size={16} /> Résumé de l’assistant</p>
      {ai ? <p className="ai-answer">{ai}</p> : <>
        <p className="muted">À ta demande uniquement : envoie ce bilan (humeurs, habitudes, victoires, gratitudes, tâches) à l’assistant IA pour un résumé bienveillant.{getIntegrationPrefs().assistant ? '' : ' Active d’abord l’assistant IA dans Paramètres › Intégrations.'}</p>
        <button className="button soft" disabled={aiBusy || !getIntegrationPrefs().assistant} onClick={() => void summarize()}>{aiBusy ? 'Résumé en cours…' : 'Résumer ma semaine'}</button>
        </>}
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
      {days.map((d, i) => <span key={d} className={'cal-day' + (d === isoOf(now) ? ' today' : '')} style={{ background: MOOD_COLOR[moods[i]!] ?? '#F4F2EF' }} title={moods[i] || ''}>
        <small>{i + 1}</small><MoodIcon mood={moods[i]} size={16} /></span>)}</div>
    <div className="cal-legend">{totals.map((t) => <span key={t.value}><i style={{ background: MOOD_COLOR[t.value] }} />{t.value} · {t.n}</span>)}</div>
    <MonthGratitude entries={entries} days={days} />
  </div>;
}

/** Sous le calendrier d'humeur : mes météos intérieures, les gestes, les mots de gratitude qui reviennent et une préférée. */
function MonthGratitude({ entries, days }: { entries: Entry[]; days: string[] }) {
  const weathers = days.map((d) => ({ d, ...weatherOf(entries, d) })).filter((w) => w.meteo || w.gestes.length);
  const all = allGratitudes(entries), inMonth = all.filter((g) => g.date >= days[0]! && g.date <= days.at(-1)!);
  const words = topWords(all, days[0]!, days.at(-1)!, 6);
  const favs = (entries.find((e) => e.kind === GRAT_SETTINGS)?.data.favs ?? []) as string[];
  const fav = inMonth.find((g) => favs.includes(g.text)) ?? all.find((g) => favs.includes(g.text));
  const gestes = new Map<string, number>(); for (const w of weathers) for (const g of w.gestes) gestes.set(g, (gestes.get(g) ?? 0) + 1);
  if (!weathers.length && !inMonth.length) return null;
  return <section className="ritual-card month-grat">
    {weathers.some((w) => w.meteo) && <><p className="ritual-label">Mes météos intérieures</p>
      <p className="muted">{weathers.filter((w) => w.meteo).map((w) => new Date(w.d + 'T12:00:00').getDate() + ' ' + w.meteo).join(' · ')}</p></>}
    {gestes.size > 0 && <p className="muted small">Petits gestes : {[...gestes.entries()].map(([g, n]) => g.toLowerCase() + ' ' + n + ' fois').join(', ')}</p>}
    {inMonth.length > 0 && <><p className="ritual-label">{inMonth.length} gratitude{inMonth.length > 1 ? 's' : ''} ce mois-ci</p>
      {words.length > 0 && <p className="muted">Ce qui revient : {words.map((w) => w.word).join(', ')}</p>}</>}
    {fav && <p className="grat-quote">« {fav.text} »</p>}
  </section>;
}

/** « Il y a un an… » : la journée et les notes à la même date l'an dernier. */
export function OneYearAgo({ entries, onOpenDay, onOpenNote }: { entries: Entry[]; onOpenDay: (d: string) => void; onOpenNote?: (e: Entry) => void }) {
  const t = new Date(); const d = isoOf(new Date(t.getFullYear() - 1, t.getMonth(), t.getDate()));
  const day = entries.find((e) => e.kind === DAILY_KIND && e.entry_date === d);
  const notes = entries.filter((e) => e.kind === NOTE_KIND && e.entry_date === d);
  const realised = realisedBetween(entries, d, d);
  if (!day && !notes.length && !realised.length) return null;
  return <section className="year-ago">
    <p className="ritual-label"><Glyph name="history" tint="lilas" /> Il y a un an, jour pour jour</p>
    {day && <button className="note-row" onClick={() => onOpenDay(d)}><span className="note-emoji">{day.data.mood ? <MoodIcon mood={day.data.mood} badge={36} /> : <Glyph name="calendar" tint="caramel" badge={36} />}</span>
      <span><strong>Mon jour</strong><small>{String(day.data.intention || day.data.win || '')}</small></span></button>}
    {realised.map((w) => <div key={w.entry.id} className="note-row"><span className="note-emoji"><Glyph name="trophy" tint="or" badge={36} /></span><span><strong>Souhait réalisé, alhamdulillah</strong><small>{w.text}</small></span></div>)}
    {notes.map((n) => <button key={n.id} className="note-row" onClick={() => onOpenNote?.(n)}><span className="note-emoji"><Glyph name="notebook" badge={36} /></span><span><strong>{n.title}</strong><small>{String(n.data.body ?? '').slice(0, 100)}</small></span></button>)}
  </section>;
}
