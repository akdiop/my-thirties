import { useMemo, useState } from 'react';
import { AlarmClock, Check, Moon } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { addDays, isoOf } from '../lib/rituals';
import { BREATHS, GUIDED } from '../lib/meditation';
import { unlockSound } from '../lib/sound';
import { BreathPlayer, GuidedPlayer } from '../features/MeditationPlayers';
import { moodOn } from './Review';
import { pendingNight, SleepNight, SleepReport } from '../features/SleepNight';
import type { NightAnalysis } from '../lib/sleepAnalysis';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
export const SLEEP_KIND = 'sommeil';

const ROUTINE = ['Écrans rangés 30 min avant', 'Lumière douce', 'Chambre fraîche et aérée', 'Une tisane ou un verre d’eau', 'Ma routine soin du soir', 'Noter ce qui me trotte dans la tête', 'Une respiration lente au lit'];
const QUALITY = ['Très mauvaise', 'Mauvaise', 'Correcte', 'Bonne', 'Excellente'];

/** Durée de sommeil en heures, du coucher (veille) au réveil. */
export function sleepHours(e: Entry) {
  const bed = String(e.data.bed ?? ''), wake = String(e.data.wake ?? '');
  if (!/^\d{2}:\d{2}$/.test(bed) || !/^\d{2}:\d{2}$/.test(wake)) return 0;
  const m = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3));
  let d = m(wake) - m(bed); if (d <= 0) d += 1440;
  return d / 60;
}

