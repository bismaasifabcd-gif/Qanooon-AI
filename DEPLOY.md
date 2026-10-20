# Deploy — 100% free, clean split

No Firebase Blaze / billing needed. Two free pieces:

| Piece | Host | What it does |
|-------|------|--------------|
| Frontend (React build) | **Firebase Hosting** (free Spark) | the web app |
| Auth + Firestore | **Firebase** (free Spark) | login, chat history, rate limits |
| AI backend (`server/`) | **Render** (free web service) | holds the Groq key, calls Groq |
| Embeddings / RAG | **browser** | mpnet runs client-side, no server |

The chatbot uses the open-source **`openai/gpt-oss-20b`** model via Groq's free
tier, grounded on your local law PDFs (mpnet RAG). The Groq key lives only on
the Render server, never in the browser.

---

## Part 1 — Deploy the AI backend to Render (free)

1. Push this repo to GitHub (if not already).
2. Go to https://render.com → sign up (free) → **New → Web Service**.
3. Connect your GitHub repo. Render will detect `render.yaml`.
   - It builds from the `server/` folder (`rootDir: server`), runs `npm install`, then `npm start`.
4. When prompted for environment variables, set:
   - `GROQ_API_KEY` = your Groq API key (from https://console.groq.com/keys). Do NOT commit it to the repo.
5. Click **Create Web Service**. After it deploys, copy the public URL, e.g.
   `https://kanoon-ai-backend.onrender.com`.
6. Verify it's up: open `https://<your-render-url>/health` → should show `{"ok":true}`.

> Free Render services sleep after ~15 min idle; the first request after
> sleeping takes ~30–50s to wake. Fine for testing/demo.

## Part 2 — Point the frontend at the backend

1. Edit `.env` and set your Render URL:
   ```
   VITE_API_URL=https://kanoon-ai-backend.onrender.com
   ```
2. Rebuild:
   ```powershell
   npm run build
   ```

## Part 3 — Deploy the frontend to Firebase Hosting (free)

```powershell
$env:Path = "$env:ProgramFiles\nodejs;$env:APPDATA\npm;" + $env:Path
cd C:\qanoon-ai-main\qanoon-ai-main
firebase deploy --only hosting --project kanoon-ai-law
```

Test link printed by the CLI: **https://kanoon-ai-law.web.app**

---

## Local development

Run the backend and the Vite dev server in two terminals:

```powershell
# Terminal 1 — backend
$env:GROQ_API_KEY="gsk_..."; npm run server      # http://localhost:5000

# Terminal 2 — frontend (uses localhost:5000 automatically if VITE_API_URL is blank)
npm run dev
```

## Rebuild the law vector store (only if PDFs change)

```powershell
npm run ingest:browser -- --force     # mpnet embeddings -> public/vector_store.json
```

## Notes

- **Model:** `openai/gpt-oss-20b` (open source) in `server/server.js`. Your Groq
  key also has access to `openai/gpt-oss-120b` (slower, stronger) and
  `qwen/qwen3.8-27b` — change `GROQ_CHAT_MODEL` / `GROQ_DOC_MODEL` to switch.
- **No web search:** these models answer from training + the local law RAG
  context. (Groq's web-search "compound" models aren't on this key's tier.)
- **Rotate the Groq key** if it was ever shared in plain text.
