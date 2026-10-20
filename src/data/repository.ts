import { eq } from 'drizzle-orm';

import type { Database } from '@/db/client';
import { moduleSetting, preference, profile, type Profile } from '@/db/schema';
import { defaultModuleStates, type ModuleState } from '@/modules/registry';
import { uuid } from '@/security/random';
import { DEFAULT_SETTINGS, SETTINGS_KEYS, type Settings } from '@/state/settings';

const stamp = (deviceId: string) => {
  const now = new Date().toISOString();
  return { createdAt: now, updatedAt: now, deletedAt: null, deviceId };
};

export function createRepository(db: Database, deviceId: string) {
  return {
    getProfile(): Profile | undefined {
      return db.select().from(profile).limit(1).all()[0];
    },

    createProfile(firstName: string) {
      const values = {
        id: uuid(),
        firstName: firstName.trim(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'Africa/Dakar',
        ...stamp(deviceId),
      };
      db.insert(profile).values(values).run();
      db.insert(moduleSetting)
        .values(defaultModuleStates().map((m) => ({ ...m, ...stamp(deviceId) })))
        .onConflictDoNothing()
        .run();
      return values;
    },

    updateProfile(id: string, patch: Partial<Pick<Profile, 'firstName' | 'currency' | 'country' | 'timezone'>>) {
      db.update(profile).set({ ...patch, updatedAt: new Date().toISOString(), deviceId }).where(eq(profile.id, id)).run();
    },

    getModuleStates(): ModuleState[] {
      return db
        .select({ moduleId: moduleSetting.moduleId, enabled: moduleSetting.enabled, position: moduleSetting.position })
        .from(moduleSetting)
        .all();
    },

    setModuleEnabled(moduleId: string, enabled: boolean, position: number) {
      const now = new Date().toISOString();
      db.insert(moduleSetting)
        .values({ moduleId, enabled, position, ...stamp(deviceId) })
        .onConflictDoUpdate({ target: moduleSetting.moduleId, set: { enabled, updatedAt: now, deviceId } })
        .run();
    },

    getSettings(): Settings {
      const rows = db.select().from(preference).all();
      const values: Partial<Settings> = {};
      for (const row of rows) {
        if (!SETTINGS_KEYS.includes(row.key as keyof Settings)) continue;
        try {
          Object.assign(values, { [row.key]: JSON.parse(row.value) });
        } catch {
          continue;
        }
      }
      return { ...DEFAULT_SETTINGS, ...values };
    },

    saveSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
      const json = JSON.stringify(value);
      db.insert(preference)
        .values({ key, value: json, ...stamp(deviceId) })
        .onConflictDoUpdate({ target: preference.key, set: { value: json, updatedAt: new Date().toISOString(), deviceId } })
        .run();
    },

    dumpAll() {
      return {
        profile: db.select().from(profile).all(),
        moduleSetting: db.select().from(moduleSetting).all(),
        preference: db.select().from(preference).all(),
      };
    },
  };
}

export type Repository = ReturnType<typeof createRepository>;
