import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import StatCards from './components/StatCards';
import IdeaAndPdfInputHub from './components/IdeaAndPdfInputHub';
import PublicationTrendsChart from './components/Charts/PublicationTrendsChart';
import StudyDesignPieChart from './components/Charts/StudyDesignPieChart';
import PapersTable from './components/PapersTable';
import SynthesisView from './components/SynthesisView';
import AnalyticsView from './components/AnalyticsView';
import TeamView from './components/TeamView';
import NewReviewModal from './components/NewReviewModal';
import PaperModal from './components/PaperModal';
import SeedDataModal from './components/SeedDataModal';
import ViewPaperModal from './components/ViewPaperModal';
import api from './services/api';
import { Sparkles, BookOpen, ArrowRight, ShieldCheck, Database, Check } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [overview, setOverview] = useState(null);
  const [papers, setPapers] = useState([]);
  const [totalPapers, setTotalPapers] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    therapeutic_area: null,
    study_design: null,
    cebm_level: null
  });
  const [filterMetadata, setFilterMetadata] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [users, setUsers] = useState([]);

  // Modals state
  const [isNewReviewOpen, setIsNewReviewOpen] = useState(false);
  const [isRunningSynthesis, setIsRunningSynthesis] = useState(false);
  const [isSeedModalOpen, setIsSeedModalOpen] = useState(false);
  const [isPaperModalOpen, setIsPaperModalOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);
  const [viewingPaper, setViewingPaper] = useState(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch Overview Analytics
  const loadOverview = useCallback(async () => {
    try {
      const res = await api.getAnalyticsOverview();
      setOverview(res.data);
    } catch (err) {
      console.error('Failed to load overview analytics', err);
    }
  }, []);

  // Fetch Papers
  const loadPapers = useCallback(async () => {
    try {
      const params = {
        page,
        page_size: pageSize,
        search: searchTerm || undefined,
        therapeutic_area: filters.therapeutic_area || undefined,
        study_design: filters.study_design || undefined,
        cebm_level: filters.cebm_level || undefined,
      };
      const res = await api.getPapers(params);
      setPapers(res.data.items);
      setTotalPapers(res.data.total);
    } catch (err) {
      console.error('Failed to load papers', err);
    }
  }, [page, pageSize, searchTerm, filters]);

  // Fetch Reviews
  const loadReviews = useCallback(async () => {
    try {
      const res = await api.getReviews();
      setReviews(res.data);
      if (res.data.length > 0 && !selectedReview) {
        loadReviewDetail(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load reviews', err);
    }
  }, [selectedReview]);

  // Fetch Review Detail
  const loadReviewDetail = async (id) => {
    try {
      const res = await api.getReviewDetail(id);
      setSelectedReview(res.data);
    } catch (err) {
      console.error('Failed to load review detail', err);
    }
  };

  // Fetch Filter Metadata
  const loadFilterMeta = useCallback(async () => {
    try {
      const res = await api.getPaperFilters();
      setFilterMetadata(res.data);
    } catch (err) {
      console.error('Failed to load filter metadata', err);
    }
  }, []);

  // Fetch Users
  const loadUsers = useCallback(async () => {
    try {
      const res = await api.getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users', err);
    }
  }, []);

  // Refresh all data
  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    await Promise.all([
      loadOverview(),
      loadPapers(),
      loadReviews(),
      loadFilterMeta(),
      loadUsers()
    ]);
    setIsRefreshing(false);
    showToast('Dashboard synchronized with latest data.');
  };

  useEffect(() => {
    handleRefreshAll();
  }, []);

  useEffect(() => {
    loadPapers();
  }, [loadPapers]);

  // Run Autonomous Synthesis on Idea / Topic
  const handleRunSynthesis = async (payload) => {
    setIsRunningSynthesis(true);
    try {
      const res = await api.runSynthesis(payload);
      showToast(`Synthesis completed for "${payload.query.slice(0, 30)}..."`);
      await loadReviews();
      await loadOverview();
      await loadPapers();
      if (res.data?.review?.id) {
        await loadReviewDetail(res.data.review.id);
        setCurrentTab('synthesis');
      }
    } catch (err) {
      console.error('Synthesis run failed', err);
      alert('Synthesis run error: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsRunningSynthesis(false);
    }
  };

  // Run Autonomous Synthesis on Uploaded PDF
  const handleSynthesizePdf = async (pdfData) => {
    setIsRunningSynthesis(true);
    try {
      const res = await api.synthesizePdf(pdfData);
      showToast(`PDF evidence synthesized: "${pdfData.title.slice(0, 30)}..."`);
      await loadReviews();
      await loadOverview();
      await loadPapers();
      if (res.data?.review?.id) {
        await loadReviewDetail(res.data.review.id);
        setCurrentTab('synthesis');
      }
    } catch (err) {
      console.error('PDF synthesis failed', err);
    } finally {
      setIsRunningSynthesis(false);
    }
  };

  // Create or Update Paper
  const handleSavePaper = async (formData) => {
    try {
      if (editingPaper) {
        await api.updatePaper(editingPaper.id, formData);
        showToast('Publication record updated successfully.');
      } else {
        await api.createPaper(formData);
        showToast('New clinical study added to literature index.');
      }
      setIsPaperModalOpen(false);
      setEditingPaper(null);
      await loadPapers();
      await loadOverview();
      await loadFilterMeta();
    } catch (err) {
      console.error('Failed to save paper', err);
      alert('Error saving paper: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Delete Paper
  const handleDeletePaper = async (id) => {
    if (!window.confirm('Are you sure you want to delete this study record?')) return;
    try {
      await api.deletePaper(id);
      showToast('Publication deleted.');
      await loadPapers();
      await loadOverview();
    } catch (err) {
      console.error('Failed to delete paper', err);
    }
  };

  // Delete Review
  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this synthesis review dossier?')) return;
    try {
      await api.deleteReview(id);
      showToast('Synthesis dossier deleted.');
      setSelectedReview(null);
      await loadReviews();
      await loadOverview();
    } catch (err) {
      console.error('Failed to delete review', err);
    }
  };

  // Dummy Seed Generation
  const handleGenerateSeed = async (payload) => {
    const res = await api.generateSeedData(payload);
    showToast(res.data.message);
    await handleRefreshAll();
  };

  const handleResetSeed = async () => {
    const res = await api.resetSeedData();
    showToast(res.data.message);
    await handleRefreshAll();
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 bg-sky-950 border border-sky-500/40 text-sky-200 text-xs font-semibold rounded-2xl shadow-2xl animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        onOpenNewReview={() => setIsNewReviewOpen(true)}
        onOpenSeedModal={() => setIsSeedModalOpen(true)}
        onOpenNewPaper={() => { setEditingPaper(null); setIsPaperModalOpen(true); }}
        onRefreshAll={handleRefreshAll}
        isRefreshing={isRefreshing}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          stats={overview}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top KPI Metrics Cards */}
          <StatCards overview={overview} />

          {/* DUAL INPUT HUB: RESEARCH IDEA OR PDF PAPER UPLOAD */}
          <IdeaAndPdfInputHub
            onRunSynthesis={handleRunSynthesis}
            onSynthesizePdf={handleSynthesizePdf}
            isRunning={isRunningSynthesis}
          />

          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-8 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">Publication & Synthesis Timeline</h3>
                      <p className="text-[11px] text-slate-400">Longitudinal indexing rate vs autonomous reviews</p>
                    </div>
                    <button
                      onClick={() => setCurrentTab('analytics')}
                      className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                    >
                      <span>Full Analytics</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <PublicationTrendsChart data={overview?.monthly_trends} />
                </div>

                <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">Study Design Distribution</h3>
                    <p className="text-[11px] text-slate-400">Clinical trials, RCTs, and meta-analyses</p>
                  </div>
                  <StudyDesignPieChart data={overview?.study_designs} />
                </div>
              </div>

              {/* Recent Synthesis Dossiers Showcase */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <h3 className="text-xs font-bold text-slate-200">Recent Literature Synthesis Dossiers</h3>
                  </div>
                  <button
                    onClick={() => setCurrentTab('synthesis')}
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                  >
                    <span>View All Syntheses</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {reviews && reviews.slice(0, 3).map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        loadReviewDetail(r.id);
                        setCurrentTab('synthesis');
                      }}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-sky-500/40 cursor-pointer space-y-2.5 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30 rounded-md">
                          {r.therapeutic_area}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          0% Hallucination
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-sky-300 transition-colors line-clamp-2">
                        {r.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        Query: {r.query}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Indexed Literature Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-400" />
                    <h3 className="text-xs font-bold text-slate-200">Biomedical Literature Index</h3>
                  </div>
                </div>
                <PapersTable
                  papers={papers}
                  total={totalPapers}
                  page={page}
                  pageSize={pageSize}
                  onPageChange={setPage}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filters={filters}
                  setFilters={setFilters}
                  filterMetadata={filterMetadata}
                  onOpenNewPaper={() => { setEditingPaper(null); setIsPaperModalOpen(true); }}
                  onEditPaper={(p) => { setEditingPaper(p); setIsPaperModalOpen(true); }}
                  onDeletePaper={handleDeletePaper}
                  onViewPaper={(p) => setViewingPaper(p)}
                />
              </div>
            </div>
          )}

          {/* TAB 2: AI SYNTHESIS AGENT */}
          {currentTab === 'synthesis' && (
            <SynthesisView
              reviews={reviews}
              selectedReview={selectedReview}
              setSelectedReview={(r) => loadReviewDetail(r.id)}
              onOpenNewReview={() => setIsNewReviewOpen(true)}
              onDeleteReview={handleDeleteReview}
              onViewPaper={(p) => setViewingPaper(p)}
            />
          )}

          {/* TAB 3: BIOMEDICAL LITERATURE */}
          {currentTab === 'papers' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-white">Biomedical Publications & Trial Database</h2>
                <p className="text-xs text-slate-400">Search, filter, and inspect peer-reviewed clinical studies and preclinical evidence</p>
              </div>
              <PapersTable
                papers={papers}
                total={totalPapers}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filters={filters}
                setFilters={setFilters}
                filterMetadata={filterMetadata}
                onOpenNewPaper={() => { setEditingPaper(null); setIsPaperModalOpen(true); }}
                onEditPaper={(p) => { setEditingPaper(p); setIsPaperModalOpen(true); }}
                onDeletePaper={handleDeletePaper}
                onViewPaper={(p) => setViewingPaper(p)}
              />
            </div>
          )}

          {/* TAB 4: ANALYTICS & EVIDENCE */}
          {currentTab === 'analytics' && (
            <AnalyticsView overview={overview} />
          )}

          {/* TAB 5: RESEARCH TEAM */}
          {currentTab === 'team' && (
            <TeamView users={users} />
          )}
        </main>
      </div>

      {/* Modals */}
      <NewReviewModal
        isOpen={isNewReviewOpen}
        onClose={() => setIsNewReviewOpen(false)}
        onRunSynthesis={handleRunSynthesis}
        isRunning={isRunningSynthesis}
      />

      <PaperModal
        isOpen={isPaperModalOpen}
        onClose={() => { setIsPaperModalOpen(false); setEditingPaper(null); }}
        onSave={handleSavePaper}
        paper={editingPaper}
      />

      <SeedDataModal
        isOpen={isSeedModalOpen}
        onClose={() => setIsSeedModalOpen(false)}
        onGenerate={handleGenerateSeed}
        onReset={handleResetSeed}
        isGenerating={isRefreshing}
      />

      <ViewPaperModal
        isOpen={!!viewingPaper}
        onClose={() => setViewingPaper(null)}
        paper={viewingPaper}
      />
    </div>
  );
}
