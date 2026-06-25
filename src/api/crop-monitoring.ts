import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/api/api-client";
import type {
  CropHealthHistory,
  CropMonitoringDashboardResponse,
  CropMonitoringDiseaseDetectResponse,
  DiseaseDetectionHistory,
  YieldEstimation,
} from "@/models/crop-monitoring.model";

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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      image,
      farmId,
    }: {
      name: string;
      image: File;
      farmId: string;
    }) => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);
      formData.append("farmId", farmId);

      const { data } =
        await apiClient.post<CropMonitoringDiseaseDetectResponse>(
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["crop-monitoring-dashboard"],
      });
      queryClient.invalidateQueries({
        queryKey: ["crop-monitoring-disease-detect-history"],
      });
    },
  });
};

export const useCropHealth = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (farmId: string) => {
      const { data } = await apiClient.post<CropHealthHistory>(
        "/crop-monitoring/crop-health/fetch",
        { farmId },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["crop-monitoring-dashboard"],
      });
      queryClient.invalidateQueries({ queryKey: ["crop-health-history"] });
    },
  });
};

export const useGetCropHealthHistory = () => {
  return useQuery({
    queryKey: ["crop-health-history"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ items: CropHealthHistory[] }>(
        "/crop-monitoring/crop-health/history",
      );
      return data.items;
    },
  });
};

export const useDeleteCropHealthResult = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(
        `/crop-monitoring/crop-health/${id}`,
      );
      return data;
    },
  });
};

export const useRenameCropHealthResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: { id: string; name: string }) => {
      const { data } = await apiClient.patch(
        `/crop-monitoring/crop-health/${req.id}/name`,
        { name: req.name },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crop-health-history"] });
      queryClient.invalidateQueries({
        queryKey: ["crop-monitoring-dashboard"],
      });
    },
  });
};

export const useGetDiseaseDetectionHistory = () => {
  return useQuery({
    queryKey: ["crop-monitoring-disease-detect-history"],
    queryFn: async () => {
      const { data } = await apiClient.get<{
        items: DiseaseDetectionHistory[];
      }>("/crop-monitoring/disease/history");
      return data.items;
    },
  });
};

export const useRenameDiseaseDetectionResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: { id: string; name: string }) => {
      const { data } = await apiClient.patch(
        `/crop-monitoring/disease/${req.id}/name`,
        { name: req.name },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["crop-monitoring-disease-detect-history"],
      });
      queryClient.invalidateQueries({
        queryKey: ["crop-monitoring-dashboard"],
      });
    },
  });
};

export const useDeleteDiseaseDetectionResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/crop-monitoring/disease/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["crop-monitoring-disease-detect-history"],
      });
      queryClient.invalidateQueries({
        queryKey: ["crop-monitoring-dashboard"],
      });
    },
  });
};

export const useGetYieldEstimationHistory = (
  id?: string,
  isDisabled?: boolean,
) => {
  return useQuery({
    queryKey: ["yield-estimation-history"],
    queryFn: async () => {
      const { data } = await apiClient.get<{
        items: YieldEstimation[];
      }>("/crop-monitoring/yield-estimation/history", {
        params: { farm_id: id },
      });
      return data.items;
    },
    enabled: !isDisabled,
  });
};

export const useEstimateCropYield = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (farmId: string) => {
      const { data } = await apiClient.post<YieldEstimation>(
        "/crop-monitoring/yield-estimation/estimate",
        { farm_id: farmId },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["yield-estimation-history"],
      });
    },
  });
};

export const useRenameYieldEstimationResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: { id: string; name: string }) => {
      const { data } = await apiClient.patch(
        `/crop-monitoring/yield-estimation/${req.id}/name`,
        { name: req.name },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["yield-estimation-history"],
      });
    },
  });
};

export const useDeleteYieldEstimationResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(
        `/crop-monitoring/yield-estimation/${id}`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["yield-estimation-history"],
      });
    },
  });
};
