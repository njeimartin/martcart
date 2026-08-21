# MARTCART

MARTCART is a Next.js 16 marketplace with Supabase authentication/data and Stripe Checkout.

## Stack

- Next.js 16 / React 19
- Supabase (`@supabase/ssr` + `supabase-js`)
- Stripe Checkout + webhooks
- TypeScript / ESLint

## Environment

Set these in Vercel for Production, Preview, and Development as appropriate:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `STRIPE_SECRET_KEY` (server-only)
- `STRIPE_WEBHOOK_SECRET` (server-only)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

`NEXT_PUBLIC_SUPABASE_ANON_KEY` is supported as a legacy fallback but should not be required for new deployments.

## Supabase setup

Run `supabase/schema.sql` in the Supabase SQL Editor. It creates the catalog, profiles, orders, order items, wishlists, storage bucket, indexes, and RLS policies used by the application.

After creating an admin account, set its profile role to `admin` in `public.profiles` before using `/admin`.

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

The GitHub Actions workflow runs both checks on pushes and pull requests to `main`.
