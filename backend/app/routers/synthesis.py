from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc

from ..database import get_db
from ..models.models import SynthesisReview, EvidenceFinding, Paper, User
from ..schemas.schemas import (
    SynthesisRunRequest, SynthesisRunResponse,
    SynthesisReviewResponse, SynthesisReviewDetailResponse,
    EvidenceFindingResponse, PaperResponse
)
from ..services.agent_engine import SynthesisAgentEngine

router = APIRouter(prefix="/synthesis", tags=["AI Synthesis Agent"])

@router.post("/run", response_model=SynthesisRunResponse, status_code=status.HTTP_201_CREATED)
def run_autonomous_synthesis(payload: SynthesisRunRequest, db: Session = Depends(get_db)):
    if not payload.query or len(payload.query.strip()) < 3:
        raise HTTPException(status_code=400, detail="Search query must contain at least 3 characters")

    engine = SynthesisAgentEngine(db)
    review, findings, papers, logs = engine.run_synthesis(payload)

    # Format findings with paper metadata
    findings_resp = []
    for f in findings:
        paper = next((p for p in papers if p.id == f.paper_id), None)
        findings_resp.append(EvidenceFindingResponse(
            id=f.id,
            review_id=f.review_id,
            paper_id=f.paper_id,
            population=f.population,
            intervention=f.intervention,
            comparator=f.comparator,
            outcome=f.outcome,
            key_finding=f.key_finding,
            confidence_score=f.confidence_score,
            claim_grounding=f.claim_grounding,
            paper_title=paper.title if paper else None,
            paper_pmid=paper.pmid if paper else None,
            paper_journal=paper.journal if paper else None,
            paper_year=paper.pub_year if paper else None,
            created_at=f.created_at
        ))

    review_resp = SynthesisReviewResponse(
        id=review.id,
        title=review.title,
        query=review.query,
        user_id=review.user_id,
        status=review.status,
        therapeutic_area=review.therapeutic_area,
        summary_md=review.summary_md,
        prisma_identified=review.prisma_identified,
        prisma_screened=review.prisma_screened,
        prisma_included=review.prisma_included,
        hallucination_score=review.hallucination_score,
        confidence_score=review.confidence_score,
        execution_time_sec=review.execution_time_sec,
        author_name=review.author.name if review.author else "AI Research Agent",
        findings_count=len(findings),
        created_at=review.created_at
    )

    papers_resp = [PaperResponse.model_validate(p) for p in papers]

    return SynthesisRunResponse(
        review=review_resp,
        findings=findings_resp,
        included_papers=papers_resp,
        execution_logs=logs
    )

@router.get("/reviews", response_model=List[SynthesisReviewResponse])
def list_synthesis_reviews(db: Session = Depends(get_db)):
    reviews = db.query(SynthesisReview).order_by(desc(SynthesisReview.created_at)).all()
    results = []
    for r in reviews:
        count = db.query(EvidenceFinding).filter(EvidenceFinding.review_id == r.id).count()
        results.append(SynthesisReviewResponse(
            id=r.id,
            title=r.title,
            query=r.query,
            user_id=r.user_id,
            status=r.status,
            therapeutic_area=r.therapeutic_area,
            summary_md=r.summary_md,
            prisma_identified=r.prisma_identified,
            prisma_screened=r.prisma_screened,
            prisma_included=r.prisma_included,
            hallucination_score=r.hallucination_score,
            confidence_score=r.confidence_score,
            execution_time_sec=r.execution_time_sec,
            author_name=r.author.name if r.author else "AI Research Agent",
            findings_count=count,
            created_at=r.created_at
        ))
    return results

@router.get("/reviews/{review_id}", response_model=SynthesisReviewDetailResponse)
def get_synthesis_review_detail(review_id: int, db: Session = Depends(get_db)):
    review = db.query(SynthesisReview).filter(SynthesisReview.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Synthesis review not found")

    findings = db.query(EvidenceFinding).filter(EvidenceFinding.review_id == review.id).all()
    paper_ids = [f.paper_id for f in findings]
    papers = db.query(Paper).filter(Paper.id.in_(paper_ids)).all() if paper_ids else []
    paper_map = {p.id: p for p in papers}

    findings_resp = []
    for f in findings:
        paper = paper_map.get(f.paper_id)
        findings_resp.append(EvidenceFindingResponse(
            id=f.id,
            review_id=f.review_id,
            paper_id=f.paper_id,
            population=f.population,
            intervention=f.intervention,
            comparator=f.comparator,
            outcome=f.outcome,
            key_finding=f.key_finding,
            confidence_score=f.confidence_score,
            claim_grounding=f.claim_grounding,
            paper_title=paper.title if paper else None,
            paper_pmid=paper.pmid if paper else None,
            paper_journal=paper.journal if paper else None,
            paper_year=paper.pub_year if paper else None,
            created_at=f.created_at
        ))

    papers_resp = [PaperResponse.model_validate(p) for p in papers]

    return SynthesisReviewDetailResponse(
        id=review.id,
        title=review.title,
        query=review.query,
        user_id=review.user_id,
        status=review.status,
        therapeutic_area=review.therapeutic_area,
        summary_md=review.summary_md,
        prisma_identified=review.prisma_identified,
        prisma_screened=review.prisma_screened,
        prisma_included=review.prisma_included,
        hallucination_score=review.hallucination_score,
        confidence_score=review.confidence_score,
        execution_time_sec=review.execution_time_sec,
        author_name=review.author.name if review.author else "AI Research Agent",
        findings_count=len(findings),
        findings=findings_resp,
        included_papers=papers_resp,
        created_at=review.created_at
    )

@router.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_synthesis_review(review_id: int, db: Session = Depends(get_db)):
    review = db.query(SynthesisReview).filter(SynthesisReview.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Synthesis review not found")
    db.delete(review)
    db.commit()
    return None
