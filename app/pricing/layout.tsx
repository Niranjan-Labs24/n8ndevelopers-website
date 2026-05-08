import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing | n8n Developers",
  description: "Flexible pricing models for custom n8n workflow and automation solutions. Hourly, volume, and retainer plans available.",
  alternates: {
    canonical: "/pricing",
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
