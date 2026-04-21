"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Monitor,
  BarChart3,
  BookOpen,
  ArrowRight,
  Clock,
  Layers,
  CheckCircle2,
  Zap,
  GraduationCap,
  HelpCircle,
  FileText,
  ChevronDown,
  Code2,
  Trophy,
  Calculator,
  Brain,
  MessageSquare,
  Users,
} from "lucide-react";

const faqData = [
  {
    q: "Is CrackNQT free?",
    a: "Yes, CrackNQT is completely free with no ads, no premium tier, and no hidden charges. Every feature is available to all students.",
  },
  {
    q: "Is this similar to the real TCS NQT exam?",
    a: "Yes. Our tests simulate the actual TCS NQT exam pattern with timed sections, the same question distribution, and section-locking — just like the real exam.",
  },
  {
    q: "Do I need to sign up to use CrackNQT?",
    a: "You can browse tests and topics without signing up. Creating a free account lets you save progress, track analytics, and resume tests.",
  },
  {
    q: "Are the questions repeated in every test?",
    a: "No. Every test attempt picks a fresh random set of 25 questions from our pool of 1000+ questions, so you get a different test each time.",
  },
  {
    q: "What sections does TCS NQT cover?",
    a: "TCS NQT covers Numerical Ability, Reasoning Ability, Verbal Ability, and Advanced Quantitative & Reasoning. CrackNQT has dedicated practice for all four.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqData.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

// ── Syllabus data ──
const syllabusData = {
  foundation: {
    title: "Foundation Section",
    duration: "75 mins",
    questions: "~65 Questions",
    audience: "All Candidates",
    icon: BookOpen,
    color: "blue",
    sections: [
      {
        name: "Numerical Ability",
        icon: Calculator,
        questions: "~26 Qs",
        difficulty: "moderate" as const,
        topics: ["Number Systems", "LCM & HCF", "Percentages", "Profit & Loss", "Time & Work", "Speed, Time & Distance", "Averages", "Ratios", "Mensuration", "Data Interpretation", "Series"],
        detail: "Data Interpretation (pie charts, tables, graphs) is a major focus area. Series questions test pattern recognition and number sequences.",
      },
      {
        name: "Verbal Ability",
        icon: MessageSquare,
        questions: "~24 Qs",
        difficulty: "low-moderate" as const,
        topics: ["Reading Comprehension", "Sentence Completion", "Error Identification", "Synonyms & Antonyms", "Para Jumbles", "Active/Passive Voice"],
        detail: "Reading Comprehension passages are lengthy. Grammar-based questions cover voice, tense, articles, and sentence structure.",
      },
      {
        name: "Reasoning Ability",
        icon: Brain,
        questions: "~15 Qs",
        difficulty: "moderate-hard" as const,
        topics: ["Seating Arrangements", "Blood Relations", "Coding-Decoding", "Direction Sense", "Syllogism", "Data Sufficiency", "Logical Puzzles"],
        detail: "Complex puzzles can span 4–5 questions. Seating arrangements frequently combine circular and linear patterns.",
      },
    ],
  },
  advanced: {
    title: "Advanced Section",
    duration: "115 mins",
    questions: "16–18 Questions",
    audience: "Shortlisted Candidates",
    icon: Zap,
    color: "violet",
    sections: [
      {
        name: "Advanced Quantitative & Reasoning",
        icon: Brain,
        questions: "14–16 Qs · 25 mins",
        difficulty: "hard" as const,
        topics: ["Permutations & Combinations", "Probability", "Logarithms", "Advanced Puzzles", "Spatial Reasoning"],
        detail: "Higher-level questions shared between quant and reasoning. Expect multi-step problems requiring deep analytical thinking.",
      },
      {
        name: "Advanced Coding",
        icon: Code2,
        questions: "2 Qs · 90 mins",
        difficulty: "hard" as const,
        topics: ["Arrays", "Strings", "Stacks", "Queues", "Sorting", "Searching", "Programming Constructs"],
        detail: "Two coding problems testing Data Structures & Algorithms. At least one fully solved problem is needed for Digital/Prime profiles.",
        languages: ["C", "C++", "Java", "Python", "Perl"],
      },
    ],
  },
};

const difficultyConfig: Record<string, { label: string; bg: string; text: string }> = {
  low: { label: "LOW", bg: "bg-green-100 dark:bg-green-900/50", text: "text-green-700 dark:text-green-300" },
  moderate: { label: "MODERATE", bg: "bg-amber-100 dark:bg-amber-900/50", text: "text-amber-700 dark:text-amber-300" },
  hard: { label: "HARD", bg: "bg-red-100 dark:bg-red-900/50", text: "text-red-700 dark:text-red-300" },
  "low-moderate": { label: "LOW–MODERATE", bg: "bg-green-100 dark:bg-green-900/50", text: "text-green-700 dark:text-green-300" },
  "moderate-hard": { label: "MODERATE–HARD", bg: "bg-orange-100 dark:bg-orange-900/50", text: "text-orange-700 dark:text-orange-300" },
};

// Intersection Observer hook for scroll animations
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const targets = el.querySelectorAll("[data-reveal]");
    targets.forEach((t) => observer.observe(t));

    return () => observer.disconnect();
  }, []);

  return ref;
}

