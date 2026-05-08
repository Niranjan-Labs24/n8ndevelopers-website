import { FC } from "react"
import PricingFAQ from "./components/PricingFAQ"
import PromotionBanner from "@/components/blog/PromotionBanner"
import PricingClient from "./components/PricingClient"

const PricingPage: FC = () => {
  const originalPrices = [50, 40, 30]

  return (
    <div className="flex flex-col pt-4 md:pt-6">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center mb-8 md:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black leading-tight mb-6">
          <span className="text-[#FF7A59]">Pricing</span> that works for <br /> every need
        </h1>
      </div>

      {/* Pricing Cards Grid (Hydrated by Client) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <PricingClient originalPrices={originalPrices} />
      </div>

      {/* FAQ Section */}
      <PricingFAQ />

      {/* Promotion Banner */}
      <PromotionBanner />
    </div>
  )
}

export default PricingPage
