import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Briefcase,
  GraduationCap,
  IndianRupee,
  Users,
  BookOpenCheck,
  Brain,
  Code2,
  BookOpen,
  FileCode2,
  Puzzle,
  PenLine,
  FileText,
  ClipboardList,
  SearchCheck,
  MonitorCheck,
  MessagesSquare,
  BadgeCheck,
} from "lucide-react";

import { INFOSYS_SE_2027_CAMPAIGN } from "@/lib/constants/campaigns";

/** Single source of truth for the Infosys SE 2027 recruitment page. */
export const infosysPrepUrl = INFOSYS_SE_2027_CAMPAIGN.preparationUrl;

export const INFOSYS_REGISTRATION_URL =
  "https://surveys.infosysapps.com/r/a/SEcampusregistration2027batch";
export const INFOSYS_SAMPLE_PAPER_URL =
  "https://infytq.onwingspan.com/public-assets/InfosysCampusRecruitmentSampleTest-SystemsEngineer.pdf";

// ---------------------------------------------------------------- Hero

export const infosysHeroBadges = [
  { label: "Role", value: "Software Engineer (SE)" },
  { label: "Batch", value: "2027" },
  { label: "Reported Compensation", value: "₹3.6 LPA" },
  { label: "Hiring Type", value: "Campus Hiring" },
] as const;

// ---------------------------------------------------------- Job overview

export interface JobOverviewItem {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
}

export const jobOverview: JobOverviewItem[] = [
  { icon: Building2, label: "Company", value: "Infosys", sub: "Global IT services company" },
  { icon: Briefcase, label: "Job Role", value: "Software Engineer (SE)", sub: "Campus hiring role" },
  { icon: GraduationCap, label: "Graduating Batch", value: "2027", sub: "2027 pass-out students" },
  { icon: IndianRupee, label: "Reported Salary", value: "₹3.6 LPA", sub: "As per placement notice reports" },
  { icon: Users, label: "Hiring Type", value: "Campus Hiring", sub: "Through campus placement drives" },
  {
    icon: BookOpenCheck,
    label: "Eligible Degrees",
    value: "5 programs",
    sub: "BE/BTech · ME/MTech · MCA · MSc (5-yr Integrated) · MSc (Maths)",
  },
];

export const degreePrograms = [
  "BE / BTech",
  "ME / MTech",
  "MCA",
  "MSc (5-year Integrated)",
  "MSc (Mathematics)",
] as const;

// ------------------------------------------------------------- Eligibility

export const reportedEligibility = [
  { label: "Class 10", value: "60%", note: "Reported minimum" },
  { label: "Class 12", value: "60%", note: "Reported minimum" },
  { label: "Diploma (where applicable)", value: "65%", note: "Reported minimum" },
  { label: "BTech", value: "65%", note: "Reported minimum" },
] as const;

export const eligibilityChecklistItems = [
  "My graduating batch is 2027.",
  "My degree program is eligible.",
  "I meet the reported academic requirements.",
  "I have reviewed the official registration details.",
] as const;

// ----------------------------------------------------------- Exam pattern

export interface ExamSection {
  id: string;
  name: string;
  questions: number | null;
  marks: number | null;
  durationMinutes: number;
  topics: string[];
  tip: string;
}

export const examPatternSummary = {
  totalQuestions: 60,
  totalMarks: 75,
  totalMinutes: 120,
  sections: 7,
} as const;

export const examSections: ExamSection[] = [
  {
    id: "reasoning",
    name: "Reasoning Ability",
    questions: 15,
    marks: 15,
    durationMinutes: 25,
    topics: [
      "Seating arrangements",
      "Syllogisms",
      "Coding-decoding",
      "Blood relations",
      "Direction sense",
      "Logical deductions",
      "Data interpretation",
    ],
    tip: "Practice daily with timed sets. Focus on speed in arrangements and coding-decoding — they appear in almost every reported set.",
  },
  {
    id: "technical",
    name: "Technical Ability",
    questions: 10,
    marks: 10,
    durationMinutes: 35,
    topics: [
      "Basic programming concepts",
      "Data structures",
      "Algorithms",
      "OOP concepts",
      "DBMS",
      "Operating systems",
      "Computer networks",
    ],
    tip: "Revise core concepts — DBMS, OS and networks are quick wins. Understand why, not just what — application questions beat definitions.",
  },
  {
    id: "verbal",
    name: "Verbal Ability",
    questions: 20,
    marks: 20,
    durationMinutes: 20,
    topics: [
      "Reading comprehension",
      "Sentence correction",
      "Vocabulary",
      "Para jumbles",
      "Critical reasoning",
    ],
    tip: "Read a passage daily and solve 15–20 verbal questions in one sitting. Para jumbles improve fastest with consistent practice.",
  },
  {
    id: "pseudocode",
    name: "Pseudocode",
    questions: 5,
    marks: 10,
    durationMinutes: 10,
    topics: [
      "Loops",
      "Conditional statements",
      "Arrays",
      "Strings",
      "Recursion",
      "Bitwise operators",
      "Output prediction",
    ],
    tip: "Dry-run every snippet by hand. Write variable values on paper — one wrong iteration is the most common mistake.",
  },
  {
    id: "puzzle",
    name: "Numerical Puzzle Test",
    questions: 4,
    marks: 10,
    durationMinutes: 10,
    topics: [
      "Number patterns",
      "Missing number puzzles",
      "Mathematical logic",
      "Constraint-based puzzles",
    ],
    tip: "Treat them like logic puzzles — look for differences, squares and ratios first. Constraint puzzles yield to systematic elimination.",
  },
  {
    id: "grammar",
    name: "English Grammar",
    questions: 5,
    marks: 10,
    durationMinutes: 10,
    topics: [
      "Tenses",
      "Subject-verb agreement",
      "Prepositions",
      "Error spotting",
      "Active and passive voice",
    ],
    tip: "Revise tense rules and subject-verb agreement — most errors come from these two. Error spotting is pattern recognition: train it daily.",
  },
  {
    id: "essay",
    name: "English Written Test (Essay)",
    questions: 1,
    marks: null, // Not specified in reported pattern
    durationMinutes: 10,
    topics: [
      "Short structured writing",
      "Grammar and clarity",
      "Logical organization",
      "Topic relevance",
    ],
    tip: "Plan for 2 minutes: one idea per paragraph, clear opening and closing. Grammar mistakes cost more than plain vocabulary.",
  },
];

