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

function getInitialVariant(variants: ShopifyProductVariant[]): ShopifyProductVariant {
  return variants.find((variant) => variant.availableForSale) ?? variants[0];
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

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(183,151,79,0.18),transparent_30%),linear-gradient(180deg,#f7f2e7_0%,#f2ebdf_36%,#ece1d2_100%)] text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-10 pt-5 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-stone-900/10 py-5">
          <Link
            href="/"
            className="text-sm uppercase tracking-[0.36em] text-stone-700"
          >
            Zataus
          </Link>
          <div className="rounded-full border border-stone-900/10 bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-stone-600 shadow-sm backdrop-blur">
            Shopify Storefront
          </div>
        </header>

        <section className="grid flex-1 gap-10 py-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-start lg:py-12">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-[2rem] border border-stone-900/8 bg-white/70 shadow-[0_28px_80px_-46px_rgba(32,24,12,0.45)]">
              <div className="aspect-[4/5]">
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
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square overflow-hidden rounded-[1.25rem] border transition ${
                      index === selectedImageIndex
                        ? "border-stone-950 shadow-[0_20px_45px_-28px_rgba(32,24,12,0.5)]"
                        : "border-stone-900/10 bg-white/60 hover:border-stone-900/25"
                    }`}
                    aria-label={`View product image ${index + 1}`}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText ?? `${product.title} image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 25vw, 112px"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lg:sticky lg:top-8">
            <div className="rounded-[2rem] border border-stone-900/10 bg-white/70 p-6 shadow-[0_30px_90px_-50px_rgba(41,30,12,0.5)] backdrop-blur sm:p-8">
              <p className="text-xs uppercase tracking-[0.32em] text-stone-500">
                One-product storefront
              </p>
              <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-none text-stone-950 sm:text-5xl">
                {product.title}
              </h1>

              {selectedVariant ? (
                <div className="mt-6 flex items-end gap-3">
                  <div className="text-3xl font-medium text-stone-950">
                    {formatMoney(selectedVariant.price)}
                  </div>
                  {selectedVariant.compareAtPrice &&
                  Number(selectedVariant.compareAtPrice.amount) >
                    Number(selectedVariant.price.amount) ? (
                    <div className="pb-1 text-base text-stone-500 line-through">
                      {formatMoney(selectedVariant.compareAtPrice)}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {hasMultipleVariants ? (
                <div className="mt-8">
                  <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
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
                          className={`flex items-center justify-between rounded-[1.2rem] border px-4 py-4 text-left transition ${
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

              <div className="mt-8 space-y-4">
                <a
                  href={
                    selectedVariant
                      ? getVariantCartUrl(storeDomain, selectedVariant.id)
                      : `https://${storeDomain}`
                  }
                  className={`inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-sm font-medium uppercase tracking-[0.18em] transition ${
                    selectedVariant?.availableForSale
                      ? "bg-stone-950 text-stone-50 hover:bg-stone-800"
                      : "pointer-events-none bg-stone-300 text-stone-500"
                  }`}
                >
                  {selectedVariant?.availableForSale ? "Buy Now" : "Sold Out"}
                </a>
                <p className="text-sm leading-6 text-stone-600">
                  Checkout continues on Shopify using the selected variant.
                </p>
              </div>

              <div className="mt-8 border-t border-stone-900/10 pt-8">
                <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                  Description
                </p>
                <div className="mt-4 whitespace-pre-line text-base leading-8 text-stone-700">
                  {product.description}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
