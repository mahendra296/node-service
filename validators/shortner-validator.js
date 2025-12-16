import { z } from "zod";

export const shortnerSchema = z.object({
  url: z
    .string({ required_error: "URL is required" })
    .url("Please enter a valid URL")
    .min(1, "URL is required")
    .max(2048, "URL must be less than 2048 characters")
    .trim(),

  shortCode: z
    .string()
    .max(50, "Short code must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9-_]*$/,
      "Short code can only contain letters, numbers, hyphens and underscores"
    )
    .optional()
    .or(z.literal("")),
});

export const shortnerUpdateSchema = z.object({
  url: z
    .string({ required_error: "URL is required" })
    .url("Please enter a valid URL")
    .min(1, "URL is required")
    .max(2048, "URL must be less than 2048 characters")
    .trim(),

  shortCode: z
    .string({ required_error: "Short code is required" })
    .min(1, "Short code is required")
    .max(50, "Short code must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Short code can only contain letters, numbers, hyphens and underscores"
    )
    .trim(),
});

export const validateShortner = (data) => {
  return shortnerSchema.safeParse(data);
};

export const validateShortnerUpdate = (data) => {
  return shortnerUpdateSchema.safeParse(data);
};
