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

export const period = sqliteTable('period', {
  id: text('id').primaryKey(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  notes: text('notes'),
  ...timestamps,
});

export const dailyHealth = sqliteTable('daily_health', {
  id: text('id').primaryKey(),
  date: text('date').notNull().unique(),
  mood: integer('mood'),
  energy: integer('energy'),
  pain: integer('pain'),
  symptoms: text('symptoms', { mode: 'json' }).$type<string[]>().notNull().default([]),
  water: integer('water').notNull().default(0),
  steps: integer('steps'),
  notes: text('notes'),
  ...timestamps,
});

export const sleepEntry = sqliteTable('sleep_entry', {
  id: text('id').primaryKey(),
  date: text('date').notNull().unique(),
  bedTime: text('bed_time').notNull(),
  wakeTime: text('wake_time').notNull(),
  quality: integer('quality'),
  ...timestamps,
});

export const foodEntry = sqliteTable('food_entry', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  meal: text('meal').notNull(),
  description: text('description').notNull(),
  feeling: text('feeling'),
  ...timestamps,
});

export const workoutSession = sqliteTable(
  'workout_session',
  {
    id: text('id').primaryKey(),
    date: text('date').notNull(),
    discipline: text('discipline').notNull(),
    title: text('title').notNull(),
    durationMin: integer('duration_min'),
    intensity: integer('intensity'),
    feeling: text('feeling'),
    notes: text('notes'),
    ...timestamps,
  },
  (t) => [index('workout_date_idx').on(t.date)],
);

export const challenge = sqliteTable('challenge', {
  id: text('id').primaryKey(),
  templateId: text('template_id'),
  title: text('title').notNull(),
  exercise: text('exercise').notNull(),
  unit: text('unit').notNull(),
  startDate: text('start_date').notNull(),
  plan: text('plan', { mode: 'json' }).$type<number[]>().notNull(),
  sets: integer('sets').notNull().default(1),
  status: text('status').notNull().default('active'),
  reminderTime: text('reminder_time'),
  ...timestamps,
});

export const challengeDay = sqliteTable(
  'challenge_day',
  {
    id: text('id').primaryKey(),
    challengeId: text('challenge_id')
      .notNull()
      .references(() => challenge.id, { onDelete: 'cascade' }),
    day: integer('day').notNull(),
    status: text('status').notNull(),
    workoutSessionId: text('workout_session_id'),
    adjustedValue: integer('adjusted_value'),
    note: text('note'),
    ...timestamps,
  },
  (t) => [uniqueIndex('challenge_day_unique').on(t.challengeId, t.day)],
);

export const emotionEntry = sqliteTable('emotion_entry', {
  id: text('id').primaryKey(),
  at: text('at').notNull(),
  emotion: text('emotion').notNull(),
  intensity: integer('intensity').notNull(),
  situation: text('situation'),
  trigger: text('trigger'),
  thoughts: text('thoughts'),
  reaction: text('reaction'),
  strategy: text('strategy'),
  outcome: text('outcome'),
  notes: text('notes'),
  ...timestamps,
});

export const gratitudeEntry = sqliteTable('gratitude_entry', {
  id: text('id').primaryKey(),
  date: text('date').notNull().unique(),
  things: text('things', { mode: 'json' }).$type<string[]>().notNull().default([]),
  learned: text('learned'),
  success: text('success'),
  reflection: text('reflection'),
  intention: text('intention'),
  freeText: text('free_text'),
  ...timestamps,
});

export const programEnrollment = sqliteTable('program_enrollment', {
  id: text('id').primaryKey(),
  programId: text('program_id').notNull(),
  startDate: text('start_date').notNull(),
  status: text('status').notNull().default('active'),
  ...timestamps,
});

export const programCheck = sqliteTable(
  'program_check',
  {
    id: text('id').primaryKey(),
    enrollmentId: text('enrollment_id')
      .notNull()
      .references(() => programEnrollment.id, { onDelete: 'cascade' }),
    day: integer('day').notNull(),
    step: integer('step').notNull(),
    journal: text('journal'),
    ...timestamps,
  },
  (t) => [uniqueIndex('program_check_unique').on(t.enrollmentId, t.day, t.step)],
);

export const monthlyReflection = sqliteTable('monthly_reflection', {
  id: text('id').primaryKey(),
  month: text('month').notNull().unique(),
  helped: text('helped'),
  difficult: text('difficult'),
  strategies: text('strategies'),
  learnings: text('learnings'),
  intentions: text('intentions'),
  ...timestamps,
});

export const prayerLog = sqliteTable(
  'prayer_log',
  {
    id: text('id').primaryKey(),
    date: text('date').notNull(),
    prayer: text('prayer').notNull(),
    ...timestamps,
  },
  (t) => [uniqueIndex('prayer_log_unique').on(t.date, t.prayer)],
);

export const dhikrSession = sqliteTable('dhikr_session', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  routineId: text('routine_id'),
  total: integer('total').notNull(),
  ...timestamps,
});

export const quranLog = sqliteTable('quran_log', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  pages: integer('pages').notNull(),
  note: text('note'),
  ...timestamps,
});

export const spiritualJournal = sqliteTable('spiritual_journal', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  text: text('text').notNull(),
  ...timestamps,
});

export type Period = typeof period.$inferSelect;
export type DailyHealth = typeof dailyHealth.$inferSelect;
export type SleepEntry = typeof sleepEntry.$inferSelect;
export type WorkoutSession = typeof workoutSession.$inferSelect;
export type Challenge = typeof challenge.$inferSelect;
export type ChallengeDay = typeof challengeDay.$inferSelect;
export type EmotionEntry = typeof emotionEntry.$inferSelect;
export type GratitudeEntry = typeof gratitudeEntry.$inferSelect;
