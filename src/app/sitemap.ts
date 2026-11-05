import type { MetadataRoute } from "next";

const BASE_URL = "https://cracknqt.vercel.app";

// lastModified reflects actual last content change per route (not build time).
const CONTENT_DATES: Record<string, string> = {
  "": "2026-11-05",
  "/tcs-nqt-preparation": "2026-09-15",
  "/privacy-policy": "2026-08-01",
  "/tcs-nqt-syllabus": "2026-09-10",
  "/tcs-nqt-cutoff": "2026-09-10",
  "/about": "2026-10-01",
  "/contact": "2026-10-01",
  "/premium": "2026-11-04",
  "/coding": "2026-09-20",
  "/practice": "2026-10-15",
  "/tests": "2026-10-15",
  "/tests/advanced": "2026-10-15",
  "/tests/mock": "2026-10-15",
  "/tests/foundation": "2026-10-15",
  "/infosys-se-2027": "2026-11-05",
  "/infosys-se-2027/preparation": "2026-11-05",
};

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.entries(CONTENT_DATES).map(([route, lastModified]) => ({
    url: `${BASE_URL}${route}`,
    lastModified,
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : route === "/infosys-se-2027" ? 0.9 : 0.8,
  }));
}
