import { z } from "zod";

export interface Farm {
  id: string;
  farm_name: string;
  size: string;
  location: string;
  status: string;
  date: string;
  // soilPh: number;
  // moisture: number;
  // nutrient: string;
  // tests: FarmTest[];
}

export interface FarmTest {
  testID: string;
  status: string;
  payment: number;
  date: string;
  plantingDate: string;
}

export const NewFarmSchema = z.object({
  name: z.string().optional(),
  coordinatesCsv: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  state: z.string().optional(),
  lga: z.string().optional(),
  physical_address: z.string().optional(),
  size_hectares: z.number().optional(),
  size_unit: z.string().optional(),
  crop_type: z.string().optional(),
  planting_date: z.string().optional(),
  expected_harvest_date: z.string().optional(),
  status: z.string().optional(),
  health_status: z.string().optional(),
  user_id: z.string().optional(),
  notes: z.string().optional(),
});

export type NewFarmFormData = z.infer<typeof NewFarmSchema>;

export interface DashboardResponse {
  no_of_farm: number;
  no_of_users: number;
  overall_no_of_tests: number;
  farm_health_summary: {
    healthy: number;
    poor: number;
    average: number;
  };
  farm_lists: {
    farm_name: string;
    farm_health: string;
    soil_pH: number | null;
    nutrient: string;
    size: string;
    moisture: number | null;
  }[];
}

export interface GetAllFarmResponse {
  total_farms: number;
  amount_of_healthy_farms: number;
  amount_of_average_farms: number;
  amount_of_poor_farms: number;
  list_of_farm: Farm[];
}

export interface FarmDetails {
  id: number;
  name: string;
  location: {
    latitude: null | number;
    longitude: null | number;
    state: string;
    lga: string;
    physical_address: string;
  };
  size_hectares: string;
  crop_type: string;
  planting_date: null | string;
  expected_harvest_date: null | string;
  status: string;
  health_status: string;
  notes: null | string;
  farmer: {
    id: number;
    name: string;
    email: string;
    phone: null | string;
  };
  organisation: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}
