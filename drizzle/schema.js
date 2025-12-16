import { relations } from "drizzle-orm";
import {
  int,
  bigint,
  mysqlTable,
  varchar,
  timestamp,
} from "drizzle-orm/mysql-core";

export const shortLinkTable = mysqlTable("short_links", {
  id: int().autoincrement().primaryKey(),
  url: varchar({ length: 255 }).notNull(),
  shortCode: varchar("short_code", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id),
});

export const usersTable = mysqlTable("users", {
  id: bigint({ mode: "number" }).autoincrement().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const userRelation = relations(usersTable, ({ many }) => {
  shortLink: many(shortLinkTable);
});

export const shortLinkRelation = relations(shortLinkTable, ({ one }) => {
  user: one(usersTable, {
    fields: [shortLinkTable.userId],
    references: [usersTable.id],
  });
});
