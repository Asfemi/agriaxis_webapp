import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import apiClient from "@/api/api-client";
import type {
  SoilTestingDashboard,
  SoilTestingPaymentRequest,
  SoilTestingPaymentInitialiseRequest,
  SoilTestingPaymentInitialiseResponse,
} from "@/models/soil-testing-model";

export const useSoilTestingDashboard = () => {
  return useSuspenseQuery({
    queryKey: ["soil-testing-dashboard"],
    queryFn: async () => {
      const { data } = await apiClient.get<SoilTestingDashboard>(
        "/soil-testing/dashboard",
      );
      return data;
    },
  });
};

export const useSoilTestingCost = (hectares: number) => {
  return useQuery({
    queryKey: ["soil-testing-cost", hectares],
    queryFn: async () => {
      const { data } = await apiClient.get<{
        amount: number;
        hectares: number;
      }>("/soil-testing/cost", { params: { hectares } });
      return data;
    },
    enabled: hectares > 0,
  });
};

export const useSoilTestingPaymentInitialise = () => {
  return useMutation({
    mutationFn: async (request: SoilTestingPaymentInitialiseRequest) => {
      const response = await apiClient.post<SoilTestingPaymentInitialiseResponse>(
        "/soil-testing/payments/flutterwave/initialize",
        request,
      );
      return response.data;
    },
  });
};

export const useSoilTestingPayment = () => {
  return useMutation({
    mutationFn: async (request: SoilTestingPaymentRequest) => {
      const response = await apiClient.post(
        "/soil-testing/payments/flutterwave",
        request,
      );
      return response.data;
    },
  });
};
