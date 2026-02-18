import { useQuery } from "@tanstack/react-query";
import apiClient from "./api-client";
import type { Location } from "@/models/location.model";

export const useLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Location[] }>("/locations");
      return data.data;
    },
  })
}
