# Stepping Stones

Lightweight Next.js + Tailwind project for a game called "Stepping Stones". The app is now a frontend-only Next.js application (no server-side sockets or database).

This README gives quick setup instructions and a short analysis of files that were removed or recommended for cleanup.

## Quick start

1. Install dependencies

	 ```bash
	 npm install
	 ```

2. Development

 	Run the Next dev server:

 	```bash
 	npm run dev
 	```

 	- Open http://localhost:3000 in your browser.

3. Production (build + start)

	 ```bash
	 npm run build
	 npm run start
	 ```

4. Notes

 	This repository was simplified to be frontend-only. Server-side Socket.IO and Prisma-related files were removed. If you previously relied on a backend or DB, you can add them back later.

## What this repo contains (high level)

- `src/app` — Next.js app entry (app router UI components).
- `src/components` — UI components used by the app.
- `public/` — static assets (logo, robots.txt).
- `examples/` — example pages/demos (optional — may be removed).

## Files that look extra / optional

These are files or folders that appear not strictly required for the app to run and are commonly safe to remove or move to an `archive/` or `examples/` directory. I list why I think they are optional and a recommended action.

- `examples/` (e.g. `examples/websocket/page.tsx`)
 	- Why: It may contain demo pages. If you don't need the examples in-tree, remove or archive them.
 	- Recommendation: Move to an `archive/` folder or delete if redundant.

- `db/custom.db` (if present)
 	- Why: A local SQLite DB file left from the previous setup. Not required for a frontend-only app.
 	- Recommendation: Delete it or archive it and add `db/*.db` to `.gitignore`.

- `components.json` (shadcn UI config)
 	- Why: Configuration artifact from the shadcn UI tool. Harmless; optional to keep.

- `node_modules/`, `package-lock.json`
	- Why: `node_modules` is generated and should not be committed. `package-lock.json` is useful for reproducible installs; keep or remove depending on package manager choice.
	- Recommendation: Keep `package-lock.json` if you use npm; ensure `node_modules/` is ignored by git.

- `README.md` (now populated)
	- Why: Was empty; updated with useful instructions and analysis.

## Suggested small housekeeping tasks

- If `db/custom.db` exists and you don't need it, delete and add `db/*.db` to `.gitignore`.
- Move `examples/` to `archive/` or delete if redundant.

## Notes about running and development

- Dev script: `npm run dev` starts the Next dev server.

## Where I looked to form this opinion

- `package.json` (scripts and deps)
- `src/app/page.tsx`, `src/components/*`, `src/lib/*`
- `examples/websocket/page.tsx`
- `src/app/page.tsx`, `src/components/*`, `src/lib/*`
- `examples/websocket/page.tsx`

---

If you want, I can:

- create a `.env.example` and wire `DATABASE_URL` to `db/custom.db` so the repo works out-of-the-box, or
- remove/move the `examples/` folder and `db/custom.db` to `archive/` and update `.gitignore` accordingly.

Tell me which of those housekeeping steps you want me to do next and I will apply them.

