import { z } from "zod";
import { VERIFICATION_CODE_LENGTH } from "../config/constant.js";

export const verificationCodeSchema = z.object({
  code: z
    .string({ required_error: "Verification code is required" })
    .length(
      VERIFICATION_CODE_LENGTH,
      `Verification code must be ${VERIFICATION_CODE_LENGTH} digits`
    )
    .regex(/^[0-9]+$/, "Verification code must contain only numbers"),
});

export const validateVerificationCode = (data) => {
  return verificationCodeSchema.safeParse(data);
};
