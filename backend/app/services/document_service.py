"""
NyayGuru AI Pro - Document Service
Handles PDF upload, parsing, and summarization.
"""

import os
import uuid
from typing import Dict, Any, Optional, List
from datetime import datetime
import logging
import asyncio

try:
    import pdfplumber
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False

try:
    from PyPDF2 import PdfReader
    PYPDF2_AVAILABLE = True
except ImportError:
    PYPDF2_AVAILABLE = False

from app.config import settings
from app.agents.summarization_agent import SummarizationAgent

logger = logging.getLogger(__name__)


class DocumentService:
    """Service for document processing and summarization."""
    
    def __init__(self, upload_dir: str = "./uploads"):
        self.upload_dir = upload_dir
        self.summarization_agent = SummarizationAgent()
        
        # Ensure upload directory exists
        os.makedirs(upload_dir, exist_ok=True)
        
        # In-memory document store (replace with DB in production)
        self.documents: Dict[str, Dict[str, Any]] = {}
    
    async def upload_document(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        """Upload and store a document."""
        document_id = str(uuid.uuid4())
        
        # Save file
        file_path = os.path.join(self.upload_dir, f"{document_id}_{filename}")
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        # Create document record
        document = {
            "document_id": document_id,
            "filename": filename,
            "file_path": file_path,
            "file_size": len(file_content),
            "status": "pending",
            "uploaded_at": datetime.now().isoformat(),
            "summary": None,
            "error_message": None
        }
        
        self.documents[document_id] = document
        
        # Start async processing
        asyncio.create_task(self._process_document(document_id))
        
        return {
            "document_id": document_id,
            "filename": filename,
            "status": "pending",
            "message": "Document uploaded successfully. Processing started."
        }
    
    async def get_document_status(self, document_id: str) -> Optional[Dict[str, Any]]:
        """Get document processing status."""
        document = self.documents.get(document_id)
        
        if not document:
            return None
        
        # Calculate progress based on status
        progress_map = {
            "pending": 10,
            "extracting": 30,
            "analyzing": 60,
            "summarizing": 80,
            "completed": 100,
            "error": 0
        }
        
        return {
            "document_id": document_id,
            "filename": document["filename"],
            "status": document["status"],
            "progress": progress_map.get(document["status"], 0),
            "summary": document.get("summary"),
            "error_message": document.get("error_message")
        }
    
    async def _process_document(self, document_id: str):
        """Process document in background."""
        document = self.documents.get(document_id)
        if not document:
            return
        
        try:
            # Update status to extracting
            document["status"] = "extracting"
            await asyncio.sleep(0.5)  # Simulate processing time
            
            # Extract text from PDF
            text = await self._extract_text(document["file_path"])
            
            if not text:
                raise ValueError("Could not extract text from document")
            
            # Update status to analyzing
            document["status"] = "analyzing"
            await asyncio.sleep(0.5)
            
            # Analyze document type
            doc_type = self._detect_document_type(text)
            
            # Update status to summarizing
            document["status"] = "summarizing"
            await asyncio.sleep(0.5)
            
            # Generate summary
            summary = await self.summarization_agent.summarize_document(text, doc_type)
            
            # Store summary
            document["summary"] = summary
            document["status"] = "completed"
            document["processed_at"] = datetime.now().isoformat()
            
            logger.info(f"Document {document_id} processed successfully")
            
        except Exception as e:
            logger.error(f"Error processing document {document_id}: {e}")
            document["status"] = "error"
            document["error_message"] = str(e)
    
    async def _extract_text(self, file_path: str) -> str:
        """Extract text from PDF file."""
        text = ""
        
        try:
            if PDF_AVAILABLE:
                # Use pdfplumber for better extraction
                with pdfplumber.open(file_path) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n\n"
            
            elif PYPDF2_AVAILABLE:
                # Fallback to PyPDF2
                reader = PdfReader(file_path)
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n\n"
            
            else:
                raise ImportError("No PDF library available")
            
        except Exception as e:
            logger.error(f"Error extracting text: {e}")
            raise
        
        return text.strip()
    
    def _detect_document_type(self, text: str) -> str:
        """Detect the type of legal document."""
        text_lower = text.lower()
        
        if "judgment" in text_lower or "order" in text_lower:
            if "supreme court" in text_lower:
                return "supreme_court_judgment"
            elif "high court" in text_lower:
                return "high_court_judgment"
            else:
                return "judgment"
        
        if "fir" in text_lower or "first information report" in text_lower:
            return "fir"
        
        if "charge sheet" in text_lower or "chargesheet" in text_lower:
            return "chargesheet"
        
        if "petition" in text_lower:
            return "petition"
        
        if "contract" in text_lower or "agreement" in text_lower:
            return "contract"
        
        if "notice" in text_lower:
            return "notice"
        
        return "legal_document"
    
    async def delete_document(self, document_id: str) -> bool:
        """Delete a document."""
        document = self.documents.get(document_id)
        
        if not document:
            return False
        
        try:
            # Delete file
            if os.path.exists(document["file_path"]):
                os.remove(document["file_path"])
            
            # Remove from store
            del self.documents[document_id]
            
            return True
        except Exception as e:
            logger.error(f"Error deleting document: {e}")
            return False


# Singleton
_document_service: Optional[DocumentService] = None


def get_document_service() -> DocumentService:
    """Get or create document service singleton."""
    global _document_service
    if _document_service is None:
        _document_service = DocumentService()
    return _document_service
