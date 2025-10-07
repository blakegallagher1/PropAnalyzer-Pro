from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.api.endpoints import ai, analyses, auth, portfolio, properties
from app.core.config import settings
from app.core.database import engine
from app.models import Base


@asynccontextmanager
def lifespan(app: FastAPI):
    """Manage application startup and shutdown."""
    # Startup
    print("🚀 Starting PropAnalyzer Pro API...")

    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    print("✅ Database initialized")

    yield

    # Shutdown
    print("👋 Shutting down PropAnalyzer Pro API...")


app = FastAPI(
    title="PropAnalyzer Pro API",
    description="Real Estate Investment Analysis Platform",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(properties.router, prefix="/api/v1/properties", tags=["properties"])
app.include_router(analyses.router, prefix="/api/v1/analyses", tags=["analyses"])
app.include_router(portfolio.router, prefix="/api/v1/portfolio", tags=["portfolio"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["ai"])


@app.get("/")
async def root():
    return {
        "message": "PropAnalyzer Pro API",
        "version": "1.0.0",
        "docs": "/api/docs",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
    }
