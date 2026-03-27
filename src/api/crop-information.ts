import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/api-client";
import type { CropInformationDashboardResponse } from "@/models/crop-information.model";

export const useGetCropInformationDashboard = () => {
  return useQuery({
    queryKey: ["crop-information-dashboard"],
    queryFn: async () => {
      const { data } = await apiClient.get<CropInformationDashboardResponse>("/crop-information/dashboard");
      return data;
    },
  });
};
