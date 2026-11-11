import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ── Mocks ──────────────────────────────────────────────────────────────────
const saveAnswerMock = vi.fn();
const navigateMock = vi.fn();
const clearResponseMock = vi.fn();
const markForReviewMock = vi.fn();
const fetchReviewMock = vi.fn();

vi.mock("@/lib/api/exam", () => ({
  saveAnswer: (...args: unknown[]) => saveAnswerMock(...args),
  clearResponse: (...args: unknown[]) => clearResponseMock(...args),
  markForReview: (...args: unknown[]) => markForReviewMock(...args),
  navigate: (...args: unknown[]) => navigateMock(...args),
}));

vi.mock("@/lib/api/results", () => ({
  fetchReview: (...args: unknown[]) => fetchReviewMock(...args),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), warning: vi.fn(), success: vi.fn() },
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({ testId: "attempt-infosys" }),
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/exam/attempt-infosys",
}));

import QuestionPanel from "@/components/exam/QuestionPanel";
import QuestionPalette from "@/components/exam/QuestionPalette";
import SharedStimulus from "@/components/exam/SharedStimulus";
import ReviewPage from "@/app/(main)/results/[testId]/review/page";
import SectionPanel from "@/components/exam/SectionPanel";
import { useTestStore } from "@/stores/test-store";
import type { Question, QuestionGroup } from "@/lib/api/types";
import { INFOSYS_2027_MOCK_TEST_IDS } from "@/lib/infosys-mock-test";

const TARGET_TEST_ID = INFOSYS_2027_MOCK_TEST_IDS[0]; // 6aed76cf8a37b5232a789b6f
const OTHER_TEST_ID = "tcs-nqt-unrelated-mock";

// ── Fixtures mirror the real API response for the target test ─────────────
const DI_GROUP: QuestionGroup = {
  id: "6aed76cf8a37b5232a789b6e",
  title: "CrackNQT Mock — Fair Stalls Logic & Data Set",
  type: "data_interpretation",
  section: "reasoning",
  topic: "Data Interpretation",
  stimulus: {
    text: "DI STIMULUS: Anil sold Popcorn. Bhavna collected her earnings on Tuesday.",
  },
  questionIds: [
    "6aed76ce8a37b5232a789b69",
    "6aed76ce8a37b5232a789b6a",
    "6aed76ce8a37b5232a789b6b",
    "6aed76ce8a37b5232a789b6c",
    "6aed76ce8a37b5232a789b6d",
  ],
};

const DS_GROUP: QuestionGroup = {
  id: "6aedbaea8a37b5232a78a627",
  title: "Data Sufficiency Set",
  type: "data_sufficiency",
  section: "reasoning",
  topic: "Data Sufficiency",
  stimulus: {
    text: "DS INSTRUCTIONS: Decide whether each statement is sufficient to answer the question.",
  },
  questionIds: [
    "6aedbaea8a37b5232a78a622",
    "6aedbaea8a37b5232a78a623",
    "6aedbaea8a37b5232a78a624",
    "6aedbaea8a37b5232a78a625",
    "6aedbaea8a37b5232a78a626",
  ],
};

const SYLLOGISM_GROUP: QuestionGroup = {
  id: "6aedbaeb8a37b5232a78a62d",
  title: "Syllogism Set",
  type: "syllogism",
  section: "reasoning",
  topic: "Syllogism",
  stimulus: {
    text: "SYLLOGISM INSTRUCTIONS: Consider the statements and infer which conclusion follows.",
  },
  questionIds: [
    "6aedbaeb8a37b5232a78a628",
    "6aedbaeb8a37b5232a78a629",
    "6aedbaeb8a37b5232a78a62a",
    "6aedbaeb8a37b5232a78a62b",
    "6aedbaeb8a37b5232a78a62c",
  ],
};

const GROUPS = [DI_GROUP, DS_GROUP, SYLLOGISM_GROUP];

const sectionOf = (i: number): "reasoning" | "numerical" =>
  [15, 17, 18].includes(i) ? "numerical" : "reasoning";

const topicOf = (i: number): string =>
  i < 5 ? "Data Interpretation" : i < 10 ? "Data Sufficiency" : i < 15 ? "Syllogism"
  : i === 15 ? "Speed and Time" : i === 16 ? "Analogy" : i === 17 ? "Time and Work"
  : i === 18 ? "Ratio and Proportion" : "Word Arrangement";

const groupOf = (i: number): string | null =>
  i < 5 ? DI_GROUP.id : i < 10 ? DS_GROUP.id : i < 15 ? SYLLOGISM_GROUP.id : null;

