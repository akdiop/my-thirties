import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Palette } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { isoOf } from '../lib/rituals';
import { DATA_VERSION } from '../features/gta/data';
import { GTA_KIND, migrateProgress, type GtaProgress } from '../features/gta/progress';
import { useGtaImages } from '../features/gta/images';
import { GtaHome } from '../features/gta/GtaHome';
import { GtaMissions } from '../features/gta/GtaMissions';
import { GtaMap } from '../features/gta/GtaMap';
import { GtaMoney } from '../features/gta/GtaMoney';
import { GtaGallery } from '../features/gta/GtaGallery';
import { GtaCollections } from '../features/gta/GtaCollections';
import { GtaAstuces } from '../features/gta/GtaAstuces';
import type { GtaCtx, GtaTab, MapFocus } from '../features/gta/ctx';
import '../features/gta/gta.css';

type Props = { entries: Entry[]; ownerId: string; onCreate: (i: EntryInput) => Promise<void>; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void> };
const TABS: { id: GtaTab; label: string }[] = [
  { id: 'accueil', label: 'Accueil' }, { id: 'missions', label: 'Missions' }, { id: 'carte', label: 'Carte' },
  { id: 'argent', label: 'Argent et trésors' }, { id: 'astuces', label: 'Astuces' }, { id: 'galerie', label: 'Galerie' }, { id: 'collections', label: 'Collections' },
];

/** Mes loisirs · Jeux vidéo · GTA VI : missions, carte, argent et trésors, galerie et collections, avec un thème propre au module. */
export function Gta({ entries, ownerId, onCreate, onUpdate }: Props) {
  const entry = entries.find((e) => e.kind === GTA_KIND);
  const [p, setP] = useState<GtaProgress>(() => migrateProgress(entry?.data.progress));
  const [tab, setTab] = useState<GtaTab>('accueil');
  const [missionId, setMissionId] = useState<string | null>(null);
  const [moneyId, setMoneyId] = useState<string | null>(null);
  const [focus, setFocus] = useState<MapFocus | null>(null);
  const images = useGtaImages(ownerId);
  const creating = useRef(false);
  const latest = useRef(p);
  /** Vrai tant qu'une modification locale n'a pas été confirmée par l'enregistrement. */
  const dirty = useRef(false);
  const entryRef = useRef(entry);
  entryRef.current = entry;

  const flush = async () => {
    const sent = latest.current, e = entryRef.current;
    const data = { progress: sent, dataVersion: DATA_VERSION, updated: new Date().toISOString() };
    if (e) { await onUpdate(e, { ...e.data, ...data }); if (latest.current === sent) dirty.current = false; }
    else if (!creating.current) { creating.current = true; await onCreate({ module: 'passions', kind: GTA_KIND, title: 'GTA VI · progression', entry_date: null, data }); }
  };
  // Une fois l'entrée créée, on y enregistre les modifications faites pendant la création.
  useEffect(() => { if (entry && dirty.current) void flush(); }, [entry?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  // Données venues d'un autre appareil ou de la file hors ligne : reprises seulement si rien n'attend localement.
  useEffect(() => { if (entry && !dirty.current) { const next = migrateProgress(entry.data.progress); latest.current = next; setP(next); } }, [entry?.data.progress]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (fn: (x: GtaProgress) => GtaProgress) => {
    const next = fn(latest.current);
    if (next === latest.current) return;
    latest.current = next; dirty.current = true; setP(next); void flush();
  };
  const go = (t: GtaTab) => { setTab(t); setMissionId(null); setMoneyId(null); window.scrollTo(0, 0); };
  const ctx: GtaCtx = {
    p, update, images, today: isoOf(new Date()), go,
    openMission: (id) => { update((x) => (x.recent[0] === id ? x : { ...x, recent: [id, ...x.recent.filter((r) => r !== id)].slice(0, 8) })); setTab('missions'); setMissionId(id); window.scrollTo(0, 0); },
    openMoney: (id) => { setTab('argent'); setMoneyId(id); window.scrollTo(0, 0); },
    showOnMap: (rect, label) => { setFocus({ rect, label, key: Date.now() }); setTab('carte'); window.scrollTo(0, 0); },
  };
  const themed = p.settings.theme;
  return <div className={'screen gta-vi' + (themed ? ' gta-theme' : '')}>
    <header className="g-head">
      <div><p className="g-label">Mes loisirs · Jeux vidéo</p><h1 className="g-title">GTA VI</h1></div>
      <div className="g-row" style={{ flexWrap: 'nowrap' }}>
        <button className="g-icon" aria-pressed={p.settings.hideSpoilers} aria-label={p.settings.hideSpoilers ? 'Spoilers masqués : les afficher' : 'Spoilers visibles : tout masquer'} title="Spoilers"
          onClick={() => update((x) => ({ ...x, settings: { ...x.settings, hideSpoilers: !x.settings.hideSpoilers } }))}>{p.settings.hideSpoilers ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        <button className="g-icon" aria-pressed={themed} aria-label={themed ? 'Direction artistique GTA VI activée : revenir au thème neutre' : 'Activer la direction artistique GTA VI'} title="DA GTA VI"
          onClick={() => update((x) => ({ ...x, settings: { ...x.settings, theme: !x.settings.theme } }))}><Palette size={18} /></button>
      </div>
    </header>
    <nav className="g-tabs" role="tablist" aria-label="Sections GTA VI">
      {TABS.map((t) => <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => go(t.id)}>{t.label}</button>)}
    </nav>
    {tab === 'accueil' && <GtaHome {...ctx} />}
    {tab === 'missions' && <GtaMissions {...ctx} openId={missionId} setOpenId={setMissionId} />}
    {tab === 'carte' && <GtaMap key={focus?.key ?? 0} {...ctx} focus={focus} />}
    {tab === 'argent' && <GtaMoney {...ctx} openId={moneyId} setOpenId={setMoneyId} />}
    {tab === 'astuces' && <GtaAstuces {...ctx} />}
    {tab === 'galerie' && <GtaGallery {...ctx} />}
    {tab === 'collections' && <GtaCollections {...ctx} />}
    <p className="g-muted" style={{ fontSize: '.75rem' }}>Noms du jeu conservés pour le repérage ; résumés originaux, non affiliés à Rockstar Games. Données du kit v{DATA_VERSION}, vérifiées le 23/11/2026.</p>
  </div>;
}
