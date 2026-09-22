#!/usr/bin/env bash
#
# Instala los cinco skills a nivel usuario (~/.claude/skills), de modo que
# queden disponibles en TODOS los proyectos de esta máquina, no sólo en el
# repo biplot. Ejecútalo una vez por equipo. Es idempotente: volver a
# ejecutarlo actualiza los skills a la última versión de sus repos.
#
#   bash scripts/install-skills.sh
#
# Variables opcionales:
#   CLAUDE_SKILLS_DIR   destino (por defecto ~/.claude/skills)
#   BIPLOT_SKILLS_REF   rama de Biplot/biplot de la que tomar design-md-library

set -euo pipefail

SKILLS_DIR="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
REPO="https://github.com/Biplot/biplot.git"
VENDORED="design-md-library"

say()  { printf '\n\033[1m==> %s\033[0m\n' "$*"; }
warn() { printf '\033[33m    %s\033[0m\n' "$*"; }
die()  { printf '\033[31mERROR: %s\033[0m\n' "$*" >&2; exit 1; }

for bin in node git; do
  command -v "$bin" >/dev/null 2>&1 || die "falta '$bin' en el PATH. Instálalo y reintenta."
done

mkdir -p "$SKILLS_DIR"

# --- 1. Los cuatro skills publicados como tales, desde sus repos oficiales ---
# El CLI no acepta listas separadas por comas: una invocación por skill.
say "Instalando skills desde sus repos oficiales"
install_one() {
  local repo="$1" skill="$2"
  printf '    %-24s <- %s\n' "$skill" "$repo"
  npx --yes skills@latest add "$repo" -s "$skill" -g -y --copy >/dev/null 2>&1 \
    || die "falló la instalación de $skill desde $repo"
}
install_one Leonxlnx/taste-skill      design-taste-frontend
install_one Leonxlnx/taste-skill      image-to-code
install_one vercel-labs/agent-skills  web-design-guidelines
install_one microsoft/playwright-cli  playwright-cli

# --- 2. design-md-library: upstream no trae SKILL.md, va vendorizado ---
say "Instalando $VENDORED desde Biplot/biplot"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# Probamos cada rama candidata y nos quedamos con la primera que REALMENTE
# contenga el skill: comprobar que la rama existe no basta, porque main
# puede existir sin haber recibido todavía el merge.
fetch_ref() {
  local ref="$1" dest="$2"
  rm -rf "$dest"
  if git clone --depth 1 --filter=blob:none --sparse -b "$ref" "$REPO" "$dest" >/dev/null 2>&1; then
    git -C "$dest" sparse-checkout set ".claude/skills/$VENDORED" >/dev/null 2>&1 || true
  elif ! git clone --depth 1 -b "$ref" "$REPO" "$dest" >/dev/null 2>&1; then
    return 1
  fi
  [ -d "$dest/.claude/skills/$VENDORED" ]
}

ref=""
for candidate in ${BIPLOT_SKILLS_REF:-} main claude/hopeful-maxwell-yv724z; do
  [ -n "$candidate" ] || continue
  if fetch_ref "$candidate" "$tmp/co"; then ref="$candidate"; break; fi
done
[ -n "$ref" ] || die "ninguna rama de $REPO contiene .claude/skills/$VENDORED"
printf '    rama: %s\n' "$ref"

src="$tmp/co/.claude/skills/$VENDORED"
rm -rf "${SKILLS_DIR:?}/$VENDORED"
cp -R "$src" "$SKILLS_DIR/$VENDORED"
printf '    %-24s <- %s referencias\n' "$VENDORED" "$(find "$SKILLS_DIR/$VENDORED/references" -name DESIGN.md | wc -l | tr -d ' ')"

# --- 3. Verificación ---
say "Verificando"
missing=0
for s in design-taste-frontend image-to-code web-design-guidelines playwright-cli "$VENDORED"; do
  if [ -f "$SKILLS_DIR/$s/SKILL.md" ]; then
    printf '    \033[32mok\033[0m   %s\n' "$s"
  else
    printf '    \033[31mFALTA\033[0m %s\n' "$s"; missing=1
  fi
done
[ "$missing" -eq 0 ] || die "alguna instalación no se completó"

say "Listo — 5 skills en $SKILLS_DIR"
cat <<'NOTE'
    Disponibles en cualquier proyecto de esta máquina. Reinicia Claude Code
    para que los cargue.

    playwright-cli necesita además su binario:
        npm install -g @playwright/cli@latest
NOTE
