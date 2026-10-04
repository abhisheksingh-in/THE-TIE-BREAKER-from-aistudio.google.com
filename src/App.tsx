import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { DilemmaForm } from './components/DilemmaForm.tsx';
import { VerdictCard } from './components/VerdictCard.tsx';
import { ProsConsSection } from './components/ProsConsSection.tsx';
import { ComparisonMatrixSection } from './components/ComparisonMatrixSection.tsx';
import { SwotAnalysisSection } from './components/SwotAnalysisSection.tsx';
import { HistoryModal } from './components/HistoryModal.tsx';
import { LoadingAnalysis } from './components/LoadingAnalysis.tsx';
import { DecisionAnalysis } from './types/decision.ts';
import { 
  Award, 
  ListChecks, 
  TableProperties, 
  Grid, 
  FileText, 
  Copy, 
  Check, 
  RotateCcw, 
  AlertCircle,
  Share2,
  Printer
} from 'lucide-react';

const STORAGE_KEY = 'the_tie_breaker_history_v1';

export default function App() {
  const [analysis, setAnalysis] = useState<DecisionAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'verdict' | 'pros-cons' | 'comparison' | 'swot' | 'brief'>('verdict');
  const [history, setHistory] = useState<DecisionAnalysis[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to read history from localStorage', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newAnalysis: DecisionAnalysis) => {
    try {
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.id !== newAnalysis.id);
        const updated = [newAnalysis, ...filtered].slice(0, 30); // keep last 30
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleAnalyze = async (dilemma: string, context?: string, priorityLens?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-dilemma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dilemma,
          additionalContext: context,
          priorityLens,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${res.status}`);
      }

      const data: DecisionAnalysis = await res.json();
      setAnalysis(data);
      setActiveTab('verdict');
      saveToHistory(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Failed to run dilemma analysis:', err);
      setError(err?.message || 'Failed to analyze decision dilemma. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!analysis) return;

    let md = `# THE TIE BREAKER: DECISION BRIEF\n\n`;
    md += `**Dilemma:** ${analysis.identifiedDilemma || analysis.dilemmaQuery}\n`;
    if (analysis.contextNotes) {
      md += `**Context:** ${analysis.contextNotes}\n`;
    }
    md += `\n---\n\n## 🏆 TIE BREAKER VERDICT\n\n`;
    md += `### ${analysis.verdict.recommendationHeadline}\n\n`;
    md += `${analysis.verdict.executiveSummary}\n\n`;
    md += `* **The Crucial Pivot:** ${analysis.verdict.theCrucialPivot}\n`;
    md += `* **Reversibility:** ${analysis.verdict.reversibilityCheck.type} - ${analysis.verdict.reversibilityCheck.explanation}\n`;
    md += `* **48-Hour Litmus Test:** ${analysis.verdict.fortyEightHourLitmusTest}\n`;
    md += `* **If Torn 50/50 Rule:** ${analysis.verdict.ifTornFiftyFiftyRule}\n\n`;

    md += `---\n\n## ⚖️ PROS & CONS\n\n`;
    analysis.prosCons.forEach((pc) => {
      md += `### ${pc.optionTitle}\n\n**Pros:**\n`;
      pc.pros.forEach((p) => {
        md += `* [${p.significance}] **${p.point}**: ${p.detail}\n`;
      });
      md += `\n**Cons:**\n`;
      pc.cons.forEach((c) => {
        md += `* [${c.significance}] **${c.point}**: ${c.detail}\n`;
      });
      md += `\n`;
    });

    md += `---\n\n## 📊 COMPARISON MATRIX\n\n`;
    md += `| Dimension | Category | Weight | Winner |\n`;
    md += `| :--- | :--- | :--- | :--- |\n`;
    analysis.comparisonMatrix.dimensions.forEach((d) => {
      const winnerName = d.winnerOptionId === 'tie' ? 'Tie' : (analysis.options.find(o => o.id === d.winnerOptionId)?.title || d.winnerOptionId);
      md += `| ${d.dimension} | ${d.category} | ${d.weight} | ${winnerName} |\n`;
    });
    md += `\n**Matrix Takeaway:** ${analysis.comparisonMatrix.overallComparisonSummary}\n\n`;

    md += `---\n\n## 🧭 SWOT ANALYSIS\n\n`;
    analysis.swotAnalysis.forEach((s) => {
      md += `### ${s.optionTitle}\n\n`;
      md += `* **Strengths:** ${s.strengths.join('; ')}\n`;
      md += `* **Weaknesses:** ${s.weaknesses.join('; ')}\n`;
      md += `* **Opportunities:** ${s.opportunities.join('; ')}\n`;
      md += `* **Threats:** ${s.threats.join('; ')}\n\n`;
    });

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Header
        onNewDilemma={() => {
          setAnalysis(null);
          setError(null);
        }}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200 flex items-start justify-between gap-3 text-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Analysis Error</span>
                <p className="text-stone-300 text-xs mt-0.5">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-stone-400 hover:text-stone-200 text-xs px-2 py-1 bg-stone-900 rounded border border-stone-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* State 1: Loading state */}
        {isLoading && <LoadingAnalysis />}

        {/* State 2: Input dilemma form */}
        {!isLoading && !analysis && (
          <DilemmaForm onAnalyze={handleAnalyze} isLoading={isLoading} />
        )}

        {/* State 3: Active Analysis Dashboard */}
        {!isLoading && analysis && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Dilemma Summary Banner */}
            <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wide">
                    <span>Active Dilemma Case</span>
                    <span className="text-stone-600">·</span>
                    <span className="text-stone-400 font-sans">
                      {new Date(analysis.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-100">
                    {analysis.identifiedDilemma}
                  </h1>
                  {analysis.contextNotes && (
                    <p className="text-stone-400 text-xs sm:text-sm italic">
                      Context: "{analysis.contextNotes}"
                    </p>
                  )}
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-2 self-start shrink-0">
                  <button
                    onClick={handleCopyMarkdown}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-300 hover:text-stone-100 hover:bg-stone-800 border border-stone-700/80 rounded-md transition-colors"
                    title="Copy executive brief as Markdown"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Brief</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handlePrint}
                    className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 border border-stone-700/80 rounded-md transition-colors hidden sm:block"
                    title="Print / Save PDF"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setAnalysis(null)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-md transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>New Dilemma</span>
                  </button>
                </div>
              </div>

              {/* Identified Options Pill Strip */}
              <div className="mt-5 pt-4 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {analysis.options.map((opt) => {
                  const isWinner = opt.id === analysis.verdict.recommendedOptionId;
                  return (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-lg border text-xs ${
                        isWinner
                          ? 'bg-amber-500/10 border-amber-500/40 text-stone-200'
                          : 'bg-stone-950/50 border-stone-800 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-semibold text-stone-100 font-serif text-sm">
                          {opt.title}
                        </span>
                        {isWinner && (
                          <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/40">
                            VERDICT
                          </span>
                        )}
                      </div>
                      <p className="text-stone-400 text-xs leading-relaxed">
                        {opt.tagline}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-800 pb-1">
              <button
                type="button"
                onClick={() => setActiveTab('verdict')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'verdict'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Tie Breaker Verdict</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pros-cons')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'pros-cons'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                <ListChecks className="w-4 h-4" />
                <span>Pros & Cons</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('comparison')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'comparison'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                <TableProperties className="w-4 h-4" />
                <span>Comparison Table</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('swot')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'swot'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>SWOT Analysis</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('brief')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'brief'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Full Brief (All-in-One)</span>
              </button>
            </div>

            {/* Tab Views */}
            <div className="pt-2">
              {activeTab === 'verdict' && (
                <VerdictCard verdict={analysis.verdict} options={analysis.options} />
              )}

              {activeTab === 'pros-cons' && (
                <ProsConsSection
                  prosCons={analysis.prosCons}
                  options={analysis.options}
                />
              )}

              {activeTab === 'comparison' && (
                <ComparisonMatrixSection
                  dimensions={analysis.comparisonMatrix.dimensions}
                  summary={analysis.comparisonMatrix.overallComparisonSummary}
                  options={analysis.options}
                />
              )}

              {activeTab === 'swot' && (
                <SwotAnalysisSection
                  swotAnalysis={analysis.swotAnalysis}
                  options={analysis.options}
                />
              )}

              {activeTab === 'brief' && (
                <div className="space-y-12">
                  <VerdictCard verdict={analysis.verdict} options={analysis.options} />
                  <ProsConsSection
                    prosCons={analysis.prosCons}
                    options={analysis.options}
                  />
                  <ComparisonMatrixSection
                    dimensions={analysis.comparisonMatrix.dimensions}
                    summary={analysis.comparisonMatrix.overallComparisonSummary}
                    options={analysis.options}
                  />
                  <SwotAnalysisSection
                    swotAnalysis={analysis.swotAnalysis}
                    options={analysis.options}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800/80 py-6 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>The Tie Breaker · Rigorous AI Decision Modeling</p>
          <p className="font-mono text-[11px] text-stone-600">
            Powered by Gemini 3.8 Flash
          </p>
        </div>
      </footer>

      {/* History Drawer / Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectDilemma={(selected) => {
          setAnalysis(selected);
          setActiveTab('verdict');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDeleteDilemma={handleDeleteHistoryItem}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
