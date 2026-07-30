# 02-weather — Agent instructions

## Stack
- **Bun 1.3.14** — runtime, package manager, test runner, bundler. All commands use `bun`, never `node`/`npm`.
- **TypeScript** (strict, `noEmit: true`, `moduleResolution: "bundler"`). Bun runs `.ts` directly.

## Commands
| Action | Command |
|---|---|
| Run | `bun run index.ts` |
| Test | `bun test` |
| Typecheck | `bunx tsc --noEmit` |
| Add dep | `bun add <pkg>` |
| Init project | `bun init` |
| Build (tests + compile) | `bun run build` — runs tests first, only compiles if all pass |

`bun test` uses the built-in test runner (tests in `tests/`).

## Entrypoints
- `index.ts` — single entrypoint (`"module": "index.ts"` in package.json).

## Architecture (planned per README)
- CLI weather app using **OpenMeteo** APIs (geocoding + forecast).
- Menu-driven UI (Spanish-language).
- Features: default city, multi-city tracking, settings (°C toggle).
- `.gitignore` has `out/` and `dist/` — binary compilation goes there.

## Notes
- No `.env` is loaded automatically. If secrets/API keys are needed later, use `--env-file` or `Bun.env`.
- README is in Spanish — UI strings, comments, and prompts should match.
- No tests, lint, or CI configured yet.
