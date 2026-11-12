"use client"

import { Suspense, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Header as LegacyHeader } from "@/components/legacy/header"
import { Footer as LegacyFooter } from "@/components/legacy/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { PromotionPopup } from "@/components/PromotionPopup"
import { Toaster } from "@/components/ui/sonner"
import NavigationProgress from "@/components/NavigationProgress"
import GlobalDotAccent from "@/components/GlobalDotAccent"

/** Keep the existing publishing experience separate from the marketing revamp. */
export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const legacy = pathname === "/blogs" || pathname.startsWith("/blogs/") || pathname === "/join-developer" || pathname.startsWith("/join-developer/")

  if (legacy) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <PromotionPopup />
        <Toaster />
        <GlobalDotAccent />
        <LegacyHeader />
        <main className="px-0 py-0">{children}</main>
        <LegacyFooter />
      </ThemeProvider>
    )
  }

  return (
    <div className="revamp-site">
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  )
}

export default SiteShell
