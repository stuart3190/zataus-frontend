"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type {
  ShopifyMoney,
  ShopifyProduct,
  ShopifyProductVariant,
} from "@/lib/shopify/products";

type ProductStorefrontProps = {
  product: ShopifyProduct;
  storeDomain: string;
};

type DetailItem = {
  title: string;
  description: string;
};

const benefitItems: DetailItem[] = [
  {
    title: "Premium everyday finish",
    description: "Clean design and durable quality meant to feel elevated from day one.",
  },
  {
    title: "Focused one-product experience",
    description: "Every section is built to make the product easier to understand and easier to buy.",
  },
  {
    title: "Fast Shopify checkout",
    description: "Buy Now hands off directly to Shopify with the selected variant already applied.",
  },
];

const reassuranceItems: DetailItem[] = [
  {
    title: "Secure checkout",
    description: "Payment and order handling continue on Shopify's hosted checkout flow.",
  },
  {
    title: "Clear variant selection",
    description: "You choose the exact version before leaving the page, with pricing shown upfront.",
  },
  {
    title: "Mobile-first browsing",
    description: "The gallery, content stack, and CTA are tuned to stay easy to scan on smaller screens.",
  },
];

const faqItems: DetailItem[] = [
  {
    title: "How does Buy Now work?",
    description:
      "When you tap Buy Now, the selected variant is sent directly into Shopify cart so checkout begins with the correct item already loaded.",
  },
  {
    title: "Can I choose a different variant first?",
    description:
      "Yes. If the product has multiple variants, you can switch between them on this page before going to checkout.",
  },
  {
    title: "Is this the final checkout page?",
    description:
      "No. This storefront handles presentation and product selection, then hands the purchase off to Shopify for the final cart and checkout steps.",
  },
];

function formatMoney(money: ShopifyMoney): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(Number(money.amount));
}

function getVariantCartUrl(storeDomain: string, variantId: string): string {
  const numericVariantId = variantId.split("/").pop();

  if (!numericVariantId) {
    return `https://${storeDomain}`;
  }

  return `https://${storeDomain}/cart/${numericVariantId}:1`;
}

function getInitialVariant(
  variants: ShopifyProductVariant[],
): ShopifyProductVariant | undefined {
  return variants.find((variant) => variant.availableForSale) ?? variants[0];
}

function getShortDescription(description: string): string {
  const firstLine = description
    .split(/\n+/)
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine) {
    return "A premium one-product storefront built around a cleaner path to purchase.";
  }

  return firstLine;
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-[11px] uppercase tracking-[0.32em] text-stone-500">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-tight text-stone-950 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-stone-700">{description}</p>
      ) : null}
    </div>
  );
}

