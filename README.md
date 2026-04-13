# Zataus Frontend

Next.js App Router storefront for `zataus.com`, configured for Vercel and wired for a premium one-product Shopify Storefront API experience.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Shopify Storefront API

## Install

```bash
npm install
```

## Run Locally

Create a `.env.local` file in the project root:

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_API_TOKEN=your-storefront-token
SHOPIFY_API_VERSION=2025-01
SHOPIFY_FEATURED_HANDLE=your-featured-product-handle
NEXT_PUBLIC_SITE_URL=https://zataus.com
```

Then start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run lint
npm run build
npm run start
```

## Shopify Integration

- The homepage loads `SHOPIFY_FEATURED_HANDLE` when it is set, and otherwise falls back to the first available Shopify product handle.
- A dedicated handle route is also available at `/products/[handle]`.
- Product data is fetched server-side through reusable Shopify utilities in `src/lib/shopify/`.
- The Buy Now button sends the selected variant to Shopify cart using the store domain from environment configuration.

## Required Environment Variables

- `SHOPIFY_STORE_DOMAIN`
  Shopify store domain, usually `your-store.myshopify.com`.
- `SHOPIFY_STOREFRONT_API_TOKEN`
  Storefront API access token used by the Next.js server to call Shopify.
- `SHOPIFY_API_VERSION`
  Storefront API version, for example `2025-01`.
- `SHOPIFY_FEATURED_HANDLE`
  Optional Shopify product handle to force as the homepage product. If omitted, the homepage falls back to the first available product automatically.
- `NEXT_PUBLIC_SITE_URL`
  Public site URL used for metadata and canonical base URL generation.

## Vercel Deploy Notes

- Import the repository into Vercel.
- Framework preset should remain `Next.js`.
- Build command: `npm run build`
- Output setting: default Next.js output
- Add the environment variables above in the Vercel project settings.

## Project Structure

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
    products/[handle]/page.tsx
  components/
    product-storefront.tsx
  lib/
    site.ts
    shopify/
      client.ts
      products.ts
```
