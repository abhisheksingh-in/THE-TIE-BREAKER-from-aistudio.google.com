import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Compass, ArrowRight, CornerDownLeft } from 'lucide-react';
import { SAMPLE_DILEMMAS, SampleDilemma } from '../data/sampleDilemmas.ts';

interface DilemmaFormProps {
  onAnalyze: (dilemma: string, context?: string, priorityLens?: string) => void;
  isLoading: boolean;
}

export const DilemmaForm: React.FC<DilemmaFormProps> = ({ onAnalyze, isLoading }) => {
  const [dilemma, setDilemma] = useState('');
  const [context, setContext] = useState('');
  const [priorityLens, setPriorityLens] = useState('Balanced Rationality');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!dilemma.trim() || isLoading) return;
    onAnalyze(dilemma, context, priorityLens);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const loadSample = (sample: SampleDilemma) => {
    setDilemma(sample.dilemma);
    setContext(sample.context);
    setPriorityLens(sample.priorityLens);
    setShowAdvanced(true);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-100 text-balance">
          Break the deadlock.
        </h1>
        <p className="mt-3 text-stone-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Transform paralysis into conviction with an exhaustive breakdown of Pros & Cons, a head-to-head Comparison Matrix, and SWOT analysis.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 sm:p-7 shadow-2xl relative">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="dilemma-input" className="block text-sm font-semibold text-stone-200">
                What is your decision dilemma?
              </label>
              <span className="text-xs text-stone-500 hidden sm:inline">
                Press <kbd className="px-1.5 py-0.5 bg-stone-800 text-stone-300 rounded border border-stone-700 text-[10px] font-mono">⌘</kbd> + <kbd className="px-1.5 py-0.5 bg-stone-800 text-stone-300 rounded border border-stone-700 text-[10px] font-mono">Enter</kbd> to run
              </span>
            </div>
            <textarea
              id="dilemma-input"
              value={dilemma}
              onChange={(e) => setDilemma(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={4}
              placeholder="e.g. Should I leave my stable $350k tech job to join an early-stage robotics startup as a founding engineer with 2% equity?"
              className="w-full bg-stone-950/90 border border-stone-800 focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/40 rounded-lg p-3.5 text-stone-100 placeholder:text-stone-600 text-base resize-y transition-colors outline-none disabled:opacity-50"
            />
          </div>

          {/* Optional context toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-300 transition-colors font-medium py-1"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Hide additional context & constraints' : 'Add context, timeline, or decision lens (optional)'}</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAdvanced && (
              <div className="mt-3 pt-3 border-t border-stone-800/80 space-y-4 animate-in fade-in duration-200">
                <div>
                  <label htmlFor="context-input" className="block text-xs font-medium text-stone-300 mb-1.5">
                    Personal Constraints, Runway, or Timeline
                  </label>
                  <textarea
                    id="context-input"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    disabled={isLoading}
                    rows={2}
                    placeholder="e.g. 14 months of cash runway, partner supports the move, must decide within 10 days."
                    className="w-full bg-stone-950/80 border border-stone-800 focus:border-amber-500/50 rounded-lg p-2.5 text-sm text-stone-200 placeholder:text-stone-600 outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="priority-lens" className="block text-xs font-medium text-stone-300 mb-1.5">
                    Strategic Priority Lens
                  </label>
                  <select
                    id="priority-lens"
                    value={priorityLens}
                    onChange={(e) => setPriorityLens(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded-lg p-2.5 text-sm text-stone-200 outline-none cursor-pointer"
                  >
                    <option value="Balanced Rationality">Balanced Rationality (Holistic trade-offs)</option>
                    <option value="Career Trajectory & Asymmetric Upside">Career Trajectory & Asymmetric Upside (High growth)</option>
                    <option value="Downside Risk Minimization">Downside Risk Minimization (Capital preservation & stability)</option>
                    <option value="Work-Life Balance & Personal Autonomy">Work-Life Balance & Personal Autonomy (Stress reduction)</option>
                    <option value="Execution Speed & Optionality">Execution Speed & Reversibility (Two-way door focus)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* CTA Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!dilemma.trim() || isLoading}
              className="w-full py-3.5 px-6 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 text-stone-950 bg-amber-400 hover:bg-amber-300 disabled:bg-stone-800 disabled:text-stone-600 disabled:cursor-not-allowed shadow-lg shadow-amber-500/10 cursor-pointer active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Strategic Analysis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Analysis</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Starter Dilemmas */}
      <div className="mt-8">
        <div className="text-xs uppercase tracking-wider text-stone-500 font-medium mb-3">
          Or test with a sample dilemma:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SAMPLE_DILEMMAS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => loadSample(sample)}
              disabled={isLoading}
              className="text-left p-3 rounded-lg border border-stone-800/80 bg-stone-900/40 hover:bg-stone-850 hover:border-amber-500/40 transition-all text-xs group cursor-pointer"
            >
              <div className="text-stone-400 group-hover:text-amber-400 font-semibold mb-1 flex items-center justify-between">
                <span>{sample.title}</span>
                <CornerDownLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-stone-500 line-clamp-2 leading-relaxed">
                {sample.dilemma}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
