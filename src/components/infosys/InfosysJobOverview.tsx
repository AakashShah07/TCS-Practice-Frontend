import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import InfosysSectionHeading from "./InfosysSectionHeading";
import { jobOverview, degreePrograms } from "@/lib/infosys-2027-data";

export default function InfosysJobOverview() {
  return (
    <section id="job-overview" aria-labelledby="job-overview-heading" className="scroll-mt-24">
      <InfosysSectionHeading
        eyebrow="At a glance"
        title="Job Overview"
        sub="Reported details of the Software Engineer (SE) campus drive for the 2027 batch."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {jobOverview.map((item) => (
          <Card key={item.label} className="border-border/60">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-foreground leading-snug">
                {item.value}
              </p>
              {item.sub && (
                <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
                  {item.sub}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Eligible degree programs */}
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Eligible degree programs (reported)
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {degreePrograms.map((degree) => (
            <li key={degree}>
              <Badge variant="secondary" className="px-3 py-1.5 text-xs sm:text-sm font-medium">
                {degree}
              </Badge>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
