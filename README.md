# graphrag-app

## Användarflöde
a. Registrera / logga in
b. Ladda upp dokument (PDF/TXT stöd kommer)
c.System chunkar, embed:ar och sparar i Neo4j
d. Chatta mot dina dokument (GraphRAG med traversering)
e. Se dokument-grafen live i frontend!

# 📚 GraphRAG App

**En komplett lokal privat stack för Retrieval-Augmented Generation (RAG) baserat på Neo4j + Ollama + FastAPI + React.**

---

## 🚀 Funktioner

- 🔒 100% lokal, ingen data lämnar din dator
- 🧠 Chunking och semantisk sökning (embeddings)
- 🔍 Graph Traversal för smart retrieval
- 🛡️ JWT-baserad autentisering (flera användare)
- 🧩 Ollama LLM-anrop (lokalt körd modell)
- 🌐 Frontend: React-app med live-graf-visualisering

---

## 🛠️ Teknikstack

| Lager        | Teknologi                  |
|--------------|-----------------------------|
| LLM          | Ollama (t.ex. Mistral)       |
| Embeddings   | Ollama Embedding API         |
| Databas      | Neo4j (Graph Database)       |
| Backend      | FastAPI                      |
| Frontend     | React + Nivo/Vis för grafen  |
| Deployment   | Docker, Docker Compose       |

---

## 🧩 Systemstruktur

```bash
graphrag-app/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── (React-koden)
│   └── Dockerfile
├── notebooks/
│   └── demo_graphrag.ipynb
├── docker-compose.yml
└── README.md

## Komma igång
1. Kloning av projektet
git clone https://github.com/dittnamn/graphrag-app.git
cd graphrag-app

2. Starta allting första gången
docker-compose up --build

3. Starta +andra gången
docker-compose up

4. Besök
* React frontend: http://localhost:3000
* FastAPI backend: http://localhost:8000/docs
* Neo4j console: http://localhost:7474 (user: neo4j / password)

5. Starta Ollama i bakgrunden
ollama run mistral

