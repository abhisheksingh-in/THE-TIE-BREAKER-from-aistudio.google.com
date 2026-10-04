import React, { useState } from 'react';
import { ComparisonDimension, DilemmaOption } from '../types/decision.ts';
import { Table, Check, Trophy, Filter, HelpCircle, Layers } from 'lucide-react';

interface ComparisonMatrixSectionProps {
  dimensions: ComparisonDimension[];
  summary: string;
  options: DilemmaOption[];
}

export const ComparisonMatrixSection: React.FC<ComparisonMatrixSectionProps> = ({
  dimensions,
  summary,
  options,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(dimensions.map((d) => d.category)))];

  const filteredDimensions = selectedCategory === 'All'
    ? dimensions
    : dimensions.filter((d) => d.category === selectedCategory);

  const getOptionName = (optId: string) => {
    if (optId === 'tie') return 'Dead Heat / Tie';
    const opt = options.find((o) => o.id === optId);
    return opt ? opt.title : optId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-100">
            Head-to-Head Comparison Matrix
          </h2>
          <p className="text-stone-400 text-sm mt-1">
            Multidimensional side-by-side evaluation across core decision criteria.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-stone-900 border border-stone-800 rounded-lg text-xs self-start sm:self-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Synthesis Note */}
      {summary && (
        <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 flex items-start gap-3">
          <Layers className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            <span className="font-semibold text-stone-100">Matrix Takeaway: </span>
            {summary}
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="overflow-x-auto border border-stone-800 rounded-xl bg-stone-900/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-900 border-b border-stone-800 text-xs uppercase tracking-wider text-stone-400">
              <th className="p-4 w-1/4 font-semibold min-w-[200px]">
                Decision Dimension
              </th>
              {options.map((opt) => (
                <th key={opt.id} className="p-4 font-semibold min-w-[220px]">
                  <div className="text-stone-200 font-serif text-sm normal-case">{opt.title}</div>
                  <div className="text-[11px] text-stone-500 font-sans tracking-normal normal-case font-normal truncate">
                    {opt.tagline}
                  </div>
                </th>
              ))}
              <th className="p-4 font-semibold w-40 min-w-[140px] text-center">
                Dimension Edge
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/80 text-xs sm:text-sm">
            {filteredDimensions.map((dim, idx) => (
              <tr
                key={idx}
                className="hover:bg-stone-850/50 transition-colors group"
              >
                {/* Dimension metadata */}
                <td className="p-4 align-top">
                  <div className="font-semibold text-stone-200 group-hover:text-amber-300 transition-colors">
                    {dim.dimension}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                    <span>{dim.category}</span>
                    <span>·</span>
                    <span className="font-mono">Weight: {dim.weight}</span>
                  </div>
                  {dim.nuance && (
                    <p className="mt-2 text-xs text-stone-400 italic bg-stone-950/40 p-2 rounded border border-stone-800/60 leading-relaxed">
                      "{dim.nuance}"
                    </p>
                  )}
                </td>

                {/* Scores per option */}
                {options.map((opt) => {
                  const scoreObj = dim.scores.find((s) => s.optionId === opt.id);
                  const isWinner = dim.winnerOptionId === opt.id;

                  return (
                    <td
                      key={opt.id}
                      className={`p-4 align-top ${
                        isWinner ? 'bg-amber-500/[0.03]' : ''
                      }`}
                    >
                      {scoreObj ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono font-bold text-stone-100 text-xs">
                              {scoreObj.scoreText}
                            </span>
                            <span className="text-[11px] font-mono text-stone-500">
                              {scoreObj.scoreNumeric}/10
                            </span>
                          </div>

                          {/* Numeric Bar */}
                          <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isWinner
                                  ? 'bg-amber-400'
                                  : 'bg-stone-500'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(10, scoreObj.scoreNumeric * 10))}%` }}
                            />
                          </div>

                          <p className="text-stone-300 text-xs leading-relaxed pt-1">
                            {scoreObj.assessment}
                          </p>
                        </div>
                      ) : (
                        <span className="text-stone-600">—</span>
                      )}
                    </td>
                  );
                })}

                {/* Winner Column */}
                <td className="p-4 align-top text-center">
                  <div className="inline-flex flex-col items-center justify-center p-2 rounded-lg bg-stone-950/70 border border-stone-800/80 w-full">
                    {dim.winnerOptionId === 'tie' ? (
                      <span className="text-xs font-mono text-stone-400">
                        Equal / Tie
                      </span>
                    ) : (
                      <>
                        <Trophy className="w-3.5 h-3.5 text-amber-400 mb-1" />
                        <span className="text-xs font-semibold text-amber-300 text-center leading-tight">
                          {getOptionName(dim.winnerOptionId)}
                        </span>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
