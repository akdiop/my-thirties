CREATE TABLE `challenge` (
  `id` text PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `discipline` text NOT NULL,
  `start_date` text NOT NULL,
  `days` integer NOT NULL,
  `status` text DEFAULT 'active' NOT NULL,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL,
  `deleted_at` text,
  `device_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `challenge_day` (
  `id` text PRIMARY KEY NOT NULL,
  `challenge_id` text NOT NULL,
  `day_number` integer NOT NULL,
  `state` text DEFAULT 'not_done' NOT NULL,
  `plan` text,
  `notes` text,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL,
  `deleted_at` text,
  `device_id` text NOT NULL,
  FOREIGN KEY (`challenge_id`) REFERENCES `challenge`(`id`) ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `challenge_day_unique` ON `challenge_day` (`challenge_id`, `day_number`);
--> statement-breakpoint
CREATE TABLE `journal_entry` (
  `id` text PRIMARY KEY NOT NULL,
  `kind` text NOT NULL,
  `entry_date` text NOT NULL,
  `emotion` text,
  `trigger` text,
  `reaction` text,
  `reflection` text,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL,
  `deleted_at` text,
  `device_id` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `journal_entry_date_idx` ON `journal_entry` (`entry_date`);
--> statement-breakpoint
CREATE TABLE `sport_session` (
  `id` text PRIMARY KEY NOT NULL,
  `discipline` text NOT NULL,
  `session_date` text NOT NULL,
  `duration_minutes` integer,
  `notes` text,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL,
  `deleted_at` text,
  `device_id` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `sport_session_date_idx` ON `sport_session` (`session_date`);
