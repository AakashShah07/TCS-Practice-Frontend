import apiClient from "./client";
import type { ApiResponse, Test } from "./types";

export async function fetchTests(params?: {
  type?: string;
  section?: string;
}): Promise<Test[]> {
  const query = new URLSearchParams();
  if (params?.type) query.set("type", params.type);
  if (params?.section) query.set("section", params.section);
  const qs = query.toString();
  const { data } = await apiClient.get<ApiResponse<Test[]>>(
    `/tests${qs ? `?${qs}` : ""}`
  );
  return data.data;
}

export async function fetchTestById(testId: string): Promise<Test> {
  const { data } = await apiClient.get<ApiResponse<Test>>(`/tests/${testId}`);
  return data.data;
}