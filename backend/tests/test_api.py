import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
import sys
from pathlib import Path

# Ensure backend root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.main import app
from app.database import Base, get_db
from app.models.models import User, Paper, SynthesisReview, EvidenceFinding
from app.services.data_seeder import DataSeederService

# Test SQLite in-memory or temporary DB
TEST_DB_URL = "sqlite:///./test_agent.db"
engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    # Populate with baseline seed data
    db = TestingSessionLocal()
    seeder = DataSeederService(db)
    seeder.reset_to_seeds()
    db.close()
    
    yield
    
    engine.dispose()
    if os.path.exists("./test_agent.db"):
        try:
            os.remove("./test_agent.db")
        except PermissionError:
            pass

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Biomedical" in data["agent"]

def test_list_papers(client):
    response = client.get("/api/papers/")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["total"] >= 10
    assert len(data["items"]) > 0

def test_search_and_filter_papers(client):
    response = client.get("/api/papers/?search=KRAS&therapeutic_area=Oncology")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    for p in data["items"]:
        assert p["therapeutic_area"] == "Oncology"

def test_get_paper_by_id(client):
    response = client.get("/api/papers/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert "Adagrasib" in data["title"] or "KRAS" in data["title"]

def test_create_paper(client):
    payload = {
        "pmid": "99998888",
        "doi": "10.1016/j.cell.2024.999",
        "title": "Novel Small Molecule Inhibitor of Pan-RAS in Solid Tumors",
        "authors": "Dr. Sarah Connor, et al.",
        "journal": "Cell",
        "pub_year": 2024,
        "therapeutic_area": "Oncology",
        "study_design": "Phase II Clinical Trial",
        "cebm_level": "Level 2a",
        "abstract": "We developed a pan-RAS molecular inhibitor exhibiting high selective binding.",
        "sample_size": 85,
        "citation_count": 12,
        "relevance_score": 0.98
    }
    response = client.post("/api/papers/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["pmid"] == "99998888"

def test_autonomous_synthesis_run(client):
    payload = {
        "query": "Adagrasib resistance in KRAS G12C NSCLC",
        "therapeutic_area": "Oncology",
        "max_papers": 3
    }
    response = client.post("/api/synthesis/run", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "review" in data
    assert "findings" in data
    assert len(data["findings"]) > 0
    assert data["review"]["status"] == "completed"
    assert data["review"]["hallucination_score"] <= 0.05
    assert len(data["execution_logs"]) >= 5

def test_list_synthesis_reviews(client):
    response = client.get("/api/synthesis/reviews")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3

def test_get_synthesis_review_detail(client):
    response = client.get("/api/synthesis/reviews/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert "findings" in data
    assert len(data["findings"]) > 0
    assert "claim_grounding" in data["findings"][0]

def test_analytics_overview(client):
    response = client.get("/api/analytics/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["total_papers"] > 0
    assert "monthly_trends" in data
    assert "study_designs" in data
    assert "therapeutic_areas" in data
    assert "evidence_levels" in data

def test_seed_generate_dummy_data(client):
    response = client.post("/api/seed/generate", json={"paper_count": 5, "therapeutic_area": "Immunology"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["papers_added"] == 5
