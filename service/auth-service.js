import { db } from "../config/db.js";
import { refreshTokensTable } from "../drizzle/schema.js";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import {
  ACCESS_TOKEN_EXPIRY,
  MILISECONDS_PER_SECONDS,
  REFRESH_TOKEN_EXPIRY,
} from "../config/constant.js";
import {
  addSession,
  removeSession,
  removeSessions,
  isSessionActive,
} from "./session-cache.js";
import { getUserById } from "./user-service.js";

export const hashPassword = async (password) => {
  return argon2.hash(password);
};

export const verifyPassword = async (password, hashedPassword) => {
  return argon2.verify(hashedPassword, password);
};

export const generateJwtToken = async ({ id, name, email, refreshTokenId }) => {
  return jwt.sign({ id, name, email, refreshTokenId }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY / MILISECONDS_PER_SECONDS,
  });
};

export const generateRefreshToken = async ({ refreshTokenId }) => {
  return jwt.sign({ refreshTokenId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY / MILISECONDS_PER_SECONDS,
  });
};

export const createSession = async (userId, { ip, userAgent }) => {
  // Allow multiple sessions for multi-device support
  const [session] = await db
    .insert(refreshTokensTable)
    .values({
      userId: userId,
      userAgent: userAgent,
      ip: ip,
      valid: true,
    })
    .$returningId();

  // Add to in-memory cache
  addSession(session.id);

  return session;
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

export const verifyJwtToken = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const verifyRefreshToken = async (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

export const refreshJwtToken = async (refreshToken) => {
  let refreshTokenId = null;
  try {
    const decodedToken = await verifyRefreshToken(refreshToken);
    refreshTokenId = decodedToken.refreshTokenId;
    const currentSession = await findSessionById(refreshTokenId);

    if (!currentSession) {
      // Delete invalid session from DB if it exists
      if (refreshTokenId) {
        await db
          .delete(refreshTokensTable)
          .where(eq(refreshTokensTable.id, refreshTokenId));
      }
      throw new Error("Invalid session");
    }

    const user = await getUserById(currentSession.userId);
    if (!user) {
      // Delete session for non-existent user
      await db
        .delete(refreshTokensTable)
        .where(eq(refreshTokensTable.id, refreshTokenId));
      throw new Error("Invalid user");
    }

    const userInfo = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      refreshTokenId: currentSession.id,
    };

    const newAccessToken = await generateJwtToken(userInfo);
    const newRefreshToken = await generateRefreshToken(currentSession.id);

    return { newAccessToken, newRefreshToken, user: userInfo };
  } catch (error) {
    // Delete the refresh token on any exception (expired, invalid, etc.)
    if (refreshTokenId) {
      await db
        .delete(refreshTokensTable)
        .where(eq(refreshTokensTable.id, refreshTokenId));
    }
    console.error(error);
    throw error;
  }
};

export const findSessionById = async (refreshTokenId) => {
  const [refreshToken] = await db
    .select()
    .from(refreshTokensTable)
    .where(
      and(
        eq(refreshTokensTable.id, refreshTokenId),
        eq(refreshTokensTable.valid, true)
      )
    );

  return refreshToken;
};

export const deleteRefreshTokenByUserId = async (userId) => {
  // Get all session IDs for this user first
  const sessions = await db
    .select({ id: refreshTokensTable.id })
    .from(refreshTokensTable)
    .where(eq(refreshTokensTable.userId, userId));

  // Remove from cache
  const sessionIds = sessions.map((s) => s.id);
  removeSessions(sessionIds);

  // Delete from database
  await db
    .delete(refreshTokensTable)
    .where(eq(refreshTokensTable.userId, userId));
};

export const deleteRefreshTokenById = async (refreshTokenId) => {
  // Remove from cache
  removeSession(refreshTokenId);

  // Delete from database
  await db
    .delete(refreshTokensTable)
    .where(eq(refreshTokensTable.id, refreshTokenId));
};

// Check if session is active (uses in-memory cache)
export { isSessionActive };

// Load all active sessions from DB into cache on server startup
export const loadSessionsIntoCache = async () => {
  const sessions = await db
    .select({ id: refreshTokensTable.id })
    .from(refreshTokensTable)
    .where(eq(refreshTokensTable.valid, true));

  sessions.forEach((session) => addSession(session.id));
  console.log(`Loaded ${sessions.length} active sessions into cache`);
};

