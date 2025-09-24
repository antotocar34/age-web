# Repository Guidelines

## Project Structure & Module Organization
- `web/src/` holds the TypeScript application (UI wiring in `app.ts`, crypto helpers in `worker.ts` and `crypto.ts`, UI composition in `ui.ts`).
- `web/public/` contains static assets bundled by Vite; only add files that should ship to production.
- `web/dist/` is generated output; do not edit manually.
- `docs/` serves the GitHub Pages build; update via `npm run build` before copying assets here if documentation needs republishing.

## Build, Test, and Development Commands
- `npm install` (run inside `web/`) installs dependencies; lockfile is committed, so prefer npm.
- `npm run dev` starts the Vite dev server at `http://localhost:3000` with hot reload.
- `npm run build` runs `tsc` for type-checking and produces an optimized bundle in `web/dist/`.
- `npm run preview` serves the production build locally to verify CSP behavior.

## Coding Style & Naming Conventions
- Use TypeScript strict mode defaults; keep imports explicit and prefer `.js` extensions in ESM paths to match current module references.
- Follow the two-space indentation and camelCase naming visible in `web/src/app.ts`.
- Keep UI logic inside the `AgeDecryptor` class and move shared DOM helpers to `ui.ts` to avoid duplication.
- Avoid introducing network calls or global side effects; the app must remain fully client-side.

## Testing Guidelines
- There is no automated test harness yet; ensure `npm run build` passes before opening a PR to catch type or bundler regressions.
- Manually validate passphrase and X25519 flows using sample `.age` fixtures via the drag-and-drop UI or the `web/test-key-parsing.html` harness.
- Document new test steps in the PR description so others can reproduce them.

## Commit & Pull Request Guidelines
- Follow the existing history: short, imperative headlines (e.g., “Make website more mobile friendly”). Group related changes per commit.
- Reference issues when available and mention security-impacting changes explicitly.
- For PRs, provide: summary of behavior changes, screenshots or GIFs for UI adjustments, reproduction steps for bugs, and notes on manual testing.

## Security & Configuration Tips
- Preserve the strict Content Security Policy in `public/index.html`; review changes with `npm run preview` before merging.
- Keep WebAssembly worker interactions isolated in `worker.ts`; audit any new dependencies for WASM compatibility and size impact.
