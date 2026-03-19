import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/api/api-client";
import type { CropMonitoringDashboardResponse, CropMonitoringDiseaseDetectResponse } from "@/models/crop-monitoring.model";

export const useGetCropMonitoringDashboard = () => {
  return useQuery({
    queryKey: ["crop-monitoring-dashboard"],
    queryFn: async () => {
      const { data } = await apiClient.get<CropMonitoringDashboardResponse>(
        "/crop-monitoring/dashboard",
      );
      return data;
    },
  });
};

export const useCropMonitoringDiseaseDetect = () => {
  return useMutation({
    mutationFn: async ({ name, image, farmId }: { name: string; image: File, farmId: string }) => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);
      formData.append("farmId", farmId)

      const { data } = await apiClient.post<CropMonitoringDiseaseDetectResponse>(
        "/crop-monitoring/disease/detect",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return data;
    },
  });
};
