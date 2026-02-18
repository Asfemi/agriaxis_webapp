import { z } from "zod";

export interface Transaction {
  id: string;
  farmName: string;
  status: "Processing" | "Completed";
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
  depth: z.string().optional() || z.number().optional(),
});

export type SoilTestingFormData = z.infer<typeof SoilTestingSchema>;

export interface SoilTestingState {
  formData: SoilTestingFormData;
  errors: Partial<Record<keyof SoilTestingFormData, string>>;
  updateFormData: (newData: Partial<SoilTestingFormData>) => void;
  validateStep: (fields: (keyof SoilTestingFormData)[]) => boolean;
  resetForm: () => void;
}

export interface SoilTestingPaymentRequest {
  farmId: string;
  amount: number;
  currency: string;
  txRef: string;
  transactionId: string;
  status: string;
  success: boolean;
}

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

export interface SoilTestingPaymentInitialiseResponse {
  payment_link: string;
  tx_ref: string;
  amount: number;
  currency: string;
  farm_id: string;
}
