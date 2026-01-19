"""
NyayGuru AI Pro - Documents API Routes
Handles document upload and summarization.
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import Optional

from app.schemas import DocumentUploadResponse, DocumentStatusResponse
from app.services.document_service import get_document_service

router = APIRouter(prefix="/api/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """
    Upload a legal document for AI analysis and summarization.
    Supports PDF files (court orders, judgments, FIRs, legal notices).
    """
    # Validate file type
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=400, 
            detail="Only PDF files are supported"
        )
    
    # Check file size (10MB limit)
    file_content = await file.read()
    if len(file_content) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds 10MB limit"
        )
    
    # Upload and process
    document_service = get_document_service()
    result = await document_service.upload_document(file_content, file.filename)
    
    return result


@router.get("/status/{document_id}", response_model=DocumentStatusResponse)
async def get_document_status(document_id: str):
    """Get the processing status and summary of an uploaded document."""
    document_service = get_document_service()
    status = await document_service.get_document_status(document_id)
    
    if not status:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return status


@router.delete("/{document_id}")
async def delete_document(document_id: str):
    """Delete an uploaded document."""
    document_service = get_document_service()
    success = await document_service.delete_document(document_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return {"message": "Document deleted successfully"}
