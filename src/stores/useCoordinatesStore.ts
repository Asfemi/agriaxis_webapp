import { create } from "zustand";
import { z } from "zod";

export const PointsSchema = z.object({
  point_1: z.string().optional(),
  point_2: z.string().optional(),
  point_3: z.string().optional(),
  point_4: z.string().optional(),
  currentPoint: z.string()
});

export type PointsFormData = z.infer<typeof PointsSchema>;

export interface PointsState {
  formData: PointsFormData;
  errors: Partial<Record<keyof PointsFormData, string>>;
  updateFormData: (newData: Partial<PointsFormData>) => void;
  validateStep: (fields: (keyof PointsFormData)[]) => boolean;
  resetForm: () => void;
}

const initialData: PointsFormData = {
  point_1: "",
  point_2: "",
  point_3: "",
  point_4: "",
  currentPoint: "1",
};

export const useCoordinatesStore = create<PointsState>((set, get) => ({
  formData: {
    point_1: "",
    point_2: "",
    point_3: "",
    point_4: "",
    currentPoint: "1",
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
    const newErrors: Partial<Record<keyof PointsFormData, string>> = {};
    let isValid = true;

    const result = PointsSchema.safeParse(formData);

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
