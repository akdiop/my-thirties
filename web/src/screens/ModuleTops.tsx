import { QUESTS } from '../lib/boosterDays';
import { useState, type ReactNode } from 'react';
import { BookHeart, BookOpen, CalendarDays, Compass, CloudSun, HandCoins, Heart, Lightbulb, MapPin, Mountain, Star, Sun, Waves, Zap, Shield, Smile, Scale, Feather, Moon, Languages } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { bilanDay, str, todayIso } from '../lib/day';
import { DaySwitch, dayName } from '../features/DaySwitch';
import { amountOf, currencyOf, fmt } from '../lib/money';
import { currentPrayer, PRAYERS, prayerDay, togglePrayer } from '../lib/wellbeing';
import { usePrayerAutoLocation } from '../features/AutomaticPrayerTimes';
import { SpiritStats } from '../features/SpiritStats';
import { SpiritLessons } from '../features/SpiritLessons';
import { Ramadan } from '../features/Ramadan';
import { DhulHijja } from '../features/DhulHijja';
import { Wird } from '../features/Wird';
import { AfterPrayer } from '../features/AfterPrayer';
import { ArabicModule } from '../features/ArabicModule';
import { dhulHijjaStatus } from '../lib/dhulHijja';
import { ramadanStatus } from '../lib/ramadan';

const dhulSub = (day: string) => { const s = dhulHijjaStatus(day); return !s ? '10 jours, 10 occasions' : 'day' in s ? (s.day <= 10 ? 'jour ' + s.day + ' · ' : 'jours de Tashrîq · ') + 'actes, réflexion, citation' : 'dans ' + s.daysUntil + ' jours · 10 jours, 10 occasions'; };
const ramadanSub = (day: string) => { const r = ramadanStatus(day); return !r ? 'suhûr, iftar, jeûnes, Coran' : r.active ? 'jour ' + r.day + ' · suhûr, iftar, Coran' : 'dans ' + r.daysUntil + ' jours · suhûr, iftar, jeûnes, Coran'; };
import { HIJRI_MONTHS, hijriLabel, hijriOf, spiritualDay, upcomingKeyDates } from '../lib/hijri';
import { HeroPhoto } from '../features/HeroPhoto';
import { Check22, RowLink, Segmented, SectionTitle, type Tone } from '../ui/kit';

/* ---------- Ma cuisine ---------- */
export type CuisineTab = 'recettes' | 'semaine' | 'midis' | 'courses' | 'astuces';
export function CuisineTop({ tab, onTab, entries }: { tab: CuisineTab; onTab: (t: CuisineTab) => void; entries: Entry[] }) {
  const recipes = entries.filter((e) => e.kind === 'recipe');
  return <div className="module-top">
    <HeroPhoto slot="module-cuisine" tone="caramel" label="Cuisine">
      <div className="hero-title"><h2>Ma cuisine</h2><span>Recettes · Semaine · Midis & batch · Courses · Astuces</span></div>
    </HeroPhoto>
    <Segmented label="Cuisine" value={tab} onChange={onTab} options={[{ value: 'recettes', label: 'Recettes' }, { value: 'semaine', label: 'Semaine' }, { value: 'midis', label: 'Midis' }, { value: 'courses', label: 'Courses' }, { value: 'astuces', label: 'Astuces' }]} />
    {tab === 'recettes' && recipes.length > 0 && <>
      <SectionTitle>Mes recettes</SectionTitle>
      <div className="recipe-grid">{recipes.slice(0, 6).map((r, i) => <article key={r.id} className="recipe-card">
        <HeroPhoto slot={'recipe-' + r.id} tone={(['caramel', 'sauge', 'sable', 'chocolat'] as const)[i % 4]} label={r.title.split(' ')[0] ?? 'Recette'} compact />
        <div className="recipe-body"><strong>{r.title}</strong><small>{str(r, 'duration') ? str(r, 'duration') + ' min' : ''}{str(r, 'portions') ? ' · ' + str(r, 'portions') + ' portions' : ''}</small></div>
      </article>)}</div>
    </>}
  </div>;
}

