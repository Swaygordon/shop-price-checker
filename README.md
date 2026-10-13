# PriceCheck (frontend)

Staff-facing price catalogue + owner-only admin for a grocery shop.
React + Vite + Tailwind v4 + shadcn/ui (custom Honey Bond / Bare Love theme), backed by Supabase.

## Setup

```bash
npm install
cp .env.example .env   # then fill in your Supabase values
npm run dev
```

`.env`:
```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

The backend is a Supabase project with (already set up):
- a `products` table (`id`, `name`, `size`, `unit`, `price`, `image_url`, `created_at`, `updated_at`) — public read, authenticated writes via RLS;
- a `product-images` storage bucket (public read, authenticated write);
- one owner user in Supabase Auth (email + password; sign-ups disabled).

Owner login = that Supabase Auth user's email and password on `/login`.

Lint: `npm run lint` (oxlint).

## Structure
```
src/components/ui/   shadcn primitives (themed in src/index.css)
src/components/      Navbar, ProductCard, ProductGrid, PriceEditor, ProductForm, DeleteDialog
src/pages/           Home, Login, Admin
src/services/        contract.d.ts (the integration contract), api/ (Supabase impl), supabase/ (client + error mapping)
```
Components only import from `src/services/index.js` — never a backend SDK directly.
