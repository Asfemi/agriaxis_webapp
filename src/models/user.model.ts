import type { Organisation } from "@/models/organisation.model";
import { z } from "zod";

export interface User {
  id: string;
  name: string;
  organisations: Organisation[];
  created_at: string;
  updated_at: string;
  email_verified_at: string | null;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  date_created: string;
}

export interface UserSummary {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  date_joined: string;
}

export const NewUserSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  email: z.email("Invalid email address"),
  phone_number: z.string().min(8, "Phone number is required"),
  role: z.string().min(2, "User role is required"),
});

export type NewUser = z.infer<typeof NewUserSchema>;
