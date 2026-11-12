import { DesignPage } from "@/components/design/page"
import { designMetadata } from "@/lib/design-pages"
export const metadata = designMetadata("/pricing")
export default function PricingPage() { return <DesignPage route="/pricing" /> }
