import { INITIAL_LOCKOUT, type LockoutState, type StoredPin } from './pin';
import { SECURE_KEYS, secureGet, secureSet } from './secureStore';

export type LockConfig = { biometricEnabled: boolean; lockout: LockoutState };

const DEFAULT_CONFIG: LockConfig = { biometricEnabled: false, lockout: INITIAL_LOCKOUT };

const parse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return { ...fallback, ...(JSON.parse(raw) as T) };
  } catch {
    return fallback;
  }
};

export const readStoredPin = async () => {
  const raw = await secureGet(SECURE_KEYS.pin);
  return raw ? (JSON.parse(raw) as StoredPin) : null;
};

export const writeStoredPin = (pin: StoredPin) => secureSet(SECURE_KEYS.pin, JSON.stringify(pin));

export const readLockConfig = async () => parse(await secureGet(SECURE_KEYS.lockState), DEFAULT_CONFIG);

export const writeLockConfig = (config: LockConfig) => secureSet(SECURE_KEYS.lockState, JSON.stringify(config));
