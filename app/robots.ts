import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://myfinance.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login"],
      disallow: ["/api/", "/dashboard", "/transactions", "/wallets", "/settings"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
