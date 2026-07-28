# Frontend E2E (Playwright)

## Prerequisites

Services must already be running (this suite does not start them):

1. **Postgres** (e.g. via root `docker-compose`)
2. **Backend** Nest API on port **3001** (`cd backend && pnpm start:dev`)
3. **Frontend** Next on port **3000** (`cd frontend && pnpm dev`) with `API_URL` and `DEMO_COMPANY_TAX_ID` in `.env.local` (see `.env.example`)

## Command

```bash
cd frontend
pnpm test:e2e
```

First time (or after Playwright upgrades): `pnpm exec playwright install chromium`

Not part of `./init.sh` / Vitest unit path.
