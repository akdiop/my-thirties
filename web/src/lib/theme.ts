import { useEffect, useState } from 'react';

export type ThemeMode = 'auto' | 'jour' | 'nuit';
const KEY = 'my-thirties-theme';
const EVENT = 'my-thirties-theme';
export const NIGHT_FROM = 21, NIGHT_TO = 7;

export const readTheme = (): ThemeMode => { try { const v = localStorage.getItem(KEY); return v === 'jour' || v === 'nuit' ? v : 'auto'; } catch { return 'auto'; } };
export function setTheme(mode: ThemeMode) { try { localStorage.setItem(KEY, mode); } catch { /* préférence non gardée */ } window.dispatchEvent(new Event(EVENT)); }
const isNight = (d = new Date()) => d.getHours() >= NIGHT_FROM || d.getHours() < NIGHT_TO;

/** Applique le thème sur <html> : sombre toujours, jamais, ou automatiquement de 21 h à 7 h. */
export function applyTheme() {
  const mode = readTheme();
  const dark = mode === 'nuit' || (mode === 'auto' && isNight());
  document.documentElement.classList.toggle('dark', dark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0A0C0E' : '#EFECE6');
}

/** À appeler une fois : applique le thème maintenant, chaque minute et quand le réglage change. */
export function useThemeClock() {
  useEffect(() => {
    applyTheme();
    const t = window.setInterval(applyTheme, 60_000);
    const vis = () => { if (document.visibilityState === 'visible') applyTheme(); };
    window.addEventListener(EVENT, applyTheme); document.addEventListener('visibilitychange', vis);
    return () => { window.clearInterval(t); window.removeEventListener(EVENT, applyTheme); document.removeEventListener('visibilitychange', vis); };
  }, []);
}

export function useThemeMode() {
  const [mode, setMode] = useState(readTheme);
  useEffect(() => { const f = () => setMode(readTheme()); window.addEventListener(EVENT, f); return () => window.removeEventListener(EVENT, f); }, []);
  return [mode, (m: ThemeMode) => setTheme(m)] as const;
}
