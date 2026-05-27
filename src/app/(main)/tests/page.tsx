"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  Brain,
  BookOpen,
  Zap,
  FileText,
  ArrowRight,
  Users,
  Flame,
  Sigma,
  Target,
  Percent,
  Clock,
  Divide,
  Ruler,
  Gauge,
  Dices,
  Shuffle,
  BookOpenText,
  PenLine,
  AlertTriangle,
  ScrollText,
  BarChart3,
  IndianRupee,
  Hourglass,
  KeyRound,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchTests } from "@/lib/api/tests";
import type { Test } from "@/lib/api/types";
import {
  TopicTestCard,
  type TopicCardColors,
} from "@/components/topic-test-card";

interface TopicCardConfig {
  topic: string;
  title: string;
  description: string;
  icon: LucideIcon;
  flameIcon?: LucideIcon;
  defaultSection: string;
  difficultyLabel: string;
  buttonLabel: string;
  colors: TopicCardColors;
  skeleton: [string, string, string, string, string];
}

const topicCards: TopicCardConfig[] = [
  {
    topic: "Blood Relations",
    title: "Blood Relations Challenge",
    description: "Master family tree puzzles — coded relations, generation chains, gender traps & more",
    icon: Users,
    defaultSection: "Reasoning",
    difficultyLabel: "Easy to Hard",
    buttonLabel: "Take Challenge",
    colors: {
      card: "border-red-200 bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 dark:from-red-950/30 dark:via-orange-950/20 dark:to-amber-950/20 dark:border-red-800",
      circle1: "bg-red-100/40 dark:bg-red-900/10",
      circle2: "bg-orange-100/40 dark:bg-orange-900/10",
      iconBg: "bg-red-100 dark:bg-red-900/40",
      iconColor: "text-red-600 dark:text-red-400",
      title: "text-red-900 dark:text-red-100",
      desc: "text-red-700/80 dark:text-red-300/80",
      flame: "text-orange-500 dark:text-orange-400",
      badges: [
        "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700",
        "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-200 dark:border-orange-700",
        "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700",
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700",
      ],
      button: "bg-red-600 hover:bg-red-700",
    },
    skeleton: ["border-red-200 dark:border-red-800", "from-red-50 dark:from-red-950/30", "via-orange-50 dark:via-orange-950/20", "to-amber-50 dark:to-amber-950/20", "bg-red-200/60 dark:bg-red-800/40"],
  },
  {
    topic: "Simplification",
    title: "Simplification Practice",
    description: "BODMAS, fractions, roots, exponents, percentages & algebraic identities",
    icon: Sigma,
    flameIcon: Calculator,
    defaultSection: "Numerical",
    difficultyLabel: "Easy to Hard",
    buttonLabel: "Start Practice",
    colors: {
      card: "border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-cyan-950/20 dark:border-blue-800",
      circle1: "bg-blue-100/40 dark:bg-blue-900/10",
      circle2: "bg-indigo-100/40 dark:bg-indigo-900/10",
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
      iconColor: "text-blue-600 dark:text-blue-400",
      title: "text-blue-900 dark:text-blue-100",
      desc: "text-blue-700/80 dark:text-blue-300/80",
      flame: "text-indigo-500 dark:text-indigo-400",
      badges: [
        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700",
        "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-200 dark:border-indigo-700",
        "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-200 dark:border-cyan-700",
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700",
      ],
      button: "bg-blue-600 hover:bg-blue-700",
    },
    skeleton: ["border-blue-200 dark:border-blue-800", "from-blue-50 dark:from-blue-950/30", "via-indigo-50 dark:via-indigo-950/20", "to-cyan-50 dark:to-cyan-950/20", "bg-blue-200/60 dark:bg-blue-800/40"],
  },
  {
    topic: "Approximation",
    title: "Approximation Challenge",
    description: "Square roots, cube roots, percentages & complex mixed operations — round smartly!",
    icon: Target,
    defaultSection: "Numerical",
    difficultyLabel: "Hard Only",
    buttonLabel: "Take Challenge",
    colors: {
      card: "border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-green-950/20 dark:border-emerald-800",
      circle1: "bg-emerald-100/40 dark:bg-emerald-900/10",
      circle2: "bg-teal-100/40 dark:bg-teal-900/10",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      title: "text-emerald-900 dark:text-emerald-100",
      desc: "text-emerald-700/80 dark:text-emerald-300/80",
      flame: "text-emerald-500 dark:text-emerald-400",
      badges: [
        "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-700",
        "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700",
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700",
        "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700",
      ],
      button: "bg-emerald-600 hover:bg-emerald-700",
    },
    skeleton: ["border-emerald-200 dark:border-emerald-800", "from-emerald-50 dark:from-emerald-950/30", "via-teal-50 dark:via-teal-950/20", "to-green-50 dark:to-green-950/20", "bg-emerald-200/60 dark:bg-emerald-800/40"],
  },
  {
    topic: "Ratio & Percentage",
    title: "Ratio & Percentage Practice",
    description: "Ratios, proportions, profit & loss, discounts, successive percentage changes & more",
    icon: Percent,
    defaultSection: "Numerical",
    difficultyLabel: "Easy to Hard",
    buttonLabel: "Start Practice",
    colors: {
      card: "border-amber-200 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-orange-950/20 dark:border-amber-800",
      circle1: "bg-amber-100/40 dark:bg-amber-900/10",
      circle2: "bg-yellow-100/40 dark:bg-yellow-900/10",
      iconBg: "bg-amber-100 dark:bg-amber-900/40",
      iconColor: "text-amber-600 dark:text-amber-400",
      title: "text-amber-900 dark:text-amber-100",
      desc: "text-amber-700/80 dark:text-amber-300/80",
      flame: "text-yellow-500 dark:text-yellow-400",
      badges: [
        "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700",
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-700",
        "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-200 dark:border-orange-700",
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700",
      ],
      button: "bg-amber-600 hover:bg-amber-700",
    },
    skeleton: ["border-amber-200 dark:border-amber-800", "from-amber-50 dark:from-amber-950/30", "via-yellow-50 dark:via-yellow-950/20", "to-orange-50 dark:to-orange-950/20", "bg-amber-200/60 dark:bg-amber-800/40"],
  },
  {
    topic: "Time & Work",
    title: "Time & Work Practice",
    description: "Pipes & cisterns, work efficiency, alternate days, combined work rates & more",
    icon: Clock,
    defaultSection: "Numerical",
    difficultyLabel: "Easy to Hard",
    buttonLabel: "Start Practice",
    colors: {
      card: "border-violet-200 bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/30 dark:via-purple-950/20 dark:to-fuchsia-950/20 dark:border-violet-800",
      circle1: "bg-violet-100/40 dark:bg-violet-900/10",
      circle2: "bg-purple-100/40 dark:bg-purple-900/10",
      iconBg: "bg-violet-100 dark:bg-violet-900/40",
      iconColor: "text-violet-600 dark:text-violet-400",
      title: "text-violet-900 dark:text-violet-100",
      desc: "text-violet-700/80 dark:text-violet-300/80",
      flame: "text-purple-500 dark:text-purple-400",
      badges: [
        "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/40 dark:text-violet-200 dark:border-violet-700",
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700",
        "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 dark:bg-fuchsia-900/40 dark:text-fuchsia-200 dark:border-fuchsia-700",
        "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/40 dark:text-pink-200 dark:border-pink-700",
      ],
      button: "bg-violet-600 hover:bg-violet-700",
    },
    skeleton: ["border-violet-200 dark:border-violet-800", "from-violet-50 dark:from-violet-950/30", "via-purple-50 dark:via-purple-950/20", "to-fuchsia-50 dark:to-fuchsia-950/20", "bg-violet-200/60 dark:bg-violet-800/40"],
  },
  {
    topic: "LCM & HCF",
    title: "LCM & HCF Practice",
    description: "Least common multiples, highest common factors, prime factorization & word problems",
    icon: Divide,
    defaultSection: "Numerical",
    difficultyLabel: "Easy to Hard",
    buttonLabel: "Start Practice",
    colors: {
      card: "border-cyan-200 bg-gradient-to-r from-cyan-50 via-sky-50 to-teal-50 dark:from-cyan-950/30 dark:via-sky-950/20 dark:to-teal-950/20 dark:border-cyan-800",
      circle1: "bg-cyan-100/40 dark:bg-cyan-900/10",
      circle2: "bg-sky-100/40 dark:bg-sky-900/10",
      iconBg: "bg-cyan-100 dark:bg-cyan-900/40",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      title: "text-cyan-900 dark:text-cyan-100",
      desc: "text-cyan-700/80 dark:text-cyan-300/80",
      flame: "text-sky-500 dark:text-sky-400",
      badges: [
        "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-200 dark:border-cyan-700",
        "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/40 dark:text-sky-200 dark:border-sky-700",
        "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700",
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700",
      ],
      button: "bg-cyan-600 hover:bg-cyan-700",
    },
    skeleton: ["border-cyan-200 dark:border-cyan-800", "from-cyan-50 dark:from-cyan-950/30", "via-sky-50 dark:via-sky-950/20", "to-teal-50 dark:to-teal-950/20", "bg-cyan-200/60 dark:bg-cyan-800/40"],
  },
  {
    topic: "Mensuration",
    title: "Mensuration Practice",
    description: "Area, perimeter, volume, surface area — circles, triangles, cylinders, cones & more",
    icon: Ruler,
    defaultSection: "Numerical",
    difficultyLabel: "Easy to Hard",
    buttonLabel: "Start Practice",
    colors: {
      card: "border-rose-200 bg-gradient-to-r from-rose-50 via-pink-50 to-red-50 dark:from-rose-950/30 dark:via-pink-950/20 dark:to-red-950/20 dark:border-rose-800",
      circle1: "bg-rose-100/40 dark:bg-rose-900/10",
      circle2: "bg-pink-100/40 dark:bg-pink-900/10",
      iconBg: "bg-rose-100 dark:bg-rose-900/40",
      iconColor: "text-rose-600 dark:text-rose-400",
      title: "text-rose-900 dark:text-rose-100",
      desc: "text-rose-700/80 dark:text-rose-300/80",
      flame: "text-pink-500 dark:text-pink-400",
      badges: [
        "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-700",
        "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/40 dark:text-pink-200 dark:border-pink-700",
        "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700",
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700",
      ],
      button: "bg-rose-600 hover:bg-rose-700",
    },
    skeleton: ["border-rose-200 dark:border-rose-800", "from-rose-50 dark:from-rose-950/30", "via-pink-50 dark:via-pink-950/20", "to-red-50 dark:to-red-950/20", "bg-rose-200/60 dark:bg-rose-800/40"],
  },
  {
    topic: "Speed, Time & Distance",
    title: "Speed, Time & Distance Practice",
    description: "Relative speed, trains, boats & streams, average speed, circular tracks & more",
    icon: Gauge,
    defaultSection: "Numerical",
    difficultyLabel: "Easy to Hard",
    buttonLabel: "Start Practice",
    colors: {
      card: "border-teal-200 bg-gradient-to-r from-teal-50 via-cyan-50 to-sky-50 dark:from-teal-950/30 dark:via-cyan-950/20 dark:to-sky-950/20 dark:border-teal-800",
      circle1: "bg-teal-100/40 dark:bg-teal-900/10",
      circle2: "bg-cyan-100/40 dark:bg-cyan-900/10",
      iconBg: "bg-teal-100 dark:bg-teal-900/40",
      iconColor: "text-teal-600 dark:text-teal-400",
      title: "text-teal-900 dark:text-teal-100",
      desc: "text-teal-700/80 dark:text-teal-300/80",
      flame: "text-cyan-500 dark:text-cyan-400",
      badges: [
        "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700",
        "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-200 dark:border-cyan-700",
        "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/40 dark:text-sky-200 dark:border-sky-700",
        "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-700",
      ],
      button: "bg-teal-600 hover:bg-teal-700",
    },
    skeleton: ["border-teal-200 dark:border-teal-800", "from-teal-50 dark:from-teal-950/30", "via-cyan-50 dark:via-cyan-950/20", "to-sky-50 dark:to-sky-950/20", "bg-teal-200/60 dark:bg-teal-800/40"],
  },
  {
    topic: "Probability, Permutation & Combination",
    title: "Probability, Permutation & Combination",
    description: "Classical probability, conditional probability, arrangements, selections, factorial problems & more",
    icon: Dices,
    defaultSection: "Numerical",
    difficultyLabel: "Easy to Hard",
    buttonLabel: "Start Practice",
    colors: {
      card: "border-lime-200 bg-gradient-to-r from-lime-50 via-green-50 to-emerald-50 dark:from-lime-950/30 dark:via-green-950/20 dark:to-emerald-950/20 dark:border-lime-800",
      circle1: "bg-lime-100/40 dark:bg-lime-900/10",
      circle2: "bg-green-100/40 dark:bg-green-900/10",
      iconBg: "bg-lime-100 dark:bg-lime-900/40",
      iconColor: "text-lime-600 dark:text-lime-400",
      title: "text-lime-900 dark:text-lime-100",
      desc: "text-lime-700/80 dark:text-lime-300/80",
      flame: "text-green-500 dark:text-green-400",
      badges: [
        "bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-900/40 dark:text-lime-200 dark:border-lime-700",
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700",
        "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-700",
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700",
      ],
      button: "bg-lime-600 hover:bg-lime-700",
    },
    skeleton: ["border-lime-200 dark:border-lime-800", "from-lime-50 dark:from-lime-950/30", "via-green-50 dark:via-green-950/20", "to-emerald-50 dark:to-emerald-950/20", "bg-lime-200/60 dark:bg-lime-800/40"],
  },
  {
    topic: "Para Jumble",
    title: "Para Jumble Practice",
    description: "Sentence rearrangement, logical sequencing, paragraph coherence & transition clues",
    icon: Shuffle,
    defaultSection: "Verbal",
    difficultyLabel: "Easy to Hard",
    buttonLabel: "Start Practice",
    colors: {
      card: "border-fuchsia-200 bg-gradient-to-r from-fuchsia-50 via-pink-50 to-purple-50 dark:from-fuchsia-950/30 dark:via-pink-950/20 dark:to-purple-950/20 dark:border-fuchsia-800",
      circle1: "bg-fuchsia-100/40 dark:bg-fuchsia-900/10",
      circle2: "bg-pink-100/40 dark:bg-pink-900/10",
      iconBg: "bg-fuchsia-100 dark:bg-fuchsia-900/40",
      iconColor: "text-fuchsia-600 dark:text-fuchsia-400",
      title: "text-fuchsia-900 dark:text-fuchsia-100",
      desc: "text-fuchsia-700/80 dark:text-fuchsia-300/80",
      flame: "text-pink-500 dark:text-pink-400",
      badges: [
        "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 dark:bg-fuchsia-900/40 dark:text-fuchsia-200 dark:border-fuchsia-700",
        "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/40 dark:text-pink-200 dark:border-pink-700",
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700",
        "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/40 dark:text-violet-200 dark:border-violet-700",
      ],
      button: "bg-fuchsia-600 hover:bg-fuchsia-700",
    },
    skeleton: ["border-fuchsia-200 dark:border-fuchsia-800", "from-fuchsia-50 dark:from-fuchsia-950/30", "via-pink-50 dark:via-pink-950/20", "to-purple-50 dark:to-purple-950/20", "bg-fuchsia-200/60 dark:bg-fuchsia-800/40"],
  },
  {
    topic: "Reading Comprehension",
    title: "Reading Comprehension Practice",
    description: "Passage-based questions, inference, main idea, tone, vocabulary in context & critical reasoning",
    icon: BookOpenText,
    defaultSection: "Verbal",
    difficultyLabel: "Easy to Hard",
    buttonLabel: "Start Practice",
    colors: {
      card: "border-orange-200 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-yellow-950/20 dark:border-orange-800",
      circle1: "bg-orange-100/40 dark:bg-orange-900/10",
      circle2: "bg-amber-100/40 dark:bg-amber-900/10",
      iconBg: "bg-orange-100 dark:bg-orange-900/40",
      iconColor: "text-orange-600 dark:text-orange-400",
      title: "text-orange-900 dark:text-orange-100",
      desc: "text-orange-700/80 dark:text-orange-300/80",
      flame: "text-amber-500 dark:text-amber-400",
      badges: [
        "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-200 dark:border-orange-700",
        "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700",
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-700",
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700",
      ],
      button: "bg-orange-600 hover:bg-orange-700",
    },
    skeleton: ["border-orange-200 dark:border-orange-800", "from-orange-50 dark:from-orange-950/30", "via-amber-50 dark:via-amber-950/20", "to-yellow-50 dark:to-yellow-950/20", "bg-orange-200/60 dark:bg-orange-800/40"],
  },
  {
    topic: "Vocabulary Fill in the Blank",
    title: "Vocabulary Fill in the Blank",
    description: "Contextual word usage, idioms, phrasal verbs, synonyms, antonyms & sentence completion",
    icon: PenLine,
    defaultSection: "Verbal",
    difficultyLabel: "Easy to Hard",
    buttonLabel: "Start Practice",
    colors: {
      card: "border-sky-200 bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 dark:from-sky-950/30 dark:via-blue-950/20 dark:to-indigo-950/20 dark:border-sky-800",
      circle1: "bg-sky-100/40 dark:bg-sky-900/10",
      circle2: "bg-blue-100/40 dark:bg-blue-900/10",
      iconBg: "bg-sky-100 dark:bg-sky-900/40",
      iconColor: "text-sky-600 dark:text-sky-400",
      title: "text-sky-900 dark:text-sky-100",
      desc: "text-sky-700/80 dark:text-sky-300/80",
      flame: "text-blue-500 dark:text-blue-400",
      badges: [
        "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/40 dark:text-sky-200 dark:border-sky-700",
        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700",
        "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-200 dark:border-indigo-700",
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700",
      ],
      button: "bg-sky-600 hover:bg-sky-700",
    },
    skeleton: ["border-sky-200 dark:border-sky-800", "from-sky-50 dark:from-sky-950/30", "via-blue-50 dark:via-blue-950/20", "to-indigo-50 dark:to-indigo-950/20", "bg-sky-200/60 dark:bg-sky-800/40"],
  },
  {
    topic: "Error Detection",
    title: "Error Detection Practice",
    description: "Spot grammatical errors — subject-verb agreement, tense, prepositions, articles & sentence structure",
    icon: AlertTriangle,
    defaultSection: "Verbal",
    difficultyLabel: "Easy to Hard",
    buttonLabel: "Start Practice",
    colors: {
      card: "border-pink-200 bg-gradient-to-r from-pink-50 via-red-50 to-rose-50 dark:from-pink-950/30 dark:via-red-950/20 dark:to-rose-950/20 dark:border-pink-800",
      circle1: "bg-pink-100/40 dark:bg-pink-900/10",
      circle2: "bg-red-100/40 dark:bg-red-900/10",
      iconBg: "bg-pink-100 dark:bg-pink-900/40",
      iconColor: "text-pink-600 dark:text-pink-400",
      title: "text-pink-900 dark:text-pink-100",
      desc: "text-pink-700/80 dark:text-pink-300/80",
      flame: "text-red-500 dark:text-red-400",
      badges: [
        "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/40 dark:text-pink-200 dark:border-pink-700",
        "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700",
        "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-700",
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700",
      ],
      button: "bg-pink-600 hover:bg-pink-700",
    },
    skeleton: ["border-pink-200 dark:border-pink-800", "from-pink-50 dark:from-pink-950/30", "via-red-50 dark:via-red-950/20", "to-rose-50 dark:to-rose-950/20", "bg-pink-200/60 dark:bg-pink-800/40"],
  },
  {
    topic: "Passage Fill in the Blank",
    title: "Passage Fill in the Blank",
    description: "Read a passage with numbered blanks and choose the correct word for each blank from the options",
    icon: ScrollText,
    defaultSection: "Verbal",
    difficultyLabel: "Easy to Hard",
    buttonLabel: "Start Practice",
    colors: {
      card: "border-indigo-200 bg-gradient-to-r from-indigo-50 via-violet-50 to-blue-50 dark:from-indigo-950/30 dark:via-violet-950/20 dark:to-blue-950/20 dark:border-indigo-800",
      circle1: "bg-indigo-100/40 dark:bg-indigo-900/10",
      circle2: "bg-violet-100/40 dark:bg-violet-900/10",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      title: "text-indigo-900 dark:text-indigo-100",
      desc: "text-indigo-700/80 dark:text-indigo-300/80",
      flame: "text-violet-500 dark:text-violet-400",
      badges: [
        "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-200 dark:border-indigo-700",
        "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/40 dark:text-violet-200 dark:border-violet-700",
        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700",
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700",
      ],
      button: "bg-indigo-600 hover:bg-indigo-700",
    },
    skeleton: ["border-indigo-200 dark:border-indigo-800", "from-indigo-50 dark:from-indigo-950/30", "via-violet-50 dark:via-violet-950/20", "to-blue-50 dark:to-blue-950/20", "bg-indigo-200/60 dark:bg-indigo-800/40"],
  },
  {
    topic: "Average",
    title: "Average Practice",
    description: "Simple average, weighted average, age-based problems, runs & innings, mixtures & more",
    icon: BarChart3,
    defaultSection: "Numerical",
    difficultyLabel: "Easy to Hard",
    buttonLabel: "Start Practice",
    colors: {
      card: "border-yellow-200 bg-gradient-to-r from-yellow-50 via-amber-50 to-lime-50 dark:from-yellow-950/30 dark:via-amber-950/20 dark:to-lime-950/20 dark:border-yellow-800",
      circle1: "bg-yellow-100/40 dark:bg-yellow-900/10",
      circle2: "bg-amber-100/40 dark:bg-amber-900/10",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/40",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      title: "text-yellow-900 dark:text-yellow-100",
      desc: "text-yellow-700/80 dark:text-yellow-300/80",
      flame: "text-amber-500 dark:text-amber-400",
      badges: [
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-700",
        "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700",
        "bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-900/40 dark:text-lime-200 dark:border-lime-700",
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700",
      ],
      button: "bg-yellow-600 hover:bg-yellow-700",
    },
    skeleton: ["border-yellow-200 dark:border-yellow-800", "from-yellow-50 dark:from-yellow-950/30", "via-amber-50 dark:via-amber-950/20", "to-lime-50 dark:to-lime-950/20", "bg-yellow-200/60 dark:bg-yellow-800/40"],
  },
  {
    topic: "Profit & Loss",
    title: "Profit & Loss Challenge",
    description: "Cost price, selling price, markup, discount, successive discounts, partnership & more",
    icon: IndianRupee,
    defaultSection: "Numerical",
    difficultyLabel: "Easy to Hard",
    buttonLabel: "Take Challenge",
    colors: {
      card: "border-green-200 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/20 dark:to-teal-950/20 dark:border-green-800",
      circle1: "bg-green-100/40 dark:bg-green-900/10",
      circle2: "bg-emerald-100/40 dark:bg-emerald-900/10",
      iconBg: "bg-green-100 dark:bg-green-900/40",
      iconColor: "text-green-600 dark:text-green-400",
      title: "text-green-900 dark:text-green-100",
      desc: "text-green-700/80 dark:text-green-300/80",
      flame: "text-emerald-500 dark:text-emerald-400",
      badges: [
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700",
        "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-700",
        "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700",
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700",
      ],
      button: "bg-green-600 hover:bg-green-700",
    },
    skeleton: ["border-green-200 dark:border-green-800", "from-green-50 dark:from-green-950/30", "via-emerald-50 dark:via-emerald-950/20", "to-teal-50 dark:to-teal-950/20", "bg-green-200/60 dark:bg-green-800/40"],
  },
  {
    topic: "Problems on Ages",
    title: "Problems on Ages Challenge",
    description: "Present age, age ratios, age differences, past & future age equations & family age puzzles",
    icon: Hourglass,
    defaultSection: "Numerical",
    difficultyLabel: "Easy to Hard",
    buttonLabel: "Take Challenge",
    colors: {
      card: "border-purple-200 bg-gradient-to-r from-purple-50 via-blue-50 to-violet-50 dark:from-purple-950/30 dark:via-blue-950/20 dark:to-violet-950/20 dark:border-purple-800",
      circle1: "bg-purple-100/40 dark:bg-purple-900/10",
      circle2: "bg-blue-100/40 dark:bg-blue-900/10",
      iconBg: "bg-purple-100 dark:bg-purple-900/40",
      iconColor: "text-purple-600 dark:text-purple-400",
      title: "text-purple-900 dark:text-purple-100",
      desc: "text-purple-700/80 dark:text-purple-300/80",
      flame: "text-blue-500 dark:text-blue-400",
      badges: [
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700",
        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700",
        "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/40 dark:text-violet-200 dark:border-violet-700",
        "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/40 dark:text-pink-200 dark:border-pink-700",
      ],
      button: "bg-purple-600 hover:bg-purple-700",
    },
    skeleton: ["border-purple-200 dark:border-purple-800", "from-purple-50 dark:from-purple-950/30", "via-blue-50 dark:via-blue-950/20", "to-violet-50 dark:to-violet-950/20", "bg-purple-200/60 dark:bg-purple-800/40"],
  },
  {
    topic: "Coding Decoding",
    title: "Coding Decoding Challenge",
    description: "Letter shifting, number coding, symbol substitution, word coding, condition-based coding & more",
    icon: KeyRound,
    defaultSection: "Reasoning",
    difficultyLabel: "Easy to Hard",
    buttonLabel: "Take Challenge",
    colors: {
      card: "border-slate-200 bg-gradient-to-r from-slate-50 via-zinc-50 to-stone-50 dark:from-slate-950/30 dark:via-zinc-950/20 dark:to-stone-950/20 dark:border-slate-700",
      circle1: "bg-slate-100/40 dark:bg-slate-800/10",
      circle2: "bg-zinc-100/40 dark:bg-zinc-800/10",
      iconBg: "bg-slate-100 dark:bg-slate-800/60",
      iconColor: "text-slate-600 dark:text-slate-300",
      title: "text-slate-900 dark:text-slate-100",
      desc: "text-slate-700/80 dark:text-slate-300/80",
      flame: "text-zinc-500 dark:text-zinc-400",
      badges: [
        "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800/40 dark:text-slate-200 dark:border-slate-600",
        "bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-200 dark:border-zinc-600",
        "bg-stone-100 text-stone-800 border-stone-200 dark:bg-stone-800/40 dark:text-stone-200 dark:border-stone-600",
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700",
      ],
      button: "bg-slate-700 hover:bg-slate-800",
    },
    skeleton: ["border-slate-200 dark:border-slate-700", "from-slate-50 dark:from-slate-950/30", "via-zinc-50 dark:via-zinc-950/20", "to-stone-50 dark:to-stone-950/20", "bg-slate-200/60 dark:bg-slate-700/40"],
  },
  {
    topic: "Percentage",
    title: "Percentage Challenge",
    description: "Simple percentage, successive change, percentage increase & decrease, population & depreciation problems",
    icon: Percent,
    defaultSection: "Numerical",
    difficultyLabel: "Easy to Hard",
    buttonLabel: "Take Challenge",
    colors: {
      card: "border-orange-200 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-yellow-950/20 dark:border-orange-800",
      circle1: "bg-orange-100/40 dark:bg-orange-900/10",
      circle2: "bg-amber-100/40 dark:bg-amber-900/10",
      iconBg: "bg-orange-100 dark:bg-orange-900/40",
      iconColor: "text-orange-600 dark:text-orange-400",
      title: "text-orange-900 dark:text-orange-100",
      desc: "text-orange-700/80 dark:text-orange-300/80",
      flame: "text-amber-500 dark:text-amber-400",
      badges: [
        "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-200 dark:border-orange-700",
        "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700",
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-700",
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700",
      ],
      button: "bg-orange-600 hover:bg-orange-700",
    },
    skeleton: ["border-orange-200 dark:border-orange-800", "from-orange-50 dark:from-orange-950/30", "via-amber-50 dark:via-amber-950/20", "to-yellow-50 dark:to-yellow-950/20", "bg-orange-200/60 dark:bg-orange-800/40"],
  },
];