const QUESTIONS: Question[] = Array.from({ length: 20 }, (_, i) => ({
  _id: `q-${i + 1}`,
  text: `Question ${i + 1} text`,
  options: ["Option A", "Option B", "Option C", "Option D", "Option E"].slice(0, i >= 15 ? 5 : 4),
  section: sectionOf(i),
  topic: topicOf(i),
  difficulty: "medium",
  groupId: groupOf(i),
  questionType: "mcq",
}));

const SECTIONS = [
  { name: "reasoning" as const, startIndex: 0, endIndex: 19 },
  { name: "numerical" as const, startIndex: 15, endIndex: 18 },
];

function seed(
  opts: { testId?: string; questions?: Question[]; groups?: QuestionGroup[]; startIndex?: number } = {}
) {
  const questions = opts.questions ?? QUESTIONS;
  const groups = opts.groups ?? GROUPS;
  const testId = opts.testId ?? TARGET_TEST_ID;
  useTestStore.getState().initTest({
    attemptId: "attempt-infosys",
    testId,
    testTitle: "CrackNQT Mock — Data Interpretation (Fair Stalls Logic Set)",
    testType: "topic_practice",
    questions,
    duration: 900,
    sections: SECTIONS,
    sectionLocked: false,
    questionGroups: groups,
    questionMode: "mixed",
  });
  if (opts.startIndex !== undefined && opts.startIndex !== 0) {
    useTestStore.getState().goToQuestion(opts.startIndex);
  }
}

const renderPanel = () => render(<QuestionPanel onSubmitTest={() => {}} />);
const renderPalette = () => render(<QuestionPalette />);

beforeEach(() => {
  saveAnswerMock.mockReset().mockResolvedValue(undefined);
  clearResponseMock.mockReset().mockResolvedValue(undefined);
  markForReviewMock.mockReset().mockResolvedValue(undefined);
  navigateMock.mockReset().mockResolvedValue(undefined);
  useTestStore.getState().resetTest();
});

// ── Sidebar behavior (target test) ─────────────────────────────────────────
describe("Infosys 2027 mock — sidebar", () => {
  it("shows all 20 questions with global numbering for the target test", () => {
    seed();
    renderPalette();
    for (let n = 1; n <= 20; n += 1) {
      expect(screen.getByRole("button", { name: String(n) })).toBeInTheDocument();
    }
    expect(screen.queryByRole("button", { name: "21" })).not.toBeInTheDocument();
  });

  it("keeps a stable heading even after moving into a numerical question", () => {
    seed({ startIndex: 17 });
    renderPalette();
    expect(screen.getByRole("heading", { name: "Questions" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Numerical" })).not.toBeInTheDocument();
  });

  it("adapts its count to the actual question array (not hardcoded to 20)", () => {
    seed({ questions: QUESTIONS.slice(0, 3), groups: [DI_GROUP] });
    renderPalette();
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "4" })).not.toBeInTheDocument();
  });

  it("navigates to the global question when a number is clicked", async () => {
    seed();
    renderPalette();
    await userEvent.click(screen.getByRole("button", { name: "18" }));
    expect(useTestStore.getState().currentQuestionIndex).toBe(17);
    expect(navigateMock).toHaveBeenCalledWith(
      "attempt-infosys",
      17,
      0,
      expect.any(Number),
      "numerical"
    );
  });

  it("highlights the active global question after jumping", () => {
    seed({ startIndex: 17 });
    renderPalette();
    const active = screen.getByRole("button", { name: "18" });
    expect(active.className).toContain("ring-indigo-600");
    expect(screen.getByRole("button", { name: "17" }).className).not.toContain("scale-110");
  });

  it("tracks answer and flag state against the global index", () => {
    seed({ startIndex: 17 });
    useTestStore.getState().setAnswer(17, 1);
    useTestStore.getState().markForReview(17);
    expect(useTestStore.getState().responses[17].status).toBe("answered");
    expect(useTestStore.getState().responses[17].selectedAnswer).toBe(1);
    expect(useTestStore.getState().responses[17].markedForReview).toBe(true);
    expect(useTestStore.getState().responses[16].status).toBe("not_visited");
  });
});

