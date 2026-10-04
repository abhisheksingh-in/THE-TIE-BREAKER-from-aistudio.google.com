import React, { useState } from 'react';
import { OptionProsCons, DilemmaOption } from '../types/decision.ts';
import { Check, X, ThumbsUp, ThumbsDown, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface ProsConsSectionProps {
  prosCons: OptionProsCons[];
  options: DilemmaOption[];
}

export const ProsConsSection: React.FC<ProsConsSectionProps> = ({ prosCons, options }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    options[0]?.id || prosCons[0]?.optionId || ''
  );
  const [viewMode, setViewMode] = useState<'side-by-side' | 'tabbed'>('side-by-side');

  const currentOption = options.find((o) => o.id === selectedOptionId) || options[0];
  const currentProsCons = prosCons.find((pc) => pc.optionId === selectedOptionId) || prosCons[0];

  const getSignificanceColor = (sig: string) => {
    switch (sig) {
      case 'Critical':
        return 'text-amber-400 font-semibold';
      case 'Major':
        return 'text-stone-300 font-medium';
      default:
        return 'text-stone-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-100">
            Pros & Cons Breakdown
          </h2>
          <p className="text-stone-400 text-sm mt-1">
            Exhaustive enumeration of inherent upside drivers and severe friction points for each path.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-lg text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              viewMode === 'side-by-side'
                ? 'bg-stone-800 text-amber-300 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Side-by-Side
          </button>
          <button
            type="button"
            onClick={() => setViewMode('tabbed')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              viewMode === 'tabbed'
                ? 'bg-stone-800 text-amber-300 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Per Option
          </button>
        </div>
      </div>

      {/* Side-by-Side Mode */}
      {viewMode === 'side-by-side' ? (
        <div className="space-y-8">
          {prosCons.map((pc) => {
            const opt = options.find((o) => o.id === pc.optionId);
            return (
              <div
                key={pc.optionId}
                className="bg-stone-900/60 border border-stone-800 rounded-xl overflow-hidden"
              >
                {/* Option Header */}
                <div className="p-4 sm:p-5 bg-stone-900/90 border-b border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                      Option Evaluation
                    </span>
                    <h3 className="font-serif text-xl font-bold text-stone-100">
                      {pc.optionTitle}
                    </h3>
                    {opt && (
                      <p className="text-stone-400 text-xs mt-0.5">{opt.tagline}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-stone-400">
                    <span>Pros: <strong className="text-emerald-400">{pc.pros.length}</strong></span>
                    <span className="text-stone-600">·</span>
                    <span>Cons: <strong className="text-rose-400">{pc.cons.length}</strong></span>
                  </div>
                </div>

                {/* Pros and Cons Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-stone-800">
                  {/* Pros Column */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider pb-2 border-b border-stone-800/80">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>The Advantages & Catalysts ({pc.pros.length})</span>
                    </div>
                    <ul className="space-y-3">
                      {pc.pros.map((item, idx) => (
                        <li
                          key={idx}
                          className="p-3 rounded-lg bg-emerald-950/15 border border-emerald-900/30 text-xs sm:text-sm space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-emerald-200">
                              {item.point}
                            </span>
                            <span className={`text-[11px] shrink-0 font-mono ${getSignificanceColor(item.significance)}`}>
                              [{item.significance}]
                            </span>
                          </div>
                          <p className="text-stone-300 text-xs leading-relaxed">
                            {item.detail}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons Column */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider pb-2 border-b border-stone-800/80">
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>The Drawbacks & Vulnerabilities ({pc.cons.length})</span>
                    </div>
                    <ul className="space-y-3">
                      {pc.cons.map((item, idx) => (
                        <li
                          key={idx}
                          className="p-3 rounded-lg bg-rose-950/15 border border-rose-900/30 text-xs sm:text-sm space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-rose-200">
                              {item.point}
                            </span>
                            <span className={`text-[11px] shrink-0 font-mono ${getSignificanceColor(item.significance)}`}>
                              [{item.significance}]
                            </span>
                          </div>
                          <p className="text-stone-300 text-xs leading-relaxed">
                            {item.detail}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Tabbed Option Mode */
        <div className="space-y-6">
          {/* Option Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-800">
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedOptionId(opt.id)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedOptionId === opt.id
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {opt.title}
              </button>
            ))}
          </div>

          {currentProsCons && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pros Column */}
              <div className="bg-stone-900/70 border border-stone-800 rounded-xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Pros / Upsides ({currentProsCons.pros.length})</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {currentProsCons.pros.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-emerald-200 text-sm">
                          {item.point}
                        </span>
                        <span className={`text-[11px] font-mono ${getSignificanceColor(item.significance)}`}>
                          [{item.significance}]
                        </span>
                      </div>
                      <p className="text-stone-300 text-xs leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cons Column */}
              <div className="bg-stone-900/70 border border-stone-800 rounded-xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wide">
                    <ThumbsDown className="w-4 h-4" />
                    <span>Cons / Trade-Offs ({currentProsCons.cons.length})</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {currentProsCons.cons.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-900/30 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-rose-200 text-sm">
                          {item.point}
                        </span>
                        <span className={`text-[11px] font-mono ${getSignificanceColor(item.significance)}`}>
                          [{item.significance}]
                        </span>
                      </div>
                      <p className="text-stone-300 text-xs leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
