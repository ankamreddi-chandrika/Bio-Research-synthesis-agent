"""
Database initialization and data seeding script for Biomedical Literature Review & Research Synthesis Agent.
Creates tables and seeds realistic dummy / benchmark pharma datasets.
"""

import os
import json
import sqlite3
from pathlib import Path

DB_DIR = Path(__file__).parent.resolve()
DB_PATH = DB_DIR / "research_agent.db"
SCHEMA_PATH = DB_DIR / "schema.sql"
SEEDS_DIR = DB_DIR / "seeds"

def init_db():
    print(f"[*] Initializing database at {DB_PATH}...")
    if DB_PATH.exists():
        DB_PATH.unlink()  # Clean reset

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON;")

    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        schema_sql = f.read()
    
    cursor.executescript(schema_sql)
    conn.commit()
    print("[+] Database schema created successfully.")
    conn.close()

def seed_db():
    print("[*] Seeding database with benchmark pharma research data...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON;")

    # 1. Seed Users
    users_file = SEEDS_DIR / "users.json"
    if users_file.exists():
        with open(users_file, "r", encoding="utf-8") as f:
            users_data = json.load(f)
        for u in users_data:
            cursor.execute("""
                INSERT OR REPLACE INTO users (id, name, email, role, department, avatar_url)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (u["id"], u["name"], u["email"], u["role"], u["department"], u.get("avatar_url", "")))
        print(f"[+] Seeded {len(users_data)} users/researchers.")

    # 2. Seed Papers
    papers_file = SEEDS_DIR / "papers.json"
    if papers_file.exists():
        with open(papers_file, "r", encoding="utf-8") as f:
            papers_data = json.load(f)
        for p in papers_data:
            cursor.execute("""
                INSERT OR REPLACE INTO papers (
                    id, pmid, doi, title, authors, journal, pub_year,
                    therapeutic_area, study_design, cebm_level, sample_size,
                    citation_count, relevance_score, mesh_terms, abstract
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                p["id"], p["pmid"], p["doi"], p["title"], p["authors"],
                p["journal"], p["pub_year"], p["therapeutic_area"],
                p["study_design"], p["cebm_level"], p.get("sample_size", 0),
                p.get("citation_count", 0), p.get("relevance_score", 0.9),
                p.get("mesh_terms", ""), p["abstract"]
            ))
        print(f"[+] Seeded {len(papers_data)} biomedical papers.")

    # 3. Seed Synthesis Reviews
    reviews_file = SEEDS_DIR / "synthesis_reviews.json"
    if reviews_file.exists():
        with open(reviews_file, "r", encoding="utf-8") as f:
            reviews_data = json.load(f)
        for r in reviews_data:
            cursor.execute("""
                INSERT OR REPLACE INTO synthesis_reviews (
                    id, title, query, user_id, status, therapeutic_area,
                    summary_md, prisma_identified, prisma_screened,
                    prisma_included, hallucination_score, confidence_score,
                    execution_time_sec
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                r["id"], r["title"], r["query"], r["user_id"], r["status"],
                r["therapeutic_area"], r["summary_md"], r.get("prisma_identified", 100),
                r.get("prisma_screened", 30), r.get("prisma_included", 3),
                r.get("hallucination_score", 0.02), r.get("confidence_score", 0.97),
                r.get("execution_time_sec", 3.0)
            ))
        print(f"[+] Seeded {len(reviews_data)} synthesis reviews.")

    # 4. Seed Evidence Findings
    findings_file = SEEDS_DIR / "evidence_findings.json"
    if findings_file.exists():
        with open(findings_file, "r", encoding="utf-8") as f:
            findings_data = json.load(f)
        for ef in findings_data:
            cursor.execute("""
                INSERT OR REPLACE INTO evidence_findings (
                    id, review_id, paper_id, population, intervention,
                    comparator, outcome, key_finding, confidence_score,
                    claim_grounding
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                ef["id"], ef["review_id"], ef["paper_id"], ef["population"],
                ef["intervention"], ef["comparator"], ef["outcome"],
                ef["key_finding"], ef.get("confidence_score", 0.95),
                ef["claim_grounding"]
            ))
        print(f"[+] Seeded {len(findings_data)} evidence findings.")

    # 5. Seed Research Metrics for chart trends
    metrics = [
        ("2024-01-01", "Oncology", 45, 12, 0.92),
        ("2024-02-01", "Oncology", 58, 15, 0.94),
        ("2024-03-01", "Immunology", 38, 10, 0.91),
        ("2024-04-01", "Neurology", 42, 14, 0.95),
        ("2024-05-01", "Cardiology", 50, 16, 0.96),
        ("2024-06-01", "Rare Diseases", 28, 8, 0.97),
        ("2024-07-01", "Oncology", 65, 19, 0.96),
        ("2024-08-01", "Immunology", 48, 13, 0.93),
    ]
    for m in metrics:
        cursor.execute("""
            INSERT INTO research_metrics (metric_date, therapeutic_area, papers_indexed, syntheses_run, avg_evidence_score)
            VALUES (?, ?, ?, ?, ?)
        """, m)

    conn.commit()
    conn.close()
    print("[SUCCESS] Seeding completed successfully.")

if __name__ == "__main__":
    init_db()
    seed_db()
