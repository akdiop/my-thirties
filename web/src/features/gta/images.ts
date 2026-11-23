/**
 * Images du module. La carte de Leonida et ses recadrages (fournis par Aïda, usage privé) sont livrés avec l'app en WebP
 * dans public/gta, gardés hors ligne par le service worker. Les captures personnelles restent sur l'appareil (IndexedDB).
 */
import { useCallback, useEffect, useState } from 'react';
import { addMedia, deleteMedia, listMedia, type MediaRecord } from '../../lib/mediaLibrary';
import { GALLERY } from './data';

export const PERSO = 'perso';
/** Chemin de l'image livrée avec l'app pour une entrée de la galerie (même nom que dans le kit, en .webp). */
export const bundledUrl = (assetId: string) => { const f = GALLERY.find((g) => g.id === assetId)?.local_file; return f ? '/gta/' + f.replace(/\.[a-z0-9]+$/i, '') + '.webp' : undefined; };

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
  const urlFor = bundledUrl;
  const personal = records.filter((r) => r.entryId === PERSO).map((r) => ({ id: r.id, name: r.name, url: urls[r.id] }));
  /** Ajoute une capture personnelle, gardée seulement sur cet appareil. */
  const save = async (file: File) => { await addMedia(ownerId, 'gta', PERSO, file); await refresh(); };
  const remove = async (id: string) => { await deleteMedia(ownerId, id); await refresh(); };
  return { urlFor, personal, save, remove, error, refresh };
}
export type GtaImages = ReturnType<typeof useGtaImages>;
