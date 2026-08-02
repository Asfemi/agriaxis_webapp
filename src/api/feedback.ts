import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/api/api-client";
import type {
  ProvideAnswerRequest,
  ProvideAnswerResponse,
  Question,
} from "@/models/feedback.model";

export const useGetQuestions = (
  tag:
    | "general"
    | " soil_test"
    | " crop_health"
    | " yield_estimation"
    | " crop_information"
    | " disease_detection",
) => {
  return useQuery({
    queryKey: ["feedback-questions"],
    queryFn: async () => {
      const { data } = await apiClient.get<Question[]>("/feedback/questions", {
        params: { tag },
      });
      return data;
    },
  });
};

export const useProvideAnswer = () => {
  return useMutation({
    mutationFn: async (request: ProvideAnswerRequest) => {
      const { data } = await apiClient.post<ProvideAnswerResponse>(
        "/feedback/answers",
        request,
      );
      return data;
    },
  });
};
