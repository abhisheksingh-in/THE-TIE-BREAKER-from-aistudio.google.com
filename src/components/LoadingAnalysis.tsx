import React, { useEffect, useState } from 'react';
import { Scale, CheckCircle2 } from 'lucide-react';

const STEPS = [
  'Deconstructing decision dilemma into distinct paths...',
  'Evaluating operational, financial & psychological Pros and Cons...',
  'Constructing head-to-head multidimensional Comparison Matrix...',
  'Conducting environmental SWOT analysis across all options...',
  'Formulating The Crucial Pivot & Tie Breaker Verdict...',
];

export const LoadingAnalysis: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto py-16 px-4 text-center">
      <div className="inline-flex p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-6 relative">
        <Scale className="w-8 h-8 animate-pulse" />
      </div>

      <h3 className="font-serif text-2xl font-bold text-stone-100 mb-2">
        Deliberating Dilemma
      </h3>
      <p className="text-stone-400 text-sm mb-8">
        Gemini is applying decision theory, risk modeling, and strategic game frameworks...
      </p>

      <div className="space-y-3 text-left max-w-md mx-auto bg-stone-900/60 border border-stone-800 rounded-xl p-5">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs sm:text-sm transition-all duration-300 ${
                isDone
                  ? 'text-stone-400'
                  : isCurrent
                  ? 'text-amber-300 font-medium'
                  : 'text-stone-600'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-stone-700 shrink-0" />
              )}
              <span className="truncate">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
