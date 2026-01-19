"""
NyayGuru AI Pro - Statute Retrieval Agent
Retrieves relevant IPC/BNS sections and handles cross-mapping.
NO MOCK DATA - Uses real database via StatuteService.
"""

from typing import List, Dict, Any, Optional
import logging

from app.agents.base import BaseAgent, AgentContext
from app.schemas import AgentType
from app.services.vector_store import VectorStoreService
from app.services.statute_service import StatuteService, get_statute_service

logger = logging.getLogger(__name__)


class StatuteRetrievalAgent(BaseAgent):
    """Agent for retrieving relevant statutes and sections from database."""
    
    def __init__(self, vector_store: Optional[VectorStoreService] = None, 
                 statute_service: Optional[StatuteService] = None):
        super().__init__()
        self.agent_type = AgentType.STATUTE
        self.name = "Statute Retrieval"
        self.name_hi = "विधि खोज"
        self.description = "Retrieves relevant IPC, BNS, and other statute sections"
        self.color = "#a855f7"
        
        self.vector_store = vector_store
        # Use provided service or get singleton
        self.statute_service = statute_service or get_statute_service()
    
    async def process(self, context: AgentContext) -> AgentContext:
        """Retrieve relevant statutes based on query from database."""
        
        # Extract sections mentioned in query
        sections = [e["value"] for e in context.entities if e["type"] == "section"]
        
        retrieved_statutes = []
        
        # 1. Direct section lookup if sections are mentioned
        if sections:
            for section in sections:
                for act_code in context.applicable_acts or ["IPC", "BNS"]:
                    statute = await self.statute_service.get_section(section, act_code)
                    if statute:
                        retrieved_statutes.append(statute)
                        logger.info(f"Retrieved {act_code} Section {section} from database")
        
        # 2. Semantic search for additional relevant statutes
        if self.vector_store:
            query = context.reformulated_query or context.query
            semantic_results = await self.vector_store.search_statutes(
                query=query,
                act_codes=context.applicable_acts,
                limit=5
            )
            
            # Add unique results
            existing_ids = {s.get("id") for s in retrieved_statutes}
            for result in semantic_results:
                if result.get("id") not in existing_ids:
                    retrieved_statutes.append(result)
        
        # 3. If no specific sections found, do keyword search in database
        if not retrieved_statutes:
            query = context.reformulated_query or context.query
            retrieved_statutes = await self.statute_service.search_statutes(
                query=query,
                act_codes=context.applicable_acts,
                limit=5
            )
            logger.info(f"Keyword search returned {len(retrieved_statutes)} results from database")
        
        # 4. Get IPC-BNS mappings for retrieved sections
        ipc_sections = [s for s in retrieved_statutes if s.get("act_code") == "IPC"]
        
        mappings = await self._get_cross_mappings(ipc_sections)
        
        # Update context
        context.statutes = retrieved_statutes
        context.ipc_bns_mappings = mappings
        
        logger.info(f"Retrieved {len(retrieved_statutes)} statutes, {len(mappings)} mappings from database")
        
        return context
    
    async def _get_cross_mappings(self, ipc_sections: List[Dict]) -> List[Dict]:
        """Get cross-mappings between IPC and BNS sections from database."""
        mappings = []
        
        for ipc in ipc_sections:
            section_num = ipc.get("section_number")
            if section_num:
                mapping = await self.statute_service.get_ipc_bns_mapping(section_num)
                if mapping:
                    # Format mapping for frontend
                    mappings.append({
                        "id": str(mapping.get("id", "")),
                        "ipc_section": mapping.get("ipc_section", ""),
                        "ipc_title": mapping.get("ipc_title", ""),
                        "ipc_content": mapping.get("ipc_content", ""),
                        "bns_section": mapping.get("bns_section", ""),
                        "bns_title": mapping.get("bns_title", ""),
                        "bns_content": mapping.get("bns_content", ""),
                        "changes": mapping.get("changes", []),
                        "punishment_change": {
                            "old": mapping.get("old_punishment", ""),
                            "new": mapping.get("new_punishment", ""),
                            "increased": mapping.get("punishment_increased", False)
                        } if mapping.get("punishment_changed") else None,
                        "mapping_type": mapping.get("mapping_type", "exact")
                    })
                    logger.info(f"Found mapping: IPC {section_num} -> BNS {mapping.get('bns_section')}")
        
        return mappings
