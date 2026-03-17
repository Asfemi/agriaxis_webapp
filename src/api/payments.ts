import { useQuery } from "@tanstack/react-query";
import apiClient from "./api-client";

/**
 * @description Get cost (price to pay) for a service, Returns total cost in Naira for the given service. Used by soil-testing, crop-monitoring, and other payment flows. Provide service name and service-specific params (e.g. hectares/acres for soil-testing).
 * @param {string} service - Service name: soil-testing, crop-monitoring, etc.
 * @param {number} hectares - Area in hectares (for soil-testing)
 */
export const useGetCost = (service: string, hectares: number) => {
  return useQuery({
    queryKey: ["cost", service, hectares],
    queryFn: async () => {
      const response = await apiClient.get<{
        amount: number;
        service: string;
        hectares: number;
      }>("/payments/cost", { params: { service, hectares } });
      return response.data;
    },
  });
};
