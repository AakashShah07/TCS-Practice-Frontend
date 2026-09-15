import type { MetadataRoute } from "next";

const BASE_URL = "https://cracknqt.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const routes = [
    "",
    "/tcs-nqt-preparation",
    "/privacy-policy",
    "/tcs-nqt-syllabus",
    "/tcs-nqt-cutoff",
    "/about",
    "/contact",
    "/premium",
    "/coding",
    "/practice",
    "/tests",
    "/tests/advanced",
    "/tests/mock",
    "/tests/foundation",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
