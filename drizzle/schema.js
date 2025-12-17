import { relations } from "drizzle-orm";
import {
  int,
  bigint,
  mysqlTable,
  varchar,
  timestamp,
  text,
  boolean,
} from "drizzle-orm/mysql-core";

export const shortLinkTable = mysqlTable("short_links", {
  id: bigint({ mode: "number" }).autoincrement().primaryKey(),
  url: varchar({ length: 255 }).notNull(),
  shortCode: varchar("short_code", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  userId: bigint("user_id", { mode: "number" })
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

export const refreshTokensTable = mysqlTable("refresh_tokens", {
  id: bigint({ mode: "number" }).autoincrement().primaryKey(),
  userId: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  valid: boolean().$default(true).notNull(),
  userAgent: text("user_agent"),
  ip: varchar({ length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const userRelation = relations(usersTable, ({ many }) => ({
  shortLinks: many(shortLinkTable),
  refreshTokens: many(refreshTokensTable),
}));

export const refreshTokenRelation = relations(
  refreshTokensTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [refreshTokensTable.userId],
      references: [usersTable.id],
    }),
  })
);

export const shortLinkRelation = relations(shortLinkTable, ({ one }) => {
  user: one(usersTable, {
    fields: [shortLinkTable.userId],
    references: [usersTable.id],
  });
});
