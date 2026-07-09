# Architecture

## System overview

```
┌─────────────────────┐        ┌──────────────────────────┐        ┌─────────────────┐
│  React frontend      │  JWT   │  Express backend         │        │  Supabase        │
│  (Vite, :5173)       │──────▶│  (Node, :3000)            │───────▶│  Postgres + Auth │
│                       │  /api  │                          │  SQL   │                  │
│  Supabase client used │        │  Prisma ORM              │        │                  │
│  for auth only        │        │  (DATABASE_URL, bypasses │        │                  │
│                       │        │   RLS as table owner)    │        │                  │
└─────────────────────┘        └────────────┬─────────────┘        └─────────────────┘
                                              │
                                              ▼
                                   ┌─────────────────────┐
                                   │  Anthropic Claude     │
                                   │  claude-haiku-4-5     │
                                   │  (3-agent report)     │
                                   │  claude-sonnet-4-6     │
                                   │  (chat)                │
                                   └─────────────────────┘
```

The frontend never talks to Postgres or Claude directly — it only holds a Supabase session (for auth) and calls the Express API with a bearer token. All business logic, tenant isolation, and AI orchestration live in the backend.

## Multi-tenancy model

Every table with business-scoped data (`Transaction`, `MonthlySnapshot`, `AIReport`, `ChatMessage`) has a `businessId` foreign key. `Business.userId` is the anchor: it's a Supabase auth user ID, not something the client can set.

`requireAuth` (`backend/src/middleware/auth.js`) is the single chokepoint for this:

1. Verifies the bearer JWT against Supabase (`supabase.auth.getUser(token)`).
2. Resolves the caller's business — either the one requested via `x-business-id` (only if owned by the caller) or the first business owned by that `userId`.
3. **Auto-creates an empty business** on first login if none exists yet, named from the user's email. This means a brand-new signup has a working (empty) dashboard immediately, with no seed step required.
4. Attaches `req.businessId` — every route reads from this, never from the request body or query string.

This means tenant isolation is enforced once, centrally, rather than per-route — routes can't accidentally leak another business's data because they never see a client-supplied business ID.

## Data flow: CSV upload → dashboard

1. `POST /api/transactions/upload` (`routes/transactions.js`) — Multer receives the file, `services/csvParser.js` validates every row (date, amount bounds, category whitelist, direction) and rejects the whole upload with per-row errors on `422` if anything's malformed.
2. Valid rows are inserted as `Transaction` rows.
3. `services/metricsService.js` recomputes `MonthlySnapshot` rows for every affected month — revenue, COGS, opex, gross margin, net burn, 3-month rolling burn rate, runway (`cashOnHand / burnRate`), and revenue/expense volatility (coefficient of variation).
4. The frontend dashboard, forecast, risk, and what-if screens all read from these precomputed snapshots — nothing is recalculated live on every page load except the what-if simulator (in-memory only) and the risk score.

## The 3-agent report pipeline

`POST /api/report/generate` (`services/aiService.js`) chains three sequential Claude calls, each constrained to JSON output:

1. **Analyst** — reads metrics + risk + forecast, outputs up to 4 problems with severity and retrieval tags (e.g. `burn_rate`, `runway`, `gross_margin`).
2. **Strategist (RAG-grounded)** — uses Agent 1's tags to retrieve the top 3 matching chunks from a static 8-chunk knowledge base (`services/knowledgeBase.js`, tag-intersection scoring — no vector DB at this scale), then generates one grounded, quantified solution per problem.
3. **CFO Writer** — synthesizes problems + solutions into a 2–3 sentence executive summary and 3 prioritized actions.

The full reasoning chain (problems, solutions, sources, per-agent timings) is persisted to `AIReport` and returned to the frontend, so the UI can render *how* the report was produced, not just the final text.

Chat (`POST /api/chat`) is a separate, single-call path using a faster model (`claude-sonnet-4-6`) — it builds a live financial context string and answers conversationally, optionally persisting turns to `ChatMessage`.

## Why RLS is off by default

`prisma db push` creates tables with Row Level Security disabled. Since the frontend never queries Postgres directly (see above — it only uses Supabase for auth), and the backend connects via `DATABASE_URL` as the `postgres` role (which bypasses RLS regardless), disabled RLS doesn't currently expose anything to the anon/authenticated client roles. It only becomes a concern if a future feature queries Supabase tables directly from the client with the anon key — see `docs/SETUP.md` for the enable-RLS SQL if you want defense-in-depth ahead of that.
