import { Element, Text, htmlToDOM, type DOMNode } from "html-react-parser"
import { designRoutes, getDesignPage } from "@/lib/design-pages"
import { CADLENLY_URL } from "@/app/constants"

const siteUrl = "https://www.n8ndevelopers.com"
const absolute = (href: string) => new URL(href, siteUrl).toString()
const text = (value: string) => value.replace(/[\t \u00a0]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim()

function readable(nodes: DOMNode[]): string {
  return nodes.map(node => {
    if (node instanceof Text) return node.data
    if (!(node instanceof Element)) return ""
    const classes = (node.attribs.class || "").split(/\s+/)
    if (["script", "style", "form", "nav", "svg", "iframe", "input", "select", "textarea", "figcaption"].includes(node.name)
      || node.attribs["aria-hidden"] === "true" || "hidden" in node.attribs
      || node.attribs.id === "book" || classes.some(name => ["chipnav", "sv-f", "seg", "board", "kpis"].includes(name))) return ""
    const body = readable(node.children as DOMNode[])
    if (/^h[1-6]$/.test(node.name)) return `\n\n${"#".repeat(Math.min(Number(node.name[1]) + 2, 6))} ${text(body)}\n\n`
    if (node.name === "button") {
      const parent = node.parent
      return parent instanceof Element && (parent.attribs.class || "").split(/\s+/).includes("qa") ? `\n\n**${text(body)}**\n\n` : ""
    }
    if (node.name === "a") {
      const href = node.attribs.href
      if (href && /^(\/|https?:|mailto:)/i.test(href) && text(body)) return `[${text(body)}](${href.startsWith("mailto:") ? href : absolute(href)})`
      return body
    }
    if (node.name === "li") return `\n- ${text(body)}\n`
    if (node.name === "br") return "\n"
    if (["span", "b", "strong", "small", "em", "i", "label"].includes(node.name)) return ` ${body} `
    if (node.name === "td" || node.name === "th") return `${text(body)} | `
    if (["p", "div", "section", "header", "article", "ul", "ol", "table", "tr", "blockquote"].includes(node.name)) return `\n${body}\n`
    return body
  }).join("")
}

export function llmsIndex(): string {
  const entries = designRoutes.map(route => {
    const page = getDesignPage(route)
    return `- [${page.title}](${absolute(route)}): ${page.description}`
  }).join("\n")
  return `# n8n Developers

> Forward deployed n8n engineers who embed with businesses to build, operate and improve workflow automation, AI agents and integrations. An initiative by Labs 24.

## What this site covers

Public information about n8n automation services, the forward deployed engineering model, industry use cases, customer stories, pricing and agency partnerships. Work can use n8n Cloud or self-hosted n8n alongside APIs, databases and custom code. Engagements are scoped around the customer's process.

## Public pages

${entries}

## Existing resources and contact

- [Blog](${siteUrl}/blogs): Existing tutorials and insights; its content and publishing integration are unchanged.
- [Join the developer team](${siteUrl}/join-developer): Existing developer recruitment page.
- [Book a 30-minute process review](${CADLENLY_URL}): Confirm current availability with the existing scheduler.
- [Contact](${siteUrl}/contact): Discuss a process or partnership.
- Email: sasha.ray@n8ndevelopers.com
- [Labs 24](https://labs24.co): Parent initiative.

## Discovery files

- [Sitemap](${siteUrl}/sitemap.xml)
- [Crawler rules](${siteUrl}/robots.txt)
- [Expanded public marketing content](${siteUrl}/llms-full.txt)

The linked web pages are the canonical sources. This optional Markdown index is provided for readability; it does not grant access to private routes or guarantee inclusion in any search or AI service.
`
}

export function llmsFull(): string {
  const documents = designRoutes.map(route => {
    const page = getDesignPage(route)
    return `## ${page.title}\n\nCanonical URL: ${absolute(route)}\n\n${page.description}\n\n${text(readable(htmlToDOM(page.html)))}\n`
  }).join("\n---\n\n")
  return `# n8n Developers — public marketing content

This document contains readable excerpts from the public marketing pages. The canonical web pages remain the primary sources. Navigation, form fields, booking controls and scripts are omitted. Blog articles are not duplicated here; read the existing blog at ${siteUrl}/blogs.

${documents}
`
}

export const discoveryHeaders = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
  "X-Content-Type-Options": "nosniff",
}
