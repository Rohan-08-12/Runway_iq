# Local Development Setup

Step-by-step guide to get RunwayIQ running locally, including the Supabase-specific gotchas that aren't obvious from the code.

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key

## 1. Get your Supabase credentials

From your Supabase project dashboard → **Settings → API**:

- **Project URL** — `https://<ref>.supabase.co`
- **anon key** (legacy JWT) or a `sb_publishable_...` key

From **Settings → Database → Connection string** (use the **Session pooler** string, not the direct connection, unless you're on an IPv6-capable network):

```
postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
```

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `backend/.env`:

```env
DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_ANON_KEY=<anon-key>
FRONTEND_ORIGIN=http://localhost:5173
PORT=3000
NODE_ENV=development
BUSINESS_ID=demo-business-id
DEMO_USER_ID=00000000-0000-0000-0000-000000000001
```

Push the Prisma schema (no migration files — this project uses `db push`):

```bash
npm run db:push
```

(Optional) Seed 6 months of demo transactions for a fictional "Demo SaaS Co":

```bash
npm run db:seed
```

Start the server:

```bash
npm run dev   # http://localhost:3000
```

## 3. Frontend setup

```bash
cd RunwayIq
npm install
cp .env.example .env
```

Fill in `RunwayIq/.env`:

```env
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
# Leave VITE_API_BASE_URL unset in dev — Vite proxies /api to :3000
```

```bash
npm run dev   # http://localhost:5173
```

## 4. Sign up and link the demo data (if seeded)

The backend resolves "your" business by matching `Business.userId` to your authenticated Supabase user ID (see `backend/src/middleware/auth.js`). Two paths:

- **Auto-create (default):** sign up in the app with no prior seed data. On first authenticated API call, the backend automatically creates an empty business tied to your account (name derived from your email). No manual steps needed.
- **Reuse the seeded demo business:** if you ran `npm run db:seed` *before* signing up, the demo business (`BUSINESS_ID`, default `demo-business-id`) belongs to the placeholder `DEMO_USER_ID`, not your real account. After signing up, repoint it:

  ```sql
  update public."Business"
  set "userId" = '<your-real-supabase-auth-uid>'
  where id = 'demo-business-id';
  ```

  Find your UID with:

  ```sql
  select id, email from auth.users order by created_at desc;
  ```

  Then update `DEMO_USER_ID` in `backend/.env` to match, so future `npm run db:seed` runs stay pointed at your account.

## 5. Row Level Security (RLS)

By default, `prisma db push` creates tables with RLS **disabled**. This project's frontend never queries Supabase tables directly (only uses the Supabase client for auth) — all data access goes through the Express backend via `DATABASE_URL`, which connects as the `postgres` role and bypasses RLS regardless. Enabling RLS with no policies is therefore safe (nothing depends on anon/authenticated role access to these tables), but isn't required for the app to function:

```sql
alter table public."Business" enable row level security;
alter table public."ChatMessage" enable row level security;
alter table public."Transaction" enable row level security;
alter table public."MonthlySnapshot" enable row level security;
alter table public."AIReport" enable row level security;
```

Only run this if you want defense-in-depth in case the frontend or another client ever queries these tables directly with the anon key in the future.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Dashboard is empty after signing up | Your account's business has no transactions — upload a CSV, or repoint the seeded demo business (step 4) |
| `401 Unauthorized` on every API call | Supabase session expired or `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` mismatch between frontend and backend projects |
| `CORS: origin ... not allowed` | `FRONTEND_ORIGIN` in `backend/.env` doesn't match the URL you're loading the frontend from (localhost:5173 and :3000 are always allowed) |
| Prisma can't connect | Using the direct connection string instead of the pooler, or wrong password |
