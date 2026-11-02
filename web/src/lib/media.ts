import { cloud } from './cloud';

/** Photos et mémos vocaux du journal : stockage privé Supabase (dossier de la propriétaire uniquement). */
export type Media = { path: string; type: 'photo' | 'audio'; secs?: number };
const BUCKET = 'journal';

export const mediaOf = (v: unknown): Media[] => Array.isArray(v) ? (v as Media[]).filter((m) => m && typeof m.path === 'string' && (m.type === 'photo' || m.type === 'audio')) : [];

/** Réduit une photo (1600 px max, JPEG) avant l'envoi. */
export async function compressPhoto(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ko(new Error('Photo illisible.')); i.src = url; });
    const k = Math.min(1, 1600 / Math.max(img.width, img.height));
    const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
    return await new Promise<Blob>((ok, ko) => c.toBlob((b) => b ? ok(b) : ko(new Error('Photo impossible à préparer.')), 'image/jpeg', 0.82));
  } finally { URL.revokeObjectURL(url); }
}

export async function uploadMedia(folder: string, blob: Blob, type: Media['type']): Promise<string> {
  if (!cloud) throw new Error('Stockage indisponible.');
  const { data: u } = await cloud.auth.getUser();
  if (!u.user) throw new Error('Connecte-toi pour ajouter un fichier.');
  const ext = type === 'photo' ? 'jpg' : blob.type.includes('webm') ? 'webm' : blob.type.includes('ogg') ? 'ogg' : 'm4a';
  const path = `${u.user.id}/${folder.replace(/[^\w-]/g, '').slice(0, 60) || 'note'}/${crypto.randomUUID()}.${ext}`;
  const { error } = await cloud.storage.from(BUCKET).upload(path, blob, { contentType: blob.type || (type === 'photo' ? 'image/jpeg' : 'audio/mp4'), upsert: false });
  if (error) throw new Error(/bucket|not found/i.test(error.message) ? 'Le stockage privé n’est pas encore activé (voir le SQL 005 dans Supabase).' : 'Envoi impossible : ' + error.message);
  return path;
}

const cache = new Map<string, { url: string; until: number }>();
export async function mediaUrl(path: string): Promise<string> {
  const hit = cache.get(path);
  if (hit && hit.until > Date.now()) return hit.url;
  if (!cloud) return '';
  const { data } = await cloud.storage.from(BUCKET).createSignedUrl(path, 3600);
  const url = data?.signedUrl ?? '';
  if (url) cache.set(path, { url, until: Date.now() + 50 * 60 * 1000 });
  return url;
}

export async function deleteMedia(paths: string[]) {
  if (cloud && paths.length) await cloud.storage.from(BUCKET).remove(paths);
}
