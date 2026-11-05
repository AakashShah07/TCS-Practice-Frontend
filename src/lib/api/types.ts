// Coding question types
export interface CodingQuestionSummary {
  _id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  source: string;
  createdAt: string;
}

export interface CodingSolution {
  approach: string;
  code: string;
  language: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface CodingExample {
  input: string;
  output: string;
  explanation: string;
}

export interface CodingQuestion extends CodingQuestionSummary {
  description: string;
  constraints: string[];
  examples: CodingExample[];
  bruteForce: CodingSolution;
  optimal: CodingSolution;
  isActive: boolean;
  updatedAt: string;
}

export interface CodingTopicCount {
  topic: string;
  count: number;
}

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
  isPremium: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  data: User;
  accessToken: string;
  refreshToken: string;
  /** Backend-issued session id (sid also embedded in the JWTs). Not a secret — never displayed. */
  sessionId?: string;
}

export type Section = "numerical" | "reasoning" | "verbal" | "advanced";

export type TestType = "section_test" | "full_mock" | "topic_practice";

// ── Grouped / media question support ──────────────────────────────────────
export type MediaType = "image" | "chart" | "table";

export type QuestionType = "mcq" | "image_mcq";

export type QuestionGroupType =
  | "data_interpretation"
  | "reading_comprehension"
  | "image_based"
  | "table_based"
  | "case_study";

/** Structured table data (optional — backend currently only sends url/alt). */
export interface MediaTableData {
  columns: string[];
  rows: (string | number)[][];
}

/** Structured chart data (optional — backend currently only sends url/alt). */
export interface MediaChartSeries {
  key: string;
  label?: string;
  color?: string;
}

export interface MediaChartData {
  kind: "bar" | "line" | "pie";
  data: Record<string, string | number>[];
  xKey?: string;
  yKey?: string;
  series?: MediaChartSeries[];
  nameKey?: string;
  valueKey?: string;
}

export interface Media {
  type: MediaType;
  url?: string;
  alt?: string;
  /** Optional structured table (rendered when present instead of an image). */
  table?: MediaTableData;
  /** Optional structured chart (rendered when present instead of an image). */
  chart?: MediaChartData;
}

export interface Stimulus {
  text?: string;
  media?: Media | null;
}

export interface QuestionGroup {
  id: string;
  title: string;
  type: QuestionGroupType;
  section?: Section;
  topic?: string;
  difficulty?: "easy" | "medium" | "hard";
  stimulus: Stimulus;
  questionIds: string[];
}

export type QuestionMode = "standalone" | "grouped" | "mixed";

export interface Question {
  _id: string;
  text: string;
  options: string[];
  correctAnswer?: number; // hidden during exam, present in review
  section: Section;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  explanation?: string;
  questionType?: QuestionType;
  media?: Media | null;
  groupId?: string | null;
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
  isPremium?: boolean;
  selectionMode?: "auto" | "fixed" | "random";
  questions?: Question[];
  groups?: string[];
  questionMode?: QuestionMode;
  questionGroups?: QuestionGroup[];
  createdAt: string;
}

// Attempt types
export interface AttemptResponse {
  _id: string;
  question: string;
  selectedAnswer: number | null;
  status: "not_visited" | "not_answered" | "answered" | "marked_for_review";
  markedForReview?: boolean;
  timeSpent: number;
}

export interface AttemptResponsePopulated {
  question: Question;
  selectedAnswer: number | null;
  status: "not_visited" | "not_answered" | "answered" | "marked_for_review";
  markedForReview?: boolean;
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
  questionMode?: QuestionMode;
  questionGroups?: QuestionGroup[];
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
  markedForReview?: boolean;
  timeSpent: number;
}

export interface ReviewResponse {
  score: number;
  totalQuestions: number;
  percentage: number;
  questionMode?: QuestionMode;
  questionGroups?: QuestionGroup[];
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