export default function HomePage() {
  const scrollRef = useScrollReveal();
  const [foundationOpen, setFoundationOpen] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [expandedSubs, setExpandedSubs] = useState<Set<string>>(new Set());

  const toggleSub = useCallback((key: string) => {
    setExpandedSubs((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-950" ref={scrollRef}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 landing-slide-down">
        <div className="max-w-[1140px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/llog.png" alt="CrackNQT" width={32} height={32} className="rounded-lg" />
            <span className="text-xl font-black text-[#111827] dark:text-white tracking-tight">CrackNQT</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#374151] dark:text-gray-300 hover:text-[#111827] dark:hover:text-white transition-colors px-3 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="auth-btn text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-blue-500 dark:hover:bg-blue-600 px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 dark:shadow-blue-500/10 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-24 relative overflow-hidden hero-gradient">
        {/* Animated blue glow blob */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500 opacity-20 dark:opacity-[0.08] rounded-full blur-[120px] animate-pulse pointer-events-none" />

        {/* Floating soft dots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[15%] left-[10%] w-3 h-3 bg-blue-400 rounded-full opacity-20 dark:opacity-10 landing-dot-1" />
          <div className="absolute top-[22%] right-[14%] w-2.5 h-2.5 bg-indigo-400 rounded-full opacity-15 dark:opacity-[0.08] landing-dot-2" />
          <div className="absolute bottom-[30%] left-[18%] w-2 h-2 bg-blue-500 rounded-full opacity-20 dark:opacity-10 landing-dot-3" />
          <div className="absolute top-[55%] right-[8%] w-3.5 h-3.5 bg-blue-400 rounded-full opacity-10 dark:opacity-[0.06] landing-dot-4" />
          <div className="absolute top-[10%] right-[35%] w-2 h-2 bg-indigo-400 rounded-full opacity-15 dark:opacity-[0.08] landing-dot-5" />
          <div className="absolute bottom-[20%] right-[28%] w-3 h-3 bg-violet-400 rounded-full opacity-10 dark:opacity-[0.06] landing-dot-6" />
        </div>

        <div className="max-w-[1140px] mx-auto px-6 text-center relative z-10">
          {/* Trust pill — pop in */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50/80 dark:bg-blue-950/60 backdrop-blur-sm border border-blue-100 dark:border-blue-800 text-xs font-bold text-[#2563EB] dark:text-blue-400 mb-8 landing-scale-in tracking-wide uppercase">
            <Zap className="w-3.5 h-3.5" />
            100% Free &bull; No Ads &bull; Student Focused
          </div>

          {/* Heading — blur in */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#111827] dark:text-white tracking-tighter leading-[1.05] max-w-4xl mx-auto landing-blur-in landing-delay-100">
            Crack TCS NQT
            <br />
            <span className="landing-text-gradient">With Confidence</span>
          </h1>

          {/* Subtitle — fade up */}
          <p className="mt-7 text-lg sm:text-xl text-[#6B7280] dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium landing-fade-up landing-delay-200">
            Practice real exam-level questions, take mock tests, and track your performance — <span className="text-[#111827] dark:text-white font-bold">completely free, forever.</span>
          </p>

          {/* Buttons — slide up with bounce */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 landing-bounce-in landing-delay-300">
            <Link
              href="/register"
              className="auth-btn landing-cta-pulse inline-flex items-center gap-2.5 px-8 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-base rounded-2xl landing-cta-glow hover:shadow-[0_14px_40px_rgba(37,99,235,0.35)] transition-all"
            >
              Start Free Test
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="auth-btn inline-flex items-center gap-2 px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 text-[#111827] dark:text-white font-bold text-base rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
            >
              Explore Practice
            </Link>
          </div>

          {/* Stats — count up style with stagger */}
          <div className="flex items-center justify-center gap-10 sm:gap-16 mt-16">
            <div className="text-center landing-fade-up landing-delay-400">
              <p className="text-3xl sm:text-4xl font-black text-[#111827] dark:text-white landing-counter">1000+</p>
              <p className="text-xs sm:text-sm text-[#9CA3AF] dark:text-gray-500 mt-1 font-semibold uppercase tracking-wide">Questions</p>
            </div>
            <div className="w-px h-12 bg-gray-200 dark:bg-gray-700 landing-scale-y landing-delay-400" />
            <div className="text-center landing-fade-up" style={{ animationDelay: "500ms" }}>
              <p className="text-3xl sm:text-4xl font-black text-[#111827] dark:text-white">4</p>
              <p className="text-xs sm:text-sm text-[#9CA3AF] dark:text-gray-500 mt-1 font-semibold uppercase tracking-wide">Sections</p>
            </div>
            <div className="w-px h-12 bg-gray-200 dark:bg-gray-700 landing-scale-y" style={{ animationDelay: "500ms" }} />
            <div className="text-center landing-fade-up" style={{ animationDelay: "600ms" }}>
              <p className="text-3xl sm:text-4xl font-black text-[#2563EB] dark:text-blue-400">100%</p>
              <p className="text-xs sm:text-sm text-[#9CA3AF] dark:text-gray-500 mt-1 font-semibold uppercase tracking-wide">Free</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features — slide in from sides ── */}
      <section className="py-20 sm:py-24">
        <div className="max-w-[1140px] mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-black text-[#111827] dark:text-white tracking-tight text-center mb-4 reveal-fade-up" data-reveal>
            Everything You Need
          </h2>
          <p className="text-[#6B7280] dark:text-gray-400 text-center mb-14 text-base font-medium reveal-fade-up" data-reveal>
            One platform, zero cost.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Monitor,
                title: "Real Exam Simulation",
                desc: "Timed tests with section locking, tab-switch detection, and an interface that mirrors the actual TCS NQT exam.",
                color: "bg-blue-50 dark:bg-blue-950",
                iconColor: "text-[#2563EB] dark:text-blue-400",
                anim: "reveal-slide-left",
              },
              {
                icon: BarChart3,
                title: "Smart Analytics",
                desc: "Track accuracy, speed, and weak areas with detailed section-wise and topic-wise breakdowns after every test.",
                color: "bg-emerald-50 dark:bg-emerald-950",
                iconColor: "text-emerald-600 dark:text-emerald-400",
                anim: "reveal-scale-up",
              },
              {
                icon: BookOpen,
                title: "Topic-wise Practice",
                desc: "Practice by topic — Percentages, Reasoning, Grammar, and more. New questions every attempt, never repeated.",
                color: "bg-violet-50 dark:bg-violet-950",
                iconColor: "text-violet-600 dark:text-violet-400",
                anim: "reveal-slide-right",
              },
            ].map((f, i) => (
              <div
                key={f.title}
                className={`group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 hover:shadow-xl hover:shadow-gray-100/80 dark:hover:shadow-black/30 hover:border-gray-200 dark:hover:border-gray-700 hover:-translate-y-1 transition-all duration-300 ${f.anim}`}
                data-reveal
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <f.icon className={`w-6 h-6 ${f.iconColor}`} />
                </div>
                <h3 className="text-lg font-black text-[#111827] dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-[#6B7280] dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Test Preview — cards flip in ── */}
      <section className="py-20 sm:py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827] dark:text-white tracking-tight reveal-fade-up" data-reveal>
              Jump Right In
            </h2>
            <p className="text-[#6B7280] dark:text-gray-400 mt-3 text-base font-medium reveal-fade-up" data-reveal>
              Pick a section or take the full mock — no signup required to browse.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="group rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-[#F9FAFB] dark:bg-gray-800 p-7 flex flex-col justify-between hover:border-[#2563EB]/40 dark:hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 reveal-flip-up" data-reveal>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Layers className="w-5 h-5 text-[#2563EB] dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-black text-[#111827] dark:text-white">Numerical Ability</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#9CA3AF] dark:text-gray-500 font-semibold mb-6">
                  <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />25 Qs</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />30 Min</span>
                </div>
              </div>
              <Link href="/register" className="text-sm font-bold text-[#2563EB] dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                Start Test <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="group rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-[#F9FAFB] dark:bg-gray-800 p-7 flex flex-col justify-between hover:border-indigo-300/50 dark:hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 reveal-flip-up" data-reveal style={{ transitionDelay: "150ms" }}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                    <Monitor className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-black text-[#111827] dark:text-white">Full Mock Test</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#9CA3AF] dark:text-gray-500 font-semibold mb-6">
                  <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />79 Qs</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />120 Min</span>
                </div>
              </div>
              <Link href="/register" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                Start Test <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why CrackNQT — stagger slide in ── */}
      <section className="py-20 sm:py-24">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827] dark:text-white tracking-tight mb-10 reveal-fade-up" data-reveal>
              Why CrackNQT?
            </h2>
            <div className="space-y-4 text-left">
              {[
                "Completely free — no hidden charges, no premium tier, no paywalls.",
                "No ads or distractions — a clean, focused preparation environment.",
                "Built specifically for TCS NQT — not a generic quiz platform.",
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-6 py-5 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md transition-all duration-300 reveal-slide-left"
                  data-reveal
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-[15px] text-[#374151] dark:text-gray-300 leading-relaxed font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TCS NQT Details — interactive syllabus ── */}
      <section className="py-20 sm:py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* What is TCS NQT? */}
            <div className="flex items-center gap-3 mb-6 reveal-slide-left" data-reveal>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#2563EB] dark:text-blue-400" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#111827] dark:text-white tracking-tight">
                What is TCS NQT?
              </h2>
            </div>
            <p className="text-[15px] text-[#374151] dark:text-gray-300 leading-relaxed mb-12 reveal-fade-up" data-reveal>
              TCS NQT 2026 (National Qualifier Test) is a recruitment exam conducted by
              Tata Consultancy Services to hire freshers across India. The exam has two mandatory rounds —
              the <strong className="text-[#111827] dark:text-white">Foundation Section</strong> (aptitude) and
              the <strong className="text-[#111827] dark:text-white">Advanced Section</strong> (quantitative reasoning + coding).
              There is <strong className="text-[#111827] dark:text-white">no negative marking</strong> in either round.
              Qualifying opens doors to TCS Ninja, Digital, and Prime roles.{" "}
              <Link href="/register" className="text-[#2563EB] dark:text-blue-400 font-bold hover:underline">
                Start practicing for free on CrackNQT
              </Link>.
            </p>

            {/* TCS NQT 2026 Syllabus */}
            <div className="flex items-center gap-3 mb-8 reveal-slide-right" data-reveal>
              <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950 flex items-center justify-center">
                <FileText className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-2xl font-black text-[#111827] dark:text-white tracking-tight">
                TCS NQT 2026 Syllabus
              </h3>
            </div>

            <div className="space-y-5 reveal-fade-up" data-reveal>
              {/* Foundation Section */}
              {(() => {
                const fd = syllabusData.foundation;
                return (
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-[#F9FAFB] dark:bg-gray-800/50 overflow-hidden">
                    <button
                      onClick={() => setFoundationOpen(!foundationOpen)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5 text-[#2563EB] dark:text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-[#111827] dark:text-white text-lg">{fd.title}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B7280] dark:text-gray-400"><Clock className="w-3 h-3" />{fd.duration}</span>
                            <span className="text-gray-300 dark:text-gray-600">|</span>
                            <span className="text-xs font-semibold text-[#6B7280] dark:text-gray-400">{fd.questions}</span>
                            <span className="text-gray-300 dark:text-gray-600">|</span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B7280] dark:text-gray-400"><Users className="w-3 h-3" />{fd.audience}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0 transition-transform duration-300 ${foundationOpen ? "rotate-180" : ""}`} />
                    </button>

                    <div className={`transition-all duration-300 ease-in-out ${foundationOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
                      <div className="px-6 pb-6 space-y-4">
                        {fd.sections.map((sub) => {
                          const SubIcon = sub.icon;
                          const diff = difficultyConfig[sub.difficulty];
                          const isOpen = expandedSubs.has(sub.name);
                          return (
                            <div key={sub.name} className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                              <button
                                onClick={() => toggleSub(sub.name)}
                                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <SubIcon className="w-4.5 h-4.5 text-[#2563EB] dark:text-blue-400 shrink-0" />
                                  <span className="font-bold text-[#111827] dark:text-white text-sm">{sub.name}</span>
                                  <span className="text-xs text-[#9CA3AF] dark:text-gray-500 font-medium hidden sm:inline">{sub.questions}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${diff.bg} ${diff.text}`}>{diff.label}</span>
                                  <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                                </div>
                              </button>

                              <div className={`transition-all duration-200 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
                                <div className="px-5 pb-4 space-y-3">
                                  <div className="flex flex-wrap gap-1.5">
                                    {sub.topics.map((t) => (
                                      <span key={t} className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-[#374151] dark:text-gray-300">{t}</span>
                                    ))}
                                  </div>
                                  <p className="text-xs text-[#6B7280] dark:text-gray-400 leading-relaxed bg-blue-50/50 dark:bg-blue-950/30 rounded-lg px-3 py-2 border border-blue-100/50 dark:border-blue-900/30">
                                    {sub.detail}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Advanced Section */}
              {(() => {
                const ad = syllabusData.advanced;
                return (
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-[#F9FAFB] dark:bg-gray-800/50 overflow-hidden">
                    <button
                      onClick={() => setAdvancedOpen(!advancedOpen)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950 flex items-center justify-center shrink-0">
                          <Zap className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-[#111827] dark:text-white text-lg">{ad.title}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B7280] dark:text-gray-400"><Clock className="w-3 h-3" />{ad.duration}</span>
                            <span className="text-gray-300 dark:text-gray-600">|</span>
                            <span className="text-xs font-semibold text-[#6B7280] dark:text-gray-400">{ad.questions}</span>
                            <span className="text-gray-300 dark:text-gray-600">|</span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B7280] dark:text-gray-400"><Users className="w-3 h-3" />{ad.audience}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0 transition-transform duration-300 ${advancedOpen ? "rotate-180" : ""}`} />
                    </button>

                    <div className={`transition-all duration-300 ease-in-out ${advancedOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
                      <div className="px-6 pb-6 space-y-4">
                        {ad.sections.map((sub) => {
                          const SubIcon = sub.icon;
                          const diff = difficultyConfig[sub.difficulty];
                          const isOpen = expandedSubs.has(sub.name);
                          return (
                            <div key={sub.name} className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                              <button
                                onClick={() => toggleSub(sub.name)}
                                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <SubIcon className="w-4.5 h-4.5 text-violet-600 dark:text-violet-400 shrink-0" />
                                  <span className="font-bold text-[#111827] dark:text-white text-sm">{sub.name}</span>
                                  <span className="text-xs text-[#9CA3AF] dark:text-gray-500 font-medium hidden sm:inline">{sub.questions}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${diff.bg} ${diff.text}`}>{diff.label}</span>
                                  <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                                </div>
                              </button>

                              <div className={`transition-all duration-200 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
                                <div className="px-5 pb-4 space-y-3">
                                  <div className="flex flex-wrap gap-1.5">
                                    {sub.topics.map((t) => (
                                      <span key={t} className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-[#374151] dark:text-gray-300">{t}</span>
                                    ))}
                                  </div>
                                  {"languages" in sub && sub.languages && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-semibold text-[#6B7280] dark:text-gray-400">Languages:</span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {sub.languages.map((lang) => (
                                          <span key={lang} className="px-2 py-0.5 rounded bg-violet-50 dark:bg-violet-950 text-xs font-bold text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">{lang}</span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  <p className="text-xs text-[#6B7280] dark:text-gray-400 leading-relaxed bg-violet-50/50 dark:bg-violet-950/30 rounded-lg px-3 py-2 border border-violet-100/50 dark:border-violet-900/30">
                                    {sub.detail}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Summary Table */}
            <div className="mt-10 reveal-fade-up" data-reveal>
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="text-left px-5 py-3 font-bold text-[#111827] dark:text-white">Section</th>
                      <th className="text-left px-5 py-3 font-bold text-[#111827] dark:text-white">Duration</th>
                      <th className="text-left px-5 py-3 font-bold text-[#111827] dark:text-white">Questions</th>
                      <th className="text-left px-5 py-3 font-bold text-[#111827] dark:text-white">Key Topics</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800/50">
                    <tr className="border-t border-gray-100 dark:border-gray-700">
                      <td className="px-5 py-3 font-semibold text-[#111827] dark:text-white">Foundation</td>
                      <td className="px-5 py-3 text-[#6B7280] dark:text-gray-400">75 mins</td>
                      <td className="px-5 py-3 text-[#6B7280] dark:text-gray-400">~65</td>
                      <td className="px-5 py-3 text-[#6B7280] dark:text-gray-400">Numerical, Verbal, Reasoning</td>
                    </tr>
                    <tr className="border-t border-gray-100 dark:border-gray-700">
                      <td className="px-5 py-3 font-semibold text-[#111827] dark:text-white">Advanced (MCQ)</td>
                      <td className="px-5 py-3 text-[#6B7280] dark:text-gray-400">25 mins</td>
                      <td className="px-5 py-3 text-[#6B7280] dark:text-gray-400">14–16</td>
                      <td className="px-5 py-3 text-[#6B7280] dark:text-gray-400">Advanced Quant, Reasoning, Puzzles</td>
                    </tr>
                    <tr className="border-t border-gray-100 dark:border-gray-700">
                      <td className="px-5 py-3 font-semibold text-[#111827] dark:text-white">Advanced (Coding)</td>
                      <td className="px-5 py-3 text-[#6B7280] dark:text-gray-400">90 mins</td>
                      <td className="px-5 py-3 text-[#6B7280] dark:text-gray-400">2</td>
                      <td className="px-5 py-3 text-[#6B7280] dark:text-gray-400">DSA, Arrays, Strings, Algorithms</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Eligibility & Cut-offs */}
            <div className="mt-8 rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 p-6 reveal-scale-up" data-reveal>
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                <h4 className="font-black text-[#111827] dark:text-white text-lg">Eligibility & Cut-offs</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-[#374151] dark:text-gray-300"><strong className="text-[#111827] dark:text-white">Eligibility:</strong> Minimum 60% aggregate with no active backlogs</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-[#374151] dark:text-gray-300"><strong className="text-[#111827] dark:text-white">TCS Ninja:</strong> Score 40–45 out of 65 in Foundation round</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-violet-500 dark:text-violet-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-[#374151] dark:text-gray-300"><strong className="text-[#111827] dark:text-white">Digital / Prime:</strong> Clear Advanced section with at least 1 fully solved coding problem</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ — accordion style reveal ── */}
      <section className="py-20 sm:py-24">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-10 reveal-fade-up" data-reveal>
              <HelpCircle className="w-7 h-7 text-[#2563EB] dark:text-blue-400" />
              <h2 className="text-3xl sm:text-4xl font-black text-[#111827] dark:text-white tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-4">
              {faqData.map((item, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-6 py-5 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all duration-300 reveal-slide-right"
                  data-reveal
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <h3 className="font-black text-[#111827] dark:text-white text-[15px] mb-2">{item.q}</h3>
                  <p className="text-sm text-[#6B7280] dark:text-gray-400 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA — zoom in on scroll ── */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl auth-bg-glow" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-white/5 blur-3xl auth-bg-glow-2" />

        <div className="relative z-10 max-w-[1140px] mx-auto px-6 text-center reveal-scale-up" data-reveal>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Start Your Preparation Today
          </h2>
          <p className="text-blue-100 mt-4 text-base sm:text-lg max-w-lg mx-auto font-medium">
            Join thousands of students cracking TCS NQT. No barriers — just practice.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              href="/register"
              className="auth-btn landing-cta-pulse inline-flex items-center gap-2.5 px-10 py-4 bg-white text-[#2563EB] font-black text-base rounded-2xl hover:bg-blue-50 shadow-xl shadow-black/10 transition-all"
            >
              Begin Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/tests/mock"
              className="inline-flex items-center gap-2 px-8 py-4 text-white/90 font-bold text-sm rounded-2xl border-2 border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
            >
              Take Mock Test
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#111827] dark:bg-black text-white py-14">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="grid sm:grid-cols-4 gap-10 mb-10">
            <div className="sm:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <Image src="/llog.png" alt="CrackNQT" width={28} height={28} className="rounded-lg" />
                <span className="text-lg font-black">CrackNQT</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Free TCS NQT preparation platform. No ads, no charges — built for students.
              </p>
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-wider text-gray-400 mb-4">Practice</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/tests/foundation?section=numerical" className="text-gray-300 hover:text-white transition-colors">Numerical Ability</Link></li>
                <li><Link href="/tests/foundation?section=reasoning" className="text-gray-300 hover:text-white transition-colors">Reasoning Ability</Link></li>
                <li><Link href="/tests/foundation?section=verbal" className="text-gray-300 hover:text-white transition-colors">Verbal Ability</Link></li>
                <li><Link href="/tests/advanced" className="text-gray-300 hover:text-white transition-colors">Advanced Section</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-wider text-gray-400 mb-4">Tests</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/tests" className="text-gray-300 hover:text-white transition-colors">All Tests</Link></li>
                <li><Link href="/tests/mock" className="text-gray-300 hover:text-white transition-colors">Full Mock Test</Link></li>
                <li><Link href="/practice" className="text-gray-300 hover:text-white transition-colors">Topic Practice</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-wider text-gray-400 mb-4">Account</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/login" className="text-gray-300 hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/register" className="text-gray-300 hover:text-white transition-colors">Create Account</Link></li>
                <li><Link href="/sitemap.xml" className="text-gray-300 hover:text-white transition-colors">Sitemap</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-700 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} CrackNQT. All rights reserved. Not affiliated with TCS.
            </p>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                No Ads
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-xs font-semibold text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                100% Free
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
