import { db } from "../config/db.js";
import { usersTable, verificationCodesTable } from "../drizzle/schema.js";
import { eq, and, gt } from "drizzle-orm";
import {
  VERIFICATION_CODE_EXPIRY,
  VERIFICATION_CODE_LENGTH,
} from "../config/constant.js";
import { sendVerificationEmail } from "./email-service.js";

export const generateVerificationCode = () => {
  const min = Math.pow(10, VERIFICATION_CODE_LENGTH - 1);
  const max = Math.pow(10, VERIFICATION_CODE_LENGTH) - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
};

export const createVerificationCode = async (userId, email, sendType = "EMAIL") => {
  // Delete any existing codes for this user
  await db
    .delete(verificationCodesTable)
    .where(eq(verificationCodesTable.userId, userId));

  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + VERIFICATION_CODE_EXPIRY);

  await db.insert(verificationCodesTable).values({
    userId,
    code,
    expiresAt,
    sendType,
  });

  // Send email with verification code
  if (sendType === "EMAIL") {
    await sendVerificationEmail(email, code);
  }

  return { success: true };
};

export const verifyCode = async (userId, code) => {
  const [verificationRecord] = await db
    .select()
    .from(verificationCodesTable)
    .where(
      and(
        eq(verificationCodesTable.userId, userId),
        eq(verificationCodesTable.code, code),
        gt(verificationCodesTable.expiresAt, new Date())
      )
    );

  if (!verificationRecord) {
    return { success: false, message: "Invalid or expired verification code" };
  }

  // Mark email as verified
  await markEmailAsVerified(userId);

  // Delete the used verification code
  await db
    .delete(verificationCodesTable)
    .where(eq(verificationCodesTable.id, verificationRecord.id));

  return { success: true };
};

export const markEmailAsVerified = async (userId) => {
  await db
    .update(usersTable)
    .set({ isEmailVerified: true })
    .where(eq(usersTable.id, userId));
};

export const deleteExpiredCodes = async () => {
  await db
    .delete(verificationCodesTable)
    .where(gt(new Date(), verificationCodesTable.expiresAt));
};
