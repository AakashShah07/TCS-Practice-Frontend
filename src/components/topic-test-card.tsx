import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Flame } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Test } from "@/lib/api/types";

export interface TopicCardColors {
  card: string;
  circle1: string;
  circle2: string;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
  flame: string;
  badges: [string, string, string, string];
  button: string;
}

export interface TopicTestCardProps {
  test: Test;
  title: string;
  description: string;
  icon: LucideIcon;
  flameIcon?: LucideIcon;
  defaultSection: string;
  difficultyLabel: string;
  buttonLabel: string;
  colors: TopicCardColors;
  extraContent?: React.ReactNode;
}

export function TopicTestCard({
  test,
  title,
  description,
  icon: Icon,
  flameIcon: FlameIcon = Flame,
  defaultSection,
  difficultyLabel,
  buttonLabel,
  colors,
  extraContent,
}: TopicTestCardProps) {
  const badgesAndButton = (
    <>
      <div className="flex flex-wrap gap-2">
        <Badge className={colors.badges[0]}>
          {test.totalQuestions} Questions
        </Badge>
        <Badge className={colors.badges[1]}>
          {Math.round(test.duration / 60)} Minutes
        </Badge>
        <Badge className={colors.badges[2]}>
          {test.section
            ? test.section.charAt(0).toUpperCase() + test.section.slice(1)
            : defaultSection}
        </Badge>
        <Badge className={colors.badges[3]}>{difficultyLabel}</Badge>
      </div>
      <Button
        className={`${colors.button} text-white`}
        render={<Link href={`/exam/${test._id}`} target="_blank" />}
      >
        {buttonLabel} <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
    </>
  );

  return (
    <Card className={`relative overflow-hidden border-2 ${colors.card}`}>
      <div
        className={`absolute top-0 right-0 w-40 h-40 ${colors.circle1} rounded-full -translate-y-1/2 translate-x-1/2`}
      />
      <div
        className={`absolute bottom-0 left-0 w-24 h-24 ${colors.circle2} rounded-full translate-y-1/2 -translate-x-1/2`}
      />
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-lg ${colors.iconBg} flex items-center justify-center`}
          >
            <Icon className={`h-6 w-6 ${colors.iconColor}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className={`text-xl ${colors.title}`}>
                {title}
              </CardTitle>
              <FlameIcon
                className={`h-5 w-5 ${colors.flame} animate-pulse`}
              />
            </div>
            <CardDescription className={colors.desc}>
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent
        className={`relative ${extraContent ? "space-y-4" : "flex flex-wrap items-center justify-between gap-4"}`}
      >
        {extraContent}
        {extraContent ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            {badgesAndButton}
          </div>
        ) : (
          badgesAndButton
        )}
      </CardContent>
    </Card>
  );
}
