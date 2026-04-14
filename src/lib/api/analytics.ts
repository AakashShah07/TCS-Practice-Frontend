import apiClient from "./client";
import type { AnalyticsData } from "./types";

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const { data } = await apiClient.get<AnalyticsData>("/analytics");
  return data;
}
