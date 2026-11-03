import { useEffect, useRef, useState } from 'react';
import { LocateFixed, MapPin, Search } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { computeTimes, distanceKm, geoGranted, locate, METHODS, placeName, PRAYER_SETTINGS_KIND, readSettings, searchCity, type MethodId, type PrayerSettings } from '../lib/prayertimes';

type Save = (e: Entry, d: Record<string, unknown>) => Promise<void>;
const LABELS: Record<string, string> = { Fajr: 'Fajr', Sunrise: 'Lever du soleil', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha' };

/** Enregistre (ou met à jour) les réglages de prière : une seule entrée, gardée d'un jour à l'autre. */
function useSaveSettings(entries: Entry[], onCreate: (i: EntryInput) => Promise<void>, onUpdate: Save) {
  return async (patch: Partial<PrayerSettings>) => {
    const cur = readSettings(entries);
    const next = { ...(cur?.settings ?? { method: 'mwl', hanafi: false, auto: true, place: '' }), ...patch };
    if (cur) await onUpdate(cur.entry, { ...cur.entry.data, ...next });
    else await onCreate({ module: 'spiritualite', kind: PRAYER_SETTINGS_KIND, title: 'Réglages des horaires de prière', entry_date: null, data: next });
  };
}

/** En voyage : si la localisation est déjà autorisée, la ville se met à jour toute seule à l'ouverture (déplacement de plus de 25 km). */
export function usePrayerAutoLocation(entries: Entry[], onCreate: (i: EntryInput) => Promise<void>, onUpdate: Save) {
  const save = useSaveSettings(entries, onCreate, onUpdate);
  const done = useRef(false);
  const cur = readSettings(entries);
  useEffect(() => {
    if (done.current || !cur?.settings.auto) return;
    done.current = true;
    void (async () => {
      if (!(await geoGranted())) return;
      try {
        const pos = await locate();
        if (distanceKm(pos, cur.settings) < 25) return;
        await save({ ...pos, place: (await placeName(pos.lat, pos.lon)) || cur.settings.place });
      } catch { /* on garde la dernière position connue */ }
    })();
  }, [cur?.entry.id]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function AutomaticPrayerTimes({ entries, onCreate, onUpdate }: { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: Save }) {
  const cur = readSettings(entries);
  const save = useSaveSettings(entries, onCreate, onUpdate);
  const [busy, setBusy] = useState(false), [msg, setMsg] = useState('');
  const [q, setQ] = useState(''), [results, setResults] = useState<{ name: string; lat: number; lon: number }[]>([]);
  const [changing, setChanging] = useState(false);

  const useMyPosition = async () => {
    setBusy(true); setMsg('');
    try { const pos = await locate(); await save({ ...pos, place: (await placeName(pos.lat, pos.lon)) || 'Ma position' }); setChanging(false); }
    catch (e) { setMsg(e instanceof Error ? e.message : 'Position introuvable.'); } finally { setBusy(false); }
  };
  const search = async () => {
    if (q.trim().length < 2) return;
    setBusy(true); setMsg(''); setResults([]);
    try { const r = await searchCity(q); setResults(r); if (!r.length) setMsg('Aucune ville trouvée.'); }
    catch (e) { setMsg(e instanceof Error ? e.message : 'Recherche impossible.'); } finally { setBusy(false); }
  };
  const pickCity = async (c: { name: string; lat: number; lon: number }) => {
    setBusy(true);
    try { await save({ lat: c.lat, lon: c.lon, place: c.name, auto: false }); setResults([]); setQ(''); setChanging(false); setMsg(''); } finally { setBusy(false); }
  };

  const times = cur ? computeTimes(cur.settings) : null;
  const choose = <div className="prayer-choose">
    <button className="button primary wide" disabled={busy} onClick={() => void useMyPosition()}><LocateFixed size={16} /> {busy ? 'Localisation…' : 'Utiliser ma position'}</button>
    <p className="muted small center">ou cherche une ville</p>
    <div className="search-row"><input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void search(); }} placeholder="Dakar, Paris, Casablanca…" maxLength={80} />
      <button className="button secondary" disabled={busy || q.trim().length < 2} aria-label="Chercher la ville" onClick={() => void search()}><Search size={16} /></button></div>
    {results.map((c) => <button key={c.name + c.lat} className="city-result" onClick={() => void pickCity(c)}><MapPin size={15} /> {c.name}</button>)}
  </div>;

  return <section className="soft-card prayer-settings">
    <strong>Mes horaires de prière</strong>
    {!cur ? <><p className="muted small">Indique ta position une seule fois : les horaires sont ensuite calculés chaque jour, directement sur ton téléphone.</p>{choose}</> : <>
      <div className="prayer-place"><MapPin size={16} /><span><strong>{cur.settings.place || 'Ma position'}</strong>
        <small className="muted">{cur.settings.auto ? 'Mise à jour automatique en voyage' : 'Ville fixe'}</small></span>
        <button className="link-btn small" onClick={() => setChanging(!changing)}>{changing ? 'Annuler' : 'Changer'}</button></div>
      {changing && choose}
      <div className="prayer-today">{times && Object.entries(times).map(([k, v]) => <div key={k} className={'prayer-line' + (k === 'Sunrise' ? ' sun' : '')}><span>{LABELS[k]}</span><span className="num">{v}</span></div>)}</div>
      <label className="field-label">Méthode de calcul
        <select value={cur.settings.method} onChange={(e) => void save({ method: e.target.value as MethodId })}>{METHODS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}</select></label>
      <label className="opt-row"><input type="checkbox" checked={cur.settings.hanafi} onChange={(e) => void save({ hanafi: e.target.checked })} /> Asr selon l’école hanafite (plus tard)</label>
      <label className="opt-row"><input type="checkbox" checked={cur.settings.auto} onChange={(e) => void save({ auto: e.target.checked })} /> Suivre ma position quand je voyage</label>
    </>}
    {msg && <p role="status" className="fineprint">{msg}</p>}
  </section>;
}