// ── Question numbering & grouped stimuli (target test) ─────────────────────
describe("Infosys 2027 mock — question numbering and grouped stimuli", () => {
  it("shows the global question number on Q18", () => {
    seed({ startIndex: 17 });
    renderPanel();
    expect(screen.getByText("Q18")).toBeInTheDocument();
    expect(screen.queryByText("Q3")).not.toBeInTheDocument();
  });

  it("renders the DI stimulus for Q1–Q5 via groupId resolution", () => {
    seed({ startIndex: 0 });
    renderPanel();
    expect(screen.getByTestId("shared-stimulus")).toBeInTheDocument();
    expect(screen.getByText(/DI STIMULUS/)).toBeInTheDocument();
  });

  it("renders the Data Sufficiency instructions for Q6–Q10", () => {
    seed({ startIndex: 5 });
    renderPanel();
    expect(screen.getByText(/DS INSTRUCTIONS/)).toBeInTheDocument();
    expect(screen.queryByText(/DI STIMULUS/)).not.toBeInTheDocument();
  });

  it("renders the Syllogism instructions for Q11–Q15", () => {
    seed({ startIndex: 10 });
    renderPanel();
    expect(screen.getByText(/SYLLOGISM INSTRUCTIONS/)).toBeInTheDocument();
  });

  it("switches stimuli cleanly when moving between groups (no stale content)", () => {
    seed({ startIndex: 4 });
    const { rerender } = renderPanel();
    expect(screen.getByText(/DI STIMULUS/)).toBeInTheDocument();
    useTestStore.getState().goToQuestion(5);
    rerender(<QuestionPanel onSubmitTest={() => {}} />);
    expect(screen.getByText(/DS INSTRUCTIONS/)).toBeInTheDocument();
    expect(screen.queryByText(/DI STIMULUS/)).not.toBeInTheDocument();
  });

  it("renders only the individual question for Q16–Q20 (no shared stimulus)", () => {
    seed({ startIndex: 15 });
    renderPanel();
    expect(screen.queryByTestId("shared-stimulus")).not.toBeInTheDocument();
    expect(screen.queryByText(/DI STIMULUS/)).not.toBeInTheDocument();
    expect(screen.queryByText(/DS INSTRUCTIONS/)).not.toBeInTheDocument();
    expect(screen.queryByText(/SYLLOGISM INSTRUCTIONS/)).not.toBeInTheDocument();
  });

  it("Next/Previous follow the canonical global order across group boundaries", () => {
    seed({ startIndex: 4 });
    useTestStore.getState().nextQuestion();
    expect(useTestStore.getState().currentQuestionIndex).toBe(5);
    useTestStore.getState().nextQuestion();
    expect(useTestStore.getState().currentQuestionIndex).toBe(6);
    useTestStore.getState().prevQuestion();
    expect(useTestStore.getState().currentQuestionIndex).toBe(5);
    useTestStore.getState().prevQuestion();
    expect(useTestStore.getState().currentQuestionIndex).toBe(4);
  });

  it("keeps answer and flag attached to the correct global question across navigation", () => {
    seed({ startIndex: 0 });
    useTestStore.getState().setAnswer(0, 1); // DI question 1
    useTestStore.getState().markForReview(0);
    useTestStore.getState().goToQuestion(5); // DS question 6
    useTestStore.getState().setAnswer(5, 2);
    const s = useTestStore.getState();
    expect(s.responses[0]).toMatchObject({ selectedAnswer: 1, markedForReview: true, status: "answered" });
    expect(s.responses[5]).toMatchObject({ selectedAnswer: 2, status: "answered" });
    expect(s.responses[1].status).toBe("not_visited");
  });
});

// ── Section tabs removed for the target test only ──────────────────────────
describe("Infosys 2027 mock — no section tabs", () => {
  it("renders no SectionPanel (no Reasoning/Numerical tabs) for the target test", () => {
    seed();
    const { container } = render(<SectionPanel />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText("Reasoning")).not.toBeInTheDocument();
    expect(screen.queryByText("Numerical")).not.toBeInTheDocument();
  });

  it("renders section tabs for other tests with multiple sections", () => {
    seed({ testId: OTHER_TEST_ID });
    render(<SectionPanel />);
    expect(screen.getByRole("button", { name: /Reasoning/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Numerical/ })).toBeInTheDocument();
  });
});

