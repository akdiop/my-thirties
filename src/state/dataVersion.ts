import { create } from 'zustand';

type DataVersion = { version: number; bump: () => void };

export const useDataVersion = create<DataVersion>((set) => ({
  version: 0,
  bump: () => set((s) => ({ version: s.version + 1 })),
}));
