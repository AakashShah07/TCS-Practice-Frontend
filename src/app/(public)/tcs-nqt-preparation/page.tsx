"use client";

import PreparationHero from "@/components/preparation/PreparationHero";
import StrategyCards from "@/components/preparation/StrategyCards";
import PreparationJourney from "@/components/preparation/PreparationJourney";
import PreparationFeatures from "@/components/preparation/PreparationFeatures";

export default function PreparationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PreparationHero />
      <div className="container mx-auto space-y-20 pb-20">
        <StrategyCards />
        <PreparationJourney />
        <PreparationFeatures />
      </div>
    </div>
  );
}
