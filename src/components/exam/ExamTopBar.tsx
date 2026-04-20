"use client";

import { useState } from "react";
import { Clock, AlertTriangle, Send, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useTestStore } from "@/stores/test-store";
import { cn } from "@/lib/utils";

interface ExamTopBarProps {
  testTitle: string;
  onSubmit: () => void;
}

export default function ExamTopBar({ testTitle, onSubmit }: ExamTopBarProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    timer,
    questions,
    currentQuestionIndex,
    isPaused,
    togglePause,
    getAnsweredCount,
  } = useTestStore();

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const isLowTime = timer <= 300;
  const isCriticalTime = timer <= 60;

  const answeredCount = getAnsweredCount();
  const unattempted = questions.length - answeredCount;
  const progressPercent =
    questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <>
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b shadow-sm">
        <div className="flex items-center justify-between px-5 h-12">
          {/* Left: Title + Question */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-indigo-700 dark:text-indigo-400 hidden sm:block">
              {testTitle}
            </span>
            <div className="hidden sm:block w-px h-5 bg-border" />
            <span className="text-xs text-muted-foreground font-medium">
              Q {currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>

          {/* Right: Progress + Timer + Submit */}
          <div className="flex items-center gap-3">
            {/* Answered progress */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-green-600">{answeredCount}</span>
              <span>/</span>
              <span>{questions.length}</span>
            </div>

            {/* Timer */}
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-sm font-bold tracking-wider transition-all",
                isCriticalTime
                  ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-200 dark:shadow-red-900"
                  : isLowTime
                  ? "bg-amber-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              )}
            >
              <Clock className="h-3.5 w-3.5" />
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>

            {/* Pause/Resume */}
            <Button
              size="sm"
              variant="outline"
              onClick={togglePause}
              className="rounded-lg px-3 font-semibold transition-all active:scale-95"
            >
              {isPaused ? (
                <Play className="h-3.5 w-3.5 mr-1.5" />
              ) : (
                <Pause className="h-3.5 w-3.5 mr-1.5" />
              )}
              {isPaused ? "Resume" : "Pause"}
            </Button>

            {/* Submit */}
            <Button
              size="sm"
              onClick={() => setShowConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 rounded-lg shadow-sm transition-all hover:shadow-md active:scale-95"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Submit
            </Button>
          </div>
        </div>

        {/* Progress bar under top bar */}
        <Progress
          value={progressPercent}
          className="h-0.5 rounded-none [&>div]:bg-indigo-500"
        />
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Test?</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit? You cannot change answers after.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-green-50 dark:bg-green-950 p-3">
                <p className="text-2xl font-bold text-green-600">{answeredCount}</p>
                <p className="text-xs text-green-600/70">Answered</p>
              </div>
              <div className="rounded-xl bg-red-50 dark:bg-red-950 p-3">
                <p className="text-2xl font-bold text-red-600">{unattempted}</p>
                <p className="text-xs text-red-600/70">Unattempted</p>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-3">
                <p className="text-2xl font-bold text-slate-600 dark:text-slate-300">{questions.length}</p>
                <p className="text-xs text-slate-500">Total</p>
              </div>
            </div>
            {unattempted > 0 && (
              <div className="flex items-center gap-2 text-amber-700 text-sm bg-amber-50 dark:bg-amber-950 p-3 rounded-xl">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                You have {unattempted} unattempted question
                {unattempted !== 1 ? "s" : ""}. Are you sure?
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)} className="rounded-lg">
              Continue Test
            </Button>
            <Button
              onClick={() => {
                setShowConfirm(false);
                onSubmit();
              }}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Submit Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
