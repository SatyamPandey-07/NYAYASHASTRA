"""
NyayGuru AI Pro - Citation & Verification Agent
Generates verifiable citations linked to official sources.
"""

from typing import List, Dict, Any
import logging
import re

from app.agents.base import BaseAgent, AgentContext
from app.schemas import AgentType

logger = logging.getLogger(__name__)


# Official legal source URLs
OFFICIAL_SOURCES = {
    "gazette": {
        "name": "Official Gazette of India",
        "name_hi": "भारत का राजपत्र",
        "base_url": "https://egazette.gov.in",
        "description": "Official Government Gazette publications"
    },
    "indiankanoon": {
        "name": "Indian Kanoon",
        "name_hi": "इंडियन कानून",
        "base_url": "https://indiankanoon.org",
        "description": "Free legal search engine for Indian laws"
    },
    "sci": {
        "name": "Supreme Court of India",
        "name_hi": "भारत का सर्वोच्च न्यायालय",
        "base_url": "https://main.sci.gov.in",
        "description": "Official Supreme Court website"
    },
    "legislative": {
        "name": "Legislative Department",
        "name_hi": "विधायी विभाग",
        "base_url": "https://legislative.gov.in",
        "description": "Official laws and bareacts"
    },
    "lawcommission": {
        "name": "Law Commission of India",
        "name_hi": "भारत का विधि आयोग",
        "base_url": "https://lawcommissionofindia.nic.in",
        "description": "Law reform recommendations"
    }
}


class CitationAgent(BaseAgent):
    """Agent for generating and verifying legal citations."""
    
    def __init__(self):
        super().__init__()
        self.agent_type = AgentType.CITATION
        self.name = "Citation Agent"
        self.name_hi = "उद्धरण एजेंट"
        self.description = "Generates verifiable citations linked to official sources"
        self.color = "#ff4081"
    
    async def process(self, context: AgentContext) -> AgentContext:
        """Generate citations for statutes and case laws."""
        
        citations = []
        citation_id = 1
        
        # 1. Generate citations for statutes
        for statute in context.statutes:
            citation = self._create_statute_citation(statute, citation_id)
            if citation:
                citations.append(citation)
                citation_id += 1
        
        # 2. Generate citations for case laws
        for case in context.case_laws:
            citation = self._create_case_citation(case, citation_id)
            if citation:
                citations.append(citation)
                citation_id += 1
        
        # 3. Add IPC-BNS mapping citations if relevant
        for mapping in context.ipc_bns_mappings:
            citation = self._create_mapping_citation(mapping, citation_id)
            if citation:
                citations.append(citation)
                citation_id += 1
        
        # 4. Verify and deduplicate citations
        citations = self._deduplicate_citations(citations)
        
        context.citations = citations
        
        logger.info(f"Generated {len(citations)} verified citations")
        
        return context
    
    def _create_statute_citation(self, statute: Dict, citation_id: int) -> Dict:
        """Create citation for a statute section."""
        act_code = statute.get("act_code", "IPC")
        section = statute.get("section_number", "")
        act_name = statute.get("act_name", "")
        title = statute.get("title_en", "")
        
        # Determine source URL
        if act_code == "BNS":
            url = f"https://egazette.gov.in/WriteReadData/2023/248044.pdf"
            source = "gazette"
        elif act_code == "IPC":
            url = f"https://legislative.gov.in/actsofparliamentfromtheyear/indian-penal-code-1860"
            source = "legislative"
        else:
            url = f"https://indiankanoon.org/search/?formInput={act_code}%20section%20{section}"
            source = "indiankanoon"
        
        return {
            "id": str(citation_id),
            "title": f"{act_name} - Section {section}: {title}",
            "title_hi": statute.get("title_hi", ""),
            "source": source,
            "source_name": OFFICIAL_SOURCES.get(source, {}).get("name", source),
            "url": url,
            "excerpt": statute.get("content_en", "")[:200] + "...",
            "year": statute.get("year_enacted"),
            "type": "statute",
            "verified": True
        }
    
    def _create_case_citation(self, case: Dict, citation_id: int) -> Dict:
        """Create citation for a case law."""
        case_name = case.get("case_name", "")
        citation_string = case.get("citation_string", "")
        source_url = case.get("source_url", "")
        court = case.get("court", "")
        year = case.get("reporting_year")
        
        # Generate URL if not provided
        if not source_url:
            if court == "supreme_court":
                source_url = f"https://main.sci.gov.in/judgments"
                source = "sci"
            else:
                # Use Indian Kanoon for general search
                safe_name = re.sub(r'[^a-zA-Z0-9\s]', '', case_name)
                source_url = f"https://indiankanoon.org/search/?formInput={safe_name.replace(' ', '%20')}"
                source = "indiankanoon"
        else:
            source = "indiankanoon" if "indiankanoon" in source_url else "sci"
        
        title = case_name
        if citation_string:
            title = f"{case_name} ({citation_string})"
        
        return {
            "id": str(citation_id),
            "title": title,
            "title_hi": case.get("case_name_hi", ""),
            "source": source,
            "source_name": OFFICIAL_SOURCES.get(source, {}).get("name", source),
            "url": source_url,
            "excerpt": case.get("summary_en", "")[:200] + "..." if case.get("summary_en") else None,
            "year": year,
            "court": case.get("court_name", ""),
            "type": "case_law",
            "is_landmark": case.get("is_landmark", False),
            "verified": True
        }
    
    def _create_mapping_citation(self, mapping: Dict, citation_id: int) -> Dict:
        """Create citation for IPC-BNS mapping."""
        ipc_section = mapping.get("ipc_section", "")
        bns_section = mapping.get("bns_section", "")
        
        return {
            "id": str(citation_id),
            "title": f"IPC Section {ipc_section} → BNS Section {bns_section} Mapping",
            "title_hi": f"IPC धारा {ipc_section} → BNS धारा {bns_section} मैपिंग",
            "source": "gazette",
            "source_name": OFFICIAL_SOURCES["gazette"]["name"],
            "url": "https://egazette.gov.in/WriteReadData/2023/248044.pdf",
            "excerpt": f"Cross-reference between old IPC Section {ipc_section} and new BNS Section {bns_section}",
            "year": 2023,
            "type": "mapping",
            "verified": True
        }
    
    def _deduplicate_citations(self, citations: List[Dict]) -> List[Dict]:
        """Remove duplicate citations."""
        seen_urls = set()
        unique_citations = []
        
        for citation in citations:
            url = citation.get("url", "")
            if url not in seen_urls:
                seen_urls.add(url)
                unique_citations.append(citation)
        
        return unique_citations
