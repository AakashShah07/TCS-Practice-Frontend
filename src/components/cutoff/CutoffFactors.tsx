import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cutoffData } from "@/lib/cutoff-data";

export default function CutoffFactors() {
  return (
    <section className="py-12 px-4 bg-muted/20">
      <h2 className="text-3xl font-bold mb-10 text-center">What Determines the Cutoff?</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cutoffData.factors.map((factor, i) => (
          <motion.div
            key={factor.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center gap-4">
                <factor.icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-lg">{factor.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{factor.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
