import React from 'react';
import { DecisionAnalysis } from '../types/decision.ts';
import { X, Trash2, Clock, ArrowRight, ExternalLink } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: DecisionAnalysis[];
  onSelectDilemma: (analysis: DecisionAnalysis) => void;
  onDeleteDilemma: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectDilemma,
  onDeleteDilemma,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-stone-900 border border-stone-800 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-stone-100">
              Analysis History ({history.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-sm">
              No analyzed dilemmas yet. Your past runs will be saved here automatically.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg bg-stone-950/60 border border-stone-800/80 hover:border-amber-500/40 transition-colors flex items-start justify-between gap-4 group"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    onSelectDilemma(item);
                    onClose();
                  }}
                >
                  <div className="text-xs text-stone-500 font-mono mb-1">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <h4 className="font-semibold text-stone-200 text-sm group-hover:text-amber-300 transition-colors line-clamp-1">
                    {item.identifiedDilemma || item.dilemmaQuery}
                  </h4>
                  <p className="text-xs text-stone-400 line-clamp-2 mt-1">
                    {item.verdict?.recommendationHeadline}
                  </p>
                </div>

                <div className="flex items-center gap-1 self-center">
                  <button
                    onClick={() => {
                      onSelectDilemma(item);
                      onClose();
                    }}
                    className="p-2 text-stone-400 hover:text-amber-300 hover:bg-stone-800 rounded transition-colors"
                    title="Load this dilemma"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDilemma(item.id);
                    }}
                    className="p-2 text-stone-500 hover:text-rose-400 hover:bg-stone-800 rounded transition-colors"
                    title="Delete from history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-stone-800 flex justify-between items-center bg-stone-950/40">
            <button
              onClick={onClearHistory}
              className="text-xs text-stone-500 hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all history</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
