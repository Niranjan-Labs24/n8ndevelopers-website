'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { pricingFAQs } from '../constants';

function FAQItem({
  faq,
  index,
  openIndex,
  onToggle,
}: {
  faq: { question: string; answer: string };
  index: number;
  openIndex: number | null;
  onToggle: (i: number) => void;
}) {
  const isOpen = openIndex === index;
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      className={`border border-gray-100 rounded-[2rem] transition-all duration-300 bg-white ${
        isOpen ? 'shadow-sm' : 'hover:shadow-md'
      }`}
    >
      <button
        onClick={() => onToggle(index)}
        className="w-full min-h-[100px] flex items-center justify-between px-8 py-7 text-left group"
      >
        <span className="text-base font-bold text-black pr-8 leading-snug group-hover:text-[#FF7A59] transition-colors">
          {faq.question}
        </span>
        <span className="flex-shrink-0 transition-transform duration-300">
          {isOpen ? (
            <Minus className="h-6 w-6 text-black" />
          ) : (
            <Plus className="h-6 w-6 text-black" />
          )}
        </span>
      </button>

      <div
        style={{ height, overflow: 'hidden', transition: 'height 0.3s ease' }}
      >
        <div ref={contentRef} className="px-8 pb-7">
          <p className="text-gray-600 leading-relaxed text-base">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section className="pt-16 md:pt-24 pb-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-12 md:mb-16">
        Frequently asked questions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Column - Independent from Right */}
        <div className="flex flex-col gap-6">
          {pricingFAQs.filter((_, i) => i % 2 === 0).map((faq, index) => (
            <FAQItem
              key={`left-${index}`}
              faq={faq}
              index={index * 2}
              openIndex={openIndex}
              onToggle={toggle}
            />
          ))}
        </div>

        {/* Right Column - Independent from Left */}
        <div className="flex flex-col gap-6">
          {pricingFAQs.filter((_, i) => i % 2 !== 0).map((faq, index) => (
            <FAQItem
              key={`right-${index}`}
              faq={faq}
              index={index * 2 + 1}
              openIndex={openIndex}
              onToggle={toggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
