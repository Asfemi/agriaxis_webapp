import {
  ForgotPasswordSchema,
  type ForgotPasswordFormData,
  type ForgotPasswordState,
} from "@/models/forgot-password.schema";
import { create } from "zustand";

const initialData: ForgotPasswordFormData = {
  email: "",
  phone: "",
  otp: "",
  password: "",
  password_confirmation: "",
};

export const useForgotPasswordStore = create<ForgotPasswordState>((set, get) => ({
  formData: {
    email: "",
    phone: "",
    otp: "",
    password: "",
    password_confirmation: "",
  },
  errors: {},

  updateFormData: (newData) =>
    set((state) => ({
      formData: { ...state.formData, ...newData },
      errors: {
        ...state.errors,
        ...Object.keys(newData).reduce(
          (acc, key) => ({ ...acc, [key]: undefined }),
          {},
        ),
      },
    })),

  validateStep: (fields) => {
    const { formData } = get();
    const newErrors: Partial<Record<keyof ForgotPasswordFormData, string>> = {};
    let isValid = true;

    // Validate the whole schema but only check the fields we care about
    const result = ForgotPasswordSchema.safeParse(formData);

    if (!result.success) {
      // Flatten the Zod error into a more readable format: { [field]: [message] }
      const formattedErrors = result.error.flatten().fieldErrors;

      fields.forEach((field) => {
        const errorMsg = formattedErrors[field]?.[0];
        if (errorMsg) {
          newErrors[field] = errorMsg;
          isValid = false;
        }
      });
    }

    set({ errors: newErrors });
    return isValid;
  },

  resetForm: () => set({ formData: { ...initialData }, errors: {} }),
}));
