import Image from 'next/image';
import Link from 'next/link';
import { CADLENLY_URL } from '@/app/constants';

export default function PromotionBanner() {
  return (
    <section className="w-full py-[clamp(2rem,6vw,4rem)] px-[clamp(1rem,3vw,2rem)] bg-white flex justify-center">
      <div 
        className="relative overflow-hidden border border-[#0000000F] w-full max-w-[clamp(22rem,95vw,110rem)] rounded-[24px] min-h-[clamp(30rem,55vw,35rem)] lg:min-h-[clamp(25rem,40vw,30rem)] flex flex-col lg:block"
        style={{
          background: 'linear-gradient(93.7deg, #FFFFFF -11.3%, #FFEDE7 118.49%)',
        }}
      >
        {/* Content Container - Vertically Centered */}
        <div className="flex flex-col justify-center px-[clamp(2rem,8vw,6rem)] py-[clamp(2rem,8vw,4rem)] lg:py-0 relative z-10 lg:h-full h-auto lg:items-start items-center text-center lg:text-left flex-shrink-0">
          <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)] max-w-full lg:w-[clamp(25rem,40vw,45rem)]">
            <h3 className="font-sans font-semibold text-[clamp(1.75rem,4vw+1rem,3.5rem)] leading-tight tracking-[-3%] text-black m-0">
              You know what's the <br className="hidden sm:block" />
              smartest move?
            </h3>
            <p className="font-sans font-medium text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] leading-relaxed tracking-[-1%] text-[#00000099] m-0 max-w-[clamp(22rem,40vw,35rem)]">
              Hire n8n experts at n8ndevelopers to build, manage and scale your automation pipeline.
            </p>
          </div>
          
          <div className="mt-[clamp(1.5rem,4vw,3rem)] flex flex-col lg:items-start items-center gap-[clamp(0.75rem,2vw,1.5rem)] w-full">
            <Link 
              href={CADLENLY_URL}
              target="_blank"
              className="inline-flex items-center justify-center bg-[#FF7442] hover:bg-[#ff6a42] text-white transition-all text-center whitespace-nowrap border border-black shadow-[2px_3px_0_0_#000] rounded-xl font-[Manrope] font-semibold text-[clamp(1rem,2vw,1.125rem)] leading-8 tracking-[-0.03em] px-[clamp(1.5rem,4vw,3.25rem)] py-[clamp(0.75rem,2vw,1.25rem)] w-full sm:w-auto min-w-[clamp(14rem,30vw,17.5rem)] min-h-[clamp(3.5rem,8vw,4.5rem)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none"
            >
              Book free automation call
            </Link>
            <div className="flex items-center gap-2 lg:ml-4">
               <div className="w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">
                 <Image
                  src="/icons/15 min.png"
                  alt="15 min"
                  width={18}
                  height={18}
                  className="object-contain"
                />
               </div>
              <p className="text-[clamp(0.875rem,2vw,1rem)] text-black font-semibold">
                Starts at $30 per hour
              </p>
            </div>
          </div>
        </div>

        {/* Team Photo Container */}
        <div className="relative lg:absolute lg:right-0 lg:bottom-0 h-[clamp(14rem,40vw,18rem)] lg:h-full w-full lg:w-[clamp(30rem,45vw,55rem)] mt-0 lg:mt-0 z-[5] flex-shrink-0">
          <Image
            src="/team-photo.webp"
            alt="n8n Developers Team"
            fill
            className="object-contain object-bottom"
            priority
            sizes="(max-width: 1024px) 100vw, 500px"
          />
        </div>
      </div>
    </section>
  );
}
