import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const timestamps = {
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  deletedAt: text('deleted_at'),
  deviceId: text('device_id').notNull(),
};

export const profile = sqliteTable('profile', {
  id: text('id').primaryKey(),
  firstName: text('first_name').notNull(),
  photoUri: text('photo_uri'),
  language: text('language').notNull().default('fr'),
  country: text('country').notNull().default('SN'),
  timezone: text('timezone').notNull(),
  currency: text('currency', { enum: ['XOF', 'EUR', 'USD'] }).notNull().default('XOF'),
  ...timestamps,
});

export const moduleSetting = sqliteTable('module_setting', {
  moduleId: text('module_id').primaryKey(),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  position: integer('position').notNull(),
  ...timestamps,
});

export const preference = sqliteTable('preference', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  ...timestamps,
});

export type Profile = typeof profile.$inferSelect;
export type ModuleSetting = typeof moduleSetting.$inferSelect;
export type Preference = typeof preference.$inferSelect;
