import { create } from 'zustand';

import type { Profile } from '@/db/schema';
import type { ModuleState } from '@/modules/registry';

type AppData = {
  profile: Profile | null;
  modules: ModuleState[];
  load: (data: { profile: Profile | null; modules: ModuleState[] }) => void;
};

export const useAppData = create<AppData>((set) => ({
  profile: null,
  modules: [],
  load: (data) => set(data),
}));
