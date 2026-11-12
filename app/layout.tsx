import type { Metadata, Viewport } from "next"
import Script from "next/script"
import localFont from "next/font/local"
import { SiteShell } from "@/components/site-shell"
import ChatbaseScript from "@/components/chatbase"
import "@/app/globals.css"
import "@/styles/design/site.css"
import "@/styles/design/pages.css"
import "@/styles/design/refinements.css"

const manrope = localFont({ src: "../public/fonts/manrope/Manrope-Variable.ttf", variable: "--font-manrope", display: "swap", weight: "200 800" })
const mono = localFont({ src: "../public/fonts/jetbrains-mono/JetBrainsMono-Variable.ttf", variable: "--font-jetbrains", display: "swap", weight: "100 800" })

const gilroy = localFont({ src: [
  { path: "../public/fonts/gilroy/Gilroy-Regular.ttf", weight: "400", style: "normal" },
  { path: "../public/fonts/gilroy/Gilroy-Medium.ttf", weight: "500", style: "normal" },
  { path: "../public/fonts/gilroy/Gilroy-SemiBold.ttf", weight: "600", style: "normal" },
  { path: "../public/fonts/gilroy/Gilroy-Bold.ttf", weight: "700", style: "normal" },
], variable: "--font-gilroy", display: "swap" })
const spaceGrotesk = localFont({ src: "../public/fonts/space-grotesk/SpaceGrotesk-Variable.ttf", variable: "--font-space-grotesk", display: "swap" })

export const viewport: Viewport = { themeColor: "#fdfcf8" }
export const metadata: Metadata = {
  metadataBase: new URL("https://www.n8ndevelopers.com"),
  title: "Forward Deployed n8n Engineers | n8n Developers",
  description: "Forward deployed n8n engineers who work inside your business, automate repetitive work and stay on to keep every workflow running.",
  verification: { google: "dvHTOSJR4zdlxAgVgmxbghvshaT34Zee1oA0hg_3Qc0" },
  icons: { icon: "/assets/logo/favicon.png", apple: "/assets/logo/favicon.png" },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body className={`antialiased font-sans ${manrope.variable} ${mono.variable} ${gilroy.variable} ${spaceGrotesk.variable}`}>
    {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} strategy="lazyOnload" />
      <Script id="google-analytics" strategy="lazyOnload">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS)});`}</Script>
    </>}
    <SiteShell>{children}</SiteShell>
    <ChatbaseScript />
    <Script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="875d1f20-cdec-45f8-b918-0665e17654b0" strategy="lazyOnload" />
  </body></html>
}
