import type { Entry } from './cloud';

/**
 * Copie locale pour consulter l'app sans réseau (lecture seule).
 * Le journal intime (Mon jour, notes) n'est jamais copié : il reste uniquement en ligne, derrière le verrou.
 */
const KEY = 'mt-offline-v1';
const OWNER = 'mt-owner-ok';
const PRIVATE_KINDS = new Set(['daily', 'note']);

export function saveOffline(entries: Entry[]) {
  try { localStorage.setItem(KEY, JSON.stringify({ at: new Date().toISOString(), entries: entries.filter((e) => !PRIVATE_KINDS.has(e.kind)) })); }
  catch { /* stockage plein : on garde l'ancienne copie */ }
}
export function loadOffline(): { at: string; entries: Entry[] } | null {
  try { const v = JSON.parse(localStorage.getItem(KEY) ?? 'null'); return v && Array.isArray(v.entries) ? v : null; } catch { return null; }
}
export const rememberOwner = (ok: boolean) => { try { if (ok) localStorage.setItem(OWNER, '1'); else localStorage.removeItem(OWNER); } catch { /* rien */ } };
export const knownOwner = () => { try { return localStorage.getItem(OWNER) === '1'; } catch { return false; } };
export const clearOffline = () => { try { localStorage.removeItem(KEY); localStorage.removeItem(OWNER); } catch { /* rien */ } };
export const isNetworkError = (e: unknown) => !navigator.onLine || /fetch|network|load failed|connexion/i.test(e instanceof Error ? e.message : String(e));
