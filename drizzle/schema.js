import { relations } from "drizzle-orm";
import {
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
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  gender: varchar({ length: 10 }),
  email: varchar({ length: 255 }).notNull().unique(),
  countryCode: varchar("country_code", { length: 6 }),
  phone: varchar({ length: 20 }).unique(),
  password: varchar({ length: 255 }),
  profileImage: varchar("profile_image", { length: 255 }),
  isEmailVerified: boolean("is_email_verified").default(false).notNull(),
  isPhoneVerified: boolean("is_phone_verified").default(false).notNull(),
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

export const verificationCodesTable = mysqlTable("verification_codes", {
  id: bigint({ mode: "number" }).autoincrement().primaryKey(),
  userId: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  code: varchar({ length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  sendType: varchar("send_type", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const passwordHistoryTable = mysqlTable("password_history", {
  id: bigint({ mode: "number" }).autoincrement().primaryKey(),
  userId: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const oauthAccountsTable = mysqlTable("oauth_accounts", {
  id: bigint({ mode: "number" }).autoincrement().primaryKey(),
  userId: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  provider: varchar({ length: 50 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const countryCodesTable = mysqlTable("country_codes", {
  id: bigint({ mode: "number" }).autoincrement().primaryKey(),
  code: varchar({ length: 10 }).notNull(),
  country: varchar({ length: 100 }).notNull(),
  shortName: varchar("short_name", { length: 5 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userRelation = relations(usersTable, ({ many }) => ({
  shortLinks: many(shortLinkTable),
  refreshTokens: many(refreshTokensTable),
  passwordHistory: many(passwordHistoryTable),
  oauthAccounts: many(oauthAccountsTable),
}));

export const passwordHistoryRelation = relations(
  passwordHistoryTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [passwordHistoryTable.userId],
      references: [usersTable.id],
    }),
  })
);

export const refreshTokenRelation = relations(
  refreshTokensTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [refreshTokensTable.userId],
      references: [usersTable.id],
    }),
  })
);

export const oauthAccountRelation = relations(
  oauthAccountsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [oauthAccountsTable.userId],
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