export const examPatternDisclaimer =
  "The assessment pattern shown here is based on reported recruitment information and is not a confirmed universal pattern for every Infosys 2027 campus drive.";

// -------------------------------------------------------- Selection stages

export const selectionStages = [
  {
    id: "registration",
    icon: ClipboardList,
    title: "Registration",
    short: "Submit your application",
    detail:
      "Submit application details through the designated Infosys or campus registration process. Keep your college roll number, percentages and resume handy.",
  },
  {
    id: "screening",
    icon: SearchCheck,
    title: "Eligibility Screening",
    short: "Criteria check",
    detail:
      "Candidates are screened based on the applicable eligibility criteria (batch, degree program, academics). Criteria can vary between drives — check your placement notice.",
  },
  {
    id: "assessment",
    icon: MonitorCheck,
    title: "Online Assessment",
    short: "Reported exam sections",
    detail:
      "Candidates complete the recruitment assessment. Mode and structure may depend on the specific drive — the reported pattern is shown above. Manage time section-wise.",
  },
  {
    id: "interview",
    icon: MessagesSquare,
    title: "Interview",
    short: "Shortlisted candidates",
    detail:
      "Shortlisted candidates attend an interview. Prepare programming fundamentals, your projects, and core technical concepts. Expect questions on what you claim to know.",
  },
  {
    id: "offer",
    icon: BadgeCheck,
    title: "Offer and Onboarding",
    short: "Joining instructions",
    detail:
      "Selected candidates receive further communication and joining instructions through the placement cell or Infosys directly.",
  },
] as const;

export type SelectionStage = (typeof selectionStages)[number];

// ------------------------------------------------------------------ Syllabus

export const syllabusCategories = [
  {
    id: "aptitude",
    label: "Aptitude",
    icon: Puzzle,
    topics: [
      "Number system",
      "Ratio & proportion",
      "Averages",
      "Percentages",
      "Time & work",
      "Time & distance",
      "Permutations & combinations",
      "Probability",
    ],
  },
  {
    id: "reasoning",
    label: "Reasoning",
    icon: Brain,
    topics: [
      "Seating arrangements",
      "Syllogisms",
      "Coding-decoding",
      "Blood relations",
      "Direction sense",
      "Logical deductions",
      "Data interpretation",
    ],
  },
  {
    id: "verbal",
    label: "Verbal",
    icon: BookOpen,
    topics: [
      "Reading comprehension",
      "Sentence correction",
      "Para jumbles",
      "Vocabulary",
      "Critical reasoning",
    ],
  },
  {
    id: "programming",
    label: "Programming",
    icon: Code2,
    topics: [
      "C / C++ / Java / Python",
      "Data structures",
      "Algorithms",
      "OOP concepts",
      "Time complexity",
    ],
  },
  {
    id: "pseudocode",
    label: "Pseudocode",
    icon: FileCode2,
    topics: [
      "Output prediction",
      "Loops",
      "Conditionals",
      "Arrays & strings",
      "Recursion",
      "Bitwise operators",
    ],
  },
  {
    id: "technical",
    label: "Technical Fundamentals",
    icon: FileText,
    topics: [
      "DBMS & SQL",
      "Operating systems",
      "Computer networks",
      "Software engineering basics",
    ],
  },
  {
    id: "essay",
    label: "Essay Writing",
    icon: PenLine,
    topics: [
      "Short structured writing",
      "Grammar & clarity",
      "Logical organization",
      "Topic relevance",
    ],
  },
] as const;

