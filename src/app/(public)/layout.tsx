import LandingNavbar from "@/components/layout/LandingNavbar";

/**
 * Public marketing/SEO section — uses the public landing navbar.
 * (The authenticated app shell lives in (main) and uses its own navbar.)
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingNavbar />
      {children}
    </>
  );
}
