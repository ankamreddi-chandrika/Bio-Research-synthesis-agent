from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas.schemas import (
    AnalyticsOverviewResponse, TrendDataPoint, StudyDesignMetric,
    TherapeuticAreaMetric, EvidenceLevelMetric
)
from ..services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics & Visualizations"])

@router.get("/overview", response_model=AnalyticsOverviewResponse)
def get_analytics_overview(db: Session = Depends(get_db)):
    service = AnalyticsService(db)
    return service.get_overview_analytics()

@router.get("/trends", response_model=list[TrendDataPoint])
def get_publication_trends(db: Session = Depends(get_db)):
    service = AnalyticsService(db)
    return service.get_monthly_trends()

@router.get("/study-designs", response_model=list[StudyDesignMetric])
def get_study_designs(db: Session = Depends(get_db)):
    service = AnalyticsService(db)
    return service.get_study_design_distribution()

@router.get("/therapeutic-areas", response_model=list[TherapeuticAreaMetric])
def get_therapeutic_areas(db: Session = Depends(get_db)):
    service = AnalyticsService(db)
    return service.get_therapeutic_area_metrics()

@router.get("/evidence-levels", response_model=list[EvidenceLevelMetric])
def get_evidence_levels(db: Session = Depends(get_db)):
    service = AnalyticsService(db)
    return service.get_evidence_level_metrics()
