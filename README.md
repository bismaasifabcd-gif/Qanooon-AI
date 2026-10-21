# ⚖️ Qanoon AI

**Qanoon Sabke Liye Hai — The Law Belongs to Everyone**

A free, bilingual (English / Urdu) AI-powered legal-aid web app for Pakistani citizens. Describe your problem in plain, everyday words and get the applicable law, a simple explanation, concrete action steps, and a ready-to-submit FIR or complaint letter — all at no cost.

🌐 **Live:** https://qanooon-ai.vercel.app
📦 **Repository:** https://github.com/bismaasifabcd-gif/Qanooon-AI

> **Built with Kiro** — the AI-powered IDE used to design, build, and ship the entire application.

---

## 📌 The Problem

Pakistan has 240M+ people, yet most lack access to legal knowledge or affordable legal help.

- ~70% of citizens are unaware of their basic legal rights.
- A single lawyer visit can cost Rs. 5,000–50,000 — out of reach for most.
- Legal language is dense English/Urdu legalese.
- Victims of domestic violence, cyber harassment, and illegal termination often don't know the law already protects them (DVA 2012, PECA 2016, Labour Laws).

**The law exists — but the people it protects do not know it.**

---

## 💡 The Solution

A citizen opens Qanoon AI, types their situation in Urdu or English (formal or casual), and within seconds gets:

1. The **applicable law** + exact section(s)
2. A **plain-language explanation**
3. **Action steps** and relevant **helplines**
4. A downloadable **FIR draft** or **complaint letter** PDF
5. **Nearby lawyer / Bar Association** contacts

---

## ✨ Key Features

### 🤖 AskLex — AI Legal Chatbot
Understands plain everyday language, not legal jargon. It silently classifies each message as a **legal-action matter**, a **legal-information request**, or an **everyday/emotional** conversation, then responds in the right style. Serious matters return a structured card (law, meaning, action steps, punishment, severity); casual ones get calm, human advice. Full conversation memory with context-aware follow-ups. Bilingual with auto language detection.

### � RAG-Powered Pakistani Law Knowledge Base
A Retrieval-Augmented Generation pipeline over real Pakistani law books (Constitution of 1973, PPC 1860, DVA 2012, PECA 2016, Family & Labour laws). Law PDFs are ingested, chunked, embedded into vectors, and stored in a vector index so the assistant can retrieve the most relevant statute passages and ground its answers in actual legislation. (See **RAG Pipeline** below.)

### 📄 FIR Draft & Complaint Letter Generation
Generates a properly formatted FIR draft or formal complaint letter via Groq, rendered in-app and exportable as a professional **PDF (jsPDF)** — with applicable law, complainant details, incident description, and relief sought. Mobile-friendly bottom-sheet forms.

### 🗺️ Find a Lawyer Nearby
Lists real legal offices and District/High Court **Bar Association** desks across 10 Pakistani cities, filterable by specialization (Family, Criminal, Property, Cyber Crime, Labour, Constitutional). Data is sourced from **OpenStreetMap** and pre-fetched into a static dataset so lookups are instant and stay within serverless time limits — completely free, no Google billing.

### � Law Library
Major Pakistani laws (PPC, DVA 2012, PECA 2016, Family Laws, Labour Laws, and more) in simple language, filterable by category, with one tap to ask AskLex about any of them.

### 🎙️ Voice Support
Browser-native **Web Speech API** for voice input and text-to-speech output in Urdu (`ur-PK`) and English — accessible to low-literacy users. Free, no API key.

### 🧭 Onboarding & Chat History
First-time coachmark guides on every major screen, a ChatGPT-style slide-in chat-history panel backed by Firestore, and a replayable guide from Settings.

---

## 🧠 RAG Pipeline

Qanoon AI uses a **Retrieval-Augmented Generation** pipeline to ground legal answers in real Pakistani statute text instead of relying on the model's general knowledge.

**1. Document ingestion** — Pakistani law PDFs in `public/books/` are parsed with `pdfjs-dist` (`scripts/ingestPdfs*.js`), and the extracted text is passed to the section-aware chunker below.

**2. Chunking (section-aware / structure-based)** — Legal text is not split blindly by a fixed character count. Instead it is chunked along the document's natural legal structure so that each chunk is a **self-contained legal unit**. The ingester detects statutory boundaries — **Act → Chapter → Section** — and emits one chunk per section, attaching rich metadata (`law`, `chapter`, `section`, `lawTitle`, `pageNumber`). This keeps related clauses together, preserves legal context, and lets retrieved passages cite their exact source. Near-empty fragments are filtered out, and very long sections are sub-split with a small overlap so each chunk fits the embedding model's context window.

