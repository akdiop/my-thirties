import type { Entry, EntryInput, ModuleId } from './cloud';
import { modules } from '../modules';

const moduleIds = new Set<string>(modules.map((m) => m.id));
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
export const RESTORE_MAX = 5000;

/** Vérifie chaque entrée d'une sauvegarde : espace connu, type simple (habitudes, journal, compléments… compris), taille raisonnable. */
export function validateRestore(raw: unknown[]): EntryInput[] {
  if (raw.length === 0 || raw.length > RESTORE_MAX) throw new Error('La restauration accepte de 1 à ' + RESTORE_MAX + ' entrées par fichier.');
  return raw.map((item, i) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error('Entrée invalide : ' + (i + 1));
    const r = item as Record<string, unknown>;
    if (typeof r.module !== 'string' || !moduleIds.has(r.module) ||
      typeof r.kind !== 'string' || !/^[a-z_]{2,40}$/.test(r.kind) ||
      typeof r.title !== 'string' || !r.title.trim() || r.title.length > 180 ||
      !(r.entry_date === null || r.entry_date === undefined || (typeof r.entry_date === 'string' && datePattern.test(r.entry_date))) ||
      !r.data || typeof r.data !== 'object' || Array.isArray(r.data) ||
      JSON.stringify(r.data).length > 64000) {
      throw new Error('Entrée invalide : ' + (i + 1));
    }
    return { module: r.module as ModuleId, kind: r.kind, title: r.title, entry_date: (r.entry_date ?? null) as string | null, data: r.data as Record<string, unknown> };
  });
}

const sig = (e: { module: string; kind: string; title: string; entry_date: string | null; data: unknown }) =>
  JSON.stringify([e.module, e.kind, e.title, e.entry_date ?? null, e.data]);

/** Garde seulement les entrées absentes du compte (et sans doublon dans le fichier) : restaurer deux fois ne duplique rien. */
export function newOnly(inputs: EntryInput[], existing: Entry[]) {
  const seen = new Set(existing.map(sig));
  return inputs.filter((e) => { const s = sig(e); if (seen.has(s)) return false; seen.add(s); return true; });
}
