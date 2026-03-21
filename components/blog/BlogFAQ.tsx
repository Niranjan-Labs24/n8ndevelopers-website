'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 py-5 last:border-0">
      <button
        className="flex w-full items-center justify-between text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className="font-gilroy font-semibold text-[22px] text-black pr-8 leading-tight">
          {question}
        </h3>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="h-6 w-6 text-black" />
        </span>
      </button>
      <div
        className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="font-gilroy font-medium text-[20px] leading-[34px] text-black text-justify">
          {answer}
        </p>
      </div>
    </div>
  );
};

interface BlogFAQProps {
  faqs: Array<{
    fields: {
      question: string;
      answer: string;
    };
  }>;
}

const BlogFAQ = ({ faqs }: BlogFAQProps) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="mt-12 mb-8 border-t border-gray-100 pt-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-black mb-8 tracking-tight">
          Frequently Asked <span className="text-[#FF7A59]">Questions</span>
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index} 
              question={faq.fields.question} 
              answer={faq.fields.answer} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogFAQ;
