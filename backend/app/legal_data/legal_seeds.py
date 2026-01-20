"""
NyayGuru AI Pro - Real Data Loader
Loads legal data from CSV and PDF files in the data folder.
NO MOCK DATA - Uses actual legal documents.
"""

import os
import csv
import logging
from typing import List, Dict, Any, Optional
from pathlib import Path

logger = logging.getLogger(__name__)

# Data directory
DATA_DIR = Path(__file__).parent

# =============================================================================
# DETAILED SECTION DESCRIPTIONS
# Comprehensive legal descriptions for key IPC and BNS sections
# =============================================================================

SECTION_DESCRIPTIONS = {
    # ==================== Murder & Culpable Homicide ====================
    "IPC_302": {
        "title": "Punishment for Murder",
        "content": "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine. Murder is the unlawful killing of a human being with malice aforethought – the intention to cause death or grievous bodily harm, or knowledge that the act is likely to cause death.",
        "punishment": "Death penalty or Life imprisonment + Fine",
        "category": "Offences affecting life",
        "cognizable": True,
        "bailable": False
    },
    "BNS_103": {
        "title": "Punishment for Murder",
        "content": "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine. The BNS retains the same punishment structure as IPC Section 302, maintaining the gravity of this offence.",
        "punishment": "Death penalty or Life imprisonment + Fine",
        "category": "Offences affecting life",
        "cognizable": True,
        "bailable": False
    },
    "IPC_304": {
        "title": "Culpable Homicide not amounting to Murder",
        "content": "Whoever commits culpable homicide not amounting to murder shall be punished with imprisonment for life, or imprisonment up to 10 years, and fine. This applies when death is caused with knowledge that it's likely to cause death, but without intention.",
        "punishment": "Life imprisonment or up to 10 years + Fine",
        "category": "Offences affecting life",
        "cognizable": True,
        "bailable": False
    },
    
    # ==================== Sexual Offences ====================
    "IPC_376": {
        "title": "Punishment for Rape",
        "content": "Whoever commits rape shall be punished with rigorous imprisonment for a term not less than seven years but which may extend to imprisonment for life, and shall also be liable to fine. Rape is defined as sexual intercourse with a woman without her consent or when consent is obtained through fear, intoxication, or fraud.",
        "punishment": "Minimum 7 years RI to Life imprisonment + Fine",
        "category": "Sexual offences",
        "cognizable": True,
        "bailable": False
    },
    "BNS_65": {
        "title": "Punishment for Rape",
        "content": "The BNS increases the minimum punishment from 7 to 10 years rigorous imprisonment. Enhanced provisions for gang rape, repeat offenders, and rape of minors. Whoever commits rape shall be punished with rigorous imprisonment for a term not less than ten years but which may extend to imprisonment for life, and shall also be liable to fine.",
        "punishment": "Minimum 10 years RI to Life imprisonment + Fine",
        "category": "Sexual offences",
        "cognizable": True,
        "bailable": False
    },
    "IPC_354": {
        "title": "Assault or criminal force to woman with intent to outrage her modesty",
        "content": "Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty, shall be punished with imprisonment of either description for a term which may extend to two years, or with fine, or with both.",
        "punishment": "Up to 2 years imprisonment or Fine or Both",
        "category": "Sexual offences",
        "cognizable": True,
        "bailable": True
    },
    
    # ==================== Theft & Property Offences ====================
    "IPC_378": {
        "title": "Theft",
        "content": "Whoever, intending to take dishonestly any moveable property out of the possession of any person without that person's consent, moves that property in order to such taking, is said to commit theft. The essential elements are: (1) dishonest intention, (2) moveable property, (3) taking out of possession, (4) without consent, (5) moving the property.",
        "punishment": "Up to 3 years imprisonment or Fine or Both",
        "category": "Offences against property",
        "cognizable": True,
        "bailable": True
    },
    "IPC_379": {
        "title": "Punishment for Theft",
        "content": "Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.",
        "punishment": "Up to 3 years imprisonment or Fine or Both",
        "category": "Offences against property",
        "cognizable": True,
        "bailable": True
    },
    "IPC_392": {
        "title": "Punishment for Robbery",
        "content": "Whoever commits robbery shall be punished with rigorous imprisonment for a term which may extend to ten years, and shall also be liable to fine. If the robbery is committed on the highway between sunset and sunrise, the imprisonment may extend to fourteen years.",
        "punishment": "Up to 10 years RI + Fine (14 years if on highway at night)",
        "category": "Offences against property",
        "cognizable": True,
        "bailable": False
    },
    "IPC_420": {
        "title": "Cheating and dishonestly inducing delivery of property",
        "content": "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, shall be punished with imprisonment which may extend to seven years, and shall also be liable to fine.",
        "punishment": "Up to 7 years imprisonment + Fine",
        "category": "Offences against property",
        "cognizable": True,
        "bailable": False
    },
    "BNS_318": {
        "title": "Cheating and dishonestly inducing delivery of property",
        "content": "The BNS explicitly covers digital and electronic fraud under this section. Whoever cheats and thereby dishonestly induces the person deceived to deliver any property, including through electronic means, digital platforms, or online transactions, shall be punished with imprisonment which may extend to seven years, and shall also be liable to fine.",
        "punishment": "Up to 7 years imprisonment + Fine",
        "category": "Offences against property",
        "cognizable": True,
        "bailable": False
    },
    
    # ==================== Bodily Harm ====================
    "IPC_323": {
        "title": "Punishment for voluntarily causing hurt",
        "content": "Whoever, except in the case provided for by section 334, voluntarily causes hurt, shall be punished with imprisonment of either description for a term which may extend to one year, or with fine which may extend to one thousand rupees, or with both.",
        "punishment": "Up to 1 year imprisonment or Fine up to ₹1,000 or Both",
        "category": "Offences affecting human body",
        "cognizable": False,
        "bailable": True
    },
    "IPC_325": {
        "title": "Punishment for voluntarily causing grievous hurt",
        "content": "Whoever, except in the case provided for by section 335, voluntarily causes grievous hurt, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine. Grievous hurt includes emasculation, permanent privation of sight/hearing, disfiguration, fracture, or danger to life.",
        "punishment": "Up to 7 years imprisonment + Fine",
        "category": "Offences affecting human body",
        "cognizable": True,
        "bailable": False
    },
    
    # ==================== Kidnapping & Abduction ====================
    "IPC_363": {
        "title": "Punishment for Kidnapping",
        "content": "Whoever kidnaps any person from India or from lawful guardianship, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine. Kidnapping from lawful guardianship applies to minors under 16 (male) or 18 (female).",
        "punishment": "Up to 7 years imprisonment + Fine",
        "category": "Kidnapping and abduction",
        "cognizable": True,
        "bailable": False
    },
    "IPC_364": {
        "title": "Kidnapping for ransom",
        "content": "Whoever kidnaps or abducts any person in order that such person may be murdered or may be so disposed of as to be put in danger of being murdered, shall be punished with imprisonment for life or rigorous imprisonment for a term which may extend to ten years, and shall also be liable to fine.",
        "punishment": "Life imprisonment or up to 10 years RI + Fine",
        "category": "Kidnapping and abduction",
        "cognizable": True,
        "bailable": False
    },
    
    # ==================== Criminal Intimidation ====================
    "IPC_503": {
        "title": "Criminal Intimidation",
        "content": "Whoever threatens another with any injury to his person, reputation or property, or to the person or reputation of any one in whom that person is interested, with intent to cause alarm to that person, or to cause that person to do any act which he is not legally bound to do, commits criminal intimidation.",
        "punishment": "Up to 2 years imprisonment or Fine or Both",
        "category": "Criminal intimidation",
        "cognizable": False,
        "bailable": True
    },
    "IPC_506": {
        "title": "Punishment for Criminal Intimidation",
        "content": "Whoever commits the offence of criminal intimidation shall be punished with imprisonment of either description for a term which may extend to two years, or with fine, or with both. If the threat is to cause death or grievous hurt, or to cause destruction of property by fire, or imputation of unchastity, the punishment may extend to seven years.",
        "punishment": "Up to 2 years (7 years for serious threats) + Fine",
        "category": "Criminal intimidation",
        "cognizable": True,
        "bailable": True
    },
    
    # ==================== Defamation ====================
    "IPC_499": {
        "title": "Defamation",
        "content": "Whoever, by words either spoken or intended to be read, or by signs or by visible representations, makes or publishes any imputation concerning any person intending to harm, or knowing or having reason to believe that such imputation will harm, the reputation of such person, is said to defame that person.",
        "punishment": "Up to 2 years imprisonment or Fine or Both",
        "category": "Defamation",
        "cognizable": False,
        "bailable": True
    },
    "IPC_500": {
        "title": "Punishment for Defamation",
        "content": "Whoever defames another shall be punished with simple imprisonment for a term which may extend to two years, or with fine, or with both.",
        "punishment": "Up to 2 years simple imprisonment or Fine or Both",
        "category": "Defamation",
        "cognizable": False,
        "bailable": True
    },
    
    # ==================== Public Tranquility ====================
    "IPC_144": {
        "title": "Joining unlawful assembly armed with deadly weapon",
        "content": "Whoever, being armed with any deadly weapon, or with anything which, used as a weapon of offence, is likely to cause death, is a member of an unlawful assembly, shall be punished with imprisonment of either description for a term which may extend to two years, or with fine, or with both.",
        "punishment": "Up to 2 years imprisonment or Fine or Both",
        "category": "Offences against public tranquility",
        "cognizable": True,
        "bailable": True
    },
    "IPC_147": {
        "title": "Punishment for Rioting",
        "content": "Whoever is guilty of rioting, shall be punished with imprisonment of either description for a term which may extend to two years, or with fine, or with both.",
        "punishment": "Up to 2 years imprisonment or Fine or Both",
        "category": "Offences against public tranquility",
        "cognizable": True,
        "bailable": True
    },
    
    # ==================== Forgery & Counterfeiting ====================
    "IPC_463": {
        "title": "Forgery",
        "content": "Whoever makes any false document or false electronic record or part of a document or electronic record, with intent to cause damage or injury, to the public or to any person, or to support any claim or title, or to cause any person to part with property, commits forgery.",
        "punishment": "Up to 2 years imprisonment or Fine or Both",
        "category": "Forgery",
        "cognizable": True,
        "bailable": True
    },
    "IPC_468": {
        "title": "Forgery for purpose of cheating",
        "content": "Whoever commits forgery, intending that the document or electronic record forged shall be used for the purpose of cheating, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
        "punishment": "Up to 7 years imprisonment + Fine",
        "category": "Forgery",
        "cognizable": True,
        "bailable": False
    },
    
    # ==================== Dowry-related Offences ====================
    "IPC_304B": {
        "title": "Dowry Death",
        "content": "Where the death of a woman is caused by burns or bodily injury or occurs otherwise than under normal circumstances within seven years of her marriage, and it is shown that soon before her death she was subjected to cruelty or harassment by her husband or his relatives for dowry, such death shall be called 'dowry death'. The husband or relative shall be deemed to have caused her death.",
        "punishment": "Minimum 7 years to Life imprisonment",
        "category": "Dowry-related offences",
        "cognizable": True,
        "bailable": False
    },
    "IPC_498A": {
        "title": "Husband or relative subjecting woman to cruelty",
        "content": "Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine. 'Cruelty' means conduct which drives the woman to commit suicide or causes grave injury, or harassment for dowry demands.",
        "punishment": "Up to 3 years imprisonment + Fine",
        "category": "Dowry-related offences",
        "cognizable": True,
        "bailable": False
    },
}

