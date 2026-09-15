import Link from 'next/link';
import { Button } from './button';

export function NextStep({ label, href, description }: { label: string; href: string; description?: string }) {
  return (
    <div className="mt-8 p-6 border rounded-lg bg-muted/50">
      {description && <p className="mb-4 text-muted-foreground">{description}</p>}
      <Button asChild>
        <Link href={href}>{label}</Link>
      </Button>
    </div>
  );
}
