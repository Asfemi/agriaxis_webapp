import type { RegistrationFormData } from "@/models/registration.schema";
import type { LoginFormData, LoginResponse } from "@/models/login.schema";
import apiClient from "@/api/api-client";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/models/user.model";
import type { ForgotPasswordFormData } from "@/models/forgot-password.schema";

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiClient.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data: LoginResponse) => {
      queryClient.invalidateQueries();
      localStorage.setItem("auth_token", data.token);
      window.location.href = "/dashboard";
    },
  });
};

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      const payload = { ...data, name: `${data.first_name} ${data.last_name}` };
      const response = await apiClient.post("/auth/register", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

const fetchMe = async () => {
  const { data } = await apiClient.get<{ user: User }>("/auth/me");
  return data.user;
};

export const meQueryOptions = () => queryOptions({
  queryKey: ["me"],
  queryFn: fetchMe,
});

export const useMe = () => {
  return useQuery(meQueryOptions());
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const reponse = await apiClient.post("/auth/logout");
      return reponse.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      localStorage.clear();
      window.location.href = "/signin";
    },
  });
};

export const useForgotPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { email?: string; phone?: string }) => {
      const response = await apiClient.post("/auth/forgot-password", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

export const useVerifyOtpMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { otp: string; email: string }) => {
      const response = await apiClient.post("/auth/verify-otp", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};


export const useForgotPasswordOTPMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { otp: string; email: string }) => {
      const response = await apiClient.post("/auth/verify-otp", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

export const useResetPasswordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      const response = await apiClient.post("/auth/reset-password", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
    }
  })
}
