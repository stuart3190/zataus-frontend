# Zataus Frontend

Minimal Next.js storefront starter for `zataus.com`, built for immediate Vercel deployment and ready to expand into a headless Shopify frontend.

## Stack

- Next.js with App Router
- TypeScript
- Tailwind CSS
- Clean homepage starter with brand-first styling

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
npm run start
```

## Vercel Deploy Notes

- Import the repository into Vercel.
- Framework preset should detect as `Next.js`.
- Build command: `npm run build`
- Output setting: default Next.js output
- No extra configuration is required for the current starter.

## Future Shopify Environment Variables

Create a `.env.local` file when Shopify integration is added:

```bash
NEXT_PUBLIC_SITE_URL=https://zataus.com
SHOPIFY_STORE_DOMAIN=
SHOPIFY_STOREFRONT_ACCESS_TOKEN=
SHOPIFY_STOREFRONT_API_VERSION=
```

## Project Structure

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  lib/
    shopify/
      client.ts
```

`src/lib/shopify/client.ts` is a small placeholder entry point for the Storefront API so product, collection, and cart work can be added without restructuring the app shell.
