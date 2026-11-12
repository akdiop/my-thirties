import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb, RefreshCw, Send, Shuffle, Star } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { allGratitudes, GESTES, GRAT_KIND, GRAT_SETTINGS, gratitudeStreak, ideasFor, isNameDay, MERCI, nameIndexOf, programDay, PROGRAMME, questionsOf, topWords,
  type GratData, type Gratitude as Grat, type Moment } from '../lib/gratitude';
import { ALLAH_NAMES } from '../lib/asmaUlHusna';
import { bilanDay } from '../lib/day';
import type { Media } from '../lib/media';
import { isoOf } from '../lib/rituals';
import { DaySwitch } from '../features/DaySwitch';
import { NoteMedia } from '../features/NoteMedia';
import { RELATIVE_KIND } from './Relatives';
import { Segmented } from '../ui/kit';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
type Props = { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; onOpenProches?: () => void };
type Tab = Moment | 'sept' | 'relire';
const frDay = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]!;

/** Ma gratitude : trois gratitudes guidées le matin et le soir, le parcours de 7 jours, et tout relire. */
export function Gratitude({ entries, onCreate, onUpdate, onOpenProches }: Props) {
  const [day, setDay] = useState(bilanDay);
  const [tab, setTab] = useState<Tab>(() => (new Date().getHours() < 14 ? 'matin' : 'soir'));
  const settings = entries.find((e) => e.kind === GRAT_SETTINGS);
  const pDay = programDay(settings?.data.programStart, day);
  const entry = entries.find((e) => e.kind === GRAT_KIND && e.entry_date === day);
  const data = (entry?.data ?? {}) as GratData;
  const all = useMemo(() => allGratitudes(entries), [entries]);
  const today = isoOf(new Date()), streak = gratitudeStreak(all, today);
  const save = (d: GratData) => entry ? onUpdate(entry, { ...entry.data, ...d })
    : onCreate({ module: 'equilibre', kind: GRAT_KIND, title: 'Gratitude · ' + day, entry_date: day, data: { date: day, ...d } });
  const saveSettings = (d: Record<string, unknown>) => settings ? onUpdate(settings, { ...settings.data, ...d })
    : onCreate({ module: 'equilibre', kind: GRAT_SETTINGS, title: 'Réglages gratitude', entry_date: null, data: d });
  const favs = Array.isArray(settings?.data.favs) ? (settings!.data.favs as string[]) : [];
  const relatives = entries.filter((e) => e.kind === RELATIVE_KIND);

  return <div className="screen gratitude">
    <header className="tab-head"><h1>Ma gratitude</h1>
      <p>{streak > 1 ? streak + ' jours de suite' : all.length ? 'Une journée manquée n’efface rien.' : 'Trois choses précises, quelques minutes au calme.'}</p></header>
    <Segmented label="Gratitude" value={tab} onChange={setTab} options={[{ value: 'matin', label: 'Matin' }, { value: 'soir', label: 'Soir' }, { value: 'sept', label: '7 jours' }, { value: 'relire', label: 'Relire' }]} />
    {tab !== 'relire' && <DaySwitch day={day} onChange={setDay} />}
    {(tab === 'matin' || tab === 'soir') && <MomentPage key={tab + day} moment={tab} day={day} data={data} onSave={save} relatives={relatives} onOpenProches={onOpenProches} />}
    {tab === 'sept' && (pDay ? <ProgramPage key={day} n={pDay} data={data} onSave={save} />
      : <section className="soft-card form-stack"><p className="ritual-label">Mon journal de gratitude, 7 jours</p>
        <p>Une page par jour, trois choses précises et quelques minutes au calme. Tu peux écrire beaucoup, très peu, ou laisser une case vide.</p>
        <p className="muted small">Choisis un moment facile à retrouver, par exemple après le café ou avant de brancher ton téléphone. Cherche un détail de la journée plutôt qu’une grande idée. Les jours difficiles, une seule ligne suffit.</p>
        <button className="button primary" onClick={() => void saveSettings({ programStart: today })}>Commencer aujourd’hui</button>
        <p className="fineprint">D’après « Mon journal de gratitude pour les 7 prochains jours », journaldegratitude.fr.</p></section>)}
    {tab === 'relire' && <Reread all={all} favs={favs} onFav={(t) => void saveSettings({ favs: favs.includes(t) ? favs.filter((x) => x !== t) : [...favs, t] })} />}
  </div>;
}

