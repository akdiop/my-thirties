import * as SecureStore from 'expo-secure-store';

const OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export const SECURE_KEYS = {
  dbKey: 'mythirties.db-key',
  deviceId: 'mythirties.device-id',
  pin: 'mythirties.pin',
  lockState: 'mythirties.lock-state',
} as const;

export const secureGet = (key: string) => SecureStore.getItemAsync(key, OPTIONS);
export const secureSet = (key: string, value: string) => SecureStore.setItemAsync(key, value, OPTIONS);
export const secureDelete = (key: string) => SecureStore.deleteItemAsync(key, OPTIONS);

export const secureWipe = async () => {
  await Promise.all(Object.values(SECURE_KEYS).map((key) => secureDelete(key)));
};
