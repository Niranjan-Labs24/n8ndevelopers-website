import { DesignPage } from "@/components/design/page"
import { designMetadata } from "@/lib/design-pages"
export const metadata = designMetadata("/")
export default function HomePage() { return <DesignPage route="/" /> }