/** Trois cases : réponses enregistrées quand je quitte la case. */
function Fields({ questions, values, ideas, onQuestion, onSave }: { questions: string[]; values: string[]; ideas: string[]; onQuestion?: (k: number, q: string) => void; onSave: (v: string[]) => void }) {
  const [v, setV] = useState(() => [0, 1, 2].map((k) => values[k] ?? ''));
  const [hint, setHint] = useState('');
  const commit = (next: string[]) => { if (next.join('\n') !== [0, 1, 2].map((k) => values[k] ?? '').join('\n')) onSave(next); };
  return <>
    {questions.map((q, k) => <label key={k} className="grat-field"><span className="grat-q">{k + 1}. {q}
      {onQuestion && <button type="button" className="icon-btn small" aria-label="Une autre question" onClick={() => onQuestion(k, pick(ideas.filter((a) => !questions.includes(a))))}><RefreshCw size={14} /></button>}</span>
      <textarea rows={2} value={v[k]} placeholder="Un détail suffit" onChange={(e) => setV(v.map((x, i) => (i === k ? e.target.value : x)))} onBlur={() => commit(v)} /></label>)}
    <button type="button" className="button ghost small" onClick={() => setHint(pick(ideas))}><Lightbulb size={15} /> Quand rien ne vient</button>
    {hint && <p className="grat-hint">{hint} <button type="button" className="icon-btn small" aria-label="Une autre idée" onClick={() => setHint(pick(ideas))}><Shuffle size={14} /></button></p>}
  </>;
}

/** Météo intérieure en un mot et petit geste du jour. */
function Weather({ data, onSave }: { data: GratData; onSave: (d: GratData) => void }) {
  const [meteo, setMeteo] = useState(data.meteo ?? '');
  const gestes = data.gestes ?? [];
  return <div className="soft-card form-stack">
    <label>Ma météo intérieure<input value={meteo} maxLength={40} placeholder="Un mot suffit" onChange={(e) => setMeteo(e.target.value)} onBlur={() => meteo !== (data.meteo ?? '') && onSave({ meteo: meteo.trim() })} /></label>
    <div><p className="ritual-label">Mon petit geste du jour</p><div className="chip-row">{GESTES.map((g) => <button key={g} className={'chip' + (gestes.includes(g) ? ' on' : '')} aria-pressed={gestes.includes(g)}
      onClick={() => onSave({ gestes: gestes.includes(g) ? gestes.filter((x) => x !== g) : [...gestes, g] })}>{g}</button>)}</div></div>
  </div>;
}

/** Une photo mentale : la scène que j'aimerais revoir, avec une vraie photo si je veux. */
function MentalPhoto({ data, onSave }: { data: GratData; onSave: (d: GratData) => void }) {
  const [text, setText] = useState(data.photo ?? '');
  return <div className="soft-card form-stack">
    <label>Une photo mentale <small className="muted">la scène que j’aimerais revoir</small>
      <textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} onBlur={() => text !== (data.photo ?? '') && onSave({ photo: text })} /></label>
    <NoteMedia folder="gratitude" media={(data.media ?? []) as Media[]} onChange={(m) => onSave({ media: m })} />
  </div>;
}

