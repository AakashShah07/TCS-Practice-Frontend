import apiClient from "./client";
import type { AuthResponse, User, ApiResponse } from "./types";

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return data;
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", {
    name,
    email,
    password,
  });
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>("/auth/me");
  return data.data;
}

export async function refreshToken(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const { data } = await apiClient.post("/auth/refresh", { refreshToken });
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}
