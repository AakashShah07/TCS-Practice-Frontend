import apiClient from "./client";
import type {
  ApiResponse,
  TestResult,
  ReviewResponse,
  HistoryItem,
} from "./types";

export async function fetchResult(attemptId: string): Promise<TestResult> {
  const { data } = await apiClient.get<ApiResponse<TestResult>>(
    `/results/${attemptId}`
  );
  return data.data;
}

export async function fetchReview(
  attemptId: string
): Promise<ReviewResponse> {
  const { data } = await apiClient.get<ApiResponse<ReviewResponse>>(
    `/results/${attemptId}/review`
  );
  return data.data;
}

export async function fetchHistory(
  page = 1,
  limit = 10
): Promise<{ data: HistoryItem[]; total: number; pages: number }> {
  const { data } = await apiClient.get<
    ApiResponse<HistoryItem[]> & { total: number; pages: number }
  >(`/results/user/history?page=${page}&limit=${limit}`);
  return { data: data.data, total: data.total, pages: data.pages };
}
