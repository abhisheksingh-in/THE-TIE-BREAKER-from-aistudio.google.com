import React from 'react';
import { Scale, History, PlusCircle, Sparkles } from 'lucide-react';

interface HeaderProps {
  onNewDilemma: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewDilemma,
  onOpenHistory,
  historyCount,
}) => {
  return (
    <header className="border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div 
          onClick={onNewDilemma}
          className="flex items-center gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
        >
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400/60 transition-colors">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-tight text-stone-100 group-hover:text-amber-300 transition-colors">
                The Tie Breaker
              </span>
              <span className="text-stone-500 text-xs font-mono">
                AI Decision Engine
              </span>
            </div>
            <p className="text-stone-400 text-xs hidden sm:block">
              Pros & Cons · Comparison Matrix · SWOT Analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {historyCount > 0 && (
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-300 hover:text-stone-100 hover:bg-stone-900 border border-stone-800 rounded-md transition-colors"
              title="View past analyzed dilemmas"
            >
              <History className="w-3.5 h-3.5 text-stone-400" />
              <span>History</span>
              <span className="text-stone-500 font-mono text-[11px] ml-0.5">
                ({historyCount})
              </span>
            </button>
          )}

          <button
            onClick={onNewDilemma}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 rounded-md transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Dilemma</span>
          </button>
        </div>
      </div>
    </header>
  );
};
