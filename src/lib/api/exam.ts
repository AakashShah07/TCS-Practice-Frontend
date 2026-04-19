import apiClient from "./client";
import type { ApiResponse, Attempt, AttemptState } from "./types";

export async function startAttempt(
  testId: string,
  forceNew = false
): Promise<Attempt> {
  const { data } = await apiClient.post<ApiResponse<Attempt>>(
    `/attempts/start/${testId}`,
    { forceNew }
  );
  return data.data;
}

export async function getAttemptState(
  attemptId: string
): Promise<AttemptState> {
  const { data } = await apiClient.get<ApiResponse<AttemptState>>(
    `/attempts/${attemptId}/state`
  );
  return data.data;
}

export async function saveAnswer(
  attemptId: string,
  questionIndex: number,
  selectedAnswer: number,
  timeSpent: number
): Promise<void> {
  await apiClient.put(`/attempts/${attemptId}/answer`, {
    questionIndex,
    selectedAnswer,
    timeSpent,
  });
}

export async function markForReview(
  attemptId: string,
  questionIndex: number
): Promise<void> {
  await apiClient.put(`/attempts/${attemptId}/mark-review`, {
    questionIndex,
  });
}

export async function clearResponse(
  attemptId: string,
  questionIndex: number
): Promise<void> {
  await apiClient.put(`/attempts/${attemptId}/clear`, {
    questionIndex,
  });
}

export async function navigate(
  attemptId: string,
  currentQuestion: number,
  previousQuestion: number,
  timeSpent: number,
  currentSection?: string
): Promise<void> {
  await apiClient.put(`/attempts/${attemptId}/navigate`, {
    currentQuestion,
    previousQuestion,
    timeSpent,
    currentSection,
  });
}

export async function recordTabSwitch(
  attemptId: string
): Promise<{ tabSwitchCount: number }> {
  const { data } = await apiClient.put<
    ApiResponse<{ tabSwitchCount: number }>
  >(`/attempts/${attemptId}/tab-switch`);
  return data.data;
}

export async function submitAttempt(attemptId: string): Promise<{
  attempt: { _id: string; status: string; submittedAt: string };
  result: {
    _id: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    correct: number;
    wrong: number;
    skipped: number;
    timeTaken: number;
  };
}> {
  const { data } = await apiClient.post<
    ApiResponse<{
      attempt: { _id: string; status: string; submittedAt: string };
      result: {
        _id: string;
        score: number;
        totalQuestions: number;
        percentage: number;
        correct: number;
        wrong: number;
        skipped: number;
        timeTaken: number;
      };
    }>
  >(`/attempts/${attemptId}/submit`);
  return data.data;
}
