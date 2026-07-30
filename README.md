# 📚 RAG-Based Study Assistant

An intelligent study assistant that enables **semantic Q&A over your own PDF documents** using Retrieval-Augmented Generation (RAG). Upload any study material and ask questions in natural language — get accurate, context-aware answers instantly.

🔗 **Live Demo:** [rag-based-study-system.vercel.app](https://rag-based-study-system.vercel.app)

---

## ✨ Features

- 📄 **PDF Ingestion Pipeline** — Upload any PDF and instantly make it queryable
- 🔍 **Semantic Search** — OpenAI embeddings + ChromaDB vector store for high-accuracy retrieval
- 🧠 **MMR Retrieval** — Maximal Marginal Relevance ensures diverse, relevant context chunks
- 💬 **Multi-turn Conversations** — Persistent conversation history via ChatPromptTemplate
- 🔐 **Secure Auth** — JWT authentication + bcrypt password hashing with FastAPI
- ⚡ **REST API** — Clean, documented API endpoints for all operations

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI, Python |
| AI / RAG | LangChain, OpenAI Embeddings, ChromaDB |
| Retrieval | MMR (Maximal Marginal Relevance) |
| Auth | JWT, bcrypt |
| Frontend | React |
| Deployment | Vercel (Frontend) |

---

## 🏗️ Architecture

```
User uploads PDF
      ↓
PDF Ingestion Pipeline (LangChain)
      ↓
Text Chunking + OpenAI Embeddings
      ↓
ChromaDB Vector Store
      ↓
User asks a question
      ↓
MMR Retrieval → Relevant Chunks
      ↓
LLM generates answer with conversation history
      ↓
Response returned via FastAPI
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- OpenAI API Key

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/IshmeetSingh2022/rag-based-study-system.git
cd rag-based-study-system/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Add your OPENAI_API_KEY and JWT_SECRET to .env

# Run the server
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend/studdy-buddy-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 📁 Project Structure

```
rag-based-study-system/
├── backend/
│   ├── main.py          # FastAPI app entry point
│   ├── routes/          # API route handlers
│   ├── services/        # RAG pipeline, auth logic
│   ├── models/          # Database models
│   └── requirements.txt
├── frontend/
│   └── studdy-buddy-frontend/
│       ├── src/
│       └── package.json
└── .gitignore
```

---

## 🔑 Environment Variables

```env
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
```

---



---

## 🙋 Author

**Ishmeet Singh**
- GitHub: [@IshmeetSingh2022](https://github.com/IshmeetSingh2022)
- LinkedIn: [linkedin.com/in/ishmeet-singh-6789b8331](https://linkedin.com/in/ishmeet-singh-6789b8331)
- LeetCode: [484+ Problems Solved](https://leetcode.com/u/hmOtllAq1y/)

---

## ⭐ If you found this useful, please star the repo!
