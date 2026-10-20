// Pure, side-effect-free reconciliation for a future opt-in native/web sync.
// This module does not transmit or persist personal information.
export type SyncRecord = {
  id: string;
  entity: string;
  updatedAt: string;
  deletedAt: string | null;
  deviceId: string;
  data: Record<string, unknown>;
};
export type SyncAction =
  | { type: 'upload'; record: SyncRecord }
  | { type: 'download'; record: SyncRecord }
  | { type: 'conflict'; local: SyncRecord; remote: SyncRecord };

const valid = (r: SyncRecord) =>
  /^[0-9a-f-]{36}$/i.test(r.id) && Number.isFinite(Date.parse(r.updatedAt)) &&
  (!r.deletedAt || Number.isFinite(Date.parse(r.deletedAt)));

const same = (a: SyncRecord, b: SyncRecord) =>
  a.updatedAt === b.updatedAt && a.deletedAt === b.deletedAt &&
  JSON.stringify(a.data) === JSON.stringify(b.data);

export function planSync(local: SyncRecord[], remote: SyncRecord[], lastSyncedAt: string | null): SyncAction[] {
  if (lastSyncedAt && !Number.isFinite(Date.parse(lastSyncedAt))) throw new Error('Invalid sync cursor');
  const l = new Map(local.map((r) => [r.entity + ':' + r.id, r]));
  const r = new Map(remote.map((item) => [item.entity + ':' + item.id, item]));
  const keys = new Set([...l.keys(), ...r.keys()]);
  const result: SyncAction[] = [];
  for (const key of keys) {
    const a = l.get(key), b = r.get(key);
    if (a && !valid(a) || b && !valid(b)) throw new Error('Invalid sync record');
    if (a && !b) { result.push({ type: 'upload', record: a }); continue; }
    if (b && !a) { result.push({ type: 'download', record: b }); continue; }
    if (!a || !b || same(a, b)) continue;
    // Never automatically overwrite competing changes, including tombstones.
    const localChanged = !lastSyncedAt || Date.parse(a.updatedAt) > Date.parse(lastSyncedAt);
    const remoteChanged = !lastSyncedAt || Date.parse(b.updatedAt) > Date.parse(lastSyncedAt);
    if (localChanged && remoteChanged) result.push({ type: 'conflict', local: a, remote: b });
    else if (localChanged) result.push({ type: 'upload', record: a });
    else if (remoteChanged) result.push({ type: 'download', record: b });
    else result.push({ type: 'conflict', local: a, remote: b });
  }
  return result;
}

export function resolveConflict(local: SyncRecord, remote: SyncRecord, choice: 'local' | 'remote'): SyncRecord {
  if (local.id !== remote.id || local.entity !== remote.entity) throw new Error('Cannot merge different records');
  return choice === 'local' ? local : remote;
}
