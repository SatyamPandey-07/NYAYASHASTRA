# NyayShastra

<div align="center">

![NyayShastra](https://img.shields.io/badge/NyayGuru-AI%20Pro-blueviolet?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**🏛️ AI-Powered Legal Helper for India**

*Production-grade Multi-Agent RAG System for Indian Law*

[Live Demo](http://localhost:5173) · [API Docs](http://localhost:8000/docs) · [Report Bug](https://github.com/issues)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **Multi-Agent Intelligence** | 7 specialized AI agents working in orchestrated pipeline |
| ⚖️ **IPC ↔ BNS Mapping** | Automatic cross-referencing between old and new criminal laws |
| 🌐 **Bilingual Support** | Full English and Hindi (हिंदी) language support |
| 📚 **Verified Citations** | Links only to official government gazettes and sources |
| 📄 **Document Analysis** | Upload and summarize court orders, FIRs, and judgments |
| 🏛️ **Case Law Intelligence** | Supreme Court and High Court judgment retrieval |
| 🔍 **Semantic Search** | Vector-based retrieval for precise legal answers |
| ⚡ **Real-time Processing** | Live agent status updates with 3D visualization |

---

## 🖥️ Screenshots

### Chat Interface with Agent Pipeline
The main interface shows the multi-agent processing in real-time as your legal query is analyzed.

### 3D Agent Orchestration
Interactive 3D visualization of agents processing your query with data flow animations.

### IPC-BNS Comparison Panel
Side-by-side comparison of old IPC sections with new BNS equivalents.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.10+ (for backend)
- **npm** or **yarn**

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/your-repo/nyayguru-ai-pro.git
cd nyayguru-ai-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Start API server
python -m uvicorn app.main:app --reload --port 8000
```

### Access the Application

- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Vite)                      │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Chat   │  │  3D Agent    │  │  IPC-BNS    │  │  Document   │   │
│  │Interface │  │Visualization │  │ Comparison  │  │   Upload    │   │
│  └──────────┘  └──────────────┘  └─────────────┘  └─────────────┘   │
│                              ↓ API                                   │
├─────────────────────────────────────────────────────────────────────┤
│                         BACKEND (FastAPI)                            │
├─────────────────────────────────────────────────────────────────────┤
│                      AGENT ORCHESTRATOR                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  Query   │→ │ Statute  │→ │Case Law  │→ │Regulatory│            │
│  │Understanding│ │Retrieval │  │Intelligence│  │ Filter   │            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
│                      ↓                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                          │
│  │Citation  │→ │Summary   │→ │Response  │                          │
│  │  Agent   │  │  Agent   │  │Synthesis │                          │
│  └──────────┘  └──────────┘  └──────────┘                          │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  PostgreSQL  │  │   ChromaDB   │  │   OpenAI/    │              │
│  │   (Data)     │  │  (Vectors)   │  │  Local LLM   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 Agent Pipeline

| Agent | Purpose | Color |
|-------|---------|-------|
| **Query Understanding** | Language detection, domain classification, intent extraction | 🔵 Cyan |
| **Statute Retrieval** | Retrieves IPC/BNS sections, handles cross-mapping | 🟣 Purple |
| **Case Law Intelligence** | Finds relevant Supreme Court & High Court judgments | 🟢 Green |
| **Regulatory Filter** | Filters by jurisdiction and legal category | 🟡 Yellow |
| **Citation Agent** | Generates verifiable citations to official sources | 🔴 Pink |
| **Summarization** | Extracts key information from legal documents | 🔵 Teal |
| **Response Synthesis** | Generates comprehensive bilingual responses | 🟣 Violet |

---

## 📁 Project Structure

```
nyayguru-ai-pro/
├── src/                          # Frontend source
│   ├── components/               # React components
│   │   ├── AgentOrchestration3D.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── IPCBNSComparison.tsx
│   │   ├── DocumentUpload.tsx
│   │   └── ...
│   ├── hooks/                    # Custom React hooks
│   │   └── useApi.ts
│   ├── services/                 # API services
│   │   └── api.ts
│   └── pages/                    # Page components
│       └── Index.tsx
├── backend/                      # Python backend
│   ├── app/
│   │   ├── agents/              # AI agents
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   ├── data/                # Seed data
│   │   ├── models.py            # Database models
│   │   ├── schemas.py           # Pydantic schemas
│   │   └── main.py              # FastAPI app
│   ├── requirements.txt
│   └── .env.example
├── public/                       # Static assets
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

### Chat
```http
POST /api/chat/                  # Process legal query
POST /api/chat/stream            # Stream processing (SSE)
WS   /api/chat/ws/{session_id}   # WebSocket chat
GET  /api/chat/agents            # Get agent info
```

### Statutes
```http
GET  /api/statutes/              # List statutes
GET  /api/statutes/search        # Search statutes
GET  /api/statutes/section/{id}  # Get section
GET  /api/statutes/comparison    # IPC-BNS comparison
```

### Documents
```http
POST /api/documents/upload       # Upload PDF
GET  /api/documents/status/{id}  # Processing status
DELETE /api/documents/{id}       # Delete document
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Three.js / React Three Fiber** - 3D visualization
- **Framer Motion** - Animations
- **shadcn/ui** - UI components

### Backend
- **FastAPI** - API framework
- **SQLAlchemy** - ORM
- **ChromaDB** - Vector database
- **LangChain** - LLM orchestration
- **Sentence Transformers** - Embeddings
- **OpenAI** - LLM (optional)

---

## 🌐 Environment Variables

Create `.env` files in both root and `backend/` directories:

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

### Backend (.env)
```env
# API
API_HOST=0.0.0.0
API_PORT=8000
API_DEBUG=true

# Database
DATABASE_URL=sqlite:///./nyayguru.db

# Vector Store
CHROMA_PERSIST_DIR=./chroma_db
EMBEDDING_MODEL=sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2

# LLM (optional)
OPENAI_API_KEY=your_key_here

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 📚 Legal Coverage

### Currently Supported
- ✅ Indian Penal Code (IPC), 1860
- ✅ Bhartiya Nyaya Sanhita (BNS), 2023
- ✅ IPC to BNS Cross-Mapping
- ✅ Supreme Court Landmark Cases
- ✅ High Court Judgments

### Coming Soon
- 🔜 Criminal Procedure Code (CrPC)
- 🔜 Bhartiya Nagarik Suraksha Sanhita (BNSS)
- 🔜 Indian Evidence Act (IEA)
- 🔜 Bhartiya Sakshya Adhiniyam (BSA)
- 🔜 Constitutional Law
- 🔜 Consumer Protection Act

---

## ⚠️ Disclaimer

> **This software is for informational and educational purposes only.**
> 
> It does not constitute legal advice and should not be relied upon as such. For specific legal matters, please consult a qualified legal professional.

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for Indian Legal Community**

*Nyayshastra*

</div>
