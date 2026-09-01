import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Brain, Code2, BarChart3, Clock, Crown } from "lucide-react";

const features = [
  { title: "Mock Tests", icon: FileText, desc: "Attempt realistic TCS NQT mock tests." },
  { title: "Sectional Practice", icon: Brain, desc: "Focus on individual topics." },
  { title: "Coding Practice", icon: Code2, desc: "Enhance coding speed & accuracy." },
  { title: "Performance Analytics", icon: BarChart3, desc: "Deep insights into your performance." },
  { title: "Daily Practice", icon: Clock, desc: "Stay consistent daily." },
  { title: "Premium Access", icon: Crown, desc: "Unlock advanced materials." },
];

export default function PreparationFeatures() {
  return (
    <section className="py-20 px-4 bg-muted/20 rounded-3xl">
      <h2 className="text-3xl font-bold text-center mb-12">Core Preparation Features</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            viewport={{ once: true }}
          >
            <Card className="hover:bg-primary/5 transition-colors border-border/50">
              <CardContent className="pt-6">
                <feature.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
