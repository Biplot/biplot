# Skills

Five agent skills installed at project level. Claude Code loads any
`SKILL.md` under `.claude/skills/` automatically — no configuration needed.

| Skill | Source | What it does |
| --- | --- | --- |
| `design-taste-frontend` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) ([tasteskill.dev](https://www.tasteskill.dev/)) | Anti-slop frontend direction for landings, portfolios and redesigns. Reads the brief, picks a direction, enforces a pre-flight check. |
| `image-to-code` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | Image-first workflow: generate section reference images, analyse them, then implement the frontend to match. |
| `web-design-guidelines` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | Audits UI code against the Web Interface Guidelines (a11y, UX, performance) and reports `file:line` findings. |
| `design-md-library` | [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) | 74 `DESIGN.md` design systems extracted from real sites, with a catalog index. Vendored locally — see note below. |
| `playwright-cli` | [microsoft/playwright-cli](https://github.com/microsoft/playwright-cli) | Drive a real browser from the CLI: navigate, click, fill, snapshot, trace, generate tests. |

## Los tres ámbitos

Un skill puede vivir en tres sitios, y el alcance cambia por completo:

| Ámbito | Ruta | Alcance |
| --- | --- | --- |
| Proyecto | `.claude/skills/` en el repo | Sólo este repo. Se versiona en git |
| Usuario | `~/.claude/skills/` | Todos los proyectos de esa máquina. No se versiona |
| Cuenta | Ajustes de claude.ai | Todas tus sesiones, repos y dispositivos |

Este directorio es el ámbito **proyecto**: los cinco skills acompañan a
`biplot/biplot` y no alcanzan al resto de repos de la organización.

### Instalarlos a nivel usuario

Para tenerlos en cualquier proyecto de una máquina, ejecuta una vez por
equipo:

```bash
bash scripts/install-skills.sh
```

Instala los cinco en `~/.claude/skills/` y verifica el resultado. Es
idempotente: volver a ejecutarlo los actualiza. Funciona sin haber clonado
el repo — descarga lo que necesita — así que en un equipo nuevo basta con:

```bash
BASE=https://raw.githubusercontent.com/Biplot/biplot/refs/heads/claude/hopeful-maxwell-yv724z
curl -fsSLO "$BASE/scripts/install-skills.sh"
less install-skills.sh      # léelo antes de ejecutarlo
bash install-skills.sh
```

Una vez fusionada esa rama en `main`, sustituye `refs/heads/claude/...` por
`main` en la URL. El script ya resuelve la rama por su cuenta: prueba `main`
primero y sólo cae a la rama de trabajo si `main` todavía no trae el skill.

En Windows, ejecútalo desde Git Bash o WSL; la ruta destino es entonces
`%USERPROFILE%\.claude\skills`. Reinicia Claude Code al terminar.

La instalación a nivel usuario deja también un árbol `~/.agents/skills/`
para Codex, Cursor y similares. Es inofensivo; bórralo si no lo usas.

## Managing them

Four of the five are tracked in `skills-lock.json` and were installed with
the [`skills`](https://www.npmjs.com/package/skills) CLI:

```bash
npx skills list                       # what is installed
npx skills update                     # pull upstream changes
npx skills add <owner>/<repo> -s <skill> -y --copy
```

Pass one `-s` per skill — a comma-separated list is not parsed.

`design-md-library` is **not** in the lockfile. Upstream is a plain
collection of Markdown files with no `SKILL.md`, so the CLI cannot install
it. The `SKILL.md` and its catalog of 74 entries were written here, and the
`references/<brand>/DESIGN.md` files are vendored copies (MIT, © VoltAgent).
To refresh it, re-copy `design-md/*/DESIGN.md` from upstream and regenerate
the catalog table.

Skills were installed with `--copy` rather than symlinked so the files are
committed and work in ephemeral environments. Only the Claude Code target
is kept; add `-a '*'` on install if you also want `.agents/` for Codex,
Cursor and others.

## `playwright-cli` needs its binary

The skill drives the `playwright-cli` command, which is not bundled:

```bash
npm install -g @playwright/cli@latest    # or prefix calls with: npx @playwright/cli@latest
```

By default it launches the **Google Chrome** channel. Where Chrome is absent
but a Playwright Chromium build exists — CI, containers, most cloud dev
environments — point it at that build instead:

```bash
export PLAYWRIGHT_MCP_BROWSER=chromium
export PLAYWRIGHT_MCP_EXECUTABLE_PATH="$(find "${PLAYWRIGHT_BROWSERS_PATH:-$HOME/.cache/ms-playwright}" -maxdepth 3 -path '*chrome-linux/chrome' | head -1)"
```

Equivalently, commit-free, via `.playwright/cli.config.json` (gitignored):

```json
{ "browser": { "browserName": "chromium", "launchOptions": { "executablePath": "/path/to/chrome" } } }
```

`file://` URLs are blocked by the CLI — serve the site first
(`python3 -m http.server 8000`) and browse `http://localhost:8000`.

## Review before trusting

These skills come from third-party repositories and run with full agent
permissions. Re-read a `SKILL.md` after any `npx skills update`.
