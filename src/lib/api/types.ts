export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  topic: string;
  section: Section;
  difficulty: "easy" | "medium" | "hard";
}

export type Section =
  | "numerical"
  | "logical"
  | "verbal"
  | "advanced";

export interface Test {
  id: string;
  title: string;
  description: string;
  type: "foundation" | "advanced" | "mock";
  section?: Section;
  totalQuestions: number;
  duration: number; // in seconds
  questions: Question[];
}

export interface TestListItem {
  id: string;
  title: string;
  description: string;
  type: "foundation" | "advanced" | "mock";
  section?: Section;
  totalQuestions: number;
  duration: number;
}

export interface Answer {
  questionId: string;
  selectedOption: number | null;
  timeSpent: number; // seconds spent on this question
}

export interface TestSubmission {
  testId: string;
  answers: Record<string, Answer>;
  totalTimeTaken: number;
  startedAt: string;
  submittedAt: string;
}

export interface TestResult {
  id: string;
  testId: string;
  testTitle: string;
  score: number;
  totalQuestions: number;
  correct: number;
  wrong: number;
  skipped: number;
  timeTaken: number;
  percentage: number;
  submittedAt: string;
  sectionWise: SectionResult[];
  questionResults: QuestionResult[];
}

export interface SectionResult {
  section: Section;
  correct: number;
  wrong: number;
  skipped: number;
  total: number;
  accuracy: number;
  avgTimePerQuestion: number;
  weakTopics: string[];
}

export interface QuestionResult {
  questionId: string;
  text: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer: number | null;
  isCorrect: boolean;
  timeSpent: number;
  topic: string;
  section: Section;
  explanation?: string;
}

export interface DashboardStats {
  testsCompleted: number;
  averageScore: number;
  questionsSolved: number;
  totalTimePracticed: number; // seconds
  recentTests: RecentTest[];
}

export interface RecentTest {
  id: string;
  testTitle: string;
  score: number;
  percentage: number;
  date: string;
}

export interface Topic {
  id: string;
  name: string;
  section: Section;
  questionCount: number;
  accuracy?: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface TopicStat {
  topic: string;
  section: Section;
  accuracy: number;
  attempts: number;
  confidence: "strong" | "moderate" | "weak";
  avgTime: number;
}

export interface AnalyticsData {
  averageScore: number;
  totalTests: number;
  accuracyRate: number;
  totalTimePracticed: number;
  scoreHistory: { date: string; score: number }[];
  accuracyHistory: { date: string; accuracy: number }[];
  sectionPerformance: {
    section: Section;
    accuracy: number;
    testsCount: number;
    improvement: number;
  }[];
  topicStats: TopicStat[];
  strongTopics: string[];
  weakTopics: string[];
  recommendations: Recommendation[];
}

export interface Recommendation {
  id: string;
  type: "revise" | "practice" | "focus" | "speed";
  message: string;
  topic?: string;
  section?: Section;
  priority: "high" | "medium" | "low";
}
