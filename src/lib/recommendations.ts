import type { TopicStat, Recommendation, Section } from "./api/types";

export function generateRecommendations(
  topicStats: TopicStat[],
  sectionPerformance: {
    section: Section;
    accuracy: number;
    testsCount: number;
  }[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  let id = 0;

  // Find weak topics (low accuracy + high attempts)
  topicStats
    .filter((t) => t.accuracy < 40 && t.attempts >= 5)
    .forEach((t) => {
      recommendations.push({
        id: String(++id),
        type: "revise",
        message: `Revise fundamentals of ${t.topic} — your accuracy is only ${Math.round(t.accuracy)}% after ${t.attempts} attempts`,
        topic: t.topic,
        section: t.section,
        priority: "high",
      });
    });

  // Find under-practiced topics (low attempts)
  topicStats
    .filter((t) => t.attempts < 3)
    .forEach((t) => {
      recommendations.push({
        id: String(++id),
        type: "practice",
        message: `Attempt more ${t.topic} questions — only ${t.attempts} attempts so far`,
        topic: t.topic,
        section: t.section,
        priority: "medium",
      });
    });

  // Find speed issues (slow + low accuracy)
  topicStats
    .filter((t) => t.avgTime > 120 && t.accuracy < 50)
    .forEach((t) => {
      recommendations.push({
        id: String(++id),
        type: "speed",
        message: `Practice speed for ${t.topic} — you spend ${Math.round(t.avgTime)}s per question but accuracy is ${Math.round(t.accuracy)}%`,
        topic: t.topic,
        section: t.section,
        priority: "high",
      });
    });

  // Section-level recommendations
  const strongSections = sectionPerformance.filter((s) => s.accuracy >= 75);
  const weakSections = sectionPerformance.filter((s) => s.accuracy < 50);

  if (strongSections.length > 0 && weakSections.length > 0) {
    const strongNames = strongSections.map((s) => s.section).join(", ");
    const weakNames = weakSections.map((s) => s.section).join(", ");
    recommendations.push({
      id: String(++id),
      type: "focus",
      message: `Your ${strongNames} is strong — focus more on ${weakNames} to improve overall score`,
      priority: "medium",
    });
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return recommendations;
}
