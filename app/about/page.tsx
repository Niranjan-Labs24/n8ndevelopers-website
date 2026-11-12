import { DesignPage } from "@/components/design/page"
import { designMetadata } from "@/lib/design-pages"
export const metadata = designMetadata("/about")
export default function AboutPage() { return <DesignPage route="/about" /> }
