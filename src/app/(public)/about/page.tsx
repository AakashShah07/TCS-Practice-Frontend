import { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutIntro } from "@/components/about/AboutIntro";
import { WhyCrackNQT } from "@/components/about/WhyCrackNQT";
import { FeaturesSection } from "@/components/about/FeaturesSection";
import { PreparationApproach } from "@/components/about/PreparationApproach";
import { 
  AudienceSection, 
  QualityCommitment, 
  TransparencySection, 
  VisionSection, 
  AboutCTA 
} from "@/components/about/AboutExtra";

export const metadata: Metadata = {
  title: "About CrackNQT",
  description: "Learn about CrackNQT, our mission, preparation approach, resources, and commitment to helping students and aspirants prepare more effectively.",
};

export default function AboutPage() {
  return (
    <main className="flex flex-col">
      <AboutHero />
      <AboutIntro />
      <WhyCrackNQT />
      <FeaturesSection />
      <PreparationApproach />
      <AudienceSection />
      <QualityCommitment />
      <TransparencySection />
      <VisionSection />
      <AboutCTA />
    </main>
  );
}
