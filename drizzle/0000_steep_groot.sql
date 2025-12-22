CREATE TABLE `refresh_tokens` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`user_id` bigint NOT NULL,
	`valid` boolean NOT NULL,
	`user_agent` text,
	`ip` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `refresh_tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `short_links` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`url` varchar(255) NOT NULL,
	`short_code` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`user_id` bigint NOT NULL,
	CONSTRAINT `short_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `short_links_short_code_unique` UNIQUE(`short_code`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`gender` varchar(10) NOT NULL,
	`email` varchar(255) NOT NULL,
	`country_code` varchar(6),
	`phone` varchar(20),
	`password` varchar(255) NOT NULL,
	`profile_image` varchar(255),
	`is_email_verified` boolean NOT NULL DEFAULT false,
	`is_phone_verified` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
CREATE TABLE `verification_codes` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`user_id` bigint NOT NULL,
	`code` varchar(10) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`send_type` varchar(10) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_codes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `short_links` ADD CONSTRAINT `short_links_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `verification_codes` ADD CONSTRAINT `verification_codes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;