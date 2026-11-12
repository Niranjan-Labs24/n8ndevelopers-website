import { designHtml } from "./html"
import { DesignInteractions } from "./interactions"
import { getDesignPage, designStructuredData, type DesignRoute } from "@/lib/design-pages"

/** Trusted, versioned copy and markup from the supplied design system. Never accepts request HTML. */
export function DesignPage({ route }: { route: DesignRoute }) {
  const page = getDesignPage(route)
  return (
    <DesignInteractions>
      {page.styles && <style>{page.styles}</style>}
      {designHtml(page.html)}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(designStructuredData(route)).replace(/</g, "\\u003c") }} />
    </DesignInteractions>
  )
}
