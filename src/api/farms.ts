import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "./api-client";
import type { NewFarmFormData } from "@/models/farm.model";

export const useGetAllFarms = () => {
  return useQuery({
    queryKey: ["farms"],
    queryFn: async () => {
      const { data } = await apiClient.get("/org/farms");
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
