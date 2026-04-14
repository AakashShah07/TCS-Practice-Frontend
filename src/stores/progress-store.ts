"use client";

import { create } from "zustand";
import type {
  DashboardAnalytics,
  TopicStat,
  Recommendation,
  TrendData,
  TimeAnalysisData,
  HistoryItem,
} from "@/lib/api/types";

interface ProgressState {
  dashboard: DashboardAnalytics | null;
  topicStats: TopicStat[];
  recommendations: Recommendation[];
  trends: TrendData | null;
  timeAnalysis: TimeAnalysisData | null;
  history: HistoryItem[];
  isLoading: boolean;
  setDashboard: (data: DashboardAnalytics) => void;
  setTopicStats: (data: TopicStat[]) => void;
  setRecommendations: (data: Recommendation[]) => void;
  setTrends: (data: TrendData) => void;
  setTimeAnalysis: (data: TimeAnalysisData) => void;
  setHistory: (data: HistoryItem[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  dashboard: null,
  topicStats: [],
  recommendations: [],
  trends: null,
  timeAnalysis: null,
  history: [],
  isLoading: false,
  setDashboard: (data) => set({ dashboard: data }),
  setTopicStats: (data) => set({ topicStats: data }),
  setRecommendations: (data) => set({ recommendations: data }),
  setTrends: (data) => set({ trends: data }),
  setTimeAnalysis: (data) => set({ timeAnalysis: data }),
  setHistory: (data) => set({ history: data }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
