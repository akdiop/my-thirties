import { useEffect, useState } from 'react';

export type PrivacyPrefs = {
  assistant: boolean;
  assistantAgenda: boolean;
  externalPrayer: boolean;
  videoAnalysis: boolean;
  calendarExport: boolean;
};
export const DEFAULT_PRIVACY: PrivacyPrefs = {
  assistant: false, assistantAgenda: false, externalPrayer: false, videoAnalysis: false, calendarExport: false,
};
const key = 'my-thirties-privacy-v1';
const events = new EventTarget();
export function readPrivacy(): PrivacyPrefs {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    return Object.fromEntries(Object.entries(DEFAULT_PRIVACY).map(([k]) => [k, saved[k] === true])) as PrivacyPrefs;
  } catch { return { ...DEFAULT_PRIVACY }; }
}
export function setPrivacy(next: PrivacyPrefs) {
  localStorage.setItem(key, JSON.stringify(next));
  events.dispatchEvent(new Event('privacy-change'));
}
export function usePrivacy() {
  const [prefs, setPrefs] = useState<PrivacyPrefs>(readPrivacy);
  useEffect(() => {
    const update = () => setPrefs(readPrivacy());
    events.addEventListener('privacy-change', update);
    window.addEventListener('storage', update);
    return () => { events.removeEventListener('privacy-change', update); window.removeEventListener('storage', update); };
  }, []);
  const update = (key: keyof PrivacyPrefs, value: boolean) => setPrivacy({ ...readPrivacy(), [key]: value });
  return { prefs, update };
}
