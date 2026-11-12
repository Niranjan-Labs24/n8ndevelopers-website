import { notFound } from "next/navigation"
import { DesignPage } from "@/components/design/page"
import { designMetadata, designRoutes, isDesignRoute } from "@/lib/design-pages"

type Props = { params: Promise<{ slug: string[] }> }
export const dynamicParams = false
export function generateStaticParams() {
  return designRoutes.filter(route => !["/", "/about", "/pricing"].includes(route)).map(route => ({ slug: route.slice(1).split("/") }))
}
export async function generateMetadata({ params }: Props) {
  const route = "/" + (await params).slug.join("/")
  return isDesignRoute(route) ? designMetadata(route) : {}
}
export default async function MarketingPage({ params }: Props) {
  const route = "/" + (await params).slug.join("/")
  if (!isDesignRoute(route)) notFound()
  return <DesignPage route={route} />
}