const passagePreview = (
  <div className="rounded-lg border border-indigo-200 dark:border-indigo-700/50 bg-white/80 dark:bg-indigo-950/40 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
    <div className="text-indigo-900/80 dark:text-indigo-200/80 leading-relaxed">
      <p>
        Once two friends were passing through a{" "}
        <span className="text-indigo-500 dark:text-indigo-400 font-bold">...(1)...</span>{" "}
        forest. A bear came out of its cave. It began to{" "}
        <span className="text-indigo-500 dark:text-indigo-400 font-bold">...(2)...</span>{" "}
        Both felt terrified. The fair-weather friend ran{" "}
        <span className="text-indigo-500 dark:text-indigo-400 font-bold">...(3)...</span>{" "}
        and climbed up a tall tree. The other laid himself on the ground and{" "}
        <span className="text-indigo-500 dark:text-indigo-400 font-bold">...(4)...</span>{" "}
        to be dead.
      </p>
    </div>
    <div className="space-y-1.5 text-indigo-800/90 dark:text-indigo-200/90 text-xs">
      <p><span className="font-semibold">1.</span> (A) volatile (B) precarious (C) dense (D) pugnacious</p>
      <p><span className="font-semibold">2.</span> (A) shout (B) roar (C) chirp (D) bleat</p>
      <p><span className="font-semibold">3.</span> (A) quick (B) hard (C) toward (D) for</p>
      <p><span className="font-semibold">4.</span> (A) alarmed (B) positioned (C) frightened (D) pretended</p>
    </div>
  </div>
);

