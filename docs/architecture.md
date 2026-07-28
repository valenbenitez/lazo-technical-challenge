# Arquitectura — Qué significa "hacer un buen trabajo"

> Este documento define el estándar de calidad. Los agentes revisores evalúan
> el código contra este archivo. Si no está aquí, no es un requisito.

## Principios

1. **Capas claras.** Cada capa tiene una responsabilidad; las dependencias van hacia adentro (dominio sin framework).

   **Backend** (`backend/src/`):
   - `domain/obligation/` — reglas puras: máquina de estados, invariantes doc-gated, cálculo de overdue, errores de dominio. **Sin Nest, sin Prisma, sin HTTP.**
   - `modules/obligations/` — HTTP + orquestación: controller delgado, DTOs (`class-validator`), service que orquesta dominio + persistencia y traduce fallos a excepciones Nest.
   - `modules/infrastructure/` — Prisma (`PrismaService` / `PrismaModule`). `ObligationsService` persiste directo con `PrismaService` (sin repository intermedio).
   - `shared/` — utilidades transversales: enmascarado (`maskCompanyTaxId`), fechas (`startOfDay`).

   **Frontend** (`frontend/`, FSD ligero):
   - `app/` — rutas Next.js (dashboard, detalle, create, edit); páginas RSC y UI de ruta.
   - `src/entities/obligation/` — modelo/tipos, API client (`obligations-api.ts`), UI de entidad (`ObligationCard`).
   - `src/features/*` — mutaciones vía Server Actions (create, update, change-status) y filtro de dashboard.
   - `src/widgets/` — KPIs del dashboard.
   - `src/shared/ui/` — primitivos UI (button, input, label, etc.).

2. **Sin dependencias de más.** Cada dependencia externa está justificada.
   Si una tarea requiere una nueva, se discute antes.

3. **Errores explícitos.** El dominio devuelve resultados tipados (p. ej. `{ success: false, error: string }` en transiciones) — no lanza excepciones de framework.
   `ObligationsService` interpreta esos fallos y los traduce a excepciones Nest (`BadRequestException`, `ConflictException`, etc.) con códigos estables (`INVALID_STATUS_TRANSITION`, `CONFLICT_OBLIGATION_VERSION`, etc.).
   Respuesta de error HTTP: `{ code, message }`. No valores `null`/`undefined` silenciosos donde hay fallo de negocio.

4. **Tipado estricto.** `strict: true` en `tsconfig.json` (front y back). Evitar `any` y `as` casts innecesarios.

## Flujo de datos

### Backend

```
HTTP request
  → ObligationsController (valida DTO, sin reglas de negocio)
  → ObligationsService (orquesta)
      → domain/obligation (transiciones, doc-gated, overdue, dueDate)
      → PrismaService (persistencia directa)
  → respuesta envelope { status: "success", data }
     (companyTaxId enmascarado, overdue derivado, validTransitions calculadas)
```

**Reglas en el flujo:**
- `overdue` se **deriva al leer** (no se persiste): `dueDate < hoy` (día calendario UTC vía `startOfDay`) y el status no es `submitted` ni `done`.
- `validTransitions` las calcula el backend; incluye filtrar `submitted` si falta documento.
- Cambio de estado **solo** en `PATCH /obligations/:id/update-status` — no en el PATCH de campos.
- Audit trail (`ObligationStatusHistory`) se escribe en la **misma `$transaction`** que el update de status.
- `companyTaxId` se enmascara en **todas** las respuestas HTTP (`maskCompanyTaxId` en el service).
- Optimistic locking con campo `version`: conflicto → `409 CONFLICT_OBLIGATION_VERSION`.

### Frontend

```
usuario
  → app/ (páginas RSC: dashboard, detalle, create, edit)
  → features/*/actions (Server Actions para mutaciones)
     o entities/obligation/api (fetch para lecturas)
  → backend API
```

**Reglas en el flujo:**
- La UI de ruta vive en `app/`; la lógica de mutación en `features/*/actions`; tipos y client en `entities/obligation`.
- **No duplica dominio:** transiciones válidas y bloqueo de `submitted` vienen de `validTransitions` y datos del API — no hay máquina de estados en el front.
- `due-soon` (14 días) se calcula en el front **solo** para KPIs/filtro de vista; no es regla de dominio.
- Cambio de estado solo en la pantalla de detalle (endpoint dedicado), no en el formulario de edición de campos.
- i18n es/en: **pendiente** (requisito de consigna, no implementado aún).

## Qué NO hacer

- No poner reglas de negocio en el controller ni en Prisma — van en `domain/obligation/`.
- No importar Nest, Prisma ni excepciones HTTP dentro de `domain/`.
- No cambiar status en el PATCH genérico de campos — usar `update-status`.
- No persistir `overdue` — es proyección de reloj + estado al leer.
- No reimplementar la máquina de estados ni el doc-gated en el frontend.
- No exponer `companyTaxId` sin enmascarar en respuestas HTTP ni loguearlo.
- No usar `console.log()` para debug — usar el logger del proyecto (cuando exista).
- No mutar props ni estado global sin side-effects explícitos.
- No capturar `redirect()` de Next dentro de `try/catch` en Server Actions (lanza `NEXT_REDIRECT`).
