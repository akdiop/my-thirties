import { useCallback, useEffect, useRef, useState } from 'react';
import type { Entry, EntryInput } from './cloud';

export type IntegrationId = 'assistant' | 'calendar' | 'notifications' | 'prayer' | 'video' | 'sync';
export type IntegrationPrefs = Record<IntegrationId, boolean>;
export const INTEGRATIONS: { id: IntegrationId; label: string; details: string; external: string }[] = [
  { id: 'assistant', label: 'Assistant IA', details: 'Tes questions sont envoyées à l’assistant IA.', external: 'Google Gemini, uniquement quand tu poses une question' },
  { id: 'calendar', label: 'Calendriers externes', details: 'Autorise la création volontaire d’un fichier .ics à importer ailleurs. Pas de liaison automatique.', external: 'Aucun service contacté par My Thirties' },
  { id: 'notifications', label: 'Notifications', details: 'Autorise les rappels de la page ouverte, sous réserve de la permission du navigateur.', external: 'Aucun service de notification distant' },
  { id: 'prayer', label: 'Horaires de prière', details: 'Calculés sur ton téléphone à partir de ta position, enregistrée une fois.', external: 'La recherche de ville passe par Open-Meteo ; le nom de la ville par BigDataCloud' },
  { id: 'video', label: 'Analyse vidéo', details: 'Autorise le chargement du modèle de détection de posture ; les vidéos restent locales.', external: 'MediaPipe et hébergement des modèles' },
  { id: 'sync', label: 'Synchronisation iPhone/web', details: 'Préférence enregistrée, sans transfert pour le moment : moteur natif non déployé.', external: 'Aucun transfert natif actif' },
];
const key = 'my-thirties-integrations-v1';
const eventName = 'my-thirties-integrations-changed';
const defaults: IntegrationPrefs = { assistant: false, calendar: false, notifications: false, prayer: false, video: false, sync: false };
export const getIntegrationPrefs = (): IntegrationPrefs => {
  try {
    const raw = JSON.parse(localStorage.getItem(key) ?? '{}') as Record<string, unknown>;
    return Object.fromEntries(Object.keys(defaults).map((id) => [id, raw[id] === true])) as IntegrationPrefs;
  } catch { return { ...defaults }; }
};
export function setIntegrationPref(id: IntegrationId, enabled: boolean) {
  const next = { ...getIntegrationPrefs(), [id]: enabled };
  localStorage.setItem(key, JSON.stringify(next));
  window.dispatchEvent(new Event(eventName));
}
export function useIntegrationPrefs() {
  const [prefs, setPrefs] = useState(getIntegrationPrefs);
  useEffect(() => {
    const refresh = () => setPrefs(getIntegrationPrefs());
    window.addEventListener(eventName, refresh);
    window.addEventListener('storage', refresh);
    return () => { window.removeEventListener(eventName, refresh); window.removeEventListener('storage', refresh); };
  }, []);
  const setPref = useCallback((id: IntegrationId, enabled: boolean) => setIntegrationPref(id, enabled), []);
  return { prefs, setPref };
}

/** Les choix d'intégrations sont aussi gardés dans le compte : ils survivent au vidage du stockage
 *  de Safari, à la réinstallation de l'app sur l'écran d'accueil et aux autres appareils. */
export const INTEGRATIONS_KIND = 'reglages_integrations';
const clean = (d: Record<string, unknown> | undefined): IntegrationPrefs =>
  Object.fromEntries(Object.keys(defaults).map((id) => [id, d?.[id] === true])) as IntegrationPrefs;
const same = (a: IntegrationPrefs, b: IntegrationPrefs) => (Object.keys(defaults) as IntegrationId[]).every((id) => a[id] === b[id]);

/** Synchronise les préférences : le compte fait foi une fois chargé ; chaque changement local y est enregistré. */
export function useIntegrationCloudSync(entries: Entry[], ready: boolean, onCreate: (i: EntryInput) => Promise<void>, onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void>) {
  const entry = entries.find((e) => e.kind === INTEGRATIONS_KIND);
  const latest = useRef(entry);
  latest.current = entry;
  const saving = useRef(false);
  const push = useCallback(async () => {
    const local = getIntegrationPrefs();
    const cur = latest.current;
    if (saving.current || (cur && same(clean(cur.data), local))) return;
    saving.current = true;
    try {
      if (cur) await onUpdate(cur, { ...cur.data, ...local });
      else await onCreate({ module: 'quotidien', kind: INTEGRATIONS_KIND, title: 'Réglages des intégrations', entry_date: null, data: local });
    } finally { saving.current = false; }
  }, [onCreate, onUpdate]);
  // Au chargement : le compte l'emporte ; sans réglage enregistré, on y sauvegarde ceux de cet appareil.
  useEffect(() => {
    if (!ready) return;
    if (!entry) { if (Object.values(getIntegrationPrefs()).some(Boolean)) void push(); return; }
    const cloud = clean(entry.data);
    if (!same(cloud, getIntegrationPrefs())) { localStorage.setItem(key, JSON.stringify(cloud)); window.dispatchEvent(new Event(eventName)); }
  }, [ready, entry?.id, entry?.updated_at]); // eslint-disable-line react-hooks/exhaustive-deps
  // Changement fait sur cet appareil : on l'enregistre dans le compte.
  useEffect(() => {
    if (!ready) return;
    const on = () => void push();
    window.addEventListener(eventName, on);
    return () => window.removeEventListener(eventName, on);
  }, [ready, push]);
}
