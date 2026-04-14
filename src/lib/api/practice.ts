import apiClient from "./client";
import type { ApiResponse, Test } from "./types";

export async function fetchPracticeTests(params?: {
  section?: string;
  topic?: string;
}): Promise<Test[]> {
  const query = new URLSearchParams();
  query.set("type", "topic_practice");
  if (params?.section) query.set("section", params.section);
  if (params?.topic) query.set("topic", params.topic);
  const { data } = await apiClient.get<ApiResponse<Test[]>>(
    `/tests?${query.toString()}`
  );
  return data.data;
}
