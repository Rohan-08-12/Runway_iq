# Deployment

## Backend → Render

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install && npx prisma generate` |
| Start Command | `npm start` |
| Environment | Copy every variable from `backend/.env` (see below) |

Environment variables to set on Render:

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Use the Supabase **session pooler** connection string — Render's IPv4 network can't reach Supabase's direct connection |
| `ANTHROPIC_API_KEY` | Same key as local dev, or a separate prod key |
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` | Same Supabase project as the frontend |
| `FRONTEND_ORIGIN` | Your deployed frontend URL (see Netlify step below) — comma-separate multiple origins if needed |
| `PORT` | Render sets this automatically; the app reads `process.env.PORT` |
| `NODE_ENV` | `production` |
| `BUSINESS_ID` / `DEMO_USER_ID` | Only needed if you plan to run `npm run db:seed` against production — usually skip in prod |

The schema is applied with `prisma db push` (no migration history is checked into this repo) — run it once against the production database before first deploy:

```bash
DATABASE_URL=<prod-connection-string> npx prisma db push
```

## Frontend → Netlify

| Setting | Value |
|---|---|
| Base Directory | `RunwayIq` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `RunwayIq/dist` |

Environment variables:

| Variable | Notes |
|---|---|
| `VITE_SUPABASE_URL` | Same Supabase project as the backend |
| `VITE_SUPABASE_ANON_KEY` | Same anon key as the backend |
| `VITE_API_BASE_URL` | Your Render backend URL, e.g. `https://runwayiq-backend.onrender.com` |

## Deploy order

1. Deploy the backend to Render first, note its URL.
2. Deploy the frontend to Netlify with `VITE_API_BASE_URL` pointed at that Render URL, note the resulting Netlify URL.
3. Go back to Render and set `FRONTEND_ORIGIN` to the Netlify URL, then redeploy the backend (CORS is a static allowlist checked at request time — see `backend/src/index.js` — so it must include the real frontend origin).

## Supabase project settings for production

- **Auth → URL Configuration** — add the Netlify URL to both "Site URL" and "Redirect URLs" if using email confirmation links or OAuth.
- **Database → Row Level Security** — see `docs/ARCHITECTURE.md` for why this is safe to leave off; enable it only if a future feature queries Supabase tables directly from the client.
