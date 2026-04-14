import apiClient from "./client";
import type { TestResult } from "./types";

export async function fetchResult(resultId: string): Promise<TestResult> {
  const { data } = await apiClient.get<TestResult>(`/results/${resultId}`);
  return data;
}

export async function fetchAllResults(): Promise<TestResult[]> {
  const { data } = await apiClient.get<TestResult[]>("/results");
  return data;
}
