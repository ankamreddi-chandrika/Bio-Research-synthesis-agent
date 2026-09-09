import React from 'react';
import { X, BookOpen, ExternalLink, ShieldCheck, Tag } from 'lucide-react';

export default function ViewPaperModal({ isOpen, onClose, paper }) {
  if (!isOpen || !paper) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl shadow-sky-500/10 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-200 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30 rounded-lg">
              {paper.therapeutic_area}
            </span>
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg">
              {paper.cebm_level}
            </span>
            {paper.pmid && (
              <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">
                PMID: {paper.pmid}
              </span>
            )}
          </div>

          <h2 className="text-base font-bold text-white leading-snug">
            {paper.title}
          </h2>

          <p className="text-xs text-slate-400">
            {paper.authors} &bull; <span className="text-slate-300 font-medium">{paper.journal} ({paper.pub_year})</span>
          </p>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Study Design</span>
            <p className="font-semibold text-slate-200 truncate">{paper.study_design}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Sample Size</span>
            <p className="font-semibold text-sky-400">{paper.sample_size || 'N/A'}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Citations</span>
            <p className="font-semibold text-emerald-400">{paper.citation_count}</p>
          </div>
        </div>

        {/* Abstract */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Abstract & Clinical Summary
          </h3>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
            {paper.abstract}
          </div>
        </div>

        {/* MeSH Terms */}
        {paper.mesh_terms && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-sky-400" />
              <span>MeSH Headings & Indexing Terms</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {paper.mesh_terms.split(',').map((term, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-400 rounded-lg"
                >
                  {term.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
