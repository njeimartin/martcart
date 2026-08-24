# TRIGGERS NATION

Triggers Nation is a premium tactical gear and outdoor essentials storefront built with Next.js, Supabase, and secure checkout infrastructure.

## Stack

- Next.js 16 / React 19
- Supabase (`@supabase/ssr` + `supabase-js`)
- Secure checkout infrastructure
- TypeScript / ESLint

## Brand

**TRIGGERS NATION** — Built for Performance.

The storefront uses a dark tactical visual system with gold accents and focuses on tactical gear, military equipment, outdoor essentials, apparel, and accessories.

## Environment

Set the required Supabase and checkout environment variables in Vercel for Production, Preview, and Development as appropriate.

## Supabase setup

Run `supabase/schema.sql` in the Supabase SQL Editor. It creates the catalog, profiles, orders, order items, wishlists, storage bucket, indexes, and RLS policies used by the application.

## Local development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run lint
npm run build
```

The storefront homepage, catalog, product pages, cart, and checkout are retained as the commerce foundation while the customer-facing identity is now Triggers Nation.
