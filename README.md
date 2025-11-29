# Knowledge Base Agent (RAG) – Internship Challenge


An end-to-end Retrieval-Augmented Generation (RAG) agent: ingest documents → build embeddings → retrieve → generate grounded answers with citations. Includes FastAPI backend, React UI, local Chroma vector store, evaluation harness, and dockerized dev.


## Quickstart


```bash
# 0) clone & env
cp .env.example .env


# 1) backend
python -m venv .venv && source .venv/bin/activate
pip install -r backend/requirements.txt


# 2) frontend
npm --prefix web install


# 3) ingest sample docs
bash scripts/ingest_local.sh


# 4) run
uvicorn backend.app:app --reload
npm --prefix web run dev