Example of a single stored chunk:

```
[Chunk]
Law:     Domestic Violence Act 2012
Section: 9 — Protection Orders
Chapter: III — Remedies

A court may pass a protection order directing the respondent to:
(a) not commit any act of domestic violence;
(b) not communicate with the applicant ...
```

Because each chunk is a complete section, a query like "protection order against my husband" retrieves the whole of Section 9 — not a half-sentence cut off mid-clause.

**3. Embeddings (free, open-source)** — Chunks are converted to vectors using Hugging Face models via `@xenova/transformers` (`all-MiniLM-L6-v2` / `all-mpnet-base-v2`) with **mean pooling + normalization**. No paid embedding API.

**4. Vector store** — Vectors are stored in **LanceDB** (`vectordb`) for local builds and exported to a pre-computed **`public/vector_store.json`**, which allows semantic search to run **entirely in the browser** at zero server/API cost.

**5. Retrieval** — At query time the user's question is embedded with the same model, compared against all stored chunks using **cosine similarity**, filtered by a relevance threshold, and the **top-K (default 5)** passages are selected.

**6. Augmented generation** — The retrieved law passages are supplied as grounding context to the **Groq** language model, which produces the final answer referencing the relevant law and section.

> Design note: the entire RAG stack is free and serverless — open-source embeddings, a static in-browser vector index, no managed vector DB.

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | Component-based mobile-first UI |
| **Vite 8** | Dev server and production build |
| **React Router 7** | Client-side routing (SPA) |
| **Tailwind CSS 4** | Utility-first styling; rectangular, clean design system |
| **lucide-react** | Icon set |
| **react-markdown** | Renders AI answers with markdown |
| **emoji-picker-react** | Emoji picker in chat |
| **jsPDF** | Generates FIR / complaint-letter PDFs in-browser |
| **pdfjs-dist** | Client-side PDF handling / ingestion parsing |
| **Web Speech API** | Native voice input/output (Urdu + English) |

### AI & RAG Layer
| Technology | Purpose |
|-----------|---------|
| **Groq API** | LLM reasoning — chat answers and document drafting |
| **Model: `openai/gpt-oss-120b`** | Served via Groq for fast, free inference (`reasoning_effort: low`, with an automatic retry on empty/length-truncated responses) |
| **@xenova/transformers** | Open-source embedding models (MiniLM / MPNet) running locally — free, no API key |
| **LanceDB (`vectordb`)** | Vector store for ingested law chunks |
| **Static `vector_store.json`** | Pre-computed vector index for in-browser semantic search |

### Backend (Serverless)
| Technology | Purpose |
|-----------|---------|
| **Vercel Serverless Functions** (`/api/*.js`) | Node handlers that hold the Groq key server-side and proxy all AI calls |
| **OpenStreetMap (Overpass)** | Source for the pre-fetched lawyer/Bar-Association dataset (`api/lawyers-data.json`) |

