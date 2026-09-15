import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface RelatedLink {
  label: string;
  href: string;
}

export function RelatedContent({ title, links }: { title: string; links: RelatedLink[] }) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-primary hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
