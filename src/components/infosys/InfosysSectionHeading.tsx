/** Shared section heading used across the Infosys 2027 page sections. */
export default function InfosysSectionHeading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-8 sm:mb-10">
      {eyebrow && (
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
        {title}
      </h2>
      {sub && (
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
          {sub}
        </p>
      )}
    </div>
  );
}
