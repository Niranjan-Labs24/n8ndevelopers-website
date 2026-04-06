import type { FC } from "react"
import { Check, Activity, Star } from "lucide-react"
import Cadlenly from "./components/cadlenly"
import Image from "next/image"
import Link from "next/link"
import { CADLENLY_URL } from "./constants"

const LandingPage: FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-[clamp(1rem,3vw,2rem)] w-full pt-[clamp(1rem,4vw,1.5rem)] pb-[clamp(1.5rem,6vw,4rem)] overflow-hidden">
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-[clamp(3rem,8vw,10rem)] items-start">
          {/* Left Content */}
          <div className="space-y-[clamp(2rem,4vw,3rem)]">
            <div className="space-y-[clamp(1rem,2vw,1.5rem)]">
              <h1 className="text-[clamp(1.75rem,4vw+1rem,3.5rem)] font-semibold tracking-[-0.03em] text-black leading-[1.1]">
                <span className="inline-block sm:whitespace-nowrap">Stop <span className="text-[#FF7A59]">wrestling workflows.</span></span><br className="hidden sm:block" />
                Let a dedicated n8n <br className="hidden sm:block" />
                team handle it.
              </h1>
              <p className="text-[clamp(1.125rem,2vw+0.5rem,1.25rem)] text-gray-500 max-w-xl leading-relaxed">
                We design, run, and maintain complex production-ready n8n automations for growing teams.
              </p>
            </div>

            {/* Benefits List */}
            <ul className="space-y-[clamp(1rem,1.5vw,1.25rem)]">
              {[
                "Automation consultation to define the right workflows",
                "Production-ready n8n workflows, end to end",
                "Seamless integrations across your SaaS stack",
                "Fewer manual steps, fewer operational errors",
                "Clear ownership of critical automations",
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-[clamp(0.75rem,1vw,1rem)]">
                  <div className="mt-1 bg-green-500 rounded-full p-0.5 flex-shrink-0">
                    <Check className="h-4 w-4 text-white font-bold" />
                  </div>
                  <span className="text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-bold text-black leading-snug">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA and Trust Bar */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-[clamp(1rem,2vw,2rem)] pt-[clamp(0.5rem,1vw,1rem)]">
              <div className="space-y-3 flex flex-col items-center sm:items-start w-full sm:w-auto">
                <Link 
                  href={CADLENLY_URL}
                  target="_blank"
                  className="inline-flex items-center justify-center bg-[#FF7442] hover:bg-[#ff6a42] text-white transition-all text-center whitespace-nowrap border border-black shadow-[2px_3px_0_0_#000] rounded-xl font-[Manrope] font-semibold text-[clamp(1rem,2vw,1.125rem)] leading-8 tracking-[-0.03em] px-[clamp(1.5rem,4vw,3.25rem)] py-[clamp(0.75rem,2vw,1.25rem)] w-full sm:w-auto min-w-[clamp(14rem,30vw,17.5rem)] min-h-[clamp(3.5rem,8vw,4.5rem)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none"
                >
                  Book free automation call
                </Link>
                <div className="w-full sm:max-w-[280px] flex justify-center">
                  <p className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-gray-500 font-bold flex items-center gap-2">
                    <Image
                      src="/icons/15 min.png"
                      alt="15 min"
                      width={16}
                      height={16}
                      className="h-4 w-4 object-contain"
                    />
                    15-min discovery call
                  </p>
                </div>
              </div>

              {/* Rating Section */}
              <div className="flex flex-col xs:flex-row items-center gap-[clamp(0.75rem,1.5vw,1.5rem)] sm:mt-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="relative w-[clamp(2.5rem,4vw,3rem)] h-[clamp(2.5rem,4vw,3rem)] rounded-full border-2 border-white overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image
                        src={`/Rating/Frame 214722566${i+3 > 7 ? 4 : i+3}.png`}
                        alt="User avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-1 items-center xs:items-start text-center xs:text-left">
                  <div className="flex text-yellow-400 justify-center xs:justify-start">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-[clamp(0.75rem,1.5vw,1rem)] h-[clamp(0.75rem,1.5vw,1rem)] fill-current" />
                    ))}
                  </div>
                  <p className="text-[clamp(0.875rem,1.5vw,1rem)] font-normal text-black leading-tight sm:whitespace-nowrap">Trusted by founders and CXO's</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Widget */}
          <div className="w-full flex lg:justify-end">
            <Cadlenly />
          </div>
        </div>
      </section>

      <section 
        className="w-full border-t border-[#0000000F] overflow-hidden"
        style={{ background: "linear-gradient(93.96deg, #FFFFFF -15.76%, #FFEDE7 141.1%)" }}
      >
        <div className="max-w-7xl mx-auto px-[clamp(1rem,3vw,2rem)] py-[clamp(2rem,5vw,3rem)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(2rem,5vw,3rem)]">
            {[
              {
                icon: "/icons/Frame 2147225439.png",
                title: "Dedicated team with our automation manager",
                desc: "No freelancers. No handoffs",
              },
              {
                icon: "/icons/Frame 2147225439 (1).png",
                title: "Ongoing monitoring - Optional",
                desc: "We maintain what we build",
              },
              {
                icon: "/icons/Frame 2147225439 (2).png",
                title: "Flexible engagement for Quick growth",
                desc: "Scale up or pause anytime",
              },
              {
                icon: "/icons/Frame 2147225439 (3).png",
                title: "We work on Hourly blocks. Starts at $30 Per hour",
                desc: "No hidden fees or surprise",
              },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center lg:items-start lg:text-left gap-[clamp(0.75rem,2vw,1.25rem)] w-full h-full"
              >
                <div 
                  className="w-[clamp(2.5rem,4vw,3.5rem)] h-[clamp(2.5rem,4vw,3.5rem)] rounded-lg flex items-center justify-center border border-[#1313131A] flex-shrink-0"
                  style={{ background: "linear-gradient(93.96deg, #FFFFFF -15.76%, #FFEDE7 141.1%)" }}
                >
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={28}
                    height={28}
                    className="w-[60%] h-[60%] object-contain"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="font-['Gilroy'] font-semibold text-[clamp(0.875rem,1.5vw,1rem)] leading-relaxed text-black/50">
                    {feature.desc}
                  </p>
                  <h3 className="font-['Gilroy'] font-semibold text-[clamp(1.125rem,2vw+0.5rem,1.5rem)] leading-snug text-black">
                    {feature.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
