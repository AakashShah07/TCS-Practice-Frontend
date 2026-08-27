"use client";

import React, { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { motion, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Flame, Target, ArrowUpRight, Cpu, BookOpen, ChartLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";

function CountUp({ from = 0, to = 100, duration = 1.2, className = "" }: { from?: number; to: number; duration?: number; className?: string; }) {
  const [value, setValue] = useState(from);
  useEffect(() => {
    const controls = animate(from, to, {
      duration,
      onUpdate(v) {
        setValue(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [from, to, duration]);
  return <span className={className}>{value}%</span>;
}

function TrustItem({ icon, title, value }: { icon: React.ReactNode; title: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50/80 px-3 py-2 rounded-xl border border-slate-200/70 shadow-sm dark:bg-white/3 dark:border-white/6 dark:shadow-sm">
      <div className="p-2 rounded-md bg-linear-to-br from-violet-600/20 to-purple-400/10">
        {icon}
      </div>
      <div className="text-left">
        <div className="text-xs text-slate-600 dark:text-white/70">{title}</div>
        <div className="font-semibold text-slate-900 dark:text-white">{value}</div>
      </div>
    </div>
  );
}

function MiniBar({ label, value, color = "from-violet-500 to-purple-400" }: { label: string; value: number; color?: string }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-600 dark:text-white/60 mb-1">
        <span>{label}</span>
        <span className="font-medium text-slate-700 dark:text-white">{value}%</span>
      </div>
      <div className="h-2 bg-slate-200/80 dark:bg-white/6 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={`h-2 rounded-full bg-linear-to-r ${color}`}
        />
      </div>
    </div>
  );
}

export default function PremiumHero() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 });
  const { user } = useAuthStore();
  const spotlight = { left: mouse.x, top: mouse.y };

  const handleUnlockPremium = () => {
    if (!user) {
      toast.error("Please log in to upgrade.");
      router.push("/login");
      return;
    }
    router.push("/premium/payment");
  };

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    const el = sectionRef.current;
    el?.addEventListener("mousemove", handle);
    el?.addEventListener("mouseleave", () => setMouse({ x: -9999, y: -9999 }));
    return () => {
      el?.removeEventListener("mousemove", handle);
      el?.removeEventListener("mouseleave", () => setMouse({ x: -9999, y: -9999 }));
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-[90vh] flex items-center bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] text-slate-950 dark:bg-[linear-gradient(180deg,#09090b_0%,#17111f_100%)] dark:text-white"
    >
      {/* Background layers: soft blobs, subtle grid, vignette, particles */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-20"
      >
        <motion.div
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -left-40 -top-64 w-280 h-280 rounded-full blur-3xl"
          style={{ background: "linear-gradient(135deg, rgba(102,126,234,0.18), rgba(139,92,246,0.12))" }}
        />
        <motion.div
          animate={{ rotate: [0, -8, 0] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -right-40 -bottom-64 w-240 h-240 rounded-full blur-2xl"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.12), rgba(99,102,241,0.06))" }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(600px_200px_at_var(--mx)_var(--my),rgba(124,58,237,0.06),transparent_30%)] mix-blend-screen pointer-events-none" style={{ "--mx": `${spotlight.left}px`, "--my": `${spotlight.top}px` } as CSSProperties} />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15),transparent 30%)] pointer-events-none" />

        {/* subtle grid */}
        <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 40px)] pointer-events-none" />
      </motion.div>

      {/* floating particles */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-10 left-10 w-1.5 h-1.5 rounded-full bg-violet-400/60 blur-sm"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute top-1/3 right-20 w-2 h-2 rounded-full bg-purple-400/50 blur-md"
        />
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT */}
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
              <motion.span
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex items-center gap-3 px-3 py-2 rounded-full text-sm font-semibold bg-linear-to-r from-violet-700/10 to-purple-500/6 border border-slate-200 dark:border-white/6"
              >
                <span className="text-violet-600 dark:text-violet-300">✨</span>
                <span className="text-slate-800 dark:text-white">Unlock Your TCS Prime Potential</span>
              </motion.span>

              <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-slate-950 dark:text-white">
                <motion.span
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.6 }}
                  className="block"
                >
                  Prepare Smarter.
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.7 }}
                  className="mt-2 block w-fit px-5 py-2 font-bold tracking-[0.14em] bg-clip-text text-transparent bg-linear-to-r from-violet-700 via-violet-500 to-purple-500 dark:from-white dark:via-violet-300 dark:to-purple-400"
                >
                  Pay Once. Stay Ahead.
                </motion.span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-white/70">
                Get the complete CRackNQT Premium experience for just ₹149 — one payment, lifetime access. Unlock advanced mocks, AI-powered analytics, coding practice, and smarter preparation tools built to help you reach your NQT goal.
              </p>

              {/* Trust & indicators */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                <TrustItem icon={<Flame className="w-5 h-5 text-amber-400" />} title="Students improved" value={<span className="font-mono">1,243</span>} />
                <TrustItem icon={<Star className="w-5 h-5 text-yellow-400" />} title="Rating" value={<span className="font-mono">4.9</span>} />
                <TrustItem icon={<Target className="w-5 h-5 text-sky-400" />} title="Mock Tests" value={<span className="font-mono">50+</span>} />
                <TrustItem icon={<ChartLine className="w-5 h-5 text-violet-400" />} title="AI Analytics" value={<span className="font-mono">Enabled</span>} />
              </div>

              {/* Actions */}
              <div className="mt-8">
                <div className="flex flex-wrap items-center gap-4">
                  <motion.div
                    whileHover={{ y: -2, transition: { duration: 0.22, ease: "easeOut" } }}
                    whileTap={{ y: 1, transition: { duration: 0.12 } }}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      onClick={handleUnlockPremium}
                      aria-label="Unlock Lifetime Access"
                      className="group relative w-full sm:w-62.5 h-11 overflow-hidden rounded-xl border border-white/55 bg-linear-to-r from-violet-800 via-violet-600 to-purple-600 px-6 text-[0.9rem] font-bold text-white shadow-[0_12px_24px_rgba(124,58,237,0.28)] transition-all duration-250 ease-out hover:shadow-[0_14px_30px_rgba(124,58,237,0.45)] hover:from-violet-700 hover:to-violet-500 focus-visible:ring-4 focus-visible:ring-violet-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-violet-200/35 dark:focus-visible:ring-offset-[#17111f]"
                    >
                      <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.20)_48%,transparent_100%)] opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-[35%]" aria-hidden="true" />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <span className="leading-none">Unlock Lifetime Access</span>
                        <span aria-hidden="true" className="inline-flex items-center transition-transform duration-250 ease-out group-hover:translate-x-1">
                          <ArrowUpRight className="w-4 h-4" />
                        </span>
                      </span>
                    </Button>
                  </motion.div>
                </div>

                <div className="mt-2 text-[11px] font-medium tracking-wide text-slate-500 dark:text-white/60">
                  <span className="text-violet-700 dark:text-violet-300">₹99</span> one-time · No subscription · Lifetime access
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Floating Dashboard */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: [10, -6, 10], opacity: [0, 1, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="relative mx-auto w-full max-w-md p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-2xl dark:bg-[#14151b] dark:border-white/12 dark:shadow-none">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-slate-600 dark:text-white/70">Score Improvement</div>
                    <div className="text-2xl font-bold flex items-baseline gap-3">
                      <CountUp to={88} className="text-slate-950 dark:text-white" />
                      <span className="text-sm text-green-600 flex items-center gap-1 dark:text-green-400"><ArrowUpRight className="w-4 h-4" /> 27%</span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-600 dark:text-white/70">
                    <div>Previous</div>
                    <div className="font-mono text-slate-900 dark:text-white">61%</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <MiniBar label="Accuracy" value={88} />
                  <MiniBar label="Time Management" value={74} color="from-rose-400 to-pink-400" />
                  <MiniBar label="Coding" value={82} color="from-cyan-400 to-blue-400" />
                  <MiniBar label="Verbal" value={79} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-100/90 dark:bg-[#222637]">
                    <div className="text-xs text-slate-600 dark:text-white/70">Weak Topic</div>
                    <div className="font-semibold text-slate-950 dark:text-white">Geometry</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100/90 dark:bg-[#222637]">
                    <div className="text-xs text-slate-600 dark:text-white/70">AI Recommendation</div>
                    <div className="text-sm text-slate-700 dark:text-white">Spend 20 minutes on Geometry to improve expected score by <span className="font-semibold">6%</span>.</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-white/70">
                  <div>
                    <div className="text-xs">Recent Mock</div>
                    <div className="font-semibold text-slate-950 dark:text-white">Score 88 • 35m • Rank 12</div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-white/60">Updated 2d ago</div>
                </div>
              </div>
            </motion.div>

            {/* Floating mini cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: [0, 1, 1], y: [20, -6, 20] }}
              transition={{ delay: 0.2, duration: 6, repeat: Infinity }}
              className="absolute -right-8 -top-8 w-40 p-3 rounded-xl bg-white/90 border border-slate-200 backdrop-blur-sm shadow-lg dark:bg-[#171b2a] dark:border-white/10 dark:shadow-none"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-linear-to-br from-violet-500 to-purple-400">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-slate-600 dark:text-white/70">Coding</div>
                  <div className="font-semibold text-slate-950 dark:text-white">82%</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: [0, 1, 1], y: [-10, 6, -10] }}
              transition={{ delay: 0.4, duration: 6, repeat: Infinity }}
              className="absolute -left-6 bottom-6 w-44 p-3 rounded-xl bg-white/90 border border-slate-200 backdrop-blur-sm shadow-lg dark:bg-[#171b2a] dark:border-white/10 dark:shadow-none"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-linear-to-br from-rose-400 to-pink-400">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-slate-600 dark:text-white/70">Reading</div>
                  <div className="font-semibold text-slate-950 dark:text-white">79%</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
