"use client";

import { useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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
    answers,
    currentQuestionIndex,
    currentSection,
  } = useTestStore();

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const isLowTime = timer <= 300; // 5 minutes
  const isCriticalTime = timer <= 60;

  const answeredCount = Object.values(answers).filter(
    (a) => a.selectedOption !== null
  ).length;
  const unattempted = questions.length - answeredCount;

  const sectionLabels: Record<string, string> = {
    numerical: "Numerical Ability",
    logical: "Logical Reasoning",
    verbal: "Verbal Ability",
    advanced: "Advanced",
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <span className="font-bold text-sm hidden sm:block">
              {testTitle}
            </span>
            <Badge variant="outline">
              {sectionLabels[currentSection] || currentSection}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Q {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-bold",
                isCriticalTime
                  ? "bg-red-100 text-red-700 animate-pulse"
                  : isLowTime
                  ? "bg-amber-100 text-amber-700"
                  : "bg-muted"
              )}
            >
              <Clock className="h-4 w-4" />
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowConfirm(true)}
            >
              Submit Test
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Test?</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your test?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex justify-between text-sm">
              <span>Total Questions</span>
              <span className="font-medium">{questions.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Answered</span>
              <span className="font-medium text-green-600">
                {answeredCount}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Unattempted</span>
              <span className="font-medium text-red-600">{unattempted}</span>
            </div>
            {unattempted > 0 && (
              <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 p-2 rounded">
                <AlertTriangle className="h-4 w-4" />
                You have {unattempted} unattempted question
                {unattempted !== 1 ? "s" : ""}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Continue Test
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowConfirm(false);
                onSubmit();
              }}
            >
              Submit Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
