import { Brain, Calculator, BookOpen, Target, Code2, Database, ShieldCheck, Cpu, GitBranch, Network, Cloud } from "lucide-react";

export const syllabusCategories = [
  {
    id: "aptitude",
    title: "Aptitude & Reasoning",
    description: "Core sections for TCS NQT.",
    icon: Brain,
    color: "text-blue-500",
    sections: [
      { title: "Numerical Ability", topics: ["Number System", "Percentages", "Profit & Loss", "Time, Speed & Distance", "Time & Work", "Averages", "Simplification"] },
      { title: "Reasoning Ability", topics: ["Coding-Decoding", "Blood Relations", "Data Sufficiency", "Syllogism", "Number Series", "Logical Reasoning"] },
      { title: "Verbal Ability", topics: ["Reading Comprehension", "Error Detection", "Sentence Improvement", "Para Jumbles", "Vocabulary"] },
      { title: "Advanced Quantitative", topics: ["Mensuration", "Probability & Permutation-Combination", "Algebra", "Geometry"] },
    ]
  },
  {
    id: "technical",
    title: "CSE / Technical",
    description: "Build a strong technical foundation.",
    icon: Code2,
    color: "text-cyan-500",
    sections: [
      { title: "Programming", icon: Code2, topics: ["Basics", "Loops", "Functions", "Recursion", "OOPs"] },
      { title: "Data Structures", icon: Database, topics: ["Arrays", "Strings", "Stack", "Queue", "Trees", "Graphs"] },
       ]
  }
];
