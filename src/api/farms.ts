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

export const useUpdateFarm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
    }: {
      id: string;
      name: string;
    }) => {
      const { data } = await apiClient.put(`/farms/${encodeURIComponent(id)}`, {
        name,
      });
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["farms"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["farm", variables.id] });
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

export const useGetFarm = (id: string) => {
  return useSuspenseQuery({
    queryKey: ["farm", id],
    queryFn: async () => {
      const { data } = await apiClient.get<FarmDetails>(`/farms/${id}`);
      return data;
    },
  });
};
