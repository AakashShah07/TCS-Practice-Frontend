import Link from "next/link";
import Image from "next/image";
import {
  Monitor,
  BarChart3,
  BookOpen,
  ArrowRight,
  Clock,
  Layers,
  CheckCircle2,
  Zap,
  PenTool,
  Pencil,
  PenLine,
  GraduationCap,
  HelpCircle,
  FileText,
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1140px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/llog.png" alt="CrackNQT" width={32} height={32} className="rounded-lg" />
            <span className="text-xl font-black text-[#111827] tracking-tight">CrackNQT</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#374151] hover:text-[#111827] transition-colors px-3 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="auth-btn text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-24 relative overflow-hidden hero-gradient">
        {/* Animated blur blob behind heading */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full landing-blob pointer-events-none" />

        {/* Floating pens background — low opacity, alive UI */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <PenTool className="absolute top-[12%] left-[6%] w-10 h-10 text-blue-400/[0.07] landing-pen-1" />
          <Pencil className="absolute top-[20%] right-[10%] w-9 h-9 text-indigo-400/[0.06] landing-pen-2" />
          <PenLine className="absolute bottom-[28%] left-[12%] w-8 h-8 text-blue-500/[0.05] landing-pen-3" />
          <PenTool className="absolute top-[55%] right-[6%] w-11 h-11 text-blue-400/[0.05] landing-pen-4" />
          <Pencil className="absolute top-[8%] right-[32%] w-7 h-7 text-indigo-400/[0.08] landing-pen-5" />
          <PenLine className="absolute bottom-[18%] right-[22%] w-8 h-8 text-blue-400/[0.06] landing-pen-6" />
          <PenTool className="absolute bottom-[12%] left-[28%] w-7 h-7 text-indigo-400/[0.05] landing-pen-2" />
          <Pencil className="absolute top-[42%] left-[4%] w-9 h-9 text-blue-500/[0.04] landing-pen-4" />
          <PenLine className="absolute top-[35%] left-[42%] w-6 h-6 text-indigo-300/[0.06] landing-pen-1" />
          <PenTool className="absolute bottom-[35%] right-[38%] w-6 h-6 text-blue-300/[0.07] landing-pen-6" />
        </div>

        <div className="max-w-[1140px] mx-auto px-6 text-center relative z-10">
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50/80 backdrop-blur-sm border border-blue-100 text-xs font-bold text-[#2563EB] mb-8 landing-fade-up tracking-wide uppercase">
            <Zap className="w-3.5 h-3.5" />
            100% Free &bull; No Ads &bull; Student Focused
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#111827] tracking-tighter leading-[1.05] max-w-4xl mx-auto landing-fade-up landing-delay-100">
            Crack TCS NQT
            <br />
            <span className="landing-text-gradient">With Confidence</span>
          </h1>

          <p className="mt-7 text-lg sm:text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed font-medium landing-fade-up landing-delay-200">
            Practice real exam-level questions, take mock tests, and track your performance — <span className="text-[#111827] font-bold">completely free, forever.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 landing-fade-up landing-delay-300">
            <Link
              href="/register"
              className="auth-btn inline-flex items-center gap-2.5 px-8 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-base rounded-2xl landing-cta-glow hover:shadow-[0_14px_40px_rgba(37,99,235,0.35)] transition-all"
            >
              Start Free Test
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="auth-btn inline-flex items-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm hover:bg-white text-[#111827] font-bold text-base rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all"
            >
              Explore Practice
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-10 sm:gap-16 mt-16 landing-fade-up landing-delay-400">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-black text-[#111827]">1000+</p>
              <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1 font-semibold uppercase tracking-wide">Questions</p>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-black text-[#111827]">4</p>
              <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1 font-semibold uppercase tracking-wide">Sections</p>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-black text-[#2563EB]">100%</p>
              <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1 font-semibold uppercase tracking-wide">Free</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 sm:py-24">
        <div className="max-w-[1140px] mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight text-center mb-4 landing-fade-up">
            Everything You Need
          </h2>
          <p className="text-[#6B7280] text-center mb-14 text-base font-medium landing-fade-up">
            One platform, zero cost.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Monitor,
                title: "Real Exam Simulation",
                desc: "Timed tests with section locking, tab-switch detection, and an interface that mirrors the actual TCS NQT exam.",
                color: "bg-blue-50",
                iconColor: "text-[#2563EB]",
              },
              {
                icon: BarChart3,
                title: "Smart Analytics",
                desc: "Track accuracy, speed, and weak areas with detailed section-wise and topic-wise breakdowns after every test.",
                color: "bg-emerald-50",
                iconColor: "text-emerald-600",
              },
              {
                icon: BookOpen,
                title: "Topic-wise Practice",
                desc: "Practice by topic — Percentages, Reasoning, Grammar, and more. New questions every attempt, never repeated.",
                color: "bg-violet-50",
                iconColor: "text-violet-600",
              },
            ].map((f, i) => (
              <div
                key={f.title}
                className={`group bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl hover:shadow-gray-100/80 hover:border-gray-200 hover:-translate-y-1 transition-all duration-300 landing-fade-up`}
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className={`w-6 h-6 ${f.iconColor}`} />
                </div>
                <h3 className="text-lg font-black text-[#111827] mb-2">{f.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Test Preview ── */}
      <section className="py-20 sm:py-24 bg-white border-y border-gray-100">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
              Jump Right In
            </h2>
            <p className="text-[#6B7280] mt-3 text-base font-medium">
              Pick a section or take the full mock — no signup required to browse.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Card 1 */}
            <div className="group rounded-2xl border-2 border-gray-100 bg-[#F9FAFB] p-7 flex flex-col justify-between hover:border-[#2563EB]/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Layers className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <h3 className="text-lg font-black text-[#111827]">Numerical Ability</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#9CA3AF] font-semibold mb-6">
                  <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />25 Qs</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />30 Min</span>
                </div>
              </div>
              <Link
                href="/register"
                className="text-sm font-bold text-[#2563EB] hover:text-blue-700 flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
              >
                Start Test <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="group rounded-2xl border-2 border-gray-100 bg-[#F9FAFB] p-7 flex flex-col justify-between hover:border-indigo-300/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Monitor className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-black text-[#111827]">Full Mock Test</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#9CA3AF] font-semibold mb-6">
                  <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />79 Qs</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />120 Min</span>
                </div>
              </div>
              <Link
                href="/register"
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
              >
                Start Test <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why CrackNQT ── */}
      <section className="py-20 sm:py-24">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight mb-10">
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
                  className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 px-6 py-5 hover:border-emerald-200 hover:shadow-md transition-all duration-300"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-[15px] text-[#374151] leading-relaxed font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TCS NQT Details (SEO) ── */}
      <section className="py-20 sm:py-24 bg-white border-y border-gray-100">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#2563EB]" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
                What is TCS NQT?
              </h2>
            </div>
            <p className="text-[15px] text-[#374151] leading-relaxed mb-10">
              TCS NQT (National Qualifier Test) is a recruitment exam conducted by
              Tata Consultancy Services to hire freshers across India. It tests
              candidates on core aptitude skills including Numerical Ability,
              Reasoning Ability, and Verbal Ability. Qualifying TCS NQT opens doors
              to roles at TCS and other companies that accept NQT scores.{" "}
              <Link href="/register" className="text-[#2563EB] font-bold hover:underline">
                Start practicing for free on CrackNQT
              </Link>.
            </p>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="text-2xl font-black text-[#111827] tracking-tight">
                TCS NQT Syllabus
              </h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-[#F9FAFB] rounded-2xl p-5 border border-gray-100">
                <h4 className="font-black text-[#111827] mb-3">Numerical Ability</h4>
                <ul className="space-y-1.5 text-sm text-[#6B7280]">
                  <li>Percentages</li>
                  <li>Profit &amp; Loss</li>
                  <li>Time &amp; Work</li>
                  <li>Ratios &amp; Averages</li>
                  <li>Algebra &amp; Geometry</li>
                </ul>
                <Link href="/practice" className="text-xs font-bold text-[#2563EB] hover:underline mt-3 inline-flex items-center gap-1">
                  Practice Numerical <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="bg-[#F9FAFB] rounded-2xl p-5 border border-gray-100">
                <h4 className="font-black text-[#111827] mb-3">Reasoning Ability</h4>
                <ul className="space-y-1.5 text-sm text-[#6B7280]">
                  <li>Coding-Decoding</li>
                  <li>Series &amp; Patterns</li>
                  <li>Puzzles &amp; Seating</li>
                  <li>Blood Relations</li>
                  <li>Syllogisms</li>
                </ul>
                <Link href="/practice" className="text-xs font-bold text-[#2563EB] hover:underline mt-3 inline-flex items-center gap-1">
                  Practice Reasoning <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="bg-[#F9FAFB] rounded-2xl p-5 border border-gray-100">
                <h4 className="font-black text-[#111827] mb-3">Verbal Ability</h4>
                <ul className="space-y-1.5 text-sm text-[#6B7280]">
                  <li>Grammar &amp; Vocabulary</li>
                  <li>Reading Comprehension</li>
                  <li>Sentence Correction</li>
                  <li>Error Spotting</li>
                  <li>Para Jumbles</li>
                </ul>
                <Link href="/practice" className="text-xs font-bold text-[#2563EB] hover:underline mt-3 inline-flex items-center gap-1">
                  Practice Verbal <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 sm:py-24">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-10">
              <HelpCircle className="w-7 h-7 text-[#2563EB]" />
              <h2 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-4">
              {faqData.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 px-6 py-5 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                >
                  <h3 className="font-black text-[#111827] text-[15px] mb-2">{item.q}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl auth-bg-glow" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-white/5 blur-3xl auth-bg-glow-2" />

        <PenTool className="absolute top-[20%] left-[10%] w-7 h-7 text-white/10 landing-pen-1" />
        <Pencil className="absolute bottom-[25%] right-[12%] w-6 h-6 text-white/8 landing-pen-3" />
        <PenLine className="absolute top-[30%] right-[20%] w-8 h-8 text-white/6 landing-pen-5" />

        <div className="relative z-10 max-w-[1140px] mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Start Your Preparation Today
          </h2>
          <p className="text-blue-100 mt-4 text-base sm:text-lg max-w-lg mx-auto font-medium">
            Join thousands of students cracking TCS NQT. No barriers — just practice.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              href="/register"
              className="auth-btn inline-flex items-center gap-2.5 px-10 py-4 bg-white text-[#2563EB] font-black text-base rounded-2xl hover:bg-blue-50 shadow-xl shadow-black/10 transition-all"
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
      <footer className="bg-[#111827] text-white py-14">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="grid sm:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="sm:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <Image src="/llog.png" alt="CrackNQT" width={28} height={28} className="rounded-lg" />
                <span className="text-lg font-black">CrackNQT</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Free TCS NQT preparation platform. No ads, no charges — built for students.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-black text-sm uppercase tracking-wider text-gray-400 mb-4">Practice</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/tests/foundation?section=numerical" className="text-gray-300 hover:text-white transition-colors">Numerical Ability</Link></li>
                <li><Link href="/tests/foundation?section=reasoning" className="text-gray-300 hover:text-white transition-colors">Reasoning Ability</Link></li>
                <li><Link href="/tests/foundation?section=verbal" className="text-gray-300 hover:text-white transition-colors">Verbal Ability</Link></li>
                <li><Link href="/tests/advanced" className="text-gray-300 hover:text-white transition-colors">Advanced Section</Link></li>
              </ul>
            </div>

            {/* Tests */}
            <div>
              <h4 className="font-black text-sm uppercase tracking-wider text-gray-400 mb-4">Tests</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/tests" className="text-gray-300 hover:text-white transition-colors">All Tests</Link></li>
                <li><Link href="/tests/mock" className="text-gray-300 hover:text-white transition-colors">Full Mock Test</Link></li>
                <li><Link href="/practice" className="text-gray-300 hover:text-white transition-colors">Topic Practice</Link></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-black text-sm uppercase tracking-wider text-gray-400 mb-4">Account</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/login" className="text-gray-300 hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/register" className="text-gray-300 hover:text-white transition-colors">Create Account</Link></li>
                <li><Link href="/sitemap.xml" className="text-gray-300 hover:text-white transition-colors">Sitemap</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
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
