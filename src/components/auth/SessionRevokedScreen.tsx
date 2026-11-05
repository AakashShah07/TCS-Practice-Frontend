"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, LogIn, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SessionEndReason } from "@/lib/api/errors";

/**
 * Presentational session-ended screen.
 *
 * Copy never blames the user, never claims a ban/suspension/hack, and never
 * leaks backend error details. The authentication layer decides WHEN this is
 * shown — this component only renders and reports button presses.
 */

interface SessionRevokedScreenProps {
  reason: SessionEndReason;
  onSignInAgain: () => void;
  onBackToHome: () => void;
}

const COPY: Record<SessionEndReason, { body: string }> = {
  revoked: {
    body: "Your CrackNQT account was signed in on another device. To keep your account secure, we've ended this session. Please sign in again to continue your preparation.",
  },
  invalid: {
    body: "This session is no longer valid, so we've signed you out. Please sign in again to continue your preparation.",
  },
  expired: {
    body: "Your session expired and could not be renewed. Please sign in again to continue your preparation.",
  },
  refresh_failed: {
    body: "We couldn't renew your session. Please sign in again to continue your preparation.",
  },
};

export default function SessionRevokedScreen({
  reason,
  onSignInAgain,
  onBackToHome,
}: SessionRevokedScreenProps) {
  const reduceMotion = useReducedMotion();
  const signInRef = useRef<HTMLButtonElement>(null);

  // Move focus away from whatever protected control had it.
  useEffect(() => {
    signInRef.current?.focus();
  }, []);

  const { body } = COPY[reason] ?? COPY.revoked;

  const container = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0, y: 24, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
      };

  const iconMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0, scale: 0.6 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] as const },
      };

  const textMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, delay: 0.14, ease: "easeOut" as const },
      };

  const buttonsMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, delay: 0.22, ease: "easeOut" as const },
      };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-gradient-to-br from-blue-50 via-slate-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
      data-testid="session-revoked-screen"
    >
      {/* Subtle decorative glows, matching the auth pages' visual language */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-900/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-900/20"
      />

      <div className="relative flex min-h-[100dvh] items-center justify-center px-4 py-8 sm:px-6">
        <motion.div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="session-ended-heading"
          aria-describedby="session-ended-description"
          {...container}
          className={cn(
            "w-full max-w-md sm:max-w-lg rounded-2xl sm:rounded-3xl border border-border",
            "bg-card/95 backdrop-blur-xl text-card-foreground",
            "shadow-[0_20px_60px_rgb(37,99,235,0.12)] dark:shadow-[0_20px_60px_rgb(0,0,0,0.45)]",
            "px-6 py-8 sm:px-10 sm:py-10 text-center"
          )}
        >
          {/* Icon */}
          <motion.div {...iconMotion} className="mx-auto mb-5 sm:mb-6">
            <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-blue-600/10 dark:bg-blue-400/10 ring-1 ring-blue-600/20 dark:ring-blue-400/20">
              <ShieldCheck
                className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 dark:text-blue-400"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div {...textMotion}>
            <h1
              id="session-ended-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
            >
              Your session has ended
            </h1>
            <p
              id="session-ended-description"
              className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground"
            >
              {body}
            </p>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground/80">
              Your preparation progress is saved on your account.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            {...buttonsMotion}
            className="mt-6 sm:mt-8 flex flex-col gap-3"
          >
            <Button
              ref={signInRef}
              onClick={onSignInAgain}
              className="h-11 sm:h-12 w-full rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm sm:text-base font-semibold shadow-md shadow-blue-500/20 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              Sign in again
            </Button>
            <Button
              variant="ghost"
              onClick={onBackToHome}
              className="h-11 sm:h-12 w-full rounded-xl text-sm sm:text-base font-medium text-muted-foreground hover:text-foreground cursor-pointer focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Home className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              Back to home
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
