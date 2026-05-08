import type { Metadata } from "next"
import type { FC } from "react"
import { Check } from "lucide-react"
import Image from "next/image"
import FAQSection from "@/components/blog/FAQSection"
import PromotionBanner from "@/components/blog/PromotionBanner"

export const metadata: Metadata = {
  title: "Join Our Network | n8n Developers",
  description: "Join our global network of n8n experts and monetize your automation skills. Work on global projects and set your own hours.",
  alternates: {
    canonical: "/join-developer",
  },
}

const JoinDeveloperPage: FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
      {/* Left Content */}
      <div className="lg:col-span-6 space-y-6 md:space-y-8">
        <div className="space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black leading-[1.1]">
            <span>Join</span> Our Network Today
          </h1>

          <h2 className="text-xl md:text-2xl font-semibold text-black">Monetize Your Automation Skills</h2>

          <p className="text-base md:text-lg text-black">Are you a pro at building smart workflows with n8n?</p>

          <p className="text-base md:text-lg text-black">
            <a
              href="https://tally.so/r/w4yWKB"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 underline hover:no-underline font-medium"
            >
              Join our developer network
            </a>{" "}
            of freelance automation engineers.
          </p>

          <p className="text-base md:text-lg text-black">We bring the clients, you build the future.</p>
        </div>

        {/* Benefits List */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
            <span className="text-base md:text-lg text-black">Work on global projects</span>
          </div>
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
            <span className="text-base md:text-lg text-black">Set your own hours</span>
          </div>
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
            <span className="text-base md:text-lg text-black">get paid for what you love doing</span>
          </div>
        </div>

        {/* Join as Agency Link */}
        <div className="pt-4">
          <a href="mailto:sasha.ray@n8ndevelopers.com" className="text-base md:text-lg text-black underline hover:no-underline">
            Join as a agency
          </a>
        </div>
      </div>

      {/* Right Content - Team Photo and Badge */}
      <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-8">
        <div className="relative w-full max-w-lg">
          <Image
            src="/team-photo.webp"
            alt="n8n Developers Team - Diverse group of developers from around the world"
            width={600}
            height={400}
            className="w-full h-auto rounded-lg"
            priority
            sizes="(max-width: 1024px) 100vw, 600px"
          />
        </div>

        <div className="flex justify-center">
          <Image
            src="/n8n-network-badge.png"
            alt="We are part of n8n network"
            width={300}
            height={60}
            className="h-auto"
          />
        </div>
      </div>
      
      <div className="lg:col-span-12 mt-20">
        <FAQSection />
        <PromotionBanner />
      </div>
    </div>
  )
}

export default JoinDeveloperPage
