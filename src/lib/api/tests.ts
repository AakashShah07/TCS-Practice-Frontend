import apiClient from "./client";
import type { TestListItem, Test } from "./types";

export async function fetchTests(): Promise<TestListItem[]> {
  const { data } = await apiClient.get<TestListItem[]>("/tests");
  return data;
}

export async function fetchTestById(testId: string): Promise<Test> {
  const { data } = await apiClient.get<Test>(`/tests/${testId}`);
  return data;
}

export async function fetchTestsByType(
  type: "foundation" | "advanced" | "mock"
): Promise<TestListItem[]> {
  const { data } = await apiClient.get<TestListItem[]>(`/tests?type=${type}`);
  return data;
}

export async function fetchTestsBySection(
  section: string
): Promise<TestListItem[]> {
  const { data } = await apiClient.get<TestListItem[]>(
    `/tests?section=${section}`
  );
  return data;
}
