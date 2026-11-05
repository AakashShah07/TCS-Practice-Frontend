import InfosysSectionHeading from "./InfosysSectionHeading";
import { syllabusCategories } from "@/lib/infosys-2027-data";

/** Category cards — fully visible to crawlers and users, no hidden panels. */
export default function InfosysSyllabus() {
  return (
    <section id="syllabus" aria-labelledby="syllabus-overview-heading" className="scroll-mt-24">
      <InfosysSectionHeading
        eyebrow="What to study"
        title="Infosys System Engineer Syllabus"
        sub="High-yield topics per category — enough to plan your preparation, not a textbook."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {syllabusCategories.map((category) => (
          <div
            key={category.id}
            className="rounded-2xl border border-border/60 bg-card p-5 flex flex-col"
          >
            <h3 className="flex items-center gap-2 text-base sm:text-lg font-bold text-foreground">
              <category.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              {category.label}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {category.topics.map((topic) => (
                <li
                  key={topic}
                  className="rounded-lg border border-border/60 bg-muted/60 px-2.5 py-1 text-[11px] sm:text-xs font-medium text-foreground"
                >
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </section>
  );
}
