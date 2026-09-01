import { Target, ShieldCheck, TrendingUp, Activity, Users, ClipboardCheck, Route, BarChart3, Info, HelpCircle } from "lucide-react";

export const cutoffData = {
  summary: [
    { label: "Expected Cutoff", value: "Indicative", icon: Target, desc: "Estimated based on historical trends." },
    { label: "Safe Score", value: "Competitive", icon: ShieldCheck, desc: "A buffer above expected cutoff." },
    { label: "Difficulty", value: "Variable", icon: Activity, desc: "Depends on section & profile." }
  ],
  factors: [
    { title: "Exam Difficulty", icon: Activity, desc: "Harder papers often influence score distributions." },
    { title: "Candidate Performance", icon: Users, desc: "Overall performance affects competitive thresholds." },
    { title: "Competition", icon: TrendingUp, desc: "Number of candidates affects ranking." },
    { title: "Role/Profile", icon: Target, desc: "Expectations vary by role (Ninja/Digital/Prime)." },
    { title: "Test Pattern", icon: ClipboardCheck, desc: "Changes in structure alter score interpretation." },
    { title: "Evaluation", icon: BarChart3, desc: "Normalization can impact final results." },
  ],
  sections: [
    { title: "Numerical Ability", diff: "●●●○○", focus: "Arithmetic, Speed, Accuracy" },
    { title: "Reasoning Ability", diff: "●●●○○", focus: "Logical Reasoning, Patterns" },
    { title: "Verbal Ability", diff: "●●○○○", focus: "Grammar, Comprehension" },
    { title: "Advanced Quant", diff: "●●●●○", focus: "Advanced Problem Solving" },
  ],
  faq: [
    { q: "What is the TCS NQT cutoff?", a: "It is the threshold score used to shortlist candidates for the next round, based on overall performance." },
    { q: "Is there one fixed cutoff?", a: "No, cutoffs vary significantly based on role, exam difficulty, and candidate performance." },
  ]
};
