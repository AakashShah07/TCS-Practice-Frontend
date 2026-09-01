import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PreparationHero() {
  return (
    <section className="relative flex flex-col items-center text-center py-20 px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-6">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          🎯 TCS NQT Preparation
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-foreground mb-6">
          TCS NQT Preparation Strategy
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          Proven, data-driven strategies to help you crack the TCS NQT exam with confidence.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/practice">Start Practicing</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href="/tests">Explore Tests</Link>
          </Button>
        </div>
      </motion.div>
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </section>
  );
}
