'use client';

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { CADLENLY_URL } from "@/app/constants"

const Cadlenly = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Delay loading the iframe slightly to prioritize hero content
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="xl:col-span-1 w-full flex justify-center lg:justify-end">
      <div className="relative w-full max-w-[480px]" style={{ 
        height: '620px',
        opacity: 1,
      }}>
        {/* Shadow/Offset Effect */}
        <div className="absolute top-2 left-2 w-full h-full bg-[#FF7A59] rounded-[24px]"></div>

        {/* Main Widget */}
        <div className="relative h-full bg-white border-[0.5px] border-black rounded-[24px] overflow-hidden shadow-sm flex flex-col">
          <div className="flex flex-col items-center text-center" style={{ paddingTop: '32px', gap: '6px' }}>
            <h2 
              className="text-black"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 500,
                fontSize: '20px',
                lineHeight: '100%',
                letterSpacing: '-0.04em',
                width: '384px',
                height: '20px',
              }}
            >
              Book a free 30 min call
            </h2>
            <p 
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 500,
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '-0.03em',
                color: '#00000099',
                width: '384px',
                height: '16px',
              }}
            >
              Get all your questions answered by our experts.
            </p>
          </div>
          <div className="flex-grow w-full h-full pt-4 min-h-[500px] flex items-center justify-center">
            {isLoaded ? (
              <iframe
                src={CADLENLY_URL}
                className="w-full h-full border-none"
                title="Schedule a meeting with n8n developers"
                loading="lazy"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-gray-400">
                <div className="w-8 h-8 border-4 border-[#FF7A59] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium">Loading booking widget...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cadlenly
