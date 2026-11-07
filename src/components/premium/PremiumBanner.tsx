"use client";

import React from "react";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { Crown, Sparkles, Brain, Target, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { usePremiumBanner } from "@/hooks/usePremiumBanner";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

interface PremiumBannerProps {
  variant: "floating-bottom" | "inline" | "post-completion";
  sourcePage: string;
  title: string;
  description: string;
  ctaText?: string;
  bannerId: string;
}

const BENEFITS = [
  { icon: Brain, title: "Advanced Mock Tests", desc: "Practice challenging questions." },
  { icon: Target, title: "Smart Performance Analytics", desc: "Identify weak topics and improve accuracy." },
  { icon: Sparkles, title: "Exclusive Practice Access", desc: "Unlock premium preparation content." },
];

export function PremiumBanner({
  variant,
  sourcePage,
  title,
  description,
  ctaText = "Unlock Premium",
  bannerId,
}: PremiumBannerProps) {
  const { isVisible, dismiss } = usePremiumBanner(bannerId);
  const { user } = useAuthStore();
  const isPremium = Boolean(user?.isPremium);

  const handleCtaClick = () => {
    trackEvent(AnalyticsEvents.PREMIUM_CTA_CLICK, {
      source_page: sourcePage,
      cta_location: variant,
      cta_text: ctaText,
      banner_variant: variant,
    });
  };

  if (!isVisible) return null;

  const containerClass =
    variant === "floating-bottom"
      ? "fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl z-50"
      : "w-full";

  const cardClass = cn(
    "relative overflow-hidden rounded-[1.75rem] border p-6 sm:p-8 lg:p-10",
    "border-amber-200/90 bg-gradient-to-b from-amber-50/90 via-[#FFFBF2] to-amber-50/70",
    "shadow-[0_24px_60px_-18px_rgba(217,119,6,0.35)]",
    "dark:border-amber-400/25 dark:from-[#151022] dark:via-[#1B1430] dark:to-[#120E1F]",
    "dark:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.65)]",
  );

  const upgradeCard = (
    <div className={cardClass}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-400/30 blur-3xl dark:bg-amber-500/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-500/10"
      />

      <div className="relative">
        <div className={cn("grid gap-8 md:grid-cols-2 lg:grid-cols-3")}>
          {/* ── Section A · Premium Identity ── */}
          <div>
            <div className="flex flex-col items-center text-center">
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div
                  aria-hidden="true"
                  className="absolute -inset-3 rounded-full bg-amber-400/40 blur-2xl dark:bg-amber-500/20"
                />
                <Crown className="relative h-12 w-12 text-amber-500 dark:text-amber-300 drop-shadow-[0_0_14px_rgba(245,158,11,0.55)]" />
              </motion.div>
              <span
                className={cn(
                  "mt-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1",
                  "border-amber-300/80 bg-amber-100/90 text-amber-700",
                  "dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-300",
                )}
              >
                <Crown className="h-3 w-3" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700 sm:text-[11px] dark:text-amber-300">
                  CrackNQT Premium
                </span>
              </span>
              <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                {title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 dark:text-white/70">
                {description}
              </p>
            </div>
          </div>

          {/* ── Section B · Premium Benefits ── */}
          <div className="md:row-start-2 md:col-span-2 lg:row-start-1 lg:col-span-1">
            <ul className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              {BENEFITS.map((b, i) => {
                const Icon = b.icon;
                return (
                  <motion.li
                    key={b.title}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.12, duration: 0.5, ease: "easeOut" }}
                    whileHover={{ y: -3 }}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border p-4",
                      "border-amber-200/70 bg-white/70",
                      "dark:border-white/8 dark:bg-white/3",
                    )}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/30 to-amber-200/40 text-amber-600 dark:from-amber-500/20 dark:to-amber-400/10 dark:text-amber-300">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{b.title}</h4>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-white/70">{b.desc}</p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* ── Section C · Pricing & CTA ── */}
          <div className="md:row-start-1 md:col-start-2 lg:row-start-1 lg:col-span-1">
            <div className="relative flex flex-col items-center text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-600/90 dark:text-amber-300/90 sm:text-xs">
                Lifetime Access
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-white">₹49</span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-white/60 sm:text-sm">
                One-time payment · No subscription
              </p>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group relative mt-5 w-full sm:w-64"
              >
                <div
                  aria-hidden="true"
                  className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400/50 to-amber-600/50 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
                />
                <Button
                  onClick={handleCtaClick}
                  render={
                    <Link href="/premium" onClick={handleCtaClick}>
                      {ctaText}
                    </Link>
                  }
                  className={cn(
                    "relative w-full overflow-hidden rounded-2xl py-3.5 text-sm font-bold text-white sm:text-base",
                    "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700",
                    "dark:from-amber-400 dark:to-amber-500 dark:hover:from-amber-500 dark:hover:to-amber-600 dark:text-amber-950",
                    "shadow-[0_14px_30px_-10px_rgba(217,119,6,0.55)] hover:shadow-[0_18px_38px_-10px_rgba(217,119,6,0.65)]",
                    "focus-visible:border-amber-400 focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50 dark:focus-visible:ring-offset-[#151022]",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full transition-transform duration-700 ease-out group-hover:translate-x-full"
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Crown className="h-4 w-4" aria-hidden="true" />
                    {ctaText}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Button>
              </motion.div>

              <p className="mt-3 text-center text-xs text-slate-500 dark:text-white/60">
                Pay once. Prepare forever.
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={dismiss}
        className="absolute top-4 right-4 z-20 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/5 dark:hover:text-white/70"
        aria-label="Dismiss premium banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );

  const unlockedCard = (
    <div className={cn(cardClass, "flex items-center justify-center")}>
      <div className="flex max-w-2xl flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/70 bg-emerald-100/80 px-3 py-1 dark:border-emerald-400/30 dark:bg-emerald-500/10">
            <Crown className="h-3 w-3 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300 sm:text-[11px]">
              Premium Unlocked
            </span>
          </span>
        </motion.div>
        <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {title}
        </h3>
        <p className="mt-3 text-sm text-slate-600 dark:text-white/70">
          You have Lifetime Access. Enjoy advanced preparation tools, deeper insights, and exclusive content.
        </p>
        <p className="mt-2 text-xs text-slate-500 dark:text-white/60">Thank you for upgrading — your premium journey starts now.</p>
      </div>
    </div>
  );

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        key="premium-banner"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={containerClass}
      >
        {isPremium ? unlockedCard : upgradeCard}
      </motion.div>
    </MotionConfig>
  );
}
