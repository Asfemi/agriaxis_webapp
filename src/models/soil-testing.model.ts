import { z } from "zod";

export interface Transaction {
  id: string;
  farmName: string;
  status: "Processing" | "Completed" | "completed" | string;
  payment: string;
  date: string;
}

export interface SoilTestingDashboard {
  total_soil_tests: number;
  total_revenue: number;
  pending_payments: number;
  total_farms: number;
}

export const SoilTestingSchema = z.object({
  farm_id: z.string().optional(),
  coordinatesCsv: z.string().optional(),
  crop: z.string().optional(),
  depth: z.string().optional(),
  cost: z.number().optional(),
});

export type SoilTestingFormData = z.infer<typeof SoilTestingSchema>;

export interface SoilTestingState {
  formData: SoilTestingFormData;
  errors: Partial<Record<keyof SoilTestingFormData, string>>;
  updateFormData: (newData: Partial<SoilTestingFormData>) => void;
  validateStep: (fields: (keyof SoilTestingFormData)[]) => boolean;
  resetForm: () => void;
}

/**
 * @deprecated
 */
export interface SoilTestingPaymentRequest {
  farmId: string;
  amount: number;
  currency: string;
  txRef: string;
  transactionId: string;
  status: string;
  success: boolean;
}

/**
 * @deprecated
 */
export interface SoilTestingPaymentInitialiseRequest {
  farmId: string;
  amount: number;
  currency: string;
  customer: {
    email: string;
    name: string;
    phonenumber: string;
  };
}

/**
 * @deprecated
 */
export interface SoilTestingPaymentInitialiseResponse {
  payment_link: string;
  tx_ref: string;
  amount: number;
  currency: string;
  farm_id: string;
}

export interface SoilTestingUploadRequest {
  coordinatesCsv?: string;
  farmId: string;
}

export interface SoilTestingRunRequest {
  farmId: string;
  crop: string;
  depth: string;
}

export interface SoilTestingResult {
  id: string;
  farm_id: number;
  depth: string;
  clay: number;
  silt: number;
  sand: number;
  organic_matter: number;
  salinity: number;
  carbon_content: number;
  ph_level: number;
  effective_cec: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  sulphur: number;
  alumunium: number;
  magnesium: number;
  calcium: number;
  zinc: number;
  stone: number;
  bulk_density: number;
  name: string;
  crop: string;
  status: string;
  satellite_image_url: null;
  test_results: null;
  nutrient_levels: null;
  recommendations: null;
  created_at: string;
  completed_at: string;
  turnaround_time_minutes: number;
  parameters: {
    key: string;
    label: string;
    status: string;
    unit: string;
    value: number;
  }[]
}

export interface SoilTestingRecommendationResponse {
  id: number;
  crop: string;
  summary: string;
  recommendation: string;
  suitable_crops: string;
}
