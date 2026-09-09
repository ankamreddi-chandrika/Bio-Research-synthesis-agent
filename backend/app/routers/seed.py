from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.models import Paper
from ..schemas.schemas import SeedGenerateRequest, SeedResponse
from ..services.data_seeder import DataSeederService

router = APIRouter(prefix="/seed", tags=["Dummy Data Generator"])

@router.post("/generate", response_model=SeedResponse)
def generate_synthetic_data(payload: SeedGenerateRequest, db: Session = Depends(get_db)):
    seeder = DataSeederService(db)
    new_papers = seeder.generate_dummy_papers(count=payload.paper_count, area=payload.therapeutic_area)
    total = db.query(Paper).count()
    return SeedResponse(
        success=True,
        message=f"Successfully generated {len(new_papers)} synthetic biomedical papers and clinical trial records.",
        papers_added=len(new_papers),
        total_papers=total
    )

@router.post("/reset", response_model=SeedResponse)
def reset_to_seeds(db: Session = Depends(get_db)):
    seeder = DataSeederService(db)
    success = seeder.reset_to_seeds()
    total = db.query(Paper).count()
    return SeedResponse(
        success=success,
        message="Database restored to baseline clinical seeds.",
        papers_added=0,
        total_papers=total
    )
