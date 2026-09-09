import React, { useState } from 'react';
import { Database, X, RefreshCw, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

export default function SeedDataModal({ isOpen, onClose, onGenerate, onReset, isGenerating }) {
  const [count, setCount] = useState(10);
  const [area, setArea] = useState('All');
  const [activeAction, setActiveAction] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setActiveAction('generate');
    try {
      await onGenerate({ paper_count: count, therapeutic_area: area === 'All' ? null : area });
      onClose();
    } finally {
      setActiveAction(null);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset database to original benchmark pharma baseline seeds?')) return;
    setActiveAction('reset');
    try {
      await onReset();
      onClose();
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl shadow-sky-500/10 space-y-5">
        <button
          onClick={onClose}
          disabled={isGenerating}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-200 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Dummy Dataset Generator</h2>
            <p className="text-xs text-slate-400">Synthesize realistic clinical trials, papers, and metrics</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Number of Synthetic Studies to Generate</label>
            <div className="flex items-center gap-2">
              {[5, 10, 25, 50].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCount(num)}
                  className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                    count === num
                      ? 'bg-sky-500/20 text-sky-400 border-sky-500/40 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  +{num} Studies
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Target Therapeutic Domain</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500/60"
            >
              <option value="All">All Domains (Balanced Distribution)</option>
              <option value="Oncology">Oncology</option>
              <option value="Neurology">Neurology</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Immunology">Immunology</option>
              <option value="Rare Diseases">Rare Diseases</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            Generates realistic PMIDs, DOIs, Oxford CEBM Evidence Levels, abstracts, and multi-sample cohort sizes for instant charting and stress-testing.
          </div>

          <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-800">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${activeAction === 'generate' ? 'animate-spin' : ''}`} />
              <span>{activeAction === 'generate' ? 'Synthesizing...' : `Generate ${count} Synthetic Records`}</span>
            </button>

            <button
              onClick={handleReset}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 bg-slate-950 hover:bg-slate-900 border border-slate-800/80 rounded-xl transition-all disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${activeAction === 'reset' ? 'animate-spin' : ''}`} />
              <span>Reset Database to Baseline Seeds</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
