import apiClient, { dedupeRequest } from "./client";
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

/**
 * Fetch only the four Infosys SE 2027 mock tests via the dedicated backend
 * endpoint. This avoids fetching the full test collection (223+ records).
 * Request is deduplicated so concurrent calls (e.g. React Strict Mode
 * double-mount) share a single network request.
 */
export async function fetchInfosysMocks(): Promise<Test[]> {
  const { data } = await dedupeRequest(
    "/tests/infosys-2027/mocks",
    () => apiClient.get<ApiResponse<Test[]>>("/tests/infosys-2027/mocks")
  );
  return data.data;
}