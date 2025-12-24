import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: "Current password is required" })
      .min(1, "Current password is required"),

    newPassword: z
      .string({ required_error: "New password is required" })
      .min(3, "Password must be at least 3 characters")
      .max(100, "Password must be less than 100 characters"),

    confirmNewPassword: z
      .string({ required_error: "Confirm password is required" })
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export const validateChangePassword = (data) => {
  return changePasswordSchema.safeParse(data);
};
