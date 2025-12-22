import { db } from "../config/db.js";
import { usersTable, refreshTokensTable, passwordHistoryTable } from "../drizzle/schema.js";
import { eq, and, desc } from "drizzle-orm";
import argon2 from "argon2";

export const getUserById = async (userId) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  return user;
};

export const getUserByEmail = async (email) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return user;
};

export const getSessionsByUserId = async (userId) => {
  const sessions = await db
    .select()
    .from(refreshTokensTable)
    .where(
      and(
        eq(refreshTokensTable.userId, userId),
        eq(refreshTokensTable.valid, true)
      )
    )
    .orderBy(refreshTokensTable.createdAt);

  return sessions;
};

export const updateProfileImage = async (userId, imagePath) => {
  await db
    .update(usersTable)
    .set({ profileImage: imagePath })
    .where(eq(usersTable.id, userId));
};

export const updateUserProfile = async (userId, { firstName, lastName, gender }) => {
  await db
    .update(usersTable)
    .set({ firstName, lastName, gender })
    .where(eq(usersTable.id, userId));
};

export const hashPassword = async (password) => {
  return argon2.hash(password);
};

export const verifyPassword = async (password, hashedPassword) => {
  return argon2.verify(hashedPassword, password);
};

export const updatePassword = async (userId, newHashedPassword) => {
  await db
    .update(usersTable)
    .set({ password: newHashedPassword })
    .where(eq(usersTable.id, userId));
};

// Password History Management
const PASSWORD_HISTORY_LIMIT = 5;

export const getPasswordHistory = async (userId) => {
  const history = await db
    .select()
    .from(passwordHistoryTable)
    .where(eq(passwordHistoryTable.userId, userId))
    .orderBy(desc(passwordHistoryTable.createdAt))
    .limit(PASSWORD_HISTORY_LIMIT);

  return history;
};

export const addPasswordToHistory = async (userId, hashedPassword) => {
  await db.insert(passwordHistoryTable).values({
    userId,
    password: hashedPassword,
  });

  // Clean up old passwords beyond the limit
  const allHistory = await db
    .select({ id: passwordHistoryTable.id })
    .from(passwordHistoryTable)
    .where(eq(passwordHistoryTable.userId, userId))
    .orderBy(desc(passwordHistoryTable.createdAt));

  if (allHistory.length > PASSWORD_HISTORY_LIMIT) {
    const idsToDelete = allHistory.slice(PASSWORD_HISTORY_LIMIT).map((h) => h.id);
    for (const id of idsToDelete) {
      await db.delete(passwordHistoryTable).where(eq(passwordHistoryTable.id, id));
    }
  }
};

export const isPasswordInHistory = async (userId, plainPassword) => {
  const history = await getPasswordHistory(userId);

  for (const record of history) {
    const isMatch = await argon2.verify(record.password, plainPassword);
    if (isMatch) {
      return true;
    }
  }

  return false;
};
