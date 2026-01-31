import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import apiClient from "@/api/api-client";
import type { DashboardResponse, GetAllFarmResponse, NewFarmFormData } from "@/models/farm.model";

export const useGetAllFarms = () => {
  return useQuery({
    queryKey: ["farms"],
    queryFn: async () => {
      const { data } = await apiClient.get<GetAllFarmResponse>("/org/farms");
      return data;
    },
  })
}

export const useCreateFarm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (farm: NewFarmFormData) => {
      const { data } = await apiClient.post("/org/farms", farm);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms"] });
    },
  })
}

export const useGetDashboard = () => {
  return useSuspenseQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardResponse>("/dashboard");
      return data;
    }
  })
}
