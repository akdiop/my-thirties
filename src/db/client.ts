import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { deleteDatabaseSync, openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';

import { getOrCreateDatabaseKey } from '@/security/keys';
import * as schema from './schema';

export const DATABASE_NAME = 'my-thirties.db';

export type Database = ExpoSQLiteDatabase<typeof schema>;

export const isValidRawKey = (key: string) => /^[0-9a-f]{64}$/.test(key);

export async function openEncryptedDatabase(): Promise<{ db: Database; sqlite: SQLiteDatabase }> {
  const key = await getOrCreateDatabaseKey();
  if (!isValidRawKey(key)) throw new Error('Clé de base de données invalide.');
  const sqlite = openDatabaseSync(DATABASE_NAME);
  try {
    sqlite.execSync(`PRAGMA key = "x'${key}'"`);
    // Standard SQLite ignores PRAGMA key; reject databases without SQLCipher.
    const cipher = sqlite.getFirstSync<{ cipher_version: string }>('PRAGMA cipher_version');
    if (!cipher?.cipher_version) {
      throw new Error('SQLCipher indisponible : une compilation native est nécessaire.');
    }
    sqlite.getFirstSync('SELECT count(*) FROM sqlite_master');
    sqlite.execSync('PRAGMA foreign_keys = ON');
    return { db: drizzle(sqlite, { schema }), sqlite };
  } catch (error) {
    sqlite.closeSync();
    throw error;
  }
}

export function destroyDatabase(sqlite: SQLiteDatabase | null) {
  sqlite?.closeSync();
  deleteDatabaseSync(DATABASE_NAME);
}
