import type { MetadataRoute } from "next"

// These rules govern cooperative crawling. Authentication must protect private data.
const privatePaths = ["/api/", "/blogs/admin", "/blogs/preview"]
const discoveryBots = [
  "Googlebot",
  "Bingbot",
  "DuckDuckBot",
  "Applebot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "DuckAssistBot",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: privatePaths },
      // A specifically matched group does not inherit the wildcard group's rules.
      { userAgent: discoveryBots, allow: "/", disallow: privatePaths },
    ],
    host: "https://www.n8ndevelopers.com",
    sitemap: "https://www.n8ndevelopers.com/sitemap.xml",
  }
}
