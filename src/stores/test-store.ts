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
  questionEnteredAt: number;
  isPaused: boolean;
  sectionLocked: boolean; // whether sections are locked (full mock = true)
  submittedSections: Section[]; // sections that have been submitted

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
    sectionLocked?: boolean;
  }) => void;
  setAnswer: (index: number, selectedAnswer: number) => void;
  clearAnswer: (index: number) => void;
  markForReview: (index: number) => void;
  goToQuestion: (index: number) => number;
  nextQuestion: () => number;
  prevQuestion: () => number;
  setSection: (section: Section) => number;
  submitSection: (section: Section) => void;
  isSectionAccessible: (section: Section) => boolean;
  isLastQuestionInSection: () => boolean;
  getNextSection: () => Section | null;
  decrementTimer: () => void;
  setSubmitted: () => void;
  incrementTabSwitch: () => void;
  getStatus: (index: number) => QuestionStatus;
  getAnsweredCount: () => number;
  togglePause: () => void;
  resetTest: () => void;
  attemptDead: boolean;
  setAttemptDead: () => void;
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
  isPaused: false,
  sectionLocked: false,
  submittedSections: [] as Section[],
  attemptDead: false,
};

const EXAM_BACKUP_KEY = "exam_backup";

function backupToLocalStorage(state: {
  attemptId: string | null;
  testId: string | null;
  responses: ResponseState[];
  currentQuestionIndex: number;
  currentSection: Section;
  timer: number;
  tabSwitchCount: number;
}) {
  if (!state.attemptId) return;
  try {
    localStorage.setItem(
      EXAM_BACKUP_KEY,
      JSON.stringify({
        attemptId: state.attemptId,
        testId: state.testId,
        responses: state.responses,
        currentQuestionIndex: state.currentQuestionIndex,
        currentSection: state.currentSection,
        timer: state.timer,
        tabSwitchCount: state.tabSwitchCount,
        savedAt: Date.now(),
      })
    );
  } catch {
    // localStorage full or unavailable — ignore
  }
}

export function getExamBackup() {
  try {
    const raw = localStorage.getItem(EXAM_BACKUP_KEY);
    if (!raw) return null;
    const backup = JSON.parse(raw) as {
      attemptId: string;
      testId: string;
      responses: ResponseState[];
      currentQuestionIndex: number;
      currentSection: Section;
      timer: number;
      tabSwitchCount: number;
      savedAt: number;
    };
    // Discard backups older than 4 hours
    if (Date.now() - backup.savedAt > 4 * 60 * 60 * 1000) {
      localStorage.removeItem(EXAM_BACKUP_KEY);
      return null;
    }
    return backup;
  } catch {
    return null;
  }
}

export function clearExamBackup() {
  localStorage.removeItem(EXAM_BACKUP_KEY);
}

