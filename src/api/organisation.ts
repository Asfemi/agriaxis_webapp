import type { OrganisationFormData } from "@/models/organisation.model";
import apiClient from "./api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetOrganisationQuery = () => {
  return useQuery({
    queryKey: ["organisation"],
    queryFn: async () => {
      const response = await apiClient.get("/organisations");
      return response.data;
    },
  });
};

export const useCreateOrganisationMutation = () => {
  return useMutation({
    mutationFn: async (data: OrganisationFormData) => {
      const response = await apiClient.post("/organisations/setup", data);
      return response.data;
    },
  });
};

export const useEditOrganisationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: OrganisationFormData;
    }) => {
      const response = await apiClient.put(`/organisations/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organisation"] });
    },
  });
};
