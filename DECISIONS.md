Decisiones de diseño y trade-offs del Compliance Obligations Tracker.

---

## Stack

### Nest vs Express

Elegí Nest sobre Express por experiencia previa y porque ya impone módulos, DI y una separación de servicio sin armarla a mano. Express hubiera sido viable, pero hubiese sido mas tiempo en boilerplate.

### Prisma

Prisma: tipado fuerte, migraciones claras y acceso a datos bien separado del dominio.

---

## Arquitectura backend

- `domain/obligation` — reglas puras (transiciones, doc-gated, overdue, dueDate). Sin Nest ni Prisma.
- `modules/obligations` — HTTP + orquestación (controller / DTO / service).
- `modules/infrastructure/prisma` — persistencia.
- `shared` — masking, dates.

El **service** orquesta: llama al dominio, traduce fallos a excepciones HTTP y persiste. Las reglas no viven en el controller.

**Audit trail:** la validación de transición vive en dominio; la escritura de `ObligationStatusHistory` vive en el service, en la misma `$transaction` que el update de estado dando consistencia en la actualizacion.

---



## Overdue

`overdue` es **derivado**: `dueDate < hoy` (día calendario UTC vía `startOfDay`) y el status no es `submitted` ni `done`.

Se calcula al leer (lista / detalle) y se manda en la respuesta. **No** se persiste.

**Por qué no en DB:** se desactualizaría solo; habría jobs o triggers. En este dominio “vencida” es una proyección del reloj + estado, no un hecho que el usuario setea.

**Due-soon (14 días):** se calcula en el frontend para KPIs/filtro. No es regla de dominio ni estado; es vista de dashboard.

---



## Dato sensible (`companyTaxId`)

- Se guarda **plano** en DB (hace falta para filtrar por empresa y para editar).
- En **todas** las respuestas HTTP se enmascara (`maskCompanyTaxId` en el service).
- No se loguea: la política actual es no loguear el campo (no hay interceptor de redaction porque tampoco hay logger de aplicación escribiendo payloads).

**Limitación actual:** el dashboard del front lista con un `companyTaxId` de demo hardcodeado (`"0002"`). El filtro por empresa en la API es correcto; falta auth / Companies para sacar el hardcode. Queda explícito en pendiente.

---



## Concurrencia

Optimistic locking con campo `version` en `Obligation`:

1. `find` por id → versión `N`
2. `UPDATE … WHERE id AND version = N`, luego `version + 1`
3. Si Prisma `P2025` (no matcheó la fila) → `409 CONFLICT_OBLIGATION_VERSION`

Dos requests pueden leer `N`; solo una gana el update.

**Honestidad:** el front **no** envía `version`. El lock es read-then-write en el server. Hay una ventana TOCTOU teórica entre find y update; para el challenge alcanza y es simple de explicar.

Aplica a update de campos, disable y cambio de estado.

---



## Contrato de API

Envelope de éxito: `{ status: "success", data }`.

Errores: Nest exceptions con body `{ code, message }`.

table:

Método | Ruta | Notas

---

`POST` | `/obligations` | Crea en `pending`. 400 si dueDate / DTO inválidos.

`GET` | `/obligations?companyTaxId=` | Lista por empresa, orden `dueDate` asc. TaxId masked + `overdue`. `companyTaxId` obligatorio.

`GET` | `/obligations/:id` | Detalle: masked, `overdue`, `validTransitions`, `history`.

`PATCH` | `/obligations/:id` | Update de campos. **No** cambia status.

`PATCH` | `/obligations/:id/update-status` | Body `{ status }`. 400 transición/doc; 404; 409 versión.

`PATCH` | `/obligations/:id/disable` | Soft delete (`enabled` / `deletedAt`).

`GET` | `/obligations/:id/history` | Últimos 5 cambios de estado.

Códigos relevantes: `INVALID_DUE_DATE`, `INVALID_COMPANY_TAX_ID`, `INVALID_OBLIGATION_ID`, `OBLIGATION_NOT_FOUND`, `INVALID_STATUS_TRANSITION`, `CONFLICT_OBLIGATION_VERSION`, `HISTORY_NOT_FOUND`, `INTERNAL_SERVER_ERROR`.

### Por qué status separado del PATCH de campos

Evita que un update genérico bypasee la máquina de estados / doc-gated / audit. Un solo endpoint de transición concentra invariantes y el historial.

`validTransitions` lo calcula el backend (incluye filtrar `submitted` si falta documento) para que el front no reimplemente la máquina.

---



## Frontend

- Capas ligeras tipo FSD: `entities/obligation` (modelo + API client + card), `features/*` (actions / filtro), `widgets` (KPIs), `shared/ui`, UI de ruta en `app/`.
- Formularios de create/edit viven en la ruta; la mutación en Server Actions bajo `features/`.
- Cambio de estado solo en el detalle (no en el form de edit): el edit manda campos de `UpdateObligationInput`; el status usa el endpoint dedicado.
- Botón `submitted` disabled en UI cuando falta documento: presentación a partir de `requiresDocument` + `documentUrl` + lo que el API **no** incluye en `validTransitions`. No hay tabla de transiciones en el front.

**Descartado en el MVP del front:** soft-delete UI, paginación, i18n (pendiente), auth.

---



## Pendiente

- **i18n es/en** — requisito de consigna, pendiente
- **Tests de comportamiento** — dominio + un endpoint back; un flujo front — pendiente
- **Cache** — falta de estrategia de cache
- **Paginado / búsqueda** — lista completa por empresa hoy
- **Login / Companies** — reemplazaría el taxId hardcodeado
- **Upload real de documentos** — hoy `documentUrl` mock

---



## Uso de IA

**Ayudó en:**

- Aclarar consigna (dominio aislado, overdue derivado, doc-gated).
- Revisar schema, máquina de estados y optimistic lock.
- Acelerar UI de create/edit/detail y wiring de Server Actions.
- Acelerar armado de arquitectura

**Corregí / rechacé:**

- No poner reglas de negocio solo en el handler/service sin módulo de dominio.
- No generar `id: ""` en dominio para mandarlo a Prisma.
- No importar excepciones Nest dentro de `domain/`.
- No modelar Users / Companies / auth en el MVP.
- Preferir excepciones Nest en el service frente a un exception filter global.
- `redirect()` de Next fuera del `try/catch` en actions (si no, se captura como error `NEXT_REDIRECT`).
- No reimplementar la máquina de estados en el front; `validTransitions` y el bloqueo vienen del backend.

