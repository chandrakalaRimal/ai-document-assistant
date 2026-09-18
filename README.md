# AI Document Assistant

A RAG-powered PDF question-answering application built with React, TypeScript, Tailwind CSS, ASP.NET Core, Qdrant, and Groq.

## Features

- Upload PDF documents
- Extract and chunk document text
- Generate local embeddings
- Store vectors in Qdrant
- Semantic document search
- AI-generated answers using Groq
- Source filename and page references
- Responsive chat interface

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- ASP.NET Core
- C#

### AI / RAG
- Groq
- Qdrant
- Local Embeddings
- PdfPig

## Architecture

PDF Upload
→ Text Extraction
→ Chunking
→ Embeddings
→ Qdrant
→ Similarity Search
→ Groq
→ Answer + Sources

## Project Structure

- `frontend/` - React application
- `backend/` - ASP.NET Core API

## Running Locally

### Qdrant

Run Qdrant using Docker:

```bash
docker run -d \
  --name smartlife-qdrant \
  -p 6333:6333 \
  -p 6334:6334 \
  -v smartlife_qdrant_data:/qdrant/storage \
  qdrant/qdrant
