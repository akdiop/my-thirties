import type { EntryInput, ModuleId } from './cloud';
import { modules } from '../modules';

const moduleKinds = new Map(modules.map((m) => [m.id, new Set(m.kinds.map((k) => k.id))]));
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export function validateRestore(raw: unknown[]): EntryInput[] {
  if (raw.length === 0 || raw.length > 500) {
    throw new Error('La restauration accepte de 1 à 500 entrées par fichier.');
  }
  return raw.map((item, i) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error('Entrée invalide : ' + (i + 1));
    const r = item as Record<string, unknown>;
    const module = r.module as ModuleId;
    if (typeof r.module !== 'string' || !moduleKinds.has(module) ||
      typeof r.kind !== 'string' || !(moduleKinds.get(module)?.has(r.kind) || (module === 'quotidien' && r.kind === 'profile')) ||
      typeof r.title !== 'string' || !r.title.trim() || r.title.length > 180 ||
      !(r.entry_date === null || (typeof r.entry_date === 'string' && datePattern.test(r.entry_date))) ||
      !r.data || typeof r.data !== 'object' || Array.isArray(r.data) ||
      JSON.stringify(r.data).length > 60000) {
      throw new Error('Entrée invalide : ' + (i + 1));
    }
    return { module, kind: r.kind, title: r.title, entry_date: r.entry_date as string | null, data: r.data as Record<string, unknown> };
  });
}
