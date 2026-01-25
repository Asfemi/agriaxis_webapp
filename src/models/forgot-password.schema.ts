import { z } from "zod";

export const ForgotPasswordSchema = z
  .object({
    email: z.email("Invalid email address").or(z.literal("")).optional(),
    phone: z.string().min(10, "Phone must be at least 10 digits").or(z.literal("")).optional(),
    otp: z.string().min(6, "OTP must be 6 digits"),
    password: z.string().min(8, "Password must be 8+ characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  })

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

export interface ForgotPasswordState {
  formData: ForgotPasswordFormData;
  errors: Partial<Record<keyof ForgotPasswordFormData, string>>;
  updateFormData: (newData: Partial<ForgotPasswordFormData>) => void;
  validateStep: (fields: (keyof ForgotPasswordFormData)[]) => boolean;
  resetForm: () => void;
}

