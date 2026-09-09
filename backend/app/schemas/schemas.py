from typing import List, Optional, Any
from datetime import datetime, date
from pydantic import BaseModel, Field, ConfigDict

# --- User Schemas ---
class UserBase(BaseModel):
    name: str = Field(..., json_schema_extra={"example": "Dr. Elena Rostova, MD, PhD"})
    email: str = Field(..., json_schema_extra={"example": "e.rostova@biopharm-ai.org"})
    role: str = Field(..., json_schema_extra={"example": "Principal Investigator"})
    department: str = Field(..., json_schema_extra={"example": "Translational Oncology R&D"})
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)


# --- Paper Schemas ---
class PaperBase(BaseModel):
    pmid: Optional[str] = Field(None, json_schema_extra={"example": "33827083"})
    doi: Optional[str] = Field(None, json_schema_extra={"example": "10.1056/NEJMoa2103695"})
    title: str = Field(..., json_schema_extra={"example": "Adagrasib in Patients with KRAS G12C-Mutated Advanced NSCLC"})
    authors: str = Field(..., json_schema_extra={"example": "Jänne PA, Riely GJ, et al."})
    journal: str = Field(..., json_schema_extra={"example": "New England Journal of Medicine"})
    pub_year: int = Field(..., json_schema_extra={"example": 2022})
    therapeutic_area: str = Field(..., json_schema_extra={"example": "Oncology"})
    study_design: str = Field(..., json_schema_extra={"example": "Phase II Clinical Trial"})
    cebm_level: str = Field(..., json_schema_extra={"example": "Level 2a"})
    abstract: str = Field(..., json_schema_extra={"example": "Adagrasib is a covalent inhibitor of KRAS G12C..."})
    citation_count: int = Field(0, json_schema_extra={"example": 412})
    sample_size: int = Field(0, json_schema_extra={"example": 116})
    relevance_score: float = Field(0.85, json_schema_extra={"example": 0.98})
    mesh_terms: Optional[str] = Field(None, json_schema_extra={"example": "Non-Small-Cell Lung Carcinoma, KRAS Protein"})

class PaperCreate(PaperBase):
    pass

class PaperUpdate(BaseModel):
    title: Optional[str] = None
    authors: Optional[str] = None
    journal: Optional[str] = None
    pub_year: Optional[int] = None
    therapeutic_area: Optional[str] = None
    study_design: Optional[str] = None
    cebm_level: Optional[str] = None
    abstract: Optional[str] = None
    citation_count: Optional[int] = None
    sample_size: Optional[int] = None
    relevance_score: Optional[float] = None
    mesh_terms: Optional[str] = None

class PaperResponse(PaperBase):
    id: int
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class PaperListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[PaperResponse]


# --- Evidence Finding Schemas ---
class EvidenceFindingBase(BaseModel):
    review_id: int
    paper_id: int
    population: str
    intervention: str
    comparator: str
    outcome: str
    key_finding: str
    confidence_score: float = 0.95
    claim_grounding: str

class EvidenceFindingCreate(EvidenceFindingBase):
    pass

class EvidenceFindingResponse(EvidenceFindingBase):
    id: int
    paper_title: Optional[str] = None
    paper_pmid: Optional[str] = None
    paper_journal: Optional[str] = None
    paper_year: Optional[int] = None
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)


# --- Synthesis Review Schemas ---
class SynthesisReviewBase(BaseModel):
    title: str
    query: str
    user_id: int
    status: str = "completed"
    therapeutic_area: str
    summary_md: str
    prisma_identified: int = 0
    prisma_screened: int = 0
    prisma_included: int = 0
    hallucination_score: float = 0.02
    confidence_score: float = 0.96
    execution_time_sec: float = 3.0

class SynthesisReviewCreate(SynthesisReviewBase):
    pass

class SynthesisReviewResponse(SynthesisReviewBase):
    id: int
    author_name: Optional[str] = None
    findings_count: Optional[int] = 0
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class SynthesisReviewDetailResponse(SynthesisReviewResponse):
    findings: List[EvidenceFindingResponse] = []
    included_papers: List[PaperResponse] = []


# --- Agent Autonomous Run Request/Response ---
class SynthesisRunRequest(BaseModel):
    query: str = Field(..., json_schema_extra={"example": "KRAS G12C inhibitor resistance mechanisms in NSCLC"})
    therapeutic_area: Optional[str] = Field("Oncology", json_schema_extra={"example": "Oncology"})
    user_id: Optional[int] = Field(1, json_schema_extra={"example": 1})
    max_papers: Optional[int] = Field(5, json_schema_extra={"example": 5})
    include_live_pubmed: Optional[bool] = Field(True, json_schema_extra={"example": True})

class SynthesisRunResponse(BaseModel):
    review: SynthesisReviewResponse
    findings: List[EvidenceFindingResponse]
    included_papers: List[PaperResponse]
    execution_logs: List[str]


# --- Analytics Schemas for Charts ---
class TrendDataPoint(BaseModel):
    period: str
    papers_indexed: int
    syntheses_run: int
    avg_evidence_score: float

class StudyDesignMetric(BaseModel):
    name: str
    count: int
    percentage: float

class TherapeuticAreaMetric(BaseModel):
    area: str
    paper_count: int
    avg_citations: float
    syntheses_count: int

class EvidenceLevelMetric(BaseModel):
    level: str
    description: str
    count: int

class AnalyticsOverviewResponse(BaseModel):
    total_papers: int
    total_reviews: int
    total_findings: int
    total_researchers: int
    rct_count: int
    avg_confidence_score: float
    avg_hallucination_rate: float
    therapeutic_areas_count: int
    monthly_trends: List[TrendDataPoint]
    study_designs: List[StudyDesignMetric]
    therapeutic_areas: List[TherapeuticAreaMetric]
    evidence_levels: List[EvidenceLevelMetric]


# --- Dummy Data Generation Schemas ---
class SeedGenerateRequest(BaseModel):
    paper_count: int = Field(10, ge=1, le=100, json_schema_extra={"example": 10})
    therapeutic_area: Optional[str] = Field(None, json_schema_extra={"example": "Oncology"})

class SeedResponse(BaseModel):
    success: bool
    message: str
    papers_added: int
    total_papers: int
