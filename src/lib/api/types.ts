// Base API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
  total?: number;
  pages?: number;
  currentPage?: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  data: User;
  accessToken: string;
  refreshToken: string;
}

export type Section = "numerical" | "reasoning" | "verbal" | "advanced";

export type TestType = "section_test" | "full_mock" | "topic_practice";

export interface Question {
  _id: string;
  text: string;
  options: string[];
  correctAnswer?: number; // hidden during exam, present in review
  section: Section;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  explanation?: string;
}

export interface Test {
  _id: string;
  title: string;
  type: TestType;
  section?: Section;
  topic?: string;
  totalQuestions: number;
  duration: number; // seconds
  sectionLocked: boolean;
  isActive: boolean;
  questions?: Question[];
  createdAt: string;
}

// Attempt types
export interface AttemptResponse {
  _id: string;
  question: string;
  selectedAnswer: number | null;
  status: "not_visited" | "not_answered" | "answered" | "marked_for_review";
  timeSpent: number;
}

export interface AttemptResponsePopulated {
  question: Question;
  selectedAnswer: number | null;
  status: "not_visited" | "not_answered" | "answered" | "marked_for_review";
  timeSpent: number;
}

export interface Attempt {
  _id: string;
  user: string;
  test: string;
  startedAt: string;
  duration: number;
  status: "in_progress" | "completed" | "abandoned";
  currentQuestion: number;
  currentSection?: string;
  tabSwitchCount: number;
  responses: AttemptResponse[];
}

export interface AttemptState {
  _id: string;
  test: Test;
  startedAt: string;
  duration: number;
  status: "in_progress" | "completed" | "abandoned";
  currentQuestion: number;
  currentSection?: string;
  tabSwitchCount: number;
  responses: AttemptResponsePopulated[];
}

// Result types
export interface SectionResult {
  section: Section;
  correct: number;
  wrong: number;
  skipped: number;
  total: number;
  accuracy: number;
  avgTimePerQuestion: number;
}

export interface TopicResult {
  topic: string;
  section: Section;
  correct: number;
  wrong: number;
  skipped: number;
  total: number;
  accuracy: number;
}

export interface QuestionDetail {
  question: string;
  selectedAnswer: number | null;
  correctAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

export interface TestResult {
  _id: string;
  user: string;
  test: {
    _id: string;
    title: string;
    type: TestType;
    section?: Section;
    duration: number;
  };
  score: number;
  totalQuestions: number;
  percentage: number;
  correct: number;
  wrong: number;
  skipped: number;
  timeTaken: number;
  sectionWise: SectionResult[];
  topicWise: TopicResult[];
  questionDetails: QuestionDetail[];
  createdAt: string;
}

export interface ReviewItem {
  question: Question;
  selectedAnswer: number | null;
  correctAnswer: number;
  timeSpent: number;
}

export interface ReviewResponse {
  score: number;
  totalQuestions: number;
  percentage: number;
  review: ReviewItem[];
}

export interface HistoryItem {
  _id: string;
  attempt: string;
  test: {
    _id: string;
    title: string;
    type: TestType;
    section?: Section;
  };
  score: number;
  totalQuestions: number;
  percentage: number;
  correct: number;
  wrong: number;
  skipped: number;
  timeTaken: number;
  createdAt: string;
}

// Analytics types
export interface DashboardAnalytics {
  totalTests: number;
  avgScore: number;
  avgAccuracy: number;
  totalTimeSpent: number;
  sectionPerformance: Record<
    string,
    {
      attempts: number;
      totalCorrect: number;
      totalQuestions: number;
      avgTimePerQ: number;
      totalTime: number;
    }
  >;
  lastUpdated: string;
}

export interface TopicStat {
  topic: string;
  attempts: number;
  correct: number;
  wrong: number;
  total: number;
  accuracy: number;
  confidence: "strong" | "medium" | "weak";
}

export interface TimeInsight {
  type: "overthinking" | "guessing";
  count: number;
  message: string;
  affectedTopics: string[];
}

export interface TimeAnalysisData {
  avgTimePerQuestion: number;
  totalQuestionsAnalyzed: number;
  insights: TimeInsight[];
}

export interface Recommendation {
  type: "revise" | "focus" | "strength" | "speed";
  priority: "high" | "medium" | "low";
  message: string;
  topic?: string;
  section?: string;
}

export interface TrendData {
  scoreHistory: {
    date: string;
    score: number;
    percentage: number;
    testType: string;
    testId: string;
  }[];
  currentAvgScore: number;
  currentAvgAccuracy: number;
  totalTests: number;
}
