import type { SQLiteDatabase } from 'expo-sqlite';

import { destroyDatabase } from '@/db/client';
import { cancelAll } from '@/notifications/scheduler';
import { secureWipe } from '@/security/secureStore';

export async function wipeEverything(sqlite: SQLiteDatabase | null) {
  await cancelAll();
  destroyDatabase(sqlite);
  await secureWipe();
}
