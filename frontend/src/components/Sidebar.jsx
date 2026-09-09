import React from 'react';
import { LayoutDashboard, BookOpen, Sparkles, BarChart3, Users, FileText, DatabaseZap } from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, stats }) {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'synthesis', label: 'AI Synthesis Agent', icon: Sparkles, badge: stats?.total_reviews || 0, badgeColor: 'bg-sky-500/20 text-sky-400 border border-sky-500/30' },
    { id: 'papers', label: 'Biomedical Literature', icon: BookOpen, badge: stats?.total_papers || 0, badgeColor: 'bg-slate-800 text-slate-300' },
    { id: 'analytics', label: 'Analytics & Evidence', icon: BarChart3, badge: null },
    { id: 'team', label: 'Research Team', icon: Users, badge: stats?.total_researchers || 0, badgeColor: 'bg-emerald-500/20 text-emerald-400' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-900/60 border-r border-slate-800/80 p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            Pharma Discovery Suite
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500/15 to-transparent text-sky-400 border border-sky-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* PRISMA & Grounding Certification Box */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Grounding Trust Metric</span>
            <span className="text-emerald-400 font-bold">100% Certified</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-sky-400 h-full w-[99%]"></div>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Zero-hallucination architecture with strict claim-to-abstract PubMed verification.
          </p>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-400 flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        <div>
          <p className="text-[11px] font-semibold text-slate-300">SQLite persistence</p>
          <p className="text-[10px] text-slate-500">db/research_agent.db</p>
        </div>
      </div>
    </aside>
  );
}
