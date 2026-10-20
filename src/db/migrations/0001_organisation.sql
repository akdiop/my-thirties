CREATE TABLE `event` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`date` text NOT NULL,
	`start_time` text,
	`end_time` text,
	`category` text DEFAULT 'perso' NOT NULL,
	`location` text,
	`notes` text,
	`recurrence` text,
	`exceptions` text DEFAULT '[]' NOT NULL,
	`reminder_minutes` integer,
	`source_type` text,
	`source_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `event_date_idx` ON `event` (`date`);--> statement-breakpoint
CREATE TABLE `list` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`type` text DEFAULT 'perso' NOT NULL,
	`notes` text,
	`position` integer NOT NULL,
	`archived_at` text,
	`source_type` text,
	`source_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `list_item` (
	`id` text PRIMARY KEY NOT NULL,
	`list_id` text NOT NULL,
	`title` text NOT NULL,
	`quantity` text,
	`notes` text,
	`checked` integer DEFAULT false NOT NULL,
	`position` integer NOT NULL,
	`is_user_edited` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL,
	FOREIGN KEY (`list_id`) REFERENCES `list`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `list_item_list_idx` ON `list_item` (`list_id`);--> statement-breakpoint
CREATE TABLE `routine` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`kind` text DEFAULT 'perso' NOT NULL,
	`weekdays` text NOT NULL,
	`time` text,
	`remind` integer DEFAULT false NOT NULL,
	`position` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `routine_check` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_item_id` text NOT NULL,
	`date` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL,
	FOREIGN KEY (`routine_item_id`) REFERENCES `routine_item`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `routine_check_item_date` ON `routine_check` (`routine_item_id`,`date`);--> statement-breakpoint
CREATE TABLE `routine_item` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_id` text NOT NULL,
	`title` text NOT NULL,
	`position` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL,
	FOREIGN KEY (`routine_id`) REFERENCES `routine`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `subtask` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text NOT NULL,
	`title` text NOT NULL,
	`done` integer DEFAULT false NOT NULL,
	`position` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `task`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `task` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`notes` text,
	`due_date` text,
	`due_time` text,
	`priority` integer DEFAULT 0 NOT NULL,
	`focus_date` text,
	`recurrence` text,
	`reminder_minutes` integer,
	`completed_at` text,
	`postponed_count` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `task_due_idx` ON `task` (`due_date`);--> statement-breakpoint
CREATE INDEX `task_focus_idx` ON `task` (`focus_date`);