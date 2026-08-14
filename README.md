# Eudossier — EU Commerce & Inventory Portal

Vite + Express demo storefront under the **Eudossier** brand (`eudossier.eu`).

This folder is a **commerce / GDPR / inventory demo**. It is **not** the Next.js immigration consultancy app in the parent `DOCI` workspace.

## Run locally

**Prerequisites:** Node.js 20+

1. Install dependencies:

```bash
npm install
```

2. Optional — copy env and set keys:

```bash
cp .env.example .env.local
```

Set `GEMINI_API_KEY` if you use Gemini features. `APP_URL` defaults to `http://localhost:3000`.

3. Start the dev server:

```bash
npm run dev
```

Open **http://localhost:3000**.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Express + Vite middleware (port 3000) |
| `npm run build` | Production client + server bundle |
| `npm start` | Run production server (`dist/server.cjs`) |
| `npm run lint` | Typecheck (`tsc --noEmit`) |

## Brand

- **Name:** Eudossier  
- **Domain:** eudossier.eu  
- **Contact:** info@eudossier.eu  
- **Privacy:** privacy@eudossier.eu  

Identity constants live in `src/brand.ts`.
