import apiClient from "./client";
import type {
  ApiResponse,
  DashboardAnalytics,
  TopicStat,
  TimeAnalysisData,
  Recommendation,
  TrendData,
} from "./types";

export async function fetchDashboardAnalytics(): Promise<DashboardAnalytics> {
  const { data } = await apiClient.get<ApiResponse<DashboardAnalytics>>(
    "/analytics/dashboard"
  );
  return data.data;
}

export async function fetchSectionAnalytics(section: string) {
  const { data } = await apiClient.get<
    ApiResponse<{
      section: string;
      attempts: number;
      totalCorrect: number;
      totalQuestions: number;
      avgTimePerQ: number;
      accuracy: number;
      topicBreakdown: TopicStat[];
    }>
  >(`/analytics/section/${section}`);
  return data.data;
}

export async function fetchTopicStats(): Promise<TopicStat[]> {
  const { data } = await apiClient.get<ApiResponse<TopicStat[]>>(
    "/analytics/topics"
  );
  return data.data;
}

export async function fetchTimeAnalysis(): Promise<TimeAnalysisData> {
  const { data } = await apiClient.get<ApiResponse<TimeAnalysisData>>(
    "/analytics/time-analysis"
  );
  return data.data;
}

export async function fetchRecommendations(): Promise<Recommendation[]> {
  const { data } = await apiClient.get<ApiResponse<Recommendation[]>>(
    "/analytics/recommendations"
  );
  return data.data;
}

export async function fetchTrends(): Promise<TrendData> {
  const { data } = await apiClient.get<ApiResponse<TrendData>>(
    "/analytics/trends"
  );
  return data.data;
}
