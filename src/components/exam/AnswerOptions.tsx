"use client";

import { useRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Media } from "@/lib/api/types";
import { MediaRenderer } from "./SharedStimulus";

export interface AnswerOptionMedia {
  media?: Media | null;
}

interface AnswerOptionsProps {
  /** 2–5 answer options (text). */
  options: string[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  disabled?: boolean;
  /** Optional per-option media (image-based options), keyed by index. */
  optionMedia?: (Media | null | undefined)[];
  /** Accessible group label. */
  ariaLabel?: string;
  className?: string;
}

const LETTER = (i: number) => String.fromCharCode(65 + i);

/**
 * Reusable, accessible answer-option list.
 * - Supports 2–5 options (text and/or media).
 * - Roving focus + arrow-key navigation (up/down/left/right, Home/End).
 * - Proper radiogroup semantics for screen readers.
 */
export default function AnswerOptions({
  options,
  selectedIndex,
  onSelect,
  disabled = false,
  optionMedia,
  ariaLabel = "Answer options",
  className,
}: AnswerOptionsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  if (!options || options.length === 0) return null;

  function focusAt(index: number) {
    const clamped = Math.max(0, Math.min(options.length - 1, index));
    refs.current[clamped]?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight":
        e.preventDefault();
        focusAt(index + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        e.preventDefault();
        focusAt(index - 1);
        break;
      case "Home":
        e.preventDefault();
        focusAt(0);
        break;
      case "End":
        e.preventDefault();
        focusAt(options.length - 1);
        break;
      default:
        break;
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("space-y-3", className)}
      data-testid="answer-options"
    >
      {options.map((option, index) => {
        const isSelected = selectedIndex === index;
        const media = optionMedia?.[index];
        const hasMedia = Boolean(media && media.type);

        return (
          <button
            key={index}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`Option ${LETTER(index)}${option ? `: ${option}` : ""}`}
            tabIndex={isSelected || (selectedIndex === null && index === 0) ? 0 : -1}
            disabled={disabled}
            onClick={() => onSelect(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "group flex min-h-[60px] sm:min-h-[64px] w-full items-center gap-4 rounded-2xl border-2 px-4 sm:px-5 py-4 text-left transition-all duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
              !disabled && "hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm",
              isSelected
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950 shadow-md shadow-indigo-100 dark:shadow-indigo-900/20"
                : "border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-900",
              !disabled && !isSelected && "hover:border-indigo-300 dark:hover:border-indigo-600",
              disabled && "opacity-60 cursor-not-allowed"
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl text-[15px] sm:text-base font-bold transition-all duration-200",
                isSelected
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 group-hover:text-indigo-700 dark:group-hover:text-indigo-300"
              )}
            >
              {LETTER(index)}
            </span>

            <span className="min-w-0 flex-1">
              {option && (
                <span
                  className={cn(
                    "block text-base xl:text-[1.0625rem] leading-[1.6] transition-colors",
                    isSelected
                      ? "font-medium text-indigo-900 dark:text-indigo-100"
                      : "text-slate-700 dark:text-slate-300"
                  )}
                >
                  {option}
                </span>
              )}
              {hasMedia && (
                <span className="mt-2 block max-w-xs">
                  <MediaRenderer media={media} />
                </span>
              )}
            </span>

            {isSelected && (
              <span className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
