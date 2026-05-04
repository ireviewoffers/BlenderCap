# Agents

## Cursor Cloud specific instructions

This is a **Vite + React + TypeScript** frontend SPA ("Blender Cap — Lender match, compare & track"). No backend, no database, no Docker required.

### Key commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (serves on `http://localhost:5173`) |
| Lint | `npm run lint` (ESLint) |
| Type check | `npx tsc -b` |
| Build | `npm run build` (runs tsc + vite build, outputs to `dist/`) |
| Preview build | `npm run preview` |

### Notes

- Node.js 22 LTS is required (installed via NodeSource apt repo; nvm is not available in this environment).
- The project uses `npm` as the package manager (`package-lock.json` is the lockfile).
- Tailwind CSS v4 is integrated via the `@tailwindcss/vite` plugin — no `tailwind.config.js` needed.
- For GitHub Pages deployment, set `BASE_PATH=/repo-name/` environment variable before building.
- There are no automated tests configured yet. No test runner or test framework is present.
