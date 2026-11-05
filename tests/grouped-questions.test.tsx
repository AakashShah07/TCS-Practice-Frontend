import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ── Mocks ──────────────────────────────────────────────────────────────────
const saveAnswerMock = vi.fn();
const navigateMock = vi.fn();
const clearResponseMock = vi.fn();
const markForReviewMock = vi.fn();

vi.mock("@/lib/api/exam", () => ({
  saveAnswer: (...args: unknown[]) => saveAnswerMock(...args),
  clearResponse: (...args: unknown[]) => clearResponseMock(...args),
  markForReview: (...args: unknown[]) => markForReviewMock(...args),
  navigate: (...args: unknown[]) => navigateMock(...args),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), warning: vi.fn(), success: vi.fn() },
}));

const fetchReviewMock = vi.fn();
vi.mock("@/lib/api/results", () => ({
  fetchReview: (...args: unknown[]) => fetchReviewMock(...args),
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({ testId: "attempt1" }),
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/results/attempt1/review",
}));

import QuestionPanel from "@/components/exam/QuestionPanel";
import ReviewPage from "@/app/(main)/results/[testId]/review/page";
import { useTestStore } from "@/stores/test-store";
import type { Question, QuestionGroup, ReviewResponse } from "@/lib/api/types";

// ── Fixtures ───────────────────────────────────────────────────────────────
let seq = 0;
const uid = () => `q${seq++}`;

function makeQuestion(over: Partial<Question> = {}): Question {
  return {
    _id: uid(),
    text: `Question ${seq}`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    section: "reasoning",
    topic: "Data Interpretation",
    difficulty: "medium",
    groupId: null,
    questionType: "mcq",
    ...over,
  };
}

function makeGroup(over: Partial<QuestionGroup> & { id: string }): QuestionGroup {
  return {
    title: "Election Campaign Analysis",
    type: "data_interpretation",
    section: "reasoning",
    topic: "Data Interpretation",
    stimulus: { text: "Study the following graph carefully." },
    questionIds: [],
    ...over,
  };
}

function seed(
  questions: Question[],
  groups: QuestionGroup[] = [],
  opts: { sectionLocked?: boolean; startIndex?: number } = {}
) {
  useTestStore.getState().initTest({
    attemptId: "attempt1",
    testId: "test1",
    testTitle: "Test",
    testType: "section_test",
    questions,
    duration: 600,
    sections: [{ name: "reasoning", startIndex: 0, endIndex: questions.length - 1 }],
    sectionLocked: opts.sectionLocked ?? false,
    questionGroups: groups,
    questionMode: groups.length ? "grouped" : "standalone",
  });
  if (opts.startIndex) useTestStore.getState().goToQuestion(opts.startIndex);
}

const renderPanel = () => render(<QuestionPanel onSubmitTest={() => {}} />);

beforeEach(() => {
  saveAnswerMock.mockReset().mockResolvedValue(undefined);
  clearResponseMock.mockReset().mockResolvedValue(undefined);
  markForReviewMock.mockReset().mockResolvedValue(undefined);
  navigateMock.mockReset().mockResolvedValue(undefined);
  fetchReviewMock.mockReset();
  useTestStore.getState().resetTest();
});

