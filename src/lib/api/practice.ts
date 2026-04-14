import apiClient from "./client";
import type { Topic, Question } from "./types";

export async function fetchTopics(): Promise<Topic[]> {
  const { data } = await apiClient.get<Topic[]>("/practice/topics");
  return data;
}

export async function fetchTopicQuestions(
  topicId: string
): Promise<Question[]> {
  const { data } = await apiClient.get<Question[]>(
    `/practice/topics/${topicId}/questions`
  );
  return data;
}
