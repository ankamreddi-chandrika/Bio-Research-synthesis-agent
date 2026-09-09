"""
Dynamic Synthetic Data Generator for Biomedical Literature Review Agent.
Supports on-demand generation of realistic trials, papers, and researchers for load testing.
"""

import random
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from ..models.models import Paper, User, SynthesisReview, EvidenceFinding, ResearchMetric
from ..config import settings
import json

THERAPEUTIC_AREAS = [
    "Oncology", "Immunology", "Neurology", "Cardiology",
    "Infectious Diseases", "Rare Diseases", "Metabolic Disorders", "Hematology"
]

STUDY_DESIGNS = [
    ("Randomized Controlled Trial (RCT)", "Level 1b"),
    ("Systematic Review & Meta-Analysis", "Level 1a"),
    ("Phase II Clinical Trial", "Level 2a"),
    ("Phase III Registrational Trial", "Level 1b"),
    ("Prospective Cohort Study", "Level 2b"),
    ("Preclinical In Vitro/In Vivo", "Level 5"),
    ("Case-Control Study", "Level 3b")
]

JOURNALS = [
    "New England Journal of Medicine", "The Lancet", "Nature Medicine",
    "Cell", "Journal of Clinical Oncology", "Nature Biotechnology",
    "Science Translational Medicine", "The Lancet Oncology", "JAMA"
]

TARGETS = [
    ("KRAS G12D", "Pancreatic Ductal Adenocarcinoma"),
    ("HER2/neu Exon 20", "Non-Small-Cell Lung Cancer"),
    ("Tau Phosphorylation", "Frontotemporal Dementia"),
    ("GLP-1/GIP/Glucagon Triple Agonist", "NASH and Metabolic Syndrome"),
    ("CD19/CD22 CAR-T", "Relapsed B-Cell Acute Lymphoblastic Leukemia"),
    ("Complement C3/C5 Inhibition", "Paroxysmal Nocturnal Hemoglobinuria"),
    ("STING Agonist Conjugate", "Immune-Cold Solid Tumors"),
    ("RNA Therapeutics via GalNAc", "Cardiovascular Dyslipidemia")
]

class DataSeederService:
    def __init__(self, db: Session):
        self.db = db

    def generate_dummy_papers(self, count: int = 10, area: str = None) -> List[Paper]:
        new_papers = []
        for i in range(count):
            target_info = random.choice(TARGETS)
            study_design, cebm = random.choice(STUDY_DESIGNS)
            selected_area = area if area and area != "All" else random.choice(THERAPEUTIC_AREAS)
            journal = random.choice(JOURNALS)
            year = random.randint(2020, 2024)
            pmid = str(random.randint(34000000, 39999999))
            doi = f"10.1016/j.cell.{year}.{random.randint(100, 999)}"
            sample_size = random.randint(30, 2500) if "Trial" in study_design or "RCT" in study_design else random.randint(10, 60)
            citations = random.randint(15, 650)
            relevance = round(random.uniform(0.82, 0.99), 2)

            title = f"Evaluation of Novel {target_info[0]} Targeted Modality in {target_info[1]}: A Multicenter Study"
            abstract = (
                f"Background: {target_info[0]} plays a crucial pathogenic role in {target_info[1]}. "
                f"Methods: We conducted a {study_design} evaluating pharmacological efficacy and safety in a cohort of {sample_size} subjects. "
                f"Results: Treatment achieved a primary response rate of {random.randint(38, 75)}% with marked biomarker reduction. "
                f"Conclusions: These findings support further clinical exploration of {target_info[0]} therapeutic strategies."
            )

            paper = Paper(
                pmid=pmid,
                doi=doi,
                title=title,
                authors=f"Dr. {random.choice(['Harrison', 'Novak', 'Zhao', 'Vargas', 'Lindqvist', 'Patel'])}, et al.",
                journal=journal,
                pub_year=year,
                therapeutic_area=selected_area,
                study_design=study_design,
                cebm_level=cebm,
                abstract=abstract,
                citation_count=citations,
                sample_size=sample_size,
                relevance_score=relevance,
                mesh_terms=f"{target_info[0]}, {target_info[1]}, {selected_area}, Pharmacology"
            )
            self.db.add(paper)
            new_papers.append(paper)

        self.db.commit()
        for p in new_papers:
            self.db.refresh(p)
        return new_papers

    def reset_to_seeds(self) -> bool:
        """Resets the database and restores baseline seed JSON records."""
        self.db.query(EvidenceFinding).delete()
        self.db.query(SynthesisReview).delete()
        self.db.query(Paper).delete()
        self.db.query(User).delete()
        self.db.query(ResearchMetric).delete()
        self.db.commit()

        seeds_dir = settings.SEEDS_DIR

        # Restore Users
        users_file = seeds_dir / "users.json"
        if users_file.exists():
            with open(users_file, "r", encoding="utf-8") as f:
                for u in json.load(f):
                    self.db.add(User(**u))

        # Restore Papers
        papers_file = seeds_dir / "papers.json"
        if papers_file.exists():
            with open(papers_file, "r", encoding="utf-8") as f:
                for p in json.load(f):
                    self.db.add(Paper(**p))

        self.db.commit()

        # Restore Reviews
        reviews_file = seeds_dir / "synthesis_reviews.json"
        if reviews_file.exists():
            with open(reviews_file, "r", encoding="utf-8") as f:
                for r in json.load(f):
                    self.db.add(SynthesisReview(**r))

        self.db.commit()

        # Restore Findings
        findings_file = seeds_dir / "evidence_findings.json"
        if findings_file.exists():
            with open(findings_file, "r", encoding="utf-8") as f:
                for ef in json.load(f):
                    self.db.add(EvidenceFinding(**ef))

        self.db.commit()
        return True
