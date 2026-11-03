import { cloud, type Entry } from './cloud';

/**
 * Sauvegarde automatique : au premier passage de chaque mois, toutes les entrées sont copiées
 * dans un fichier privé (stockage « backups », dossier de la propriétaire). Les 12 derniers mois sont gardés.
 * Le fichier se télécharge depuis Profil › Sauvegardes et se restaure sans doublons.
 */
const BUCKET = 'backups';
const KEEP = 12;
const month = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');

export function backupJson(entries: Entry[]) {
  return JSON.stringify({ format: 'my-thirties-web-backup', version: 1, createdAt: new Date().toISOString(),
    entries: entries.map(({ module, kind, title, entry_date, data }) => ({ module, kind, title, entry_date, data })) });
}

async function folder() {
  const { data } = await cloud!.auth.getSession();
  return data.session?.user.id ?? null;
}

export async function listBackups(): Promise<{ name: string; month: string; size: number }[]> {
  if (!cloud) return [];
  const uid = await folder(); if (!uid) return [];
  const { data, error } = await cloud.storage.from(BUCKET).list(uid, { limit: 50, sortBy: { column: 'name', order: 'desc' } });
  if (error) throw error;
  return (data ?? []).filter((f) => /^\d{4}-\d{2}\.json$/.test(f.name)).map((f) => ({ name: f.name, month: f.name.slice(0, 7), size: Number(f.metadata?.size ?? 0) }));
}

/** À l'ouverture : crée la sauvegarde du mois si elle n'existe pas encore (silencieux en cas d'échec). */
export async function ensureMonthlyBackup(entries: Entry[]) {
  if (!cloud || !navigator.onLine || entries.length < 5) return false;
  const tag = 'mt-backup-' + month();
  try { if (localStorage.getItem(tag)) return false; } catch { /* sans stockage local */ }
  try {
    const uid = await folder(); if (!uid) return false;
    const existing = await listBackups();
    if (!existing.some((b) => b.month === month())) {
      const { error } = await cloud.storage.from(BUCKET).upload(uid + '/' + month() + '.json', new Blob([backupJson(entries)], { type: 'application/json' }), { upsert: true, contentType: 'application/json' });
      if (error) throw error;
      const old = existing.filter((b) => b.month !== month()).slice(KEEP - 1);
      if (old.length) await cloud.storage.from(BUCKET).remove(old.map((b) => uid + '/' + b.name));
    }
    try { localStorage.setItem(tag, '1'); } catch { /* rien */ }
    return true;
  } catch { return false; }
}

export async function saveBackupNow(entries: Entry[]) {
  if (!cloud) throw new Error('Connexion non configurée.');
  const uid = await folder(); if (!uid) throw new Error('Session expirée.');
  const { error } = await cloud.storage.from(BUCKET).upload(uid + '/' + month() + '.json', new Blob([backupJson(entries)], { type: 'application/json' }), { upsert: true, contentType: 'application/json' });
  if (error) throw error;
}

export async function downloadMonthly(name: string) {
  if (!cloud) return;
  const uid = await folder(); if (!uid) return;
  const { data, error } = await cloud.storage.from(BUCKET).download(uid + '/' + name);
  if (error || !data) throw error ?? new Error('Téléchargement impossible.');
  const url = URL.createObjectURL(data), a = document.createElement('a');
  a.href = url; a.download = 'my-thirties-' + name; document.body.appendChild(a); a.click(); a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Fichier de sauvegarde en clair (sauvegarde automatique) : liste d'entrées à restaurer. */
export function parsePlainBackup(content: string): unknown[] | null {
  try { const v = JSON.parse(content); return v && v.format === 'my-thirties-web-backup' && Array.isArray(v.entries) ? v.entries : null; } catch { return null; }
}
