import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/analytics",
          "/results/",
          "/exam/",
        ],
      },
    ],
    sitemap: "https://cracknqt.vercel.app/sitemap.xml",
  };
}