const testCategories = [
  {
    title: "Foundation Section",
    description: "Core aptitude tests covering numerical, reasoning, and verbal abilities",
    badge: "25 Questions • 30 Minutes per test",
    tests: [
      {
        title: "Numerical Ability",
        description:
          "Percentages, Ratios, Time-Speed-Distance, Algebra, Geometry, Averages, Profit-Loss, Number Systems",
        questions: 25,
        duration: 30,
        icon: Calculator,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-950",
        href: "/tests/foundation?section=numerical",
      },
      {
        title: "Logical Reasoning",
        description:
          "Series, Blood Relations, Coding-Decoding, Syllogisms, Puzzles, Data Interpretation",
        questions: 25,
        duration: 30,
        icon: Brain,
        color: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-50 dark:bg-purple-950",
        href: "/tests/foundation?section=reasoning",
      },
      {
        title: "Verbal Ability",
        description:
          "Reading Comprehension, Grammar, Vocabulary, Sentence Correction",
        questions: 25,
        duration: 30,
        icon: BookOpen,
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-950",
        href: "/tests/foundation?section=verbal",
      },
    ],
  },
  {
    title: "Advanced Section",
    description: "Higher-level quantitative and reasoning problems",
    badge: "25 Questions • 30 Minutes",
    tests: [
      {
        title: "Advanced Quantitative & Reasoning",
        description:
          "Advanced level questions combining quantitative aptitude with complex reasoning",
        questions: 25,
        duration: 30,
        icon: Zap,
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-50 dark:bg-orange-950",
        href: "/tests/advanced",
      },
    ],
  },
];

