import { useCallback, useMemo } from 'react';

import { useSession } from '@/db/DatabaseProvider';
import { useDataVersion } from '@/state/dataVersion';

type Session = ReturnType<typeof useSession>;

export function useData<T>(read: (s: Session) => T, deps: readonly unknown[] = []): T {
  const session = useSession();
  const version = useDataVersion((v) => v.version);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => read(session), [session, version, ...deps]);
}

export function useMutate() {
  const session = useSession();
  const bump = useDataVersion((v) => v.bump);
  return useCallback(
    <R,>(write: (s: Session) => R) => {
      const result = write(session);
      bump();
      return result;
    },
    [session, bump],
  );
}
