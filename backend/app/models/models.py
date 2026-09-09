from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    role = Column(String(100), nullable=False)
    department = Column(String(150), nullable=False)
    avatar_url = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to synthesis reviews initiated by this user
    reviews = relationship("SynthesisReview", back_populates="author", cascade="all, delete-orphan")


class Paper(Base):
    __tablename__ = "papers"

    id = Column(Integer, primary_key=True, index=True)
    pmid = Column(String(50), unique=True, nullable=True, index=True)
    doi = Column(String(100), nullable=True)
    title = Column(String(300), nullable=False, index=True)
    authors = Column(String(300), nullable=False)
    journal = Column(String(150), nullable=False)
    pub_year = Column(Integer, nullable=False, index=True)
    therapeutic_area = Column(String(100), nullable=False, index=True)
    study_design = Column(String(100), nullable=False, index=True)
    cebm_level = Column(String(50), nullable=False)
    abstract = Column(Text, nullable=False)
    citation_count = Column(Integer, default=0)
    sample_size = Column(Integer, default=0)
    relevance_score = Column(Float, default=0.85)
    mesh_terms = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Evidence findings referencing this paper
    findings = relationship("EvidenceFinding", back_populates="paper", cascade="all, delete-orphan")


class SynthesisReview(Base):
    __tablename__ = "synthesis_reviews"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    query = Column(String(300), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), default="completed")
    therapeutic_area = Column(String(100), nullable=False)
    summary_md = Column(Text, nullable=False)
    prisma_identified = Column(Integer, default=0)
    prisma_screened = Column(Integer, default=0)
    prisma_included = Column(Integer, default=0)
    hallucination_score = Column(Float, default=0.02)
    confidence_score = Column(Float, default=0.96)
    execution_time_sec = Column(Float, default=3.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    author = relationship("User", back_populates="reviews")
    findings = relationship("EvidenceFinding", back_populates="review", cascade="all, delete-orphan")


class EvidenceFinding(Base):
    __tablename__ = "evidence_findings"

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("synthesis_reviews.id", ondelete="CASCADE"), nullable=False)
    paper_id = Column(Integer, ForeignKey("papers.id", ondelete="CASCADE"), nullable=False)
    population = Column(Text, nullable=False)
    intervention = Column(Text, nullable=False)
    comparator = Column(Text, nullable=False)
    outcome = Column(Text, nullable=False)
    key_finding = Column(Text, nullable=False)
    confidence_score = Column(Float, default=0.95)
    claim_grounding = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    review = relationship("SynthesisReview", back_populates="findings")
    paper = relationship("Paper", back_populates="findings")


class ResearchMetric(Base):
    __tablename__ = "research_metrics"

    id = Column(Integer, primary_key=True, index=True)
    metric_date = Column(Date, nullable=False)
    therapeutic_area = Column(String(100), nullable=False)
    papers_indexed = Column(Integer, default=0)
    syntheses_run = Column(Integer, default=0)
    avg_evidence_score = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
