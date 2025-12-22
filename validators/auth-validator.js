import { z } from "zod";

export const registrationSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .trim(),

  lastName: z
    .string({ required_error: "Last name is required" })
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .trim(),

  gender: z
    .string({ required_error: "Gender is required" })
    .refine(
      (val) => ["male", "female", "other"].includes(val),
      "Please select a valid gender"
    ),

  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),

  phone: z
    .string({ required_error: "Phone number is required" })
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),

  password: z
    .string({ required_error: "Password is required" })
    .min(3, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters"),

  // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  // .regex(/[0-9]/, "Password must contain at least one number"),

  terms: z
    .string({ required_error: "You must agree to the terms" })
    .refine((val) => val === "on", "You must agree to the terms"),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),

  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

export const validateRegistration = (data) => {
  return registrationSchema.safeParse(data);
};

export const validateLogin = (data) => {
  return loginSchema.safeParse(data);
};
