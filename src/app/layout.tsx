import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://nqtprep.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "NQT Prep — Free TCS NQT Practice Tests & Exam Simulation",
    template: "%s | NQT Prep",
  },
  description:
    "Free TCS NQT practice platform with 1000+ questions, real exam simulation, smart analytics, and detailed solutions. No ads, 100% free, student focused.",
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
    "free NQT questions",
    "TCS NQT numerical ability",
    "TCS NQT verbal ability",
    "TCS NQT reasoning",
  ],
  authors: [{ name: "NQT Prep" }],
  creator: "NQT Prep",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "NQT Prep",
    title: "NQT Prep — Free TCS NQT Practice Tests & Exam Simulation",
    description:
      "Crack TCS NQT with confidence. Free practice tests with 1000+ questions, real exam simulation, and smart analytics. No ads, completely free.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NQT Prep — Free TCS NQT Practice Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NQT Prep — Free TCS NQT Practice Tests",
    description:
      "Free TCS NQT exam practice with real simulation, 1000+ questions, and smart analytics.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
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
      name: "NQT Prep",
      url: siteUrl,
      description:
        "Free TCS NQT practice platform with real exam simulation and smart analytics",
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/practice?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      name: "NQT Prep",
      url: siteUrl,
      logo: `${siteUrl}/llog.png`,
      description:
        "Free TCS NQT practice test and preparation platform — No ads, 100% free, student focused",
    },
    {
      "@type": "Course",
      name: "TCS NQT Preparation",
      description:
        "Comprehensive TCS NQT exam preparation with 1000+ practice questions, real exam simulation, and detailed analytics",
      provider: {
        "@type": "Organization",
        name: "NQT Prep",
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
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