export function ProductStorefront({
  product,
  storeDomain,
}: ProductStorefrontProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(
    getInitialVariant(product.variants)?.id ?? "",
  );

  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ??
    getInitialVariant(product.variants);
  const selectedImage = product.images[selectedImageIndex] ?? product.images[0];
  const hasMultipleVariants =
    product.variants.length > 1 ||
    product.variants[0]?.title.toLowerCase() !== "default title";
  const compareAtPrice =
    selectedVariant?.compareAtPrice &&
    Number(selectedVariant.compareAtPrice.amount) >
      Number(selectedVariant.price.amount)
      ? selectedVariant.compareAtPrice
      : null;
  const productSummary = getShortDescription(product.description);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(183,151,79,0.2),transparent_28%),linear-gradient(180deg,#f8f3ea_0%,#f2eadf_32%,#ece2d4_100%)] text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-14 pt-4 sm:px-6 sm:pb-16 lg:px-10">
        <header className="flex items-center justify-between border-b border-stone-900/10 py-5">
          <Link
            href="/"
            className="text-sm uppercase tracking-[0.36em] text-stone-700"
          >
            Zataus
          </Link>
          <div className="rounded-full border border-stone-900/10 bg-white/75 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-stone-600 shadow-sm backdrop-blur">
            Shopify Storefront
          </div>
        </header>

        <section className="grid gap-8 py-8 sm:gap-10 sm:py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-start lg:gap-12 lg:py-14">
          <div className="order-2 lg:order-1">
            <div className="grid gap-3 sm:gap-4 lg:sticky lg:top-8">
              <div className="relative overflow-hidden rounded-[2rem] border border-stone-900/8 bg-white/75 shadow-[0_28px_80px_-46px_rgba(32,24,12,0.45)]">
                <div className="aspect-[4/4.85] sm:aspect-[4/4.7]">
                  {selectedImage ? (
                    <Image
                      src={selectedImage.url}
                      alt={selectedImage.altText ?? product.title}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 52vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-stone-100 text-sm uppercase tracking-[0.24em] text-stone-500">
                      No product image
                    </div>
                  )}
                </div>
              </div>

              {product.images.length > 1 ? (
                <div className="flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible md:grid-cols-5">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative h-24 min-w-[5.5rem] overflow-hidden rounded-[1.15rem] border transition sm:h-auto sm:min-w-0 sm:aspect-square ${
                        index === selectedImageIndex
                          ? "border-stone-950 shadow-[0_20px_45px_-28px_rgba(32,24,12,0.5)]"
                          : "border-stone-900/10 bg-white/65 hover:border-stone-900/25"
                      }`}
                      aria-label={`View product image ${index + 1}`}
                    >
                      <Image
                        src={image.url}
                        alt={image.altText ?? `${product.title} image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 88px, 112px"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:sticky lg:top-8">
            <div className="rounded-[2rem] border border-stone-900/10 bg-white/75 p-6 shadow-[0_30px_90px_-50px_rgba(41,30,12,0.5)] backdrop-blur sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-stone-900/10 bg-stone-50 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-stone-600">
                  One-product focus
                </span>
                <span className="text-xs uppercase tracking-[0.24em] text-stone-500">
                  Premium storefront
                </span>
              </div>

              <h1 className="mt-5 font-[family-name:var(--font-display)] text-4xl leading-none text-stone-950 sm:text-5xl lg:text-[3.6rem]">
                {product.title}
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-stone-700 sm:text-lg sm:leading-8">
                {productSummary}
              </p>

              <div className="mt-6 grid gap-3 border-y border-stone-900/8 py-5 sm:grid-cols-3">
                {benefitItems.map((item) => (
                  <div key={item.title} className="rounded-[1.25rem] bg-stone-50/80 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-900/10 bg-white text-sm text-stone-700">
                        +
                      </span>
                      <p className="text-sm font-medium text-stone-900">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>

              {selectedVariant ? (
                <div className="mt-6 flex items-end gap-3">
                  <div className="text-3xl font-medium tracking-[-0.03em] text-stone-950 sm:text-4xl">
                    {formatMoney(selectedVariant.price)}
                  </div>
                  {compareAtPrice ? (
                    <div className="pb-1 text-base text-stone-500 line-through">
                      {formatMoney(compareAtPrice)}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {hasMultipleVariants ? (
                <div className="mt-7">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
                    Select variant
                  </p>
                  <div className="mt-3 grid gap-3">
                    {product.variants.map((variant) => {
                      const active = variant.id === selectedVariant?.id;

                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`flex items-center justify-between rounded-[1.15rem] border px-4 py-4 text-left transition ${
                            active
                              ? "border-stone-950 bg-stone-950 text-stone-50"
                              : "border-stone-900/10 bg-stone-50/80 hover:border-stone-900/25"
                          }`}
                        >
                          <span className="text-sm font-medium">{variant.title}</span>
                          <span className="text-sm opacity-80">
                            {variant.availableForSale
                              ? formatMoney(variant.price)
                              : "Sold out"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div className="mt-7 space-y-3">
                <a
                  href={
                    selectedVariant
                      ? getVariantCartUrl(storeDomain, selectedVariant.id)
                      : `https://${storeDomain}`
                  }
                  className={`inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-sm font-medium uppercase tracking-[0.22em] shadow-[0_24px_45px_-24px_rgba(20,15,9,0.55)] transition ${
                    selectedVariant?.availableForSale
                      ? "bg-stone-950 text-stone-50 hover:bg-stone-800"
                      : "pointer-events-none bg-stone-300 text-stone-500"
                  }`}
                >
                  {selectedVariant?.availableForSale ? "Buy Now" : "Sold Out"}
                </a>
                <p className="text-sm leading-6 text-stone-600">
                  Secure checkout continues on Shopify with your selected variant.
                </p>
              </div>

              <div className="mt-7 grid gap-3 text-sm text-stone-600 sm:grid-cols-3">
                {reassuranceItems.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[1.25rem] border border-stone-900/8 bg-white/70 px-4 py-4"
                  >
                    <p className="font-medium text-stone-900">{item.title}</p>
                    <p className="mt-2 leading-6">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 border-t border-stone-900/10 py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
          <SectionHeading
            eyebrow="Why it converts"
            title="A tighter story around a single product."
            description="The page keeps the focus on one buying decision: what the product is, why it matters, and how quickly the customer can act."
          />
          <div className="grid gap-4">
            {benefitItems.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-stone-900/8 bg-white/70 px-5 py-5 shadow-[0_24px_50px_-38px_rgba(32,24,12,0.35)]"
              >
                <p className="text-base font-medium text-stone-950">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-stone-700">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 border-t border-stone-900/10 py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
          <SectionHeading
            eyebrow="Description"
            title="Product details, kept clear."
            description="Everything below stays tied to the Shopify product content so the storefront remains live-data driven."
          />
          <div className="rounded-[1.75rem] border border-stone-900/8 bg-white/70 px-6 py-6 shadow-[0_24px_50px_-38px_rgba(32,24,12,0.35)]">
            <div className="whitespace-pre-line text-base leading-8 text-stone-700">
              {product.description}
            </div>
          </div>
        </section>

        <section className="grid gap-6 border-t border-stone-900/10 py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
          <SectionHeading
            eyebrow="Trust"
            title="Reassurance without clutter."
            description="The page stays premium and minimal, but still answers the practical concerns that affect conversion."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {reassuranceItems.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-stone-900/8 bg-white/70 px-5 py-5 shadow-[0_24px_50px_-38px_rgba(32,24,12,0.35)]"
              >
                <p className="text-base font-medium text-stone-950">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-stone-700">
                  {item.description}
                </p>
              </div>
            ))}
            <div className="rounded-[1.5rem] border border-stone-900/8 bg-stone-950 px-5 py-5 text-stone-100 shadow-[0_24px_50px_-38px_rgba(32,24,12,0.45)]">
              <p className="text-base font-medium">Ready when the customer is.</p>
              <p className="mt-2 text-sm leading-7 text-stone-300">
                The CTA remains close to pricing, variants, and imagery so the path from interest to checkout stays direct.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 border-t border-stone-900/10 py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
          <SectionHeading
            eyebrow="FAQ"
            title="Answers that remove hesitation."
            description="A short FAQ closes the common gaps without turning the page into a template-heavy sales funnel."
          />
          <div className="space-y-3">
            {faqItems.map((item) => (
              <details
                key={item.title}
                className="group rounded-[1.5rem] border border-stone-900/8 bg-white/70 px-5 py-5 shadow-[0_24px_50px_-38px_rgba(32,24,12,0.35)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-stone-950">
                  {item.title}
                  <span className="text-stone-400 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-6 text-sm leading-7 text-stone-700">
                  {item.description}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
