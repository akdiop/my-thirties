import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import type { SQLiteDatabase } from 'expo-sqlite';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { createRepository, type Repository } from '@/data/repository';
import { getOrCreateDeviceId } from '@/security/keys';
import { useSettings } from '@/state/settings';
import { openEncryptedDatabase, type Database } from './client';
import migrations from './migrations/migrations';

type Session = { db: Database; sqlite: SQLiteDatabase; repo: Repository };

const SessionContext = createContext<Session | null>(null);

type Opened = { db: Database; sqlite: SQLiteDatabase; deviceId: string };

export function DatabaseProvider({ children, fallback, onError }: { children: ReactNode; fallback: ReactNode; onError: (e: Error) => ReactNode }) {
  const [opened, setOpened] = useState<Opened | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([openEncryptedDatabase(), getOrCreateDeviceId()])
      .then(([{ db, sqlite }, deviceId]) => {
        if (!cancelled) setOpened({ db, sqlite, deviceId });
      })
      .catch((e: unknown) => !cancelled && setError(e instanceof Error ? e : new Error(String(e))));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(
    () => () => {
      try {
        opened?.sqlite.closeSync();
      } catch {
        // Déjà fermée (suppression des données).
      }
    },
    [opened],
  );

  if (error) return <>{onError(error)}</>;
  if (!opened) return <>{fallback}</>;
  return (
    <Migrated opened={opened} fallback={fallback} onError={onError}>
      {children}
    </Migrated>
  );
}

function Migrated({ opened, children, fallback, onError }: { opened: Opened; children: ReactNode; fallback: ReactNode; onError: (e: Error) => ReactNode }) {
  const { success, error } = useMigrations(opened.db, migrations);
  const hydrate = useSettings((s) => s.hydrate);
  const session = useMemo(
    () => ({ db: opened.db, sqlite: opened.sqlite, repo: createRepository(opened.db, opened.deviceId) }),
    [opened],
  );

  useEffect(() => {
    if (success) hydrate(session.repo.getSettings());
  }, [success, session, hydrate]);

  if (error) return <>{onError(error)}</>;
  if (!success) return <>{fallback}</>;
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession doit être utilisé sous DatabaseProvider.');
  return session;
}
