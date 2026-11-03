import type { Entry, EntryInput } from './cloud';

/**
 * Écriture hors connexion : ajouts, modifications et suppressions sont gardés sur le téléphone
 * puis envoyés dans l'ordre au retour du réseau. Le journal intime (Mon jour, notes) n'est jamais stocké ici.
 */
type Op =
  | { op: 'create'; tempId: string; input: EntryInput; at: string }
  | { op: 'edit'; id: string; patch: Partial<Pick<Entry, 'title' | 'entry_date' | 'data'>>; at: string }
  | { op: 'remove'; id: string; at: string };

const KEY = 'mt-outbox-v1';
export const PRIVATE_KINDS = new Set(['daily', 'note']);
export const isTemp = (id: string) => id.startsWith('local-');

export function readOutbox(): Op[] {
  try { const v = JSON.parse(localStorage.getItem(KEY) ?? '[]'); return Array.isArray(v) ? v : []; } catch { return []; }
}
function write(ops: Op[]) {
  try { if (ops.length) localStorage.setItem(KEY, JSON.stringify(ops)); else localStorage.removeItem(KEY); return true; } catch { return false; }
}
const notify = () => window.dispatchEvent(new Event('mt-outbox'));

export function queueCreate(input: EntryInput) {
  if (PRIVATE_KINDS.has(input.kind)) return false;
  const ok = write([...readOutbox(), { op: 'create', tempId: 'local-' + crypto.randomUUID(), input, at: new Date().toISOString() }]);
  notify(); return ok;
}
export function queueEdit(id: string, patch: Partial<Pick<Entry, 'title' | 'entry_date' | 'data'>>) {
  const ops = readOutbox();
  // Modifier un ajout pas encore envoyé : on met simplement à jour l'ajout en attente.
  const pending = ops.find((o) => o.op === 'create' && o.tempId === id);
  if (pending && pending.op === 'create') { pending.input = { ...pending.input, ...patch } as EntryInput; const ok = write(ops); notify(); return ok; }
  const ok = write([...ops, { op: 'edit', id, patch, at: new Date().toISOString() }]); notify(); return ok;
}
export function queueRemove(id: string) {
  const ops = readOutbox();
  const ok = isTemp(id) ? write(ops.filter((o) => !(o.op === 'create' && o.tempId === id))) : write([...ops, { op: 'remove', id, at: new Date().toISOString() }]);
  notify(); return ok;
}

/** Ce qu'affiche l'app en attendant l'envoi : la copie locale + les changements en attente. */
export function applyOutbox(entries: Entry[]): Entry[] {
  let list = entries;
  for (const o of readOutbox()) {
    if (o.op === 'create') list = [{ id: o.tempId, user_id: '', created_at: o.at, updated_at: o.at, ...o.input, entry_date: o.input.entry_date ?? null, data: o.input.data ?? {} } as Entry, ...list];
    else if (o.op === 'edit') list = list.map((e) => e.id === o.id ? { ...e, ...o.patch, updated_at: o.at } : e);
    else list = list.filter((e) => e.id !== o.id);
  }
  return list;
}
export const pendingCount = () => readOutbox().length;

/** Envoi dans l'ordre ; s'arrête à la première erreur réseau (on réessaiera plus tard). */
export async function flushOutbox(send: { create: (i: EntryInput) => Promise<void>; edit: (id: string, p: Partial<Pick<Entry, 'title' | 'entry_date' | 'data'>>) => Promise<void>; remove: (id: string) => Promise<void> }) {
  let ops = readOutbox(), sent = 0;
  while (ops.length) {
    const o = ops[0]!;
    try {
      if (o.op === 'create') await send.create(o.input);
      else if (o.op === 'edit') await send.edit(o.id, o.patch);
      else await send.remove(o.id);
    } catch (e) {
      if (!navigator.onLine || /fetch|network|load failed/i.test(e instanceof Error ? e.message : String(e))) break;
      // Erreur du serveur (ex. entrée supprimée entre-temps) : on abandonne ce changement pour ne pas bloquer les suivants.
    }
    ops = ops.slice(1); write(ops); sent++;
  }
  notify();
  return sent;
}
