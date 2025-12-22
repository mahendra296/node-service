CREATE TABLE `password_history` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`user_id` bigint NOT NULL,
	`password` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `password_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `password_history` ADD CONSTRAINT `password_history_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;