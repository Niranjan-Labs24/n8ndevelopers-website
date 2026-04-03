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
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 md:pt-6 pb-6 md:pb-16 overflow-hidden">
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-40 items-start">
          {/* Left Content */}
          <div className="space-y-8 md:space-y-12">
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-[28px] xs:text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-semibold tracking-[-0.03em] text-black leading-tight lg:leading-[63px]">
                <span className="inline-block sm:whitespace-nowrap">Stop <span className="text-[#FF7A59]">wrestling workflows.</span></span><br className="hidden sm:block" />
                Let a dedicated n8n <br className="hidden sm:block" />
                team handle it.
              </h1>
              <p className="text-lg md:text-xl text-gray-500 max-w-xl leading-relaxed">
                We design, run, and maintain complex production-ready n8n automations for growing teams.
              </p>
            </div>

            {/* Benefits List */}
            <ul className="space-y-4 md:space-y-5">
              {[
                "Automation consultation to define the right workflows",
                "Production-ready n8n workflows, end to end",
                "Seamless integrations across your SaaS stack",
                "Fewer manual steps, fewer operational errors",
                "Clear ownership of critical automations",
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="mt-1 bg-green-500 rounded-full p-0.5 flex-shrink-0">
                    <Check className="h-4 w-4 text-white font-bold" />
                  </div>
                  <span className="text-base md:text-xl font-bold text-black">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA and Trust Bar */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-4 lg:gap-4 pt-4">
              <div className="space-y-3 flex flex-col items-center sm:items-start w-full sm:w-auto">
                <Link 
                  href={CADLENLY_URL}
                  target="_blank"
                  className="inline-flex items-center justify-center bg-[#FF7442] hover:bg-[#ff6a42] text-white transition-all text-center whitespace-nowrap border-[1px] border-black"
                  style={{
                    width: '280px',
                    height: '72px',
                    gap: '8px',
                    opacity: 1,
                    borderRadius: '12px',
                    padding: '20px 52px',
                    boxShadow: '2px 3px 0px 0px #000000',
                    fontFamily: 'Manrope',
                    fontWeight: 600,
                    fontSize: '18px',
                    lineHeight: '32px',
                    letterSpacing: '-3%',
                  }}
                >
                  Book free automation call
                </Link>
                <div className="w-full max-w-[280px] flex justify-center">
                  <p className="text-sm text-gray-500 font-bold flex items-center gap-2">
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
              <div className="flex flex-col xs:flex-row items-center gap-4 sm:gap-6 sm:mt-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white overflow-hidden bg-gray-200 flex-shrink-0">
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
                      <Star key={s} className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base font-normal text-black leading-tight sm:whitespace-nowrap">Trusted by founders and CXO's</p>
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
        className="w-full border-t-[1px] border-[#0000000F] overflow-hidden"
        style={{
          background: "linear-gradient(93.96deg, #FFFFFF -15.76%, #FFEDE7 141.1%)",
          minHeight: "257px"
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-[48px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-[48px]">
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
                className="flex flex-col items-center text-center lg:items-start lg:text-left gap-[20px] w-full lg:w-[284px] h-full lg:h-[161px]"
              >
                <div 
                  className="w-[40px] h-[40px] rounded-lg flex items-center justify-center border-[1px] border-[#1313131A] flex-shrink-0"
                  style={{
                    background: "linear-gradient(93.96deg, #FFFFFF -15.76%, #FFEDE7 141.1%)"
                  }}
                >
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={28}
                    height={28}
                    className="h-7 w-7 object-contain"
                  />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <p 
                    className="font-['Gilroy'] font-semibold text-[16px] leading-[27px] tracking-[-2%] align-middle"
                    style={{ color: "#00000080" }}
                  >
                    {feature.desc}
                  </p>
                  <h3 
                    className="font-['Gilroy'] font-semibold text-[24px] leading-[30px] tracking-[-2%] align-middle"
                    style={{ color: "#000000" }}
                  >
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
