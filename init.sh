#!/usr/bin/env bash
set -u

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

ok()   { printf "${GREEN}[OK]${NC}    %s\n" "$1"; }
warn() { printf "${YELLOW}[WARN]${NC}  %s\n" "$1"; }
fail() { printf "${RED}[FAIL]${NC}  %s\n" "$1"; }

EXIT_CODE=0
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

# Uso: ./init.sh [frontend|backend|all]
# Por defecto verifica ambos paquetes del monorepo.
TARGET="${1:-all}"

verify_package() {
  local dir="$1"
  local name="$2"

  echo ""
  echo "── ${name} (${dir}) ───────────────────────────────"

  if [ ! -d "$dir" ] || [ ! -f "$dir/package.json" ]; then
    fail "No existe paquete: ${dir}"
    EXIT_CODE=1
    return
  fi

  (
    cd "$dir" || exit 1

    if [ ! -d "node_modules" ]; then
      warn "node_modules no existe en ${dir}. Ejecutando pnpm install..."
      pnpm install || exit 1
    fi
    ok "node_modules presente (${dir})"

    echo ""
    echo "── Lint (${name}) ────────────────────────────────"
    if pnpm run lint; then
      ok "Lint pasa (${name})"
    else
      fail "Lint tiene errores (${name})"
      exit 1
    fi

    echo ""
    echo "── Tests (${name}) ───────────────────────────────"
    if node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts.test ? 0 : 1)"; then
      if pnpm test; then
        ok "Tests pasan (${name})"
      else
        fail "Tests rotos (${name})"
        exit 1
      fi
    else
      warn "No hay script test en ${dir}/package.json — skip"
    fi
  )
  local status=$?
  if [ $status -ne 0 ]; then
    EXIT_CODE=1
  fi
}

echo "── Verificando entorno ─────────────────────────────"
command -v node >/dev/null 2>&1 || { fail "node no está instalado"; exit 1; }
ok "node -> $(node --version)"
command -v pnpm >/dev/null 2>&1 || { fail "pnpm no está instalado"; exit 1; }
ok "pnpm -> $(pnpm --version)"

echo ""
echo "── Archivos del harness ────────────────────────────"
for f in AGENTS.md docs/architecture.md docs/conventions.md docs/verification.md docs/TASKS.md; do
  if [ ! -f "$f" ]; then
    fail "Falta archivo: $f"
    EXIT_CODE=1
  else
    ok "Existe $f"
  fi
done

case "$TARGET" in
  frontend)
    verify_package "frontend" "Frontend"
    ;;
  backend)
    verify_package "backend" "Backend"
    ;;
  all)
    verify_package "frontend" "Frontend"
    verify_package "backend" "Backend"
    ;;
  *)
    fail "Target inválido: ${TARGET} (usar frontend|backend|all)"
    EXIT_CODE=1
    ;;
esac

echo ""
echo "── Resultado ──────────────────────────────────────"
if [ $EXIT_CODE -eq 0 ]; then
  ok "Entorno listo"
else
  fail "Entorno no listo"
fi
exit $EXIT_CODE
