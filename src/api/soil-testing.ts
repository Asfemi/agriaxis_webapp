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

/**
 * @deprecated
 * @param hectares
 * @returns
 */
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

/**
 * @deprecated
 * @returns
 */
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

/**
 * @deprecated
 * @returns
 */
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
  return useMutation({
    mutationFn: async (data: SoilTestingRunRequest) => {
      const response = await apiClient.post<SoilTestingResult>(
        "/soil-testing/run",
        data,
      );
      return response.data;
    },
  });
};

export const useSoilTestingRecommendation = (id: string) => {
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

export const useSoilTestingResults = () => {
  return useQuery({
    queryKey: ["soil-testing-results"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ items: SoilTestingResult[] }>(
        "/soil-testing/results",
      );
      return data.items;
    },
  });
};

/**
 * @deprecated
 */
export const useGetSoilTestingResultByName = (name: string) => {
  return useQuery({
    queryKey: ["soil-testing-result", name],
    queryFn: async () => {
      const { data } = await apiClient.get<SoilTestingResult>(
        `/soil-testing/results/by-name/${name}`,
      );
      return data;
    },
  });
};

export const useGetSoilTestingResultById = (id: string) => {
  return useQuery({
    queryKey: ["soil-testing-result", id],
    queryFn: async () => {
      const { data } = await apiClient.get<SoilTestingResult>(
        `/soil-testing/results/${id}`,
      );
      return data;
    },
  });
};

export const useDeleteSoilTestingResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/soil-testing/results/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["soil-testing-results"] });
    },
  });
};

interface RenameResultRequest {
  id: string;
  name: string;
}

export const useRenameSoilTestingResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: RenameResultRequest) => {
      const { data } = await apiClient.patch(
        `/soil-testing/results/${request.id}/name`,
        { name: request.name },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["soil-testing-results"] });
    },
  });
};
