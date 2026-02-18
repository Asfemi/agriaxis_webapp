import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import apiClient from "@/api/api-client";
import type {
  SoilTestingDashboard,
  SoilTestingPaymentRequest,
  SoilTestingPaymentInitialiseRequest,
  SoilTestingPaymentInitialiseResponse,
  SoilTestingUploadRequest,
  SoilTestingRunRequest,
  SoilTestingResult,
  SoilTestingRecommendationResponse,
} from "@/models/soil-testing.model";

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
      const response =
        await apiClient.post<SoilTestingPaymentInitialiseResponse>(
          "/soil-testing/payments/flutterwave/initialize",
          request,
        );
      return response.data;
    },
  });
};

export const useSoilTestingPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: SoilTestingPaymentRequest) => {
      const response = await apiClient.post(
        "/soil-testing/payments/flutterwave",
        request,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["soil-testing-dashboard"] });
    },
  });
};

export const useSoilTestingUpload = () => {
  return useMutation({
    mutationFn: async (data: SoilTestingUploadRequest) => {
      const response = await apiClient.post("/soil-testing/farm/upload", data);
      return response.data;
    },
  });
};

export const useSoilTestingRun = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SoilTestingRunRequest) => {
      const response = await apiClient.post<SoilTestingResult>(
        "/soil-testing/run",
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["soil-testing-dashboard"] });
    },
  });
};

export const useSoilTestingRecommendation = (id: number) => {
  return useQuery({
    queryKey: ["soil-testing-recommendation", id],
    queryFn: async () => {
      const { data } = await apiClient.get<SoilTestingRecommendationResponse>(
        `/soil-testing/results/${id}/recommendation`,
      );
      return data;
    },
    enabled: !!id,
  });
};

export const useSoilTestingResults = (farmId?: string) => {
  return useQuery({
    queryKey: ["soil-testing-results", farmId],
    queryFn: async () => {
      const { data } = await apiClient.get<SoilTestingResult[]>(
        "/soil-testing/results",
        { params: { farmId } },
      );
      return data;
    },
  });
};
