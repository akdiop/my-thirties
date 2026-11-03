import { beforeEach, describe, expect, it } from 'vitest';

const store = new Map<string, string>();
Object.assign(globalThis, {
  localStorage: { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v), removeItem: (k: string) => void store.delete(k) },
  window: { dispatchEvent: () => true },
});
Object.defineProperty(globalThis, 'navigator', { value: { onLine: true }, configurable: true });
const { applyOutbox, flushOutbox, pendingCount, queueCreate, queueEdit, queueRemove, readOutbox } = await import('../outbox');
const base = { user_id: 'u', created_at: '', updated_at: '' };

describe('outbox', () => {
  beforeEach(() => store.clear());
  it('garde ajouts, modifications et suppressions et les affiche', () => {
    queueCreate({ module: 'quotidien', kind: 'task', title: 'Pain', entry_date: '2026-11-03', data: {} });
    const tmp = readOutbox()[0]! as { tempId: string };
    queueEdit(tmp.tempId, { title: 'Pain complet' });
    queueEdit('a', { title: 'B' });
    queueRemove('c');
    const list = applyOutbox([{ ...base, id: 'a', module: 'quotidien', kind: 'task', title: 'A', entry_date: null, data: {} }, { ...base, id: 'c', module: 'quotidien', kind: 'task', title: 'C', entry_date: null, data: {} }]);
    expect(list.map((e) => e.title)).toEqual(['Pain complet', 'B']);
    expect(pendingCount()).toBe(3);
  });
  it('ne garde jamais le journal intime', () => {
    expect(queueCreate({ module: 'equilibre', kind: 'daily', title: 'x', entry_date: null, data: {} })).toBe(false);
    expect(pendingCount()).toBe(0);
  });
  it('supprimer un ajout pas encore envoyé l’annule', () => {
    queueCreate({ module: 'quotidien', kind: 'task', title: 'X', entry_date: null, data: {} });
    queueRemove((readOutbox()[0] as { tempId: string }).tempId);
    expect(pendingCount()).toBe(0);
  });
  it('envoie dans l’ordre et s’arrête sur une erreur réseau', async () => {
    queueCreate({ module: 'quotidien', kind: 'task', title: '1', entry_date: null, data: {} });
    queueEdit('a', { title: '2' });
    queueRemove('b');
    const done: string[] = []; let fail = true;
    const send = { create: async () => { done.push('create'); }, edit: async () => { if (fail) { fail = false; throw new Error('Failed to fetch'); } done.push('edit'); }, remove: async () => { done.push('remove'); } };
    expect(await flushOutbox(send)).toBe(1);
    expect(pendingCount()).toBe(2);
    expect(await flushOutbox(send)).toBe(2);
    expect(done).toEqual(['create', 'edit', 'remove']);
  });
});
