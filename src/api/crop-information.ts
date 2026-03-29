import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/api/api-client";
import type {
  ClimateAnalysisData,
  ClimateDashboardRes,
  CropCalendarDashboardRes,
  CropInformationDashboardResponse,
  WeatherAnalysisData,
  WeatherDashboardRes,
} from "@/models/crop-information.model";

export const useGetCropInformationDashboard = () => {
  return useQuery({
    queryKey: ["crop-information-dashboard"],
    queryFn: async () => {
      const { data } = await apiClient.get<CropInformationDashboardResponse>(
        "/crop-information/dashboard",
      );
      return data;
    },
  });
};

export const useGetWeatherDashboard = () => {
  return useQuery({
    queryKey: ["weather-dashboard"],
    queryFn: async () => {
      const { data } = await apiClient.get<WeatherDashboardRes>(
        "/crop-information/weather/dashboard",
      );
      return data;
    },
  });
};

export const useGetClimateDashboard = () => {
  return useQuery({
    queryKey: ["climate-dashboard"],
    queryFn: async () => {
      const { data } = await apiClient.get<ClimateDashboardRes>(
        "/crop-information/climate/dashboard",
      );
      return data;
    },
  });
};

export const useGetCropCalendarDashboard = () => {
  return useQuery({
    queryKey: ["crop-calendar-dashboard"],
    queryFn: async () => {
      const { data } = await apiClient.get<CropCalendarDashboardRes>(
        "/crop-information/crop-calendar/dashboard",
      );
      return data;
    },
  });
};

export const useFetchWeatherAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (farmId: string) => {
      const { data } = await apiClient.post<WeatherAnalysisData>(
        "/crop-information/weather/fetch",
        { farmId },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["crop-information-dashboard"],
      });
      queryClient.invalidateQueries({ queryKey: ["weather-dashboard"] });
    },
  });
};

export const useFetchClimateAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (farmId: string) => {
      const { data } = await apiClient.post<ClimateAnalysisData>(
        "/crop-information/climate/fetch",
        { farmId },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["crop-information-dashboard"],
      });
      queryClient.invalidateQueries({ queryKey: ["climate-dashboard"] });
    },
  });
};

export const useFetchCropCalendarAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (farmId: string) => {
      const { data } = await apiClient.post(
        "/crop-information/crop-calendar/fetch",
        { farmId },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["crop-information-dashboard"],
      });
      queryClient.invalidateQueries({ queryKey: ["crop-calendar-dashboard"] });
    },
  });
};

export const useRenameCropInformationAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: { id: string; name: string }) => {
      const { data: res } = await apiClient.patch(
        `/crop-information/${req.id}/name`,
        { name: req.name },
      );
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["crop-information-dashboard"],
      });
      queryClient.invalidateQueries({ queryKey: ["weather-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["climate-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["crop-calendar-dashboard"] });
    },
  });
};

export const useDeleteCropInformationAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: res } = await apiClient.delete(`/crop-information/${id}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["crop-information-dashboard"],
      });
      queryClient.invalidateQueries({ queryKey: ["weather-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["climate-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["crop-calendar-dashboard"] });
    },
  });
};

export const useGetCropInformationAnalysis = (
  id: string,
  isDisabled?: boolean,
) => {
  return useQuery({
    queryKey: ["crop-information-analysis", id],
    queryFn: async () => {
      const { data } = await apiClient.get<
        WeatherAnalysisData | ClimateAnalysisData
      >(`/crop-information/${id}`);
      return data;
    },
    enabled: !isDisabled,
  });
};