/* ---------- Mes découvertes ---------- */
export function TravelTop({ tab, onTab, entries, onCreate, onAdd }: { tab: 'destinations' | 'voyage'; onTab: (t: 'destinations' | 'voyage') => void; entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onAdd: (kind: string) => void }) {
  const destinations = entries.filter((e) => e.kind === 'destination');
  const [pick, setPick] = useState<string | null>(null);
  const d = destinations.find((x) => x.id === pick) ?? destinations[0];
  const trips = entries.filter((e) => e.kind === 'trip');
  const [busy, setBusy] = useState(false);
  return <div className="module-top">
    <Segmented label="Découvertes" value={tab} onChange={onTab} options={[{ value: 'destinations', label: 'Destinations' }, { value: 'voyage', label: 'Prochain voyage' }]} />
    {tab === 'destinations' && (d ? <>
      <HeroPhoto slot={'destination-' + d.id} tone="sauge" label={d.title}>
        <div className="hero-title"><h2>{d.title}</h2><span>{[str(d, 'country'), str(d, 'notes').split('\n')[0]].filter(Boolean).join(' · ')}</span></div>
      </HeroPhoto>
      <div className="icon-row">
        {[{ i: HandCoins, t: 'Budget' }, { i: CloudSun, t: 'Climat' }, { i: Mountain, t: 'Activités' }, { i: Lightbulb, t: 'Conseils' }].map(({ i: I, t }) =>
          <div key={t} className="icon-cell"><span><I size={20} /></span><small>{t}</small></div>)}
      </div>
      <div className="info-grid">
        <div className="info"><span className="k">Meilleure période</span><span className="v">{str(d, 'season') || 'À vérifier'}</span><span className="s">Selon tes sources</span></div>
        <div className="info"><span className="k">Formalités d’entrée</span><span className="v">À vérifier</span><span className="s">Site officiel du pays</span></div>
      </div>
      <button className="big-btn" disabled={busy || trips.some((t) => t.title === d.title)} onClick={async () => {
        setBusy(true);
        try { await onCreate({ module: 'decouvertes', kind: 'trip', title: d.title, entry_date: null, data: { currency: 'XOF', itinerary: '', packing: '' } }); onTab('voyage'); }
        finally { setBusy(false); }
      }}>{trips.some((t) => t.title === d.title) ? 'Déjà dans mes voyages' : 'En faire mon prochain voyage'}</button>
      {destinations.length > 1 && <><SectionTitle>Autres inspirations</SectionTitle>
        <div className="insp-row">{destinations.filter((x) => x.id !== d.id).map((x, i) => <button key={x.id} className="insp-card" onClick={() => setPick(x.id)}>
          <HeroPhoto slot={'destination-' + x.id} tone={(['caramel', 'sable', 'sauge'] as const)[i % 3]} label={x.title} compact />
          <strong>{x.title}</strong><small>{str(x, 'country')}</small></button>)}</div></>}
    </> : <><HeroPhoto slot="module-decouvertes" tone="sauge" label="Voyages">
        <div className="hero-title"><h2>Mes découvertes</h2><span>Îles · Plages · Lagons</span></div>
      </HeroPhoto><div className="empty-soft"><MapPin size={28} /><p>Note une première destination de rêve.</p><button className="button ghost" onClick={() => onAdd('destination')}>Ajouter une destination</button></div></>)}
    {tab === 'voyage' && trips[0] && <HeroPhoto slot={'trip-' + trips[0].id} tone="caramel" label={trips[0].title}>
      <div className="hero-title"><h2>{trips[0].title}</h2><span>{trips[0].entry_date ? 'Départ le ' + new Date(trips[0].entry_date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : 'Dates à choisir'}{amountOf(trips[0]) ? ' · budget ' + fmt(amountOf(trips[0]), currencyOf(trips[0])) : ''}</span></div>
    </HeroPhoto>}
  </div>;
}

/* ---------- Mon équilibre ---------- */
const AXES: { t: string; s: string; icon: typeof Heart; tone: Tone }[] = [
  { t: 'Anxiété', s: 'Apaiser mes inquiétudes', icon: Heart, tone: 'sable' },
  { t: 'Nervosité', s: 'Retrouver mon calme', icon: Waves, tone: 'sauge' },
  { t: 'Impulsivité', s: 'Méthode STOP, différer la réaction', icon: Zap, tone: 'creme' },
  { t: 'Confiance en soi', s: 'Croire en mes capacités', icon: Star, tone: 'sable' },
  { t: 'Patience', s: 'Accueillir le temps qu’il faut', icon: Sun, tone: 'sauge' },
  { t: 'Gestion des conflits', s: 'Dire sans blesser', icon: Scale, tone: 'creme' },
  { t: 'Lâcher-prise', s: 'Distinguer ce qui dépend de moi', icon: Feather, tone: 'sable' },
  { t: 'Affirmation de soi', s: 'Oser exprimer mes besoins', icon: Shield, tone: 'sauge' },
];
export type EquilibreTab = 'axes' | 'quetes' | 'booster' | 'journal';
export function EquilibreTop({ tab, onTab, entries, onAxis, onQuest, booster }: { tab: EquilibreTab; onTab: (t: EquilibreTab) => void; entries: Entry[]; onAxis: (axis: string) => void; onQuest: (title: string) => void; booster: ReactNode }) {
  const active = entries.filter((e) => e.kind === 'booster');
  return <div className="module-top">
    <Segmented label="Équilibre" value={tab} onChange={onTab} options={[{ value: 'axes', label: 'Axes' }, { value: 'quetes', label: 'Quêtes' }, { value: 'booster', label: 'En cours' }, { value: 'journal', label: 'Journal' }]} />
    {tab === 'quetes' && <><SectionTitle>Quêtes de 4 semaines</SectionTitle>
      <p className="muted">Un thème par semaine, une pratique par jour, un bilan chaque dimanche.</p>
      <div className="stack-8">{QUESTS.map((q) => { const on = active.some((b) => str(b, 'axis') === q.title);
        return <article key={q.id} className="habit-lib"><div className="habit-body"><strong>{q.title.replace('Quête · ', '')}</strong><small>{q.why}</small><small className="muted">{q.weeks.map((w) => w.theme).join(' · ')}</small></div>
          <button className="button ghost small" onClick={() => on ? onTab('booster') : onQuest(q.title)}>{on ? 'Continuer' : 'Commencer'}</button></article>; })}</div></>}
    {tab === 'booster' && (active.length ? booster : <div className="empty-soft"><Smile size={28} /><p>Choisis un axe ou une quête pour lancer un programme.</p><button className="button ghost" onClick={() => onTab('axes')}>Voir les axes</button></div>)}
    {tab === 'axes' && <><SectionTitle>Mes axes</SectionTitle>
      <div className="rows">{AXES.map((a) => <RowLink key={a.t} icon={a.icon} tone={a.tone} title={a.t}
        sub={active.some((b) => str(b, 'axis') === a.t) ? a.s + ' · en cours' : a.s} onClick={() => onAxis(a.t)} />)}</div></>}
  </div>;
}

/* ---------- Ma spiritualité ---------- */
const hijri = (d = new Date()) => { try { return new Intl.DateTimeFormat('fr-FR-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(d); } catch { return ''; } };
const DHIKR = ['SubhanAllah', 'Alhamdulillah', 'Allahu akbar', 'Astaghfirullah', 'La ilaha illa Allah'];
export type SpiritTab = 'home' | 'dhikr' | 'hijri' | 'journal' | 'horaires' | 'invocations' | 'qibla' | 'regularite' | 'cours' | 'ramadan' | 'dhulhijja' | 'wird' | 'apres' | 'arabe';
/** Compteur de dhikr : on touche le cercle, objectif 33, enregistrement du total du jour. */
function DhikrCounter({ day, entries, onCreate }: { day: string; entries: Entry[]; onCreate: (i: EntryInput) => Promise<void> }) {
  const [count, setCount] = useState(0);
  const [phrase, setPhrase] = useState(DHIKR[0]!);
  const [saving, setSaving] = useState(false);
  const todayTotal = entries.filter((e) => e.kind === 'dhikr' && e.entry_date === day).reduce((n, e) => n + (Number(str(e, 'count')) || 0), 0);
  return <div className="dhikr">
    <div className="chip-row">{DHIKR.map((d) => <button key={d} className={'chip' + (d === phrase ? ' on' : '')} onClick={() => { setPhrase(d); setCount(0); }}>{d}</button>)}</div>
    <button className="dhikr-btn" onClick={() => setCount((c) => c + 1)} aria-label={'Compter ' + phrase}><strong>{count}</strong><small>{phrase}</small><span className="dhikr-ring" style={{ background: `conic-gradient(#5F7A59 ${Math.min(1, count / 33) * 360}deg, #DDE5D7 0)` }} /></button>
    <p className="muted center">{count >= 33 ? '33 atteints · continue librement' : `${33 - count} pour atteindre 33`}{todayTotal ? ` · ${todayTotal} enregistrés aujourd’hui` : ''}</p>
    <div className="two-btn"><button className="button ghost" onClick={() => setCount(0)}>Remettre à zéro</button>
      <button className="button primary" disabled={!count || saving} onClick={async () => { setSaving(true); try { await onCreate({ module: 'spiritualite', kind: 'dhikr', title: `${phrase} · ${count}`, entry_date: day, data: { date: day, phrase, count: String(count) } }); setCount(0); } finally { setSaving(false); } }}>Enregistrer</button></div>
  </div>;
}

/** Calendrier spirituel : les 14 prochains jours (jeûnes recommandés) et les prochaines dates marquantes. */
function SpiritCalendar() {
  const today = todayIso();
  const next = Array.from({ length: 14 }, (_, i) => { const d = new Date(today + 'T12:00:00'); d.setDate(d.getDate() + i); return d.toLocaleDateString('en-CA'); });
  const h = hijriOf(today);
  return <div className="stack-8">
    <div className="soft-card hijri-today"><small className="muted">Aujourd’hui</small><strong className="serif">{h ? hijriLabel(h) : hijri()}</strong>
      {h?.month === 9 && <span className="chip on">Ramadan</span>}</div>
    <div className="soft-card"><strong>Les 14 prochains jours</strong>
      {next.map((d) => { const s = spiritualDay(d); if (!s || (!s.fasts.length && !s.key)) return null;
        return <div className="cal-row" key={d}><span className="cal-date">{new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}<small>{s.hijri.day} {HIJRI_MONTHS[s.hijri.month - 1]}</small></span>
          <span className="cal-what">{s.key && <b>{s.key.name}</b>}{s.fasts.filter((f) => f !== s.key?.name).map((f) => <span key={f} className="fast-tag">{f}</span>)}</span></div>; })}
    </div>
    <div className="soft-card"><strong>Dates à venir</strong>
      {upcomingKeyDates(today, 8).map((k) => <div className="cal-row" key={k.iso + k.name}><span className="cal-date">{new Date(k.iso + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}<small>{k.hijri}</small></span>
        <span className="cal-what"><b>{k.name}</b>{k.note && <small className="muted">{k.note}</small>}</span></div>)}
      <p className="fineprint">Calendrier calculé : le début du mois peut changer d’un jour selon l’annonce de la lune au Sénégal.</p>
    </div>
  </div>;
}

export function SpiritTop({ tab, onTab, entries, onCreate, onUpdate, onRemove }: { tab: SpiritTab; onTab: (t: SpiritTab) => void; entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void>; onRemove: (e: Entry) => Promise<void> }) {
  usePrayerAutoLocation(entries, onCreate, onUpdate);
  const day = todayIso();
  const p = prayerDay(entries);
  const [checkDay, setCheckDay] = useState(bilanDay);
  const prayedOn = new Set(entries.filter((e) => e.kind === 'prayer' && e.entry_date === checkDay).map((e) => str(e, 'prayer')));
  const toggle = (name: string, on: boolean, forDay = checkDay) => togglePrayer(entries, name, on, onCreate, onRemove, forDay);
  const cur = p ? currentPrayer(p) : null;
  return <div className="module-top">
    {tab === 'home' && <>
      <div className="prayer-hero">
        <span className="eyebrow light">Prochaine prière</span>
        <strong className="serif">{p?.next ? `${p.next.name} · ${p.next.time}` : p ? 'Fajr · demain' : 'Horaires du jour'}</strong>
        <span>{p?.next ? `${p.inText}${p.city ? ' · ' + p.city : ''}` : p ? `vers ${p.times[0]?.time ?? ''} (horaire d’aujourd’hui)${p.city ? ' · ' + p.city : ''}` : 'Indique ta position une fois dans « Horaires des prières »'}</span>
        <small>{hijri()} · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</small>
        {cur && <button className="prayer-done-btn" onClick={() => void toggle(cur.name, true, day)}>J’ai prié {cur.name}</button>}
      </div>
      <DaySwitch day={checkDay} onChange={setCheckDay} />
      <div className="soft-card list-card"><div className="prayed-count">{prayedOn.size} / 5 {dayName(checkDay)}</div>{PRAYERS.map((name) => {
        const t = p?.times.find((x) => x.name === name)?.time ?? '—';
        const done = prayedOn.has(name);
        return <div className={'prio-row' + (p?.next?.name === name ? ' strong' : '')} key={name}><span>{name}</span><small className="num">{t}</small>
          <Check22 checked={done} label={name + ' accomplie'} onChange={(v) => void toggle(name, v)} /></div>;
      })}</div>
      <DhikrCounter day={day} entries={entries} onCreate={onCreate} />
      <div className="rows">
        <RowLink icon={CalendarDays} title="Horaires des prières" sub={p?.city ? p.city + " · position, méthode" : "ma position, méthode de calcul"} onClick={() => onTab('horaires')} />
        <RowLink icon={Star} title="Ma régularité" sub="prières, dhikr et Coran sur 30 jours" onClick={() => onTab('regularite')} />
        <RowLink icon={Compass} title="Direction de la Qibla" sub="boussole" onClick={() => onTab('qibla')} />
        <RowLink icon={Star} title="Mes objectifs de dhikr" sub="100 ou 1000 fois dans la journée, à ton rythme" onClick={() => onTab('wird')} />
        <RowLink icon={Sun} title="Après la prière" sub="istighfâr, tasbîh 33, Âyat al-Kursî, al-Mu‘awwidhât" onClick={() => onTab('apres')} />
        <RowLink icon={Heart} title="Mes invocations" sub="routine de dhikr, protection, pardon, réussite…" onClick={() => onTab('invocations')} />
        <RowLink icon={Languages} title="Mon arabe" sub="jeux, fiches avec phonétique, alphabet, livrets" onClick={() => onTab('arabe')} />
        <RowLink icon={BookOpen} title="Mes cours" sub="tafsir, Ayat al-Kursî, la prière, la roqya" onClick={() => onTab('cours')} />
        <RowLink icon={Moon} title="Ramadan" sub={ramadanSub(day)} onClick={() => onTab('ramadan')} />
        <RowLink icon={Mountain} title="Les 10 jours de Dhu al-Hijja" sub={dhulSub(day)} onClick={() => onTab('dhulhijja')} />
        <RowLink icon={Sun} title="Calendrier spirituel" sub="jeûnes recommandés, dates importantes" onClick={() => onTab('hijri')} />
        <RowLink icon={BookHeart} title="Mon journal spirituel" onClick={() => onTab('journal')} />
      </div>
    </>}
    {tab !== 'home' && tab !== 'cours' && <button className="link-btn back-link" onClick={() => onTab('home')}>‹ Ma spiritualité</button>}
    {tab === 'regularite' && <SpiritStats entries={entries} days={30} />}
    {tab === 'dhikr' && <DhikrCounter day={day} entries={entries} onCreate={onCreate} />}
    {tab === 'hijri' && <SpiritCalendar />}
    {tab === 'cours' && <SpiritLessons onBack={() => onTab('home')} />}
    {tab === 'ramadan' && <Ramadan entries={entries} onCreate={onCreate} onUpdate={onUpdate} />}
    {tab === 'wird' && <Wird entries={entries} onCreate={onCreate} onUpdate={onUpdate} onRemove={onRemove} />}
    {tab === 'apres' && <AfterPrayer entries={entries} onCreate={onCreate} onUpdate={onUpdate} />}
    {tab === 'arabe' && <ArabicModule entries={entries} onCreate={onCreate} onUpdate={onUpdate} />}
    {tab === 'dhulhijja' && <DhulHijja entries={entries} onCreate={onCreate} onUpdate={onUpdate} />}
  </div>;
}
