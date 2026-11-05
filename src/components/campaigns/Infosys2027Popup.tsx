"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Megaphone, X } from "lucide-react";

import { useAuthStore } from "@/stores/auth-store";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import {
  INFOSYS_SE_2027_CAMPAIGN as CAMPAIGN,
  type InfosysCampaignStatus,
} from "@/lib/constants/campaigns";
import { cn } from "@/lib/utils";

/**
 * Infosys 2027 Software Engineer campaign — homepage popup.
 * Goal: awareness / funnel entry only. No form, no signup simulation.
 */

function readCampaignStatus(): InfosysCampaignStatus | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CAMPAIGN.storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { status?: string };
    if (parsed?.status === "dismissed" || parsed?.status === "engaged") {
      return parsed.status;
    }
    return null;
  } catch {
    return null; // storage unavailable / corrupt — treat as not shown
  }
}

function persistCampaignStatus(status: InfosysCampaignStatus) {
  try {
    window.localStorage.setItem(
      CAMPAIGN.storageKey,
      JSON.stringify({ status, at: Date.now() })
    );
  } catch {
    // storage full/blocked — nothing else to do
  }
}

function campaignActive() {
  return Date.now() < CAMPAIGN.campaignEndsAt;
}

function getDeviceContext() {
  const isDesktop =
    typeof window !== "undefined" && window.innerWidth >= 768;
  return {
    device_type: isDesktop ? "desktop" : "mobile",
    banner_variant: isDesktop ? "desktop" : "mobile",
  } as const;
}

