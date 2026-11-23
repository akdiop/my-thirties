/**
 * Images du module : la carte de Leonida et ses recadrages (fournis par Aïda) restent sur l'appareil, dans le stockage local
 * des médias (IndexedDB). Ils ne sont ni publiés avec l'app ni envoyés à Supabase : les droits de la carte ne sont pas confirmés.
 */
import { useCallback, useEffect, useState } from 'react';
import { addMedia, deleteMedia, listMedia, type MediaRecord } from '../../lib/mediaLibrary';
import { GALLERY } from './data';

export const PERSO = 'perso';
/** Associe un fichier importé à une image du kit par son nom (ex. « Leonida_Map_Poster.jpg »). */
export function assetForFile(name: string): string | null {
  const base = name.toLowerCase().replace(/\.[a-z0-9]+$/, '');
  const hit = GALLERY.find((g) => g.local_file && g.local_file.toLowerCase().replace(/\.[a-z0-9]+$/, '') === base);
  return hit ? hit.id : null;
}

export function useGtaImages(ownerId: string) {
  const [records, setRecords] = useState<MediaRecord[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    try { setRecords(await listMedia(ownerId, 'gta')); setError(''); } catch (e) { setError(e instanceof Error ? e.message : 'Stockage local indisponible.'); }
  }, [ownerId]);
  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => {
    const next: Record<string, string> = {};
    for (const r of records) next[r.id] = URL.createObjectURL(r.blob);
    setUrls(next);
    return () => { for (const u of Object.values(next)) URL.revokeObjectURL(u); };
  }, [records]);
  /** L'image la plus récente pour un emplacement du kit (carte complète, recadrage…). */
  const urlFor = (assetId: string) => { const r = records.find((x) => x.entryId === assetId); return r ? urls[r.id] : undefined; };
  const personal = records.filter((r) => r.entryId === PERSO).map((r) => ({ id: r.id, name: r.name, url: urls[r.id] }));
  /** Remplace l'image d'un emplacement du kit, ou ajoute une image personnelle. */
  const save = async (assetId: string, file: File) => {
    if (assetId !== PERSO) for (const r of records.filter((x) => x.entryId === assetId)) await deleteMedia(ownerId, r.id);
    await addMedia(ownerId, 'gta', assetId, file);
    await refresh();
  };
  const remove = async (id: string) => { await deleteMedia(ownerId, id); await refresh(); };
  return { urlFor, personal, save, remove, error, refresh };
}
export type GtaImages = ReturnType<typeof useGtaImages>;
