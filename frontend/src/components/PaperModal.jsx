import React, { useState, useEffect } from 'react';
import { X, Save, BookOpen } from 'lucide-react';

export default function PaperModal({ isOpen, onClose, onSave, paper = null }) {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    journal: '',
    pub_year: new Date().getFullYear(),
    therapeutic_area: 'Oncology',
    study_design: 'Phase II Clinical Trial',
    cebm_level: 'Level 2a',
    pmid: '',
    doi: '',
    sample_size: 100,
    citation_count: 25,
    relevance_score: 0.95,
    mesh_terms: '',
    abstract: ''
  });

  useEffect(() => {
    if (paper) {
      setFormData({
        title: paper.title || '',
        authors: paper.authors || '',
        journal: paper.journal || '',
        pub_year: paper.pub_year || new Date().getFullYear(),
        therapeutic_area: paper.therapeutic_area || 'Oncology',
        study_design: paper.study_design || 'Phase II Clinical Trial',
        cebm_level: paper.cebm_level || 'Level 2a',
        pmid: paper.pmid || '',
        doi: paper.doi || '',
        sample_size: paper.sample_size || 0,
        citation_count: paper.citation_count || 0,
        relevance_score: paper.relevance_score || 0.95,
        mesh_terms: paper.mesh_terms || '',
        abstract: paper.abstract || ''
      });
    } else {
      setFormData({
        title: '',
        authors: '',
        journal: 'Journal of Clinical Oncology',
        pub_year: new Date().getFullYear(),
        therapeutic_area: 'Oncology',
        study_design: 'Randomized Controlled Trial (RCT)',
        cebm_level: 'Level 1b',
        pmid: `${Math.floor(35000000 + Math.random() * 4000000)}`,
        doi: '10.1016/j.cell.2024.001',
        sample_size: 240,
        citation_count: 45,
        relevance_score: 0.96,
        mesh_terms: 'Neoplasm, Targeted Therapy',
        abstract: ''
      });
    }
  }, [paper, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl shadow-sky-500/10 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-200 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              {paper ? 'Edit Biomedical Publication' : 'Add New Clinical Study / Paper'}
            </h2>
            <p className="text-xs text-slate-400">Manage peer-reviewed trial metadata and evidence parameters</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Study Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Sotorasib for Lung Cancers with KRAS p.G12C Mutation"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-sky-500/60 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Authors *</label>
              <input
                type="text"
                required
                value={formData.authors}
                onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                placeholder="e.g. Skoulidis F, Li BT, et al."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-sky-500/60 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Journal *</label>
              <input
                type="text"
                required
                value={formData.journal}
                onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                placeholder="e.g. New England Journal of Medicine"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-sky-500/60 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Therapeutic Area</label>
              <select
                value={formData.therapeutic_area}
                onChange={(e) => setFormData({ ...formData, therapeutic_area: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-sky-500/60 focus:outline-none"
              >
                <option value="Oncology">Oncology</option>
                <option value="Neurology">Neurology</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Immunology">Immunology</option>
                <option value="Rare Diseases">Rare Diseases</option>
                <option value="Infectious Diseases">Infectious Diseases</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Study Design</label>
              <select
                value={formData.study_design}
                onChange={(e) => setFormData({ ...formData, study_design: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-sky-500/60 focus:outline-none"
              >
                <option value="Randomized Controlled Trial (RCT)">Randomized Controlled Trial (RCT)</option>
                <option value="Systematic Review & Meta-Analysis">Systematic Review & Meta-Analysis</option>
                <option value="Phase II Clinical Trial">Phase II Clinical Trial</option>
                <option value="Phase III Registrational Trial">Phase III Registrational Trial</option>
                <option value="Prospective Cohort Study">Prospective Cohort Study</option>
                <option value="Preclinical In Vitro/In Vivo">Preclinical In Vitro/In Vivo</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">CEBM Evidence Level</label>
              <select
                value={formData.cebm_level}
                onChange={(e) => setFormData({ ...formData, cebm_level: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-sky-500/60 focus:outline-none"
              >
                <option value="Level 1a">Level 1a (Meta-Analysis)</option>
                <option value="Level 1b">Level 1b (Individual RCT)</option>
                <option value="Level 2a">Level 2a (Cohort Review)</option>
                <option value="Level 2b">Level 2b (Cohort Study)</option>
                <option value="Level 3">Level 3 (Case-Control)</option>
                <option value="Level 4">Level 4 (Case Series)</option>
                <option value="Level 5">Level 5 (Preclinical)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Pub Year</label>
              <input
                type="number"
                value={formData.pub_year}
                onChange={(e) => setFormData({ ...formData, pub_year: parseInt(e.target.value) || 2024 })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">PMID</label>
              <input
                type="text"
                value={formData.pmid}
                onChange={(e) => setFormData({ ...formData, pmid: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Sample Size (n)</label>
              <input
                type="number"
                value={formData.sample_size}
                onChange={(e) => setFormData({ ...formData, sample_size: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Citations</label>
              <input
                type="number"
                value={formData.citation_count}
                onChange={(e) => setFormData({ ...formData, citation_count: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Abstract *</label>
            <textarea
              required
              rows={4}
              value={formData.abstract}
              onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
              placeholder="Paste study abstract here..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-sky-500/60 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/80 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{paper ? 'Save Changes' : 'Create Paper'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
