CREATE TABLE `module_setting` (
	`module_id` text PRIMARY KEY NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`position` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `preference` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`photo_uri` text,
	`language` text DEFAULT 'fr' NOT NULL,
	`country` text DEFAULT 'SN' NOT NULL,
	`timezone` text NOT NULL,
	`currency` text DEFAULT 'XOF' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`device_id` text NOT NULL
);
