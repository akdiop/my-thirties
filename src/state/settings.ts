import { create } from 'zustand';

import type { NotificationSettings } from '@/notifications/planner';
import { DEFAULT_PRAYER_SETTINGS, type PrayerSettings } from '@/spiritualite/prayer';

export type Appearance = 'system' | 'light' | 'dark';

export type Settings = {
  appearance: Appearance;
  lockDelayMs: number;
  notifications: NotificationSettings;
  briefingTime: string | null;
  eveningTime: string | null;
  deviceCalendars: boolean;
  widgetAgendaEnabled: boolean;
  prayer: PrayerSettings;
  healthForSport: boolean;
  stepsEnabled: boolean;
  stepGoal: number;
};

export const DEFAULT_SETTINGS: Settings = {
  appearance: 'light',
  lockDelayMs: 60_000,
  notifications: { enabled: true, disabledCategories: [], quietHours: { start: '22:00', end: '07:00' } },
  briefingTime: '07:30',
  eveningTime: '20:30',
  deviceCalendars: false,
  widgetAgendaEnabled: false,
  prayer: DEFAULT_PRAYER_SETTINGS,
  healthForSport: false,
  stepsEnabled: false,
  stepGoal: 8000,
};

type SettingsStore = Settings & {
  hydrate: (values: Partial<Settings>) => void;
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
};

export const useSettings = create<SettingsStore>((set) => ({
  ...DEFAULT_SETTINGS,
  hydrate: (values) => set(values),
  set: (key, value) => set({ [key]: value } as Partial<Settings>),
}));

export const SETTINGS_KEYS = Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[];
