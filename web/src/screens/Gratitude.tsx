import { useEffect, useMemo, useState } from 'react';
import { Lightbulb, RefreshCw, Shuffle } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { AMORCES, allGratitudes, GESTES, GRAT_KIND, GRAT_SETTINGS, gratitudeStreak, programDay, PROGRAMME, questionsOf, type GratData, type Moment } from '../lib/gratitude';
import { bilanDay } from '../lib/day';
import { isoOf } from '../lib/rituals';
import { DaySwitch } from '../features/DaySwitch';
import { Segmented } from '../ui/kit';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
type Props = { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save };
type Tab = Moment | 'sept' | 'relire';
const frDay = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]!;

/** Ma gratitude : trois gratitudes guidées le matin et le soir, le parcours de 7 jours, et tout relire. */
export function Gratitude({ entries, onCreate, onUpdate }: Props) {
  const [day, setDay] = useState(bilanDay);
  const [tab, setTab] = useState<Tab>(() => (new Date().getHours() < 14 ? 'matin' : 'soir'));
  const settings = entries.find((e) => e.kind === GRAT_SETTINGS);
  const pDay = programDay(settings?.data.programStart, day);
  const entry = entries.find((e) => e.kind === GRAT_KIND && e.entry_date === day);
  const data = (entry?.data ?? {}) as GratData;
  const all = useMemo(() => allGratitudes(entries), [entries]);
  const save = (d: GratData) => entry ? onUpdate(entry, { ...entry.data, ...d })
    : onCreate({ module: 'equilibre', kind: GRAT_KIND, title: 'Gratitude · ' + day, entry_date: day, data: { date: day, ...d } });
  const startProgram = () => settings ? onUpdate(settings, { ...settings.data, programStart: isoOf(new Date()) })
    : onCreate({ module: 'equilibre', kind: GRAT_SETTINGS, title: 'Réglages gratitude', entry_date: null, data: { programStart: isoOf(new Date()) } });

  return <div className="screen gratitude">
    <header className="tab-head"><h1>Ma gratitude</h1><p>{gratitudeStreak(all, isoOf(new Date())) > 1 ? gratitudeStreak(all, isoOf(new Date())) + ' jours de suite · ' : ''}{all.length} gratitude{all.length > 1 ? 's' : ''} écrite{all.length > 1 ? 's' : ''}</p></header>
    <Segmented label="Gratitude" value={tab} onChange={setTab} options={[{ value: 'matin', label: 'Matin' }, { value: 'soir', label: 'Soir' }, { value: 'sept', label: '7 jours' }, { value: 'relire', label: 'Relire' }]} />
    {tab !== 'relire' && <DaySwitch day={day} onChange={setDay} />}
    {(tab === 'matin' || tab === 'soir') && <MomentPage key={tab + day} moment={tab} day={day} data={data} onSave={save} />}
    {tab === 'sept' && (pDay ? <ProgramPage key={day} n={pDay} data={data} onSave={save} />
      : <section className="soft-card form-stack"><p className="ritual-label">Mon journal de gratitude, 7 jours</p>
        <p>Une page par jour, trois choses précises et quelques minutes au calme. Tu peux écrire beaucoup, très peu, ou laisser une case vide.</p>
        <p className="muted small">Choisis un moment facile à retrouver, par exemple après le café ou avant de brancher ton téléphone. Cherche un détail de la journée plutôt qu’une grande idée.</p>
        <button className="button primary" onClick={() => void startProgram()}>Commencer aujourd’hui</button>
        <p className="fineprint">D’après « Mon journal de gratitude pour les 7 prochains jours », journaldegratitude.fr.</p></section>)}
    {tab === 'relire' && <Reread all={all} />}
  </div>;
}

