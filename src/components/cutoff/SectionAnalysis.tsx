import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cutoffData } from "@/lib/cutoff-data";

export default function SectionAnalysis() {
  return (
    <section className="py-12 px-4">
      <h2 className="text-3xl font-bold mb-10 text-center">Section-Wise Analysis</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cutoffData.sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{section.diff}</div>
                <p className="text-xs text-muted-foreground mb-4">Difficulty</p>
                <p className="text-sm font-medium">{section.focus}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
