"use client";

import SyllabusHero from "@/components/syllabus/SyllabusHero";
import { syllabusCategories } from "@/lib/syllabus-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function SyllabusPage() {
  return (
    <div className="min-h-screen bg-background">
      <SyllabusHero />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-10">Syllabus Breakdown</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {syllabusCategories.map((category) => (
            <Card key={category.id} className="border-border/50">
              <CardHeader className="flex flex-row items-center gap-4">
                <category.icon className={`h-8 w-8 ${category.color}`} />
                <CardTitle>{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{category.description}</p>
                <div className="space-y-6">
                  {category.sections.map((section) => (
                    <div key={section.title}>
                      <h4 className="font-semibold mb-2">{section.title}</h4>
                      <div className="flex flex-wrap gap-2">
                        {section.topics.map((topic) => (
                          <span key={topic} className="px-2 py-1 bg-muted rounded-md text-xs font-medium hover:bg-primary/10 transition-colors">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
