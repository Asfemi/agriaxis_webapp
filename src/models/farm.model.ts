import { z } from "zod";

export interface Farm {
  id: string;
  farmName: string;
  size: number;
  location: string;
  status: string;
  dateCreated: string;
  soilPh: number;
  moisture: number;
  nutrient: string;
  tests: FarmTest[];
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
  user_id: z.number().optional(),
  notes: z.string().optional(),
})

export type NewFarmFormData = z.infer<typeof NewFarmSchema>;
