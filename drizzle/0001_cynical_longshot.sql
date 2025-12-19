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
ALTER TABLE `users` ADD `is_email_verified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `verification_codes` ADD CONSTRAINT `verification_codes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;