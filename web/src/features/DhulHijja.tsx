import { useEffect, useState } from 'react';
import { BookOpen, Quote } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { actsDone, DH_ACTS, DH_DAYS, DH_EXTRAS, DH_KNOWLEDGE, DHUL_HIJJA_KIND, dhulHijjaStatus, type DhData } from '../lib/dhulHijja';
import { isoOf } from '../lib/rituals';
import { Bar, Check22 } from '../ui/kit';
import { AvecCoran } from '../ui/CoranLien';

const frDay = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

/** Les 10 jours de Dhu al-Hijja : un thème par jour, actes à cocher, question de réflexion et citation. */
export function DhulHijja({ entries, onCreate, onUpdate }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void> }) {
  const today = isoOf(new Date());
  const st = dhulHijjaStatus(today);
  const current = st && 'day' in st ? Math.min(10, st.day) : 1;
  const [day, setDay] = useState(current);
  const entry = st ? entries.find((e) => e.kind === DHUL_HIJJA_KIND && Number(e.data.year) === st.hijriYear) : undefined;
  const data = (entry?.data ?? {}) as DhData;
  const mine = data.days?.[day] ?? {};
  const [answer, setAnswer] = useState(mine.answer ?? '');
  useEffect(() => setAnswer(data.days?.[day]?.answer ?? ''), [day, entry?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!st) return <p className="muted">Le calendrier hégirien n’est pas disponible sur cet appareil.</p>;
  const write = (patch: { acts?: Record<string, boolean>; answer?: string }) => {
    const days = { ...(data.days ?? {}), [day]: { ...mine, ...patch } };
    return entry ? onUpdate(entry, { ...entry.data, days })
      : onCreate({ module: 'spiritualite', kind: DHUL_HIJJA_KIND, title: 'Dhu al-Hijja ' + st.hijriYear, entry_date: today, data: { year: st.hijriYear, days } });
  };
  const toggle = (act: string, v: boolean) => void write({ acts: { ...(mine.acts ?? {}), [act]: v } });
  const d = DH_DAYS[day - 1]!;

  return <section className="dhul stack-8">
    <div className="prayer-hero">
      <span className="eyebrow light">Dhu al-Hijja {st.hijriYear}</span>
      <strong className="serif">{'day' in st ? (st.day <= 10 ? 'Jour ' + st.day : 'Jours de Tashrîq') : 'Dans ' + st.daysUntil + ' jour' + (st.daysUntil > 1 ? 's' : '')}</strong>
      <span>{'day' in st ? frDay(today) : 'Début prévu le ' + frDay(st.startIso) + ', selon l’observation de la lune'}</span>
    </div>

    <div className="dhul-days" role="tablist" aria-label="Jour">{DH_DAYS.map((_, i) => <button key={i} role="tab" aria-selected={day === i + 1}
      className={'ramadan-day' + (day === i + 1 ? ' on' : actsDone(data, i + 1) === DH_ACTS.length ? ' off' : '')} onClick={() => setDay(i + 1)}>{i + 1}</button>)}</div>

    <section className="soft-card">
      <p className="eyebrow-s">Jour {day} · {d.theme}</p>
      <p className="dhul-intro">{d.intro}</p>
      <p className="ritual-label">Actes du jour · {actsDone(data, day)}/{DH_ACTS.length}</p>
      <Bar value={actsDone(data, day) / DH_ACTS.length} />
      <div className="dhul-acts">{DH_ACTS.map((a) => <label key={a} className="dhul-act"><Check22 checked={Boolean(mine.acts?.[a])} label={a} onChange={(v) => toggle(a, v)} />{a}</label>)}</div>
      <p className="ritual-label">Si possible</p>
      <div className="chip-row">{DH_EXTRAS.map((a) => <button key={a} className={'chip' + (mine.acts?.[a] ? ' on' : '')} aria-pressed={Boolean(mine.acts?.[a])} onClick={() => toggle(a, !mine.acts?.[a])}>{a}</button>)}</div>
    </section>

    <section className="soft-card">
      <p className="ritual-label">Réflexion</p>
      <label className="dhul-q" htmlFor="dhul-answer">{d.question}</label>
      <textarea id="dhul-answer" rows={4} value={answer} onChange={(e) => setAnswer(e.target.value)} onBlur={() => { if (answer !== (mine.answer ?? '')) void write({ answer }); }} placeholder="Écris ici, c’est enregistré quand tu quittes le champ." />
    </section>

    <section className="soft-card dhul-quote">
      <p className="ritual-label"><Quote size={16} /> Citation du jour</p>
      {d.quote.phonetic && <em>{d.quote.phonetic}</em>}
      <p>{d.quote.text}</p>
      <small><AvecCoran texte={d.quote.ref} /></small>
    </section>

    <details className="soft-card dhul-know">
      <summary><BookOpen size={16} /> Pourquoi ces dix jours comptent</summary>
      {DH_KNOWLEDGE.map((k) => <p key={k.text} className="fiche-pt"><AvecCoran texte={k.text} />{k.ref && <small> (<AvecCoran texte={k.ref} />)</small>}</p>)}
      <p className="fineprint">D’après le « Dhu al-Hijjah Planner » de Towards Faith, traduit et reformulé.</p>
    </details>
  </section>;
}
