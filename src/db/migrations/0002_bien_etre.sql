CREATE TABLE `challenge` (
	`id` text PRIMARY KEY NOT NULL,
	`template_id` text,
	`title` text NOT NULL,
	`exercise` text NOT NULL,
	`unit` text NOT NULL,
	`start_date` text NOT NULL,
	`plan` text NOT NULL,
	`sets` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`reminder_time` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `challenge_day` (
	`id` text PRIMARY KEY NOT NULL,
	`challenge_id` text NOT NULL,
	`day` integer NOT NULL,
	`status` text NOT NULL,
	`workout_session_id` text,
	`adjusted_value` integer,
	`note` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL,
	FOREIGN KEY (`challenge_id`) REFERENCES `challenge`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `challenge_day_unique` ON `challenge_day` (`challenge_id`,`day`);--> statement-breakpoint
CREATE TABLE `daily_health` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`mood` integer,
	`energy` integer,
	`pain` integer,
	`symptoms` text DEFAULT '[]' NOT NULL,
	`water` integer DEFAULT 0 NOT NULL,
	`steps` integer,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `daily_health_date_unique` ON `daily_health` (`date`);--> statement-breakpoint
CREATE TABLE `dhikr_session` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`routine_id` text,
	`total` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `emotion_entry` (
	`id` text PRIMARY KEY NOT NULL,
	`at` text NOT NULL,
	`emotion` text NOT NULL,
	`intensity` integer NOT NULL,
	`situation` text,
	`trigger` text,
	`thoughts` text,
	`reaction` text,
	`strategy` text,
	`outcome` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `food_entry` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`meal` text NOT NULL,
	`description` text NOT NULL,
	`feeling` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `gratitude_entry` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`things` text DEFAULT '[]' NOT NULL,
	`learned` text,
	`success` text,
	`reflection` text,
	`intention` text,
	`free_text` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `gratitude_entry_date_unique` ON `gratitude_entry` (`date`);--> statement-breakpoint
CREATE TABLE `monthly_reflection` (
	`id` text PRIMARY KEY NOT NULL,
	`month` text NOT NULL,
	`helped` text,
	`difficult` text,
	`strategies` text,
	`learnings` text,
	`intentions` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `monthly_reflection_month_unique` ON `monthly_reflection` (`month`);--> statement-breakpoint
CREATE TABLE `period` (
	`id` text PRIMARY KEY NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `prayer_log` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`prayer` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `prayer_log_unique` ON `prayer_log` (`date`,`prayer`);--> statement-breakpoint
CREATE TABLE `program_check` (
	`id` text PRIMARY KEY NOT NULL,
	`enrollment_id` text NOT NULL,
	`day` integer NOT NULL,
	`step` integer NOT NULL,
	`journal` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL,
	FOREIGN KEY (`enrollment_id`) REFERENCES `program_enrollment`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `program_check_unique` ON `program_check` (`enrollment_id`,`day`,`step`);--> statement-breakpoint
CREATE TABLE `program_enrollment` (
	`id` text PRIMARY KEY NOT NULL,
	`program_id` text NOT NULL,
	`start_date` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sleep_entry` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`bed_time` text NOT NULL,
	`wake_time` text NOT NULL,
	`quality` integer,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sleep_entry_date_unique` ON `sleep_entry` (`date`);--> statement-breakpoint
CREATE TABLE `spiritual_journal` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`text` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workout_session` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`discipline` text NOT NULL,
	`title` text NOT NULL,
	`duration_min` integer,
	`intensity` integer,
	`feeling` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `workout_date_idx` ON `workout_session` (`date`);