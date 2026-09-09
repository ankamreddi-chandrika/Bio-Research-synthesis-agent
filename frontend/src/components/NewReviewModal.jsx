import React, { useState } from 'react';
import { Sparkles, X, Loader2, CheckCircle2, ChevronRight, Dna, ShieldAlert, Cpu } from 'lucide-react';

const SUGGESTIONS = [
  "KRAS G12C inhibitor resistance mechanisms in NSCLC adagrasib sotorasib",
  "Anti-amyloid monoclonal antibodies lecanemab donanemab early Alzheimer clinical trials",
  "Tirzepatide semaglutide cardiovascular outcomes weight loss RCT",
  "BCMA bispecific antibodies in relapsed multiple myeloma",
  "In vivo CRISPR lipid nanoparticle gene editing in transthyretin amyloidosis"
];

const PIPELINE_STAGES = [
  "Stage 1: Protocol & MeSH Expansion Agent",
  "Stage 2: Multi-Source Retrieval & Deduplication",
  "Stage 3: Oxford CEBM & Study Design Grading",
  "Stage 4: Structured PICO Evidence Matrix Extraction",
  "Stage 5: Citation Grounding & Hallucination Audit"
];

export default function NewReviewModal({ isOpen, onClose, onRunSynthesis, isRunning }) {
  const [query, setQuery] = useState('');
  const [therapeuticArea, setTherapeuticArea] = useState('Oncology');
  const [maxPapers, setMaxPapers] = useState(4);
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Simulate animated step progression while waiting for agent response
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < PIPELINE_STAGES.length) {
        setCurrentStep(step);
      }
    }, 450);

    try {
      await onRunSynthesis({
        query,
        therapeutic_area: therapeuticArea,
        max_papers: maxPapers,
        user_id: 1
      });
      clearInterval(interval);
      setCurrentStep(0);
      onClose();
    } catch (err) {
      clearInterval(interval);
      setCurrentStep(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl shadow-sky-500/10 space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isRunning}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-200 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-600 to-emerald-400 text-white shadow-lg shadow-sky-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Autonomous Research Synthesis Agent</h2>
            <p className="text-xs text-slate-400">Launch multi-stage evidence extraction and citation grounding</p>
          </div>
        </div>

        {isRunning ? (
          <div className="py-8 px-4 text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-500/30">
                <Dna className="w-8 h-8 text-sky-400 animate-spin" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-200">Executing Synthesis Pipeline...</h3>
              <p className="text-xs text-sky-400 font-mono animate-pulse">
                {PIPELINE_STAGES[currentStep] || 'Finalizing Evidence Matrix & Dossier...'}
              </p>
            </div>

            {/* Pipeline Stage Indicators */}
            <div className="space-y-2 text-left max-w-sm mx-auto">
              {PIPELINE_STAGES.map((st, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 text-xs py-1 px-2.5 rounded-lg border transition-all ${
                    idx < currentStep
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : idx === currentStep
                      ? 'text-sky-400 bg-sky-500/10 border-sky-500/30 font-semibold'
                      : 'text-slate-600 border-transparent'
                  }`}
                >
                  {idx < currentStep ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  ) : idx === currentStep ? (
                    <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-700 flex-shrink-0" />
                  )}
                  <span className="truncate">{st}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Query Input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Biomedical Query / Target Hypothesis</label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. KRAS G12C inhibitor resistance mechanisms and combination therapies in NSCLC"
                rows={3}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30 transition-all font-sans"
              />
            </div>

            {/* Prompt Suggestions */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-400">Sample Clinical Queries:</label>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="text-[11px] px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-sky-300 rounded-lg text-left transition-colors truncate max-w-full"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Therapeutic Area & Max Papers Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Therapeutic Area</label>
                <select
                  value={therapeuticArea}
                  onChange={(e) => setTherapeuticArea(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500/60"
                >
                  <option value="Oncology">Oncology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Immunology">Immunology</option>
                  <option value="Rare Diseases">Rare Diseases</option>
                  <option value="Infectious Diseases">Infectious Diseases</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Study Screening Depth: {maxPapers}</label>
                <input
                  type="range"
                  min={2}
                  max={10}
                  value={maxPapers}
                  onChange={(e) => setMaxPapers(parseInt(e.target.value))}
                  className="w-full mt-2 accent-sky-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!query.trim()}
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-emerald-500 hover:from-sky-500 hover:to-emerald-400 rounded-xl shadow-md shadow-sky-500/20 transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Autonomous Review</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
