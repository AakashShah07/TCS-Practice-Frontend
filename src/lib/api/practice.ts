import apiClient from "./client";
import type { ApiResponse, Question } from "./types";

export interface TopicInfo {
  topic: string;
  totalQuestions: number;
  easy: number;
  medium: number;
  hard: number;
}

export interface GeneratedPracticeTest {
  testId: string;
  title: string;
  totalQuestions: number;
  duration: number;
  questions: Question[];
}

export async function fetchTopicsWithCounts(
  section: string
): Promise<TopicInfo[]> {
  const { data } = await apiClient.get<
    ApiResponse<TopicInfo[]> & { section: string }
  >(`/tests/topics/${section}`);
  return data.data;
}

export async function fetchPracticeQuestions(
  section: string,
  topic: string,
  params?: { difficulty?: string; limit?: number }
): Promise<Question[]> {
  const query = new URLSearchParams();
  if (params?.difficulty) query.set("difficulty", params.difficulty);
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  const { data } = await apiClient.get<ApiResponse<Question[]>>(
    `/tests/practice/${section}/${encodeURIComponent(topic)}${qs ? `?${qs}` : ""}`
  );
  return data.data;
}

export async function generatePracticeTest(params: {
  section: string;
  topic: string;
  difficulty?: string;
  numberOfQuestions?: number;
}): Promise<GeneratedPracticeTest> {
  const { data } = await apiClient.post<ApiResponse<GeneratedPracticeTest>>(
    "/tests/generate-practice",
    params
  );
  return data.data;
}
