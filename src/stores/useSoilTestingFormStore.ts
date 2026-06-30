import {
  SoilTestingSchema,
  type SoilTestingFormData,
  type SoilTestingState,
} from "@/models/soil-testing.model";
import { create } from "zustand";

const initialData: SoilTestingFormData = {
  farm_id: "",
  coordinatesCsv: "",
  crop: "",
  depth: "",
  cost: 0,
  currency: "NGN"
};

export const useSoilTestingFormStore = create<SoilTestingState>((set, get) => ({
  formData: {
    farm_id: "",
    coordinatesCsv: "",
    crop: "",
    depth: "",
    cost: 0,
    currency: "NGN"
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
    const newErrors: Partial<Record<keyof SoilTestingFormData, string>> = {};
    let isValid = true;

    const result = SoilTestingSchema.safeParse(formData);

    if (!result.success) {
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