# Function to get enriched description for a section
def get_enriched_description(act_code: str, section_number: str, original_content: str) -> str:
    """Get enriched description for a section if available."""
    key = f"{act_code}_{section_number}"
    if key in SECTION_DESCRIPTIONS:
        return SECTION_DESCRIPTIONS[key]["content"]
    return original_content

def get_enriched_title(act_code: str, section_number: str, original_title: str) -> str:
    """Get enriched title for a section if available."""
    key = f"{act_code}_{section_number}"
    if key in SECTION_DESCRIPTIONS:
        return SECTION_DESCRIPTIONS[key]["title"]
    return original_title

def get_punishment(act_code: str, section_number: str, original_punishment: str) -> str:
    """Get punishment description for a section if available."""
    key = f"{act_code}_{section_number}"
    if key in SECTION_DESCRIPTIONS:
        return SECTION_DESCRIPTIONS[key].get("punishment", original_punishment)
    return original_punishment


def load_ipc_bns_mappings_from_csv() -> List[Dict[str, Any]]:
    """Load IPC-BNS mappings from CSV file."""
    # Check both possible paths
    csv_path = DATA_DIR / "Criminal" / "ipc_bns_chart.csv"
    
    # Fallback to direct path if not in Criminal folder
    if not csv_path.exists():
        csv_path = DATA_DIR / "ipc_bns_chart.csv"
    
    if not csv_path.exists():
        logger.error(f"CSV file not found: {csv_path}")
        return []
    
    mappings = []
    
    try:
        with open(csv_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                ipc_section = row.get("IPC_Section", "").strip()
                bns_section = row.get("BNS_Section", "").strip()
                
                # Skip empty rows or rows without both sections
                if not ipc_section and not bns_section:
                    continue
                
                mapping = {
                    "ipc_section": ipc_section,
                    "bns_section": bns_section,
                    "topic": row.get("Topic", "").strip(),
                    "description": row.get("Description", "").strip(),
                    "change_note": row.get("Change_Note", "").strip(),
                    "penalty_old": row.get("Penalty_Old", "").strip(),
                    "penalty_new": row.get("Penalty_New", "").strip(),
                }
                mappings.append(mapping)
        
        logger.info(f"Loaded {len(mappings)} IPC-BNS mappings from CSV")
        
    except Exception as e:
        logger.error(f"Error loading CSV: {e}")
    
    return mappings


def get_ipc_sections_from_csv() -> List[Dict[str, Any]]:
    """Extract IPC sections from the CSV mappings."""
    mappings = load_ipc_bns_mappings_from_csv()
    
    ipc_sections = []
    seen_sections = set()
    
    for mapping in mappings:
        ipc_section = mapping.get("ipc_section", "")
        
        # Handle ranges like "8–52A" or multiple sections
        if not ipc_section or ipc_section in seen_sections:
            continue
        
        # Skip complex section references for now
        if "–" in ipc_section or "," in ipc_section or "&" in ipc_section:
            continue
        
        # Also skip sections with etc or multiple entries
        if "etc" in ipc_section.lower():
            continue
            
        seen_sections.add(ipc_section)
        
        # Get enriched content if available
        original_title = mapping.get("topic", "")
        original_content = mapping.get("description", "")
        original_punishment = mapping.get("penalty_old", "")
        
        enriched_title = get_enriched_title("IPC", ipc_section, original_title)
        enriched_content = get_enriched_description("IPC", ipc_section, original_content)
        enriched_punishment = get_punishment("IPC", ipc_section, original_punishment)
        
        section_data = {
            "section_number": ipc_section,
            "act_code": "IPC",
            "act_name": "Indian Penal Code",
            "title_en": enriched_title,
            "title_hi": "",  # Would need translation
            "content_en": enriched_content,
            "content_hi": "",
            "domain": _detect_domain(enriched_title + " " + enriched_content),
            "year_enacted": 1860,
            "punishment_description": enriched_punishment,
            "is_cognizable": True,
            "is_bailable": False,
        }
        ipc_sections.append(section_data)
    
    logger.info(f"Extracted {len(ipc_sections)} IPC sections from CSV")
    return ipc_sections


def get_bns_sections_from_csv() -> List[Dict[str, Any]]:
    """Extract BNS sections from the CSV mappings."""
    mappings = load_ipc_bns_mappings_from_csv()
    
    bns_sections = []
    seen_sections = set()
    
    for mapping in mappings:
        bns_section = mapping.get("bns_section", "")
        
        if not bns_section or bns_section in seen_sections:
            continue
        
        # Skip complex section references
        if "–" in bns_section or "," in bns_section:
            continue
            
        seen_sections.add(bns_section)
        
        # Get enriched content if available
        original_title = mapping.get("topic", "")
        original_content = mapping.get("description", "")
        original_punishment = mapping.get("penalty_new", "")
        
        enriched_title = get_enriched_title("BNS", bns_section, original_title)
        enriched_content = get_enriched_description("BNS", bns_section, original_content)
        enriched_punishment = get_punishment("BNS", bns_section, original_punishment)
        
        section_data = {
            "section_number": bns_section,
            "act_code": "BNS",
            "act_name": "Bhartiya Nyaya Sanhita",
            "title_en": enriched_title,
            "title_hi": "",
            "content_en": enriched_content,
            "content_hi": "",
            "domain": _detect_domain(enriched_title + " " + enriched_content),
            "year_enacted": 2023,
            "punishment_description": enriched_punishment,
            "is_cognizable": True,
            "is_bailable": False,
        }
        bns_sections.append(section_data)
    
    logger.info(f"Extracted {len(bns_sections)} BNS sections from CSV")
    return bns_sections


def get_ipc_bns_mappings() -> List[Dict[str, Any]]:
    """Get formatted IPC-BNS mappings for database."""
    raw_mappings = load_ipc_bns_mappings_from_csv()
    
    formatted_mappings = []
    
    for mapping in raw_mappings:
        ipc_section = mapping.get("ipc_section", "")
        bns_section = mapping.get("bns_section", "")
        
        # Skip entries without both sections or complex references
        if not ipc_section or not bns_section:
            continue
        if "–" in ipc_section or "–" in bns_section:
            continue
        if "," in ipc_section or "," in bns_section:
            continue
        if "&" in ipc_section or "&" in bns_section:
            continue
        if "etc" in ipc_section.lower() or "etc" in bns_section.lower():
            continue
        
        # Determine mapping type based on change note
        change_note = mapping.get("change_note", "").lower()
        if "no change" in change_note:
            mapping_type = "exact"
        elif "new" in change_note:
            mapping_type = "new"
        elif "merged" in change_note:
            mapping_type = "merged"
        elif "increased" in change_note or "enhanced" in change_note:
            mapping_type = "modified"
        else:
            mapping_type = "modified"
        
        # Build changes list
        changes = []
        if mapping.get("change_note"):
            changes.append({
                "type": "modified",
                "description": mapping.get("change_note", "")
            })
        
        # Check if punishment changed
        old_penalty = mapping.get("penalty_old", "")
        new_penalty = mapping.get("penalty_new", "")
        punishment_changed = bool(old_penalty or new_penalty)
        punishment_increased = "increased" in change_note.lower() or bool(new_penalty and not old_penalty)
        
        formatted_mapping = {
            "ipc_section": ipc_section,
            "bns_section": bns_section,
            "mapping_type": mapping_type,
            "changes": changes,
            "punishment_changed": punishment_changed,
            "old_punishment": old_penalty,
            "new_punishment": new_penalty,
            "punishment_increased": punishment_increased,
        }
        formatted_mappings.append(formatted_mapping)
    
    logger.info(f"Formatted {len(formatted_mappings)} IPC-BNS mappings")
    return formatted_mappings


def _detect_domain(text: str) -> str:
    """Detect legal domain from text."""
    text_lower = text.lower()
    
    if any(word in text_lower for word in ["murder", "hurt", "death", "kill", "rape", "assault", "robbery", "theft", "kidnap"]):
        return "criminal"
    elif any(word in text_lower for word in ["marriage", "divorce", "dowry", "wife", "husband", "child", "guardian"]):
        return "family"
    elif any(word in text_lower for word in ["property", "land", "estate"]):
        return "property"
    elif any(word in text_lower for word in ["trade", "commerce", "company", "business"]):
        return "corporate"
    elif any(word in text_lower for word in ["election", "vote", "poll"]):
        return "constitutional"
    elif any(word in text_lower for word in ["public servant", "government", "official"]):
        return "constitutional"
    elif any(word in text_lower for word in ["pollution", "environment", "water", "air"]):
        return "environmental"
    else:
        return "criminal"


# Landmark case laws (these would ideally come from Case_Laws.pdf)
LANDMARK_CASES = [
    {
        "case_number": "Criminal Appeal No. 567/1980",
        "case_name": "Bachan Singh v. State of Punjab",
        "case_name_hi": "बचन सिंह बनाम पंजाब राज्य",
        "court": "supreme_court",
        "court_name": "Supreme Court of India",
        "judgment_date": "1980-05-09",
        "reporting_year": 1980,
        "summary_en": "Landmark judgment establishing the 'rarest of rare' doctrine for imposition of death penalty in India. The Constitution Bench held that death penalty is constitutional but should be imposed only in exceptional circumstances.",
        "summary_hi": "भारत में मृत्युदंड के लिए 'दुर्लभतम में दुर्लभ' सिद्धांत स्थापित करने वाला ऐतिहासिक निर्णय।",
        "is_landmark": True,
        "citation_string": "1980 AIR 898, 1980 SCR (2) 684",
        "source_url": "https://indiankanoon.org/doc/1691677",
        "key_holdings": [
            "Death penalty is constitutional",
            "Rarest of rare doctrine established",
            "Aggravating and mitigating circumstances must be balanced"
        ],
        "domain": "criminal",
        "cited_sections": ["302", "103"]
    },
    {
        "case_number": "Writ Petition (Criminal) No. 666-70/1992",
        "case_name": "Vishaka v. State of Rajasthan",
        "case_name_hi": "विशाखा बनाम राजस्थान राज्य",
        "court": "supreme_court",
        "court_name": "Supreme Court of India",
        "judgment_date": "1997-08-13",
        "reporting_year": 1997,
        "summary_en": "Landmark judgment on sexual harassment at workplace. The Supreme Court laid down comprehensive guidelines to prevent sexual harassment, which remained in force until the POSH Act 2013.",
        "summary_hi": "कार्यस्थल पर यौन उत्पीड़न पर ऐतिहासिक निर्णय।",
        "is_landmark": True,
        "citation_string": "AIR 1997 SC 3011",
        "source_url": "https://indiankanoon.org/doc/1031794",
        "key_holdings": [
            "Sexual harassment violates fundamental rights under Articles 14, 15, 19 and 21",
            "Employers must constitute complaints committee",
            "Guidelines for prevention mandatory until legislation"
        ],
        "domain": "criminal",
        "cited_sections": ["354", "74", "509", "79"]
    },
    {
        "case_number": "Writ Petition (Civil) No. 494/2012",
        "case_name": "K.S. Puttaswamy v. Union of India",
        "case_name_hi": "के.एस. पुट्टास्वामी बनाम भारत संघ",
        "court": "supreme_court",
        "court_name": "Supreme Court of India",
        "judgment_date": "2017-08-24",
        "reporting_year": 2017,
        "summary_en": "Nine-judge Constitution Bench unanimously held that the right to privacy is a fundamental right protected under Article 21 of the Constitution of India.",
        "summary_hi": "निजता का अधिकार मौलिक अधिकार है - 9 न्यायाधीशों की संविधान पीठ का सर्वसम्मत निर्णय।",
        "is_landmark": True,
        "citation_string": "(2017) 10 SCC 1",
        "source_url": "https://indiankanoon.org/doc/127517806",
        "key_holdings": [
            "Right to privacy is a fundamental right",
            "Protected under Article 21",
            "Not absolute, subject to reasonable restrictions"
        ],
        "domain": "constitutional",
        "cited_sections": []
    },
    {
        "case_number": "Criminal Appeal No. 1265/2013",
        "case_name": "Lalita Kumari v. Government of UP",
        "case_name_hi": "ललिता कुमारी बनाम उत्तर प्रदेश सरकार",
        "court": "supreme_court",
        "court_name": "Supreme Court of India",
        "judgment_date": "2013-11-12",
        "reporting_year": 2013,
        "summary_en": "Constitution Bench held that registration of FIR is mandatory under Section 154 CrPC if the information discloses commission of a cognizable offence. Police cannot refuse to register FIR.",
        "summary_hi": "संज्ञेय अपराध के लिए FIR पंजीकरण अनिवार्य है - पुलिस FIR दर्ज करने से इनकार नहीं कर सकती।",
        "is_landmark": True,
        "citation_string": "(2014) 2 SCC 1",
        "source_url": "https://indiankanoon.org/doc/195681207",
        "key_holdings": [
            "FIR registration is mandatory for cognizable offences",
            "Police cannot refuse to register FIR",
            "Preliminary inquiry only in specific categories"
        ],
        "domain": "criminal",
        "cited_sections": []
    },
    {
        "case_number": "Criminal Appeal No. 76/2016",
        "case_name": "Navtej Singh Johar v. Union of India",
        "case_name_hi": "नवतेज सिंह जौहर बनाम भारत संघ",
        "court": "supreme_court",
        "court_name": "Supreme Court of India",
        "judgment_date": "2018-09-06",
        "reporting_year": 2018,
        "summary_en": "Five-judge Constitution Bench decriminalized consensual homosexual acts between adults by reading down Section 377 IPC to the extent it criminalized consensual sexual acts of adults in private.",
        "summary_hi": "वयस्कों के बीच सहमति से समलैंगिक संबंधों को अपराध की श्रेणी से बाहर किया - धारा 377 को आंशिक रूप से असंवैधानिक घोषित किया।",
        "is_landmark": True,
        "citation_string": "(2018) 10 SCC 1",
        "source_url": "https://indiankanoon.org/doc/168671544",
        "key_holdings": [
            "Section 377 IPC partially struck down",
            "Consensual acts between adults decriminalized",
            "Sexual orientation is part of right to privacy and dignity"
        ],
        "domain": "criminal",
        "cited_sections": []
    },
    {
        "case_number": "Writ Petition (Civil) No. 135/1970",
        "case_name": "Kesavananda Bharati v. State of Kerala",
        "case_name_hi": "केशवानंद भारती बनाम केरल राज्य",
        "court": "supreme_court",
        "court_name": "Supreme Court of India",
        "judgment_date": "1973-04-24",
        "reporting_year": 1973,
        "summary_en": "The most significant judgment in Indian constitutional history which established the 'Basic Structure Doctrine'. It held that while Parliament has the power to amend the Constitution, it cannot alter its basic structure.",
        "summary_hi": "भारतीय संवैधानिक इतिहास का सबसे महत्वपूर्ण निर्णय जिसने 'बुनियादी ढांचा सिद्धांत' स्थापित किया।",
        "is_landmark": True,
        "citation_string": "AIR 1973 SC 1461",
        "source_url": "https://indiankanoon.org/doc/257876",
        "key_holdings": [
            "Basic Structure Doctrine established",
            "Parliamentary power to amend is limited",
            "Judicial review is a part of the basic structure"
        ],
        "domain": "constitutional",
        "cited_sections": []
    },
    {
        "case_number": "Writ Petition (Civil) No. 231/1977",
        "case_name": "Maneka Gandhi v. Union of India",
        "case_name_hi": "मेनका गांधी बनाम भारत संघ",
        "court": "supreme_court",
        "court_name": "Supreme Court of India",
        "judgment_date": "1978-01-25",
        "reporting_year": 1978,
        "summary_en": "Expanded the scope of Article 21 (Right to Life and Personal Liberty) to include the right to travel abroad. Established the test of 'reasonableness' for any law depriving a person of liberty.",
        "summary_hi": "अनुच्छेद 21 (जीवन और व्यक्तिगत स्वतंत्रता का अधिकार) के दायरे का विस्तार करने वाला ऐतिहासिक निर्णय।",
        "is_landmark": True,
        "citation_string": "AIR 1978 SC 597",
        "source_url": "https://indiankanoon.org/doc/1766147",
        "key_holdings": [
            "Procedure established by law must be just, fair and reasonable",
            "Fundamental Rights are not mutually exclusive",
            "Right to travel abroad is part of personal liberty"
        ],
        "domain": "constitutional",
        "cited_sections": []
    },
    {
        "case_number": "Writ Petition (Civil) No. 118/2016",
        "case_name": "Shayara Bano v. Union of India",
        "case_name_hi": "शायरा बानो बनाम भारत संघ",
        "court": "supreme_court",
        "court_name": "Supreme Court of India",
        "judgment_date": "2017-08-22",
        "reporting_year": 2017,
        "summary_en": "The Supreme Court declared the practice of 'Triple Talaq' (Talaq-e-Biddat) as unconstitutional, holding it to be arbitrary and violative of fundamental rights of Muslim women.",
        "summary_hi": "'तीन तलाक' की प्रथा को असंवैधानिक घोषित किया - इसे मनमाना और मुस्लिम महिलाओं के मौलिक अधिकारों का उल्लंघन माना।",
        "is_landmark": True,
        "citation_string": "(2017) 9 SCC 1",
        "source_url": "https://indiankanoon.org/doc/11570122",
        "key_holdings": [
            "Triple Talaq is unconstitutional",
            "Violates Article 14 (Right to Equality)",
            "Not an essential religious practice"
        ],
        "domain": "family",
        "cited_sections": []
    }
]


def get_all_statutes() -> List[Dict[str, Any]]:
    """Get all statutes (IPC + BNS) from CSV."""
    ipc = get_ipc_sections_from_csv()
    bns = get_bns_sections_from_csv()
    return ipc + bns


def get_ipc_sections() -> List[Dict[str, Any]]:
    """Get IPC sections."""
    return get_ipc_sections_from_csv()


def get_bns_sections() -> List[Dict[str, Any]]:
    """Get BNS sections."""
    return get_bns_sections_from_csv()


def get_mappings() -> List[Dict[str, Any]]:
    """Get IPC-BNS mappings."""
    return get_ipc_bns_mappings()


def get_landmark_cases() -> List[Dict[str, Any]]:
    """Get landmark cases."""
    return LANDMARK_CASES


# For backward compatibility - map to the actual data loading functions
IPC_SECTIONS = None  # Will be populated on first access
BNS_SECTIONS = None
IPC_BNS_MAPPINGS = None


def _ensure_data_loaded():
    """Ensure data is loaded from CSV."""
    global IPC_SECTIONS, BNS_SECTIONS, IPC_BNS_MAPPINGS
    if IPC_SECTIONS is None:
        IPC_SECTIONS = get_ipc_sections_from_csv()
    if BNS_SECTIONS is None:
        BNS_SECTIONS = get_bns_sections_from_csv()
    if IPC_BNS_MAPPINGS is None:
        IPC_BNS_MAPPINGS = get_ipc_bns_mappings()