/** Un merci à envoyer : un message préparé pour une personne de Mes proches, à partager. */
function Thanks({ relatives, onOpenProches }: { relatives: Entry[]; onOpenProches?: () => void }) {
  const [who, setWho] = useState(''), [why, setWhy] = useState(''), [done, setDone] = useState('');
  const person = relatives.find((r) => r.id === who);
  const text = MERCI(person?.title ?? '', why.trim());
  const share = async () => {
    try { if (navigator.share) await navigator.share({ text }); else { await navigator.clipboard.writeText(text); setDone('Message copié.'); } }
    catch { /* partage annulé */ }
  };
  return <details className="soft-card"><summary className="ritual-label">Un merci à envoyer</summary>
    <div className="form-stack">
      {relatives.length ? <label>À qui ?<select value={who} onChange={(e) => setWho(e.target.value)}><option value="">Choisir dans Mes proches</option>
        {relatives.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}</select></label>
        : onOpenProches && <button className="button ghost small" onClick={onOpenProches}>Ajouter mes proches</button>}
      <label>Merci pour…<input value={why} maxLength={140} placeholder="ton appel de ce matin" onChange={(e) => setWhy(e.target.value)} /></label>
      <p className="grat-hint">{text}</p>
      <div className="button-group"><button className="button primary" onClick={() => void share()}><Send size={15} /> Envoyer</button>
        {person && onOpenProches && <button className="button ghost" onClick={onOpenProches}>Voir sa fiche</button>}</div>
      {done && <p className="muted small">{done}</p>}
    </div></details>;
}

/** Le vendredi : relier un bienfait de la semaine à un Nom d'Allah. */
function NameLink({ day, data, onSave }: { day: string; data: GratData; onSave: (d: GratData) => void }) {
  const name = ALLAH_NAMES[nameIndexOf(day) % ALLAH_NAMES.length]!;
  const [text, setText] = useState(data.nom?.text ?? '');
  return <div className="soft-card form-stack grat-name">
    <p className="ritual-label">Le bienfait et le Nom de la semaine</p>
    <p className="dl-word"><span lang="ar">{name.ar}</span> <em>{name.tr}</em></p><p className="muted small">{name.fr}</p>
    <label>Un bienfait de ma semaine qui me fait penser à ce Nom<textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} onBlur={() => text !== (data.nom?.text ?? '') && onSave({ nom: { n: name.n, text } })} /></label>
  </div>;
}

function MomentPage({ moment, day, data, onSave, relatives, onOpenProches }: { moment: Moment; day: string; data: GratData; onSave: (d: GratData) => Promise<void>; relatives: Entry[]; onOpenProches?: () => void }) {
  const key = moment === 'matin' ? 'qMatin' : 'qSoir';
  const questions = data[key]?.length === 3 ? data[key]! : questionsOf(moment, day);
  const values = data[moment] ?? [];
  const [note, setNote] = useState(data.note ?? '');
  const save = (d: GratData) => void onSave(d);
  return <section className="stack-8">
    <p className="muted">{frDay(day)}</p>
    <div className="soft-card form-stack">
      <p className="ritual-label">{moment === 'matin' ? 'Ce matin, je suis reconnaissante pour…' : 'Ce soir, je garde…'}</p>
      <Fields questions={questions} values={values} ideas={ideasFor(moment)} onQuestion={(k, q) => save({ [key]: questions.map((x, i) => (i === k ? q : x)) })} onSave={(v) => save({ [moment]: v, [key]: questions })} />
    </div>
    {moment === 'soir' && <><Weather data={data} onSave={save} /><MentalPhoto data={data} onSave={save} />
      {isNameDay(day) && <NameLink day={day} data={data} onSave={save} />}
      <Thanks relatives={relatives} onOpenProches={onOpenProches} />
      <label className="soft-card">Une note libre<textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} onBlur={() => note !== (data.note ?? '') && save({ note })} /></label></>}
    {values.some(Boolean) && <p className="grat-end">Alhamdulillah.</p>}
  </section>;
}

function ProgramPage({ n, data, onSave }: { n: number; data: GratData; onSave: (d: GratData) => Promise<void> }) {
  const j = PROGRAMME[n - 1]!;
  const [extra, setExtra] = useState(data.p7extra ?? '');
  return <section className="stack-8">
    <div className="soft-card form-stack">
      <p className="ritual-label">Jour {n} sur 7 · {j.theme}</p>
      <Fields questions={j.q} values={data.p7 ?? []} ideas={ideasFor('sept')} onSave={(v) => void onSave({ p7: v })} />
    </div>
    <Weather data={data} onSave={(d) => void onSave(d)} />
    <label className="soft-card">{j.extra} <small className="muted">({j.extraHint})</small>
      <textarea rows={2} value={extra} onChange={(e) => setExtra(e.target.value)} onBlur={() => extra !== (data.p7extra ?? '') && void onSave({ p7extra: extra })} /></label>
    <p className="grat-end">{j.mot}</p>
  </section>;
}

