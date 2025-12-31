import { z } from "zod";

export const editProfileSchema = z.object({
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
    .string()
    .optional()
    .refine(
      (val) => !val || ["male", "female", "other"].includes(val),
      "Please select a valid gender"
    ),

  countryCode: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+[0-9]{1,4}$/.test(val),
      "Please select a valid country code"
    ),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.length >= 10 && val.length <= 15 && /^[0-9]+$/.test(val)),
      "Phone number must be 10-15 digits"
    ),
}).refine(
  (data) => {
    // If phone is provided, countryCode must also be provided
    if (data.phone && !data.countryCode) {
      return false;
    }
    return true;
  },
  {
    message: "Please select a country code for your phone number",
    path: ["countryCode"],
  }
);

export const validateEditProfile = (data) => {
  return editProfileSchema.safeParse(data);
};
