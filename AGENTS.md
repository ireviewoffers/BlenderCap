# Agents

## Cursor Cloud specific instructions

This is a Vite + React + TypeScript frontend SPA for Blender Cap. No backend, database, or Docker service is required for local development.

### Key commands

| Task | Command |
| --- | --- |
| Install dependencies | `npm install` |
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Type check | `npx tsc -b` |
| Build | `npm run build` |
| Preview build | `npm run preview` |

### Notes

- The dev server serves on `http://localhost:5173` by default.
- The project uses `npm` as the package manager and `package-lock.json` as the lockfile.
- Tailwind CSS v4 is integrated through the `@tailwindcss/vite` plugin; no `tailwind.config.js` is required.
- For GitHub Pages deployments, set `BASE_PATH=/repo-name/` before building.
- No automated test runner is configured yet.
