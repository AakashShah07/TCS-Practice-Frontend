import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t py-6 mt-auto">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>TCS NQT Practice Platform</p>
        <Link href="/about" className="hover:text-primary transition-colors">
          About Us
        </Link>
        <Link href="/privacy-policy" className="hover:text-primary transition-colors">
          Privacy Policy
        </Link>
        <p>Built for exam preparation. Not affiliated with TCS.</p>
      </div>
    </footer>
  );
}
