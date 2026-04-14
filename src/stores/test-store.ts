"use client";

import { create } from "zustand";
import type { Question, Section } from "@/lib/api/types";

export type QuestionStatus =
  | "not_visited"
  | "not_answered"
  | "answered"
  | "marked_for_review";

interface ResponseState {
  selectedAnswer: number | null;
  status: QuestionStatus;
  timeSpent: number;
}

interface TestState {
  attemptId: string | null;
  testId: string | null;
  testTitle: string;
  questions: Question[];
  sections: { name: Section; startIndex: number; endIndex: number }[];
  currentQuestionIndex: number;
  currentSection: Section;
  responses: ResponseState[];
  timer: number;
  totalDuration: number;
  startedAt: string | null;
  isSubmitted: boolean;
  tabSwitchCount: number;
  questionEnteredAt: number; // timestamp when user entered current question

  // Actions
  initTest: (params: {
    attemptId: string;
    testId: string;
    testTitle: string;
    questions: Question[];
    duration: number;
    sections: { name: Section; startIndex: number; endIndex: number }[];
    responses?: ResponseState[];
    currentQuestion?: number;
    tabSwitchCount?: number;
    timer?: number;
  }) => void;
  setAnswer: (index: number, selectedAnswer: number) => void;
  clearAnswer: (index: number) => void;
  markForReview: (index: number) => void;
  goToQuestion: (index: number) => number; // returns time spent on previous question
  nextQuestion: () => number;
  prevQuestion: () => number;
  setSection: (section: Section) => number;
  decrementTimer: () => void;
  setSubmitted: () => void;
  incrementTabSwitch: () => void;
  getStatus: (index: number) => QuestionStatus;
  getAnsweredCount: () => number;
  resetTest: () => void;
}

const initialState = {
  attemptId: null,
  testId: null,
  testTitle: "",
  questions: [],
  sections: [],
  currentQuestionIndex: 0,
  currentSection: "numerical" as Section,
  responses: [],
  timer: 0,
  totalDuration: 0,
  startedAt: null,
  isSubmitted: false,
  tabSwitchCount: 0,
  questionEnteredAt: Date.now(),
};

export const useTestStore = create<TestState>((set, get) => ({
  ...initialState,

  initTest: (params) => {
    const defaultResponses = params.questions.map(() => ({
      selectedAnswer: null,
      status: "not_visited" as QuestionStatus,
      timeSpent: 0,
    }));

    // Mark first question as visited
    const responses = params.responses || defaultResponses;
    const currentIdx = params.currentQuestion || 0;
    if (responses[currentIdx] && responses[currentIdx].status === "not_visited") {
      responses[currentIdx].status = "not_answered";
    }

    const firstSection =
      params.questions[currentIdx]?.section || "numerical";

    set({
      attemptId: params.attemptId,
      testId: params.testId,
      testTitle: params.testTitle,
      questions: params.questions,
      sections: params.sections,
      currentQuestionIndex: currentIdx,
      currentSection: firstSection,
      responses,
      timer: params.timer ?? params.duration,
      totalDuration: params.duration,
      startedAt: new Date().toISOString(),
      isSubmitted: false,
      tabSwitchCount: params.tabSwitchCount || 0,
      questionEnteredAt: Date.now(),
    });
  },

  setAnswer: (index, selectedAnswer) => {
    const responses = [...get().responses];
    if (responses[index]) {
      responses[index] = {
        ...responses[index],
        selectedAnswer,
        status: "answered",
      };
      set({ responses });
    }
  },

  clearAnswer: (index) => {
    const responses = [...get().responses];
    if (responses[index]) {
      responses[index] = {
        ...responses[index],
        selectedAnswer: null,
        status: "not_answered",
      };
      set({ responses });
    }
  },

  markForReview: (index) => {
    const responses = [...get().responses];
    if (responses[index]) {
      responses[index] = {
        ...responses[index],
        status: "marked_for_review",
      };
      set({ responses });
    }
  },

  goToQuestion: (index) => {
    const { currentQuestionIndex, responses, questions, questionEnteredAt } =
      get();
    if (index < 0 || index >= questions.length) return 0;

    // Calculate time spent on previous question
    const timeSpent = Math.floor((Date.now() - questionEnteredAt) / 1000);

    // Update time on current question
    const updatedResponses = [...responses];
    if (updatedResponses[currentQuestionIndex]) {
      updatedResponses[currentQuestionIndex] = {
        ...updatedResponses[currentQuestionIndex],
        timeSpent:
          updatedResponses[currentQuestionIndex].timeSpent + timeSpent,
      };
    }

    // Mark new question as visited
    if (
      updatedResponses[index] &&
      updatedResponses[index].status === "not_visited"
    ) {
      updatedResponses[index] = {
        ...updatedResponses[index],
        status: "not_answered",
      };
    }

    set({
      responses: updatedResponses,
      currentQuestionIndex: index,
      currentSection: questions[index].section,
      questionEnteredAt: Date.now(),
    });

    return timeSpent;
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      return get().goToQuestion(currentQuestionIndex + 1);
    }
    return 0;
  },

  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      return get().goToQuestion(currentQuestionIndex - 1);
    }
    return 0;
  },

  setSection: (section) => {
    const { sections, questions, currentQuestionIndex } = get();
    const sectionInfo = sections.find((s) => s.name === section);
    if (sectionInfo) {
      return get().goToQuestion(sectionInfo.startIndex);
    }
    return 0;
  },

  decrementTimer: () => {
    const { timer } = get();
    if (timer > 0) set({ timer: timer - 1 });
  },

  setSubmitted: () => set({ isSubmitted: true }),

  incrementTabSwitch: () =>
    set({ tabSwitchCount: get().tabSwitchCount + 1 }),

  getStatus: (index) => {
    const { responses } = get();
    return responses[index]?.status || "not_visited";
  },

  getAnsweredCount: () => {
    return get().responses.filter((r) => r.status === "answered").length;
  },

  resetTest: () => set(initialState),
}));
