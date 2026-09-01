import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CutoffHero() {
  return (
    <section className="relative py-20 px-4 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-6">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          TCS NQT 2026 • Cutoff Analysis
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-foreground mb-6">
          TCS NQT Cutoff 2026
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Understand expected cutoffs, safe scores, and trends to target your preparation effectively.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/practice">Start Practicing</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href="/tests">Explore Mock Tests</Link>
          </Button>
        </div>
      </motion.div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </section>
  );
}
