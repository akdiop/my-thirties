import { useCallback, useEffect, useState } from 'react';

export type IntegrationId = 'assistant' | 'calendar' | 'notifications' | 'prayer' | 'video' | 'sync';
export type IntegrationPrefs = Record<IntegrationId, boolean>;
export const INTEGRATIONS: { id: IntegrationId; label: string; details: string; external: string }[] = [
  { id: 'assistant', label: 'Assistant IA', details: 'Tes questions sont envoyées à l’IA gratuite Google Gemini (palier gratuit : Google peut s’en servir pour améliorer ses modèles).', external: 'Google Gemini, uniquement quand tu poses une question' },
  { id: 'calendar', label: 'Calendriers externes', details: 'Autorise la création volontaire d’un fichier .ics à importer ailleurs. Pas de liaison automatique.', external: 'Aucun service contacté par My Thirties' },
  { id: 'notifications', label: 'Notifications', details: 'Autorise les rappels de la page ouverte, sous réserve de la permission du navigateur.', external: 'Aucun service de notification distant' },
  { id: 'prayer', label: 'Horaires de prière', details: 'Autorise une recherche par ville et méthode à ta demande.', external: 'AlAdhan reçoit ville, pays, date et méthode' },
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
