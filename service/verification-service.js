import { db } from "../config/db.js";
import { usersTable, verificationCodesTable } from "../drizzle/schema.js";
import { eq, and, gt, desc, sql } from "drizzle-orm";
import crypto from "crypto";
import {
  VERIFICATION_CODE_EXPIRY,
  VERIFICATION_CODE_LENGTH,
} from "../config/constant.js";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "./email-service.js";
import { sendOtpSms } from "./sms-service.js";

export const generateVerificationCode = () => {
  const min = Math.pow(10, VERIFICATION_CODE_LENGTH - 1);
  const max = Math.pow(10, VERIFICATION_CODE_LENGTH) - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
};

export const createVerificationCode = async (
  userId,
  contact,
  sendType = "EMAIL"
) => {
  const code = generateVerificationCode();
  const expiryMinutes = VERIFICATION_CODE_EXPIRY / 1000 / 60;

  await db.insert(verificationCodesTable).values({
    userId,
    code,
    expiresAt: sql`DATE_ADD(NOW(), INTERVAL ${expiryMinutes} MINUTE)`,
    sendType,
  });

  // Send verification code via appropriate channel
  if (sendType === "EMAIL") {
    await sendVerificationEmail(contact, code);
  } else if (sendType === "SMS") {
    await sendOtpSms(contact, code);
  }

  return { success: true };
};

export const verifyCode = async (userId, code) => {
  // Fetch the latest non-expired verification code for the user
  const [latestCode] = await db
    .select()
    .from(verificationCodesTable)
    .where(
      and(
        eq(verificationCodesTable.userId, userId),
        gt(verificationCodesTable.expiresAt, sql`NOW()`)
      )
    )
    .orderBy(desc(verificationCodesTable.createdAt))
    .limit(1);

  if (!latestCode) {
    return {
      success: false,
      message: "No verification code found or code has expired",
    };
  }

  // Check if the code matches
  if (latestCode.code !== code) {
    return { success: false, message: "Invalid verification code" };
  }

  // Mark email as verified
  await markEmailAsVerified(userId);

  return { success: true };
};

export const verifyOtpForLogin = async (userId, code) => {
  // Fetch the latest non-expired SMS verification code for the user
  const [latestCode] = await db
    .select()
    .from(verificationCodesTable)
    .where(
      and(
        eq(verificationCodesTable.userId, userId),
        eq(verificationCodesTable.sendType, "SMS"),
        gt(verificationCodesTable.expiresAt, sql`NOW()`)
      )
    )
    .orderBy(desc(verificationCodesTable.createdAt))
    .limit(1);

  if (!latestCode) {
    return { success: false, message: "No OTP found or OTP has expired" };
  }

  // Check if the code matches
  if (latestCode.code !== code) {
    return { success: false, message: "Invalid OTP" };
  }

  // Mark phone as verified
  await markPhoneAsVerified(userId);

  return { success: true };
};

export const markEmailAsVerified = async (userId) => {
  await db
    .update(usersTable)
    .set({ isEmailVerified: true })
    .where(eq(usersTable.id, userId));
};

export const markPhoneAsVerified = async (userId) => {
  await db
    .update(usersTable)
    .set({ isPhoneVerified: true })
    .where(eq(usersTable.id, userId));
};

export const deleteExpiredCodes = async () => {
  await db
    .delete(verificationCodesTable)
    .where(gt(sql`NOW()`, verificationCodesTable.expiresAt));
};

export const createResetPasswordCode = async (userId, email) => {
  const randomToken = crypto.randomBytes(32).toString("hex");
  const code = crypto.createHash("sha256").update(randomToken).digest("hex");
  const expiryMinutes = VERIFICATION_CODE_EXPIRY / 1000 / 60;

  await db.insert(verificationCodesTable).values({
    userId,
    code,
    expiresAt: sql`DATE_ADD(NOW(), INTERVAL ${expiryMinutes} MINUTE)`,
    sendType: "EMAIL",
  });

  await sendResetPasswordEmail(email, randomToken);

  return { success: true };
};

export const verifyResetPasswordCode = async (userId, code) => {
  const hashCode = crypto.createHash("sha256").update(code).digest("hex");
  const [latestCode] = await db
    .select()
    .from(verificationCodesTable)
    .where(
      and(
        eq(verificationCodesTable.userId, userId),
        eq(verificationCodesTable.sendType, "EMAIL"),
        gt(verificationCodesTable.expiresAt, sql`NOW()`)
      )
    )
    .orderBy(desc(verificationCodesTable.createdAt))
    .limit(1);

  if (!latestCode) {
    return { success: false, message: "Reset link has expired or is invalid" };
  }

  if (latestCode.code !== hashCode) {
    return { success: false, message: "Invalid reset link" };
  }

  return { success: true };
};