export default function Infosys2027Popup() {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const reduceMotion = useReducedMotion();

  const [visible, setVisible] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // ---- Trigger: homepage only, after a short delay, once per campaign ----
  useEffect(() => {
    if (pathname !== "/") return;
    if (!campaignActive()) return;
    if (readCampaignStatus()) return;
    const timer = window.setTimeout(() => setVisible(true), CAMPAIGN.delayMs);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const closeWithStatus = useCallback((status: InfosysCampaignStatus) => {
    persistCampaignStatus(status);
    setVisible(false);
  }, []);

  // ---- Analytics + a11y lifecycle while the popup is visible ----
  useEffect(() => {
    if (!visible) return;

    const baseParams = {
      campaign_id: CAMPAIGN.campaignId,
      campaign_placement: CAMPAIGN.placement,
      user_status: isAuthenticated ? "authenticated" : "unauthenticated",
      ...getDeviceContext(),
    };

    trackEvent(AnalyticsEvents.INFOSYS_CAMPAIGN_POPUP_VIEW, baseParams);
    try {
      if (!window.sessionStorage.getItem(CAMPAIGN.sessionEventKey)) {
        trackEvent(AnalyticsEvents.INFOSYS_CAMPAIGN_POPUP_SESSION, baseParams);
        window.sessionStorage.setItem(CAMPAIGN.sessionEventKey, "1");
      }
    } catch {
      // sessionStorage unavailable — skip session beacon, keep view event
    }

    // Focus management: remember where focus was, move into the dialog
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    ctaRef.current?.focus();

    // Freeze background scroll
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        trackEvent(AnalyticsEvents.INFOSYS_CAMPAIGN_POPUP_DISMISS, baseParams);
        closeWithStatus("dismissed");
        return;
      }
      if (e.key === "Tab") {
        // Focus trap — the dialog only has two focusable controls
        const focusables = [closeRef.current, ctaRef.current].filter(
          (el): el is HTMLButtonElement => !!el
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleDismiss = useCallback(() => {
    trackEvent(AnalyticsEvents.INFOSYS_CAMPAIGN_POPUP_DISMISS, {
      campaign_id: CAMPAIGN.campaignId,
      campaign_placement: CAMPAIGN.placement,
      user_status: isAuthenticated ? "authenticated" : "unauthenticated",
      ...getDeviceContext(),
    });
    closeWithStatus("dismissed");
  }, [closeWithStatus, isAuthenticated]);

  const handleCta = useCallback(() => {
    trackEvent(AnalyticsEvents.INFOSYS_CAMPAIGN_CTA_CLICK, {
      campaign_id: CAMPAIGN.campaignId,
      campaign_placement: CAMPAIGN.placement,
      user_status: isAuthenticated ? "authenticated" : "unauthenticated",
      ...getDeviceContext(),
    });
    persistCampaignStatus("engaged");
    setVisible(false);
    router.push(CAMPAIGN.ctaUrl);
  }, [isAuthenticated, router]);

  const backdropMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.25 } };

  const cardMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0, y: 16, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 8, scale: 0.97, transition: { duration: 0.18 } },
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <AnimatePresence>
      {visible && (
        <div
          className="fixed inset-0 z-[90]"
          data-testid="infosys-2027-popup"
        >
          {/* Backdrop — click outside to dismiss */}
          <motion.div
            {...backdropMotion}
            className="absolute inset-0 bg-black/65 backdrop-blur-[3px]"
            onClick={handleDismiss}
            aria-hidden="true"
          />

          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 pointer-events-none overflow-y-auto">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="infosys-popup-title"
              aria-describedby="infosys-popup-description"
              {...cardMotion}
              className={cn(
                "pointer-events-auto relative overflow-hidden rounded-2xl sm:rounded-3xl",
                "w-[92vw] sm:w-full max-w-md sm:max-w-xl lg:max-w-2xl",
                "max-h-[92dvh] overflow-y-auto",
                "border border-white/10 bg-[#0D0D21] text-white",
                "shadow-[0_24px_80px_rgba(0,0,0,0.6)] ring-1 ring-purple-500/40"
              )}
            >
              {/* Campaign badge */}
              <div className="pointer-events-none absolute left-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-3 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-purple-950 shadow-lg shadow-amber-400/30 ring-1 ring-black/10">
                <Megaphone className="h-3 w-3" aria-hidden="true" />
                New Opportunity · 2027 Batch
              </div>

              {/* Close button */}
              <button
                ref={closeRef}
                type="button"
                onClick={handleDismiss}
                aria-label="Close campaign popup"
                className="absolute right-2.5 top-2.5 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>

              <h2 id="infosys-popup-title" className="sr-only">
                Infosys Software Engineer 2027 — hiring opportunity
              </h2>

              {/* Responsive banner — artwork preserved, no stretching */}
              <div className="relative w-full select-none bg-[#0D0D21]">
                {/* Desktop / tablet */}
                <Image
                  src={CAMPAIGN.desktopBanner}
                  alt="Infosys 2027 Software Engineer campus hiring — yellow and purple campaign artwork"
                  width={CAMPAIGN.desktopBannerSize.width}
                  height={CAMPAIGN.desktopBannerSize.height}
                  priority
                  sizes="(min-width: 1024px) 672px, (min-width: 640px) 576px, 92vw"
                  className={cn(
                    "hidden sm:block h-auto w-full object-contain",
                    !reduceMotion && "transition-transform duration-500 ease-out hover:scale-[1.02]"
                  )}
                />
                {/* Mobile */}
                <Image
                  src={CAMPAIGN.mobileBanner}
                  alt="Infosys 2027 Software Engineer campus hiring — yellow and purple campaign artwork"
                  width={CAMPAIGN.mobileBannerSize.width}
                  height={CAMPAIGN.mobileBannerSize.height}
                  priority
                  sizes="92vw"
                  className={cn(
                    "sm:hidden h-auto w-full max-h-[46dvh] object-contain object-top",
                    !reduceMotion && "transition-transform duration-500 ease-out active:scale-[0.99]"
                  )}
                />
              </div>

              {/* CTA area */}
              <div className="relative border-t border-white/10 bg-gradient-to-b from-[#12102B] to-[#0D0D21] px-5 py-4 sm:px-6 sm:py-5 text-center">
                <button
                  ref={ctaRef}
                  type="button"
                  onClick={handleCta}
                  className="group inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 px-6 sm:px-10 text-sm sm:text-base font-extrabold uppercase tracking-wide text-purple-950 shadow-lg shadow-amber-400/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-400/40 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D21]"
                >
                  Explore Opportunity
                  <ArrowRight
                    className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
                <p
                  id="infosys-popup-description"
                  className="mt-3 text-xs sm:text-sm text-white/75"
                >
                  Discover the hiring details and start your preparation with CrackNQT.
                </p>
                <p className="mt-1.5 text-[10px] text-white/40">
                  CrackNQT is an independent preparation platform — not affiliated with Infosys.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
