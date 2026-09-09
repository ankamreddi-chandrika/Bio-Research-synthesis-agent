from .papers import router as papers_router
from .synthesis import router as synthesis_router
from .users import router as users_router
from .analytics import router as analytics_router
from .seed import router as seed_router

__all__ = ["papers_router", "synthesis_router", "users_router", "analytics_router", "seed_router"]
