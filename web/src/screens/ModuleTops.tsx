import { useState, type ReactNode } from 'react';
import { BookHeart, CalendarDays, Check, CloudSun, HandCoins, Heart, Lightbulb, MapPin, Mountain, Star, Sun, Waves, Zap, Shield, Smile, Scale, Feather } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { str, todayIso } from '../lib/day';
import { amountOf, currencyOf, fmt } from '../lib/money';
import { PRAYERS, prayerDay } from '../lib/wellbeing';
import { HeroPhoto } from '../features/HeroPhoto';
import { useDestinationPhotos, useVerifiedRecipePhotos } from '../features/EditorialPhoto';
import { Check22, RowLink, Segmented, SectionTitle, type Tone } from '../ui/kit';

/* ---------- Ma cuisine ---------- */
export type CuisineTab = 'recettes' | 'semaine' | 'courses';
export function CuisineTop({ tab, onTab, entries }: { tab: CuisineTab; onTab: (t: CuisineTab) => void; entries: Entry[] }) {
  const recipePhotos = useVerifiedRecipePhotos();
  const recipes = entries.filter((e) => e.kind === 'recipe');
  return <div className="module-top">
    <HeroPhoto slot="module-cuisine" tone="caramel" label="Cuisine">
      <div className="hero-title"><h2>Ma cuisine</h2><span>Recettes · Ma semaine · Courses</span></div>
    </HeroPhoto>
    <Segmented label="Cuisine" value={tab} onChange={onTab} options={[{ value: 'recettes', label: 'Recettes' }, { value: 'semaine', label: 'Ma semaine' }, { value: 'courses', label: 'Courses' }]} />
    {tab === 'recettes' && recipes.length > 0 && <>
      <SectionTitle>Mes recettes</SectionTitle>
      <div className="recipe-grid">{recipes.slice(0, 6).map((r, i) => <article key={r.id} className="recipe-card">
        <HeroPhoto slot={'recipe-' + r.id} tone={(['caramel', 'sauge', 'sable', 'chocolat'] as const)[i % 4]} label={r.title.split(' ')[0] ?? 'Recette'} curatedPhoto={recipePhotos[String(r.data.libraryId ?? '')]} compact />
        <div className="recipe-body"><strong>{r.title}</strong><small>{str(r, 'duration') ? str(r, 'duration') + ' min' : ''}{str(r, 'portions') ? ' · ' + str(r, 'portions') + ' portions' : ''}</small></div>
      </article>)}</div>
    </>}
  </div>;
}

