"""
NyayGuru AI Pro - Chat API Routes
Handles chat interactions and query processing.
"""

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect, Depends
from fastapi.responses import StreamingResponse
from typing import List
import json
import asyncio
from datetime import datetime
import uuid

from app.schemas import (
    ChatMessageRequest, 
    ChatMessageResponse, 
    ChatStreamChunk,
    AgentInfo,
    AgentPipelineStatus
)
from app.agents.orchestrator import get_orchestrator
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/", response_model=dict)
async def process_chat_message(
    request: ChatMessageRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Process a legal query through the multi-agent pipeline.
    Returns comprehensive legal information with citations.
    """
    orchestrator = get_orchestrator()
    
    try:
        result = await orchestrator.process_query(
            query=request.content,
            language=request.language.value,
            session_id=request.session_id
        )
        
        # Format response
        response = {
            "id": result.get("id"),
            "session_id": result.get("session_id"),
            "role": "assistant",
            "content": result.get("response", {}).get("content", ""),
            "content_hi": result.get("response", {}).get("content_hi"),
            "citations": result.get("citations", []),
            "statutes": result.get("statutes", []),
            "case_laws": result.get("case_laws", []),
            "ipc_bns_mappings": result.get("ipc_bns_mappings", []),
            "agent_pipeline": result.get("agent_pipeline", []),
            "detected_domain": result.get("detected_domain"),
            "detected_language": result.get("detected_language"),
            "execution_time_seconds": result.get("execution_time_seconds"),
            "timestamp": datetime.now().isoformat()
        }
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/stream")
async def process_chat_message_stream(request: ChatMessageRequest):
    """
    Process a legal query with streaming updates.
    Returns server-sent events for real-time UI updates.
    """
    orchestrator = get_orchestrator()
    
    async def generate():
        try:
            async for chunk in orchestrator.process_query_streaming(
                query=request.content,
                language=request.language.value,
                session_id=request.session_id
            ):
                yield f"data: {json.dumps(chunk.model_dump())}\n\n"
                await asyncio.sleep(0.01)  # Small delay for client processing
        except Exception as e:
            error_chunk = {"type": "error", "data": {"message": str(e)}}
            yield f"data: {json.dumps(error_chunk)}\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


@router.websocket("/ws/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time chat.
    Provides streaming updates for agent processing.
    """
    await websocket.accept()
    orchestrator = get_orchestrator()
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            query = message_data.get("content", "")
            language = message_data.get("language", "en")
            
            # Stream processing updates
            async for chunk in orchestrator.process_query_streaming(
                query=query,
                language=language,
                session_id=session_id
            ):
                await websocket.send_text(json.dumps(chunk.model_dump()))
            
    except WebSocketDisconnect:
        pass
    except Exception as e:
        error_msg = {"type": "error", "data": {"message": str(e)}}
        await websocket.send_text(json.dumps(error_msg))


@router.get("/agents", response_model=List[AgentInfo])
async def get_agents():
    """Get information about all available agents."""
    orchestrator = get_orchestrator()
    
    agents_info = orchestrator.get_agent_info()
    
    # Add full descriptions
    descriptions = {
        "query": {
            "description": "Analyzes queries for language, legal domain, and intent",
            "description_hi": "भाषा, कानूनी क्षेत्र और आशय के लिए प्रश्नों का विश्लेषण करता है"
        },
        "statute": {
            "description": "Retrieves relevant IPC, BNS, and other statute sections",
            "description_hi": "संबंधित IPC, BNS और अन्य विधि अनुभाग प्राप्त करता है"
        },
        "case": {
            "description": "Finds relevant Supreme Court and High Court judgments",
            "description_hi": "प्रासंगिक सर्वोच्च न्यायालय और उच्च न्यायालय के निर्णय खोजता है"
        },
        "regulatory": {
            "description": "Filters by jurisdiction and regulatory category",
            "description_hi": "क्षेत्राधिकार और नियामक श्रेणी द्वारा फ़िल्टर करता है"
        },
        "citation": {
            "description": "Generates verifiable citations to official sources",
            "description_hi": "आधिकारिक स्रोतों के लिए सत्यापित उद्धरण उत्पन्न करता है"
        },
        "summary": {
            "description": "Summarizes legal documents and extracts key information",
            "description_hi": "कानूनी दस्तावेजों का सारांश और मुख्य जानकारी निकालता है"
        },
        "response": {
            "description": "Synthesizes comprehensive legal responses",
            "description_hi": "व्यापक कानूनी प्रतिक्रियाओं का संश्लेषण करता है"
        }
    }
    
    for agent in agents_info:
        agent_id = agent.get("id", "")
        if agent_id in descriptions:
            agent.update(descriptions[agent_id])
    
    return agents_info
