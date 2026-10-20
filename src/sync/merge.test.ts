import { planSync, resolveConflict, type SyncRecord } from './merge';

const record = (id: string, deviceId: string, updatedAt: string, deletedAt: string | null = null): SyncRecord => ({
  id, entity: 'task', updatedAt, deletedAt, deviceId, data: { title: 'Example' },
});
const id = '12345678-1234-1234-1234-123456789abc';
const old = '2026-01-01T00:00:00Z';
const newer = '2026-01-02T00:00:00Z';

describe('sync reconciliation', () => {
  test('uploads local-only records', () => {
    expect(planSync([record(id, 'iphone', old)], [], old)).toEqual([{ type: 'upload', record: record(id, 'iphone', old) }]);
  });
  test('downloads remote-only records', () => {
    expect(planSync([], [record(id, 'web', old)], old)).toEqual([{ type: 'download', record: record(id, 'web', old) }]);
  });
  test('detects simultaneous edits', () => {
    const local = record(id, 'iphone', newer);
    const remote = record(id, 'web', newer);
    remote.data = { title: 'Another value' };
    expect(planSync([local], [remote], old)[0]?.type).toBe('conflict');
  });
  test('never silently erases a remote deletion', () => {
    const local = record(id, 'iphone', newer);
    const remote = record(id, 'web', newer, newer);
    expect(planSync([local], [remote], old)[0]?.type).toBe('conflict');
  });
  test('resolves only with an explicit choice', () => {
    const local = record(id, 'iphone', newer);
    const remote = record(id, 'web', old);
    expect(resolveConflict(local, remote, 'remote')).toBe(remote);
  });
  test('rejects invalid cursor', () => {
    expect(() => planSync([], [], 'not-a-date')).toThrow();
  });
});
