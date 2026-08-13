import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/api/api-client";
import type {
  ProvideAnswerRequest,
  ProvideAnswerResponse,
  Question,
} from "@/models/feedback.model";

export type FeedbackTag =
  | "general"
  | "soil_test"
  | "crop_health"
  | "yield_estimation"
  | "crop_information"
  | "disease_detection";

export const useGetQuestions = (tag: FeedbackTag = "general") => {
  return useQuery({
    queryKey: ["feedback-questions", tag],
    queryFn: async () => {
      const { data } = await apiClient.get<{ questions: Question[] }>(
        "/feedback/questions",
        {
          params: { tag },
        },
      );
      return data.questions;
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
