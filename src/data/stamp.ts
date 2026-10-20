export const nowIso = () => new Date().toISOString();

export const created = (deviceId: string) => {
  const now = nowIso();
  return { createdAt: now, updatedAt: now, deletedAt: null, deviceId };
};

export const touched = (deviceId: string) => ({ updatedAt: nowIso(), deviceId });
