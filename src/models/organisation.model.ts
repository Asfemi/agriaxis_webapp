import { z } from "zod";

export const OrganisationSchema = z.object({
  id: z.string().optional(),
  organisation_name: z
    .string()
    .min(2, "Organisation name must be at least 2 characters"),
  organisation_type: z.string().min(1, "Organisation type is required"),
  registration_number: z.string().min(1, "Registration number is required"),
  number_of_farms_to_be_monitored: z
    .number()
    .min(1, "Number of farms to be monitored is required"),
  country: z.string().optional(),
  state: z.string().min(1, "State is required"),
  city: z.string().optional(),
  local_government_area: z.string().optional(),
  address: z.string().min(1, "Address is required"),
});

export type OrganisationFormData = z.infer<typeof OrganisationSchema>;

export interface OrganisationState {
  formData: OrganisationFormData;
  errors: Partial<Record<keyof OrganisationFormData, string>>;
  updateFormData: (newData: Partial<OrganisationFormData>) => void;
  validateStep: (fields: (keyof OrganisationFormData)[]) => boolean;
  resetForm: () => void;
}

export interface Organisation {
  id: string;
  name: string;
  slug: string;
  description: null | string;
  type: string;
  type_label: string;
  registration_number: string;
  contact_person: {
    name: string;
    email: string;
    phone: null | string;
  };
  address: {
    state: string;
    lga: string;
    physical_address: string;
  };
  expected_farmers_count: null | number;
  expected_farms_count: null | number;
  email_verified: boolean;
  email_verified_at: null | string;
  created_at: string;
  updated_at: string;
  role: null;
  joined_at: string;
}