/** Trois cases : réponses enregistrées quand je quitte la case. */
function Fields({ questions, values, onQuestion, onSave }: { questions: string[]; values: string[]; onQuestion?: (k: number, q: string) => void; onSave: (v: string[]) => void }) {
  const [v, setV] = useState(() => [0, 1, 2].map((k) => values[k] ?? ''));
  const [hint, setHint] = useState('');
  const commit = (next: string[]) => { if (next.join('\n') !== [0, 1, 2].map((k) => values[k] ?? '').join('\n')) onSave(next); };
  return <>
    {questions.map((q, k) => <label key={k} className="grat-field"><span className="grat-q">{k + 1}. {q}
      {onQuestion && <button type="button" className="icon-btn small" aria-label="Une autre question" onClick={() => onQuestion(k, pick(AMORCES.filter((a) => !questions.includes(a))))}><RefreshCw size={14} /></button>}</span>
      <textarea rows={2} value={v[k]} placeholder="Un détail suffit" onChange={(e) => setV(v.map((x, i) => (i === k ? e.target.value : x)))} onBlur={() => commit(v)} /></label>)}
    <button type="button" className="button ghost small" onClick={() => setHint(pick(AMORCES))}><Lightbulb size={15} /> Quand rien ne vient</button>
    {hint && <p className="grat-hint">{hint} <button type="button" className="icon-btn small" aria-label="Une autre idée" onClick={() => setHint(pick(AMORCES))}><Shuffle size={14} /></button></p>}
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

function MomentPage({ moment, day, data, onSave }: { moment: Moment; day: string; data: GratData; onSave: (d: GratData) => Promise<void> }) {
  const key = moment === 'matin' ? 'qMatin' : 'qSoir';
  const questions = data[key]?.length === 3 ? data[key]! : questionsOf(moment, day);
  const values = data[moment] ?? [];
  const [note, setNote] = useState(data.note ?? '');
  return <section className="stack-8">
    <p className="muted">{frDay(day)}</p>
    <div className="soft-card form-stack">
      <p className="ritual-label">{moment === 'matin' ? 'Ce matin, je suis reconnaissante pour…' : 'Ce soir, je garde…'}</p>
      <Fields questions={questions} values={values} onQuestion={(k, q) => void onSave({ [key]: questions.map((x, i) => (i === k ? q : x)) })} onSave={(v) => void onSave({ [moment]: v, [key]: questions })} />
    </div>
    {moment === 'soir' && <><Weather data={data} onSave={(d) => void onSave(d)} />
      <label className="soft-card">Une note libre<textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} onBlur={() => note !== (data.note ?? '') && void onSave({ note })} /></label></>}
    {values.some(Boolean) && <p className="grat-end">Alhamdulillah.</p>}
  </section>;
}

function ProgramPage({ n, data, onSave }: { n: number; data: GratData; onSave: (d: GratData) => Promise<void> }) {
  const j = PROGRAMME[n - 1]!;
  const [extra, setExtra] = useState(data.p7extra ?? '');
  return <section className="stack-8">
    <div className="soft-card form-stack">
      <p className="ritual-label">Jour {n} sur 7 · {j.theme}</p>
      <Fields questions={j.q} values={data.p7 ?? []} onSave={(v) => void onSave({ p7: v })} />
    </div>
    <Weather data={data} onSave={(d) => void onSave(d)} />
    <label className="soft-card">{j.extra} <small className="muted">({j.extraHint})</small>
      <textarea rows={2} value={extra} onChange={(e) => setExtra(e.target.value)} onBlur={() => extra !== (data.p7extra ?? '') && void onSave({ p7extra: extra })} /></label>
    <p className="grat-end">{j.mot}</p>
  </section>;
}

/** Relire : une gratitude au hasard, puis tout, jour par jour. */
function Reread({ all }: { all: ReturnType<typeof allGratitudes> }) {
  const [one, setOne] = useState<(typeof all)[number] | null>(null);
  const [limit, setLimit] = useState(30);
  useEffect(() => { if (all.length && !one) setOne(pick(all)); }, [all, one]);
  const byDay = useMemo(() => { const m = new Map<string, typeof all>(); for (const g of all) m.set(g.date, [...(m.get(g.date) ?? []), g]); return [...m.entries()]; }, [all]);
  if (!all.length) return <p className="muted">Tes gratitudes du matin, du soir, de Mon jour et de tes notes apparaîtront ici.</p>;
  return <section className="stack-8">
    {one && <div className="soft-card grat-memory"><p className="ritual-label">Une gratitude à relire</p><p className="grat-quote">{one.text}</p>
      <small className="muted">{frDay(one.date)} · {one.source}</small>
      <button className="button ghost small" onClick={() => setOne(pick(all))}><Shuffle size={15} /> Une autre</button></div>}
    {byDay.slice(0, limit).map(([d, list]) => <div key={d} className="soft-card"><p className="ritual-label">{frDay(d)}</p>
      {list.map((g, i) => <p key={i} className="fiche-pt">{g.text} <small className="muted">· {g.source}</small></p>)}</div>)}
    {byDay.length > limit && <button className="button secondary wide" onClick={() => setLimit(limit + 30)}>Voir plus</button>}
  </section>;
}
