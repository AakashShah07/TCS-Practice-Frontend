"use client";

import { create } from "zustand";
import type { DashboardStats, AnalyticsData } from "@/lib/api/types";

interface ProgressState {
  dashboardStats: DashboardStats | null;
  analyticsData: AnalyticsData | null;
  isLoadingDashboard: boolean;
  isLoadingAnalytics: boolean;
  setDashboardStats: (stats: DashboardStats) => void;
  setAnalyticsData: (data: AnalyticsData) => void;
  setLoadingDashboard: (loading: boolean) => void;
  setLoadingAnalytics: (loading: boolean) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  dashboardStats: null,
  analyticsData: null,
  isLoadingDashboard: false,
  isLoadingAnalytics: false,

  setDashboardStats: (stats) => set({ dashboardStats: stats }),
  setAnalyticsData: (data) => set({ analyticsData: data }),
  setLoadingDashboard: (loading) => set({ isLoadingDashboard: loading }),
  setLoadingAnalytics: (loading) => set({ isLoadingAnalytics: loading }),
}));