/** Relire : une gratitude au hasard, le calendrier du mois, les mots qui reviennent, mes préférées, puis tout. */
function Reread({ all, favs, onFav }: { all: Grat[]; favs: string[]; onFav: (text: string) => void }) {
  const [one, setOne] = useState<Grat | null>(null);
  const [limit, setLimit] = useState(30);
  const now = new Date();
  const [month, setMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  useEffect(() => { if (all.length && !one) setOne(pick(all)); }, [all, one]);
  const byDay = useMemo(() => { const m = new Map<string, Grat[]>(); for (const g of all) m.set(g.date, [...(m.get(g.date) ?? []), g]); return [...m.entries()]; }, [all]);
  if (!all.length) return <p className="muted">Tes gratitudes du matin, du soir, de Mon jour et de tes notes apparaîtront ici.</p>;
  const first = isoOf(month), count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate(), lead = (month.getDay() + 6) % 7;
  const days = Array.from({ length: count }, (_, i) => isoOf(new Date(month.getFullYear(), month.getMonth(), i + 1)));
  const perDay = new Map(byDay.map(([d, l]) => [d, l.length]));
  const words = topWords(all, first, days.at(-1)!);
  const favList = all.filter((g, i, a) => favs.includes(g.text) && a.findIndex((x) => x.text === g.text) === i);
  const Fav = ({ g }: { g: Grat }) => <button className={'icon-btn small grat-star' + (favs.includes(g.text) ? ' on' : '')} aria-label={favs.includes(g.text) ? 'Retirer de mes préférées' : 'Ajouter à mes préférées'} aria-pressed={favs.includes(g.text)} onClick={() => onFav(g.text)}><Star size={15} /></button>;
  return <section className="stack-8">
    {one && <div className="soft-card grat-memory"><p className="ritual-label">Une gratitude à relire</p><p className="grat-quote">{one.text}</p>
      <small className="muted">{frDay(one.date)} · {one.source}</small>
      <div className="button-group"><button className="button ghost small" onClick={() => setOne(pick(all))}><Shuffle size={15} /> Une autre</button><Fav g={one} /></div></div>}
    <div className="soft-card">
      <div className="week-nav"><button className="icon-btn" aria-label="Mois précédent" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={20} /></button>
        <strong className="cap">{month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</strong>
        <button className="icon-btn" aria-label="Mois suivant" disabled={month.getFullYear() === now.getFullYear() && month.getMonth() === now.getMonth()} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={20} /></button></div>
      <div className="cal-grid">{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((l, i) => <span key={'h' + i} className="cal-h">{l}</span>)}
        {Array.from({ length: lead }, (_, i) => <span key={'b' + i} />)}
        {days.map((d, i) => <span key={d} className={'cal-day grat-day' + (perDay.get(d) ? ' on' : '')} title={(perDay.get(d) ?? 0) + ' gratitude(s)'}><small>{i + 1}</small></span>)}</div>
      {words.length > 0 && <><p className="ritual-label">Ce qui revient ce mois-ci</p><div className="chip-row">{words.map((w) => <span key={w.word} className="chip">{w.word} · {w.c}</span>)}</div></>}
    </div>
    {favList.length > 0 && <div className="soft-card"><p className="ritual-label">Mes préférées</p>{favList.map((g) => <p key={g.text} className="fiche-pt">{g.text} <Fav g={g} /></p>)}</div>}
    {byDay.slice(0, limit).map(([d, list]) => <div key={d} className="soft-card"><p className="ritual-label">{frDay(d)}</p>
      {list.map((g, i) => <p key={i} className="fiche-pt">{g.text} <small className="muted">· {g.source}</small> <Fav g={g} /></p>)}</div>)}
    {byDay.length > limit && <button className="button secondary wide" onClick={() => setLimit(limit + 30)}>Voir plus</button>}
  </section>;
}
