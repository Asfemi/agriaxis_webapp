import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import apiClient from "@/api/api-client";
import type { NewUser, UserSummary } from "@/models/user.model";

export const useGetUsers = () => {
  return useSuspenseQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await apiClient.get<UserSummary[]>("/users");
      return data;
    },
  });
};

export const useAddUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: NewUser) => {
      const response = await apiClient.post("/add-user", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
