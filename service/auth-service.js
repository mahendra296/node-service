import { db } from "../config/db.js";
import { usersTable } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

export const getUserByEmail = async (email) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return user;
};

export const createUser = async ({ name, email, password }) => {
  const result = await db
    .insert(usersTable)
    .values({
      name: name,
      email: email,
      password: password,
    })
    .$returningId();

  console.log(result);
  return result;
};

export const hashPassword = async (password) => {
  return argon2.hash(password);
};

export const verifyPassword = async (password, hashedPassword) => {
  return argon2.verify(hashedPassword, password);
};

export const generateJwtToken = async ({ id, name, email }) => {
  return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const verifyJwtToken = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const generateRefreshToken = async ({ id, name, email }) => {
  return jwt.sign({ id, name, email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

export const verifyRefreshToken = async (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};
