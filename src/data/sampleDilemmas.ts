export interface SampleDilemma {
  id: string;
  category: string;
  title: string;
  dilemma: string;
  context: string;
  priorityLens: string;
}

export const SAMPLE_DILEMMAS: SampleDilemma[] = [
  {
    id: 'career-startup-vs-faang',
    category: 'Career & Tech',
    title: 'Founding Engineer at Seed Startup vs. Senior Staff at FAANG',
    dilemma: 'Should I leave my stable $380k Senior Staff role at a public tech company to join a Seed-funded AI startup as Founding Engineer with 2.2% equity and $160k salary?',
    context: 'I have 18 months of personal living runway saved. My partner works full-time with health insurance. I am 32, energetic, but starting to think about starting a family in 3-4 years.',
    priorityLens: 'Career Trajectory & Asymmetric Upside',
  },
  {
    id: 'housing-buy-vs-rent',
    category: 'Life & Wealth',
    title: 'Buy Suburb House vs. Rent Closer to Downtown',
    dilemma: 'Should we buy a $750k single-family home in the quiet outer suburbs with a 45-minute commute, or continue renting a modern 2-bedroom downtown apartment for $3,100/mo?',
    context: 'Current interest rates are 6.4%. Buying requires putting down $150k (most of our liquid capital). Commuting 45 mins would be 3 days a week. We love city walkability and coffee shops.',
    priorityLens: 'Quality of Daily Life vs. Equity Compounding',
  },
  {
    id: 'business-bootstrap-vs-vc',
    category: 'Business & Founders',
    title: 'Bootstrap B2B SaaS with Cash Flow vs. Raise $2M Seed VC',
    dilemma: 'Should our 2-person B2B developer tool SaaS stay bootstrapped at $18k MRR growing 8% monthly, or raise a $2M Seed round from top VCs at a $10M post-money valuation to hire 3 engineers?',
    context: 'We are currently profitable and take modest salaries. Fast-moving competitors are popping up with VC backing. We value total operational freedom, but fear getting outrun in distribution.',
    priorityLens: 'Ownership Control vs. Market Preemption Speed',
  },
  {
    id: 'tech-monolith-vs-microservices',
    category: 'Architecture',
    title: 'Decompose Core Monolith vs. Enforce Modular Boundaries',
    dilemma: 'Should our engineering org spend Q3 & Q4 extracting our 7-year-old Rails monolith into 4 domain microservices, or invest in strict modular boundaries (packwerk) and CI optimizations within the existing monolith?',
    context: 'Team is 45 engineers across 4 squads. Deployment friction and PR merge conflicts have doubled this year, but our DevOps/infra team is lean (only 2 engineers).',
    priorityLens: 'Engineering Velocity & Operational Complexity',
  },
];
