import Link from "next/link"
import type { FC } from "react"
import { Instagram, Linkedin, Facebook } from "lucide-react"

const SocialXIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 1200 1227" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <path 
      d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" 
      fill="currentColor"
    />
  </svg>
)

export const Footer: FC = () => {
  return (
    <footer className="bg-white">
      <div className="border-t border-gray-100 mb-8"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex-[2] text-left w-full md:w-auto order-last md:order-none pl-0">
            <p className="font-manrope font-semibold text-[10px] xs:text-[12px] md:text-[16px] xl:text-[18px] 2xl:text-[20px] leading-relaxed tracking-[-2%] text-[#0000004D] whitespace-nowrap text-center md:text-left">
              © {new Date().getFullYear()} n8n developers. All rights reserved. {" "}
              <span>
                An initiative by{" "}
                <Link href="https://labs24.co" target="_blank" className="hover:text-black transition-colors">
                  Labs 24
                </Link>
              </span>
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center w-full md:w-auto">
            <Link href="/about" className="font-manrope font-semibold text-[16px] xl:text-[18px] 2xl:text-[20px] leading-relaxed tracking-[-0.02em] text-black hover:text-gray-600 transition-colors whitespace-nowrap">
              About us
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 xl:gap-6 justify-end flex-1">
            {[
              { label: "LinkedIn", Icon: Linkedin, href: "https://linkedin.com/company/n8n-developers" },
              { label: "X (Twitter)", Icon: SocialXIcon, href: "https://x.com/n8ndevelopers" },
              { label: "Instagram", Icon: Instagram, href: "https://www.instagram.com/n8ndevelopers_offl?igsh=MWNzOXFrczV2Y2twdQ%3D%3D&utm_source=qr" },
              { label: "Facebook", Icon: Facebook, href: "https://facebook.com" }
            ].map((social, i) => (
              <Link 
                key={i} 
                href={social.href}
                target="_blank"
                aria-label={`Visit our ${social.label} page`}
                className="w-[30px] h-[30px] xl:w-[36px] xl:h-[36px] 2xl:w-[40px] 2xl:h-[40px] border border-gray-100 rounded-[8px] flex items-center justify-center text-black hover:border-black transition-all transform hover:scale-105 shadow-sm bg-white"
              >
                <social.Icon className="h-4 w-4 xl:h-5 xl:w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