/* ---------- Mes découvertes ---------- */
export function TravelTop({ tab, onTab, entries, onCreate, onAdd }: { tab: 'destinations' | 'voyage'; onTab: (t: 'destinations' | 'voyage') => void; entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onAdd: (kind: string) => void }) {
  const destinationPhotos = useDestinationPhotos();
  const destinations = entries.filter((e) => e.kind === 'destination');
  const [pick, setPick] = useState<string | null>(null);
  const d = destinations.find((x) => x.id === pick) ?? destinations[0];
  const trips = entries.filter((e) => e.kind === 'trip');
  const [busy, setBusy] = useState(false);
  return <div className="module-top">
    <Segmented label="Découvertes" value={tab} onChange={onTab} options={[{ value: 'destinations', label: 'Destinations' }, { value: 'voyage', label: 'Prochain voyage' }]} />
    {tab === 'destinations' && (d ? <>
      <HeroPhoto slot={'destination-' + d.id} tone="sauge" label={d.title} curatedPhoto={destinationPhotos[String(d.data.suggestionId ?? '')]}>
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
      <p className="note-box">Les prix et conditions d’entrée ne sont jamais inventés : vérifie-les sur les sites officiels et note la source.</p>
      <button className="big-btn" disabled={busy || trips.some((t) => t.title === d.title)} onClick={async () => {
        setBusy(true);
        try { await onCreate({ module: 'decouvertes', kind: 'trip', title: d.title, entry_date: null, data: { currency: 'XOF', itinerary: '', packing: '' } }); onTab('voyage'); }
        finally { setBusy(false); }
      }}>{trips.some((t) => t.title === d.title) ? 'Déjà dans mes voyages' : 'En faire mon prochain voyage'}</button>
      {destinations.length > 1 && <><SectionTitle>Autres inspirations</SectionTitle>
        <div className="insp-row">{destinations.filter((x) => x.id !== d.id).map((x, i) => <button key={x.id} className="insp-card" onClick={() => setPick(x.id)}>
          <HeroPhoto slot={'destination-' + x.id} tone={(['caramel', 'sable', 'sauge'] as const)[i % 3]} label={x.title} curatedPhoto={destinationPhotos[String(x.data.suggestionId ?? '')]} compact />
          <strong>{x.title}</strong><small>{str(x, 'country')}</small></button>)}</div></>}
    </> : <><HeroPhoto slot="module-decouvertes" tone="sauge" label="Voyages">
        <div className="hero-title"><h2>Mes découvertes</h2><span>Îles · Plages · Lagons</span></div>
      </HeroPhoto><div className="empty-soft"><MapPin size={28} /><p>Note une première destination de rêve.</p><button className="button ghost" onClick={() => onAdd('destination')}>Ajouter une destination</button></div></>)}
    {tab === 'voyage' && trips[0] && <HeroPhoto slot={'trip-' + trips[0].id} tone="caramel" label={trips[0].title} curatedPhoto={destinationPhotos[String(destinations.find((x) => x.title === trips[0].title)?.data.suggestionId ?? '')]}>
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
export type EquilibreTab = 'axes' | 'booster' | 'journal';
export function EquilibreTop({ tab, onTab, entries, onAxis, booster }: { tab: EquilibreTab; onTab: (t: EquilibreTab) => void; entries: Entry[]; onAxis: (axis: string) => void; booster: ReactNode }) {
  const active = entries.filter((e) => e.kind === 'booster');
  return <div className="module-top">
    <Segmented label="Équilibre" value={tab} onChange={onTab} options={[{ value: 'axes', label: 'Axes' }, { value: 'booster', label: 'Booster' }, { value: 'journal', label: 'Journal' }]} />
    {tab === 'booster' && (active.length ? booster : <div className="empty-soft"><Smile size={28} /><p>Choisis un axe pour lancer un programme Booster de 7, 14 ou 30 jours.</p><button className="button ghost" onClick={() => onTab('axes')}>Voir les axes</button></div>)}
    {tab === 'axes' && <><SectionTitle>Mes axes</SectionTitle>
      <div className="rows">{AXES.map((a) => <RowLink key={a.t} icon={a.icon} tone={a.tone} title={a.t}
        sub={active.some((b) => str(b, 'axis') === a.t) ? a.s + ' · en cours' : a.s} onClick={() => onAxis(a.t)} />)}</div></>}
  </div>;
}

/* ---------- Ma spiritualité ---------- */
const hijri = (d = new Date()) => { try { return new Intl.DateTimeFormat('fr-FR-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(d); } catch { return ''; } };
const DHIKR = ['SubhanAllah', 'Alhamdulillah', 'Allahu akbar', 'Astaghfirullah', 'La ilaha illa Allah'];
export type SpiritTab = 'home' | 'dhikr' | 'hijri' | 'journal' | 'horaires';
export function SpiritTop({ tab, onTab, entries, onCreate, onRemove }: { tab: SpiritTab; onTab: (t: SpiritTab) => void; entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onRemove: (e: Entry) => Promise<void> }) {
  const day = todayIso();
  const p = prayerDay(entries);
  const [count, setCount] = useState(0);
  const [phrase, setPhrase] = useState(DHIKR[0]!);
  const [saving, setSaving] = useState(false);
  const toggle = async (name: string, on: boolean) => {
    const existing = entries.find((e) => e.kind === 'prayer' && e.entry_date === day && str(e, 'prayer') === name);
    if (on && !existing) await onCreate({ module: 'spiritualite', kind: 'prayer', title: name, entry_date: day, data: { date: day, prayer: name } });
    if (!on && existing) await onRemove(existing);
  };
  return <div className="module-top">
    {tab === 'home' && <>
      <div className="prayer-hero">
        <span className="eyebrow light">Prochaine prière</span>
        <strong className="serif">{p?.next ? `${p.next.name} · ${p.next.time}` : p ? 'Fajr · demain' : 'Horaires du jour'}</strong>
        <span>{p?.next ? `${p.inText}${p.city ? ' · ' + p.city : ''}` : p ? `vers ${p.times[0]?.time ?? ''} (horaire d’aujourd’hui)${p.city ? ' · ' + p.city : ''}` : 'Récupère-les dans « Horaires des prières »'}</span>
        <small>{hijri()} · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</small>
      </div>
      <div className="soft-card list-card">{PRAYERS.map((name) => {
        const t = p?.times.find((x) => x.name === name)?.time ?? '—';
        const done = p?.prayed.has(name) ?? entries.some((e) => e.kind === 'prayer' && e.entry_date === day && str(e, 'prayer') === name);
        return <div className={'prio-row' + (p?.next?.name === name ? ' strong' : '')} key={name}><span>{name}</span><small className="num">{t}</small>
          <Check22 checked={done} label={name + ' accomplie'} onChange={(v) => void toggle(name, v)} /></div>;
      })}</div>
      <div className="rows">
        <RowLink icon={CalendarDays} title="Horaires des prières" sub="ville, méthode de calcul" onClick={() => onTab('horaires')} />
        <RowLink icon={Check} title="Dhikr et compteur" sub="libre ou routine" onClick={() => onTab('dhikr')} />
        <RowLink icon={Sun} title="Calendrier hégirien" onClick={() => onTab('hijri')} />
        <RowLink icon={BookHeart} title="Mon journal spirituel" onClick={() => onTab('journal')} />
      </div>
    </>}
    {tab !== 'home' && <button className="link-btn back-link" onClick={() => onTab('home')}>‹ Ma spiritualité</button>}
    {tab === 'dhikr' && <div className="dhikr">
      <div className="chip-row">{DHIKR.map((d) => <button key={d} className={'chip' + (d === phrase ? ' on' : '')} onClick={() => { setPhrase(d); setCount(0); }}>{d}</button>)}</div>
      <button className="dhikr-btn" onClick={() => setCount((c) => c + 1)} aria-label={'Compter ' + phrase}><strong>{count}</strong><small>{phrase}</small><span className="dhikr-ring" style={{ background: `conic-gradient(#5E7A5F ${Math.min(1, count / 33) * 360}deg, #E3E8DB 0)` }} /></button>
      <p className="muted center">{count >= 33 ? '33 atteints · continue librement' : `${33 - count} pour atteindre 33`}</p>
      <div className="two-btn"><button className="button ghost" onClick={() => setCount(0)}>Remettre à zéro</button>
        <button className="button primary" disabled={!count || saving} onClick={async () => { setSaving(true); try { await onCreate({ module: 'spiritualite', kind: 'dhikr', title: `${phrase} · ${count}`, entry_date: day, data: { date: day, phrase, count: String(count) } }); setCount(0); } finally { setSaving(false); } }}>Enregistrer</button></div>
    </div>}
    {tab === 'hijri' && <div className="soft-card hijri-card">{Array.from({ length: 7 }, (_, i) => { const d = new Date(Date.now() + i * 86_400_000); return <div className="prio-row" key={i}>
      <span>{d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })}</span><small>{hijri(d)}</small></div>; })}
      <p className="disclaimer">Calendrier Umm al-Qura calculé par le navigateur ; le début des mois peut différer d’un jour selon l’observation locale.</p></div>}
  </div>;
}
