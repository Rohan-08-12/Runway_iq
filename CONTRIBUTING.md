# Contributing to RunwayIQ

Thanks for helping out. This doc covers the actual workflow for getting a
change into `master` — the short version is: **never push directly to
`master`, always go through a pull request.**

---

## 1. Set up your local environment

Follow [`docs/SETUP.md`](./docs/SETUP.md) for the full walkthrough (Supabase
project, `.env` files, Prisma push, seeding demo data). Quick version:

```bash
git clone https://github.com/Rohan-08-12/Runway_iq.git
cd Runway_iq

cd backend && npm install && npm run db:push && npm run dev   # :3000
cd ../RunwayIq && npm install && npm run dev                  # :5173
```

This is a monorepo:

| Path | What it is |
|---|---|
| `backend/` | Node/Express API, Prisma, Claude integration |
| `RunwayIq/` | React/Vite frontend |
| `docs/` | Setup, architecture, deployment guides |
| `Datasets/` | Sample CSVs for testing uploads |

---

## 2. Create a branch — never commit to `master`

Pull the latest `master` first, then branch off it:

```bash
git checkout master
git pull origin master
git checkout -b <type>/<short-description>
```

Branch prefix matches the commit convention below:

| Prefix | For |
|---|---|
| `feat/` | New functionality |
| `fix/` | Bug fixes |
| `docs/` | Documentation only |
| `chore/` | Tooling, deps, config, cleanup |

Examples: `feat/dark-mode-toggle`, `fix/csv-upload-timeout`, `docs/api-reference`.

If you don't have write access to this repo, fork it first and branch off
your fork instead — the rest of the process is identical, you'll just open
the PR from `your-fork:branch-name` instead.

---

## 3. Make your change

- Keep the PR scoped to one thing. A bug fix doesn't need to also refactor
  nearby code or add unrelated features — smaller PRs get reviewed faster
  and are easier to revert if something's wrong.
- No linter or formatter is configured yet — match the existing style in
  the file you're editing (2-space indent, single quotes in JS/TS, no
  semicolons in the backend, semicolons in the frontend — check the
  surrounding code).
- There's no automated test suite yet. Before opening a PR:
  - Run `npm run build` in `RunwayIq/` and confirm it succeeds with no new
    warnings you introduced.
  - Actually run the app locally (both `backend/` and `RunwayIq/` dev
    servers) and click through the flow your change touches — don't rely
    on "it compiles" as proof it works.
  - If you touched a backend route, hit it with `curl` or the running
    frontend to confirm the response shape didn't break.

---

## 4. Commit messages

This repo uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short summary, imperative mood>

<optional longer explanation of *why*, not just what — especially for
anything that isn't obvious from the diff itself>
```

Types: `feat`, `fix`, `docs`, `chore`, `perf`, `security`.

```
fix: correct pricing page to match actual enforced limit

Free tier claimed "3 reports/month" but the backend enforces 5/hour
flat for everyone — no tier logic exists to track a monthly count.
```

Keep commits reasonably small and focused — several small commits that
each do one clear thing are easier to review than one giant commit.

---

## 5. Push and open a pull request

```bash
git push -u origin <type>/<short-description>
```

Then open a PR against `master` on GitHub (or use `gh pr create`). In the
PR description, include:

- **What changed and why** — link the issue/context if there is one.
- **How you tested it** — what you actually clicked through or ran, not
  just "should work."
- **Anything risky or worth a second look** — e.g. a schema migration, a
  change to auth, a new environment variable someone needs to set.

If your change needs a new environment variable, a database migration, or
a config change on Railway/Vercel, **call that out explicitly** in the PR
description so it doesn't get missed on deploy.

---

## 6. Review and merge

- Wait for at least one review before merging, even on a small team —
  a second pair of eyes catches things the author is too close to see.
- Address feedback with new commits on the same branch rather than force-
  pushing over history mid-review, so reviewers can see what changed
  since their last pass. Squash before merge if you want a clean history.
- Once approved, merge via the GitHub UI (squash or merge commit, your
  call) — don't merge locally and push `master` directly.
- Delete the branch after merging.

---

## Reporting bugs / suggesting features

Open a GitHub issue. Include repro steps for bugs (what you did, what you
expected, what actually happened) — "it's broken" without steps is hard to
act on.

---

## A note on secrets

Never commit `.env` files, API keys, or database connection strings —
`.gitignore` already blocks the common ones, but double-check `git status`
before committing if you're touching config. If you accidentally commit a
secret, rotate it immediately (don't just remove it in a follow-up commit —
it's already in history) and let a maintainer know.
