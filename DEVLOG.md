# 📋 Development Log — Qanoon AI

**Project:** Qanoon AI — Qanoon Sabke Liye Hai   
**Built with:** Kiro · React.js · Firebase · Grok API · Gemini 2.5  
**Timeline:** May 2026

---

## Week 1 — Foundation & Architecture

### Project Setup
- Initialized React.js project with Vite for fast builds
- Configured Tailwind CSS for mobile-first responsive design
- Set up Firebase project (Auth, Firestore, Hosting)
- Designed system architecture with agentic workflow pattern

### Core Infrastructure
- Implemented Firebase Authentication (email/password)
- Created Firestore schema for users, chat history, and law vectors
- Built routing structure with React Router
- Designed bilingual UI (Urdu + English) with language context

---

## Week 2 — AI Integration & RAG Pipeline

### AskLex Chatbot
- Integrated Grok API for intelligent legal reasoning
- Built conversation memory with context-aware follow-ups
- Implemented auto-language detection (Urdu/English)
- Created structured response format (Law → Explanation → Steps → Penalty)

### RAG Pipeline
- Ingested Pakistani law books (PPC 1860, DVA 2012, PECA 2016, Family Laws, Labour Laws)
- Generated vector embeddings using Google text-embedding-004
- Built browser-side semantic search with Xenova/transformers (WASM)
- Pre-computed 295 law chunks stored in vector_store.json for zero-cost retrieval

### Agentic Workflow
- Orchestrator Agent — routes user queries to appropriate handler
- Legal Agent — performs RAG search over law database
- Search Agent — Google Custom Search fallback
- Lawyer Agent — finds nearby lawyers via Places API
- History Agent — manages chat sessions in Firestore

---

## Week 3 — Features & User Experience

### Document Generation
- Built FIR Draft generator with proper Pakistani legal format
- Built Complaint Letter generator with authority routing
- Integrated jsPDF for downloadable PDF output
- Added offline template fallback for resilience

### Find a Lawyer
- Integrated Google Maps & Places API
- Filter by specialization (Family, Criminal, Cyber, Labour, Property)
- Shows name, phone, address, rating, and map pin
- One-tap call functionality

### Voice Support
- Implemented Web Speech API for voice input
- Added text-to-speech for response reading
- Supports Urdu (ur-PK) and English (en-US)
- Enables access for low-literacy users

### Law Library
- Catalogued all major Pakistani laws
- Filterable by category and province
- Each law displayed in simple language
- Direct link to ask chatbot about any law

---

## Week 4 — Resilience & Deployment

### API Key Rotation System
- Implemented automatic key rotation across 5 Gemini keys
- Added Grok API as fallback provider
- Built quota tracking with midnight PKT reset
- Ensured app never stops working regardless of quota status

### Wikipedia Fallback
- Integrated Wikipedia's free API as knowledge source
- Zero cost, no API key required, unlimited queries
- Searches Pakistani law topics and formats responses
- Guarantees the app always provides an answer

### Performance & Optimization
- Disabled unnecessary RAG calls to conserve API quota
- Implemented rate limiting (Firestore-backed, tamper-proof)
- Added 2-second throttle to prevent rapid-fire requests
- Optimized bundle with code splitting

### Deployment
- Deployed to Firebase Hosting (HTTPS, CDN, PWA-ready)
- Configured SPA rewrites for client-side routing
- Set up Firestore security rules
- Published as installable PWA for mobile users

---

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Kiro as IDE | AI-powered development for rapid iteration |
| React + Vite | Fast builds, modern DX, excellent ecosystem |
| Tailwind CSS | Utility-first, mobile-responsive, RTL support |
| Firebase | Auth + DB + Hosting in one platform, free tier |
| Grok API | Fast legal reasoning, multilingual support |
| Gemini 2.5 | Vision analysis, document generation |
| Browser-side RAG | Zero server cost, instant search, offline-capable |
| Wikipedia fallback | Free, unlimited, always available |
| jsPDF | Client-side PDF generation, no server needed |
| PWA | Installable on mobile without app store |

---

## Deployment Info

| Environment | URL |
|-------------|-----|
| Production | https://kanoon-ai-law.web.app |
| Firebase Console | https://console.firebase.google.com/project/kanoon-ai-law |
| GitHub | https://github.com/bismaasifabcd-gif/qanoon-ai |

---

*Built entirely in Kiro — from architecture to deployment.*
