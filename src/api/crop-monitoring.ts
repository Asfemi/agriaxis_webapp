import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/api-client";
import type { CropMonitoringDashboardResponse } from "@/models/crop-monitoring.model";

export const useGetCropMonitoringDashboard = () => {
  return useQuery({
    queryKey: ["crop-monitoring-dashboard"],
    queryFn: async () => {
      const { data } = await apiClient.get<CropMonitoringDashboardResponse>("/crop-monitoring/dashboard");
      return data;
    },
  });
};