export default function TestsPage() {
  const [topicTests, setTopicTests] = useState<Record<string, Test>>({});
  const [specialLoading, setSpecialLoading] = useState(true);

  useEffect(() => {
    async function loadSpecialTests() {
      try {
        const data = await fetchTests({ type: "topic_practice" });
        const map: Record<string, Test> = {};
        for (const t of data) {
          if (t.topic) map[t.topic] = t;
        }
        setTopicTests(map);
      } catch {
        // API not ready
      } finally {
        setSpecialLoading(false);
      }
    }
    loadSpecialTests();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tests</h1>
        <p className="text-muted-foreground mt-1">
          Choose a section to practice or take a full mock test
        </p>
      </div>

      {/* Full Mock Test */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Full Mock Test</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Complete TCS NQT exam simulation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex gap-3">
            <Badge variant="secondary">79 Questions</Badge>
            <Badge variant="secondary">120 Minutes</Badge>
            <Badge variant="secondary">All Sections</Badge>
          </div>
          <Button variant="secondary" render={<Link href="/tests/mock" />}>
              Start Test <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Loading skeletons */}
      {specialLoading && (
        <div className="space-y-6">
          {topicCards.map((config, i) => (
            <Card
              key={i}
              className={`relative overflow-hidden border-2 ${config.skeleton[0]} bg-gradient-to-r ${config.skeleton[1]} ${config.skeleton[2]} ${config.skeleton[3]}`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent" style={{ animationDelay: `${i * 200}ms` }} />
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg ${config.skeleton[4]} animate-pulse`} />
                  <div className="flex-1 space-y-2.5">
                    <div className={`h-5 w-48 rounded-md ${config.skeleton[4]} animate-pulse`} />
                    <div className={`h-3.5 w-72 rounded-md ${config.skeleton[4]} animate-pulse opacity-60`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {[20, 24, 22, 20].map((w, j) => (
                    <div key={j} className={`h-6 rounded-full ${config.skeleton[4]} animate-pulse`} style={{ width: `${w * 4}px`, animationDelay: `${j * 100}ms` }} />
                  ))}
                </div>
                <div className={`h-9 w-32 rounded-lg ${config.skeleton[4]} animate-pulse`} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Topic practice cards */}
      {!specialLoading &&
        topicCards.map((config) => {
          const test = topicTests[config.topic];
          if (!test) return null;
          return (
            <TopicTestCard
              key={config.topic}
              test={test}
              title={config.title}
              description={config.description}
              icon={config.icon}
              flameIcon={config.flameIcon}
              defaultSection={config.defaultSection}
              difficultyLabel={config.difficultyLabel}
              buttonLabel={config.buttonLabel}
              colors={config.colors}
              extraContent={
                config.topic === "Passage Fill in the Blank"
                  ? passagePreview
                  : undefined
              }
            />
          );
        })}

      {/* Test Categories */}
      {testCategories.map((category) => (
        <div key={category.title} className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{category.title}</h2>
            <p className="text-sm text-muted-foreground">
              {category.description}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {category.tests.map((test) => {
              const Icon = test.icon;
              return (
                <Link key={test.title} href={test.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div
                        className={`w-10 h-10 rounded-lg ${test.bg} flex items-center justify-center mb-2`}
                      >
                        <Icon className={`h-5 w-5 ${test.color}`} />
                      </div>
                      <CardTitle className="text-base">{test.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {test.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Badge variant="outline">{test.questions} Qs</Badge>
                        <Badge variant="outline">{test.duration} mins</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
