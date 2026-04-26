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
    const hasBeenShown = sessionStorage.getItem('promo_popup_shown');

    if (!hasBeenShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('promo_popup_shown', 'true');
      }, 20000); 

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

    if (result.success) {
      try {
        await fetch('/api/lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: data.email }),
        });
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }

      setIsOpen(false);
      toast.success("Thanks for submitting, we will connect with you soon");
    } else {
      toast.error(result.error || "Failed to submit. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[95vw] sm:max-w-[420px] md:max-w-[700px] lg:max-w-[850px] p-0 border-none bg-transparent shadow-none z-[9999] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">Special Offer</DialogTitle>
        <div className="relative flex flex-col-reverse md:flex-row min-h-[290px] md:min-h-[450px] lg:min-h-[520px] w-full bg-white border border-black rounded-[36px] shadow-2xl overflow-hidden">
          
          <div className="hidden md:block absolute bottom-0 left-0 w-[42%] h-[2px] bg-[#FFF8F6] z-30 rounded-bl-[36px]" />

          <div className="w-[calc(100%-24px)] mx-auto mb-3 md:mb-0 md:mx-0 md:w-[42%] bg-[#FFF8F6] p-3 md:px-7 md:pt-8 md:pb-6 flex flex-row md:flex-col items-center justify-start text-left md:text-center rounded-[36px] md:rounded-none z-20">
            <h3 className="hidden md:block text-[11px] lg:text-[12px] font-bold text-gray-900 mb-3 tracking-wider font-sans w-full text-center uppercase">Testimonial</h3>
            
            <div className="relative w-20 h-20 md:w-36 md:h-36 lg:w-44 lg:h-44 mr-3 md:mr-0 mb-0 md:mb-5 rounded-3xl overflow-hidden shadow-md flex-shrink-0 border-2 border-white/50">
              <Image
                src="/popup img.webp"
                alt="Popup Image"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex flex-col flex-1 justify-center md:w-full mt-0 md:items-center">
              <p className="text-black text-[10px] md:text-[13px] lg:text-[15px] leading-[1.5] md:leading-relaxed mb-3 md:mb-5 lg:mb-6 font-semibold max-w-[200px] md:max-w-none font-sans md:mx-auto">
                &ldquo;What I value most is not only the technical delivery, but the way the team works. They have supported me with real commitment, great availability, and genuine curiosity about the product, the legal AI domain&rdquo;
              </p>
              
              <div className="mt-1 md:mt-auto mb-0 w-full md:pb-0.5">
                <p className="block md:hidden font-bold text-black text-[8px] font-sans leading-tight">
                  Katrine Lund, Founder & CEO, DigiRett
                </p>
                <div className="hidden md:block">
                  <p className="font-bold text-black text-[14px] lg:text-[16px] font-sans leading-tight">Katrine Lund</p>
                  <p className="text-black font-bold text-[11px] lg:text-[13px] font-sans leading-tight mt-1 opacity-80">Founder & CEO, DigiRett</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[58%] p-5 md:p-6 lg:p-7 flex flex-col justify-center rounded-t-[20px] md:rounded-b-[20px] md:rounded-bl-none md:rounded-r-[20px] z-20">
            <h2 className="text-[20px] md:text-[32px] lg:text-[40px] font-extrabold text-gray-900 mb-1.5 md:mb-3 lg:mb-4 leading-[1.1] tracking-tight font-sans text-left">
              Claim your <br className="hidden md:block" />
              <span className="text-[#FF7442]">$200 Coupon</span>
            </h2>
            
            <p className="md:hidden text-gray-500 text-[10px] font-medium font-sans mb-4 text-left">
              *Applicable for all pricing plans
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-3.5 flex flex-col">
              <Input 
                name="name"
                placeholder="Name" 
                className="h-[42px] md:h-[50px] lg:h-[56px] bg-white border border-gray-300 rounded-xl px-4 text-[13px] md:text-[15px] placeholder:text-gray-400 placeholder:font-semibold font-medium focus-visible:ring-[#FF7A59]"
                required
              />
              <Input 
                name="email"
                type="email"
                placeholder="Email" 
                className="h-[42px] md:h-[50px] lg:h-[56px] bg-white border border-gray-300 rounded-xl px-4 text-[13px] md:text-[15px] placeholder:text-gray-400 placeholder:font-semibold font-medium focus-visible:ring-[#FF7A59]"
                required
              />
              <Input 
                name="business"
                placeholder="Business name" 
                className="h-[42px] md:h-[50px] lg:h-[56px] bg-white border border-gray-300 rounded-xl px-4 text-[13px] md:text-[15px] placeholder:text-gray-400 placeholder:font-semibold font-medium focus-visible:ring-[#FF7A59]"
                required
              />
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-2 bg-[#FF7442] hover:bg-[#ff6a42] text-white rounded-xl transition-all border border-black flex items-center justify-between px-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none"
                style={{
                  height: '56px',
                  fontFamily: 'Manrope',
                  fontWeight: 700,
                  fontSize: '18px',
                }}
              >
                {isSubmitting ? 'Processing...' : (
                  <>
                    <span>Claim Now</span>
                    <Sparkles className="w-5 h-5 fill-white" />
                  </>
                )}
              </Button>
            </form>
            
            <p className="hidden md:block mt-4 lg:mt-5 text-gray-400 text-[11px] lg:text-[13px] font-medium font-sans">
              *Applicable for all pricing plans
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
