'use client';

import * as React from 'react';
import Image from 'next/image';
import { X, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { submitToClickUp } from '@/app/actions/clickup';

export function PromotionPopup() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    // Check if the popup has been shown in this session
    const hasBeenShown = sessionStorage.getItem('promo_popup_shown');

    if (!hasBeenShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('promo_popup_shown', 'true');
      }, 3000); // 3-second delay

      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      business: formData.get("business") as string,
    };
    
    const result = await submitToClickUp(data);
    setIsSubmitting(false);

    if (result.success) {
      setIsOpen(false);
      toast.success("Thanks for submitting, we will connect with you soon");
    } else {
      toast.error(result.error || "Failed to submit. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[95vw] sm:max-w-[420px] p-0 border-none bg-transparent shadow-none z-[5] top-[50%] md:top-[58%]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">Special Offer</DialogTitle>
        <div className="relative flex flex-col-reverse md:flex-row min-h-[290px] w-full bg-white border border-black rounded-[20px] shadow-2xl">
          
          {/* Mask to hide the black border at the bottom under the Testimonial section ON DESKTOP ONLY */}
          <div className="hidden md:block absolute -bottom-[2px] left-[-2px] w-[calc(42%+2px)] h-[4px] bg-[#FFF8F6] z-10 rounded-bl-[20px]" />

          {/* Left Testimonial Card Section (Bottom on Mobile, Left on Desktop) */}
          <div className="w-[calc(100%-24px)] mx-auto mb-3 md:mb-0 md:mx-0 md:w-[42%] bg-[#FFF8F6] p-3 md:px-4 md:pt-5 md:pb-2 flex flex-row md:flex-col items-center justify-start text-left md:text-center rounded-[16px] md:rounded-t-[20px] md:rounded-tr-none md:rounded-l-[20px] z-20">
            <h3 className="hidden md:block text-[12px] font-bold text-gray-900 mb-2.5 tracking-wider font-sans w-full text-center">Testimonial</h3>
            
            <div className="relative w-16 h-16 md:w-24 md:h-24 mr-3 md:mr-0 mb-0 md:mb-3 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
              <Image
                src="/popup img.webp"
                alt="Popup Image"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex flex-col flex-1 justify-center md:w-full mt-0 md:items-center">
              <p className="text-gray-900 text-[8px] md:text-[9.5px] leading-[1.3] md:leading-relaxed mb-1.5 md:mb-2 font-bold max-w-[200px] md:max-w-[160px] font-sans md:mx-auto">
                "What I value most is not only the technical delivery, but the way the team works. They have supported me with real commitment, great availability, and genuine curiosity about the product, the legal AI domain"
              </p>
              
              <div className="mt-1 md:mt-auto mb-0 w-full md:pb-0.5">
                {/* Mobile single line */}
                <p className="block md:hidden font-bold text-gray-900 text-[7px] font-sans leading-tight">
                  Katrine Lund, Founder & CEO, DigiRett
                </p>
                {/* Desktop two lines */}
                <div className="hidden md:block">
                  <p className="font-bold text-gray-900 text-[9.5px] font-sans leading-tight">Katrine Lund</p>
                  <p className="text-gray-900 font-bold text-[8px] font-sans leading-tight mt-0.5">Founder & CEO, DigiRett</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Section (Top on Mobile, Right on Desktop) */}
          <div className="w-full md:w-[58%] p-4 md:p-3.5 md:pr-4 flex flex-col justify-center rounded-t-[20px] md:rounded-b-[20px] md:rounded-bl-none md:rounded-r-[20px] z-20">
            <h2 className="text-[18px] md:text-[22px] font-bold text-gray-900 mb-1 md:mb-5 leading-[1.1] tracking-tight font-sans text-left">
              Claim your <br className="hidden md:block" />
              <span className="text-black"> $200 Coupon</span>
            </h2>
            
            {/* Mobile-only subtext placement */}
            <p className="md:hidden text-gray-500 text-[9px] font-medium font-sans mb-3 text-left">
              *Applicable for all pricing plans
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-2.5 flex flex-col">
              <Input 
                name="name"
                placeholder="Name" 
                className="h-[40px] bg-white border border-gray-300 rounded-md px-3 text-[12px] placeholder:text-gray-400 placeholder:font-semibold font-medium focus-visible:ring-[#FF7A59]"
                required
              />
              <Input 
                name="email"
                type="email"
                placeholder="Email" 
                className="h-[40px] bg-white border border-gray-300 rounded-md px-3 text-[12px] placeholder:text-gray-400 placeholder:font-semibold font-medium focus-visible:ring-[#FF7A59]"
                required
              />
              <Input 
                name="business"
                placeholder="Business name" 
                className="h-[40px] bg-white border border-gray-300 rounded-md px-3 text-[12px] placeholder:text-gray-400 placeholder:font-semibold font-medium focus-visible:ring-[#FF7A59]"
                required
              />
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-2 bg-[#FF7442] hover:bg-[#ff6a42] text-white rounded-md transition-all border border-black flex items-center justify-between px-4"
                style={{
                  height: '44px',
                  fontFamily: 'Manrope',
                  fontWeight: 600,
                  fontSize: '14px',
                  boxShadow: '1.5px 2px 0px 0px #000000',
                }}
              >
                {isSubmitting ? 'Processing...' : (
                  <>
                    <span>Claim</span>
                    <Sparkles className="w-4 h-4 fill-white" />
                  </>
                )}
              </Button>
            </form>
            
            {/* Desktop-only subtext placement */}
            <p className="hidden md:block mt-3 text-gray-400 text-[8px] font-medium font-sans">
              *Applicable for all pricing plans
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
