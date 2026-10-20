CREATE TABLE `budget` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`amount_minor` integer NOT NULL,
	`currency` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `budget_category_unique` ON `budget` (`category`);--> statement-breakpoint
CREATE TABLE `fx_rate` (
	`date` text PRIMARY KEY NOT NULL,
	`usd_per_eur` real NOT NULL,
	`source` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `meal_plan` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`slot` text NOT NULL,
	`recipe_id` text,
	`title` text NOT NULL,
	`portions` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `meal_plan_date_idx` ON `meal_plan` (`date`);--> statement-breakpoint
CREATE TABLE `money_tx` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`kind` text NOT NULL,
	`amount_minor` integer NOT NULL,
	`currency` text NOT NULL,
	`category` text NOT NULL,
	`label` text,
	`notes` text,
	`subscription_id` text,
	`trip_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `money_tx_date_idx` ON `money_tx` (`date`);--> statement-breakpoint
CREATE TABLE `pantry_item` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`qty` real,
	`unit` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `passion` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`why` text,
	`horizon_months` integer NOT NULL,
	`start_date` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`materials_list_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `passion_log` (
	`id` text PRIMARY KEY NOT NULL,
	`passion_id` text NOT NULL,
	`date` text NOT NULL,
	`minutes` integer,
	`text` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL,
	FOREIGN KEY (`passion_id`) REFERENCES `passion`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `passion_step` (
	`id` text PRIMARY KEY NOT NULL,
	`passion_id` text NOT NULL,
	`title` text NOT NULL,
	`target_date` text,
	`done_at` text,
	`position` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL,
	FOREIGN KEY (`passion_id`) REFERENCES `passion`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `recipe` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`origin` text DEFAULT 'maison' NOT NULL,
	`category` text DEFAULT 'plat' NOT NULL,
	`servings` integer NOT NULL,
	`prep_min` integer,
	`cook_min` integer,
	`ingredients` text DEFAULT '[]' NOT NULL,
	`steps` text DEFAULT '[]' NOT NULL,
	`storage` text,
	`batch_friendly` integer DEFAULT true NOT NULL,
	`library_id` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `savings_goal` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`target_minor` integer NOT NULL,
	`saved_minor` integer DEFAULT 0 NOT NULL,
	`currency` text NOT NULL,
	`deadline` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `subscription` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`amount_minor` integer NOT NULL,
	`currency` text NOT NULL,
	`frequency` text NOT NULL,
	`next_date` text NOT NULL,
	`category` text DEFAULT 'Abonnements' NOT NULL,
	`remind_days` integer,
	`ended_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `trip` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`destination` text NOT NULL,
	`start_date` text,
	`end_date` text,
	`status` text DEFAULT 'idea' NOT NULL,
	`budget_minor` integer,
	`currency` text NOT NULL,
	`checklist_id` text,
	`packing_list_id` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `trip_item` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_id` text NOT NULL,
	`kind` text NOT NULL,
	`date` text,
	`time` text,
	`title` text NOT NULL,
	`notes` text,
	`done` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trip`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `trip_item_trip_idx` ON `trip_item` (`trip_id`);