import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import apiClient from "@/api/api-client";
import type {
  DashboardResponse,
  FarmDetails,
  GetAllFarmResponse,
  NewFarmFormData,
} from "@/models/farm.model";

export const useGetAllFarms = () => {
  return useQuery({
    queryKey: ["farms"],
    queryFn: async () => {
      const { data } = await apiClient.get<GetAllFarmResponse>("/farms");
      return data;
    },
  });
};

export const useCreateFarm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (farm: NewFarmFormData) => {
      const { data } = await apiClient.post("/farms/simple", farm);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useGetDashboard = () => {
  return useSuspenseQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardResponse>("/dashboard");
      return data;
    },
  });
};

export const useGetFarm = (id: number) => {
  return useSuspenseQuery({
    queryKey: ["farm", id], 
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: FarmDetails }>(
        `/org/farms/${id}`,
      );
      return data.data; 
    },
  });
};