**API routes** (all share logic in `api/_lib.js`):

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/chat` | POST | AskLex chat (classify → answer), keeps last ~10 turns of context |
| `/api/document` | POST | Drafts FIRs and complaint letters |
| `/api/law-detail` | POST | Detailed explanation of a specific law |
| `/api/lawyers` | GET | Lawyers/Bar desks by `city` and `category` |

### Data & Auth (Firebase)
| Technology | Purpose |
|-----------|---------|
| **Firebase Auth** | Email/password authentication with persistent sessions |
| **Cloud Firestore** | Users, chat sessions/history, generated documents, rate-limit counters |
| **Firestore Rules + Indexes** | `firestore.rules`, `firestore.indexes.json` |

### Hosting & Tooling
| Technology | Purpose |
|-----------|---------|
| **Vercel** | Hosts the static frontend **and** the `/api` serverless functions on one origin; auto-deploys on push to `main` |
| **ESLint** | Linting (`eslint.config.js`) |
| **PWA manifest** | Installable on mobile (`public/manifest.json`) |

> Everything is free with **no credit card**: Groq free tier for the LLM, open-source embeddings + in-browser vector search for RAG, OpenStreetMap for lawyer data, Web Speech API for voice, and Firebase + Vercel free tiers.

---

## 🏗️ Architecture

```
Browser (React SPA on Vercel)
│
├── AskLex chat · Law Library · FIR/Complaint · Lawyer finder · Voice I/O
├── RAG retrieval (in-browser): embed query → cosine search over vector_store.json
├── Web Speech API (voice, client-side)
│
├──►  Vercel Serverless /api/*  (Groq key lives here, never in the browser)
│      ├── /api/chat           → Groq (openai/gpt-oss-120b)
│      ├── /api/document       → Groq
│      ├── /api/law-detail     → Groq
│      └── /api/lawyers        → static OpenStreetMap dataset + Bar desks
│
└──►  Firebase
       ├── Auth (email/password)
       └── Firestore (users, chat history, documents, rate limits)
```

Same-origin design: in production the frontend calls `/api/...` directly. `VITE_API_URL` can point the frontend at an external backend; if unset, it uses the same origin (and `http://localhost:5000` during local dev).

---

## 📂 Project Structure

```
qanoon-ai/
├── api/                     # Vercel serverless functions
│   ├── _lib.js              # Shared Groq client, prompts, CORS, lawyer data
│   ├── chat.js              # AskLex chat endpoint
│   ├── document.js          # FIR / complaint drafting
│   ├── law-detail.js        # Law detail endpoint
│   ├── lawyers.js           # Lawyer/Bar lookup
│   └── lawyers-data.json    # Pre-fetched OpenStreetMap dataset
├── scripts/                 # RAG ingestion (PDF → chunks → embeddings → vectors)
│   ├── ingestPdfsLocal.js
│   └── ingestPdfsBrowser.js
├── src/
│   ├── pages/               # Splash, Onboarding, Auth, Dashboard, Chatbot,
│   │                        # LawLibrary, LawyerSearch, History, Profile,
│   │                        # Settings, PrivacyPolicy, Home, ...
│   ├── components/          # FIRGenerator, ComplaintLetter,
│   │                        # FeatureGuide, layout/ (Navbar, BottomNav), SvgAssets
│   ├── contexts/            # AuthContext, LanguageContext
│   ├── services/            # geminiService (Groq client), ragService (RAG search), firebase...
│   ├── firebase/            # config, auth, firestore
│   ├── translations/        # en.js, ur.js
│   ├── utils/               # rateLimiter, responseParser, seedLaws...
│   └── data/                # laws.js, localLaws.js
├── public/                  # icons, fonts (Jameel Noori Urdu), manifest, books, vector_store.json
├── firebase.json            # Firestore rules/indexes (+ optional hosting config)
├── vercel.json              # Build output + SPA rewrites (keeps /api intact)
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Groq API key (free) from https://console.groq.com
- A Firebase project (free Spark plan) with Auth + Firestore enabled

### 1. Install
```bash
npm install
```

### 2. Configure environment
Copy `.env.example` to `.env` and fill in your Firebase web config:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...

# Leave blank to use same-origin /api in production,
# or point at a backend during split deployments:
VITE_API_URL=
```

The **Groq API key is never placed in the frontend `.env`**. Set it server-side only:
- On Vercel: Project → Settings → Environment Variables → `GROQ_API_KEY`.

### 3. Run locally
```bash
npm run dev            # start the Vite dev server
npm run build          # production build to dist/
npm run preview        # preview the production build
npm run lint           # lint
npm run ingest:local   # (re)build the RAG vector store from PDFs in public/books
```

> Serverless `/api` functions run on Vercel. For purely local backend testing you can set `VITE_API_URL` to a local server; otherwise test the functions on a Vercel preview deployment.

---

## ☁️ Deployment

The app is deployed on **Vercel** and auto-deploys on every push to `main`.

1. Import the GitHub repo into Vercel.
2. Build command `npm run build`, output directory `dist` (already set in `vercel.json`).
3. Add the `GROQ_API_KEY` environment variable in the Vercel dashboard.
4. `vercel.json` rewrites all non-`/api` routes to `index.html` so the SPA and serverless functions coexist on one origin.

```bash
git push origin main   # → Vercel builds and deploys automatically
```

---

## 🔐 Security Notes
- The **Groq API key lives only in the server-side `GROQ_API_KEY` env var**, never shipped to the browser.
- Firestore access is governed by `firestore.rules`.
- Per-user daily rate limiting is enforced in Firestore (`src/utils/rateLimiter.js`) so quotas can't be bypassed client-side.
- `.env` is git-ignored; do not commit real keys. Rotate any key that has been exposed.

---

## ⚠️ Disclaimer
Qanoon AI provides general legal information for guidance only. It is **not a substitute for professional legal advice**. For serious matters, consult a qualified lawyer.

---

## 👥 Team

| Name | Role |
|------|------|
| **Bisma Asif** | Founder & Developer |

---

**Built with Kiro · Groq · React · Vite · Tailwind CSS · Firebase · Vercel · OpenStreetMap**
