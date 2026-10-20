import { useCallback } from 'react';

import { useSession } from '@/db/DatabaseProvider';
import { useAppData } from '@/state/appData';

export function useRefresh() {
  const { repo } = useSession();
  const load = useAppData((s) => s.load);
  return useCallback(() => load({ profile: repo.getProfile() ?? null, modules: repo.getModuleStates() }), [repo, load]);
}
