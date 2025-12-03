# GovAI Search

AI-powered government contract search, alerts, pipeline tracking, and proposal drafting built with Next.js (Pages Router), Prisma, Tailwind, and PostgreSQL.

## Quick start

1. Copy envs and set secrets:
   ```bash
   cp .env.example .env
   # set DATABASE_URL, JWT_SECRET, OPENAI_API_KEY
   ```
2. Install deps:
   ```bash
   npm install
   ```
3. Generate Prisma client + push schema + seed sample data (users + ~30 opportunities):
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
4. Run the app:
   ```bash
   npm run dev
   ```
5. Login with the seeded account: `demo@govai.test / Password123!` (or create a new one on /signup).
6. Optional: run tests + lint + build:
   ```bash
   npm run lint && npm run test && npm run build
   ```

## Tech stack
- Next.js 16 (Pages Router) + TypeScript
- Tailwind CSS 4
- Prisma ORM + PostgreSQL
- JWT auth with httpOnly cookies (bcrypt for hashing)
- API routes under `/pages/api/*`
- AI helper layer ready for OpenAI (summary, rewrite, proposal generation)

## Major pages
- `/` Landing with features, pricing highlights, testimonials
- `/solutions` Deep dive on capabilities
- `/pricing` Plans + comparison
- `/wall-of-love` Testimonials grid
- `/tools` Free NAICS finder + mini search
- `/login`, `/signup` Auth forms
- `/search` Authenticated search with AI rewrite toggle, filters, pagination
- `/opportunity/[id]` Detail view with AI summary, attachments, pipeline notes
- `/saved` Saved opportunities list with inline status updates
- `/pipeline` Kanban-style pipeline by status
- `/alerts` Saved searches + alert toggles and creation
- `/proposals/[opportunityId]` Proposal generator with AI sections and draft saving

## Key API routes
- Auth: `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- Opportunities: `GET /api/opportunities/search`, `GET /api/opportunities/[id]`, `POST /api/opportunities/[id]/save`
- Saved opportunities: `GET /api/saved-opportunities`, `PATCH /api/saved-opportunities/[id]`
- Saved searches & alerts: `GET/POST /api/saved-searches`, `PATCH /api/saved-searches/[id]`, `POST /api/alerts/run`
- Proposals: `POST /api/proposals/generate` (AI), `POST /api/ai/generate-proposal`, `POST /api/proposals`, `PATCH /api/proposals/[id]`, `GET /api/proposals/[id]`
- AI helpers: `POST /api/ai/summarize-opportunity`, `POST /api/ai/rewrite-query`
- Auth hardening: `POST /api/auth/request-reset`, `POST /api/auth/reset`, `POST /api/auth/request-verification`, `POST /api/auth/verify`
- Admin/staff: `POST /api/opportunities/sync-sam` (admin only), cron endpoint `POST /api/cron/alerts` guarded by `CRON_SECRET`

## Data model (Prisma)
- `User` with role, passwordHash
- `Opportunity` with SAM metadata, NAICS/PSC arrays, values, dates, rawText
- `SavedOpportunity` (status, priority, notes)
- `SavedSearch` + `AlertSubscription`
- `ProposalDraft` with section JSON
- `Attachment` linked to opportunities

## Dev notes
- Tailwind 4 is used via `@import "tailwindcss";` in `src/styles/globals.css` (no config file required).
- JWT cookie name: `govai_token`, 7-day TTL.
- If `OPENAI_API_KEY` is missing, AI endpoints return a stub message so the UI still flows.
- Seed data includes two users and 30 example opportunities across agencies, set-asides, NAICS codes, and values.
- Email is mocked to console unless SMTP variables are set (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`).
- For cron-style alert digests, call `POST /api/cron/alerts` with header `x-cron-secret: $CRON_SECRET`.
- Docker build: `docker build -t samgovsearch . && docker run -p 3000:3000 samgovsearch`.
