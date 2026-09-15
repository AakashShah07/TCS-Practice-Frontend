import type { Metadata } from "next";
import Script from "next/script";
import Providers from "@/components/providers";
import "./globals.css";

const siteUrl = "https://cracknqt.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "CrackNQT — TCS NQT Practice, Mock Tests & Preparation",
    template: "%s | CrackNQT",
  },
  description:
    "Prepare for TCS NQT with topic-wise practice, exam-style mock tests and performance tracking. Start free and unlock advanced preparation with Premium.",
  keywords: [
    "TCS NQT",
    "TCS NQT practice test",
    "TCS NQT preparation",
    "TCS NQT free questions",
    "TCS NQT mock test",
    "TCS NQT exam simulation",
    "TCS recruitment test",
    "TCS National Qualifier Test",
    "NQT practice",
    "NQT preparation online",
    "NQT aptitude test",
    "TCS NQT numerical ability",
    "TCS NQT verbal ability",
    "TCS NQT reasoning",
  ],
  authors: [{ name: "CrackNQT" }],
  creator: "CrackNQT",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "CrackNQT",
    title: "CrackNQT — TCS NQT Practice, Mock Tests & Preparation",
    description:
      "Prepare for TCS NQT with topic-wise practice, exam-style mock tests and performance tracking. Start free and unlock advanced preparation with Premium.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CrackNQT — TCS NQT Practice Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CrackNQT — TCS NQT Practice, Mock Tests & Preparation",
    description:
      "Prepare for TCS NQT with topic-wise practice, exam-style mock tests and performance tracking. Start free and unlock advanced preparation with Premium.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    // Replace with your actual Google Search Console verification code
    // google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "CrackNQT",
      url: siteUrl,
      description:
        "TCS NQT practice platform with exam simulation and advanced preparation tools",
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/practice?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      name: "CrackNQT",
      url: siteUrl,
      logo: `${siteUrl}/llog.png`,
      description:
        "Independent preparation platform for TCS NQT and placement exams. Free to start, with Premium tools for advanced preparation.",
    },
    {
      "@type": "Course",
      name: "TCS NQT Preparation",
      description:
        "Comprehensive TCS NQT exam preparation with practice questions, real exam simulation, and analytics. Premium features available for advanced preparation.",
      provider: {
        "@type": "Organization",
        name: "CrackNQT",
        url: siteUrl,
      },
      isAccessibleForFree: true,
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        url: `${siteUrl}/tests`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <head>
        <meta name="google-adsense-account" content="ca-pub-9796476439148629"></meta>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XF4D0X8KBZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XF4D0X8KBZ');
          `}
        </Script>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9796476439148629"
          crossOrigin="anonymous"
        ></Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
