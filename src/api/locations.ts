import { useQuery } from "@tanstack/react-query";
import apiClient from "./api-client";
import type { Location } from "@/models/location.model";

export const useLocations = (country?: string) => {
  return useQuery({
    queryKey: ["locations", country],
    queryFn: async () => {
      const { data } = await apiClient.get<{ items: Location[] }>(
        "/locations/nigerian-cities",
        { params: { country: country } },
      );
      return data.items;
    },
  });
};
