import { create } from 'zustand';

export type LockStatus = 'checking' | 'setup' | 'locked' | 'unlocked';

type LockStore = {
  status: LockStatus;
  backgroundedAt: number | null;
  everUnlocked: boolean;
  setStatus: (status: LockStatus) => void;
  setBackgroundedAt: (at: number | null) => void;
};

export const useLock = create<LockStore>((set) => ({
  status: 'checking',
  backgroundedAt: null,
  everUnlocked: false,
  setStatus: (status) =>
    set((s) => ({ status, everUnlocked: status === 'unlocked' ? true : status === 'setup' ? false : s.everUnlocked })),
  setBackgroundedAt: (backgroundedAt) => set({ backgroundedAt }),
}));
