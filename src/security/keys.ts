import { randomHex, uuid } from './random';
import { SECURE_KEYS, secureGet, secureSet } from './secureStore';

const getOrCreate = async (key: string, create: () => string) => {
  const existing = await secureGet(key);
  if (existing) return existing;
  const value = create();
  await secureSet(key, value);
  return value;
};

export const getOrCreateDatabaseKey = () => getOrCreate(SECURE_KEYS.dbKey, () => randomHex(32));

export const getOrCreateDeviceId = () => getOrCreate(SECURE_KEYS.deviceId, uuid);