/** Sommeil : la routine pour se préparer, une respiration du soir, et le suivi des nuits relié à l'humeur. */
export function Sleep({ entries, onCreate, onUpdate, onRemove }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save; onRemove?: (e: Entry) => Promise<boolean> }) {
  const today = isoOf(new Date());
  const nights = entries.filter((e) => e.kind === SLEEP_KIND && e.entry_date);
  const tonight = nights.find((e) => e.entry_date === today);
  const [play, setPlay] = useState<'478' | 'scan' | null>(null);
  const [bed, setBed] = useState(String(tonight?.data.bed ?? '23:00'));
  const [wake, setWake] = useState(String(tonight?.data.wake ?? '07:00'));
  const [quality, setQuality] = useState(Number(tonight?.data.quality) || 0);
  const [busy, setBusy] = useState(false);
  const [night, setNight] = useState(pendingNight);
  const [alarm, setAlarm] = useState(String(tonight?.data.wake ?? '07:00'));
  const [smart, setSmart] = useState(true);
  const routine = (tonight?.data.routine && typeof tonight.data.routine === 'object' ? tonight.data.routine : {}) as Record<string, boolean>;

  const upsert = async (patch: Record<string, unknown>) => {
    if (tonight) await onUpdate(tonight, { ...tonight.data, ...patch });
    else await onCreate({ module: 'sante', kind: SLEEP_KIND, title: 'Sommeil · ' + today, entry_date: today, data: { date: today, ...patch } });
  };
  const saveNight = async () => { setBusy(true); try { await upsert({ bed, wake, quality }); } finally { setBusy(false); } };

  const saveAnalysis = async (a: NightAnalysis) => {
    const end = new Date(a.end), date = isoOf(end), at = (d: Date) => d.toTimeString().slice(0, 5);
    const patch = { analysis: a, bed: at(new Date(a.start)), wake: at(end) };
    const e = nights.find((x) => x.entry_date === date);
    if (e) await onUpdate(e, { ...e.data, ...patch });
    else await onCreate({ module: 'sante', kind: SLEEP_KIND, title: 'Sommeil · ' + date, entry_date: date, data: { date, ...patch } });
    setBed(patch.bed); setWake(patch.wake);
  };
  const lastAnalysis = [...nights].sort((a, b) => String(b.entry_date).localeCompare(String(a.entry_date))).find((e) => e.data.analysis && typeof e.data.analysis === 'object');
  const last14 = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13));
  const byDay = new Map(nights.map((e) => [String(e.entry_date), e]));
  const stats = useMemo(() => {
    const recent = nights.filter((e) => String(e.entry_date) >= addDays(today, -29));
    const hrs = recent.map(sleepHours).filter((h) => h > 0);
    const avg = hrs.length ? hrs.reduce((a, b) => a + b, 0) / hrs.length : 0;
    // Humeur du jour selon la nuit : bonne humeur = « Bien » ou « Rayonnante ».
    const good = (d: string) => ['Bien', 'Rayonnante', 'Sereine', 'Joyeuse'].includes(moodOn(entries, d));
    const withMood = recent.filter((e) => moodOn(entries, String(e.entry_date)) && sleepHours(e) > 0);
    const long = withMood.filter((e) => sleepHours(e) >= 7), short = withMood.filter((e) => sleepHours(e) < 7);
    const pct = (l: Entry[]) => l.length ? Math.round(100 * l.filter((e) => good(String(e.entry_date))).length / l.length) : null;
    return { avg, nightsCount: hrs.length, longPct: pct(long), shortPct: pct(short) };
  }, [nights, entries, today]);

  if (night) return <SleepNight wake={alarm} window={smart ? 30 : 0} onDone={saveAnalysis} onCancel={() => setNight(false)} />;

  if (play) return <div className="calm-screen">
    <div className="calm-top"><button className="quit-btn" onClick={() => setPlay(null)}>Terminer</button></div>
    <p className="calm-title">{play === '478' ? 'Respiration du soir' : 'Scan du corps'}</p>
    {play === '478' ? <BreathPlayer breath={BREATHS.find((b) => b.id === '478')!} /> : <GuidedPlayer guided={GUIDED.find((g) => g.id === 'scan')!} />}
  </div>;

  return <div className="screen sleep">
    <header className="tab-head"><h1>Sommeil</h1><p>{stats.avg ? 'Moyenne sur 30 jours : ' + fmtH(stats.avg) : 'Prépare-toi à bien dormir'}</p></header>
    <img className="screen-cover" src="/modules/sommeil.webp" alt="Chambre douce et apaisante" loading="lazy" />

    <section className="ritual-card">
      <p className="ritual-label"><Moon size={16} /> Ma routine du soir</p>
      <ul className="recipe-ingredients">{ROUTINE.map((r) => <li key={r}>
        <button className={routine[r] ? 'on' : ''} aria-pressed={Boolean(routine[r])} onClick={() => void upsert({ routine: { ...routine, [r]: !routine[r] } })}>
          <span className="tick">{routine[r] ? <Check size={14} strokeWidth={3} /> : null}</span><span>{r}</span></button></li>)}</ul>
      <div className="button-group">
        <button className="button secondary" onClick={() => { unlockSound(); setPlay('478'); }}>Respiration 4-7-8</button>
        <button className="button ghost" onClick={() => { unlockSound(); setPlay('scan'); }}>Scan du corps</button>
      </div>
    </section>

    <section className="ritual-card form-stack">
      <p className="ritual-label"><AlarmClock size={16} /> Analyse de ma nuit</p>
      {lastAnalysis && <>
        <small className="muted">Nuit du {new Date(String(lastAnalysis.entry_date) + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</small>
        <SleepReport a={lastAnalysis.data.analysis as NightAnalysis} />
      </>}
      <p className="muted small">Le micro repère tes mouvements pendant la nuit pour estimer tes phases de sommeil et te réveiller en sommeil léger. Aucun son n’est enregistré : seuls des niveaux par minute sont gardés.</p>
      <label>Heure du réveil<input type="time" value={alarm} onChange={(e) => setAlarm(e.target.value)} /></label>
      <label className="check-line"><input type="checkbox" checked={smart} onChange={(e) => setSmart(e.target.checked)} /> Réveil intelligent : jusqu’à 30 min plus tôt, quand je suis en sommeil léger</label>
      <button className="button primary" onClick={() => { unlockSound(); setNight(true); }}><Moon size={16} /> Commencer ma nuit</button>
    </section>

    <section className="ritual-card form-stack">
      <p className="ritual-label">Ma nuit dernière</p>
      <div className="two-inputs">
        <label>Couchée à<input type="time" value={bed} onChange={(e) => setBed(e.target.value)} /></label>
        <label>Réveillée à<input type="time" value={wake} onChange={(e) => setWake(e.target.value)} /></label>
      </div>
      <div><span className="label-strong">Qualité</span>
        <div className="chip-row">{QUALITY.map((q, i) => <button key={q} className={'chip' + (quality === i + 1 ? ' on' : '')} onClick={() => setQuality(i + 1)}>{q}</button>)}</div></div>
      <button className="button primary" disabled={busy} onClick={() => void saveNight()}>{tonight?.data.bed ? 'Mettre à jour' : 'Enregistrer ma nuit'}</button>
      {tonight && onRemove && <button className="link-btn small" onClick={async () => { if (await onRemove(tonight)) { setBed('23:00'); setWake('07:00'); setQuality(0); } }}>Effacer cette nuit</button>}
    </section>

    <section className="ritual-card">
      <p className="ritual-label">Mes 14 dernières nuits</p>
      <div className="focus-week sleep-bars">{last14.map((d) => { const e = byDay.get(d); const h = e ? sleepHours(e) : 0;
        return <div key={d} className="focus-col"><span className={h && h < 7 ? 'short' : ''} style={{ height: Math.min(100, Math.round(h / 10 * 100)) + '%' }} title={h ? fmtH(h) : ''} />
          <small>{new Date(d + 'T12:00:00').getDate()}</small></div>; })}</div>
      {stats.longPct !== null && stats.shortPct !== null
        ? <p className="sleep-insight">Les jours après une nuit de 7 h ou plus, tu te sens bien {stats.longPct} % du temps, contre {stats.shortPct} % après une nuit plus courte.</p>
        : <p className="muted">Note tes nuits et ton humeur quelques jours : tu verras ici le lien entre les deux.</p>}
    </section>
  </div>;
}

export const fmtH = (h: number) => Math.floor(h) + ' h ' + String(Math.round((h % 1) * 60)).padStart(2, '0');
