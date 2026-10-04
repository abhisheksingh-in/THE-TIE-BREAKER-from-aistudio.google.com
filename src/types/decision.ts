export interface DilemmaOption {
  id: string; // e.g. "opt_1", "opt_2"
  title: string;
  tagline: string;
  coreThesis: string;
}

export interface ProConItem {
  point: string;
  detail: string;
  significance: 'Critical' | 'Major' | 'Moderate';
}

export interface OptionProsCons {
  optionId: string;
  optionTitle: string;
  pros: ProConItem[];
  cons: ProConItem[];
  netAdvantageScore: number;
}

export interface ComparisonDimensionScore {
  optionId: string;
  scoreText: string;
  scoreNumeric: number; // 1-10
  assessment: string;
}

export interface ComparisonDimension {
  dimension: string;
  category: 'Financial' | 'Strategic' | 'Personal' | 'Operational' | 'Risk';
  weight: 'High' | 'Medium' | 'Low';
  scores: ComparisonDimensionScore[];
  winnerOptionId: string; // option id or "tie"
  nuance: string;
}

export interface OptionSWOT {
  optionId: string;
  optionTitle: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface TieBreakerVerdict {
  recommendedOptionId: string;
  recommendationHeadline: string;
  executiveSummary: string;
  theCrucialPivot: string;
  reversibilityCheck: {
    type: 'Two-Way Door' | 'One-Way Door' | 'Hybrid';
    explanation: string;
  };
  fortyEightHourLitmusTest: string;
  ifTornFiftyFiftyRule: string;
}

export interface DecisionAnalysis {
  id: string;
  createdAt: string;
  dilemmaQuery: string;
  contextNotes?: string;
  identifiedDilemma: string;
  options: DilemmaOption[];
  prosCons: OptionProsCons[];
  comparisonMatrix: {
    dimensions: ComparisonDimension[];
    overallComparisonSummary: string;
  };
  swotAnalysis: OptionSWOT[];
  verdict: TieBreakerVerdict;
}
