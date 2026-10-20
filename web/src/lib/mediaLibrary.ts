/**
 * Media is local to this browser profile: never sent to Supabase or another server.
 * The user must be informed that IndexedDB is not encrypted and is not in backups.
 */
export type MediaModule = 'sport' | 'cuisine' | 'decouvertes' | 'passions';
export type MediaRecord = {
  id: string;
  ownerId: string;
  module: MediaModule;
  entryId: string | null;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  blob: Blob;
};

const DB_NAME = 'my-thirties-local-media';
const STORE = 'files';
const VERSION = 1;
export const MAX_MEDIA_SIZE = 40 * 1024 * 1024;
const ACCEPTED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'video/mp4', 'video/webm', 'video/quicktime']);

export function validateMedia(file: File): string | null {
  if (!ACCEPTED.has(file.type)) return 'Format non pris en charge. Choisis JPG, PNG, WebP, HEIC, MP4, WebM ou MOV.';
  if (!file.size || file.size > MAX_MEDIA_SIZE) return 'Fichier vide ou supérieur à 40 Mo. Compresse la vidéo avant de l’importer.';
  return null;
}

function openMediaDb(): Promise<IDBDatabase> {
  if (!('indexedDB' in window)) return Promise.reject(new Error('Le stockage local des médias est indisponible sur ce navigateur.'));
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('owner_module', ['ownerId', 'module']);
        store.createIndex('owner_entry', ['ownerId', 'entryId']);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Impossible d’ouvrir le stockage local.'));
    request.onblocked = () => reject(new Error('Ferme les autres onglets de My Thirties et réessaie.'));
  });
}

async function transact<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore, resolve: (value: T) => void, reject: (reason: Error) => void) => void): Promise<T> {
  const db = await openMediaDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const store = tx.objectStore(STORE);
    let result: T;
    let ready = false;
    let settled = false;
    const fail = (e: Error) => { if (!settled) { settled = true; reject(e); } };
    tx.oncomplete = () => { db.close(); if (!settled && ready) { settled = true; resolve(result); } };
    tx.onerror = () => { db.close(); fail(tx.error ?? new Error('Opération média impossible.')); };
    tx.onabort = () => { db.close(); fail(tx.error ?? new Error('Stockage local interrompu.')); };
    action(store, (value) => { result = value; ready = true; }, fail);
  });
}

export async function listMedia(ownerId: string, module: MediaModule): Promise<MediaRecord[]> {
  return transact('readonly', (store, resolve, reject) => {
    const request = store.index('owner_module').getAll([ownerId, module]);
    request.onsuccess = () => resolve((request.result as MediaRecord[]).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    request.onerror = () => reject(request.error ?? new Error('Lecture des médias impossible.'));
  });
}

export async function addMedia(ownerId: string, module: MediaModule, entryId: string | null, file: File): Promise<void> {
  const error = validateMedia(file);
  if (error) throw new Error(error);
  const record: MediaRecord = {
    id: crypto.randomUUID(), ownerId, module, entryId, name: file.name.slice(0, 180),
    type: file.type, size: file.size, createdAt: new Date().toISOString(), blob: file,
  };
  await transact<void>('readwrite', (store, resolve, reject) => {
    const request = store.add(record);
    request.onsuccess = () => resolve(undefined);
    request.onerror = () => reject(request.error ?? new Error('Espace de stockage insuffisant.'));
  });
}

export async function deleteMedia(ownerId: string, id: string): Promise<void> {
  await transact<void>('readwrite', (store, resolve, reject) => {
    const get = store.get(id);
    get.onsuccess = () => {
      const item = get.result as MediaRecord | undefined;
      if (!item || item.ownerId !== ownerId) { resolve(undefined); return; }
      const request = store.delete(id);
      request.onsuccess = () => resolve(undefined);
      request.onerror = () => reject(request.error ?? new Error('Suppression impossible.'));
    };
    get.onerror = () => reject(get.error ?? new Error('Suppression impossible.'));
  });
}

export async function deleteEntryMedia(ownerId: string, entryId: string): Promise<void> {
  await transact<void>('readwrite', (store, resolve, reject) => {
    const request = store.index('owner_entry').getAllKeys([ownerId, entryId]);
    request.onsuccess = () => {
      for (const key of request.result) store.delete(key);
      resolve(undefined);
    };
    request.onerror = () => reject(request.error ?? new Error('Nettoyage des médias impossible.'));
  });
}
