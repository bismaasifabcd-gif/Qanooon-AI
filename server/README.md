---
title: Qanoon AI Backend
emoji: ⚖️
colorFrom: indigo
colorTo: yellow
sdk: docker
app_port: 7860
pinned: false
---

# Qanoon AI — Backend

Groq-powered backend for the Qanoon AI legal assistant. Provides:

- `POST /api/chat` — legal Q&A (Groq, structured answer)
- `POST /api/document` — FIR / complaint-letter drafting
- `POST /api/law-detail` — detailed law explanations
- `GET  /api/lawyers?city=&category=` — Find a Lawyer (OpenStreetMap)

## Required secret

Set `GROQ_API_KEY` in the Space **Settings → Variables and secrets** (as a secret).
