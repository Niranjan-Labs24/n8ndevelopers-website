// Forced re-compile
import type { FC } from "react"
import Image from "next/image"
import { CircleCheck } from "lucide-react"
import FAQSection from "@/components/blog/FAQSection"
import PromotionBanner from "@/components/blog/PromotionBanner"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About N8N Developers | Hire n8n Experts & Consultants",
  description: "Learn about n8n Developers — a global network of n8n experts making workflow automation accessible to every business.",
  keywords: "n8n developers, workflow automation experts, n8n consultants, hire n8n developers, n8n agency",
  alternates: {
    canonical: "/about",
  },
}

const pillars = [
  {
    tag: "Purpose",
    title: "Democratizing Automation",
    body: "We believe automation should not be a luxury reserved for Fortune 500 companies with million-dollar IT budgets. n8nDevelopers.com exists to make powerful automation accessible to everyone — from early-stage founders and scrappy teams to scale-ups and non-technical decision-makers.",
  },
  {
    tag: "Solution",
    title: "Removing Every Barrier",
    body: "By building a global network of n8n experts and offering flexible, affordable engagement models, we remove the barriers to automation adoption.",
    bullets: [
      "No need for in-house developers",
      "No long-term contracts",
      "No steep learning curves",
    ],
  },
  {
    tag: "Result",
    title: "A World That Runs Smarter",
    body: "We envision a world where every repetitive task can be offloaded, every team can focus on creativity and growth, and every company — regardless of size — can operate like a tech-first company.",
  },
]

const stats = [
  { value: "200+", label: "Workflows Delivered" },
  { value: "50+", label: "Clients Worldwide" },
  { value: "15+", label: "n8n Certified Experts" },
  { value: "98%", label: "Client Satisfaction" },
]

const AboutPage: FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#FFF5F2] border border-[#FFE7E0] rounded-full px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[#FF7A59]" />
              <span className="text-sm font-bold text-[#FF7A59] uppercase tracking-wider">Our Story</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black leading-tight">
              Democratizing <span className="text-[#FF7A59]">Automation</span>,<br />
              One Workflow at a Time
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              We are an independent global network of n8n experts — not affiliated with n8n GmbH — dedicated to making powerful workflow automation accessible to every business.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#FFF5F2] border border-[#FFE7E0] rounded-3xl p-8 space-y-2"
              >
                <p className="text-4xl font-extrabold text-black">{stat.value}</p>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.tag}
              className={`rounded-[2.5rem] p-8 md:p-10 space-y-6 border ${
                i === 1
                  ? "bg-black border-black text-white"
                  : "bg-white border-gray-100 hover:border-gray-200"
              } transition-all hover:shadow-lg`}
            >
              <span
                className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                  i === 1
                    ? "bg-white/10 text-[#FF7A59]"
                    : "bg-[#FFF5F2] text-[#FF7A59]"
                }`}
              >
                {pillar.tag}
              </span>
              <h2
                className={`text-2xl font-extrabold leading-snug ${
                  i === 1 ? "text-white" : "text-black"
                }`}
              >
                {pillar.title}
              </h2>
              <p
                className={`text-base leading-relaxed ${
                  i === 1 ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {pillar.body}
              </p>
              {pillar.bullets && (
                <ul className="space-y-3">
                  {pillar.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <CircleCheck className="h-5 w-5 text-[#FF7A59] flex-shrink-0 mt-0.5" />
                      <span className={`text-sm font-medium ${i === 1 ? "text-gray-300" : "text-gray-600"}`}>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer Note */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl px-8 py-6 flex items-start gap-4">
          <span className="text-2xl">ℹ️</span>
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong className="text-black">Disclaimer:</strong> We are not part of n8n GmbH, the creators of the n8n workflow automation tool.
            n8nDevelopers.com is an independent network of expert developers who specialize in building with n8n.
          </p>
        </div>
      </section>

      {/* FAQ + CTA */}
      <FAQSection />
      <PromotionBanner />
    </div>
  )
}

export default AboutPage
