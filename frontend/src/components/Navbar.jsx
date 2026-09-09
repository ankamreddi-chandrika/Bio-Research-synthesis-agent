import React from 'react';
import { Bot, Sparkles, Database, Plus, RefreshCw, Dna } from 'lucide-react';

export default function Navbar({ onOpenNewReview, onOpenSeedModal, onOpenNewPaper, onRefreshAll, isRefreshing }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="flex items-center gap-3.5">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-emerald-400 text-white shadow-lg shadow-sky-500/20">
          <Dna className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-white">BioSynth AI</h1>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Pharma Agent Active
            </span>
          </div>
          <p className="text-xs text-slate-400">Autonomous Biomedical Literature Review & Research Synthesis</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onRefreshAll}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 rounded-lg transition-all"
          title="Refresh data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
          <span>Refresh</span>
        </button>

        <button
          onClick={onOpenSeedModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 rounded-lg transition-all"
        >
          <Database className="w-3.5 h-3.5 text-amber-400" />
          <span>Generate Dummy Data</span>
        </button>

        <button
          onClick={onOpenNewPaper}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 rounded-lg transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-sky-400" />
          <span>Add Paper</span>
        </button>

        <button
          onClick={onOpenNewReview}
          className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 rounded-lg shadow-md shadow-sky-500/25 transition-all transform hover:-translate-y-0.5"
        >
          <Sparkles className="w-4 h-4 text-sky-200" />
          <span>Run AI Synthesis</span>
        </button>
      </div>
    </header>
  );
}
