import React from 'react';
import { TieBreakerVerdict, DilemmaOption } from '../types/decision.ts';
import { Award, Compass, DoorOpen, Lightbulb, Scale, CheckCircle2 } from 'lucide-react';

interface VerdictCardProps {
  verdict: TieBreakerVerdict;
  options: DilemmaOption[];
}

export const VerdictCard: React.FC<VerdictCardProps> = ({ verdict, options }) => {
  const winningOption = options.find((o) => o.id === verdict.recommendedOptionId) || options[0];

  return (
    <div className="space-y-6">
      {/* Top Banner / Verdict Seal */}
      <div className="bg-gradient-to-b from-amber-950/40 via-stone-900 to-stone-900 border border-amber-500/40 rounded-xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wide uppercase mb-3">
          <Award className="w-4 h-4" />
          <span>The Tie Breaker Verdict</span>
          <span className="text-stone-600">·</span>
          <span className="text-stone-400 font-mono">Recommended Path</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 mb-3 text-balance">
          {verdict.recommendationHeadline}
        </h2>

        {winningOption && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm font-semibold mb-4">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Select: {winningOption.title}</span>
          </div>
        )}

        <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-4xl">
          {verdict.executiveSummary}
        </p>
      </div>

      {/* Grid of Decision Razor Instruments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* The Crucial Pivot */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wide mb-2">
              <Compass className="w-4 h-4" />
              <span>The Crucial Pivot Question</span>
            </div>
            <p className="text-stone-200 text-sm sm:text-base leading-relaxed font-medium">
              "{verdict.theCrucialPivot}"
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-800 text-xs text-stone-500">
            If your truthful answer aligns with this criterion, the path is clear.
          </div>
        </div>

        {/* Reversibility Check (One-Way vs Two-Way Door) */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wide">
                <DoorOpen className="w-4 h-4" />
                <span>Reversibility Assessment</span>
              </div>
              <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded border ${
                verdict.reversibilityCheck.type === 'Two-Way Door' 
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' 
                  : verdict.reversibilityCheck.type === 'One-Way Door' 
                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-300' 
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
              }`}>
                {verdict.reversibilityCheck.type}
              </span>
            </div>
            <p className="text-stone-300 text-sm leading-relaxed">
              {verdict.reversibilityCheck.explanation}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-800 text-xs text-stone-500">
            Two-way decisions should be executed rapidly; one-way decisions require deep stress-testing.
          </div>
        </div>

        {/* 48-Hour Litmus Test */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-2">
              <Lightbulb className="w-4 h-4" />
              <span>48-Hour Litmus Test</span>
            </div>
            <p className="text-stone-300 text-sm leading-relaxed">
              {verdict.fortyEightHourLitmusTest}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-800 text-xs text-stone-500">
            A low-cost immediate experiment to validate assumptions before irreversible commitment.
          </div>
        </div>

        {/* If You're Still 50/50 Rule */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wide mb-2">
              <Scale className="w-4 h-4" />
              <span>Deadlock Rule (If Still 50 / 50)</span>
            </div>
            <p className="text-stone-200 text-sm font-medium leading-relaxed">
              {verdict.ifTornFiftyFiftyRule}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-800 text-xs text-stone-500">
            Heuristic for cutting through stubborn emotional ties.
          </div>
        </div>
      </div>
    </div>
  );
};
