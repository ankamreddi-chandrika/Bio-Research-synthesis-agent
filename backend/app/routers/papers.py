from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc

from ..database import get_db
from ..models.models import Paper
from ..schemas.schemas import PaperCreate, PaperUpdate, PaperResponse, PaperListResponse

router = APIRouter(prefix="/papers", tags=["Biomedical Papers"])

@router.get("/", response_model=PaperListResponse)
def list_papers(
    search: Optional[str] = Query(None, description="Search across title, abstract, authors, MeSH terms"),
    therapeutic_area: Optional[str] = Query(None, description="Filter by therapeutic area"),
    study_design: Optional[str] = Query(None, description="Filter by study design"),
    cebm_level: Optional[str] = Query(None, description="Filter by Oxford CEBM evidence level"),
    min_year: Optional[int] = Query(None, description="Minimum publication year"),
    max_year: Optional[int] = Query(None, description="Maximum publication year"),
    sort_by: str = Query("pub_year", pattern="^(pub_year|citation_count|relevance_score|sample_size|title)$"),
    order: str = Query("desc", pattern="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Paper)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Paper.title.ilike(search_pattern),
                Paper.abstract.ilike(search_pattern),
                Paper.authors.ilike(search_pattern),
                Paper.journal.ilike(search_pattern),
                Paper.pmid.ilike(search_pattern),
                Paper.mesh_terms.ilike(search_pattern)
            )
        )

    if therapeutic_area and therapeutic_area != "All":
        query = query.filter(Paper.therapeutic_area == therapeutic_area)

    if study_design and study_design != "All":
        query = query.filter(Paper.study_design == study_design)

    if cebm_level and cebm_level != "All":
        query = query.filter(Paper.cebm_level == cebm_level)

    if min_year:
        query = query.filter(Paper.pub_year >= min_year)

    if max_year:
        query = query.filter(Paper.pub_year <= max_year)

    total = query.count()

    # Sorting
    sort_col = getattr(Paper, sort_by, Paper.pub_year)
    if order == "asc":
        query = query.order_by(asc(sort_col))
    else:
        query = query.order_by(desc(sort_col))

    items = query.offset((page - 1) * page_size).limit(page_size).all()

    return PaperListResponse(
        total=total,
        page=page,
        page_size=page_size,
        items=items
    )

@router.get("/meta/filters")
def get_filter_metadata(db: Session = Depends(get_db)):
    areas = [r[0] for r in db.query(Paper.therapeutic_area).distinct().all() if r[0]]
    designs = [r[0] for r in db.query(Paper.study_design).distinct().all() if r[0]]
    levels = [r[0] for r in db.query(Paper.cebm_level).distinct().all() if r[0]]
    years = [r[0] for r in db.query(Paper.pub_year).distinct().order_by(desc(Paper.pub_year)).all() if r[0]]

    return {
        "therapeutic_areas": sorted(areas),
        "study_designs": sorted(designs),
        "cebm_levels": sorted(levels),
        "years": sorted(years, reverse=True)
    }

@router.get("/{paper_id}", response_model=PaperResponse)
def get_paper(paper_id: int, db: Session = Depends(get_db)):
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    return paper

@router.post("/", response_model=PaperResponse, status_code=status.HTTP_201_CREATED)
def create_paper(payload: PaperCreate, db: Session = Depends(get_db)):
    if payload.pmid:
        existing = db.query(Paper).filter(Paper.pmid == payload.pmid).first()
        if existing:
            raise HTTPException(status_code=400, detail="Paper with this PMID already exists")
    
    paper = Paper(**payload.model_dump())
    db.add(paper)
    db.commit()
    db.refresh(paper)
    return paper

@router.put("/{paper_id}", response_model=PaperResponse)
def update_paper(paper_id: int, payload: PaperUpdate, db: Session = Depends(get_db)):
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(paper, field, value)

    db.commit()
    db.refresh(paper)
    return paper

@router.delete("/{paper_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_paper(paper_id: int, db: Session = Depends(get_db)):
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    db.delete(paper)
    db.commit()
    return None
