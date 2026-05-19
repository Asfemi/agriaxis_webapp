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
  farm_name: z.string().optional(),
  farm_size: z.string().optional(),
  size_number: z.number().optional(),
  size_unit: z.string().optional(),
  coordinatesCsv: z.string().optional(),
  crop_type: z.array(z.string()).optional(),
  other_crop_type: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  lga: z.string().optional(),
  address: z.string().optional(),
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
  farm_name: string;
  size: string;
  location: string;
  status: string;
  result_summation: {
    soil_ph: 0;
    moisture: string;
    nutrient: string;
    total_no_of_tests: number;
  };
  list_test_results: any[];

  // crop_type: string;
  // planting_date: null | string;
  // expected_harvest_date: null | string;
  // health_status: string;
  // notes: null | string;
  // farmer: {
  //   id: number;
  //   name: string;
  //   email: string;
  //   phone: null | string;
  // };
  // organisation: {
  //   id: number;
  //   name: string;
  // };
  // created_at: string;
  // updated_at: string;
}
