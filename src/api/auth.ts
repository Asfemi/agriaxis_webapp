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
      const response = await apiClient.post("/login", data);
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
      const response = await apiClient.post("/register", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

export const fetchMe = async () => {
  const { data } = await apiClient.get<{ user: User }>("/me");
  return data.user;
};

// 2. Define Query Options (Best practice for sharing logic)
export const meQueryOptions = () => queryOptions({
  queryKey: ["me"],
  queryFn: fetchMe,
  staleTime: 1000 * 60 * 5, // 5 minutes
});

// 3. Keep your hook for components
export const useMe = () => {
  return useQuery(meQueryOptions());
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const reponse = await apiClient.post("/logout");
      return reponse.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      localStorage.removeItem("auth_token");
      window.location.href = "/signin";
    },
  });
};

export const useForgotPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { email?: string; phone?: string }) => {
      const response = await apiClient.post("/forgot-password", data);
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
      const response = await apiClient.post("/verify-otp", data);
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
      const response = await apiClient.post("/verify-otp", data);
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
      const response = await apiClient.post("/reset-password", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
    }
  })
}
