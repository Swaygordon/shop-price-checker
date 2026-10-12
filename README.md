# PriceCheck (frontend)

Staff-facing price catalogue + owner-only admin for a grocery shop.
React + Vite + Tailwind v4 + shadcn/ui (custom Honey Bond / Bare Love theme).
**Frontend only for now**: See `DESIGN_BRIEF.md`.

```bash
npm install
npm run dev
```

- Owner login (mock): `owner@shop.local` / `demo1234`
- Force states on any page: `?preview=loading`, `?preview=empty`, `?preview=error` (dev, or `VITE_PREVIEW_TOOLS=true`).

## Backend integration (later)
The UI only imports from `src/services/index.js`. Implement the interfaces in `src/services/contract.d.ts`
inside `src/services/api/*` and `VITE_API_URL`. No page or component changes needed.

## Structure
```
src/components/ui/   shadcn primitives (themed in src/index.css)
src/components/      Navbar, ProductCard, ProductGrid, PriceEditor, ProductForm, DeleteDialog
src/pages/           Home, Login, Admin
src/services/        contract.d.ts, api/ (stubs for the backend developer)
```


