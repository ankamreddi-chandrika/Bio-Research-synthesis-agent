-- SQLite Relational Schema for Biomedical Literature Review & Research Synthesis Agent
-- Database: research_agent.db

PRAGMA foreign_keys = ON;

-- 1. Users / Researchers Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL, -- e.g. "Principal Investigator", "Clinical Oncologist", "Lead Pharmacologist", "Research Fellow"
    department TEXT NOT NULL, -- e.g. "Oncology R&D", "Immunology & Virology", "Translational Medicine"
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Papers / Biomedical Publications Table
CREATE TABLE IF NOT EXISTS papers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pmid TEXT UNIQUE,
    doi TEXT,
    title TEXT NOT NULL,
    authors TEXT NOT NULL,
    journal TEXT NOT NULL,
    pub_year INTEGER NOT NULL,
    therapeutic_area TEXT NOT NULL, -- e.g. "Oncology", "Immunology", "Neurology", "Cardiology", "Rare Diseases"
    study_design TEXT NOT NULL, -- e.g. "Systematic Review & Meta-Analysis", "Randomized Controlled Trial (RCT)", "Phase II Clinical Trial", "Prospective Cohort Study", "Preclinical In Vitro/In Vivo"
    cebm_level TEXT NOT NULL, -- e.g. "Level 1a", "Level 1b", "Level 2a", "Level 2b", "Level 3", "Level 4", "Level 5"
    abstract TEXT NOT NULL,
    citation_count INTEGER DEFAULT 0,
    sample_size INTEGER DEFAULT 0,
    relevance_score REAL DEFAULT 0.85,
    mesh_terms TEXT, -- JSON or comma-separated MeSH headings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Synthesis Reviews (Autonomous Literature Review Runs)
CREATE TABLE IF NOT EXISTS synthesis_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    query TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed', -- "completed", "in_progress", "failed", "draft"
    therapeutic_area TEXT NOT NULL,
    summary_md TEXT NOT NULL,
    prisma_identified INTEGER DEFAULT 0,
    prisma_screened INTEGER DEFAULT 0,
    prisma_included INTEGER DEFAULT 0,
    hallucination_score REAL DEFAULT 0.02, -- Percentage or fraction of ungrounded claims (lower is better, < 0.05 is certified)
    confidence_score REAL DEFAULT 0.96,
    execution_time_sec REAL DEFAULT 3.42,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Evidence Findings (Structured PICO Extractions & Grounded Claims)
CREATE TABLE IF NOT EXISTS evidence_findings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    review_id INTEGER NOT NULL,
    paper_id INTEGER NOT NULL,
    population TEXT NOT NULL,
    intervention TEXT NOT NULL,
    comparator TEXT NOT NULL,
    outcome TEXT NOT NULL,
    key_finding TEXT NOT NULL,
    confidence_score REAL DEFAULT 0.95,
    claim_grounding TEXT NOT NULL, -- Original excerpt from source abstract supporting the finding
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES synthesis_reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE
);

-- 5. Research Metrics (Aggregations and trend tracking)
CREATE TABLE IF NOT EXISTS research_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_date DATE NOT NULL,
    therapeutic_area TEXT NOT NULL,
    papers_indexed INTEGER DEFAULT 0,
    syntheses_run INTEGER DEFAULT 0,
    avg_evidence_score REAL DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high-speed search and relational lookups
CREATE INDEX IF NOT EXISTS idx_papers_area ON papers(therapeutic_area);
CREATE INDEX IF NOT EXISTS idx_papers_design ON papers(study_design);
CREATE INDEX IF NOT EXISTS idx_papers_year ON papers(pub_year);
CREATE INDEX IF NOT EXISTS idx_papers_pmid ON papers(pmid);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON synthesis_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_evidence_review ON evidence_findings(review_id);
CREATE INDEX IF NOT EXISTS idx_evidence_paper ON evidence_findings(paper_id);