// ── Isolation: unrelated tests keep section-scoped behavior ────────────────
describe("Unrelated tests — unchanged behavior", () => {
  it("shows the section-scoped list for other tests", () => {
    seed({ testId: OTHER_TEST_ID, startIndex: 15 }); // numerical section (indices 15–18)
    renderPalette();
    // Section-scoped palette: 15..18 rendered as 1..4
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "18" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Numerical" })).toBeInTheDocument();
  });

  it("target-palette header disappears when section is not the target test", () => {
    seed({ testId: OTHER_TEST_ID, startIndex: 3 });
    renderPalette();
    expect(screen.getByRole("heading", { name: "Reasoning" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Questions" })).not.toBeInTheDocument();
  });
});

// ── Answer review: image-based questions must render their media ───────────
describe("Infosys 2027 mock — answer review image rendering", () => {
  const IMAGE_QUESTION = {
    _id: "q-img-1",
    text: "Which figure replaces the question mark in the given 3x3 matrix?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 2,
    section: "reasoning" as const,
    topic: "Puzzle",
    difficulty: "medium",
    explanation: "The number of filled circles follows a cyclic pattern.",
    questionType: "image_mcq" as const,
    media: {
      type: "image" as const,
      url: "https://res.cloudinary.com/dinwniuxq/image/upload/v1793973465/question_matrix.png",
      alt: "3x3 matrix puzzle with filled and empty circles",
    },
    optionMedia: [
      { type: "image" as const, url: "https://res.cloudinary.com/dinwniuxq/image/upload/v1793973464/option_a.png", alt: "Option A: Three empty circles" },
      { type: "image" as const, url: "https://res.cloudinary.com/dinwniuxq/image/upload/v1793973464/option_b.png", alt: "Option B: One filled circle and two empty circles" },
      { type: "image" as const, url: "https://res.cloudinary.com/dinwniuxq/image/upload/v1793973464/option_c.png", alt: "Option C: Two filled circles and one empty circle" },
      { type: "image" as const, url: "https://res.cloudinary.com/dinwniuxq/image/upload/v1793973464/option_d.png", alt: "Option D: Three filled circles" },
    ],
    groupId: null,
  };

  beforeEach(() => {
    fetchReviewMock.mockReset();
    fetchReviewMock.mockResolvedValue({
      score: 1,
      totalQuestions: 1,
      percentage: 100,
      questionMode: "standalone",
      review: [
        {
          question: IMAGE_QUESTION,
          selectedAnswer: 2,
          correctAnswer: 2,
          isCorrect: true,
          markedForReview: false,
          timeSpent: 42,
        },
      ],
    });
  });

  it("renders the image_mcq question media in the answer review", async () => {
    render(<ReviewPage />);
    expect(
      await screen.findByAltText("3x3 matrix puzzle with filled and empty circles")
    ).toBeInTheDocument();
  });

  it("renders per-option images for image_mcq options in the answer review", async () => {
    render(<ReviewPage />);
    expect(
      await screen.findByAltText("Option B: One filled circle and two empty circles")
    ).toBeInTheDocument();
    expect(
      screen.getByAltText("Option C: Two filled circles and one empty circle")
    ).toBeInTheDocument();
  });
});

// ── Table-based stimulus rendering ──────────────────────────────────────────
describe("Infosys 2027 mock — table based stimulus", () => {
  it("renders a pipe-delimited table in the shared stimulus as a real table", () => {
    render(
      <SharedStimulus
        group={{
          id: "g-quickkart",
          title: "QuickKart: City-wise Orders and Revenue",
          type: "data_interpretation",
          section: "numerical",
          topic: "Data Interpretation",
          difficulty: "medium",
          stimulus: {
            text: "Study the following table carefully and answer the questions that follow.\n\nCity | Orders Received | Orders Delivered | Average Order Value (₹)\nBengaluru | 2,400 | 2,160 | 500\nChennai | 1,800 | 1,530 | 400",
            media: null,
          },
          questionIds: [],
        }}
      />
    );
    const table = screen.getByTestId("stimulus-table");
    expect(table).toBeInTheDocument();
    expect(screen.getByText("City")).toBeInTheDocument();
    expect(screen.getByText("Bengaluru")).toBeInTheDocument();
    expect(screen.getByText("Average Order Value (₹)")).toBeInTheDocument();
  });

  it("renders prose before and after a pipe-delimited table", () => {
    render(
      <SharedStimulus
        group={{
          id: "g-sales",
          title: "CrackNQT Mock — Sales & Profit Analysis",
          type: "data_interpretation",
          section: "reasoning",
          topic: "Data Interpretation",
          difficulty: "medium",
          stimulus: {
            text: "Study the following table carefully and answer the questions that follow.\n\nYear | Sales (₹ lakh) | Profit (₹ lakh)\n2019 | 200 | 40\n2020 | 250 | 55\n\nNote: All figures are in ₹ lakh.",
            media: null,
          },
          questionIds: [],
        }}
      />
    );
    expect(screen.getByText(/Study the following table carefully/i)).toBeInTheDocument();
    expect(screen.getByTestId("stimulus-table")).toBeInTheDocument();
    expect(screen.getByText(/Note: All figures are in ₹ lakh/)).toBeInTheDocument();
  });
});

