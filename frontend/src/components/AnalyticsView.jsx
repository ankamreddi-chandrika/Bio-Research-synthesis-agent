import React from 'react';
import { BarChart3, TrendingUp, PieChart as PieIcon, Layers, ShieldCheck } from 'lucide-react';
import PublicationTrendsChart from './Charts/PublicationTrendsChart';
import StudyDesignPieChart from './Charts/StudyDesignPieChart';
import TherapeuticAreaBarChart from './Charts/TherapeuticAreaBarChart';
import EvidenceLevelChart from './Charts/EvidenceLevelChart';

export default function AnalyticsView({ overview }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-white">Biomedical Analytics & Evidence Intelligence</h2>
        <p className="text-xs text-slate-400">Longitudinal publication trends, clinical design distributions, and evidence grading</p>
      </div>

      {/* Grid of 4 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Publication & Synthesis Trends */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-bold text-slate-200">Publication & Synthesis Timeline</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">2021 &ndash; 2024</span>
          </div>
          <PublicationTrendsChart data={overview?.monthly_trends} />
        </div>

        {/* Chart 2: Study Design Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-slate-200">Study Design Breakdown</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">RCTs vs Observational</span>
          </div>
          <StudyDesignPieChart data={overview?.study_designs} />
        </div>

        {/* Chart 3: Therapeutic Area Volume & Citations */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-slate-200">Therapeutic Area Volume</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Indexed Studies</span>
          </div>
          <TherapeuticAreaBarChart data={overview?.therapeutic_areas} />
        </div>

        {/* Chart 4: Oxford CEBM Evidence Levels */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <h3 className="text-xs font-bold text-slate-200">Oxford CEBM Evidence Hierarchy</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Levels 1a to 5</span>
          </div>
          <EvidenceLevelChart data={overview?.evidence_levels} />
        </div>
      </div>
    </div>
  );
}
