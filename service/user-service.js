import { db } from "../config/db.js";
import { usersTable, oauthAccountsTable } from "../drizzle/schema.js";
import { eq, and } from "drizzle-orm";

export const getUserById = async (userId) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  return user;
};

export const createUser = async ({
  firstName,
  lastName,
  gender,
  email,
  countryCode,
  phone,
  password,
}) => {
  const result = await db
    .insert(usersTable)
    .values({
      firstName,
      lastName,
      gender,
      email,
      countryCode: countryCode || null,
      phone: phone || null,
      password,
    })
    .$returningId();

  console.log(result);
  return result;
};

export const getUserByEmail = async (email) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return user;
};

export const getUserByPhone = async (countryCode, phone) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.countryCode, countryCode), eq(usersTable.phone, phone)));

  return user;
};

export const createOAuthAccount = async ({
  userId,
  provider,
  providerAccountId,
}) => {
  const result = await db
    .insert(oauthAccountsTable)
    .values({
      userId,
      provider,
      providerAccountId,
    })
    .$returningId();

  return result;
};

export const createUserWithOauth = async ({
  providerUser,
  provider,
  providerAccountId,
  email
}) => {
  // Create new user from Google profile
  const nameParts = (providerUser.name || "").split(" ");
  const firstName = nameParts[0] || providerUser.given_name || "";
  const lastName = nameParts.slice(1).join(" ") || providerUser.family_name || "";

  const user = await db.transaction(async (trx) => {
    const [user] = await trx
      .insert(usersTable)
      .values({
        firstName,
        lastName,
        gender: null,
        email,
        countryCode: null,
        phone: null,
        password: null,
        isEmailVerified: true,
      })
      .$returningId();

    await trx
      .insert(oauthAccountsTable)
      .values({
        userId: user.id,
        provider,
        providerAccountId,
      })
      .$returningId();

    return {
      id: user.id,
      firstName,
      lastName,
      email,
      isEmailVerified: true,
      provider,
      providerAccountId,
    };
  });

  return user;
};

export const getUserWithAuthId = async (provider, email) => {
  const [account] = await db
    .select({
      id: usersTable.id,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
      isEmailVerified: usersTable.isEmailVerified,
      phone: usersTable.phone,
      countryCode: usersTable.countryCode,
      gender: usersTable.gender,
      providerAccountId: oauthAccountsTable.providerAccountId,
      provider: oauthAccountsTable.provider,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .leftJoin(
      oauthAccountsTable,
      and(
        eq(oauthAccountsTable.provider, provider),
        eq(oauthAccountsTable.userId, usersTable.id)
      )
    );

  return account;
};
