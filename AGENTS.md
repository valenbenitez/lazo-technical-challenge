# AGENTS.md

> Este archivo es el **punto de entrada**. No es una biblia de reglas: es un
> **mapa**. Lee solo lo que necesites 

## Producto
Software de accountability y compliance para founders: que las empresas no pierdan de vista sus obligaciones (vencimientos, presentaciones, documentación). Dominio de alto cuidado: una fecha mal calculada, un dato sensible filtrado o un cambio sin registrar son errores caros. Dominio ficticio y de conocimiento público.

### Stack

**Frontend:**

- NextJs + Tailwind + TS strict

**Backend:**

- NestJs + TS strict. Prisma + PostgreSQL. class-validator.

### Funcionalidad

**Backend:**

- CRUD + endpoint de cambiar-estado; validación server-side.
- Máquina de estados + invariante doc-gated + cálculo de overdue + audit, **todo en una capa de dominio aislada de HTTP y de la base de datos.** La regla no va en el handler.
- companyTaxId enmascarado en lecturas y fuera de logs.
- Persistencia real (Postgres recomendado con docker-compose; SQLite OK).
- Modelo de error consistente (HTTP, 404).

**Frontend:**

- **Dashboard:** KPIs (total / por estado / vencidas / próximas a vencer), filtro, lista ordenada por dueDate con resalte de vencidas.
- **Detalle:** todos los campos + taxId enmascarado + historial + transiciones válidas disponibles, con el botón de submitted **bloqueado** si falta documento.
- **Crear / editar** con validación.
- **i18n es/en.**
- Consume la API. **No duplica el dominio en el front** — transiciones válidas y bloqueo vienen del backend.
- Loading y error de la API reflejados en la UI.