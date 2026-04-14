"use client";

import { create } from "zustand";
import type { Question, Section, Answer } from "@/lib/api/types";

interface TestState {
  testId: string | null;
  questions: Question[];
  sections: { name: Section; startIndex: number; endIndex: number }[];
  currentQuestionIndex: number;
  currentSection: Section;
  answers: Record<string, Answer>;
  visited: Record<string, boolean>;
  markedForReview: Record<string, boolean>;
  timer: number; // seconds remaining
  totalDuration: number;
  startedAt: string | null;
  isSubmitted: boolean;
  tabSwitchCount: number;

  // Actions
  initTest: (testId: string, questions: Question[], duration: number, sections: { name: Section; startIndex: number; endIndex: number }[]) => void;
  setAnswer: (questionId: string, selectedOption: number) => void;
  clearAnswer: (questionId: string) => void;
  markForReview: (questionId: string) => void;
  unmarkForReview: (questionId: string) => void;
  visitQuestion: (questionId: string) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  setSection: (section: Section) => void;
  decrementTimer: () => void;
  setSubmitted: () => void;
  incrementTabSwitch: () => void;
  updateTimeSpent: (questionId: string, time: number) => void;
  resetTest: () => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: (testId: string) => boolean;
}

const initialState = {
  testId: null,
  questions: [],
  sections: [],
  currentQuestionIndex: 0,
  currentSection: "numerical" as Section,
  answers: {},
  visited: {},
  markedForReview: {},
  timer: 0,
  totalDuration: 0,
  startedAt: null,
  isSubmitted: false,
  tabSwitchCount: 0,
};

export const useTestStore = create<TestState>((set, get) => ({
  ...initialState,

  initTest: (testId, questions, duration, sections) => {
    const firstQuestion = questions[0];
    set({
      testId,
      questions,
      sections,
      currentQuestionIndex: 0,
      currentSection: firstQuestion?.section || "numerical",
      answers: {},
      visited: firstQuestion ? { [firstQuestion.id]: true } : {},
      markedForReview: {},
      timer: duration,
      totalDuration: duration,
      startedAt: new Date().toISOString(),
      isSubmitted: false,
      tabSwitchCount: 0,
    });
  },

  setAnswer: (questionId, selectedOption) => {
    const { answers } = get();
    const existing = answers[questionId];
    set({
      answers: {
        ...answers,
        [questionId]: {
          questionId,
          selectedOption,
          timeSpent: existing?.timeSpent || 0,
        },
      },
    });
    get().saveToLocalStorage();
  },

  clearAnswer: (questionId) => {
    const { answers } = get();
    set({
      answers: {
        ...answers,
        [questionId]: {
          questionId,
          selectedOption: null,
          timeSpent: answers[questionId]?.timeSpent || 0,
        },
      },
    });
    get().saveToLocalStorage();
  },

  markForReview: (questionId) => {
    set({ markedForReview: { ...get().markedForReview, [questionId]: true } });
    get().saveToLocalStorage();
  },

  unmarkForReview: (questionId) => {
    const updated = { ...get().markedForReview };
    delete updated[questionId];
    set({ markedForReview: updated });
    get().saveToLocalStorage();
  },

  visitQuestion: (questionId) => {
    set({ visited: { ...get().visited, [questionId]: true } });
    get().saveToLocalStorage();
  },

  goToQuestion: (index) => {
    const { questions } = get();
    if (index >= 0 && index < questions.length) {
      const question = questions[index];
      set({
        currentQuestionIndex: index,
        currentSection: question.section,
        visited: { ...get().visited, [question.id]: true },
      });
      get().saveToLocalStorage();
    }
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      get().goToQuestion(currentQuestionIndex + 1);
    }
  },

  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      get().goToQuestion(currentQuestionIndex - 1);
    }
  },

  setSection: (section) => {
    const { sections, questions } = get();
    const sectionInfo = sections.find((s) => s.name === section);
    if (sectionInfo) {
      const question = questions[sectionInfo.startIndex];
      set({
        currentSection: section,
        currentQuestionIndex: sectionInfo.startIndex,
        visited: { ...get().visited, [question.id]: true },
      });
      get().saveToLocalStorage();
    }
  },

  decrementTimer: () => {
    const { timer } = get();
    if (timer > 0) {
      set({ timer: timer - 1 });
    }
  },

  setSubmitted: () => {
    set({ isSubmitted: true });
    if (typeof window !== "undefined") {
      localStorage.removeItem(`test_state_${get().testId}`);
    }
  },

  incrementTabSwitch: () => {
    set({ tabSwitchCount: get().tabSwitchCount + 1 });
  },

  updateTimeSpent: (questionId, time) => {
    const { answers } = get();
    const existing = answers[questionId];
    set({
      answers: {
        ...answers,
        [questionId]: {
          questionId,
          selectedOption: existing?.selectedOption ?? null,
          timeSpent: (existing?.timeSpent || 0) + time,
        },
      },
    });
  },

  resetTest: () => set(initialState),

  saveToLocalStorage: () => {
    if (typeof window === "undefined") return;
    const state = get();
    const saveData = {
      testId: state.testId,
      currentQuestionIndex: state.currentQuestionIndex,
      currentSection: state.currentSection,
      answers: state.answers,
      visited: state.visited,
      markedForReview: state.markedForReview,
      timer: state.timer,
      totalDuration: state.totalDuration,
      startedAt: state.startedAt,
      tabSwitchCount: state.tabSwitchCount,
    };
    localStorage.setItem(`test_state_${state.testId}`, JSON.stringify(saveData));
  },

  loadFromLocalStorage: (testId) => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem(`test_state_${testId}`);
    if (!saved) return false;
    try {
      const data = JSON.parse(saved);
      set({
        currentQuestionIndex: data.currentQuestionIndex,
        currentSection: data.currentSection,
        answers: data.answers,
        visited: data.visited,
        markedForReview: data.markedForReview,
        timer: data.timer,
        totalDuration: data.totalDuration,
        startedAt: data.startedAt,
        tabSwitchCount: data.tabSwitchCount,
      });
      return true;
    } catch {
      return false;
    }
  },
}));
