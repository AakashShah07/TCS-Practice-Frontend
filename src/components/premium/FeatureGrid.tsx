"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  BarChart3,
  BrainCircuit,
  Code2,
  Trophy,
  BookOpen,
  Zap,
  MessageSquare,
  Check,
  Crown,
  ArrowUpRight,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

function FeatureCard({
  title,
  description,
  icon: Icon,
  className = "",
  index,
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  index: number;
  children: React.ReactNode;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0, mx: "50%", my: "50%" });

  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 6;
    const rotateX = (0.5 - (y / rect.height)) * 6;

    setTilt({
      x: Math.max(-6, Math.min(6, rotateX)),
      y: Math.max(-6, Math.min(6, rotateY)),
      mx: `${(x / rect.width) * 100}%`,
      my: `${(y / rect.height) * 100}%`,
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.08, duration: 0.7, ease: "easeOut" }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0, mx: "50%", my: "50%" })}
      whileHover={{ scale: 1.015, y: -6 }}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      className={`group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 shadow-lg shadow-slate-950/5 dark:border-white/12 dark:bg-[#14151b] dark:shadow-none ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at ${tilt.mx} ${tilt.my}, rgba(168,85,247,0.34), transparent 44%)`,
        }}
      />
      <div className="absolute -inset-px rounded-[28px] border border-transparent group-hover:border-violet-300/60 group-hover:shadow-[0_0_24px_rgba(168,85,247,0.2)] transition-all duration-300" />
      <div className="relative h-full rounded-[27px] p-6 backdrop-blur-xl bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(246,248,252,0.92))] dark:bg-[linear-gradient(180deg,rgba(30,31,41,0.96),rgba(22,23,31,0.92))]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_0%,rgba(124,58,237,0.12),transparent_52%)] opacity-70" />

        <div className="flex items-center justify-between">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-violet-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-violet-200">
            <Icon className="h-5 w-5" />
          </div>
          <div className="translate-y-1 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-700 dark:text-violet-100">
              Explore <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="mb-3">
            <h3 className="text-xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 dark:text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 transition duration-300 group-hover:text-slate-900 dark:text-white/58 dark:group-hover:text-white/78">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </motion.article>
  );
}

export default function FeatureGrid() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-18 lg:py-24 bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] text-slate-950 dark:bg-[linear-gradient(180deg,#080a11_0%,#151520_100%)] dark:text-white">
      <div className="absolute inset-0 -z-30 opacity-90">
        <div className="absolute left-1/2 -top-45 h-105 w-105 -translate-x-1/2 rounded-full bg-violet-500/20 blur-[130px] dark:bg-violet-500/30" />
      </div>

      <div
        className="absolute inset-0 -z-20 opacity-20 dark:opacity-30"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px, 56px 56px",
        }}
      />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-700 dark:text-violet-100">
            <SparkTrail />
            Premium Intelligence Platform
          </div>
          <h2 className="text-balance text-4xl font-semibold leading-none tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
            ONE PAYMENT. EVERYTHING UNLOCKED.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base dark:text-white/62">
            Everything You Need
