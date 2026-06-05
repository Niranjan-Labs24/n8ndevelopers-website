export interface BenefitItem {
  package: string;
  labels: string[];
  bestFor?: string;
}

export const benefitItems: BenefitItem[] = [
  {
    package: 'STARTER',
    labels: ['Direct access to n8n certified developers', 'Basic workflow creation and modification', 'Standard documentation', 'Email support (48-hour response time)', 'Up to 2 revision rounds per workflow']
  },
  {
    package: 'PLUS',
    labels: ['Batch tasking and multiple workflows',
      'API integration projects',
      'Multi-step automation sequences',
      'Dedicated project manager assignment',
      'Comprehensive documentation package',
      'Priority email + Teams support (24-hour response)',
      'Performance optimization review'],
    bestFor: 'Best Suited for Growing companies, established businesses, agencies with multiple automation needs'
  },
  {
    package: 'PRO',
    labels: [
      'Monthly strategy and optimization calls',
      'Dedicated development team (2-3 developers)',
      'Priority support (10-hour response, 3-hour for urgent)',
      'Advanced monitoring and alerting setup',
      'Monthly performance reporting',
      'Advanced security implementations',
      'Database integration expertise',
      'Enterprise-grade workflow systems',
      'Advanced error handling and recovery',
      '15% discount on additional services',
      'Dedicated Project Teams Channel'
    ],
    bestFor: 'Best suited for Enterprises, SaaS companies, agencies with complex automation needs, businesses requiring ongoing development support'
  }
];

export interface FAQItem {
  question: string;
  answer: string;
}

export const pricingFAQs: FAQItem[] = [
  {
    question: "What is the minimum commitment for the Hourly model?",
    answer: "The Hourly model is billed in 10-hour blocks, making it the lowest entry point at $750 total. It’s perfect if you have a one-off workflow or want to test our capabilities before committing to a larger package."
  },
  {
    question: "How does the Volume Package save me money compared to the Hourly model?",
    answer: "The Volume Package is billed at $60/hour in 50-hour blocks — that’s a $750 saving compared to the Hourly rate for the same hours. You also get a dedicated project manager and priority support, making it ideal for teams running multiple workflows or API integrations."
  },
  {
    question: "Which plan is right for me if I’m just starting with automation?",
    answer: "If you’re exploring automation for the first time, the Hourly model (10-hour block) is a great starting point — low commitment, direct developer access, and up to 2 revision rounds per workflow. Once you see results, many clients move to the Volume Package or Monthly Retainer."
  },
  {
    question: "Do all plans include documentation for the workflows built?",
    answer: "Yes. All plans include documentation. The Hourly model comes with standard documentation, the Volume Package includes a comprehensive documentation package, and the Monthly Retainer covers full enterprise-grade documentation as part of your dedicated team engagement."
  },
  {
    question: "How do I get started or discuss which plan fits my needs?",
    answer: "Book a free 15-minute discovery call with Sasha and the team. We’ll understand your workflows, recommend the right plan, and get you started without any pressure."
  },
  {
    question: "Can unused hours roll over to the next month on the Monthly Retainer?",
    answer: "Yes! Unused hours from your Monthly Retainer roll over to the next billing cycle, so you never lose the time you’ve paid for. Your investment is always protected."
  }
];

export default benefitItems;