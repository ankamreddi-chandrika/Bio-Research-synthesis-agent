from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .config import settings
from .database import engine, Base
from .routers import papers_router, synthesis_router, users_router, analytics_router, seed_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database schema is created on startup
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Autonomous Biomedical Literature Review & Research Synthesis AI Agent for Pharmaceutical R&D Teams.",
    lifespan=lifespan
)

# CORS middleware for React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Modular Routers
app.include_router(papers_router, prefix=settings.API_V1_STR)
app.include_router(synthesis_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(seed_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "status": "healthy",
        "agent": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "endpoints": {
            "papers": f"{settings.API_V1_STR}/papers",
            "synthesis": f"{settings.API_V1_STR}/synthesis/reviews",
            "autonomous_run": f"{settings.API_V1_STR}/synthesis/run",
            "analytics": f"{settings.API_V1_STR}/analytics/overview",
            "users": f"{settings.API_V1_STR}/users",
            "seed": f"{settings.API_V1_STR}/seed/generate"
        }
    }
