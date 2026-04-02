import type React from "react"
import type { Metadata } from "next"
import { GoogleAnalytics } from "@next/third-parties/google"
import Script from "next/script"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import "@/app/globals.css"
import { PromotionPopup } from "@/components/PromotionPopup"
import ChatbaseScript from "@/components/chatbase"
import OfferBar from "@/components/OfferBar"
import NavigationProgress from "@/components/NavigationProgress"
import GlobalDotAccent from "@/components/GlobalDotAccent"
import { Toaster } from "@/components/ui/sonner"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "n8n Developers | Custom Workflow & Automation Solutions",
  description:
    "Hire expert n8n developers for workflow automation, integration, and custom solutions. Boost efficiency with tailored n8n services today.",
  keywords: "n8n Developers, n8n Workflow Automation, Hire n8n Experts",
  verification: {
    google: "dvHTOSJR4zdlxAgVgmxbghvshaT34Zee1oA0hg_3Qc0",
  },
  alternates: {
    canonical: "https://www.n8ndevelopers.com/",
  },
  icons: {
    icon: "/n8n logo.png",
    shortcut: "/n8n logo.png",
    apple: "/n8n logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || ""} />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
          {/* <PromotionPopup /> */}
          <Toaster />
          <GlobalDotAccent />
          <Header />
          {/* <OfferBar /> */}
          <main className="px-0 py-0">
            {children}
          </main>
          <Footer />
        </ThemeProvider>

        <ChatbaseScript />

        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="875d1f20-cdec-45f8-b918-0665e17654b0"
          type="text/javascript"
          async
        />
      </body>
    </html>
  )
}
