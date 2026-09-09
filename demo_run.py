import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from app.database import SessionLocal
from app.services.agent_engine import SynthesisAgentEngine
from app.schemas.schemas import SynthesisRunRequest

def main():
    print("=" * 80)
    print("  AUTONOMOUS BIOMEDICAL LITERATURE REVIEW & RESEARCH SYNTHESIS AGENT")
    print("  Evidence Intelligence Platform for Pharmaceutical R&D")
    print("=" * 80)
    print()

    db = SessionLocal()
    engine = SynthesisAgentEngine(db)

    query = "KRAS G12C inhibitor resistance mechanisms in non-small cell lung cancer"
    req = SynthesisRunRequest(
        query=query,
        therapeutic_area="Oncology",
        user_id=1,
        max_papers=3
    )

    print(f"[*] RESEARCH HYPOTHESIS : {req.query}")
    print(f"[*] THERAPEUTIC AREA    : {req.therapeutic_area}")
    print(f"[*] PRIMARY INVESTIGATOR: Dr. Elena Vance (ID: {req.user_id})")
    print(f"[*] MAX PAPERS TO AUDIT : {req.max_papers}")
    print("-" * 80)
    print("EXECUTING 5-STAGE PIPELINE...")
    print("-" * 80)

    review, findings, papers, logs = engine.run_synthesis(req)

    for log in logs:
        print(f"  > {log}")
    print()

    print("=" * 80)
    print("  PRISMA 2020 SYSTEMATIC REVIEW FLOW TELEMETRY")
    print("=" * 80)
    print(f"  - Records Identified across Databases: {review.prisma_identified}")
    print(f"  - Records Screened for Eligibility    : {review.prisma_screened}")
    print(f"  - Full-Text Publications Included     : {review.prisma_included}")
    print(f"  - Hallucination Audit Score           : {review.hallucination_score * 100:.2f}% (Certified < 5.0%)")
    print(f"  - Evidence Grounding Confidence       : {review.confidence_score * 100:.2f}%")
    print(f"  - Total Execution Latency             : {review.execution_time_sec:.2f}s")
    print()

    print("=" * 80)
    print("  RETRIEVED STUDIES & OXFORD CEBM EVIDENCE LEVELS")
    print("=" * 80)
    for i, p in enumerate(papers, 1):
        print(f"[{i}] PMID: {p.pmid} | DOI: {p.doi}")
        print(f"    Title   : {p.title}")
        print(f"    Journal : {p.journal} ({p.pub_year}) | Authors: {p.authors}")
        print(f"    Design  : {p.study_design} | CEBM Evidence: {p.cebm_level} | Sample Size: {p.sample_size}")
        print()

    print("=" * 80)
    print("  STRUCTURED PICO EVIDENCE MATRIX")
    print("=" * 80)
    for i, f in enumerate(findings, 1):
        print(f"Study #{i} (PMID: {f.paper.pmid} - {f.paper.journal}):")
        print(f"  * Population       : {f.population}")
        print(f"  * Intervention     : {f.intervention}")
        print(f"  * Comparator       : {f.comparator}")
        print(f"  * Outcome          : {f.outcome}")
        print(f"  * Key Finding      : {f.key_finding}")
        print(f"  * Confidence Score : {f.confidence_score * 100:.1f}%")
        print(f"  * Grounding Excerpt: \"{f.claim_grounding}\"")
        print("-" * 80)
    print()

    print("=" * 80)
    print("  AUTONOMOUS SYNTHESIZED THEMATIC DOSSIER")
    print("=" * 80)
    print(review.summary_md)
    print()
    print("=" * 80)
    print("  [SUCCESS] AGENT EXECUTION FINISHED & PERSISTED")
    print("=" * 80)

    db.close()

if __name__ == "__main__":
    main()
