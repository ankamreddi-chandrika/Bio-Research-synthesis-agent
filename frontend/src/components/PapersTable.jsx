import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, ExternalLink, BookOpen, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const CEBM_BADGES = {
  'Level 1a': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Level 1b': 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  'Level 2a': 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  'Level 2b': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Level 3': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Level 4': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  'Level 5': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
};

export default function PapersTable({
  papers,
  total,
  page,
  pageSize,
  onPageChange,
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  filterMetadata,
  onOpenNewPaper,
  onEditPaper,
  onDeletePaper,
  onViewPaper
}) {
  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search publications, targets, PMIDs, authors..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Area Filter */}
          <select
            value={filters.therapeutic_area || 'All'}
            onChange={(e) => setFilters(prev => ({ ...prev, therapeutic_area: e.target.value === 'All' ? null : e.target.value }))}
            className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-sky-500/60"
          >
            <option value="All">All Therapeutic Areas</option>
            {filterMetadata?.therapeutic_areas?.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          {/* Study Design Filter */}
          <select
            value={filters.study_design || 'All'}
            onChange={(e) => setFilters(prev => ({ ...prev, study_design: e.target.value === 'All' ? null : e.target.value }))}
            className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-sky-500/60"
          >
            <option value="All">All Study Designs</option>
            {filterMetadata?.study_designs?.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* CEBM Level Filter */}
          <select
            value={filters.cebm_level || 'All'}
            onChange={(e) => setFilters(prev => ({ ...prev, cebm_level: e.target.value === 'All' ? null : e.target.value }))}
            className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-sky-500/60"
          >
            <option value="All">All CEBM Levels</option>
            {filterMetadata?.cebm_levels?.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          <button
            onClick={onOpenNewPaper}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Study</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Publication / Clinical Trial</th>
                <th className="py-3 px-3">Therapeutic Area</th>
                <th className="py-3 px-3">Study Design & Evidence</th>
                <th className="py-3 px-3">Year / Journal</th>
                <th className="py-3 px-3">Citations</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-normal">
              {papers && papers.length > 0 ? (
                papers.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-100 group-hover:text-sky-300 transition-colors line-clamp-2">
                          {p.title}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="truncate max-w-[220px]">{p.authors}</span>
                          {p.pmid && (
                            <span className="px-1.5 py-0.2 bg-slate-800 border border-slate-700 rounded text-[10px] text-sky-400 font-mono">
                              PMID:{p.pmid}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-[11px] font-medium bg-slate-800/80 border border-slate-700/60 text-slate-300 rounded-lg">
                        {p.therapeutic_area}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] text-slate-300 truncate max-w-[180px]">
                          {p.study_design}
                        </span>
                        <span className={`inline-block w-fit px-2 py-0.5 text-[10px] font-bold border rounded-full ${CEBM_BADGES[p.cebm_level] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                          {p.cebm_level}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-slate-200 font-medium">{p.pub_year}</span>
                        <span className="text-[11px] text-slate-500 truncate max-w-[140px]">{p.journal}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-slate-300">
                        <span className="font-bold text-sky-400">{p.citation_count}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onViewPaper(p)}
                          className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="View Abstract & PICO"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditPaper(p)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Paper"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeletePaper(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete Paper"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No publications matching your criteria. Try resetting filters or generating dummy data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <span className="font-semibold text-slate-200">{papers?.length || 0}</span> of <span className="font-semibold text-slate-200">{total || 0}</span> publications
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-slate-300">Page {page}</span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={(page * pageSize) >= total}
              className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