// --------------------------------------------------------------------- FAQ

export const infosysFaq = [
  {
    q: "What is Infosys SE 2027 recruitment?",
    a: "It is the campus hiring drive reported for the Infosys Software Engineer (SE) role targeting the 2027 graduating batch. Details are based on currently available placement notices and may vary per campus — verify through the official registration form and your placement cell.",
  },
  {
    q: "What is the reported salary for the Software Engineer role?",
    a: "Reported compensation is ₹3.6 LPA, as mentioned in the reported placement notice. Final CTC and breakup are governed by Infosys and shared during the offer/onboarding stage.",
  },
  {
    q: "Which batch is eligible?",
    a: "The reported drive targets the 2027 graduating batch. Always confirm the eligible pass-out window on the official registration form for your campus.",
  },
  {
    q: "Which degree programs can apply?",
    a: "Reported eligible programs: BE/BTech, ME/MTech, MCA, MSc (5-year Integrated) and MSc (Mathematics). Eligibility is defined per drive — check your campus notice for confirmation.",
  },
  {
    q: "What is the reported exam pattern?",
    a: "60 questions across 7 sections: Reasoning Ability (15Q/25min), Technical Ability (10Q/35min), Verbal Ability (20Q/20min), Pseudocode (5Q·10 marks/10min), Numerical Puzzle Test (4Q·10 marks/10min), English Grammar (5Q·10 marks/10min) and one English essay. Total objective marks: 75, total duration: 120 minutes. This is a reported pattern, not a universal guarantee.",
  },
  {
    q: "Is the assessment conducted online?",
    a: "Campus drives like this are typically conducted online or at designated centres, but the exact mode depends on your specific drive. Refer to the official registration form and your placement cell for the confirmed mode.",
  },
  {
    q: "Is an interview required?",
    a: "Yes — shortlisted candidates attend an interview as per the reported process. Prepare programming fundamentals, your projects and core technical concepts. The number of rounds and their duration are not publicly confirmed; prepare broadly.",
  },
  {
    q: "What topics should I prepare?",
    a: "Reasoning, technical fundamentals (programming, DBMS, OS, networks), verbal ability, pseudocode/output prediction, grammar and short essay writing. Use the syllabus overview above and start with aptitude + reasoning daily timed practice.",
  },
  {
    q: "Where can I find the official registration form?",
    a: "Use the official link below: the Infosys SE campus registration form (surveys.infosysapps.com / SEcampusregistration2027batch). If it is closed or unavailable for your campus, contact your placement cell.",
  },
  {
    q: "Is the exam pattern confirmed for every campus?",
    a: "No. The pattern is based on a college-specific placement notice and can differ across campuses, sessions and drives. Treat everything on this page as reported information and confirm officially before the exam.",
  },
  {
    q: "What is the Infosys System Engineer Online Assessment?",
    a: "It is the reported written assessment for the Software Engineer role: 60 questions across 7 sections (Reasoning 15, Technical 10, Verbal 20, Pseudocode 5, Numerical Puzzle 4, Grammar 5 and one essay), roughly 120 minutes in total. It is often searched as 'Infosys System Engineer Exam' or 'Infosys exam pattern'. Always confirm your campus-specific format in the placement notice.",
  },
  {
    q: "What is the Infosys System Engineer salary for freshers?",
    a: "The commonly reported package is ₹3.6 LPA for the Software Engineer (SE) role in this drive — the figure appears in a college-specific placement notice, so CTC can vary between campuses and batches. Offer letters govern the final structure.",
  },
  {
    q: "When is the Infosys November hiring and the Infosys off campus drive?",
    a: "Exact drive dates are not confirmed publicly and change across campuses. The reported Software Engineer campus hiring targets the 2027 batch; check the official registration form and your placement cell for the confirmed schedule and deadlines — we do not republish unverified dates.",
  },
  {
    q: "Is Infosys fresher hiring open for the 2027 batch?",
    a: "Yes — the reported drive targets the 2027 graduating batch across BE/BTech, ME/MTech, MCA, MSc (5-year Integrated) and MSc (Mathematics). Eligibility is defined per campus, so verify with your placement cell and the official form before registering.",
  },
  {
    q: "Where can I find Infosys System Engineer previous year questions and free mock tests?",
    a: "The official Infosys sample paper (Systems Engineer) is linked in the Resources section below. CrackNQT also offers topic-wise practice, aptitude/reasoning/verbal/coding questions and full-length free TCS-style mock tests to build speed and accuracy — links are in the footer and on this page.",
  },
  {
    q: "What is the Infosys eligibility criteria for freshers?",
    a: "Reported minimums from the notice we saw: 60% in Class 10, 60% in Class 12, 65% for Diploma where applicable, and 65% in BTech. These are reported figures, not Infosys-wide criteria — your campus placement notice and the official registration form are the deciding documents.",
  },
] as const;
