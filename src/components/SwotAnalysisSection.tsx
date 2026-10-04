import React, { useState } from 'react';
import { OptionSWOT, DilemmaOption } from '../types/decision.ts';
import { Shield, Zap, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SwotAnalysisSectionProps {
  swotAnalysis: OptionSWOT[];
  options: DilemmaOption[];
}

export const SwotAnalysisSection: React.FC<SwotAnalysisSectionProps> = ({
  swotAnalysis,
  options,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    options[0]?.id || swotAnalysis[0]?.optionId || ''
  );

  const activeSwot = swotAnalysis.find((s) => s.optionId === selectedOptionId) || swotAnalysis[0];
  const activeOption = options.find((o) => o.id === selectedOptionId) || options[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-100">
            SWOT Strategic Matrix
          </h2>
          <p className="text-stone-400 text-sm mt-1">
            Internal capabilities (Strengths & Weaknesses) and external forces (Opportunities & Threats).
          </p>
        </div>

        {/* Option Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-900 border border-stone-800 rounded-lg self-start sm:self-auto overflow-x-auto">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedOptionId(opt.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedOptionId === opt.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {opt.title}
            </button>
          ))}
        </div>
      </div>

      {/* Active Option Context */}
      {activeOption && (
        <div className="p-4 rounded-xl bg-stone-900/50 border border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
              Analyzing Target
            </span>
            <div className="font-serif text-lg font-bold text-stone-100">
              {activeOption.title}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              Core premise: {activeOption.coreThesis}
            </div>
          </div>
        </div>
      )}

      {/* 2x2 SWOT Grid */}
      {activeSwot && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="bg-stone-900/80 border border-emerald-900/40 rounded-xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800/80">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Shield className="w-4 h-4" />
                <span>Strengths (Internal Advantages)</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-500/80">
                {activeSwot.strengths.length} Factors
              </span>
            </div>
            <ul className="space-y-2.5">
              {activeSwot.strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-300">
                  <span className="text-emerald-400 font-bold mt-0.5 shrink-0">·</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-stone-900/80 border border-amber-900/40 rounded-xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800/80">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Weaknesses (Internal Vulnerabilities)</span>
              </div>
              <span className="text-[11px] font-mono text-amber-500/80">
                {activeSwot.weaknesses.length} Factors
              </span>
            </div>
            <ul className="space-y-2.5">
              {activeSwot.weaknesses.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-300">
                  <span className="text-amber-400 font-bold mt-0.5 shrink-0">·</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="bg-stone-900/80 border border-sky-900/40 rounded-xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800/80">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                <TrendingUp className="w-4 h-4" />
                <span>Opportunities (External Tailwinds)</span>
              </div>
              <span className="text-[11px] font-mono text-sky-500/80">
                {activeSwot.opportunities.length} Factors
              </span>
            </div>
            <ul className="space-y-2.5">
              {activeSwot.opportunities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-300">
                  <span className="text-sky-400 font-bold mt-0.5 shrink-0">·</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="bg-stone-900/80 border border-rose-900/40 rounded-xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800/80">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
                <Zap className="w-4 h-4" />
                <span>Threats (External Risks & Black Swans)</span>
              </div>
              <span className="text-[11px] font-mono text-rose-500/80">
                {activeSwot.threats.length} Factors
              </span>
            </div>
            <ul className="space-y-2.5">
              {activeSwot.threats.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-300">
                  <span className="text-rose-400 font-bold mt-0.5 shrink-0">·</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
