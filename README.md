# ⚖️ Qanoon AI

**Qanoon Sabke Liye Hai — The Law Belongs to Everyone**

A multilingual, AI-powered legal aid application designed for Pakistani citizens — completely free of cost.

**Team:** Bisma Asif · May 2026

**Built with:** Kiro · Grok API · Gemini 2.5 · Firebase · React.js

---

## 📌 Problem Statement

Pakistan has over 240 million people, yet the vast majority lack access to legal knowledge or professional legal help — creating a profound justice gap.

- 70% of Pakistanis are unaware of their basic legal rights
- A single lawyer visit costs Rs. 5,000–50,000, unaffordable for most citizens
- Legal language is complex and inaccessible — written in English and Urdu legalese
- Domestic violence victims don't know they are protected under DVA 2012
- Workers face illegal termination without knowing their rights under labour law
- Cyber harassment victims are unaware that PECA 2016 provides legal recourse
- Women and minorities are disproportionately affected by this legal knowledge gap

**The law exists — but the people it protects do not know it.**

---

## 💡 Solution

Qanoon AI bridges the gap between complex legal systems and ordinary people by providing instant, accurate, and personalized legal guidance.

A common person opens Qanoon AI, describes their problem in everyday words (Urdu or English), and within seconds receives the applicable law, a simple explanation, clear action steps, and an option to generate an FIR or complaint letter ready to submit to authorities.

---

## ✨ Key Features

### 🤖 AskLex — AI Legal Chatbot
Understands plain everyday language, not legal jargon. A user can type "my husband beats me" and receive the exact law, section number, action steps, and punishment in simple Urdu. Full conversation memory with contextually aware follow-up answers.

### 📚 RAG-Powered Pakistani Law Database
Searches a real database of Pakistani law books — PPC 1860, DVA 2012, PECA 2016, Family Laws, Labour Laws, and more — before answering. Ensures answers are grounded in actual legislation, not AI guesswork.

### 🧠 Agentic Workflow
Multiple specialized agents work together:
- **Orchestrator Agent** — routes queries
- **Legal Agent** — RAG search over law books
- **Search Agent** — web fallback via Google Custom Search
- **Lawyer Agent** — finds lawyers via Places API
- **History Agent** — saves and manages sessions

### 📷 Evidence Upload & Case Strength Analysis
Upload photos of injuries, property damage, or threatening messages. Gemini 2.5 Vision analyzes the evidence and provides a Case Strength Score (0–100%) with a visual meter.

### 📄 FIR Draft & Complaint Letter Generation
Generates a complete, properly formatted FIR draft or formal complaint letter as a downloadable PDF — with applicable law, user details, incident description, and relief sought — ready to take directly to a police station or court.

### 🗺️ Find a Lawyer Nearby
Google Places API finds real lawyers in the user's city, filtered by specialization. Shows name, phone number, address, star rating, and a Google Maps pin. One tap to call.

### 🎙️ Voice Support for Low-Literacy Users
Voice input and output in Urdu and English — making Qanoon AI accessible to citizens who cannot read or type.

### 📖 Law Library
All major Pakistani laws — PPC, DVA, PECA, Family Laws, Labour Laws — stored and searchable. Filterable by category and province. Each law displayed in simple language with a direct link to ask the chatbot.

---

## 🆚 How Qanoon AI Stands Out

| Feature | Qanoon AI | Others |
|---------|-----------|--------|
| Pakistani Law Focus | ✅ 100% Pakistan-specific | Generic global advice |
| Language Support | ✅ Urdu + English + Auto-detect | English only |
| RAG Technology | ✅ Real law books as database | AI general knowledge only |
| Voice Support | ✅ Urdu + English voice I/O | Not available |
| Document Generation | ✅ FIR + Complaint Letter PDF | Advice only |
| Evidence Analysis | ✅ Photo upload + case strength | Not available |
| Find Lawyer | ✅ Google Maps integration | Not available |
| Cost | ✅ Completely Free | Paid subscriptions |
| Workflow | ✅ Full agentic workflow | Chatbot only |

---

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **Kiro** | Core development environment — AI-powered IDE used to build, iterate, and ship the entire application |
| **Grok API** | Powers intelligent query understanding, fast legal reasoning, and multilingual chat responses |
| **Google Gemini 2.5** | Vision analysis for evidence uploads, multilingual understanding, and document generation |
| **RAG Pipeline** | Retrieval Augmented Generation — searches real Pakistani law books before answering |
| **Google text-embedding-004** | Converts law text and queries into 768-dimension vectors for semantic search |
| **Firebase Auth** | Secure email/password authentication with persistent sessions |
| **Firebase Firestore** | Real-time NoSQL database for users, chat history, law vectors, and lawyer cache |
| **Firebase Hosting** | Fast, secure HTTPS hosting — converts to PWA for mobile installation |
| **Google Maps & Places API** | Finds real lawyers by city and specialization |
| **Google Custom Search API** | Fallback web search when RAG finds no match |
| **Web Speech API** | Free browser-native voice I/O — supports Urdu (ur-PK) and English |
| **React.js + Tailwind CSS** | Fast, responsive, mobile-first frontend |
| **jsPDF** | Generates professional PDF documents (FIR drafts, complaint letters) in-browser |
| **PWABuilder** | Converts web app to installable Android APK — no app store needed |

---

## 🌍 Real-World Use Cases

| Situation | How Qanoon AI Helps |
|-----------|-------------------|
| Domestic Violence Victim | DVA 2012 guidance + injury photo analysis + FIR draft + nearby family law lawyer |
| Wrongfully Terminated Worker | Labour Law rights + action steps + complaint letter to Labour Court as PDF |
| Cyber Harassment Victim | PECA 2016 guidance + steps to report to FIA Cyber Crime Wing + complaint letter |
| Tenant Facing Illegal Eviction | Tenancy Act protections + Rent Controller steps + complaint letter |
| Inheritance Dispute | Muslim Family Laws Ordinance guidance + relevant court referral |
| Child Marriage Concern | Child Marriage Restraint Act info + steps to report to authorities |

---

## 🏗️ System Architecture

```
Qanoon AI
├── Frontend (React.js + Tailwind CSS + PWA)
│   ├── AskLex Chat Interface
│   ├── Law Library
│   ├── Evidence Upload
│   ├── Lawyer Finder (Google Maps)
│   └── Voice I/O (Web Speech API)
│
├── Agentic Backend
│   ├── Orchestrator Agent
│   ├── Legal Agent (RAG Pipeline)
│   ├── Search Agent (Google Custom Search)
│   ├── Lawyer Agent (Places API)
│   └── History Agent
│
├── AI Layer
│   ├── Grok API (chat, legal reasoning, multilingual)
│   ├── Gemini 2.5 (vision + document generation)
│   └── text-embedding-004 (vector search)
│
└── Data Layer (Firebase)
    ├── Firestore (law vectors, chat history, user data)
    ├── Firebase Auth
    └── Firebase Hosting
```

---

## 👥 Team

| Name | Role |
|------|------|
| **Bisma Asif** | founder & Developer |

---

**Built with Kiro · Grok API · Gemini 2.5 · Firebase · React.js**
