# Compliance Obligations Tracker

## Links
- Frontend: https://lazo-technical-challenge.vercel.app/
- Backend: https://lazo-technical-challenge.onrender.com

## Qué es
Software de accountability y compliance para founders: que las empresas no pierdan de vista sus obligaciones (vencimientos, presentaciones, documentación). Dominio de alto cuidado: una fecha mal calculada, un dato sensible filtrado o un cambio sin registrar son errores caros. Dominio ficticio y de conocimiento público.

## Stack
Frontend: NextJs con Typescript.
Backend: NestJs + Prisma con Typescript.
Testing: Jest (back) + Vitest + Playwright (front).
Database: PostgreSQL

## Qué hice (alcance entregado)
Monorepo dividido en dos carpetas:
- Backend: CRUD + endpoint de update-status para coleccion Obligations. Dominio aislado, overdue derivado y optimistic lock. Test de dominio + endpoint. Endpoint de update-status con historial. Campo companyTaxId enmascarado en lecturas y respuestas.
- Frontend: Dashboard con listado mas pantalla de detalle, creacion y edicion. Internacionalizacion (ES / EN) con next-intl. Test de flujo de creacion. Sin auth por lo que simulamos usuario con companyTaxId ya definido como variable de entorno.

## Cómo levantar
Prerequisitos: Node, pnpm, PostgreSQL.
### Backend (`backend/`)
1. Copiar `.env.example` → `.env` y setear `DATABASE_URL`.
2. `pnpm install`
3. `pnpm exec prisma generate && pnpm exec prisma migrate deploy`
4. `pnpm start:dev` → API en `http://localhost:3001`
### Frontend (`frontend/`)
1. Copiar `.env.example` → `.env.local`:
   - `API_URL=http://localhost:3001`
   - `DEMO_COMPANY_TAX_ID=0002`
2. `pnpm install`
3. `pnpm dev` → app en `http://localhost:3000`

## Tests
Comportamiento en ambas capas (sin cobertura 100%):

**Backend** (`backend/`)

| Qué | Cómo |
|---|---|
| Dominio (transiciones, doc-gated, overdue, dueDate) | `pnpm test` — `src/domain/obligation/obligation.spec.ts` |
| Endpoint `PATCH .../update-status` (happy path, doc-gated 400, 404) | `pnpm test:e2e` — requiere Postgres + `DATABASE_URL` |

**Frontend** (`frontend/`)

| Qué | Cómo |
|---|---|
| Unit (i18n helpers / keys) | `pnpm test` (Vitest) |
| Flujo crear obligación → ver en detalle/dashboard | `pnpm test:e2e` (Playwright) — requiere back `:3001` + front `:3000` + env; ver `frontend/e2e/README.md`. Primera vez: `pnpm exec playwright install chromium` |

## Qué quedó afuera
- Recordatorios
- Logs estructurados
- CI
- Soft-delete en la UI

## Con más tiempo
Con mas tiempo dedicaria a sacar las siguientes features:
1. **Auth + Companies** — sacar el taxId de demo por env y asociar obligaciones a una empresa real.
2. **Paginación / búsqueda** — la lista completa por empresa no escala.
3. **Upload real de documentos** — el invariante doc-gated hoy depende de una URL mock.
4. **OpenAPI (Swagger)** — documentar el contrato HTTP de forma ejecutable.

## Decisiones
Ver [DECISIONS.md](./DECISIONS.md)