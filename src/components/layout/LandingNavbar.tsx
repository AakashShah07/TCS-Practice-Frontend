"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const resourceLinks = [
  { href: "/tcs-nqt-syllabus", label: "Syllabus" },
  { href: "/tcs-nqt-preparation", label: "Preparation" },
  { href: "/tcs-nqt-cutoff", label: "Cutoff" },
];

const campaignLink = {
  href: "/infosys-se-2027",
  label: "Infosys 2027",
};

/**
 * Public marketing navbar — landing page and other public marketing pages.
 * Completely independent of the authenticated application navbar.
 * Always renders the same (marketing) links — identical output on the
 * server and the client, so there is no hydration flicker.
 */
export default function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-[#DCE5EF] dark:border-gray-800 landing-slide-down">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5">
          <Image
            src="/llog.png"
            alt="CrackNQT"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-lg sm:text-xl font-black text-[#111827] dark:text-white tracking-tight">
            CrackNQT
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop: Show links directly */}
          <div className="hidden md:flex items-center gap-1">
            {resourceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-[#374151] dark:text-gray-300 hover:text-[#111827] dark:hover:text-white transition-colors px-2 py-2"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/premium"
              className="text-sm font-semibold text-[#374151] dark:text-gray-300 hover:text-[#111827] dark:hover:text-white transition-colors px-2 py-2"
            >
              Premium
            </Link>
            <Link
              href={campaignLink.href}
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-700 dark:text-amber-300 hover:bg-amber-400/25 hover:border-amber-400/60 transition-colors px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
              {campaignLink.label}
            </Link>
          </div>

          {/* Mobile: Show dropdown */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-semibold text-[#374151] dark:text-gray-300 hover:text-[#111827] dark:hover:text-white transition-colors px-2 py-2 flex items-center gap-1">
                Menu <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {resourceLinks.map((link) => (
                  <DropdownMenuItem
                    key={link.href}
                    onClick={() => (window.location.href = link.href)}
                  >
                    {link.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={() => (window.location.href = "/premium")}>
                  Premium
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => (window.location.href = campaignLink.href)}>
                  Infosys 2027
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link
            href="/login"
            className="text-sm font-semibold text-[#374151] dark:text-gray-300 hover:text-[#111827] dark:hover:text-white transition-colors px-2 sm:px-3 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="auth-btn text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-blue-500 dark:hover:bg-blue-600 px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 dark:shadow-blue-500/10 transition-all"
          >
            Start Free Test
          </Link>
        </div>
      </div>
    </nav>
  );
}