to Crack TCS NQT
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            title="50+ Full Mock Tests"
            description="Exam-style pressure testing across the full TCS NQT flow."
            icon={FileText}
            index={0}
            className="min-h-82.5 sm:col-span-2 lg:col-span-2"
          >
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-black/25">
              <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.15em] text-slate-600 dark:text-white/70">
                <span>Mock Test #24</span>
                <span className="rounded-full border border-emerald-300/30 bg-emerald-400/12 px-2 py-1 text-[10px] text-emerald-700 dark:text-emerald-200">Completed</span>
              </div>
              <div className="mt-5 h-2 rounded-full bg-slate-200 dark:bg-white/6">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "72%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full bg-linear-to-r from-violet-400 to-purple-500"
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-950 dark:text-white">72 / 80</span>
                <span className="text-slate-500 dark:text-white/60">Time: 47:32</span>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="AI Performance Analytics"
            description="Your prep intelligence layer, turning attempts into next-best actions."
            icon={BarChart3}
            index={1}
            className="min-h-82.5 sm:col-span-2 lg:col-span-2"
          >
            <div className="mt-5 rounded-2xl border border-violet-300/20 bg-slate-50/90 p-4 dark:bg-black/30">
              <div className="grid grid-cols-3 gap-3 text-xs text-slate-600 dark:text-white/70">
                <div>
                  <div className="mb-1 text-[10px] uppercase tracking-[0.18em]">Accuracy</div>
                  <div className="font-semibold text-slate-950 dark:text-white">87%</div>
                </div>
                <div>
                  <div className="mb-1 text-[10px] uppercase tracking-[0.18em]">Speed</div>
                  <div className="font-semibold text-slate-950 dark:text-white">91%</div>
                </div>
                <div>
                  <div className="mb-1 text-[10px] uppercase tracking-[0.18em]">Consistency</div>
                  <div className="font-semibold text-slate-950 dark:text-white">84%</div>
                </div>
              </div>

              <div className="mt-6">
                <svg viewBox="0 0 280 90" className="h-20 w-full">
                  <motion.path
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    d="M 0 78 C 24 78, 24 56, 48 56 S 70 28, 94 30 S 126 60, 150 50 S 176 18, 196 26 S 220 54, 280 10"
                    fill="none"
                    stroke="url(#analyticsGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_12px_rgba(255,255,255,0.45)]"
                  />
                  <defs>
                    <linearGradient id="analyticsGradient" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0" stopColor="#a78bfa" />
                      <stop offset="1" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-300">
                <TrendingUp className="h-4 w-4" />
                <span className="font-semibold">↑ 14% improvement</span>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Weak Topic Detection"
            description="Pinpoints where your score is leaking and what to revise next."
            icon={BrainCircuit}
            index={2}
            className="min-h-62.5 sm:min-h-65"
          >
            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-[11px] uppercase text-slate-600 dark:text-white/60">
                  <span>Weak Topics</span>
                  <span className="text-rose-600 dark:text-rose-300">Geometry</span>
                </div>
                <div className="space-y-3">
                  {[
                    ["Geometry", 92, "from-rose-400 to-pink-500"],
                    ["Probability", 62, "from-violet-500 to-purple-500"],
                    ["Algebra", 48, "from-sky-400 to-indigo-500"],
                  ].map(([label, width, color], idx) => (
                    <div key={label}>
                      <div className="mb-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-white/50">
                        <span>{label}</span>
                        <span>{width}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/7">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${width}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: idx * 0.1 }}
                          className={`h-full rounded-full bg-linear-to-r ${color} ${idx === 0 ? "group-hover:shadow-[0_0_12px_rgba(251,113,133,0.55)]" : ""}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Coding Practice"
            description="Solve sharpened programming questions with performance feedback."
            icon={Code2}
            index={3}
            className="min-h-62.5 sm:min-h-65"
          >
            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-slate-950 p-4 font-mono text-[11px] text-cyan-100 dark:bg-[#111820]">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
              </div>
              <div className="leading-6 text-slate-300 dark:text-white/80">
                <div>function solve(arr) {'{'}</div>
                <div className="pl-4">return arr.length;</div>
                <div>{'}'}</div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald-300">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                <span>✓ 42 / 50 solved</span>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="TCS Prime Preparation"
            description="A focused path for Prime-ready skills, tests and communication strength."
            icon={Trophy}
            index={4}
            className="min-h-62.5 sm:min-h-65"
          >
            <div className="mt-5 rounded-2xl border border-amber-300/20 bg-[linear-gradient(135deg,rgba(168,85,247,0.18),rgba(251,191,36,0.09))] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-100/90">TCS PRIME</div>
                  <div className="mt-2 text-[11px] text-slate-600 dark:text-white/65">Preparation Level</div>
                </div>
                <span className="text-amber-600 dark:text-amber-200"><Crown className="h-6 w-6" /></span>
              </div>

              <div className="mt-4 h-2 rounded-full bg-slate-200 dark:bg-white/8">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "92%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full bg-linear-to-r from-amber-300 to-violet-400"
                />
              </div>
              <div className="mt-3 text-right text-sm font-semibold text-slate-800 dark:text-white/90">92%</div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Previous Year Questions"
            description="Study patterns that repeat across NQT stages and role categories."
            icon={BookOpen}
            index={5}
            className="min-h-62.5 sm:min-h-65"
          >
            <div className="mt-5 flex items-end justify-center gap-2">
              {[
                { year: "2025", top: "translate-y-0" },
                { year: "2024", top: "translate-y-2" },
                { year: "2023", top: "translate-y-5" },
                { year: "2022", top: "translate-y-7" },
              ].map((item, idx) => (
                <motion.div
                  key={item.year}
                  whileHover={{ y: -4, rotate: -2 }}
                  className={`w-16 rounded-xl border border-slate-300 bg-slate-50/90 p-3 text-center shadow-lg dark:border-white/12 dark:bg-white/6 ${item.top}`}
                  style={{ transform: `translateY(${idx * 2}px)` }}
                >
                  <div className="text-[10px] uppercase text-slate-600 dark:text-white/60">{item.year}</div>
                  <div className="mt-2 h-7 border border-dashed border-slate-300 dark:border-white/20" />
                </motion.div>
              ))}
            </div>
          </FeatureCard>

          <FeatureCard
            title="Aptitude Shortcuts"
            description="Turn calculation speed into a repeatable advantage."
            icon={Zap}
            index={6}
            className="min-h-62.5 sm:min-h-65"
          >
            <div className="mt-5 rounded-2xl border border-amber-300/20 bg-slate-50/90 p-4 dark:bg-black/30">
              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-white/60">
                <span>25% of 480</span>
                <span className="text-amber-600 dark:text-amber-200"><Zap className="h-4 w-4" /></span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-2xl font-semibold leading-none text-slate-950 dark:text-white">
                <span>↓</span>
                <span>120</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-100/90">
                <span className="h-px w-10 bg-cyan-500 dark:bg-cyan-300" />
                <span>2 sec</span>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Interview Preparation"
            description="Move from written readiness to confident final-round performance."
            icon={MessageSquare}
            index={7}
            className="min-h-62.5 sm:min-h-65 sm:col-span-2 lg:col-span-1"
          >
            <div className="mt-5 space-y-3">
              {[
                "Technical",
                "HR",
                "Communication",
                "Projects",
              ].map((label, idx) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.12 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-300/12">
                    <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-300" />
                  </span>
                  <span className="text-slate-700 dark:text-white/80">{label}</span>
                </motion.div>
              ))}
            </div>
          </FeatureCard>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
            Ready to Level Up Your TCS Preparation?
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-white/58">
            Stop guessing what to study. Let Premium show you exactly where to improve.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full border border-violet-300/40 bg-linear-to-r from-violet-600 to-purple-500 px-8 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(124,58,237,0.25)] transition duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.45)]"
            >
              Unlock Premium →
            </motion.button>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500 dark:text-white/38">
              One-time payment • Lifetime access • Future updates included
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SparkTrail() {
  return (
    <span className="relative flex h-2 w-2 items-center justify-center">
      <span className="absolute h-2 w-2 rounded-full border border-violet-300" />
      <span className="h-1 w-1 rounded-full bg-violet-200" />
    </span>
  );
}

