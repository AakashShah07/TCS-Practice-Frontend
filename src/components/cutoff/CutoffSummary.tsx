import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cutoffData } from "@/lib/cutoff-data";

export default function CutoffSummary() {
  return (
    <section className="py-12 px-4">
      <h2 className="text-3xl font-bold mb-10 text-center">Cutoff at a Glance</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {cutoffData.summary.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-border/50">
              <CardHeader className="flex flex-row items-center gap-4">
                <item.icon className="h-8 w-8 text-primary" />
                <CardTitle>{item.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{item.value}</div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
