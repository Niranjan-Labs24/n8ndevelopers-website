import type { Metadata } from "next"
import pages from "@/content/site-pages.json"
import pageSeo from "@/content/page-seo.json"

export const siteUrl = "https://www.n8ndevelopers.com"
export type DesignRoute = keyof typeof pages
export const designRoutes = Object.keys(pages) as DesignRoute[]
const seoByRoute: Record<DesignRoute, { description: string; keywords: string[] }> = pageSeo
export const getDesignPage = (route: DesignRoute) => ({ ...pages[route], ...seoByRoute[route] })
export const isDesignRoute = (route: string): route is DesignRoute => Object.hasOwn(pages, route)
const absoluteUrl = (route: string) => `${siteUrl}${route}`

export function designMetadata(route: DesignRoute): Metadata {
  const { title, description, keywords } = getDesignPage(route)
  return {
    title,
    description,
    keywords,
    applicationName: "n8n Developers",
    authors: [{ name: "n8n Developers", url: siteUrl }],
    creator: "n8n Developers",
    publisher: "n8n Developers",
    alternates: { canonical: route, languages: { en: route, "x-default": route } },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    openGraph: {
      title, description, url: route, type: "website", siteName: "n8n Developers", locale: "en_US",
      images: [{ url: "/assets/social/og-image.png", width: 1200, height: 630, type: "image/png", alt: "n8n Developers — forward deployed engineers for workflow automation" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [{ url: "/assets/social/og-image.png", alt: "n8n Developers — forward deployed engineers for workflow automation" }] },
  }
}

type SchemaNode = Record<string, unknown>
const organizationId = `${siteUrl}/#organization`
const websiteId = `${siteUrl}/#website`
const logoId = `${siteUrl}/#logo`
const socialImageId = `${siteUrl}/#social-image`
const collectionRoutes: string[] = ["/compare", "/customer-stories", "/use-cases"]
const segmentNames: Record<string, string> = {
  "use-cases": "Use cases", compare: "Compare", healthcare: "Healthcare", ecommerce: "E-commerce",
  finance: "Finance", construction: "Construction", "real-estate": "Real estate", legal: "Legal", saas: "SaaS",
}

/** A connected graph describes only the organization, page and content visible in the reference. */
export function designStructuredData(route: DesignRoute) {
  const page = getDesignPage(route)
  const canonical = absoluteUrl(route)
  const pageId = `${canonical}#webpage`
  const breadcrumbId = `${canonical}#breadcrumb`
  const pageType = route === "/about" ? "AboutPage" : route === "/contact" ? "ContactPage" : collectionRoutes.includes(route) ? "CollectionPage" : "WebPage"
  const graph: SchemaNode[] = [
    {
      "@type": ["Organization", "ProfessionalService"], "@id": organizationId,
      name: "n8n Developers", url: `${siteUrl}/`, description: seoByRoute["/"].description,
      logo: { "@id": logoId }, areaServed: "Worldwide",
      parentOrganization: { "@type": "Organization", name: "Labs 24", url: "https://labs24.co" },
    },
    { "@type": "ImageObject", "@id": logoId, url: `${siteUrl}/assets/logo/n8n-developers-logo.png`, caption: "n8n Developers" },
    { "@type": "ImageObject", "@id": socialImageId, url: `${siteUrl}/assets/social/og-image.png`, width: 1200, height: 630, caption: "n8n Developers — forward deployed automation engineers" },
    { "@type": "WebSite", "@id": websiteId, url: `${siteUrl}/`, name: "n8n Developers", description: seoByRoute["/"].description, inLanguage: "en", publisher: { "@id": organizationId } },
  ]
  const breadcrumbItems = [{ "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` }]
  const segments = route.split("/").filter(Boolean)
  segments.forEach((segment, index) => {
    const itemRoute = `/${segments.slice(0, index + 1).join("/")}`
    breadcrumbItems.push({
      "@type": "ListItem", position: index + 2,
      name: index === segments.length - 1 ? page.title.split(" | ")[0] : segmentNames[segment] || segment,
      item: absoluteUrl(itemRoute),
    })
  })
  graph.push({ "@type": "BreadcrumbList", "@id": breadcrumbId, itemListElement: breadcrumbItems })

  const contentNodes: SchemaNode[] = []
  const counts = new Map<string, number>()
  for (const source of page.schemas) {
    const node: SchemaNode = { ...source }
    const type = String(node["@type"])
    // These are represented once, with stable IDs and consistent URLs above/below.
    if (["Organization", "ProfessionalService", "WebSite", "BreadcrumbList", "AboutPage", "ContactPage", "CollectionPage", "WebPage"].includes(type)) continue
    delete node["@context"]
    const count = (counts.get(type) || 0) + 1
    counts.set(type, count)
    node["@id"] = `${canonical}#${type.toLowerCase()}${count > 1 ? `-${count}` : ""}`
    node.url = canonical
    if (type === "Article") {
      node.description = page.description
      node.author = { "@id": organizationId }
      node.publisher = { "@id": organizationId }
      node.mainEntityOfPage = { "@id": pageId }
      node.image = { "@id": socialImageId }
      node.inLanguage = "en"
    } else if (type === "Service") {
      node.description = page.description
      node.provider = { "@id": organizationId }
    } else if (["FAQPage", "HowTo"].includes(type)) {
      node.isPartOf = { "@id": pageId }
      node.inLanguage = "en"
    }
    contentNodes.push(node)
  }
  graph.push({
    "@type": pageType, "@id": pageId, url: canonical, name: page.title, description: page.description,
    inLanguage: "en", isPartOf: { "@id": websiteId }, about: { "@id": organizationId },
    publisher: { "@id": organizationId }, breadcrumb: { "@id": breadcrumbId }, primaryImageOfPage: { "@id": socialImageId },
    keywords: page.keywords.join(", "),
    mainEntity: contentNodes.length ? contentNodes.map(node => ({ "@id": node["@id"] })) : { "@id": organizationId },
  }, ...contentNodes)
  return { "@context": "https://schema.org", "@graph": graph }
}
