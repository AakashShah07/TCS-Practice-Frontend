"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, AlertTriangle, MessageSquare, Zap, ShieldCheck } from "lucide-react"

const options = [
  { icon: HelpCircle, title: "General Questions", description: "Got questions about the platform or how it works?" },
  { icon: AlertTriangle, title: "Technical Issue", description: "Report bugs or technical difficulties encountered." },
  { icon: MessageSquare, title: "Content Feedback", description: "Report incorrect questions, answers, or explanations." },
  { icon: Zap, title: "Premium/Payment", description: "Questions regarding premium features or payments." },
  { icon: ShieldCheck, title: "Privacy Request", description: "Inquiries about your data and privacy." },
]

export function ContactOptions() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">How Can We Help?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center gap-4">
                  <option.icon className="size-8 text-primary" />
                  <CardTitle>{option.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  {option.description}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