// ── Tests ──────────────────────────────────────────────────────────────────
describe("Grouped question rendering", () => {
  it("1. renders a standalone MCQ exactly as before", () => {
    const q = makeQuestion({ text: "What is 2 + 3?", options: ["Two", "Four", "Five", "Six"] });
    seed([q]);
    renderPanel();

    expect(screen.getByText("What is 2 + 3?")).toBeInTheDocument();
    expect(screen.queryByTestId("shared-stimulus")).not.toBeInTheDocument();
    expect(screen.getByTestId("answer-options")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(4);
    expect(screen.getByRole("radio", { name: /Option C: Five/ })).toBeInTheDocument();
  });

  it("2. renders a grouped data-interpretation set with the shared stimulus", () => {
    const group = makeGroup({
      id: "g1",
      title: "Sales Analysis",
      stimulus: {
        text: "Table: Q1=120, Q2=150, Q3=180",
        media: {
          type: "table",
          alt: "Sales table",
          table: {
            columns: ["Quarter", "Sales"],
            rows: [
              ["Q1", 120],
              ["Q2", 150],
            ],
          },
        },
      },
    });
    const q1 = makeQuestion({ text: "What was Q2?", groupId: "g1", options: ["120", "150", "180", "210"] });
    const q2 = makeQuestion({ text: "What was Q3?", groupId: "g1", options: ["120", "150", "180", "210"] });
    group.questionIds = [q1._id, q2._id];
    seed([q1, q2], [group]);
    renderPanel();

    expect(screen.getByTestId("grouped-layout")).toBeInTheDocument();
    const stimulus = screen.getByTestId("shared-stimulus");
    expect(stimulus).toHaveTextContent("Sales Analysis");
    expect(stimulus).toHaveTextContent("Table: Q1=120, Q2=150, Q3=180");
    // Structured table media renders real rows (not raw data / broken image)
    expect(screen.getByTestId("media-table")).toBeInTheDocument();
    expect(screen.getByText("Quarter")).toBeInTheDocument();
    expect(screen.getByText("Q2")).toBeInTheDocument();
    expect(screen.getByText("What was Q2?")).toBeInTheDocument();
    expect(screen.getByTestId("answer-options")).toBeInTheDocument();
  });

  it("2b. renders structured chart media", () => {
    const group = makeGroup({
      id: "gc",
      title: "Revenue Chart",
      stimulus: {
        text: "Study the chart",
        media: {
          type: "chart",
          alt: "Revenue chart",
          chart: {
            kind: "bar",
            xKey: "label",
            yKey: "value",
            data: [
              { label: "Jan", value: 100 },
              { label: "Feb", value: 150 },
            ],
          },
        },
      },
    });
    const q = makeQuestion({ text: "Chart question", groupId: "gc" });
    group.questionIds = [q._id];
    seed([q], [group]);
    renderPanel();

    expect(screen.getByTestId("media-chart")).toBeInTheDocument();
    expect(screen.queryByTestId("media-fallback")).not.toBeInTheDocument();
  });

  it("3. renders an image-based question and accessible media", () => {
    const q = makeQuestion({
      text: "Which shape completes the pattern?",
      questionType: "image_mcq",
      media: { type: "image", url: "/uploads/puzzle.png", alt: "Pattern puzzle" },
      options: ["Square", "Circle", "Triangle", "Star"],
    });
    seed([q]);
    renderPanel();

    const img = screen.getByAltText("Pattern puzzle");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/uploads/puzzle.png");
    expect(screen.getAllByRole("radio")).toHaveLength(4);
  });

  it("4. navigating within a group keeps the stimulus and preserves answers", async () => {
    const user = userEvent.setup();
    const group = makeGroup({ id: "g1", title: "Shared Chart", stimulus: { text: "Chart data here" } });
    const q1 = makeQuestion({ text: "First question?", groupId: "g1" });
    const q2 = makeQuestion({ text: "Second question?", groupId: "g1" });
    group.questionIds = [q1._id, q2._id];
    seed([q1, q2], [group]);
    renderPanel();

    const stimulusBefore = screen.getByTestId("shared-stimulus");
    await user.click(screen.getByRole("radio", { name: /Option B/ }));
    expect(useTestStore.getState().responses[0].selectedAnswer).toBe(1);
    expect(saveAnswerMock).toHaveBeenCalledWith("attempt1", 0, 1, 0);

    await user.click(screen.getByRole("button", { name: /^Next/ }));

    // Only the question changed — the SAME stimulus DOM node is retained (no refetch/remount)
    expect(screen.getByTestId("shared-stimulus")).toBe(stimulusBefore);
    expect(screen.getByText("Second question?")).toBeInTheDocument();
    expect(useTestStore.getState().currentQuestionIndex).toBe(1);

    // Answer first question persists, and second is independent
    await user.click(screen.getByRole("radio", { name: /Option C/ }));
    await user.click(screen.getByRole("button", { name: /^Prev/ }));
    expect(useTestStore.getState().responses[0].selectedAnswer).toBe(1);
    expect(useTestStore.getState().responses[1].selectedAnswer).toBe(2);
  });

  it("5. navigating to a different group swaps the stimulus", async () => {
    const user = userEvent.setup();
    const g1 = makeGroup({ id: "g1", title: "Group One", stimulus: { text: "Stimulus one" } });
    const g2 = makeGroup({ id: "g2", title: "Group Two", stimulus: { text: "Stimulus two" } });
    const a1 = makeQuestion({ text: "G1 Q1", groupId: "g1" });
    const a2 = makeQuestion({ text: "G1 Q2", groupId: "g1" });
    const b1 = makeQuestion({ text: "G2 Q1", groupId: "g2" });
    g1.questionIds = [a1._id, a2._id];
    g2.questionIds = [b1._id];
    seed([a1, a2, b1], [g1, g2], { startIndex: 1 });

    renderPanel();
    expect(screen.getByTestId("shared-stimulus")).toHaveTextContent("Group One");

    await user.click(screen.getByRole("button", { name: /^Next/ }));
    expect(screen.getByTestId("shared-stimulus")).toHaveTextContent("Group Two");
    expect(screen.getByTestId("shared-stimulus")).not.toHaveTextContent("Group One");
    expect(screen.getByText("G2 Q1")).toBeInTheDocument();
  });

  it("6. answer persistence across option selection and clearing", async () => {
    const user = userEvent.setup();
    const q = makeQuestion({ text: "Pick one", options: ["One", "Two", "Three", "Four"] });
    seed([q]);
    renderPanel();

    await user.click(screen.getByRole("radio", { name: /Option D/ }));
    expect(useTestStore.getState().responses[0].selectedAnswer).toBe(3);
    expect(useTestStore.getState().responses[0].status).toBe("answered");

    await user.click(screen.getByRole("button", { name: /Clear/ }));
    expect(useTestStore.getState().responses[0].selectedAnswer).toBeNull();
  });

  it("7. grouped layout is responsive (single column on mobile, two on desktop) with no fixed overflow", () => {
    const group = makeGroup({ id: "g1" });
    const q = makeQuestion({ text: "Mobile check", groupId: "g1" });
    group.questionIds = [q._id];
    seed([q], [group]);
    renderPanel();

    const layout = screen.getByTestId("grouped-layout");
    expect(layout.className).toContain("grid-cols-1");
    expect(layout.className).toContain("lg:grid-cols-2");
    // both panels must allow shrinking (prevents horizontal overflow)
    const panels = Array.from(layout.children);
    expect(panels).toHaveLength(2);
    panels.forEach((p) => expect(p.className).toContain("min-w-0"));
  });

  it("8. result review shows group context, correct/incorrect states and explanation", async () => {
    const group = makeGroup({ id: "g1", title: "Review Stimulus", stimulus: { text: "Shared context text" } });
    const review: ReviewResponse = {
      score: 1,
      totalQuestions: 2,
      percentage: 50,
      questionMode: "grouped",
      questionGroups: [group],
      review: [
        {
          question: { ...makeQuestion({ text: "Correct one" }), groupId: "g1", options: ["A1", "B1", "C1", "D1"], explanation: "Because A1" },
          selectedAnswer: 0,
          correctAnswer: 0,
          timeSpent: 10,
        },
        {
          question: { ...makeQuestion({ text: "Wrong one" }), groupId: "g1", options: ["A2", "B2", "C2", "D2"], explanation: "Because C2" },
          selectedAnswer: 1,
          correctAnswer: 2,
          timeSpent: 20,
        },
      ],
    };
    fetchReviewMock.mockResolvedValue(review);

    render(<ReviewPage />);

    expect(await screen.findByText("Correct one")).toBeInTheDocument();
    expect(screen.getAllByTestId("shared-stimulus").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Shared context text").length).toBeGreaterThan(0);
    expect(screen.getByText("Because A1")).toBeInTheDocument();
    expect(screen.getByText("Because C2")).toBeInTheDocument();
    // 5-option safe labels + wrong/correct markers
    expect(screen.getAllByText("C.").length).toBeGreaterThan(0);
  });

  it("9. legacy tests without questionGroups keep working (standalone + text passage)", () => {
    // (a) legacy standalone review payload without questionGroups
    const legacy = makeQuestion({ text: "Legacy question", options: ["One", "Two", "Three", "Four"] });
    seed([legacy]);
    renderPanel();
    expect(screen.getByText("Legacy question")).toBeInTheDocument();
    expect(screen.queryByTestId("shared-stimulus")).not.toBeInTheDocument();

    // (b) legacy reading-comprehension question (passage embedded in text, no group)
    useTestStore.getState().resetTest();
    const rc = makeQuestion({
      topic: "Reading Comprehension",
      text: "Read the passage: 'The quick brown fox jumps.' What animal is mentioned?",
    });
    seed([rc]);
    renderPanel();
    expect(screen.getAllByText(/The quick brown fox jumps/).length).toBeGreaterThan(0);
    expect(screen.queryByTestId("shared-stimulus")).not.toBeInTheDocument();
  });

  it("10. missing or invalid media degrades gracefully (no broken image / raw URL)", () => {
    const group = makeGroup({
      id: "g1",
      title: "Broken Media",
      stimulus: { text: "", media: { type: "image", url: "" } },
    });
    const q = makeQuestion({ text: "Q with missing media", groupId: "g1" });
    group.questionIds = [q._id];
    seed([q], [group]);
    renderPanel();

    // No <img> rendered; accessible fallback instead
    expect(screen.queryByRole("img", { name: /Enlarge/i })).not.toBeInTheDocument();
    const fallback = screen.getByTestId("media-fallback");
    expect(fallback).toHaveAttribute("aria-label");
    expect(fallback).not.toHaveTextContent("http");
  });
});
