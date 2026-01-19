"""
NyayGuru AI Pro - Main FastAPI Application
Production-grade AI Legal Assistant for Indian Law.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import sys

from app.config import settings
from app.database import init_db
from app.routes import chat, statutes, documents, cases

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    logger.info("Starting NyayGuru AI Pro...")
    
    # Initialize database
    try:
        init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
    
    # Initialize vector store (optional)
    try:
        from app.services.vector_store import get_vector_store
        await get_vector_store()
        logger.info("Vector store initialized")
    except Exception as e:
        logger.warning(f"Vector store initialization skipped: {e}")
    
    logger.info("NyayGuru AI Pro started successfully!")
    
    yield
    
    # Shutdown
    logger.info("Shutting down NyayGuru AI Pro...")


# Create FastAPI app
app = FastAPI(
    title="NyayGuru AI Pro",
    description="""
    🏛️ **NyayGuru AI Pro - AI-Powered Legal Helper for India**
    
    A production-grade, multi-agent RAG system for delivering precise, 
    verifiable, bilingual (English + Hindi) legal answers related to:
    
    - **Indian Penal Code (IPC)**
    - **Bhartiya Nyaya Sanhita (BNS)**
    - **Indian Regulatory Statutes**
    
    ## Features
    
    - 🤖 **Multi-Agent Intelligence**: 7 specialized AI agents working in orchestration
    - ⚖️ **IPC ↔ BNS Mapping**: Automatic cross-referencing between old and new laws
    - 🌐 **Bilingual Support**: Full English and Hindi language support
    - 📚 **Verified Citations**: Links to official government gazettes only
    - 📄 **Document Analysis**: Upload and summarize court orders & judgments
    - 🏛️ **Case Law Intelligence**: Supreme Court and High Court judgment retrieval
    
    ## Disclaimer
    
    This service is for informational purposes only and does not constitute legal advice.
    Please consult a qualified legal professional for specific legal matters.
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc) if settings.api_debug else "An unexpected error occurred"
        }
    )


# Include routers
app.include_router(chat.router)
app.include_router(statutes.router)
app.include_router(documents.router)
app.include_router(cases.router)


# Health check endpoint
@app.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "NyayGuru AI Pro",
        "version": "1.0.0",
        "components": {
            "database": "ok",
            "vector_store": "ok",
            "llm": "mock"  # Update when LLM is connected
        }
    }


# Root endpoint
@app.get("/", tags=["root"])
async def root():
    """Root endpoint with API information."""
    return {
        "name": "NyayGuru AI Pro",
        "tagline": "AI-Powered Legal Helper for India",
        "version": "1.0.0",
        "description": "Multi-agent RAG system for Indian law",
        "features": [
            "IPC & BNS Section Lookup",
            "IPC ↔ BNS Cross-Mapping",
            "Case Law Intelligence",
            "Document Summarization",
            "Bilingual Support (English + Hindi)",
            "Verified Citations"
        ],
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "chat": "/api/chat",
            "statutes": "/api/statutes",
            "documents": "/api/documents"
        }
    }


# Agent info endpoint
@app.get("/api/agents", tags=["agents"])
async def get_all_agents():
    """Get information about all AI agents in the pipeline."""
    from app.agents.orchestrator import get_orchestrator
    orchestrator = get_orchestrator()
    return {
        "agents": orchestrator.get_agent_info(),
        "pipeline_order": [
            "query",
            "statute", 
            "case",
            "regulatory",
            "citation",
            "summary",
            "response"
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.api_debug
    )
