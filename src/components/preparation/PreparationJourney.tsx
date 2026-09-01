import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Understand", desc: "Know exam structure." },
  { num: "02", title: "Practice", desc: "Daily focused work." },
  { num: "03", title: "Test", desc: "Simulate real exams." },
  { num: "04", title: "Analyze", desc: "Review mistakes." },
  { num: "05", title: "Improve", desc: "Bridge gaps." },
];

export default function PreparationJourney() {
  return (
    <section className="py-20 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Your Preparation Journey</h2>
      <div className="grid md:grid-cols-5 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center space-y-2"
          >
            <div className="text-4xl font-black text-primary/30 mb-2">{step.num}</div>
            <h3 className="font-bold">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
