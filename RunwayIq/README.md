# RunwayIQ — Frontend

React 18 + Vite 6 + TypeScript client for RunwayIQ. Originally scaffolded from a [Figma Make](https://www.figma.com/design/xAmGjXMsqn7zY4wDr7QDGb/RunwayIq) design.

See the [root README](../README.md) for the full product overview and the [backend README](../backend/README.md) for the API it talks to.

---

## Tech stack

- **React 18** + **Vite 6** + **TypeScript**
- **Tailwind CSS 4** + **Radix UI** primitives + **MUI** (icons)
- **React Router 7** — client-side routing, auth-gated layout
- **Supabase JS** — auth only (session/JWT), no direct table access from the client
- **Recharts** — dashboard/forecast charts
- **jsPDF** + **jspdf-autotable** — CFO report PDF export

---

## Project structure

```
src/
├── app/
│   ├── screens/           # One component per route
│   │   ├── Landing.tsx        # Public marketing page
│   │   ├── Login.tsx          # Supabase auth (sign up / sign in)
│   │   ├── Dashboard.tsx       # KPI dashboard, 6-month sparklines
│   │   ├── Transactions.tsx    # Transaction list + CSV upload
│   │   ├── Forecast.tsx        # 3-month revenue forecast
│   │   ├── WhatIf.tsx          # OPEX cut / revenue target simulator
│   │   ├── Chat.tsx            # Ask Your CFO chat interface
│   │   └── Settings.tsx        # Business name / cash on hand
│   ├── components/        # Shared UI (Layout, charts, cards, etc.)
│   └── routes.tsx         # React Router config + auth gate
├── contexts/
│   └── AuthContext.tsx    # Supabase session state, exposes useAuth()
└── lib/
    ├── api.ts             # Typed fetch client for the backend (/api/*)
    ├── supabase.ts        # Supabase client init (auth only)
    ├── format.ts          # Currency/number formatting helpers
    └── generatePDF.ts     # jsPDF CFO report generator
```

---

## Routing & auth

`routes.tsx` wraps every screen except `/landing` and `/login` in a `RequireAuth` guard that reads `useAuth()` (backed by `AuthContext`, which subscribes to Supabase's session). Unauthenticated users are redirected to `/landing`.

Every backend call goes through `lib/api.ts`, which pulls the current Supabase access token (`supabase.auth.getSession()`) and attaches it as `Authorization: Bearer <token>`. The backend derives `businessId` from that token server-side — the frontend never sends a business ID directly.

> **Gotcha:** the backend resolves your business by matching `Business.userId` to the authenticated Supabase user's ID. If you seed demo data before signing up, the seeded business won't be visible to your account until its `userId` is repointed at your real Supabase auth UID.

---

## Environment variables

Create `RunwayIq/.env` (see `.env.example`):

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | ✅ | Supabase project URL — Settings → API |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Supabase anon/publishable key — safe for client-side use |
| `VITE_API_BASE_URL` | Only for prod builds | Backend origin. Leave unset in dev — Vite proxies `/api` → `http://localhost:3000` (see `vite.config.ts`) |

---

## Scripts

```bash
npm install     # install dependencies
npm run dev     # start Vite dev server on http://localhost:5173
npm run build   # production build → dist/
```

---

## CSV upload format

The Transactions screen uploads to `POST /api/transactions/upload`. Expected columns (case-insensitive): `date, amount, direction, category, description, merchant_name`. Sample files are in `/Datasets` at the repo root.
