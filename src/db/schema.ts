import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

import type { RecurrenceRule } from '../agenda/recurrence';

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

export const event = sqliteTable(
  'event',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    date: text('date').notNull(),
    startTime: text('start_time'),
    endTime: text('end_time'),
    category: text('category').notNull().default('perso'),
    location: text('location'),
    notes: text('notes'),
    recurrence: text('recurrence', { mode: 'json' }).$type<RecurrenceRule | null>(),
    exceptions: text('exceptions', { mode: 'json' }).$type<string[]>().notNull().default([]),
    reminderMinutes: integer('reminder_minutes'),
    sourceType: text('source_type'),
    sourceId: text('source_id'),
    ...timestamps,
  },
  (t) => [index('event_date_idx').on(t.date)],
);

export const task = sqliteTable(
  'task',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    notes: text('notes'),
    dueDate: text('due_date'),
    dueTime: text('due_time'),
    priority: integer('priority').notNull().default(0),
    focusDate: text('focus_date'),
    recurrence: text('recurrence', { mode: 'json' }).$type<RecurrenceRule | null>(),
    reminderMinutes: integer('reminder_minutes'),
    completedAt: text('completed_at'),
    postponedCount: integer('postponed_count').notNull().default(0),
    ...timestamps,
  },
  (t) => [index('task_due_idx').on(t.dueDate), index('task_focus_idx').on(t.focusDate)],
);

export const subtask = sqliteTable('subtask', {
  id: text('id').primaryKey(),
  taskId: text('task_id')
    .notNull()
    .references(() => task.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  done: integer('done', { mode: 'boolean' }).notNull().default(false),
  position: integer('position').notNull(),
  ...timestamps,
});

export const routine = sqliteTable('routine', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  kind: text('kind').notNull().default('perso'),
  weekdays: text('weekdays', { mode: 'json' }).$type<number[]>().notNull(),
  time: text('time'),
  remind: integer('remind', { mode: 'boolean' }).notNull().default(false),
  position: integer('position').notNull(),
  ...timestamps,
});

export const routineItem = sqliteTable('routine_item', {
  id: text('id').primaryKey(),
  routineId: text('routine_id')
    .notNull()
    .references(() => routine.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  position: integer('position').notNull(),
  ...timestamps,
});

export const routineCheck = sqliteTable(
  'routine_check',
  {
    id: text('id').primaryKey(),
    routineItemId: text('routine_item_id')
      .notNull()
      .references(() => routineItem.id, { onDelete: 'cascade' }),
    date: text('date').notNull(),
    ...timestamps,
  },
  (t) => [uniqueIndex('routine_check_item_date').on(t.routineItemId, t.date)],
);

export const list = sqliteTable('list', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type').notNull().default('perso'),
  notes: text('notes'),
  position: integer('position').notNull(),
  archivedAt: text('archived_at'),
  sourceType: text('source_type'),
  sourceId: text('source_id'),
  ...timestamps,
});

export const listItem = sqliteTable(
  'list_item',
  {
    id: text('id').primaryKey(),
    listId: text('list_id')
      .notNull()
      .references(() => list.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    quantity: text('quantity'),
    notes: text('notes'),
    checked: integer('checked', { mode: 'boolean' }).notNull().default(false),
    position: integer('position').notNull(),
    isUserEdited: integer('is_user_edited', { mode: 'boolean' }).notNull().default(true),
    ...timestamps,
  },
  (t) => [index('list_item_list_idx').on(t.listId)],
);

export type Event = typeof event.$inferSelect;
export type Task = typeof task.$inferSelect;
export type Subtask = typeof subtask.$inferSelect;
export type Routine = typeof routine.$inferSelect;
export type RoutineItem = typeof routineItem.$inferSelect;
export type List = typeof list.$inferSelect;
export type ListItem = typeof listItem.$inferSelect;
