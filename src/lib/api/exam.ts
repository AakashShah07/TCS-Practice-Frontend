import apiClient from "./client";
import type { Test, TestSubmission, TestResult } from "./types";

export async function startExam(testId: string): Promise<Test> {
  const { data } = await apiClient.post<Test>(`/exams/${testId}/start`);
  return data;
}

export async function submitExam(
  submission: TestSubmission
): Promise<TestResult> {
  const { data } = await apiClient.post<TestResult>(
    `/exams/${submission.testId}/submit`,
    submission
  );
  return data;
}
