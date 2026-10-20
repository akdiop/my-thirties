ALTER TABLE `profile` ADD `last_name` text;--> statement-breakpoint
ALTER TABLE `profile` ADD `birth_date` text;--> statement-breakpoint
ALTER TABLE `profile` ADD `city` text;--> statement-breakpoint
ALTER TABLE `profile` ADD `situation` text;--> statement-breakpoint
ALTER TABLE `profile` ADD `children` text;--> statement-breakpoint
ALTER TABLE `profile` ADD `job` text;--> statement-breakpoint
ALTER TABLE `profile` ADD `hobbies` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `languages` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `personal_values` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `intention` text;