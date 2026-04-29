import apiClient from "./client";
import type {
  ApiResponse,
  CodingQuestionSummary,
  CodingQuestion,
  CodingTopicCount,
} from "./types";

export async function fetchCodingQuestions(params?: {
  difficulty?: string;
  topic?: string;
}): Promise<CodingQuestionSummary[]> {
  const query = new URLSearchParams();
  if (params?.difficulty) query.set("difficulty", params.difficulty);
  if (params?.topic) query.set("topic", params.topic);
  const qs = query.toString();
  const { data } = await apiClient.get<ApiResponse<CodingQuestionSummary[]>>(
    `/coding${qs ? `?${qs}` : ""}`
  );
  return data.data;
}

export async function fetchCodingTopics(): Promise<CodingTopicCount[]> {
  const { data } = await apiClient.get<ApiResponse<CodingTopicCount[]>>(
    "/coding/topics"
  );
  return data.data;
}

export async function fetchCodingQuestion(
  id: string
): Promise<CodingQuestion> {
  const { data } = await apiClient.get<ApiResponse<CodingQuestion>>(
    `/coding/${id}`
  );
  return data.data;
}
