import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Target, BookOpen } from "lucide-react";

const strategies = [
  {
    title: "Understand the Pattern",
    description: "Know the exam structure, sections, and marking scheme inside out.",
    icon: Zap,
    color: "text-amber-500",
  },
  {
    title: "Practice Regularly",
    description: "Daily consistent practice is the key to improving speed and accuracy.",
    icon: Target,
    color: "text-red-500",
  },
  {
    title: "Analyze Results",
    description: "Review your mistakes in mock tests to identify and bridge knowledge gaps.",
    icon: BookOpen,
    color: "text-emerald-500",
  },
];

export default function StrategyCards() {
  return (
    <section className="py-12 px-4">
      <div className="grid gap-6 md:grid-cols-3">
        {strategies.map((strategy, i) => (
          <motion.div
            key={strategy.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 border-border/50">
              <CardHeader>
                <strategy.icon className={`h-10 w-10 ${strategy.color} mb-2`} />
                <CardTitle>{strategy.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{strategy.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
