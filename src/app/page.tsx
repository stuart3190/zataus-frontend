import type { Metadata } from "next";
import { ProductStorefront } from "@/components/product-storefront";
import { getSiteUrl } from "@/lib/site";
import { getShopifyConfig } from "@/lib/shopify/client";
import { getFirstProductHandle, getProductByHandle } from "@/lib/shopify/products";

export const revalidate = 300;

const SEO_TITLE = "Car Air Purifier for Dust and Pollen | Zataus";
const SEO_DESCRIPTION =
  "Cabin Pollen Catcher is a portable car air purifier designed for vans, cars, and small spaces during hay fever season, helping catch dust and pollen for a fresher-feeling drive.";
const SEO_OG_DESCRIPTION =
  "Portable car air purifier for vans and cars. Designed for spring driving when dust and pollen feel heavier in enclosed spaces.";

function getFeaturedHandle(): string | null {
  const handle = process.env.SHOPIFY_FEATURED_HANDLE?.trim();

  return handle ? handle : null;
}

async function getHomepageProduct() {
  const config = getShopifyConfig();

  if (!config) {
    return {
      config: null,
      product: null,
    };
  }

  const handle = getFeaturedHandle() ?? (await getFirstProductHandle());

  if (!handle) {
    return {
      config,
      product: null,
    };
  }

  const product = await getProductByHandle(handle);

  return {
    config,
    product,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/`;
  const { product } = await getHomepageProduct();
  const imageUrl = product?.images[0]?.url;

  return {
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: SEO_TITLE,
      description: SEO_OG_DESCRIPTION,
      url: canonicalUrl,
      siteName: "Zataus",
      type: "website",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: "Cabin Pollen Catcher",
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: SEO_TITLE,
      description: SEO_OG_DESCRIPTION,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

function SetupState() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(183,151,79,0.18),transparent_30%),linear-gradient(180deg,#f7f2e7_0%,#f2ebdf_36%,#ece1d2_100%)] text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-stone-900/10 py-5">
          <div className="text-sm uppercase tracking-[0.36em] text-stone-700">
            Zataus
          </div>
          <div className="rounded-full border border-stone-900/10 bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-stone-600 shadow-sm backdrop-blur">
            Shopify Setup Required
          </div>
        </header>

        <section className="flex flex-1 items-center py-14 sm:py-20">
          <div className="w-full rounded-[2rem] border border-stone-900/10 bg-white/70 p-7 shadow-[0_30px_90px_-50px_rgba(41,30,12,0.5)] backdrop-blur sm:p-10">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-500">
              Storefront configuration
            </p>
            <h1 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-none sm:text-5xl">
              Connect Shopify to render the live Zataus product storefront.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-700">
              The frontend is ready to query Shopify, but the required Storefront
              API environment variables are not set yet for this deployment.
            </p>
            <div className="mt-8 rounded-[1.5rem] border border-stone-900/10 bg-stone-950 px-5 py-5 text-sm text-stone-100 sm:px-6">
              <code className="block whitespace-pre-wrap leading-7">
                SHOPIFY_STORE_DOMAIN{"\n"}
                SHOPIFY_STOREFRONT_API_TOKEN{"\n"}
                SHOPIFY_API_VERSION{"\n"}
                SHOPIFY_FEATURED_HANDLE{"\n"}
                NEXT_PUBLIC_SITE_URL
              </code>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function EmptyCatalogState() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(183,151,79,0.18),transparent_30%),linear-gradient(180deg,#f7f2e7_0%,#f2ebdf_36%,#ece1d2_100%)] text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-stone-900/10 py-5">
          <div className="text-sm uppercase tracking-[0.36em] text-stone-700">
            Zataus
          </div>
          <div className="rounded-full border border-stone-900/10 bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-stone-600 shadow-sm backdrop-blur">
            No Products Found
          </div>
        </header>

        <section className="flex flex-1 items-center py-14 sm:py-20">
          <div className="w-full rounded-[2rem] border border-stone-900/10 bg-white/70 p-7 shadow-[0_30px_90px_-50px_rgba(41,30,12,0.5)] backdrop-blur sm:p-10">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-500">
              Catalog status
            </p>
            <h1 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-none sm:text-5xl">
              Shopify is connected, but no product is available yet.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-700">
              The homepage resolves a featured Shopify product handle when one is
              configured, otherwise it falls back to the first available product
              automatically.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default async function Home() {
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/`;
  const { config, product } = await getHomepageProduct();

  if (!config) {
    return <SetupState />;
  }

  if (!product) {
    return <EmptyCatalogState />;
  }

  const primaryVariant =
    product.variants.find((variant) => variant.availableForSale) ?? product.variants[0];
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: SEO_DESCRIPTION,
    image: product.images[0]?.url,
    brand: {
      "@type": "Brand",
      name: "Zataus",
    },
    category: "Car air purifier",
    offers: primaryVariant
      ? {
          "@type": "Offer",
          url: canonicalUrl,
          priceCurrency: primaryVariant.price.currencyCode || "GBP",
          price: primaryVariant.price.amount,
          availability: primaryVariant.availableForSale
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <ProductStorefront product={product} storeDomain={config.storeDomain} />
    </>
  );
}