export const useTestStore = create<TestState>((set, get) => ({
  ...initialState,

  initTest: (params) => {
    const defaultResponses = params.questions.map(() => ({
      selectedAnswer: null,
      status: "not_visited" as QuestionStatus,
      timeSpent: 0,
    }));

    const responses = params.responses || defaultResponses;
    const currentIdx = params.currentQuestion || 0;
    if (responses[currentIdx] && responses[currentIdx].status === "not_visited") {
      responses[currentIdx].status = "not_answered";
    }

    const firstSection = params.questions[currentIdx]?.section || "numerical";

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
      sectionLocked: params.sectionLocked ?? false,
      submittedSections: [],
    });
  },

  setAnswer: (index, selectedAnswer) => {
    const responses = [...get().responses];
    if (responses[index]) {
      responses[index] = { ...responses[index], selectedAnswer, status: "answered" };
      set({ responses });
      backupToLocalStorage(get());
    }
  },

  clearAnswer: (index) => {
    const responses = [...get().responses];
    if (responses[index]) {
      responses[index] = { ...responses[index], selectedAnswer: null, status: "not_answered" };
      set({ responses });
      backupToLocalStorage(get());
    }
  },

  markForReview: (index) => {
    const responses = [...get().responses];
    if (responses[index]) {
      responses[index] = { ...responses[index], status: "marked_for_review" };
      set({ responses });
      backupToLocalStorage(get());
    }
  },

  goToQuestion: (index) => {
    const { currentQuestionIndex, responses, questions, questionEnteredAt, sectionLocked, currentSection, submittedSections, sections } = get();
    if (index < 0 || index >= questions.length) return 0;

    // If section locked, block navigation to other sections unless they are the current unlocked one
    if (sectionLocked) {
      const targetSection = questions[index].section;
      if (targetSection !== currentSection) {
        // Can't navigate to a different section by clicking questions
        return 0;
      }
    }

    const timeSpent = Math.floor((Date.now() - questionEnteredAt) / 1000);

    const updatedResponses = [...responses];
    if (updatedResponses[currentQuestionIndex]) {
      updatedResponses[currentQuestionIndex] = {
        ...updatedResponses[currentQuestionIndex],
        timeSpent: updatedResponses[currentQuestionIndex].timeSpent + timeSpent,
      };
    }

    if (updatedResponses[index] && updatedResponses[index].status === "not_visited") {
      updatedResponses[index] = { ...updatedResponses[index], status: "not_answered" };
    }

    set({
      responses: updatedResponses,
      currentQuestionIndex: index,
      currentSection: questions[index].section,
      questionEnteredAt: Date.now(),
    });

    backupToLocalStorage(get());
    return timeSpent;
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions, sectionLocked, sections, currentSection } = get();

    // If section locked, don't go past section end
    if (sectionLocked) {
      const sectionInfo = sections.find((s) => s.name === currentSection);
      if (sectionInfo && currentQuestionIndex >= sectionInfo.endIndex) {
        return 0; // At end of section, can't go further
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      return get().goToQuestion(currentQuestionIndex + 1);
    }
    return 0;
  },

  prevQuestion: () => {
    const { currentQuestionIndex, sectionLocked, sections, currentSection } = get();

    // If section locked, don't go before section start
    if (sectionLocked) {
      const sectionInfo = sections.find((s) => s.name === currentSection);
      if (sectionInfo && currentQuestionIndex <= sectionInfo.startIndex) {
        return 0;
      }
    }

    if (currentQuestionIndex > 0) {
      return get().goToQuestion(currentQuestionIndex - 1);
    }
    return 0;
  },

  setSection: (section) => {
    const { sections, sectionLocked, submittedSections, currentSection } = get();

    // If locked, only allow moving to the section if it's accessible
    if (sectionLocked && !get().isSectionAccessible(section)) {
      return 0;
    }

    const sectionInfo = sections.find((s) => s.name === section);
    if (sectionInfo) {
      // Update currentSection directly since goToQuestion checks target === current
      set({ currentSection: section });
      return get().goToQuestion(sectionInfo.startIndex);
    }
    return 0;
  },

  submitSection: (section) => {
    const { submittedSections, sections, questions } = get();
    if (submittedSections.includes(section)) return;

    const updated = [...submittedSections, section];
    set({ submittedSections: updated });

    // Find next section and navigate to it
    const sectionIndex = sections.findIndex((s) => s.name === section);
    const nextSec = sections[sectionIndex + 1];
    if (nextSec) {
      set({ currentSection: nextSec.name });
      // Mark first question of next section as visited
      const responses = [...get().responses];
      if (responses[nextSec.startIndex] && responses[nextSec.startIndex].status === "not_visited") {
        responses[nextSec.startIndex] = { ...responses[nextSec.startIndex], status: "not_answered" };
      }
      set({
        responses,
        currentQuestionIndex: nextSec.startIndex,
        currentSection: nextSec.name,
        questionEnteredAt: Date.now(),
      });
    }
  },

  isSectionAccessible: (section) => {
    const { sectionLocked, submittedSections, sections, currentSection } = get();
    if (!sectionLocked) return true;

    // Current section is always accessible
    if (section === currentSection) return true;

    // Already submitted sections are not accessible (locked after submit)
    if (submittedSections.includes(section)) return false;

    // The section is accessible only if all previous sections are submitted
    const sectionIndex = sections.findIndex((s) => s.name === section);
    for (let i = 0; i < sectionIndex; i++) {
      if (!submittedSections.includes(sections[i].name)) return false;
    }
    return true;
  },

  isLastQuestionInSection: () => {
    const { currentQuestionIndex, sections, currentSection } = get();
    const sectionInfo = sections.find((s) => s.name === currentSection);
    if (!sectionInfo) return false;
    return currentQuestionIndex === sectionInfo.endIndex;
  },

  getNextSection: () => {
    const { sections, currentSection } = get();
    const idx = sections.findIndex((s) => s.name === currentSection);
    if (idx >= 0 && idx < sections.length - 1) {
      return sections[idx + 1].name;
    }
    return null;
  },

  decrementTimer: () => {
    const { timer } = get();
    if (timer > 0) set({ timer: timer - 1 });
  },

  setSubmitted: () => {
    set({ isSubmitted: true });
    clearExamBackup();
  },

  incrementTabSwitch: () => set({ tabSwitchCount: get().tabSwitchCount + 1 }),

  getStatus: (index) => {
    return get().responses[index]?.status || "not_visited";
  },

  getAnsweredCount: () => {
    return get().responses.filter((r) => r.status === "answered").length;
  },

  togglePause: () => set({ isPaused: !get().isPaused }),

  setAttemptDead: () => set({ attemptDead: true }),

  resetTest: () => {
    clearExamBackup();
    set(initialState);
  },
}));
